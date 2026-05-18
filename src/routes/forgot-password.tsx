import { createFileRoute, Link } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { AuthShell } from "./login";
import { toast } from "sonner";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({ meta: [{ title: "Reset password — ResumeForge AI" }, { name: "description", content: "Reset your ResumeForge AI password." }] }),
  component: ForgotPage,
});

function ForgotPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<{ email: string }>();
  return (
    <AuthShell title="Reset password" subtitle="We'll email you a secure link.">
      <form onSubmit={handleSubmit(async () => { await new Promise(r => setTimeout(r, 500)); toast.success("Check your inbox"); })} className="space-y-4">
        <div>
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">Email</Label>
          <Input type="email" {...register("email", { required: "Required" })} className="mt-1" />
          {errors.email && <p className="text-xs text-destructive mt-1">{errors.email.message}</p>}
        </div>
        <Button type="submit" disabled={isSubmitting} className="w-full bg-foreground text-background hover:bg-foreground/90">Send reset link</Button>
      </form>
      <p className="mt-6 text-sm text-center text-muted-foreground"><Link to="/login" className="underline">Back to sign in</Link></p>
    </AuthShell>
  );
}
