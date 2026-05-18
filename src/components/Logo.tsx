import { Link } from "@tanstack/react-router";
import { FileText } from "lucide-react";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <Link to="/" className={`inline-flex items-center gap-2 ${className}`}>
      <span className="grid place-items-center w-8 h-8 rounded-sm bg-foreground text-background">
        <FileText className="w-4 h-4" />
      </span>
      <span className="font-serif text-xl tracking-tight">ResumeForge<span style={{ color: "var(--color-gold)" }}> AI</span></span>
    </Link>
  );
}
