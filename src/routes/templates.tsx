import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { TEMPLATES } from "@/templates";
import { createEmptyResume } from "@/lib/sample";
import { MarketingNav, MarketingFooter } from "@/components/Marketing";
import { Button } from "@/components/ui/button";
import { useResumeStore } from "@/store/resumeStore";
import type { TemplateId } from "@/lib/types";

export const Route = createFileRoute("/templates")({
  head: () => ({ meta: [{ title: "Templates — ResumeForge AI" }, { name: "description", content: "Five hand-crafted resume templates: Modern, ATS, Minimal Editorial, Sidebar, Executive." }] }),
  component: TemplatesPage,
});

const sample = createEmptyResume("Sample");

function TemplatesPage() {
  const createResume = useResumeStore((s) => s.createResume);
  const updateResume = useResumeStore((s) => s.updateResume);
  const nav = useNavigate();
  const keys = Object.keys(TEMPLATES) as TemplateId[];

  const use = (t: TemplateId) => {
    const id = createResume(`${TEMPLATES[t].name} Resume`);
    updateResume(id, { template: t });
    nav({ to: "/editor/$id", params: { id } });
  };

  return (
    <div className="min-h-screen bg-background">
      <MarketingNav />
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">The library</div>
          <h1 className="font-serif text-5xl mt-3">Templates</h1>
          <p className="mt-3 text-muted-foreground max-w-xl mx-auto">Same content, five voices. Switch any time without losing a word.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {keys.map((k) => {
            const Tpl = TEMPLATES[k].component;
            return (
              <div key={k} className="group">
                <div className="aspect-[210/297] bg-paper border border-border/60 rounded-md overflow-hidden shadow-soft">
                  <div className="origin-top-left scale-[0.36]" style={{ width: "210mm" }}>
                    <div className="resume-page paper-grain"><Tpl data={sample} /></div>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <div className="font-serif text-xl">{TEMPLATES[k].name}</div>
                    <div className="text-xs text-muted-foreground capitalize">{k} layout</div>
                  </div>
                  <Button size="sm" onClick={() => use(k)} className="bg-foreground text-background hover:bg-foreground/90">Use template</Button>
                </div>
              </div>
            );
          })}
        </div>
        <div className="text-center mt-16">
          <Button asChild variant="outline"><Link to="/dashboard">Go to dashboard</Link></Button>
        </div>
      </section>
      <MarketingFooter />
    </div>
  );
}
