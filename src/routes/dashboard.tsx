import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useResumeStore } from "@/store/resumeStore";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { Plus, FileText, Copy, Trash2, Download, Pencil, LogOut, Moon, Sun, LayoutGrid, Star } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useEffect } from "react";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — ResumeForge AI" }, { name: "description", content: "Your resumes." }] }),
  component: Dashboard,
});

function Dashboard() {
  const { user, resumes, createResume, deleteResume, duplicateResume, logout, darkMode, toggleDark } = useResumeStore();
  const nav = useNavigate();

  useEffect(() => {
    if (!user) nav({ to: "/login" });
  }, [user, nav]);

  if (!user) return null;

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="w-64 border-r border-border/60 p-5 hidden md:flex flex-col bg-sidebar">
        <Logo />
        <nav className="mt-10 space-y-1 text-sm">
          <SideLink icon={<LayoutGrid className="w-4 h-4" />} label="My Resumes" active />
          <SideLink icon={<Star className="w-4 h-4" />} label="Templates" to="/templates" />
        </nav>
        <div className="mt-auto text-xs text-muted-foreground">v1.0 · ResumeForge AI</div>
      </aside>

      <main className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="h-16 border-b border-border/60 px-6 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">Hello, <span className="text-foreground font-medium">{user.name}</span> — let's polish something today.</div>
          <div className="flex items-center gap-2">
            <Button size="icon" variant="ghost" onClick={toggleDark}>{darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}</Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="w-9 h-9 rounded-full bg-foreground text-background grid place-items-center text-sm font-medium uppercase">{user.name[0]}</button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => { logout(); nav({ to: "/" }); toast.success("Signed out"); }}><LogOut className="w-4 h-4 mr-2" /> Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <div className="p-8 max-w-6xl w-full mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Library</div>
              <h1 className="font-serif text-4xl mt-2">Your Resumes</h1>
            </div>
            <Button onClick={() => { const id = createResume(); nav({ to: "/editor/$id", params: { id } }); }} className="bg-foreground text-background hover:bg-foreground/90 rounded-full">
              <Plus className="w-4 h-4 mr-1" /> New resume
            </Button>
          </div>

          {resumes.length === 0 ? (
            <div className="border border-dashed border-border rounded-lg p-16 text-center bg-card">
              <FileText className="w-10 h-10 mx-auto text-muted-foreground" />
              <h3 className="font-serif text-2xl mt-4">No resumes yet</h3>
              <p className="text-sm text-muted-foreground mt-1">Start with a clean draft or browse templates.</p>
              <div className="mt-6 flex gap-2 justify-center">
                <Button onClick={() => { const id = createResume(); nav({ to: "/editor/$id", params: { id } }); }} className="bg-foreground text-background hover:bg-foreground/90"><Plus className="w-4 h-4 mr-1" /> Create resume</Button>
                <Button asChild variant="outline"><Link to="/templates">Browse templates</Link></Button>
              </div>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {resumes.map((r) => (
                <motion.div key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="group border border-border/60 rounded-lg bg-card overflow-hidden hover:shadow-soft transition-shadow">
                  <Link to="/editor/$id" params={{ id: r.id }} className="block aspect-[3/4] bg-secondary/40 relative overflow-hidden">
                    <div className="absolute inset-0 grid place-items-center text-muted-foreground">
                      <FileText className="w-10 h-10" />
                    </div>
                    <div className="absolute bottom-3 left-3 text-[10px] uppercase tracking-widest" style={{ color: "var(--color-gold)" }}>{r.template}</div>
                  </Link>
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <Link to="/editor/$id" params={{ id: r.id }} className="font-serif text-lg truncate">{r.name}</Link>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">Edited {formatDistanceToNow(r.updatedAt, { addSuffix: true })}</div>
                    <div className="mt-4 flex items-center gap-1">
                      <Button asChild size="sm" variant="outline" className="flex-1"><Link to="/editor/$id" params={{ id: r.id }}><Pencil className="w-3.5 h-3.5 mr-1" /> Edit</Link></Button>
                      <Button size="icon" variant="ghost" title="Duplicate" onClick={() => { duplicateResume(r.id); toast.success("Duplicated"); }}><Copy className="w-4 h-4" /></Button>
                      <Button asChild size="icon" variant="ghost" title="Download"><Link to="/editor/$id" params={{ id: r.id }}><Download className="w-4 h-4" /></Link></Button>
                      <Button size="icon" variant="ghost" title="Delete" onClick={() => { deleteResume(r.id); toast.success("Deleted"); }}><Trash2 className="w-4 h-4" /></Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function SideLink({ icon, label, to, active }: { icon: React.ReactNode; label: string; to?: string; active?: boolean }) {
  const cls = `flex items-center gap-2 px-3 py-2 rounded-md ${active ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"}`;
  if (to) return <Link to={to} className={cls}>{icon}{label}</Link>;
  return <div className={cls}>{icon}{label}</div>;
}
