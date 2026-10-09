import BlurFade from "@/components/magicui/blur-fade";
import { ProjectCard } from "@/components/project-card";
import { Github } from "lucide-react";
import data from "@/data/projects.generated.json";

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

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

function mapToProjectCard(repo: GitHubRepo) {
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
              icon: (
                <svg className="size-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              ),
            },
          ]
        : []),
    ],
    image: "",
    video: "",
  };
}

export default function ProjectsSection() {
  const projects = (data.projects as GitHubRepo[]).map(mapToProjectCard);
  const syncedAt = data.syncedAt;

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
            <span className={`w-2 h-2 rounded-full ${data.source === "github" ? "bg-emerald-500" : "bg-slate-500"}`} />
            <span>Synced from GitHub</span>
          </span>
          {syncedAt && <span>• Last sync: {formatDate(syncedAt)}</span>}
        </div>
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
          <BlurFade key={project.title} delay={BLUR_FADE_DELAY * 12 + id * 0.05} className="h-full">
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
