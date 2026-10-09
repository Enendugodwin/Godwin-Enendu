"use client";

import { useEffect, useState } from "react";
import BlurFade from "@/components/magicui/blur-fade";
import { ProjectCard } from "@/components/project-card";
import { Github, RefreshCw, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import staticData from "@/data/projects.generated.json";

const BLUR_FADE_DELAY = 0.04;

interface GitHubRepo {
  name: string;
  description: string | null;
  url: string;
  homepageUrl: string | null;
  updatedAt: string;
  stargazerCount?: number;
  forkCount?: number;
  primaryLanguage: { name: string; color: string } | null;
  repositoryTopics?: { nodes: { topic: { name: string } }[] };
  isArchived?: boolean;
}

interface ProjectsResponse {
  source: "github" | "cache" | "fallback";
  syncedAt: string;
  projects: GitHubRepo[];
}

interface ProjectCardData {
  title: string;
  href: string;
  description: string;
  dates: string;
  tags: string[];
  stars?: number;
  forks?: number;
  links: { type: string; href: string; icon: React.ReactNode }[];
  image: string;
  video: string;
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

function mapToProjectCard(repo: GitHubRepo): ProjectCardData {
  return {
    title: repo.name,
    href: repo.url,
    description: repo.description || "No description provided.",
    dates: `Updated ${formatDate(repo.updatedAt)}`,
    stars: repo.stargazerCount,
    forks: repo.forkCount,
    tags: [
      repo.primaryLanguage?.name || "Unknown",
      ...(repo.repositoryTopics?.nodes?.slice(0, 4).map((n) => n.topic.name) || []),
    ],
    links: [
      { type: "Source", href: repo.url, icon: <Github className="size-3" /> },
      ...(repo.homepageUrl
        ? [
            {
              type: "Demo",
              href: repo.homepageUrl,
              icon: <ExternalLink className="size-3" />,
            },
          ]
        : []),
    ],
    image: "",
    video: "",
  };
}

// Build-time data (generated) is the initial/fallback source, so the section
// renders even on static hosting (GitHub Pages) with no API.
const initialData = staticData as unknown as ProjectsResponse;

export default function ProjectsSection() {
  const [data, setData] = useState<ProjectsResponse>(initialData);
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/projects", {
        headers: { Accept: "application/json" },
        cache: "no-store",
      });
      // No API on static hosting — keep the build-time data.
      if (!response.ok) return;
      const fresh: ProjectsResponse = await response.json();
      if (fresh?.projects?.length) setData(fresh);
    } catch {
      // Keep the build-time data.
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const projects = data.projects.map(mapToProjectCard);

  return (
    <div className="flex min-h-0 flex-col gap-y-8">
      <div className="flex items-center w-full">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent from-5% via-border via-95% to-transparent" />
        <div className="border bg-primary z-10 rounded-xl px-4 py-1">
          <span className="text-primary-foreground text-sm font-medium">Projects</span>
        </div>
        <div className="flex-1 h-px bg-gradient-to-l from-transparent from-5% via-border via-95% to-transparent" />
      </div>
      <div className="flex flex-col gap-y-3 items-center justify-center text-center">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
          Pinned GitHub Repositories
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base max-w-2xl">
          A selection of my pinned GitHub repositories, in pinned order.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 mb-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className={`w-2 h-2 rounded-full ${
              data.source === "github" ? "bg-emerald-500" : data.source === "cache" ? "bg-amber-500" : "bg-slate-500"
            }`} />
            <span>Synced from GitHub</span>
          </span>
          {data.syncedAt && <span>• Last sync: {formatDate(data.syncedAt)}</span>}
        </div>
        <Button variant="outline" size="sm" onClick={refresh} disabled={loading} className="gap-1">
          {loading ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
          Refresh
        </Button>
        <a
          href="https://github.com/enendugodwin?tab=repositories"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-muted transition-colors"
        >
          <Github className="size-4" />
          View all on GitHub
        </a>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, id) => (
          <BlurFade key={project.href} delay={BLUR_FADE_DELAY * 12 + id * 0.05} className="h-full">
            <ProjectCard
              href={project.href}
              title={project.title}
              description={project.description}
              dates={project.dates}
              tags={project.tags}
              stars={project.stars}
              forks={project.forks}
              image={project.image}
              video={project.video}
              links={project.links}
            />
          </BlurFade>
        ))}
      </div>
    </div>
  );
}
