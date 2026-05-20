import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { useResumeStore } from "@/store/resumeStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase"; // Make sure this path is correct

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [{ title: "Sign in — ResumeForge AI" }, { name: "description", content: "Sign in to ResumeForge AI." }] }),
  component: LoginPage,
});

function LoginPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<{ email: string; password: string }>();
  const login = useResumeStore((s) => s.login);
  const nav = useNavigate();

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
    if (error) toast.error(error.message);
  };

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to keep editing.">
      <form onSubmit={handleSubmit(async (v) => {
        await new Promise(r => setTimeout(r, 400));
        login(v.email);
        toast.success("Signed in");
        nav({ to: "/dashboard" });
      })} className="space-y-4">
        <div>
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Email</Label>
          <Input type="email" {...register("email", { required: "Required", pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email" } })} className="mt-1" />
          {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <div className="flex justify-between"><Label className="text-xs uppercase tracking-wider text-muted-foreground">Password</Label><Link to="/forgot-password" className="text-xs underline">Forgot?</Link></div>
          <Input type="password" {...register("password", { required: "Required", minLength: { value: 6, message: "Min 6 chars" } })} className="mt-1" />
          {errors.password && <p className="text-xs text-destructive mt-1">{errors.password.message}</p>}
        </div>
        <Button type="submit" disabled={isSubmitting} className="w-full bg-foreground text-background hover:bg-foreground/90">Sign in</Button>
      </form>

      {/* Google Login Section */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>
      <Button type="button" variant="outline" onClick={handleGoogleLogin} className="w-full">
        Google
      </Button>

      <p className="mt-6 text-sm text-center text-muted-foreground">No account? <Link to="/signup" className="underline">Create one</Link></p>
    </AuthShell>
  );
}

// AuthShell code remains the same...
export function AuthShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-background">
      <div className="flex flex-col justify-between p-8 lg:p-12 border-r border-border/60">
        <Logo />
        <div className="max-w-md">
          <p className="font-serif text-3xl leading-snug">"Typography is the craft of endowing human language with a durable visual form."</p>
          <p className="mt-3 text-sm text-muted-foreground">— Robert Bringhurst</p>
        </div>
        <div className="text-xs text-muted-foreground">© ResumeForge AI</div>
      </div>
      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-sm">
          <h1 className="font-serif text-4xl">{title}</h1>
          <p className="text-sm text-muted-foreground mt-2 mb-8">{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  );
}