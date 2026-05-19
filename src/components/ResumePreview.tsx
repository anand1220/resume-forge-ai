import { forwardRef, useEffect, useRef, useState } from "react";
import type { ResumeData } from "@/lib/types";
import { TEMPLATES } from "@/templates";

interface Props {
  data: ResumeData;
  /** Maximum scale (1 = full A4 size). Defaults to 1 for desktop. */
  maxScale?: number;
}

/**
 * Auto-fits an A4 resume page (210mm wide) inside any container width.
 * Adds visual page-break guides every 297mm so multi-page content is obvious.
 */
export const ResumePreview = forwardRef<HTMLDivElement, Props>(({ data, maxScale = 1 }, ref) => {
  const Tpl = TEMPLATES[data.template].component;
  const wrapRef = useRef<HTMLDivElement>(null);
  const pageRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(maxScale);
  const [pageHeightPx, setPageHeightPx] = useState(0);
  const [contentHeightPx, setContentHeightPx] = useState(0);

  // Fit scale to container width
  useEffect(() => {
    if (!wrapRef.current) return;
    const A4_WIDTH_MM = 210;
    // Convert 210mm → px using a hidden probe (avoids hardcoding 96dpi assumptions)
    const probe = document.createElement("div");
    probe.style.width = `${A4_WIDTH_MM}mm`;
    probe.style.position = "absolute";
    probe.style.visibility = "hidden";
    document.body.appendChild(probe);
    const a4WidthPx = probe.getBoundingClientRect().width;
    probe.remove();

    const ro = new ResizeObserver(() => {
      if (!wrapRef.current) return;
      const w = wrapRef.current.clientWidth;
      const next = Math.min(maxScale, w / a4WidthPx);
      setScale(next > 0 ? next : maxScale);
    });
    ro.observe(wrapRef.current);
    return () => ro.disconnect();
  }, [maxScale]);

  // Measure A4 page height + actual content height for page break indicators
  useEffect(() => {
    if (!pageRef.current) return;
    const probe = document.createElement("div");
    probe.style.height = "297mm";
    probe.style.position = "absolute";
    probe.style.visibility = "hidden";
    document.body.appendChild(probe);
    setPageHeightPx(probe.getBoundingClientRect().height);
    probe.remove();

    const ro = new ResizeObserver((entries) => {
      for (const e of entries) {
        setContentHeightPx(e.contentRect.height);
      }
    });
    ro.observe(pageRef.current);
    return () => ro.disconnect();
  }, [data]);

  const pageCount = pageHeightPx > 0 ? Math.max(1, Math.ceil(contentHeightPx / pageHeightPx)) : 1;
  const scaledHeight = contentHeightPx * scale;

  return (
    <div ref={wrapRef} className="w-full flex justify-center">
      <div
        style={{
          width: 210 * (scale / maxScale) + "mm",
          height: scaledHeight > 0 ? `${scaledHeight}px` : undefined,
          position: "relative",
        }}
      >
        <div
          style={{
            transform: `scale(${scale})`,
            transformOrigin: "top left",
            width: "210mm",
            position: "absolute",
            top: 0,
            left: 0,
          }}
        >
          <div ref={pageRef} className="resume-page paper-grain" id="resume-page" data-pages={pageCount}>
            <div ref={ref}>
              <Tpl data={data} />
            </div>
          </div>
          {/* Page break guides (visual only) */}
          {pageCount > 1 &&
            Array.from({ length: pageCount - 1 }).map((_, i) => (
              <div
                key={i}
                aria-hidden
                style={{
                  position: "absolute",
                  top: `${(i + 1) * pageHeightPx}px`,
                  left: 0,
                  right: 0,
                  height: 0,
                  borderTop: "2px dashed rgba(0,0,0,0.18)",
                  pointerEvents: "none",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    right: 4,
                    top: 4,
                    fontSize: 10,
                    color: "rgba(0,0,0,0.45)",
                    background: "rgba(255,255,255,0.85)",
                    padding: "1px 6px",
                    borderRadius: 4,
                  }}
                >
                  Page {i + 2}
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
});

ResumePreview.displayName = "ResumePreview";
