interface Env {
  GITHUB_TOKEN: string;
  CACHE_KV: KVNamespace;
  ALLOWED_ORIGIN: string;
}

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

async function fetchFromGitHub(token: string): Promise<GitHubPinnedItem[]> {
  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "User-Agent": "godwin-portfolio-worker",
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

async function getCachedResponse(kv: KVNamespace): Promise<CachedResponse | null> {
  const cached = await kv.get(CACHE_KEY, { type: "json" }) as CachedResponse | null;
  return cached;
}

async function setCachedResponse(kv: KVNamespace, response: CachedResponse): Promise<void> {
  await kv.put(CACHE_KEY, JSON.stringify(response), { expirationTtl: CACHE_TTL });
}

function createResponse(data: CachedResponse, origin: string): Response {
  return new Response(JSON.stringify(data), {
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Cache-Control": "public, max-age=600, stale-while-revalidate=300",
    },
  });
}

function createErrorResponse(message: string, status: number, origin: string): Response {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin") || "*";
    const allowedOrigin = env.ALLOWED_ORIGIN || "*";

    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": allowedOrigin === "*" ? origin : allowedOrigin,
          "Access-Control-Allow-Methods": "GET, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Max-Age": "86400",
        },
      });
    }

    if (request.method !== "GET") {
      return createErrorResponse("Method not allowed", 405, allowedOrigin === "*" ? origin : allowedOrigin);
    }

    if (url.pathname !== "/api/projects") {
      return createErrorResponse("Not found", 404, allowedOrigin === "*" ? origin : allowedOrigin);
    }

    if (allowedOrigin !== "*" && origin !== allowedOrigin) {
      return createErrorResponse("Forbidden", 403, allowedOrigin);
    }

    try {
      const cached = await getCachedResponse(env.CACHE_KV);

      if (!env.GITHUB_TOKEN) {
        console.warn("GITHUB_TOKEN not configured, serving cached/fallback data");
        if (cached) {
          return createResponse({ ...cached, source: "cache" }, allowedOrigin === "*" ? origin : allowedOrigin);
        }
        return createResponse(
          { source: "fallback", syncedAt: new Date().toISOString(), projects: FALLBACK_PROJECTS },
          allowedOrigin === "*" ? origin : allowedOrigin
        );
      }

      try {
        const projects = await fetchFromGitHub(env.GITHUB_TOKEN);
        const freshResponse: CachedResponse = {
          source: "github",
          syncedAt: new Date().toISOString(),
          projects,
        };
        ctx.waitUntil(setCachedResponse(env.CACHE_KV, freshResponse));
        return createResponse(freshResponse, allowedOrigin === "*" ? origin : allowedOrigin);
      } catch (githubError) {
        console.error("GitHub fetch failed:", githubError);
        if (cached) {
          return createResponse({ ...cached, source: "cache" }, allowedOrigin === "*" ? origin : allowedOrigin);
        }
        return createResponse(
          { source: "fallback", syncedAt: new Date().toISOString(), projects: FALLBACK_PROJECTS },
          allowedOrigin === "*" ? origin : allowedOrigin
        );
      }
    } catch (error) {
      console.error("Worker error:", error);
      return createErrorResponse("Internal server error", 500, allowedOrigin === "*" ? origin : allowedOrigin);
    }
  },
} satisfies ExportedHandler<Env>;