import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  Link,
} from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-serif text-7xl">404</h1>
        <p className="mt-3 text-muted-foreground">This page wandered off the page.</p>
        <Link to="/" className="inline-block mt-6 underline">Back home</Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-serif text-3xl">Something didn't render</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <button onClick={() => { router.invalidate(); reset(); }} className="mt-5 px-4 py-2 rounded-md bg-foreground text-background text-sm">Try again</button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "ResumeForge AI — Editorial resumes that get interviews" },
      { name: "description", content: "Build ATS-friendly, editorially-designed resumes in minutes. Live preview, multiple templates, one-click PDF." },
      { property: "og:title", content: "ResumeForge AI — Editorial resumes that get interviews" },
      { property: "og:description", content: "Build ATS-friendly, editorially-designed resumes in minutes. Live preview, multiple templates, one-click PDF." },
      { property: "og:type", content: "website" },
      { name: "twitter:title", content: "ResumeForge AI — Editorial resumes that get interviews" },
      { name: "twitter:description", content: "Build ATS-friendly, editorially-designed resumes in minutes. Live preview, multiple templates, one-click PDF." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/f42c76be-bf08-4b9c-bae2-98480cac37f2/id-preview-f23ceab2--055a0f2b-60ae-485c-8d1b-b6e75a3ae029.lovable.app-1779120100178.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/f42c76be-bf08-4b9c-bae2-98480cac37f2/id-preview-f23ceab2--055a0f2b-60ae-485c-8d1b-b6e75a3ae029.lovable.app-1779120100178.png" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <Toaster position="bottom-right" />
    </QueryClientProvider>
  );
}
