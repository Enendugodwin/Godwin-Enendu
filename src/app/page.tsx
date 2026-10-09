/* eslint-disable @next/next/no-img-element */
import BlurFade from "@/components/magicui/blur-fade";
import BlurFadeText from "@/components/magicui/blur-fade-text";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DATA } from "@/data/resume";
import { asset } from "@/lib/asset";
import Link from "next/link";
import Markdown from "react-markdown";
import ContactSection from "@/components/section/contact-section";
import ExpertiseSection from "@/components/section/expertise-section";
import ProjectsSection from "@/components/section/projects-section";
import WorkSection from "@/components/section/work-section";
import CertificationsSection from "@/components/section/certifications-section";
import { ArrowUpRight, Shield, Network, Brain, Terminal, Database, Zap, Code, Download, Github, Linkedin } from "lucide-react";

const BLUR_FADE_DELAY = 0.04;

const skillIcons = {
  "SIEM & QRadar": Brain,
  "Python": Terminal,
  "PowerShell": Terminal,
  "Network Security": Network,
  "Endpoint Security": Shield,
  "Threat Intelligence": Brain,
  "DLP & DAM": Database,
  "Automation": Zap,
  "Linux/Windows": Code,
  "Active Directory": Network,
} as const;

export default function Page() {
  return (
    <main className="min-h-dvh flex flex-col gap-16 sm:gap-24 lg:gap-32">
      {/* HERO */}
      <section id="hero" className="pt-8 sm:pt-16 lg:pt-20">
        <div className="mx-auto w-full max-w-3xl">
          <div className="flex flex-col items-center gap-6 text-center">
              <BlurFade delay={BLUR_FADE_DELAY}>
                <div className="relative">
                  <div className="absolute -inset-4 rounded-full bg-primary/20 blur-3xl" aria-hidden="true" />
                  <Avatar className="relative size-28 sm:size-36 border border-border rounded-full shadow-2xl ring-4 ring-muted">
                    <AvatarImage alt={DATA.name} src={asset(DATA.avatarUrl)} className="object-cover object-[center_40%]" />
                    <AvatarFallback className="text-3xl sm:text-4xl font-bold bg-muted">
                      {DATA.initials}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </BlurFade>
              <BlurFadeText
                delay={BLUR_FADE_DELAY}
                className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight leading-tight"
                yOffset={8}
                text={`Hi, I'm ${DATA.name.split(" ")[0]}`}
              />
              <BlurFadeText
                delay={BLUR_FADE_DELAY}
                className="text-lg sm:text-xl lg:text-2xl font-semibold text-primary max-w-2xl"
                text={DATA.tagline}
              />
              <BlurFadeText
                className="text-base sm:text-lg text-muted-foreground max-w-2xl"
                delay={BLUR_FADE_DELAY}
                text={DATA.description}
              />
              <div className="flex flex-wrap gap-2 justify-center">
                {DATA.skills.slice(0, 6).map((skill) => {
                  const Icon = skillIcons[skill.name as keyof typeof skillIcons] || Shield;
                  return (
                    <BlurFade key={skill.name} delay={BLUR_FADE_DELAY}>
                      <span className="flex items-center gap-1.5 border bg-background border-border ring-2 ring-border/20 rounded-xl h-9 w-fit px-3.5 text-sm">
                        <Icon className="size-4 text-primary" aria-hidden="true" />
                        <span className="text-foreground font-medium">{skill.name}</span>
                      </span>
                    </BlurFade>
                  );
                })}
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
                <a
                  href="#projects"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  Explore Projects
                  <ArrowUpRight className="size-4" />
                </a>
                <a
                  href={asset("/cv.pdf")}
                  download
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border bg-background text-foreground text-sm font-semibold hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <Download className="size-4" />
                  Download CV
                </a>
                <a
                  href={DATA.contact.social.GitHub.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub profile"
                  className="inline-flex items-center justify-center size-11 rounded-lg border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <Github className="size-5" aria-hidden="true" />
                </a>
                <a
                  href={DATA.contact.social.LinkedIn.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn profile"
                  className="inline-flex items-center justify-center size-11 rounded-lg border border-border bg-background text-muted-foreground hover:text-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <Linkedin className="size-5" aria-hidden="true" />
                </a>
              </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="mx-auto w-full max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="lg:col-span-4">
            <BlurFade delay={BLUR_FADE_DELAY * 3}>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">About</h2>
            </BlurFade>
          </div>
          <div className="lg:col-span-8">
            <BlurFade delay={BLUR_FADE_DELAY * 4}>
              <div className="prose prose-lg max-w-none text-pretty font-sans leading-relaxed text-muted-foreground dark:prose-invert">
                <Markdown>{DATA.summary}</Markdown>
              </div>
            </BlurFade>
          </div>
        </div>
      </section>

      {/* EXPERTISE */}
      <section id="expertise" className="mx-auto w-full max-w-7xl">
        <BlurFade delay={BLUR_FADE_DELAY * 5}>
          <ExpertiseSection />
        </BlurFade>
      </section>

      {/* WORK */}
      <section id="work" className="mx-auto w-full max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          <div className="lg:col-span-4">
            <BlurFade delay={BLUR_FADE_DELAY * 7}>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">Experience</h2>
              <p className="mt-3 text-muted-foreground text-sm sm:text-base">
                Hands-on roles in security operations, web development, and IT support.
              </p>
            </BlurFade>
          </div>
          <div className="lg:col-span-8">
            <BlurFade delay={BLUR_FADE_DELAY * 8}>
              <WorkSection />
            </BlurFade>
          </div>
        </div>
      </section>

      {/* CERTIFICATIONS & EDUCATION */}
      <section id="certifications" className="mx-auto w-full max-w-7xl">
        <BlurFade delay={BLUR_FADE_DELAY * 10}>
          <CertificationsSection />
        </BlurFade>
      </section>

      {/* PROJECTS */}
      <section id="projects" className="mx-auto w-full max-w-7xl">
        <BlurFade delay={BLUR_FADE_DELAY * 15}>
          <ProjectsSection />
        </BlurFade>
      </section>

      {/* CONTACT */}
      <section id="contact" className="mx-auto w-full max-w-7xl pb-16">
        <BlurFade delay={BLUR_FADE_DELAY * 17}>
          <ContactSection />
        </BlurFade>
      </section>
    </main>
  );
}