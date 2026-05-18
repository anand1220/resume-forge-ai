import { forwardRef } from "react";
import type { ResumeData } from "@/lib/types";
import { TEMPLATES } from "@/templates";

interface Props { data: ResumeData }

export const ResumePreview = forwardRef<HTMLDivElement, Props>(({ data }, ref) => {
  const Tpl = TEMPLATES[data.template].component;
  return (
    <div ref={ref} className="resume-page paper-grain" id="resume-page">
      <Tpl data={data} />
    </div>
  );
});
ResumePreview.displayName = "ResumePreview";
