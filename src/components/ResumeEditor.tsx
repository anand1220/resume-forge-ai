import { useResumeStore } from "@/store/resumeStore";
import type { ResumeData } from "@/lib/types";
import { uid } from "@/lib/sample";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Plus, Trash2, Sparkles, GripVertical } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Props { data: ResumeData }

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs uppercase tracking-wider text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

function SectionShell({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="border border-border/60 rounded-lg bg-card p-5 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-serif text-xl">{title}</h3>
        {action}
      </div>
      {children}
    </div>
  );
}

export function ResumeEditor({ data }: Props) {
  const updateResume = useResumeStore((s) => s.updateResume);
  const set = (patch: Partial<ResumeData> | ((r: ResumeData) => ResumeData)) => updateResume(data.id, patch);

  const updatePersonal = (k: keyof ResumeData["personal"], v: string) =>
    set((r) => ({ ...r, personal: { ...r.personal, [k]: v } }));

  return (
    <div>
      {/* Personal */}
      <SectionShell title="Personal Information">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Full Name"><Input value={data.personal.fullName} onChange={(e) => updatePersonal("fullName", e.target.value)} /></Field>
          <Field label="Professional Title"><Input value={data.personal.title} onChange={(e) => updatePersonal("title", e.target.value)} /></Field>
          <Field label="Email"><Input type="email" value={data.personal.email} onChange={(e) => updatePersonal("email", e.target.value)} /></Field>
          <Field label="Phone"><Input value={data.personal.phone} onChange={(e) => updatePersonal("phone", e.target.value)} /></Field>
          <Field label="Location"><Input value={data.personal.address} onChange={(e) => updatePersonal("address", e.target.value)} /></Field>
          <Field label="Website"><Input value={data.personal.website} onChange={(e) => updatePersonal("website", e.target.value)} /></Field>
          <Field label="LinkedIn"><Input value={data.personal.linkedin} onChange={(e) => updatePersonal("linkedin", e.target.value)} /></Field>
          <Field label="GitHub"><Input value={data.personal.github} onChange={(e) => updatePersonal("github", e.target.value)} /></Field>
        </div>
        <div className="mt-3">
          <Field label="Professional Summary">
            <Textarea rows={4} value={data.personal.summary} onChange={(e) => updatePersonal("summary", e.target.value)} />
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="mt-2 text-xs"
              onClick={() => {
                updatePersonal(
                  "summary",
                  `${data.personal.title || "Professional"} with proven experience driving impact through ${data.skills.slice(0,3).map(s=>s.name).join(", ") || "core skills"}. Known for shipping calmly and collaborating across functions to deliver durable outcomes.`,
                );
                toast.success("AI summary drafted");
              }}
            >
              <Sparkles className="w-3 h-3 mr-1" /> Generate with AI
            </Button>
          </Field>
        </div>
      </SectionShell>

      {/* Experience */}
      <SectionShell
        title="Experience"
        action={
          <Button size="sm" variant="outline" onClick={() =>
            set((r) => ({ ...r, experience: [...r.experience, { id: uid(), company: "", position: "", startDate: "", endDate: "", current: false, description: "", achievements: [""] }] }))
          }><Plus className="w-3.5 h-3.5 mr-1" /> Add</Button>
        }
      >
        {data.experience.map((exp, idx) => (
          <div key={exp.id} className="mb-4 pb-4 border-b last:border-0 border-border/60">
            <div className="flex items-center gap-2 mb-3 text-muted-foreground text-xs">
              <GripVertical className="w-4 h-4" /> #{idx + 1}
              <Button size="icon" variant="ghost" className="ml-auto h-7 w-7" onClick={() => set((r) => ({ ...r, experience: r.experience.filter((x) => x.id !== exp.id) }))}>
                <Trash2 className="w-3.5 h-3.5" />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Position"><Input value={exp.position} onChange={(e) => set((r) => ({ ...r, experience: r.experience.map(x => x.id===exp.id ? { ...x, position: e.target.value } : x) }))} /></Field>
              <Field label="Company"><Input value={exp.company} onChange={(e) => set((r) => ({ ...r, experience: r.experience.map(x => x.id===exp.id ? { ...x, company: e.target.value } : x) }))} /></Field>
              <Field label="Start (YYYY-MM)"><Input type="month" value={exp.startDate} onChange={(e) => set((r) => ({ ...r, experience: r.experience.map(x => x.id===exp.id ? { ...x, startDate: e.target.value } : x) }))} /></Field>
              <Field label="End">
                <div className="flex gap-2 items-center">
                  <Input type="month" disabled={exp.current} value={exp.endDate} onChange={(e) => set((r) => ({ ...r, experience: r.experience.map(x => x.id===exp.id ? { ...x, endDate: e.target.value } : x) }))} />
                  <label className="flex items-center gap-1 text-xs whitespace-nowrap">
                    <Switch checked={exp.current} onCheckedChange={(v) => set((r) => ({ ...r, experience: r.experience.map(x => x.id===exp.id ? { ...x, current: v } : x) }))} /> Current
                  </label>
                </div>
              </Field>
            </div>
            <div className="mt-3">
              <Field label="Description"><Textarea rows={2} value={exp.description} onChange={(e) => set((r) => ({ ...r, experience: r.experience.map(x => x.id===exp.id ? { ...x, description: e.target.value } : x) }))} /></Field>
            </div>
            <div className="mt-3">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">Achievements</Label>
              {exp.achievements.map((a, i) => (
                <div key={i} className="flex gap-2 mt-2">
                  <Input value={a} placeholder="Started with a verb. Quantify the impact." onChange={(e) => set((r) => ({ ...r, experience: r.experience.map(x => x.id===exp.id ? { ...x, achievements: x.achievements.map((aa, ii) => ii===i ? e.target.value : aa) } : x) }))} />
                  <Button size="icon" variant="ghost" onClick={() => set((r) => ({ ...r, experience: r.experience.map(x => x.id===exp.id ? { ...x, achievements: x.achievements.filter((_, ii) => ii!==i) } : x) }))}><Trash2 className="w-3.5 h-3.5" /></Button>
                </div>
              ))}
              <Button size="sm" variant="ghost" className="mt-2 text-xs" onClick={() => set((r) => ({ ...r, experience: r.experience.map(x => x.id===exp.id ? { ...x, achievements: [...x.achievements, ""] } : x) }))}>
                <Plus className="w-3 h-3 mr-1" /> Add bullet
              </Button>
            </div>
          </div>
        ))}
      </SectionShell>

      {/* Education */}
      <SectionShell
        title="Education"
        action={<Button size="sm" variant="outline" onClick={() => set((r) => ({ ...r, education: [...r.education, { id: uid(), school: "", degree: "", field: "", startDate: "", endDate: "", gpa: "", description: "" }] }))}><Plus className="w-3.5 h-3.5 mr-1" /> Add</Button>}
      >
        {data.education.map((ed) => (
          <div key={ed.id} className="mb-4 pb-4 border-b last:border-0 border-border/60">
            <div className="flex justify-end -mb-2">
              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => set((r) => ({ ...r, education: r.education.filter(x => x.id !== ed.id) }))}><Trash2 className="w-3.5 h-3.5" /></Button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="School"><Input value={ed.school} onChange={(e) => set((r) => ({ ...r, education: r.education.map(x => x.id===ed.id ? { ...x, school: e.target.value } : x) }))} /></Field>
              <Field label="Degree"><Input value={ed.degree} onChange={(e) => set((r) => ({ ...r, education: r.education.map(x => x.id===ed.id ? { ...x, degree: e.target.value } : x) }))} /></Field>
              <Field label="Field"><Input value={ed.field} onChange={(e) => set((r) => ({ ...r, education: r.education.map(x => x.id===ed.id ? { ...x, field: e.target.value } : x) }))} /></Field>
              <Field label="GPA"><Input value={ed.gpa} onChange={(e) => set((r) => ({ ...r, education: r.education.map(x => x.id===ed.id ? { ...x, gpa: e.target.value } : x) }))} /></Field>
              <Field label="Start"><Input type="month" value={ed.startDate} onChange={(e) => set((r) => ({ ...r, education: r.education.map(x => x.id===ed.id ? { ...x, startDate: e.target.value } : x) }))} /></Field>
              <Field label="End"><Input type="month" value={ed.endDate} onChange={(e) => set((r) => ({ ...r, education: r.education.map(x => x.id===ed.id ? { ...x, endDate: e.target.value } : x) }))} /></Field>
            </div>
          </div>
        ))}
      </SectionShell>

      {/* Skills */}
      <SectionShell
        title="Skills"
        action={<Button size="sm" variant="outline" onClick={() => set((r) => ({ ...r, skills: [...r.skills, { id: uid(), name: "", level: 4, category: "Other" }] }))}><Plus className="w-3.5 h-3.5 mr-1" /> Add</Button>}
      >
        <div className="grid grid-cols-2 gap-2">
          {data.skills.map((s) => (
            <div key={s.id} className="flex gap-2 items-center">
              <Input value={s.name} placeholder="Skill" onChange={(e) => set((r) => ({ ...r, skills: r.skills.map(x => x.id===s.id ? { ...x, name: e.target.value } : x) }))} />
              <select className="h-9 px-2 rounded-md border bg-background text-sm" value={s.level} onChange={(e) => set((r) => ({ ...r, skills: r.skills.map(x => x.id===s.id ? { ...x, level: Number(e.target.value) } : x) }))}>
                {[1,2,3,4,5].map(n => <option key={n} value={n}>{"★".repeat(n)}</option>)}
              </select>
              <Button size="icon" variant="ghost" onClick={() => set((r) => ({ ...r, skills: r.skills.filter(x => x.id !== s.id) }))}><Trash2 className="w-3.5 h-3.5" /></Button>
            </div>
          ))}
        </div>
      </SectionShell>

      {/* Projects */}
      <SectionShell
        title="Projects"
        action={<Button size="sm" variant="outline" onClick={() => set((r) => ({ ...r, projects: [...r.projects, { id: uid(), title: "", tech: "", description: "", github: "", demo: "" }] }))}><Plus className="w-3.5 h-3.5 mr-1" /> Add</Button>}
      >
        {data.projects.map((p) => (
          <div key={p.id} className="mb-4 pb-4 border-b last:border-0 border-border/60">
            <div className="flex justify-end -mb-2">
              <Button size="icon" variant="ghost" className="h-7 w-7" onClick={() => set((r) => ({ ...r, projects: r.projects.filter(x => x.id !== p.id) }))}><Trash2 className="w-3.5 h-3.5" /></Button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Title"><Input value={p.title} onChange={(e) => set((r) => ({ ...r, projects: r.projects.map(x => x.id===p.id ? { ...x, title: e.target.value } : x) }))} /></Field>
              <Field label="Tech Stack"><Input value={p.tech} onChange={(e) => set((r) => ({ ...r, projects: r.projects.map(x => x.id===p.id ? { ...x, tech: e.target.value } : x) }))} /></Field>
              <Field label="GitHub"><Input value={p.github} onChange={(e) => set((r) => ({ ...r, projects: r.projects.map(x => x.id===p.id ? { ...x, github: e.target.value } : x) }))} /></Field>
              <Field label="Demo"><Input value={p.demo} onChange={(e) => set((r) => ({ ...r, projects: r.projects.map(x => x.id===p.id ? { ...x, demo: e.target.value } : x) }))} /></Field>
            </div>
            <div className="mt-3"><Field label="Description"><Textarea rows={2} value={p.description} onChange={(e) => set((r) => ({ ...r, projects: r.projects.map(x => x.id===p.id ? { ...x, description: e.target.value } : x) }))} /></Field></div>
          </div>
        ))}
      </SectionShell>

      <SimpleListSection title="Certifications" items={data.certifications.map(c => ({ id: c.id, text: `${c.name} — ${c.issuer} (${c.date})` }))}
        onAdd={() => set((r) => ({ ...r, certifications: [...r.certifications, { id: uid(), name: "New certification", issuer: "", date: "" }] }))}
        onRemove={(id) => set((r) => ({ ...r, certifications: r.certifications.filter(x => x.id !== id) }))} />

      <SimpleListSection title="Languages" items={data.languages.map(l => ({ id: l.id, text: `${l.name} — ${l.proficiency}` }))}
        onAdd={() => set((r) => ({ ...r, languages: [...r.languages, { id: uid(), name: "English", proficiency: "Native" }] }))}
        onRemove={(id) => set((r) => ({ ...r, languages: r.languages.filter(x => x.id !== id) }))} />

      <SectionShell title="Achievements" action={<Button size="sm" variant="outline" onClick={() => set(r => ({ ...r, achievements: [...r.achievements, { id: uid(), text: "" }] }))}><Plus className="w-3.5 h-3.5 mr-1" /> Add</Button>}>
        {data.achievements.map(a => (
          <div key={a.id} className="flex gap-2 mb-2">
            <Input value={a.text} onChange={(e) => set(r => ({ ...r, achievements: r.achievements.map(x => x.id===a.id ? { ...x, text: e.target.value } : x) }))} />
            <Button size="icon" variant="ghost" onClick={() => set(r => ({ ...r, achievements: r.achievements.filter(x => x.id !== a.id) }))}><Trash2 className="w-3.5 h-3.5" /></Button>
          </div>
        ))}
      </SectionShell>

      <SectionShell title="Interests" action={<Button size="sm" variant="outline" onClick={() => set(r => ({ ...r, interests: [...r.interests, { id: uid(), text: "" }] }))}><Plus className="w-3.5 h-3.5 mr-1" /> Add</Button>}>
        {data.interests.map(a => (
          <div key={a.id} className="flex gap-2 mb-2">
            <Input value={a.text} onChange={(e) => set(r => ({ ...r, interests: r.interests.map(x => x.id===a.id ? { ...x, text: e.target.value } : x) }))} />
            <Button size="icon" variant="ghost" onClick={() => set(r => ({ ...r, interests: r.interests.filter(x => x.id !== a.id) }))}><Trash2 className="w-3.5 h-3.5" /></Button>
          </div>
        ))}
      </SectionShell>

      <CustomSections data={data} />

      <VisibilityToggles data={data} />
    </div>
  );
}

function SimpleListSection({ title, items, onAdd, onRemove }: { title: string; items: { id: string; text: string }[]; onAdd: () => void; onRemove: (id: string) => void }) {
  return (
    <SectionShell title={title} action={<Button size="sm" variant="outline" onClick={onAdd}><Plus className="w-3.5 h-3.5 mr-1" /> Add</Button>}>
      <p className="text-xs text-muted-foreground mb-2">Edit values from the structured fields below.</p>
      {items.map((it) => (
        <div key={it.id} className="flex items-center justify-between border-b border-border/40 py-2 text-sm">
          <span>{it.text}</span>
          <Button size="icon" variant="ghost" onClick={() => onRemove(it.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
        </div>
      ))}
    </SectionShell>
  );
}

function CustomSections({ data }: { data: ResumeData }) {
  const updateResume = useResumeStore((s) => s.updateResume);
  const set = (patch: (r: ResumeData) => ResumeData) => updateResume(data.id, patch);
  const [title, setTitle] = useState("");
  return (
    <SectionShell title="Custom Sections" action={
      <div className="flex gap-2">
        <Input placeholder="Section title" value={title} onChange={(e) => setTitle(e.target.value)} className="h-8 w-44" />
        <Button size="sm" disabled={!title.trim()} onClick={() => { set(r => ({ ...r, customSections: [...r.customSections, { id: uid(), title: title.trim(), items: [{ id: uid(), text: "" }] }] })); setTitle(""); }}>
          <Plus className="w-3.5 h-3.5 mr-1" /> Add
        </Button>
      </div>
    }>
      {data.customSections.length === 0 && <p className="text-xs text-muted-foreground">Add awards, publications, volunteering — anything else.</p>}
      {data.customSections.map(cs => (
        <div key={cs.id} className="mb-4 pb-4 border-b border-border/60 last:border-0">
          <div className="flex items-center justify-between mb-2">
            <Input value={cs.title} onChange={(e) => set(r => ({ ...r, customSections: r.customSections.map(x => x.id===cs.id ? { ...x, title: e.target.value } : x) }))} className="font-serif text-lg w-72" />
            <Button size="icon" variant="ghost" onClick={() => set(r => ({ ...r, customSections: r.customSections.filter(x => x.id !== cs.id) }))}><Trash2 className="w-4 h-4" /></Button>
          </div>
          {cs.items.map(it => (
            <div key={it.id} className="flex gap-2 mb-2">
              <Input value={it.text} onChange={(e) => set(r => ({ ...r, customSections: r.customSections.map(x => x.id===cs.id ? { ...x, items: x.items.map(y => y.id===it.id ? { ...y, text: e.target.value } : y) } : x) }))} />
              <Button size="icon" variant="ghost" onClick={() => set(r => ({ ...r, customSections: r.customSections.map(x => x.id===cs.id ? { ...x, items: x.items.filter(y => y.id !== it.id) } : x) }))}><Trash2 className="w-3.5 h-3.5" /></Button>
            </div>
          ))}
          <Button size="sm" variant="ghost" onClick={() => set(r => ({ ...r, customSections: r.customSections.map(x => x.id===cs.id ? { ...x, items: [...x.items, { id: uid(), text: "" }] } : x) }))}>
            <Plus className="w-3 h-3 mr-1" /> Add item
          </Button>
        </div>
      ))}
    </SectionShell>
  );
}

function VisibilityToggles({ data }: { data: ResumeData }) {
  const updateResume = useResumeStore((s) => s.updateResume);
  const keys = Object.keys(data.visibility) as (keyof ResumeData["visibility"])[];
  return (
    <SectionShell title="Section Visibility">
      <div className="grid grid-cols-2 gap-3">
        {keys.map(k => (
          <label key={k} className="flex items-center justify-between border border-border/60 rounded-md px-3 py-2 text-sm capitalize">
            <span>{k}</span>
            <Switch checked={data.visibility[k]} onCheckedChange={(v) => updateResume(data.id, (r) => ({ ...r, visibility: { ...r.visibility, [k]: v } }))} />
          </label>
        ))}
      </div>
    </SectionShell>
  );
}
