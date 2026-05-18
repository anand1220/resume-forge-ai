import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { useResumeStore } from "@/store/resumeStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AuthShell } from "./login";
import { toast } from "sonner";

export const Route = createFileRoute("/signup")({
  head: () => ({ meta: [{ title: "Create your account — ResumeForge AI" }, { name: "description", content: "Create your free ResumeForge AI account." }] }),
  component: SignupPage,
});

function SignupPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<{ name: string; email: string; password: string }>();
  const login = useResumeStore((s) => s.login);
  const nav = useNavigate();
  return (
    <AuthShell title="Create your account" subtitle="Free forever. No credit card.">
      <form onSubmit={handleSubmit(async (v) => {
        await new Promise(r => setTimeout(r, 400));
        login(v.email, v.name);
        toast.success("Welcome to ResumeForge AI");
        nav({ to: "/dashboard" });
      })} className="space-y-4">
        <div>
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Full name</Label>
          <Input {...register("name", { required: "Required" })} className="mt-1" />
          {errors.name && <p className="text-xs text-destructive mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Email</Label>
          <Input type="email" {...register("email", { required: "Required", pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email" } })} className="mt-1" />
          {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Password</Label>
          <Input type="password" {...register("password", { required: "Required", minLength: { value: 6, message: "Min 6 chars" } })} className="mt-1" />
          {errors.password && <p className="text-xs text-destructive mt-1">{errors.password.message}</p>}
        </div>
        <Button type="submit" disabled={isSubmitting} className="w-full bg-foreground text-background hover:bg-foreground/90">Create account</Button>
      </form>
      <p className="mt-6 text-sm text-center text-muted-foreground">Already a member? <Link to="/login" className="underline">Sign in</Link></p>
    </AuthShell>
  );
}
