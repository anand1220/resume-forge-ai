import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingNav, MarketingFooter } from "@/components/Marketing";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export const Route = createFileRoute("/pricing")({
  head: () => ({ meta: [{ title: "Pricing — ResumeForge AI" }, { name: "description", content: "Free forever or Pro from $9/mo." }] }),
  component: PricingPage,
});

function PricingPage() {
  return (
    <div className="min-h-screen bg-background">
      <MarketingNav />
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Pricing</div>
          <h1 className="font-serif text-5xl mt-3">Honest, simple, generous.</h1>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="border border-border/60 rounded-lg p-8 bg-card">
            <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Free</div>
            <div className="mt-2 font-serif text-5xl">$0</div>
            <ul className="mt-6 space-y-2 text-sm">
              {["1 active resume","All 5 templates","Live preview","PDF export"].map(x => <li key={x} className="flex items-center gap-2"><Check className="w-4 h-4" /> {x}</li>)}
            </ul>
            <Button asChild className="mt-8 w-full" variant="outline"><Link to="/signup">Get started</Link></Button>
          </div>
          <div className="border-2 rounded-lg p-8 bg-foreground text-background" style={{ borderColor: "var(--color-gold)" }}>
            <div className="text-xs uppercase tracking-[0.3em] opacity-70">Pro</div>
            <div className="mt-2 font-serif text-5xl">$9<span className="text-lg opacity-60">/mo</span></div>
            <ul className="mt-6 space-y-2 text-sm">
              {["Unlimited resumes","AI summary + bullet polish","ATS keyword analyzer","Version history","Priority support"].map(x => <li key={x} className="flex items-center gap-2"><Check className="w-4 h-4" style={{ color: "var(--color-gold)" }} /> {x}</li>)}
            </ul>
            <Button asChild className="mt-8 w-full bg-background text-foreground hover:bg-background/90"><Link to="/signup">Start free trial</Link></Button>
          </div>
        </div>
      </section>
      <MarketingFooter />
    </div>
  );
}
