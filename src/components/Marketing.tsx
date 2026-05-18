import { Link, useNavigate } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";
import { useResumeStore } from "@/store/resumeStore";

export function MarketingNav() {
  const user = useResumeStore((s) => s.user);
  const nav = useNavigate();
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-background/70 border-b border-border/60">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Logo />
        <nav className="hidden md:flex items-center gap-8 text-sm">
          <Link to="/templates" className="hover:text-foreground/70">Templates</Link>
          <Link to="/pricing" className="hover:text-foreground/70">Pricing</Link>
          <a href="#features" className="hover:text-foreground/70">Features</a>
          <a href="#faq" className="hover:text-foreground/70">FAQ</a>
        </nav>
        <div className="flex items-center gap-2">
          {user ? (
            <Button onClick={() => nav({ to: "/dashboard" })} variant="default" size="sm">Dashboard</Button>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm"><Link to="/login">Sign in</Link></Button>
              <Button asChild size="sm" className="bg-foreground text-background hover:bg-foreground/90"><Link to="/signup">Get started</Link></Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export function MarketingFooter() {
  return (
    <footer className="border-t border-border/60 mt-24">
      <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-4 gap-8 text-sm">
        <div>
          <Logo />
          <p className="mt-3 text-muted-foreground max-w-xs">Editorial-quality resumes that pass ATS and feel handmade.</p>
        </div>
        <div>
          <div className="font-medium mb-3">Product</div>
          <ul className="space-y-2 text-muted-foreground">
            <li><Link to="/templates">Templates</Link></li>
            <li><Link to="/pricing">Pricing</Link></li>
            <li><a href="#features">Features</a></li>
          </ul>
        </div>
        <div>
          <div className="font-medium mb-3">Company</div>
          <ul className="space-y-2 text-muted-foreground">
            <li>About</li><li>Contact</li><li>Privacy Policy</li><li>Terms</li>
          </ul>
        </div>
        <div>
          <div className="font-medium mb-3">Stay in the loop</div>
          <p className="text-muted-foreground">Quarterly notes on craft, hiring trends, and templates.</p>
        </div>
      </div>
      <div className="border-t border-border/60 py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} ResumeForge AI. Crafted with care.
      </div>
    </footer>
  );
}
