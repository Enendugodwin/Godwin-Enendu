"use client";

import { useState } from "react";
import BlurFade from "@/components/magicui/blur-fade";
import { DATA } from "@/data/resume";
import { asset } from "@/lib/asset";
import { Award, ArrowUpRight } from "lucide-react";
import Link from "next/link";

const BLUR_FADE_DELAY = 0.04;

function CertLogo({ src, alt }: { src?: string; alt: string }) {
  const [error, setError] = useState(false);

  if (!src || error) {
    return (
      <div className="p-2.5 rounded-xl bg-primary/10 text-amber-500 flex-shrink-0">
        <Award className="size-6" aria-hidden="true" />
      </div>
    );
  }

  return (
    <div className="h-11 w-11 rounded-xl border border-border bg-background flex items-center justify-center flex-shrink-0 p-1.5">
      <img
        src={asset(src)}
        alt={`${alt} logo`}
        className="max-h-full max-w-full object-contain"
        onError={() => setError(true)}
      />
    </div>
  );
}

function SchoolLogo({ src, alt }: { src?: string; alt: string }) {
  const [error, setError] = useState(false);
  const initials = alt
    .replace(/[()]/g, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  if (!src || error) {
    return (
      <div className="size-10 md:size-12 rounded-full shadow ring-2 ring-border bg-muted flex items-center justify-center flex-none text-sm font-semibold text-muted-foreground">
        {initials}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className="size-10 md:size-12 p-1 border rounded-full shadow ring-2 ring-border overflow-hidden object-contain flex-none bg-background"
      onError={() => setError(true)}
    />
  );
}

export default function CertificationsSection() {
  return (
    <div className="mx-auto w-full max-w-7xl">
      <div className="flex min-h-0 flex-col gap-y-6">
        <div className="flex items-center w-full">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent from-5% via-border via-95% to-transparent" />
          <div className="border bg-primary z-10 rounded-xl px-4 py-1">
            <span className="text-primary-foreground text-sm font-medium">Certifications & Credentials</span>
          </div>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent from-5% via-border via-95% to-transparent" />
        </div>
        <div className="flex flex-col gap-y-3 items-center justify-center text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
            Professional Certifications
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base max-w-2xl">
            Industry-recognized credentials validating expertise in cybersecurity, 
            business continuity, and security education.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {DATA.certifications.map((cert, index) => (
            <BlurFade key={cert.name} delay={BLUR_FADE_DELAY * 11 + index * 0.05} className="h-full">
              <div className="border border-border rounded-xl p-5 sm:p-6 hover:ring-2 hover:ring-primary/20 transition-all duration-300 h-full flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <CertLogo src={(cert as { logo?: string }).logo} alt={cert.issuer} />
                </div>
                <h3 className="font-semibold text-base sm:text-lg mb-1">{cert.name}</h3>
                <p className="text-sm text-muted-foreground mb-1">{cert.issuer}</p>
                <p className="text-xs text-muted-foreground/70 mb-4">{cert.year}</p>
              </div>
            </BlurFade>
          ))}
        </div>
        <div className="mt-10 pt-8 border-t border-border">
          <div className="flex items-center w-full">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent from-5% via-border via-95% to-transparent" />
            <div className="border bg-primary z-10 rounded-xl px-4 py-1">
              <span className="text-primary-foreground text-sm font-medium">Education</span>
            </div>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent from-5% via-border via-95% to-transparent" />
          </div>
          <div className="flex flex-col gap-6 mt-8">
            {DATA.education.map((education, index) => (
              <BlurFade key={education.school} delay={BLUR_FADE_DELAY * 15 + index * 0.05}>
                <Link
                  href={education.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-x-3 justify-between group p-4 border border-border rounded-xl hover:ring-2 hover:ring-primary/20 transition-all duration-300"
                >
                  <div className="flex items-center gap-x-3 flex-1 min-w-0">
                    <SchoolLogo src={education.logoUrl} alt={education.school} />
                    <div className="flex-1 min-w-0 flex flex-col gap-0.5">
                      <div className="font-semibold leading-none flex items-center gap-2">
                        {education.school}
                        <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" aria-hidden />
                      </div>
                      <div className="font-sans text-sm text-muted-foreground">
                        {education.degree}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-sm tabular-nums text-muted-foreground text-right flex-none whitespace-nowrap">
                    <span>
                      {education.start} - {education.end}
                    </span>
                  </div>
                </Link>
              </BlurFade>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}