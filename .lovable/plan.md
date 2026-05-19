# ResumeForge AI — Major upgrade plan

You asked for everything in one pass, but honestly this is 4 large pieces and doing them in a single turn would almost certainly ship bugs. I'd like to split it into 3 turns. Each turn ends with a working app you can test.

## Turn 1 — PDF export rewrite (react-pdf)

Replace `html2canvas` + `jsPDF` with `@react-pdf/renderer`. This gives real vector PDFs: ATS-readable selectable text, sharp at any zoom, small file size, native multi-page page breaks, exact A4 margins.

- Install `@react-pdf/renderer`.
- Rewrite the 5 templates (Modern, ATS, Minimal, Sidebar, Executive) as react-pdf component pairs in `src/templates/pdf/`. The on-screen preview stays HTML (in `src/templates/index.tsx`) — both render from the same `ResumeData`, sharing color/typography/spacing tokens so PDF matches the preview.
- New `src/lib/pdf.ts` using `pdf().toBlob()` + `saveAs`. Built-in `wrap` / `break` props prevent awkward section splits.
- Bundle Inter + Instrument Serif via `Font.register` so typography matches.
- Delete `html2canvas` + `jsPDF` deps.

## Turn 2 — Preview engine + responsive overhaul

**Multi-page HTML preview**
- New `MultiPagePreview` that measures content height and paginates into A4 `<div class="resume-page">` nodes with consistent header/margins. Uses `react-use-measure` + a paginator that walks section blocks and pushes them onto pages without splitting awkwardly. CSS `break-inside: avoid` on cards, `break-after: avoid` on section headers.
- Print stylesheet (`@page A4`, hidden chrome) so browser print also works.

**Responsive**
- Editor route: split-view ≥1024px, tabbed Edit/Preview <1024px (already partial — fix overflow, scaling, sticky toolbar).
- Mobile preview uses `transform: scale()` to fit viewport, no horizontal scroll.
- Touch targets ≥44px, larger inputs on mobile.
- Mobile drawer for the section nav; collapse toolbar dropdowns into a Sheet.
- Audit all routes (Landing, Dashboard, Templates, Pricing, Auth) for overflow, font sizing, and tap targets at 360/768/1024.

## Turn 3 — Lovable Cloud backend + migration

Enable Cloud, then:

**Schema (migration)**
- `profiles` table (id ↔ `auth.users.id`, full_name, avatar_url) + auto-insert trigger on signup.
- `resumes` table: `id uuid pk`, `user_id uuid fk auth.users on delete cascade not null`, `name text`, `data jsonb` (the full `ResumeData`), `template text`, `created_at`, `updated_at`. Trigger to bump `updated_at`.
- RLS: `auth.uid() = user_id` for select/insert/update/delete on `resumes`; users can read/update own `profiles`.

**Auth**
- Email/password + Google (via Lovable broker + `configure_social_auth`). Replace mock login/signup. Add `/reset-password` page. Persistent session via `onAuthStateChange` listener wired at root (with router + query invalidation).
- `_authenticated` layout route gating `/dashboard` and `/editor/$id` with `beforeLoad` redirect.

**Data layer**
- Server fns in `src/lib/resumes.functions.ts` with `requireSupabaseAuth`: `listResumes`, `getResume`, `createResume`, `updateResume`, `deleteResume`.
- Confirm `attachSupabaseAuth` is in `src/start.ts` `functionMiddleware`.
- React Query for fetching/caching; debounced autosave (1.5s) in the editor calling `updateResume`; "Saved · 2s ago" indicator; offline → queue + retry.
- One-time migration prompt on Dashboard: if localStorage has resumes and user just signed in, offer "Import X local resumes to your account".
- Loading skeletons on Dashboard + Editor; toast on error.

## Technical notes

- Keep Zustand only for ephemeral UI state (current section, theme dropdown). All resume data goes through React Query + server fns.
- Storage bucket for profile photos (optional, only if you want photo upload — currently it's a URL field; let me know).
- I'll NOT use Supabase Edge Functions — server fns only, per the TanStack template.

## What I need from you

1. **OK to split into 3 turns?** Single-pass will leak bugs across all 4 systems and be hard to debug.
2. **Profile photo storage** — add a Cloud Storage bucket for uploads, or keep the URL-only field?
3. **Migration of existing localStorage resumes** — auto-import on first login, prompt the user, or discard?

Reply with answers (or just "go" and I'll start Turn 1 with sensible defaults: 3-turn split, URL-only photos, prompt-to-import).