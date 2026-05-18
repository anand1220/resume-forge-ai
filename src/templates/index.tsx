import type { ResumeData } from "@/lib/types";
import { dateRange, getThemeVars } from "./helpers";
import { Mail, Phone, MapPin, Globe, Linkedin, Github } from "lucide-react";

interface Props { data: ResumeData }

function Section({ title, children, accent }: { title: string; children: React.ReactNode; accent: string }) {
  return (
    <section className="mb-5 break-inside-avoid">
      <h2
        className="font-serif text-[18px] tracking-tight mb-2 pb-1 border-b"
        style={{ borderColor: accent, color: "#1a1a1a" }}
      >
        {title}
      </h2>
      <div className="text-[11px]" style={{ color: "#222" }}>{children}</div>
    </section>
  );
}

export function ModernTemplate({ data }: Props) {
  const v = data.visibility;
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

      {v.summary && data.personal.summary && (
        <Section title="Summary" accent={accent}>
          <p>{data.personal.summary}</p>
        </Section>
      )}

      {v.experience && data.experience.length > 0 && (
        <Section title="Experience" accent={accent}>
          {data.experience.map((e) => (
            <div key={e.id} className="mb-3">
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
        </Section>
      )}

      {v.projects && data.projects.length > 0 && (
        <Section title="Projects" accent={accent}>
          {data.projects.map((p) => (
            <div key={p.id} className="mb-2">
              <div className="flex justify-between items-baseline">
                <span className="font-semibold">{p.title}</span>
                <span className="text-[10px] text-neutral-500">{p.tech}</span>
              </div>
              {p.description && <p>{p.description}</p>}
              <div className="text-[10px] text-neutral-500">
                {[p.github, p.demo].filter(Boolean).join(" · ")}
              </div>
            </div>
          ))}
        </Section>
      )}

      {v.education && data.education.length > 0 && (
        <Section title="Education" accent={accent}>
          {data.education.map((ed) => (
            <div key={ed.id} className="mb-2 flex justify-between items-baseline">
              <div>
                <div className="font-semibold">{ed.school}</div>
                <div className="text-neutral-700">{[ed.degree, ed.field].filter(Boolean).join(", ")}{ed.gpa && ` · GPA ${ed.gpa}`}</div>
                {ed.description && <div className="text-neutral-600">{ed.description}</div>}
              </div>
              <span className="text-[10px] text-neutral-500">{dateRange(ed.startDate, ed.endDate)}</span>
            </div>
          ))}
        </Section>
      )}

      {v.skills && data.skills.length > 0 && (
        <Section title="Skills" accent={accent}>
          <div className="flex flex-wrap gap-1.5">
            {data.skills.map((s) => (
              <span key={s.id} className="px-2 py-0.5 border text-[10.5px]" style={{ borderColor: accent }}>{s.name}</span>
            ))}
          </div>
        </Section>
      )}

      <div className="grid grid-cols-2 gap-x-6">
        {v.certifications && data.certifications.length > 0 && (
          <Section title="Certifications" accent={accent}>
            {data.certifications.map((c) => (
              <div key={c.id} className="mb-1">
                <div className="font-semibold">{c.name}</div>
                <div className="text-[10px] text-neutral-600">{c.issuer} · {c.date}</div>
              </div>
            ))}
          </Section>
        )}
        {v.languages && data.languages.length > 0 && (
          <Section title="Languages" accent={accent}>
            {data.languages.map((l) => (
              <div key={l.id}>{l.name} — <span className="text-neutral-600">{l.proficiency}</span></div>
            ))}
          </Section>
        )}
        {v.achievements && data.achievements.length > 0 && (
          <Section title="Achievements" accent={accent}>
            <ul className="ml-4 list-disc space-y-0.5">
              {data.achievements.map((a) => <li key={a.id}>{a.text}</li>)}
            </ul>
          </Section>
        )}
        {v.interests && data.interests.length > 0 && (
          <Section title="Interests" accent={accent}>
            {data.interests.map((i) => i.text).join(" · ")}
          </Section>
        )}
      </div>

      {data.customSections.map((cs) => (
        <Section key={cs.id} title={cs.title} accent={accent}>
          <ul className="ml-4 list-disc space-y-0.5">
            {cs.items.map((it) => <li key={it.id}>{it.text}</li>)}
          </ul>
        </Section>
      ))}
    </div>
  );
}

export function AtsTemplate({ data }: Props) {
  const v = data.visibility;
  const style = { ...getThemeVars(data.theme), fontFamily: '"Inter", system-ui, sans-serif', color: "#111" };
  return (
    <div style={style}>
      <h1 className="text-[22px] font-bold uppercase tracking-wider">{data.personal.fullName}</h1>
      <div className="text-[11px]">{data.personal.title}</div>
      <div className="text-[10.5px] mt-1">
        {[data.personal.email, data.personal.phone, data.personal.address, data.personal.linkedin, data.personal.github, data.personal.website].filter(Boolean).join(" | ")}
      </div>
      <hr className="my-3 border-black" />
      {v.summary && data.personal.summary && (
        <div className="mb-3">
          <h2 className="text-[12px] font-bold uppercase tracking-wider mb-1">Summary</h2>
          <p className="text-[11px]">{data.personal.summary}</p>
        </div>
      )}
      {v.experience && data.experience.length > 0 && (
        <div className="mb-3">
          <h2 className="text-[12px] font-bold uppercase tracking-wider mb-1">Experience</h2>
          {data.experience.map((e) => (
            <div key={e.id} className="mb-2 text-[11px]">
              <div className="flex justify-between">
                <span className="font-bold">{e.position}, {e.company}</span>
                <span>{dateRange(e.startDate, e.endDate, e.current)}</span>
              </div>
              {e.description && <p>{e.description}</p>}
              <ul className="ml-4 list-disc">
                {e.achievements.filter(Boolean).map((a, i) => <li key={i}>{a}</li>)}
              </ul>
            </div>
          ))}
        </div>
      )}
      {v.education && data.education.length > 0 && (
        <div className="mb-3">
          <h2 className="text-[12px] font-bold uppercase tracking-wider mb-1">Education</h2>
          {data.education.map((ed) => (
            <div key={ed.id} className="text-[11px] flex justify-between">
              <span><b>{ed.school}</b> — {ed.degree}, {ed.field}{ed.gpa && ` (GPA ${ed.gpa})`}</span>
              <span>{dateRange(ed.startDate, ed.endDate)}</span>
            </div>
          ))}
        </div>
      )}
      {v.skills && data.skills.length > 0 && (
        <div className="mb-3 text-[11px]">
          <h2 className="text-[12px] font-bold uppercase tracking-wider mb-1">Skills</h2>
          <p>{data.skills.map((s) => s.name).join(", ")}</p>
        </div>
      )}
      {v.projects && data.projects.length > 0 && (
        <div className="mb-3 text-[11px]">
          <h2 className="text-[12px] font-bold uppercase tracking-wider mb-1">Projects</h2>
          {data.projects.map((p) => (
            <div key={p.id} className="mb-1">
              <b>{p.title}</b> — {p.tech}<br />{p.description}
            </div>
          ))}
        </div>
      )}
      {v.certifications && data.certifications.length > 0 && (
        <div className="mb-3 text-[11px]">
          <h2 className="text-[12px] font-bold uppercase tracking-wider mb-1">Certifications</h2>
          {data.certifications.map((c) => <div key={c.id}>{c.name} — {c.issuer} ({c.date})</div>)}
        </div>
      )}
      {v.languages && data.languages.length > 0 && (
        <div className="text-[11px]"><b>Languages:</b> {data.languages.map((l) => `${l.name} (${l.proficiency})`).join(", ")}</div>
      )}
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
      {v.experience && data.experience.length > 0 && (
        <section className="mb-5">
          <h2 className="text-center text-[10.5px] tracking-[0.4em] uppercase mb-3" style={{ fontFamily: "Inter, sans-serif", color: accent }}>Experience</h2>
          {data.experience.map((e) => (
            <div key={e.id} className="mb-3 text-[11.5px]" style={{ fontFamily: "Inter, sans-serif" }}>
              <div className="flex justify-between"><b className="font-serif text-[14px]">{e.position}</b><span className="text-neutral-500">{dateRange(e.startDate, e.endDate, e.current)}</span></div>
              <div className="italic text-neutral-600">{e.company}</div>
              {e.description && <p className="mt-1">{e.description}</p>}
              <ul className="ml-4 list-disc">
                {e.achievements.filter(Boolean).map((a, i) => <li key={i}>{a}</li>)}
              </ul>
            </div>
          ))}
        </section>
      )}
      {v.education && data.education.length > 0 && (
        <section className="mb-5">
          <h2 className="text-center text-[10.5px] tracking-[0.4em] uppercase mb-3" style={{ fontFamily: "Inter, sans-serif", color: accent }}>Education</h2>
          {data.education.map((ed) => (
            <div key={ed.id} className="text-[11.5px] mb-2" style={{ fontFamily: "Inter, sans-serif" }}>
              <div className="flex justify-between"><b className="font-serif text-[14px]">{ed.school}</b><span className="text-neutral-500">{dateRange(ed.startDate, ed.endDate)}</span></div>
              <div className="italic">{ed.degree}, {ed.field}</div>
            </div>
          ))}
        </section>
      )}
      {v.skills && data.skills.length > 0 && (
        <section className="mb-5 text-center">
          <h2 className="text-[10.5px] tracking-[0.4em] uppercase mb-3" style={{ fontFamily: "Inter, sans-serif", color: accent }}>Skills</h2>
          <p className="text-[11.5px]" style={{ fontFamily: "Inter, sans-serif" }}>{data.skills.map(s => s.name).join("  ·  ")}</p>
        </section>
      )}
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
        {v.interests && data.interests.length > 0 && (
          <>
            <h3 className="mt-5 text-[10px] tracking-[0.3em] uppercase" style={{ color: accent }}>Interests</h3>
            <div className="mt-2 text-[10.5px]">{data.interests.map(i => i.text).join(" · ")}</div>
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
  const v = data.visibility;
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
      {v.summary && data.personal.summary && (
        <section className="mb-4">
          <h2 className="font-serif text-[13px] uppercase tracking-[0.25em] mb-1" style={{ color: accent }}>Executive Summary</h2>
          <p className="text-[11.5px]">{data.personal.summary}</p>
        </section>
      )}
      {v.experience && data.experience.length > 0 && (
        <section className="mb-4">
          <h2 className="font-serif text-[13px] uppercase tracking-[0.25em] mb-2" style={{ color: accent }}>Professional Experience</h2>
          {data.experience.map((e) => (
            <div key={e.id} className="mb-3 text-[11.5px]">
              <div className="flex justify-between"><b className="font-serif text-[15px]">{e.company}</b><span className="text-neutral-500 text-[10.5px]">{dateRange(e.startDate, e.endDate, e.current)}</span></div>
              <div className="italic">{e.position}</div>
              {e.description && <p className="mt-1">{e.description}</p>}
              <ul className="ml-4 list-disc mt-1">{e.achievements.filter(Boolean).map((a, i) => <li key={i}>{a}</li>)}</ul>
            </div>
          ))}
        </section>
      )}
      <div className="grid grid-cols-2 gap-x-6">
        {v.education && data.education.length > 0 && (
          <section>
            <h2 className="font-serif text-[13px] uppercase tracking-[0.25em] mb-1" style={{ color: accent }}>Education</h2>
            {data.education.map((ed) => (
              <div key={ed.id} className="text-[11.5px] mb-1"><b>{ed.school}</b><div>{ed.degree}, {ed.field}</div><div className="text-neutral-500 text-[10px]">{dateRange(ed.startDate, ed.endDate)}</div></div>
            ))}
          </section>
        )}
        {v.skills && data.skills.length > 0 && (
          <section>
            <h2 className="font-serif text-[13px] uppercase tracking-[0.25em] mb-1" style={{ color: accent }}>Core Competencies</h2>
            <p className="text-[11.5px]">{data.skills.map(s => s.name).join("  ·  ")}</p>
          </section>
        )}
      </div>
    </div>
  );
}

export const TEMPLATES = {
  modern: { id: "modern", name: "Modern Professional", component: ModernTemplate },
  ats: { id: "ats", name: "ATS Friendly", component: AtsTemplate },
  minimal: { id: "minimal", name: "Minimal Editorial", component: MinimalTemplate },
  sidebar: { id: "sidebar", name: "Sidebar Layout", component: SidebarTemplate },
  executive: { id: "executive", name: "Executive Corporate", component: ExecutiveTemplate },
} as const;
