import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import type { ResumeData } from "./types";
import { ResumeDocument } from "./pdf-templates";

/**
 * Export a resume to a vector A4 PDF using @react-pdf/renderer.
 * - Selectable, ATS-friendly text
 * - Native multi-page support (no rasterization)
 * - Sharp at any zoom, small file size
 */
export async function exportResumeToPdf(data: ResumeData, filename?: string) {
  const name = filename ?? `${(data.name || "resume").replace(/\s+/g, "_")}.pdf`;
  const blob = await pdf(<ResumeDocument data={data} />).toBlob();
  saveAs(blob, name);
}
