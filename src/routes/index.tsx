import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { MarketingNav, MarketingFooter } from "@/components/Marketing";
import { Button } from "@/components/ui/button";
import { Check, FileText, Sparkles, Layers, Download, Cloud, Eye, ArrowRight, Quote, Star } from "lucide-react";
import { TEMPLATES } from "@/templates";
import { createEmptyResume } from "@/lib/sample";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ResumeForge AI — Editorial resumes that get interviews" },
      { name: "description", content: "Build ATS-friendly, editorially-designed resumes in minutes. Live preview, five templates, one-click PDF." },
    ],
  }),
  component: Landing,
});

const sample = createEmptyResume("Sample");

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <MarketingNav />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 paper-grain opacity-60" />
        <div className="max-w-6xl mx-auto px-6 pt-20 pb-24 grid lg:grid-cols-[1.1fr_1fr] gap-12 items-center">
          <div>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-muted-foreground">
                <span className="w-8 h-px bg-foreground/40" /> Vol. 01 · Issue 2026
              </div>
              <h1 className="mt-5 font-serif text-5xl md:text-7xl leading-[1.05] tracking-tight">
                Build <em className="italic" style={{ color: "var(--color-gold)" }}>professional</em>, ATS-friendly resumes in minutes.
              </h1>
              <p className="mt-5 text-lg text-muted-foreground max-w-xl">
                Editorial typography. Recruiter-tested layouts. Live preview while you write. ResumeForge AI is the calm, considered way to land your next role.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg" className="bg-foreground text-background hover:bg-foreground/90 rounded-full px-6"><Link to="/signup">Create your resume <ArrowRight className="w-4 h-4 ml-1" /></Link></Button>
                <Button asChild size="lg" variant="outline" className="rounded-full px-6"><Link to="/templates">View templates</Link></Button>
              </div>
              <div className="mt-10 flex items-center gap-6 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">{[1,2,3,4,5].map(i => <Star key={i} className="w-3.5 h-3.5 fill-current" style={{ color: "var(--color-gold)" }} />)}</div>
                <span>4.9 from 2,400+ writers, designers & engineers</span>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40, rotate: 2 }}
            animate={{ opacity: 1, y: 0, rotate: 1.5 }}
            transition={{ duration: 0.8, delay: 0.15 }}
            className="relative"
          >
            <div className="absolute -inset-6 bg-gradient-to-br from-amber-100/40 via-transparent to-neutral-200/60 blur-2xl -z-10" />
            <div className="origin-center scale-[0.42] sm:scale-[0.55] -my-[160px] sm:-my-[110px] mx-auto" style={{ transformOrigin: "top center" }}>
              <div className="resume-page paper-grain mx-auto">
                {(() => {
                  const Tpl = TEMPLATES.modern.component;
                  return <Tpl data={sample} />;
                })()}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-20 border-t border-border/60">
        <div className="text-center mb-14">
          <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">The toolkit</div>
          <h2 className="font-serif text-4xl md:text-5xl mt-3">Everything you need. Nothing you don't.</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-px bg-border/60 border border-border/60 rounded-lg overflow-hidden">
          {[
            { icon: Eye, title: "Live preview", desc: "See every keystroke set in proper type, on a real A4 page." },
            { icon: Check, title: "ATS optimized", desc: "Layouts pass automated screens — your text stays selectable." },
            { icon: Download, title: "One-click PDF", desc: "Pixel-perfect, multi-page export with print-ready CSS." },
            { icon: Layers, title: "Five templates", desc: "Modern, ATS, Minimal Editorial, Sidebar, Executive." },
            { icon: Sparkles, title: "AI suggestions", desc: "Draft summaries and surface stronger verbs in one click." },
            { icon: Cloud, title: "Autosave", desc: "Your work is saved locally, instantly, every change." },
          ].map((f) => (
            <div key={f.title} className="bg-card p-8 hover:bg-secondary/40 transition-colors">
              <f.icon className="w-5 h-5" style={{ color: "var(--color-gold)" }} />
              <h3 className="mt-4 font-serif text-2xl">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TEMPLATES SHOWCASE */}
      <section id="templates" className="max-w-6xl mx-auto px-6 py-20 border-t border-border/60">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">The library</div>
            <h2 className="font-serif text-4xl md:text-5xl mt-3">Five templates, one source of truth.</h2>
          </div>
          <Link to="/templates" className="hidden md:inline-flex items-center text-sm gap-1 underline">Browse all <ArrowRight className="w-3.5 h-3.5" /></Link>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {(["modern","ats","minimal","executive"] as const).map((k) => {
            const Tpl = TEMPLATES[k].component;
            return (
              <Link key={k} to="/templates" className="group block">
                <div className="aspect-[210/297] bg-paper border border-border/60 rounded-md overflow-hidden shadow-soft group-hover:shadow-paper transition-shadow">
                  <div className="origin-top-left scale-[0.28]" style={{ width: "210mm" }}>
                    <div className="resume-page paper-grain"><Tpl data={sample} /></div>
                  </div>
                </div>
                <div className="mt-3 flex justify-between items-baseline">
                  <span className="font-serif text-lg">{TEMPLATES[k].name}</span>
                  <span className="text-xs text-muted-foreground">Free</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="max-w-6xl mx-auto px-6 py-20 border-t border-border/60">
        <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground text-center">Dispatches</div>
        <h2 className="font-serif text-4xl md:text-5xl mt-3 text-center mb-12">From the people who got the call.</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { q: "The first resume tool I haven't fought with. Got two interviews the week I switched.", a: "Maya P.", r: "Engineering Manager, Stripe" },
            { q: "Editorial is exactly the word. Looks like something from a design annual.", a: "Owen S.", r: "Brand Designer" },
            { q: "ATS-friendly without looking like a tax form. Finally.", a: "Priya R.", r: "Product Lead, Notion" },
          ].map((t) => (
            <div key={t.a} className="border border-border/60 rounded-lg p-6 bg-card">
              <Quote className="w-5 h-5" style={{ color: "var(--color-gold)" }} />
              <p className="mt-3 font-serif text-xl leading-snug">"{t.q}"</p>
              <div className="mt-5 text-sm"><div className="font-medium">{t.a}</div><div className="text-muted-foreground">{t.r}</div></div>
            </div>
          ))}
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="max-w-5xl mx-auto px-6 py-20 border-t border-border/60">
        <div className="text-center mb-12">
          <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Pricing</div>
          <h2 className="font-serif text-4xl md:text-5xl mt-3">Honest, simple, generous.</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="border border-border/60 rounded-lg p-8 bg-card">
            <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Free</div>
            <div className="mt-2 font-serif text-5xl">$0</div>
            <p className="text-sm text-muted-foreground mt-1">Forever, no card required.</p>
            <ul className="mt-6 space-y-2 text-sm">
              {["1 active resume","All 5 templates","Live preview","PDF export"].map(x => <li key={x} className="flex items-center gap-2"><Check className="w-4 h-4" /> {x}</li>)}
            </ul>
            <Button asChild className="mt-8 w-full" variant="outline"><Link to="/signup">Get started</Link></Button>
          </div>
          <div className="border-2 rounded-lg p-8 bg-foreground text-background relative" style={{ borderColor: "var(--color-gold)" }}>
            <span className="absolute -top-3 left-8 text-[10px] uppercase tracking-[0.3em] bg-background text-foreground px-2 py-1 rounded-sm" style={{ color: "var(--color-gold)" }}>Most popular</span>
            <div className="text-xs uppercase tracking-[0.3em] opacity-70">Pro</div>
            <div className="mt-2 font-serif text-5xl">$9<span className="text-lg opacity-60">/mo</span></div>
            <p className="text-sm opacity-70 mt-1">Billed annually. Cancel anytime.</p>
            <ul className="mt-6 space-y-2 text-sm">
              {["Unlimited resumes","AI summary + bullet polish","ATS keyword analyzer","Version history","Priority email support"].map(x => <li key={x} className="flex items-center gap-2"><Check className="w-4 h-4" style={{ color: "var(--color-gold)" }} /> {x}</li>)}
            </ul>
            <Button asChild className="mt-8 w-full bg-background text-foreground hover:bg-background/90"><Link to="/signup">Start free trial</Link></Button>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="max-w-3xl mx-auto px-6 py-20 border-t border-border/60">
        <div className="text-center mb-10">
          <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">FAQ</div>
          <h2 className="font-serif text-4xl mt-3">Questions, answered.</h2>
        </div>
        <div className="space-y-4">
          {[
            { q: "Is my data private?", a: "Everything is saved in your browser by default — nothing leaves your device unless you choose to sync." },
            { q: "Will my resume pass ATS?", a: "Yes. Our templates use selectable text, semantic order, and avoid graphical tricks that confuse parsers." },
            { q: "Can I cancel anytime?", a: "Always. Free is free forever, and Pro can be cancelled in a click." },
            { q: "Do you offer team plans?", a: "Coming soon for career services and bootcamps. Drop us a line." },
          ].map(({ q, a }) => (
            <details key={q} className="group border border-border/60 rounded-lg bg-card px-5 py-4">
              <summary className="cursor-pointer flex justify-between items-center font-serif text-lg list-none">{q}<span className="text-muted-foreground group-open:rotate-45 transition-transform">+</span></summary>
              <p className="mt-3 text-sm text-muted-foreground">{a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="rounded-xl border border-border/60 p-10 md:p-16 text-center bg-card">
          <FileText className="w-8 h-8 mx-auto" style={{ color: "var(--color-gold)" }} />
          <h2 className="font-serif text-4xl md:text-5xl mt-4">Your next chapter, well-typeset.</h2>
          <p className="mt-3 text-muted-foreground">Start free. Export a polished PDF in under five minutes.</p>
          <Button asChild size="lg" className="mt-6 bg-foreground text-background hover:bg-foreground/90 rounded-full px-8"><Link to="/signup">Create your resume</Link></Button>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
