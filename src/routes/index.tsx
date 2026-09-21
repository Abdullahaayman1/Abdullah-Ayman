import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { name: "google-site-verification", content: "ZHN8SXQmvwkTNlp_Y9HJub2Ux6_PjXkI41W9JNmt4zI" },
      { title: "Abdullah Ayman — Front-End Developer Portfolio" },
      {
        name: "description",
        content:
          "Portfolio of Abdullah Ayman, BS Computer Science graduate (2026) from UMT — front-end engineering, motion design and premium web interfaces.",
      },
      { property: "og:title", content: "Abdullah Ayman — Front-End Developer Portfolio" },
      {
        property: "og:description",
        content:
          "Premium, animated portfolio of Abdullah Ayman — projects, skills, services and contact.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  useEffect(() => {
    window.location.replace("/portfolio/index.html");
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <p className="text-sm text-muted-foreground">Loading portfolio…</p>
    </div>
  );
}
