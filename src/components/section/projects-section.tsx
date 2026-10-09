"use client";

import { useEffect, useState } from "react";
import BlurFade from "@/components/magicui/blur-fade";
import { ProjectCard } from "@/components/project-card";
import { DATA } from "@/data/resume";
import { Github, RefreshCw, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const BLUR_FADE_DELAY = 0.04;

interface GitHubStar {
  name: string;
  description: string | null;
  url: string;
  homepageUrl: string | null;
  updatedAt: string;
  stargazerCount: number;
  forkCount: number;
  primaryLanguage: { name: string; color: string } | null;
  repositoryTopics: { nodes: { topic: { name: string } }[] };
  isArchived: boolean;
}

interface ProjectsResponse {
  source: "github" | "cache" | "fallback";
  syncedAt: string;
  projects: GitHubStar[];
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

function mapToProjectCard(repo: GitHubStar): ProjectCardData {
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
      {
        type: "Source",
        href: repo.url,
        icon: <Github className="size-3" />,
      },
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

function mapFallbackProject(p: { title: string; href: string; description: string; dates: string; technologies: readonly string[]; links: readonly { type: string; href: string; icon: React.ReactNode }[]; image: string; video: string }): ProjectCardData {
  return {
    title: p.title,
    href: p.href,
    description: p.description,
    dates: p.dates,
    tags: [...p.technologies] as string[],
    links: p.links.map((l) => ({
      type: l.type,
      href: l.href,
      icon: l.icon,
    })),
    image: p.image,
    video: p.video,
  };
}

export default function ProjectsSection() {
  const [projects, setProjects] = useState<ProjectCardData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [source, setSource] = useState<ProjectsResponse["source"]>("fallback");
  const [syncedAt, setSyncedAt] = useState<string | null>(null);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/projects", {
        headers: { Accept: "application/json" },
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ProjectsResponse = await response.json();
      setSource(data.source);
      setSyncedAt(data.syncedAt);
      setProjects(data.projects.map(mapToProjectCard));
    } catch (err) {
      console.error("Failed to fetch projects:", err);
      setError("Failed to load starred repos from GitHub. Showing fallback data.");
      setSource("fallback");
      setProjects(DATA.projects.map(mapFallbackProject));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

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
          Automatically synced from my GitHub pinned repositories, in pinned order.
          Updates within 15 minutes, no redeploy needed.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 mb-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className={`w-2 h-2 rounded-full ${
              source === "github" ? "bg-emerald-500" : source === "cache" ? "bg-amber-500" : "bg-slate-500"
            }`} />
            <span>Source: {source === "github" ? "GitHub API" : source === "cache" ? "Cached" : "Fallback"}</span>
          </span>
          {syncedAt && <span>• Last sync: {formatDate(syncedAt)}</span>}
        </div>
        <Button variant="outline" size="sm" onClick={fetchProjects} disabled={loading} className="gap-1">
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

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-lg text-sm text-center">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <BlurFade key={i} delay={BLUR_FADE_DELAY * 12 + i * 0.05} className="h-full">
              <div className="border border-border rounded-xl overflow-hidden h-full animate-pulse bg-card flex flex-col">
                <div className="p-6 space-y-3 flex-1 flex flex-col">
                  <div className="h-5 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-1/2" />
                  <div className="h-4 bg-muted rounded w-full" />
                  <div className="h-4 bg-muted rounded w-2/3" />
                  <div className="flex gap-2 mt-auto pt-3">
                    <div className="h-6 bg-muted rounded-full w-20" />
                    <div className="h-6 bg-muted rounded-full w-20" />
                  </div>
                </div>
              </div>
            </BlurFade>
          ))}
        </div>
      ) : (
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
      )}
    </div>
  );
}