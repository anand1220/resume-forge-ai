import type { ResumeData } from "./types";

export const uid = () => Math.random().toString(36).slice(2, 10);

export function createEmptyResume(name = "Untitled Resume"): ResumeData {
  const now = Date.now();
  return {
    id: uid(),
    name,
    template: "modern",
    theme: {
      accentColor: "#d4af37",
      fontFamily: "serif",
      fontSize: "md",
      spacing: "normal",
      lineHeight: "normal",
    },
    personal: {
      fullName: "Alexandra Hayes",
      title: "Senior Product Designer",
      email: "alex.hayes@example.com",
      phone: "+1 (555) 124-9911",
      address: "Brooklyn, NY",
      linkedin: "linkedin.com/in/alexhayes",
      github: "github.com/alexhayes",
      website: "alexhayes.design",
      photoUrl: "",
      summary:
        "Product designer with 8+ years crafting editorial, content-first interfaces for fintech and media. I lead end-to-end design from research to ship, partnering closely with engineering to build calm, durable products.",
    },
    experience: [
      {
        id: uid(),
        company: "Folio & Co.",
        position: "Senior Product Designer",
        startDate: "2022-03",
        endDate: "",
        current: true,
        description: "Lead designer on the publishing platform used by 4M+ writers.",
        achievements: [
          "Redesigned the editor reading experience, increasing session length 28%.",
          "Established the type and color system now adopted across 6 surfaces.",
          "Mentored 4 designers and ran a weekly critique loop.",
        ],
      },
      {
        id: uid(),
        company: "Northwind Bank",
        position: "Product Designer",
        startDate: "2019-06",
        endDate: "2022-02",
        current: false,
        description: "Owned the personal banking app's transactions and statements flows.",
        achievements: [
          "Shipped a unified search that cut support tickets by 19%.",
          "Led accessibility audit raising WCAG compliance to AA across mobile.",
        ],
      },
    ],
    education: [
      {
        id: uid(),
        school: "Rhode Island School of Design",
        degree: "BFA",
        field: "Graphic Design",
        startDate: "2013-09",
        endDate: "2017-05",
        gpa: "3.8",
        description: "Thesis on editorial systems for long-form journalism.",
      },
    ],
    projects: [
      {
        id: uid(),
        title: "Slow Reader",
        tech: "React, TanStack, Tailwind",
        description: "An offline-first reader for longform essays. 12k MAU.",
        github: "github.com/alexhayes/slow-reader",
        demo: "slowreader.app",
      },
    ],
    skills: [
      { id: uid(), name: "Figma", level: 5, category: "Design" },
      { id: uid(), name: "Design Systems", level: 5, category: "Design" },
      { id: uid(), name: "Prototyping", level: 4, category: "Design" },
      { id: uid(), name: "HTML/CSS", level: 4, category: "Engineering" },
      { id: uid(), name: "User Research", level: 4, category: "Research" },
      { id: uid(), name: "Typography", level: 5, category: "Craft" },
    ],
    certifications: [
      { id: uid(), name: "NN/g UX Certification", issuer: "Nielsen Norman Group", date: "2021" },
    ],
    languages: [
      { id: uid(), name: "English", proficiency: "Native" },
      { id: uid(), name: "Spanish", proficiency: "Professional" },
    ],
    achievements: [
      { id: uid(), text: "Speaker — Config 2024, “Editorial systems at scale”." },
      { id: uid(), text: "Awwwards SOTD for slowreader.app (2023)." },
    ],
    interests: [
      { id: uid(), text: "Letterpress printing" },
      { id: uid(), text: "Trail running" },
    ],
    customSections: [],
    sectionOrder: [
      "summary",
      "experience",
      "education",
      "projects",
      "skills",
      "certifications",
      "languages",
      "achievements",
      "interests",
    ],
    visibility: {
      summary: true,
      experience: true,
      education: true,
      projects: true,
      skills: true,
      certifications: true,
      languages: true,
      achievements: true,
      interests: true,
    },
    createdAt: now,
    updatedAt: now,
  };
}
