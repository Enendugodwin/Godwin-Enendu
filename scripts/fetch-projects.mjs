// Fetches Godwin's pinned GitHub repositories at build time and writes a static
// JSON file consumed by the Projects section. Run automatically before `next build`.
//
// Uses GITHUB_TOKEN from the environment. If unset or the request fails, writes a
// safe fallback so the build never breaks.

import { writeFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, "../src/data/projects.generated.json");

const LOGIN = "enendugodwin";

const QUERY = `
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
            primaryLanguage { name color }
            repositoryTopics(first: 8) { nodes { topic { name } } }
            openGraphImageUrl
            isArchived
          }
        }
      }
    }
  }
`;

const FALLBACK = {
  source: "fallback",
  syncedAt: new Date().toISOString(),
  projects: [
    {
      name: "Bug-Bounty---Kali-Linux-VM",
      description:
        "AI-native, scope-enforced security-assessment framework for Kali Linux (MCP server + CLI + web GUI)",
      url: "https://github.com/enendugodwin/Bug-Bounty---Kali-Linux-VM",
      homepageUrl: null,
      updatedAt: "2026-10-04T12:00:00Z",
      stargazerCount: 0,
      forkCount: 0,
      primaryLanguage: { name: "Python", color: "#3572A5" },
      repositoryTopics: { nodes: [{ topic: { name: "security" } }] },
      isArchived: false,
    },
  ],
};

async function main() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    console.warn("[fetch-projects] No GITHUB_TOKEN set — writing fallback data.");
    writeFileSync(OUT, JSON.stringify(FALLBACK, null, 2));
    return;
  }

  try {
    const res = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "User-Agent": "godwin-portfolio-build",
        Accept: "application/vnd.github.v4+json",
      },
      body: JSON.stringify({ query: QUERY, variables: { login: LOGIN } }),
    });

    if (!res.ok) throw new Error(`GitHub API ${res.status}`);
    const json = await res.json();
    if (json.errors) throw new Error(json.errors.map((e) => e.message).join(", "));

    const nodes = json.data?.user?.pinnedItems?.nodes ?? [];
    const projects = nodes.filter((n) => n.__typename === "Repository");

    const out = { source: "github", syncedAt: new Date().toISOString(), projects };
    writeFileSync(OUT, JSON.stringify(out, null, 2));
    console.log(`[fetch-projects] Wrote ${projects.length} pinned repos.`);
  } catch (err) {
    console.warn(`[fetch-projects] Failed (${err.message}) — writing fallback.`);
    writeFileSync(OUT, JSON.stringify(FALLBACK, null, 2));
  }
}

main();
