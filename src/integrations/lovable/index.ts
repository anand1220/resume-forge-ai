import type { ResumeData, SectionKey } from "@/lib/types";
import { dateRange, getThemeVars, hrefify } from "./helpers";
import { Mail, Phone, MapPin, Globe, Linkedin, Github, ExternalLink } from "lucide-react";

interface Props { data: ResumeData }

// ============================================================================
// Shared section blocks. Pass in `accent` and they render inline section
// content. Used by templates that iterate `data.sectionOrder`.
// ============================================================================

function SummaryBlock({ data }: Props) {
  if (!data.visibility.summary || !data.personal.summary) return null;
  return <p>{data.personal.summary}</p>;
}

function ExperienceBlock({ data }: Props) {
  if (!data.visibility.experience || data.experience.length === 0) return null;
  return (
    <>
      {data.experience.map((e) => (
        <div key={e.id} className="mb-3 break-inside-avoid">
          <div className="flex justify-between items-baseline">
            <div>
              <span className="font-semibold">{e.position}</span>
              <span className="text-neutral-600"> — {e.company}</span>
            </div>
            <span className="text-[10px] text-neutral-500">{dateRange(e.startDate, e.endDate, e.current)}</span>
          </div>
          {e.description && <p className="mt-0.5">{e.description}</p>}
          {e.achievements.length > 0 && (
            <ul className="mt-1 ml-4 list-disc space-y-0.5">
              {e.achievements.filter(Boolean).map((a, i) => <li key={i}>{a}</li>)}
            </ul>
          )}
        </div>
      ))}
    </>
  );
}

function EducationBlock({ data }: Props) {
  if (!data.visibility.education || data.education.length === 0) return null;
  return (
    <>
      {data.education.map((ed) => (
        <div key={ed.id} className="mb-2 flex justify-between items-baseline break-inside-avoid">
          <div>
            <div className="font-semibold">{ed.school}</div>
            <div className="text-neutral-700">{[ed.degree, ed.field].filter(Boolean).join(", ")}{ed.gpa && ` · GPA ${ed.gpa}`}</div>
            {ed.description && <div className="text-neutral-600">{ed.description}</div>}
          </div>
          <span className="text-[10px] text-neutral-500">{dateRange(ed.startDate, ed.endDate)}</span>
        </div>
      ))}
    </>
  );
}

function ProjectsBlock({ data }: Props) {
  if (!data.visibility.projects || data.projects.length === 0) return null;
  return (
    <>
      {data.projects.map((p) => (
        <div key={p.id} className="mb-2 break-inside-avoid">
          <div className="flex justify-between items-baseline">
            <span className="font-semibold">{p.title}</span>
            <span className="text-[10px] text-neutral-500">{p.tech}</span>
          </div>
          {p.description && <p>{p.description}</p>}
          <div className="text-[10px] text-neutral-500">{[p.github, p.demo].filter(Boolean).join(" · ")}</div>
        </div>
      ))}
    </>
  );
}

function SkillsBlock({ data, accent }: Props & { accent: string }) {
  if (!data.visibility.skills || data.skills.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {data.skills.map((s) => (
        <span key={s.id} className="px-2 py-0.5 border text-[10.5px]" style={{ borderColor: accent }}>{s.name}</span>
      ))}
    </div>
  );
}

function LinksBlock({ data, accent }: Props & { accent: string }) {
  if (!data.visibility.links || data.links.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1">
      {data.links.map((l) => (
        <a
          key={l.id}
          href={hrefify(l.url)}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 underline decoration-dotted hover:opacity-80"
          style={{ color: accent }}
        >
          <ExternalLink className="w-3 h-3" />
          <span>{l.label || l.url}</span>
        </a>
      ))}
    </div>
  );
}

function CertificationsBlock({ data }: Props) {
  if (!data.visibility.certifications || data.certifications.length === 0) return null;
  return (
    <>
      {data.certifications.map((c) => (
        <div key={c.id} className="mb-1 break-inside-avoid">
          <div className="font-semibold">{c.name}</div>
          <div className="text-[10px] text-neutral-600">{c.issuer} · {c.date}</div>
        </div>
      ))}
    </>
  );
}

function LanguagesBlock({ data }: Props) {
  if (!data.visibility.languages || data.languages.length === 0) return null;
  return (
    <>
      {data.languages.map((l) => (
        <div key={l.id}>{l.name} — <span className="text-neutral-600">{l.proficiency}</span></div>
      ))}
    </>
  );
}

function AchievementsBlock({ data }: Props) {
  if (!data.visibility.achievements || data.achievements.length === 0) return null;
  return (
    <ul className="ml-4 list-disc space-y-0.5">
      {data.achievements.map((a) => <li key={a.id}>{a.text}</li>)}
    </ul>
  );
}

function InterestsBlock({ data }: Props) {
  if (!data.visibility.interests || data.interests.length === 0) return null;
  return <p>{data.interests.map((i) => i.text).join(" · ")}</p>;
}

function isSectionEmpty(data: ResumeData, key: SectionKey): boolean {
  if (!data.visibility[key]) return true;
  switch (key) {
    case "summary": return !data.personal.summary;
    case "experience": return data.experience.length === 0;
    case "education": return data.education.length === 0;
    case "projects": return data.projects.length === 0;
    case "skills": return data.skills.length === 0;
    case "certifications": return data.certifications.length === 0;
    case "languages": return data.languages.length === 0;
    case "achievements": return data.achievements.length === 0;
    case "interests": return data.interests.length === 0;
    case "links": return data.links.length === 0;
  }
}

const SECTION_TITLES: Record<SectionKey, string> = {
  summary: "Summary",
  experience: "Experience",
  education: "Education",
  projects: "Projects",
  skills: "Skills",
  certifications: "Certifications",
  languages: "Languages",
  achievements: "Achievements",
  interests: "Interests",
  links: "Links",
};

function renderSectionBody(data: ResumeData, key: SectionKey, accent: string): React.ReactNode {
  switch (key) {
    case "summary": return <SummaryBlock data={data} />;
    case "experience": return <ExperienceBlock data={data} />;
    case "education": return <EducationBlock data={data} />;
    case "projects": return <ProjectsBlock data={data} />;
    case "skills": return <SkillsBlock data={data} accent={accent} />;
    case "certifications": return <CertificationsBlock data={data} />;
    case "languages": return <LanguagesBlock data={data} />;
    case "achievements": return <AchievementsBlock data={data} />;
    case "interests": return <InterestsBlock data={data} />;
    case "links": return <LinksBlock data={data} accent={accent} />;
  }
}

function OrderedSections({
  data,
  renderTitle,
}: {
  data: ResumeData;
  renderTitle: (title: string) => React.ReactNode;
}) {
  const accent = data.theme.accentColor;
  return (
    <>
      {data.sectionOrder.map((key) => {
        if (isSectionEmpty(data, key)) return null;
        return (
          <section key={key} className="mb-5 break-inside-avoid">
            {renderTitle(SECTION_TITLES[key])}
            <div className="text-[11px]" style={{ color: "#222" }}>{renderSectionBody(data, key, accent)}</div>
          </section>
        );
      })}
      {data.customSections.map((cs) => (
        <section key={cs.id} className="mb-5 break-inside-avoid">
          {renderTitle(cs.title)}
          <ul className="ml-4 list-disc space-y-0.5 text-[11px]">
            {cs.items.map((it) => <li key={it.id}>{it.text}</li>)}
          </ul>
        </section>
      ))}
    </>
  );
}

// ============================================================================
// Templates
// ============================================================================

export function ModernTemplate({ data }: Props) {
  const accent = data.theme.accentColor;
  const style = getThemeVars(data.theme);
  return (
    <div style={{ ...style, color: "#1a1a1a" }}>
      <header className="mb-5">
        <div className="flex items-end justify-between gap-6">
          <div>
            <h1 className="font-serif text-[40px] leading-none tracking-tight">{data.personal.fullName}</h1>
            <p className="mt-1 text-[12px] uppercase tracking-[0.18em]" style={{ color: accent }}>
              {data.personal.title}
            </p>
          </div>
          {data.personal.photoUrl ? (
            <img src={data.personal.photoUrl} alt="" className="w-16 h-16 rounded-full object-cover" />
          ) : null}
        </div>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[10.5px] text-neutral-700">
          {data.personal.email && <span className="inline-flex items-center gap-1"><Mail className="w-3 h-3" />{data.personal.email}</span>}
          {data.personal.phone && <span className="inline-flex items-center gap-1"><Phone className="w-3 h-3" />{data.personal.phone}</span>}
          {data.personal.address && <span className="inline-flex items-center gap-1"><MapPin className="w-3 h-3" />{data.personal.address}</span>}
          {data.personal.website && <span className="inline-flex items-center gap-1"><Globe className="w-3 h-3" />{data.personal.website}</span>}
          {data.personal.linkedin && <span className="inline-flex items-center gap-1"><Linkedin className="w-3 h-3" />{data.personal.linkedin}</span>}
          {data.personal.github && <span className="inline-flex items-center gap-1"><Github className="w-3 h-3" />{data.personal.github}</span>}
        </div>
      </header>
      <OrderedSections
        data={data}
        renderTitle={(t) => (
          <h2 className="font-serif text-[18px] tracking-tight mb-2 pb-1 border-b" style={{ borderColor: accent, color: "#1a1a1a" }}>
            {t}
          </h2>
        )}
      />
    </div>
  );
}

export function AtsTemplate({ data }: Props) {
  const style = { ...getThemeVars(data.theme), fontFamily: '"Inter", system-ui, sans-serif', color: "#111" };
  return (
    <div style={style}>
      <h1 className="text-[22px] font-bold uppercase tracking-wider">{data.personal.fullName}</h1>
      <div className="text-[11px]">{data.personal.title}</div>
      <div className="text-[10.5px] mt-1">
        {[data.personal.email, data.personal.phone, data.personal.address, data.personal.linkedin, data.personal.github, data.personal.website].filter(Boolean).join(" | ")}
      </div>
      <hr className="my-3 border-black" />
      <OrderedSections
        data={data}
        renderTitle={(t) => (
          <h2 className="text-[12px] font-bold uppercase tracking-wider mb-1">{t}</h2>
        )}
      />
    </div>
  );
}

export function MinimalTemplate({ data }: Props) {
  const v = data.visibility;
  const accent = data.theme.accentColor;
  const style = getThemeVars(data.theme);
  return (
    <div style={{ ...style, color: "#1a1a1a" }} className="font-serif">
      <header className="text-center mb-6">
        <h1 className="text-[44px] leading-none">{data.personal.fullName}</h1>
        <div className="mt-2 text-[12px] tracking-[0.3em] uppercase" style={{ color: accent, fontFamily: "Inter, sans-serif" }}>
          {data.personal.title}
        </div>
        <div className="gold-rule mt-3 mx-auto w-24" style={{ background: accent }} />
        <div className="mt-2 text-[10.5px] text-neutral-600" style={{ fontFamily: "Inter, sans-serif" }}>
          {[data.personal.email, data.personal.phone, data.personal.address, data.personal.website].filter(Boolean).join("  ·  ")}
        </div>
      </header>
      {v.summary && data.personal.summary && (
        <p className="text-center italic text-[12px] mb-5 max-w-prose mx-auto">{data.personal.summary}</p>
      )}
      <OrderedSections
        data={{ ...data, sectionOrder: data.sectionOrder.filter((k) => k !== "summary") }}
        renderTitle={(t) => (
          <h2 className="text-center text-[10.5px] tracking-[0.4em] uppercase mb-3" style={{ fontFamily: "Inter, sans-serif", color: accent }}>{t}</h2>
        )}
      />
    </div>
  );
}

export function SidebarTemplate({ data }: Props) {
  const v = data.visibility;
  const accent = data.theme.accentColor;
  const style = getThemeVars(data.theme);
  return (
    <div style={style} className="grid grid-cols-[34%_1fr] gap-6 -mx-[16mm] -my-[14mm]">
      <aside className="bg-neutral-900 text-neutral-100 p-[14mm] min-h-[297mm]" style={{ fontFamily: "Inter, sans-serif" }}>
        {data.personal.photoUrl && <img src={data.personal.photoUrl} alt="" className="w-24 h-24 rounded-full object-cover mb-4" />}
        <h1 className="font-serif text-[26px] leading-tight">{data.personal.fullName}</h1>
        <div className="text-[11px] mt-1" style={{ color: accent }}>{data.personal.title}</div>

        <h3 className="mt-5 text-[10px] tracking-[0.3em] uppercase" style={{ color: accent }}>Contact</h3>
        <div className="mt-2 text-[10.5px] space-y-1 text-neutral-300">
          {data.personal.email && <div>{data.personal.email}</div>}
          {data.personal.phone && <div>{data.personal.phone}</div>}
          {data.personal.address && <div>{data.personal.address}</div>}
          {data.personal.website && <div>{data.personal.website}</div>}
          {data.personal.linkedin && <div>{data.personal.linkedin}</div>}
          {data.personal.github && <div>{data.personal.github}</div>}
        </div>

        {v.links && data.links.length > 0 && (
          <>
            <h3 className="mt-5 text-[10px] tracking-[0.3em] uppercase" style={{ color: accent }}>Links</h3>
            <div className="mt-2 text-[10.5px] space-y-1 text-neutral-300">
              {data.links.map((l) => (
                <a key={l.id} href={hrefify(l.url)} target="_blank" rel="noreferrer" className="block underline decoration-dotted">{l.label || l.url}</a>
              ))}
            </div>
          </>
        )}

        {v.skills && data.skills.length > 0 && (
          <>
            <h3 className="mt-5 text-[10px] tracking-[0.3em] uppercase" style={{ color: accent }}>Skills</h3>
            <div className="mt-2 space-y-1.5 text-[10.5px]">
              {data.skills.map((s) => (
                <div key={s.id}>
                  <div className="flex justify-between"><span>{s.name}</span></div>
                  <div className="h-1 bg-neutral-700 mt-0.5"><div style={{ width: `${s.level * 20}%`, background: accent, height: "100%" }} /></div>
                </div>
              ))}
            </div>
          </>
        )}
        {v.languages && data.languages.length > 0 && (
          <>
            <h3 className="mt-5 text-[10px] tracking-[0.3em] uppercase" style={{ color: accent }}>Languages</h3>
            <div className="mt-2 text-[10.5px] space-y-1">
              {data.languages.map((l) => <div key={l.id}>{l.name} <span className="text-neutral-400">— {l.proficiency}</span></div>)}
            </div>
          </>
        )}
      </aside>
      <main className="p-[14mm] pl-0" style={{ color: "#1a1a1a", fontFamily: "Inter, sans-serif" }}>
        {v.summary && data.personal.summary && (
          <section className="mb-4">
            <h2 className="font-serif text-[18px] mb-1">Profile</h2>
            <p className="text-[11px]">{data.personal.summary}</p>
          </section>
        )}
        {v.experience && data.experience.length > 0 && (
          <section className="mb-4">
            <h2 className="font-serif text-[18px] mb-2">Experience</h2>
            {data.experience.map((e) => (
              <div key={e.id} className="mb-3 text-[11px]">
                <div className="flex justify-between"><b>{e.position}</b><span className="text-neutral-500">{dateRange(e.startDate, e.endDate, e.current)}</span></div>
                <div className="italic text-neutral-600">{e.company}</div>
                {e.description && <p>{e.description}</p>}
                <ul className="ml-4 list-disc">{e.achievements.filter(Boolean).map((a, i) => <li key={i}>{a}</li>)}</ul>
              </div>
            ))}
          </section>
        )}
        {v.education && data.education.length > 0 && (
          <section className="mb-4">
            <h2 className="font-serif text-[18px] mb-2">Education</h2>
            {data.education.map((ed) => (
              <div key={ed.id} className="text-[11px] mb-1">
                <div className="flex justify-between"><b>{ed.school}</b><span className="text-neutral-500">{dateRange(ed.startDate, ed.endDate)}</span></div>
                <div>{ed.degree}, {ed.field}</div>
              </div>
            ))}
          </section>
        )}
        {v.projects && data.projects.length > 0 && (
          <section>
            <h2 className="font-serif text-[18px] mb-2">Projects</h2>
            {data.projects.map((p) => (
              <div key={p.id} className="text-[11px] mb-2"><b>{p.title}</b> <span className="text-neutral-500">— {p.tech}</span><div>{p.description}</div></div>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}

export function ExecutiveTemplate({ data }: Props) {
  const accent = data.theme.accentColor;
  const style = getThemeVars(data.theme);
  return (
    <div style={{ ...style, color: "#1a1a1a" }}>
      <header className="border-b-2 pb-3 mb-4" style={{ borderColor: accent }}>
        <h1 className="font-serif text-[36px] leading-none">{data.personal.fullName}</h1>
        <div className="mt-1 flex justify-between items-baseline">
          <p className="text-[13px] italic text-neutral-700">{data.personal.title}</p>
          <p className="text-[10.5px] text-neutral-600">{[data.personal.email, data.personal.phone, data.personal.address].filter(Boolean).join("  ·  ")}</p>
        </div>
      </header>
      <OrderedSections
        data={data}
        renderTitle={(t) => (
          <h2 className="font-serif text-[13px] uppercase tracking-[0.25em] mb-2" style={{ color: accent }}>{t}</h2>
        )}
      />
    </div>
  );
}

// ---------- 5 NEW TEMPLATES ----------

export function ClassicTemplate({ data }: Props) {
  const accent = data.theme.accentColor;
  const style = getThemeVars(data.theme);
  return (
    <div style={{ ...style, color: "#1a1a1a" }} className="font-serif">
      <header className="text-center mb-4 pb-3 border-b-2" style={{ borderColor: "#222" }}>
        <h1 className="text-[34px] leading-none">{data.personal.fullName}</h1>
        <p className="mt-1 text-[12px] italic">{data.personal.title}</p>
        <p className="mt-1 text-[10.5px]" style={{ fontFamily: "Inter, sans-serif" }}>
          {[data.personal.email, data.personal.phone, data.personal.address, data.personal.linkedin, data.personal.website].filter(Boolean).join(" · ")}
        </p>
      </header>
      <OrderedSections
        data={data}
        renderTitle={(t) => (
          <h2 className="text-[13px] mb-1 italic" style={{ color: accent, borderBottom: `1px solid ${accent}` }}>{t}</h2>
        )}
      />
    </div>
  );
}

export function CreativeTemplate({ data }: Props) {
  const v = data.visibility;
  const accent = data.theme.accentColor;
  const style = getThemeVars(data.theme);
  return (
    <div style={{ ...style, color: "#1a1a1a" }} className="grid grid-cols-[1fr_220px] gap-5">
      <main>
        <header className="mb-5">
          <h1 className="font-serif text-[44px] leading-none">{data.personal.fullName}</h1>
          <div className="mt-2 inline-block px-3 py-0.5 text-[11px] uppercase tracking-[0.2em] text-white" style={{ background: accent }}>
            {data.personal.title}
          </div>
        </header>
        <OrderedSections
          data={{ ...data, sectionOrder: data.sectionOrder.filter((k) => !["skills", "languages", "interests", "links"].includes(k)) }}
          renderTitle={(t) => (
            <h2 className="font-serif text-[18px] mb-2" style={{ color: accent }}>
              <span style={{ background: accent }} className="inline-block w-3 h-3 mr-2 align-middle" />
              {t}
            </h2>
          )}
        />
      </main>
      <aside className="border-l pl-4 text-[10.5px]" style={{ borderColor: accent }}>
        <h3 className="font-serif text-[14px] mb-2" style={{ color: accent }}>Contact</h3>
        <div className="space-y-1 text-neutral-700">
          {data.personal.email && <div>{data.personal.email}</div>}
          {data.personal.phone && <div>{data.personal.phone}</div>}
          {data.personal.address && <div>{data.personal.address}</div>}
        </div>
        {v.links && data.links.length > 0 && (
          <>
            <h3 className="font-serif text-[14px] mt-4 mb-2" style={{ color: accent }}>Links</h3>
            <div className="space-y-1">
              {data.links.map((l) => (
                <a key={l.id} href={hrefify(l.url)} target="_blank" rel="noreferrer" className="block underline decoration-dotted" style={{ color: accent }}>{l.label || l.url}</a>
              ))}
            </div>
          </>
        )}
        {v.skills && data.skills.length > 0 && (
          <>
            <h3 className="font-serif text-[14px] mt-4 mb-2" style={{ color: accent }}>Skills</h3>
            <div className="flex flex-wrap gap-1">
              {data.skills.map((s) => (
                <span key={s.id} className="px-1.5 py-0.5 text-[10px] text-white" style={{ background: accent }}>{s.name}</span>
              ))}
            </div>
          </>
        )}
        {v.languages && data.languages.length > 0 && (
          <>
            <h3 className="font-serif text-[14px] mt-4 mb-2" style={{ color: accent }}>Languages</h3>
            {data.languages.map((l) => <div key={l.id}>{l.name} — {l.proficiency}</div>)}
          </>
        )}
      </aside>
    </div>
  );
}

export function CompactTemplate({ data }: Props) {
  const accent = data.theme.accentColor;
  const style = { ...getThemeVars(data.theme), fontSize: "10px", lineHeight: 1.35 } as React.CSSProperties;
  return (
    <div style={{ ...style, color: "#1a1a1a" }}>
      <header className="flex items-baseline justify-between gap-4 mb-3 border-b pb-2" style={{ borderColor: accent }}>
        <div>
          <h1 className="font-serif text-[24px] leading-none">{data.personal.fullName}</h1>
          <p className="text-[10px] uppercase tracking-[0.18em]" style={{ color: accent }}>{data.personal.title}</p>
        </div>
        <p className="text-[9.5px] text-neutral-600 text-right">
          {[data.personal.email, data.personal.phone, data.personal.address].filter(Boolean).join(" · ")}<br />
          {[data.personal.linkedin, data.personal.github, data.personal.website].filter(Boolean).join(" · ")}
        </p>
      </header>
      <OrderedSections
        data={data}
        renderTitle={(t) => (
          <h2 className="text-[10.5px] font-bold uppercase tracking-[0.2em] mb-1" style={{ color: accent }}>{t}</h2>
        )}
      />
    </div>
  );
}

export function ElegantTemplate({ data }: Props) {
  const accent = data.theme.accentColor;
  const style = getThemeVars(data.theme);
  return (
    <div style={{ ...style, color: "#1a1a1a" }} className="font-serif">
      <header className="mb-6 text-center">
        <div className="mx-auto w-16 h-px" style={{ background: accent }} />
        <h1 className="mt-4 text-[38px] leading-none">{data.personal.fullName}</h1>
        <p className="mt-2 text-[11px] tracking-[0.4em] uppercase" style={{ fontFamily: "Inter, sans-serif", color: accent }}>
          {data.personal.title}
        </p>
        <div className="mt-3 mx-auto w-16 h-px" style={{ background: accent }} />
        <p className="mt-3 text-[10.5px] text-neutral-700" style={{ fontFamily: "Inter, sans-serif" }}>
          {[data.personal.email, data.personal.phone, data.personal.address, data.personal.website].filter(Boolean).join("   ·   ")}
        </p>
      </header>
      <OrderedSections
        data={data}
        renderTitle={(t) => (
          <div className="text-center mb-3">
            <h2 className="inline-block text-[12px] tracking-[0.4em] uppercase px-3" style={{ fontFamily: "Inter, sans-serif", color: accent, borderTop: `1px solid ${accent}`, borderBottom: `1px solid ${accent}`, paddingTop: 4, paddingBottom: 4 }}>
              {t}
            </h2>
          </div>
        )}
      />
    </div>
  );
}

export function TechnicalTemplate({ data }: Props) {
  const v = data.visibility;
  const accent = data.theme.accentColor;
  const style = { ...getThemeVars(data.theme), fontFamily: '"JetBrains Mono", ui-monospace, monospace' } as React.CSSProperties;
  return (
    <div style={{ ...style, color: "#111" }}>
      <header className="mb-4 pb-2 border-b" style={{ borderColor: accent }}>
        <div className="text-[10px]" style={{ color: accent }}>$ whoami</div>
        <h1 className="text-[26px] font-bold">{data.personal.fullName}</h1>
        <div className="text-[11px]">{data.personal.title}</div>
        <div className="mt-2 text-[10px] text-neutral-700">
          {[data.personal.email, data.personal.phone, data.personal.github, data.personal.linkedin, data.personal.website].filter(Boolean).map((x, i, arr) => (
            <span key={i}>{x}{i < arr.length - 1 ? "  ·  " : ""}</span>
          ))}
        </div>
      </header>
      <OrderedSections
        data={{ ...data, sectionOrder: data.sectionOrder.filter((k) => k !== "skills") }}
        renderTitle={(t) => (
          <h2 className="text-[11px] font-bold mb-1" style={{ color: accent }}>{`// ${t.toUpperCase()}`}</h2>
        )}
      />
      {v.skills && data.skills.length > 0 && (
        <section className="mb-4">
          <h2 className="text-[11px] font-bold mb-1" style={{ color: accent }}>{"// SKILLS"}</h2>
          <div className="space-y-1 text-[10.5px]">
            {data.skills.map((s) => (
              <div key={s.id} className="flex items-center gap-2">
                <span className="w-32 truncate">{s.name}</span>
                <span className="flex-1 h-1.5 bg-neutral-200 rounded">
                  <span className="block h-full rounded" style={{ width: `${s.level * 20}%`, background: accent }} />
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

export const TEMPLATES = {
  modern: { id: "modern", name: "Modern Professional", component: ModernTemplate },
  ats: { id: "ats", name: "ATS Friendly", component: AtsTemplate },
  minimal: { id: "minimal", name: "Minimal Editorial", component: MinimalTemplate },
  sidebar: { id: "sidebar", name: "Sidebar Layout", component: SidebarTemplate },
  executive: { id: "executive", name: "Executive Corporate", component: ExecutiveTemplate },
  classic: { id: "classic", name: "Classic Traditional", component: ClassicTemplate },
  creative: { id: "creative", name: "Creative Studio", component: CreativeTemplate },
  compact: { id: "compact", name: "Compact One-Pager", component: CompactTemplate },
  elegant: { id: "elegant", name: "Elegant Serif", component: ElegantTemplate },
  technical: { id: "technical", name: "Technical Developer", component: TechnicalTemplate },
} as const;