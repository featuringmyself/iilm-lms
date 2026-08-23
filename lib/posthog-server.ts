import { PostHog } from "posthog-node";

let posthogClient: PostHog | null = null;

/** Returns null in development so server capture is a no-op. */
export function getPostHogClient(): PostHog | null {
  if (process.env.NODE_ENV === "development") {
    return null;
  }

  if (!posthogClient) {
    const token = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
    if (!token) {
      return null;
    }

    posthogClient = new PostHog(token, {
      host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      flushAt: 1,
      flushInterval: 0,
    });
  }

  return posthogClient;
}
