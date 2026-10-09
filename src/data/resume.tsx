import { Icons } from "@/components/icons";
import { HomeIcon, MailIcon, GithubIcon, LinkedinIcon, ShieldIcon, TerminalIcon, BrainIcon, NetworkIcon, DatabaseIcon, ZapIcon, CodeIcon, DownloadIcon, FileTextIcon } from "lucide-react";
import { ReactLight } from "@/components/ui/svgs/reactLight";
import { NextjsIconDark } from "@/components/ui/svgs/nextjsIconDark";
import { Typescript } from "@/components/ui/svgs/typescript";
import { Nodejs } from "@/components/ui/svgs/nodejs";
import { Python } from "@/components/ui/svgs/python";
import { Postgresql } from "@/components/ui/svgs/postgresql";
import { Docker } from "@/components/ui/svgs/docker";
import { Kubernetes } from "@/components/ui/svgs/kubernetes";
import { Java } from "@/components/ui/svgs/java";
import { Csharp } from "@/components/ui/svgs/csharp";

export const DATA = {
  name: "Godwin Enendu",
  initials: "GE",
  url: "https://godwinenendu.enendugodwin.workers.dev",
  location: "Lagos, Nigeria",
  locationLink: "https://www.google.com/maps/place/Lagos,+Nigeria",
  tagline: "Cybersecurity Engineer | Detection Engineering | Security Automation",
  description:
    "Building practical security solutions for threat detection, network visibility, threat intelligence, and automated defense.",
  summary:
    "Security operations professional with 3+ years of experience monitoring and investigating security events, improving detection, administering enterprise security controls, and automating repetitive SOC tasks. Background in Computer Science with hands-on expertise in SIEM monitoring, incident investigation, detection engineering, threat intelligence integration, and security automation using Python and PowerShell.",
  avatarUrl: "/me.jpeg",
  skills: [
    { name: "SIEM & QRadar", icon: BrainIcon },
    { name: "Python", icon: Python },
    { name: "PowerShell", icon: TerminalIcon },
    { name: "Network Security", icon: NetworkIcon },
    { name: "Endpoint Security", icon: ShieldIcon },
    { name: "Threat Intelligence", icon: BrainIcon },
    { name: "DLP & DAM", icon: DatabaseIcon },
    { name: "Automation", icon: ZapIcon },
    { name: "Linux/Windows", icon: CodeIcon },
    { name: "Active Directory", icon: NetworkIcon },
  ],
  navbar: [
    { href: "/", icon: HomeIcon, label: "Home" },
  ],
  contact: {
    email: "enendugodwin@gmail.com",
    tel: "",
    social: {
      GitHub: {
        name: "GitHub",
        url: "https://github.com/enendugodwin",
        icon: Icons.github,
        navbar: true,
      },
      LinkedIn: {
        name: "LinkedIn",
        url: "https://linkedin.com/in/enendugodwin",
        icon: Icons.linkedin,
        navbar: true,
      },
      Email: {
        name: "Send Email",
        url: "mailto:enendugodwin@gmail.com",
        icon: Icons.email,
        navbar: false,
      },
    },
  },

  work: [
    {
      company: "Guaranty Trust Bank (GTBank)",
      href: "https://gtbank.com",
      badges: ["SOC Analyst", "Security Operations"],
      location: "Lagos, Nigeria",
      title: "Security Operations Center Analyst",
      logoUrl: "/gtbank.svg",
      start: "February 2023",
      end: "Present",
      description: [
        "Monitor SIEM dashboards, investigate suspicious activity, and escalate potential incidents.",
        "Tune DLP and NAC policies and review endpoint/network compliance.",
        "Monitor database activity and support deployment, maintenance, and policy configuration for security tools.",
        "Review XDR alerts, malware logs, firewall changes, and cross-platform correlation rules.",
        "Automate repetitive SOC tasks using Python and PowerShell.",
        "Coordinate with threat-intelligence/MSSP teams and prepare security reports.",
      ],
    },
    {
      company: "Reftek Consulting",
      href: "https://reftekconsulting.com",
      badges: ["Web Development", "React", "Tailwind CSS"],
      location: "Lagos, Nigeria",
      title: "Web Development Intern",
      logoUrl: "",
      start: "December 2021",
      end: "December 2022",
      description: [
        "Developed responsive web applications using React and Tailwind CSS.",
        "Collaborated with design and backend teams to implement pixel-perfect UIs.",
        "Optimized frontend performance and ensured cross-browser compatibility.",
      ],
    },
    {
      company: "Bi-Courtney Aviation Services",
      href: "https://bicas.com.ng",
      badges: ["IT Support", "Systems Administration"],
      location: "Lagos, Nigeria",
      title: "Information Technology Intern",
      logoUrl: "",
      start: "January 2020",
      end: "April 2020",
      description: [
        "Troubleshot hardware and software issues across workstations and peripherals.",
        "Performed OS installation, updates, and patch management.",
        "Managed printer/peripheral setup and maintenance.",
      ],
    },
  ],
  education: [
    {
      school: "Babcock University",
      href: "https://babcock.edu.ng",
      degree: "Bachelor of Science, Computer Science",
      logoUrl: "/babcock.jpg",
      start: "June 2017",
      end: "June 2021",
    },
  ],
  projects: [
    {
      title: "Bug-Bounty---Kali-Linux-VM",
      href: "https://github.com/enendugodwin/Bug-Bounty---Kali-Linux-VM",
      dates: "2024 - Present",
      active: true,
      description:
        "AI-native, scope-enforced security-assessment framework for Kali Linux (MCP server + CLI + web GUI). Deny-by-default scope gate; profiles web, network, full, cve; tools include nmap, nikto, gobuster/ffuf, nuclei, ZAP, and opt-in sqlmap.",
      technologies: [
        "Python",
        "FastAPI",
        "React",
        "TypeScript",
        "TailwindCSS",
        "MCP",
        "Docker",
      ],
      links: [
        {
          type: "Source",
          href: "https://github.com/enendugodwin/Bug-Bounty---Kali-Linux-VM",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "",
      video: "",
    },
    {
      title: "Threat-Intelligence-Platform",
      href: "https://github.com/enendugodwin/Threat-Intelligence-Platform",
      dates: "2024",
      active: true,
      description:
        "Threat intelligence collection and analysis platform with automated enrichment, IOC management, and STIX/TAXII support.",
      technologies: [
        "TypeScript",
        "Next.js",
        "PostgreSQL",
        "Python",
        "Docker",
      ],
      links: [
        {
          type: "Source",
          href: "https://github.com/enendugodwin/Threat-Intelligence-Platform",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "",
      video: "",
    },
    {
      title: "Imperva-DAM-User-rights-scan-interpreter",
      href: "https://github.com/enendugodwin/Imperva-DAM-User-rights-scan-interpreter",
      dates: "2023",
      active: true,
      description:
        "Parser and analyzer for Imperva Database Activity Monitoring user rights scan output. Automates extraction and normalization of database user permissions for compliance reporting.",
      technologies: [
        "Python",
        "Pandas",
        "Regex",
        "CSV/Excel",
      ],
      links: [
        {
          type: "Source",
          href: "https://github.com/enendugodwin/Imperva-DAM-User-rights-scan-interpreter",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "",
      video: "",
    },
    {
      title: "Defense-as-a-service",
      href: "https://github.com/enendugodwin/Defense-as-a-service",
      dates: "2023",
      active: true,
      description:
        "Security automation toolkit for defensive operations including log parsing, alert enrichment, and automated response playbooks.",
      technologies: [
        "Python",
        "PowerShell",
        "Elasticsearch",
        "SOAR",
      ],
      links: [
        {
          type: "Source",
          href: "https://github.com/enendugodwin/Defense-as-a-service",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "",
      video: "",
    },
    {
      title: "Public-Network-Tracer",
      href: "https://github.com/enendugodwin/Public-Network-Tracer",
      dates: "2023",
      active: true,
      description:
        "Network reconnaissance and tracing tool for mapping public-facing infrastructure, identifying exposed services, and generating network topology visualizations.",
      technologies: [
        "Python",
        "Nmap",
        "Graphviz",
        "AsyncIO",
      ],
      links: [
        {
          type: "Source",
          href: "https://github.com/enendugodwin/Public-Network-Tracer",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "",
      video: "",
    },
  ],
  certifications: [
    {
      name: "Associate of (ISC)²",
      issuer: "(ISC)²",
      year: "2024",
      logo: "/isc2.png",
    },
    {
      name: "ISO 22301:2019 — Business Continuity Management System Lead Implementer",
      issuer: "ISO",
      year: "2024",
      logo: "/iso.svg",
    },
    {
      name: "CompTIA Security+ (SY0-701)",
      issuer: "CompTIA",
      year: "2023",
      logo: "/comptia.svg",
    },
    {
      name: "Certified Cybersecurity Educator Professional (CCEP)",
      issuer: "EC-Council",
      year: "2023",
      logo: "/eccouncil.svg",
    },
  ],
  hackathons: [],
} as const;