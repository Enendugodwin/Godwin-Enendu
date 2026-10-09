import { NextResponse } from "next/server";

interface GitHubPinnedItem {
  __typename: string;
  name: string;
  description: string | null;
  url: string;
  homepageUrl: string | null;
  updatedAt: string;
  stargazerCount: number;
  forkCount: number;
  primaryLanguage: {
    name: string;
    color: string;
  } | null;
  repositoryTopics: {
    nodes: Array<{
      topic: {
        name: string;
      };
    }>;
  };
  openGraphImageUrl: string | null;
  isArchived: boolean;
}

interface GitHubResponse {
  data?: {
    user?: {
      pinnedItems: {
        nodes: GitHubPinnedItem[];
      };
    };
  };
  errors?: Array<{ message: string }>;
}

interface CachedResponse {
  source: "github" | "cache" | "fallback";
  syncedAt: string;
  projects: GitHubPinnedItem[];
}

const FALLBACK_PROJECTS: GitHubPinnedItem[] = [
  {
    __typename: "Repository",
    name: "Bug-Bounty---Kali-Linux-VM",
    description: "AI-native, scope-enforced security-assessment framework for Kali Linux (MCP server + CLI + web GUI)",
    url: "https://github.com/enendugodwin/Bug-Bounty---Kali-Linux-VM",
    homepageUrl: null,
    updatedAt: "2026-10-04T12:00:00Z",
    stargazerCount: 0,
    forkCount: 0,
    primaryLanguage: { name: "Python", color: "#3572A5" },
    repositoryTopics: { nodes: [{ topic: { name: "security" } }, { topic: { name: "kali" } }, { topic: { name: "mcp" } }] },
    openGraphImageUrl: null,
    isArchived: false,
  },
  {
    __typename: "Repository",
    name: "Threat-Intelligence-Platform",
    description: "Threat intelligence collection and analysis platform with automated enrichment",
    url: "https://github.com/enendugodwin/Threat-Intelligence-Platform",
    homepageUrl: null,
    updatedAt: "2026-09-15T12:00:00Z",
    stargazerCount: 0,
    forkCount: 0,
    primaryLanguage: { name: "TypeScript", color: "#3178C6" },
    repositoryTopics: { nodes: [{ topic: { name: "threat-intel" } }, { topic: { name: "automation" } }] },
    openGraphImageUrl: null,
    isArchived: false,
  },
  {
    __typename: "Repository",
    name: "Imperva-DAM-User-rights-scan-interpreter",
    description: "Parser and analyzer for Imperva Database Activity Monitoring user rights scan output",
    url: "https://github.com/enendugodwin/Imperva-DAM-User-rights-scan-interpreter",
    homepageUrl: null,
    updatedAt: "2026-08-20T12:00:00Z",
    stargazerCount: 0,
    forkCount: 0,
    primaryLanguage: { name: "Python", color: "#3572A5" },
    repositoryTopics: { nodes: [{ topic: { name: "imperva" } }, { topic: { name: "dam" } }, { topic: { name: "parser" } }] },
    openGraphImageUrl: null,
    isArchived: false,
  },
];

const GRAPHQL_QUERY = `
  query GetPinnedRepos($login: String!) {
    user(login: $login) {
      pinnedItems(first: 12, types: [REPOSITORY]) {
        nodes {
          __typename
          ... on Repository {
            name
            description
            url
            homepageUrl
            updatedAt
            stargazerCount
            forkCount
            primaryLanguage {
              name
              color
            }
            repositoryTopics(first: 8) {
              nodes {
                topic {
                  name
                }
              }
            }
            openGraphImageUrl
            isArchived
          }
        }
      }
    }
  }
`;

const CACHE_TTL = 15 * 60; // 15 minutes
const CACHE_KEY = "pinned_projects";

let memoryCache: CachedResponse | null = null;
let cacheExpiry = 0;

async function fetchFromGitHub(token: string): Promise<GitHubPinnedItem[]> {
  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "godwin-portfolio",
      Accept: "application/vnd.github.v4+json",
    },
    body: JSON.stringify({
      query: GRAPHQL_QUERY,
      variables: { login: "enendugodwin" },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`GitHub API error: ${response.status} ${errorText}`);
  }

  const data: GitHubResponse = await response.json();

  if (data.errors) {
    throw new Error(`GraphQL errors: ${data.errors.map((e) => e.message).join(", ")}`);
  }

  const nodes = data.data?.user?.pinnedItems?.nodes || [];
  return nodes.filter((node): node is GitHubPinnedItem => node.__typename === "Repository");
}

function getCachedResponse(): CachedResponse | null {
  if (memoryCache && Date.now() < cacheExpiry) {
    return { ...memoryCache, source: "cache" };
  }
  return null;
}

function setCachedResponse(response: CachedResponse): void {
  memoryCache = response;
  cacheExpiry = Date.now() + CACHE_TTL * 1000;
}

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Cache-Control": "public, max-age=600, stale-while-revalidate=300",
};

export async function GET() {
  try {
    const cached = getCachedResponse();
    const githubToken = process.env.GITHUB_TOKEN;

    if (!githubToken) {
      console.warn("GITHUB_TOKEN not configured, serving cached/fallback data");
      const body = cached
        ? { ...cached, source: "cache" }
        : {
            source: "fallback",
            syncedAt: new Date().toISOString(),
            projects: FALLBACK_PROJECTS,
          };
      return NextResponse.json(body, { headers: CORS_HEADERS });
    }

    try {
      const projects = await fetchFromGitHub(githubToken);
      const freshResponse: CachedResponse = {
        source: "github",
        syncedAt: new Date().toISOString(),
        projects,
      };
      setCachedResponse(freshResponse);
      return NextResponse.json(freshResponse, { headers: CORS_HEADERS });
    } catch (githubError) {
      console.error("GitHub fetch failed:", githubError);
      const body = cached
        ? { ...cached, source: "cache" }
        : {
            source: "fallback",
            syncedAt: new Date().toISOString(),
            projects: FALLBACK_PROJECTS,
          };
      return NextResponse.json(body, { headers: CORS_HEADERS });
    }
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { headers: CORS_HEADERS });
}