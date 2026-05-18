export type TemplateId = "modern" | "ats" | "minimal" | "sidebar" | "executive";

export interface PersonalInfo {
  fullName: string;
  title: string;
  email: string;
  phone: string;
  address: string;
  linkedin: string;
  github: string;
  website: string;
  photoUrl: string;
  summary: string;
}

export interface EducationItem {
  id: string;
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa: string;
  description: string;
}

export interface ExperienceItem {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  achievements: string[];
}

export interface ProjectItem {
  id: string;
  title: string;
  tech: string;
  description: string;
  github: string;
  demo: string;
}

export interface SkillItem {
  id: string;
  name: string;
  level: number; // 1-5
  category: string;
}

export interface SimpleItem {
  id: string;
  text: string;
}

export interface CertItem {
  id: string;
  name: string;
  issuer: string;
  date: string;
}

export interface LanguageItem {
  id: string;
  name: string;
  proficiency: string;
}

export interface CustomSection {
  id: string;
  title: string;
  items: SimpleItem[];
}

export interface ThemeSettings {
  accentColor: string; // hex
  fontFamily: "serif" | "sans";
  fontSize: "sm" | "md" | "lg";
  spacing: "tight" | "normal" | "loose";
  lineHeight: "tight" | "normal" | "loose";
}

export interface SectionVisibility {
  summary: boolean;
  experience: boolean;
  education: boolean;
  projects: boolean;
  skills: boolean;
  certifications: boolean;
  languages: boolean;
  achievements: boolean;
  interests: boolean;
}

export interface ResumeData {
  id: string;
  name: string;
  template: TemplateId;
  theme: ThemeSettings;
  personal: PersonalInfo;
  education: EducationItem[];
  experience: ExperienceItem[];
  projects: ProjectItem[];
  skills: SkillItem[];
  certifications: CertItem[];
  languages: LanguageItem[];
  achievements: SimpleItem[];
  interests: SimpleItem[];
  customSections: CustomSection[];
  sectionOrder: string[];
  visibility: SectionVisibility;
  updatedAt: number;
  createdAt: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
}
