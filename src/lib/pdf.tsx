import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver"; // Direct import
import type { ResumeData } from "./types";
import { ResumeDocument } from "./pdf-templates";

export async function exportResumeToPdf(data: ResumeData, filename?: string) {
  try {
    // PDF blob generate karo
    const doc = <ResumeDocument data={data} />;
    const blob = await pdf(doc).toBlob();
    
    // Naam set karo
    const safeName = data.personal?.fullName || "resume";
    const name = filename ?? `${safeName.replace(/\s+/g, "_")}.pdf`;
    
    // Direct saveAs use karo
    saveAs(blob, name);
    console.log("PDF download shuru ho gaya!");
  } catch (error) {
    console.error("PDF Export failed:", error);
    alert("PDF export mein error aaya. Console check karo.");
  }
}