import { FlickeringGrid } from "@/components/magicui/flickering-grid";
import { DATA } from "@/data/resume";
import { Mail, Github, Linkedin, MapPin, Download } from "lucide-react";

export default function ContactSection() {
  return (
    <div className="mx-auto max-w-4xl">
      <div className="border rounded-xl p-6 sm:p-10 lg:p-12 relative">
        <div className="absolute -top-4 border bg-primary z-10 rounded-xl px-4 py-1 left-1/2 -translate-x-1/2">
          <span className="text-primary-foreground text-sm font-medium">Contact</span>
        </div>
        <div className="absolute inset-0 top-0 left-0 right-0 h-1/2 rounded-xl overflow-hidden">
          <FlickeringGrid
            className="h-full w-full"
            squareSize={2}
            gridGap={2}
            style={{
              maskImage: "linear-gradient(to bottom, black, transparent)",
              WebkitMaskImage: "linear-gradient(to bottom, black, transparent)",
            }}
          />
        </div>
        <div className="relative flex flex-col items-center gap-4 sm:gap-6 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
            Get in Touch
          </h2>
          <p className="mx-auto max-w-lg text-muted-foreground text-balance text-sm sm:text-base">
            Open to opportunities in security operations, detection engineering, and automation.
            Reach out via email or connect on professional networks.
          </p>

          <div className="grid grid-cols-2 sm:flex sm:flex-row items-center justify-center gap-3 mt-2 w-full max-w-md sm:max-w-none">
            <a
              href={`mailto:${DATA.contact.email}`}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-border bg-background text-sm font-medium hover:bg-muted transition-colors w-full sm:w-auto"
            >
              <Mail className="size-4" />
              Email
            </a>
            <a
              href={DATA.contact.social.LinkedIn.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-border bg-background text-sm font-medium hover:bg-muted transition-colors w-full sm:w-auto"
            >
              <Linkedin className="size-4" />
              LinkedIn
            </a>
            <a
              href={DATA.contact.social.GitHub.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-border bg-background text-sm font-medium hover:bg-muted transition-colors w-full sm:w-auto"
            >
              <Github className="size-4" />
              GitHub
            </a>
            <a
              href="/cv.pdf"
              download
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors w-full sm:w-auto"
            >
              <Download className="size-4" />
              Download CV
            </a>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-6 text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <MapPin className="size-4" />
            <span>{DATA.location}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
