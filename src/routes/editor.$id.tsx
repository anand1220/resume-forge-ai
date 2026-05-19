import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useResumeStore } from "@/store/resumeStore";
import { ResumeEditor } from "@/components/ResumeEditor";
import { ResumePreview } from "@/components/ResumePreview";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/Logo";
import { ArrowLeft, Download, Check, Palette, Layers, Sparkles, FileText } from "lucide-react";
import { TEMPLATES } from "@/templates";
import { exportResumeToPdf } from "@/lib/pdf";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import type { TemplateId } from "@/lib/types";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

export const Route = createFileRoute("/editor/$id")({
  head: () => ({ meta: [{ title: "Editor — ResumeForge AI" }, { name: "description", content: "Edit your resume." }] }),
  component: EditorPage,
});

function EditorPage() {
  const { id } = Route.useParams();
  const nav = useNavigate();
  const data = useResumeStore((s) => s.resumes.find((r) => r.id === id));
  const updateResume = useResumeStore((s) => s.updateResume);
  const previewRef = useRef<HTMLDivElement>(null);
  const [tab, setTab] = useState<"edit" | "preview">("edit");
  const [savedAt, setSavedAt] = useState(Date.now());
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    if (!data) {
      toast.error("Resume not found");
      nav({ to: "/dashboard" });
    }
  }, [data, nav]);

  useEffect(() => { if (data) setSavedAt(data.updatedAt); }, [data?.updatedAt]);

  if (!data) return null;

  const handleExport = async () => {
    setExporting(true);
    try {
      await exportResumeToPdf(data, `${data.name.replace(/\s+/g, "_")}.pdf`);
      toast.success("PDF downloaded");
    } catch (e) {
      console.error(e);
      toast.error("Export failed");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary/30 overflow-x-hidden">
      {/* Toolbar */}
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur border-b border-border/60">
        <div className="px-3 sm:px-4 lg:px-6 h-14 flex items-center gap-2 sm:gap-3">
          <Button asChild size="icon" variant="ghost" className="shrink-0 h-10 w-10"><Link to="/dashboard"><ArrowLeft className="w-4 h-4" /></Link></Button>
          <Logo className="hidden md:inline-flex" />
          <div className="h-6 w-px bg-border mx-2 hidden md:block" />
          <Input
            value={data.name}
            onChange={(e) => updateResume(data.id, { name: e.target.value })}
            className="min-w-0 flex-1 sm:flex-initial sm:max-w-xs font-serif text-base sm:text-lg border-transparent hover:border-border focus-visible:border-border h-10"
          />
          <span className="text-xs text-muted-foreground hidden xl:inline-flex items-center gap-1 shrink-0">
            <Check className="w-3 h-3" /> Saved · {new Date(savedAt).toLocaleTimeString()}
          </span>

          <div className="ml-auto flex items-center gap-1.5 sm:gap-2 shrink-0">
            <div className="hidden sm:flex items-center gap-2">
              <TemplatePicker current={data.template} onChange={(t) => updateResume(data.id, { template: t })} />
              <ThemePopover data={data} />
              <AIPopover />
            </div>
            <Button onClick={handleExport} disabled={exporting} size="sm" className="bg-foreground text-background hover:bg-foreground/90 h-10">
              <Download className="w-4 h-4 sm:mr-1" /> <span className="hidden sm:inline">{exporting ? "Exporting…" : "PDF"}</span>
            </Button>
          </div>
        </div>

        {/* Mobile toolbar row (template/theme/AI) */}
        <div className="sm:hidden flex items-center gap-1.5 px-3 pb-2 overflow-x-auto">
          <TemplatePicker current={data.template} onChange={(t) => updateResume(data.id, { template: t })} />
          <ThemePopover data={data} />
          <AIPopover />
        </div>

        {/* Mobile tabs */}
        <div className="lg:hidden flex border-t border-border/60">
          <button onClick={() => setTab("edit")} className={`flex-1 py-3 text-sm font-medium ${tab==="edit" ? "border-b-2 border-foreground" : "text-muted-foreground"}`}>Edit</button>
          <button onClick={() => setTab("preview")} className={`flex-1 py-3 text-sm font-medium ${tab==="preview" ? "border-b-2 border-foreground" : "text-muted-foreground"}`}>Preview</button>
        </div>
      </header>

      <div className="grid lg:grid-cols-2 gap-0 lg:gap-6 lg:p-6 max-w-[1600px] mx-auto">
        {/* Form */}
        <section className={`p-3 sm:p-4 lg:p-0 lg:overflow-y-auto lg:max-h-[calc(100vh-3.5rem-3rem)] min-w-0 ${tab==="preview" ? "hidden lg:block" : ""}`}>
          <ResumeEditor data={data} />
        </section>

        {/* Preview */}
        <section className={`p-3 sm:p-4 lg:p-0 lg:sticky lg:top-[5.5rem] lg:self-start min-w-0 ${tab==="edit" ? "hidden lg:block" : ""}`}>
          <div className="lg:max-h-[calc(100vh-7rem)] overflow-auto rounded-lg w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={data.template}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="w-full"
              >
                <ResumePreview ref={previewRef} data={data} maxScale={1} />
              </motion.div>
            </AnimatePresence>
          </div>
        </section>
      </div>
    </div>
  );
}

function TemplatePicker({ current, onChange }: { current: TemplateId; onChange: (t: TemplateId) => void }) {
  const keys = Object.keys(TEMPLATES) as TemplateId[];
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm"><Layers className="w-4 h-4 mr-1.5" /> {TEMPLATES[current].name}</Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-56 p-1">
        {keys.map((k) => (
          <button key={k} onClick={() => onChange(k)} className={`w-full text-left px-3 py-2 text-sm rounded-md hover:bg-secondary flex items-center justify-between ${k===current ? "bg-secondary" : ""}`}>
            <span>{TEMPLATES[k].name}</span>
            {k === current && <Check className="w-3.5 h-3.5" />}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
}

function ThemePopover({ data }: { data: ReturnType<typeof useResumeStore.getState>["resumes"][number] }) {
  const updateResume = useResumeStore((s) => s.updateResume);
  const set = (patch: Partial<typeof data.theme>) => updateResume(data.id, { theme: { ...data.theme, ...patch } });
  const palette = ["#d4af37", "#1a1a1a", "#8b7355", "#0c6e58", "#2a6cb0", "#9b1c1c", "#7c3aed", "#c2410c"];
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm"><Palette className="w-4 h-4 mr-1.5" /> Theme</Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72">
        <div className="space-y-4 text-sm">
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">Accent color</div>
            <div className="flex flex-wrap gap-2">
              {palette.map((c) => (
                <button key={c} onClick={() => set({ accentColor: c })} className={`w-7 h-7 rounded-full border-2 ${data.theme.accentColor===c ? "ring-2 ring-foreground ring-offset-2 ring-offset-background" : ""}`} style={{ background: c, borderColor: c }} />
              ))}
            </div>
          </div>
          <ThemeRow label="Heading font">
            <select className="w-full h-8 rounded-md border px-2 bg-background" value={data.theme.fontFamily} onChange={(e) => set({ fontFamily: e.target.value as "serif" | "sans" })}>
              <option value="serif">Instrument Serif</option>
              <option value="sans">Inter Sans</option>
            </select>
          </ThemeRow>
          <ThemeRow label="Font size">
            <select className="w-full h-8 rounded-md border px-2 bg-background" value={data.theme.fontSize} onChange={(e) => set({ fontSize: e.target.value as "sm"|"md"|"lg" })}>
              <option value="sm">Small</option><option value="md">Medium</option><option value="lg">Large</option>
            </select>
          </ThemeRow>
          <ThemeRow label="Section spacing">
            <select className="w-full h-8 rounded-md border px-2 bg-background" value={data.theme.spacing} onChange={(e) => set({ spacing: e.target.value as "tight"|"normal"|"loose" })}>
              <option value="tight">Tight</option><option value="normal">Normal</option><option value="loose">Loose</option>
            </select>
          </ThemeRow>
          <ThemeRow label="Line height">
            <select className="w-full h-8 rounded-md border px-2 bg-background" value={data.theme.lineHeight} onChange={(e) => set({ lineHeight: e.target.value as "tight"|"normal"|"loose" })}>
              <option value="tight">Tight</option><option value="normal">Normal</option><option value="loose">Loose</option>
            </select>
          </ThemeRow>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function ThemeRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">{label}</div>
      {children}
    </div>
  );
}

function AIPopover() {
  const score = 86;
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm"><Sparkles className="w-4 h-4 mr-1.5" style={{ color: "var(--color-gold)" }} /> AI</Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80">
        <div className="space-y-4">
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Resume Score</div>
            <div className="mt-1 flex items-baseline gap-2">
              <div className="font-serif text-4xl">{score}</div>
              <div className="text-sm text-muted-foreground">/ 100</div>
            </div>
            <div className="h-1.5 mt-2 bg-secondary rounded-full overflow-hidden"><div className="h-full" style={{ width: `${score}%`, background: "var(--color-gold)" }} /></div>
          </div>
          <div className="text-sm space-y-2">
            <div className="font-medium flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> ATS keyword suggestions</div>
            <div className="flex flex-wrap gap-1.5">
              {["typescript","systems thinking","cross-functional","stakeholder","quantitative"].map(k => (
                <span key={k} className="text-xs px-2 py-0.5 rounded-full bg-secondary border border-border">{k}</span>
              ))}
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Pro-only AI rewrites are gated. Try the demo from the summary field.</p>
        </div>
      </PopoverContent>
    </Popover>
  );
}
