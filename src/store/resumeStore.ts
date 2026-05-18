import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ResumeData, User } from "@/lib/types";
import { createEmptyResume, uid } from "@/lib/sample";

interface State {
  resumes: ResumeData[];
  user: User | null;
  darkMode: boolean;
  createResume: (name?: string) => string;
  duplicateResume: (id: string) => string | null;
  deleteResume: (id: string) => void;
  updateResume: (id: string, patch: Partial<ResumeData> | ((r: ResumeData) => ResumeData)) => void;
  getResume: (id: string) => ResumeData | undefined;
  login: (email: string, name?: string) => void;
  logout: () => void;
  toggleDark: () => void;
}

export const useResumeStore = create<State>()(
  persist(
    (set, get) => ({
      resumes: [],
      user: null,
      darkMode: false,
      createResume: (name) => {
        const r = createEmptyResume(name ?? `Resume ${get().resumes.length + 1}`);
        set({ resumes: [r, ...get().resumes] });
        return r.id;
      },
      duplicateResume: (id) => {
        const orig = get().resumes.find((r) => r.id === id);
        if (!orig) return null;
        const copy: ResumeData = {
          ...orig,
          id: uid(),
          name: `${orig.name} (copy)`,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        set({ resumes: [copy, ...get().resumes] });
        return copy.id;
      },
      deleteResume: (id) =>
        set({ resumes: get().resumes.filter((r) => r.id !== id) }),
      updateResume: (id, patch) =>
        set({
          resumes: get().resumes.map((r) => {
            if (r.id !== id) return r;
            const next = typeof patch === "function" ? patch(r) : { ...r, ...patch };
            return { ...next, updatedAt: Date.now() };
          }),
        }),
      getResume: (id) => get().resumes.find((r) => r.id === id),
      login: (email, name) =>
        set({ user: { id: uid(), email, name: name ?? email.split("@")[0] } }),
      logout: () => set({ user: null }),
      toggleDark: () => {
        const next = !get().darkMode;
        set({ darkMode: next });
        if (typeof document !== "undefined") {
          document.documentElement.classList.toggle("dark", next);
        }
      },
    }),
    {
      name: "resumeforge-store",
      onRehydrateStorage: () => (state) => {
        if (state?.darkMode && typeof document !== "undefined") {
          document.documentElement.classList.add("dark");
        }
      },
    },
  ),
);
