/* eslint-disable @next/next/no-img-element */
"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ArrowUpRight, Star, GitFork } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import Markdown from "react-markdown";

function ProjectImage({ src, alt }: { src: string; alt: string }) {
  const [imageError, setImageError] = useState(false);

  if (!src || imageError) {
    return null;
  }

  return (
    <img
      src={src}
      alt={alt}
      className="w-full h-48 object-cover"
      onError={() => setImageError(true)}
    />
  );
}

interface Props {
  title: string;
  owner?: string;
  href?: string;
  description: string;
  dates: string;
  tags: readonly string[];
  link?: string;
  image?: string;
  video?: string;
  stars?: number;
  forks?: number;
  links?: readonly {
    icon: React.ReactNode;
    type: string;
    href: string;
  }[];
  className?: string;
}

export function ProjectCard({
  title,
  owner,
  href,
  description,
  dates,
  tags,
  image,
  video,
  stars,
  forks,
  links,
  className,
}: Props) {
  const hasMedia = Boolean(video || image);

  return (
    <div
      className={cn(
        "flex flex-col h-full border border-border rounded-xl overflow-hidden hover:ring-2 hover:ring-primary/30 hover:border-primary/40 transition-all duration-200 bg-card",
        className
      )}
    >
      {hasMedia && (
        <div className="relative shrink-0">
          <Link href={href || "#"} target="_blank" rel="noopener noreferrer" className="block">
            {video ? (
              <video
                src={video}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-48 object-cover"
              />
            ) : (
              <ProjectImage src={image!} alt={title} />
            )}
          </Link>
        </div>
      )}
      <div className="p-5 sm:p-6 flex flex-col gap-3 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="flex flex-col gap-1 min-w-0">
            {owner && (
              <span className="text-xs text-muted-foreground truncate">{owner} /</span>
            )}
            <h3 className="font-semibold text-base sm:text-lg break-words">{title}</h3>
            <time className="text-xs text-muted-foreground">{dates}</time>
          </div>
          <Link
            href={href || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-sm flex-none"
            aria-label={`Open ${owner ? owner + "/" : ""}${title}`}
          >
            <ArrowUpRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
        <div className="text-sm flex-1 text-muted-foreground leading-relaxed line-clamp-4">
          <Markdown>{description}</Markdown>
        </div>
        {((stars ?? 0) > 0 || (forks ?? 0) > 0) && (
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            {(stars ?? 0) > 0 && (
              <span className="flex items-center gap-1" title={`${stars} stars`}>
                <Star className="size-3.5" aria-hidden />
                {stars!.toLocaleString()} <span className="hidden sm:inline">stars</span>
              </span>
            )}
            {(forks ?? 0) > 0 && (
              <span className="flex items-center gap-1" title={`${forks} forks`}>
                <GitFork className="size-3.5" aria-hidden />
                {forks!.toLocaleString()} <span className="hidden sm:inline">forks</span>
              </span>
            )}
          </div>
        )}
        {links && links.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {links.map((link, idx) => (
              <Link
                href={link.href}
                key={idx}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Badge
                  className="flex items-center gap-1.5 text-xs bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  variant="default"
                >
                  {link.icon}
                  {link.type}
                </Badge>
              </Link>
            ))}
          </div>
        )}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-auto pt-3 border-t border-border">
            {tags.map((tag) => (
              <Badge
                key={tag}
                className="text-[11px] font-medium border border-border h-6 w-fit px-2 text-muted-foreground"
                variant="outline"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}