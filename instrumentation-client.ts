import posthog from "posthog-js";

// Skip PostHog entirely in development so `bun run dev` sends zero requests.
if (process.env.NODE_ENV === "production") {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN!, {
    api_host: "/ingest",
    ui_host: "https://us.posthog.com",
    // Include the defaults option as required by PostHog
    defaults: "2026-01-30",
    // Enables capturing unhandled exceptions via Error Tracking
    capture_exceptions: true,
  });
}
