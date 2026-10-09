"use client";

import BlurFade from "@/components/magicui/blur-fade";
import { DATA } from "@/data/resume";
import { Shield, Network, Brain, Terminal, Database, Zap, Code, Search, ShieldAlert, HardDrive, Globe, Lock, Cpu, Activity } from "lucide-react";

const BLUR_FADE_DELAY = 0.04;

const expertiseCategories = [
  {
    title: "SOC & Incident Response",
    icon: Activity,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
    skills: [
      "SIEM Monitoring (QRadar)",
      "Alert Triage & Investigation",
      "Incident Response",
      "Log Analysis & Correlation",
      "Security Reporting",
      "MSSP Coordination",
    ],
  },
  {
    title: "Detection & Threat Intelligence",
    icon: Search,
    color: "text-cyan-500",
    bgColor: "bg-cyan-500/10",
    skills: [
      "Correlation Rule Development",
      "IOC Analysis & Enrichment",
      "OSINT Collection",
      "Threat Hunting",
      "SOAR/Playbook Design",
      "MITRE ATT&CK Mapping",
    ],
  },
  {
    title: "Network & Access Security",
    icon: Globe,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    skills: [
      "Forescout NAC",
      "Palo Alto NGFW",
      "IDS/IPS Fundamentals",
      "VPN & Zero Trust",
      "TCP/IP & Routing",
      "Network Segmentation",
    ],
  },
  {
    title: "Endpoint, Data & Database Security",
    icon: HardDrive,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    skills: [
      "Cortex XDR",
      "Symantec Endpoint Protection",
      "Forcepoint/Symantec DLP",
      "Imperva DAM/WAF",
      "Antivirus & Patch Compliance",
      "NNT Change Tracker / CimTrak FIM",
    ],
  },
  {
    title: "Automation & Platforms",
    icon: Cpu,
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
    skills: [
      "Python Scripting",
      "PowerShell Automation",
      "Bash/Linux Admin",
      "Elasticsearch/ELK",
      "IBM QRadar SIEM",
      "ManageEngine / AD",
    ],
  },
];

export default function ExpertiseSection() {
  return (
    <div className="mx-auto w-full max-w-7xl">
      <div className="flex min-h-0 flex-col gap-y-6">
        <div className="flex items-center w-full">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent from-5% via-border via-95% to-transparent" />
          <div className="border bg-primary z-10 rounded-xl px-4 py-1">
            <span className="text-background text-sm font-medium">Technical Expertise</span>
          </div>
          <div className="flex-1 h-px bg-gradient-to-l from-transparent from-5% via-border via-95% to-transparent" />
        </div>
        <div className="flex flex-col gap-y-3 items-center justify-center text-center">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tighter">
            Security Domains & Capabilities
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base max-w-2xl">
            Practical experience across security operations, detection engineering, network defense, 
            endpoint protection, data security, and automation platforms.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {expertiseCategories.map((category, index) => (
            <BlurFade key={category.title} delay={BLUR_FADE_DELAY * 6 + index * 0.05} className="h-full">
              <div className="border border-border rounded-xl p-5 sm:p-6 hover:ring-2 hover:ring-primary/20 transition-all duration-300 h-full flex flex-col">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-3 rounded-xl ${category.bgColor} ${category.color} flex-shrink-0`}>
                    <category.icon className="size-5" aria-hidden="true" />
                  </div>
                  <h3 className="font-semibold text-base sm:text-lg flex-1">{category.title}</h3>
                </div>
                <ul className="space-y-2 flex-1">
                  {category.skills.map((skill, skillIndex) => (
                    <li key={skill} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/50 flex-shrink-0" />
                      <span>{skill}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </BlurFade>
          ))}
        </div>
      </div>
    </div>
  );
}