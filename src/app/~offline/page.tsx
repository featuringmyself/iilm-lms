import Link from "next/link";

export default function OfflinePage() {
  return (
    <main className="mx-auto flex min-h-svh w-full max-w-md flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">You’re offline</h1>
      <p className="text-sm text-muted-foreground">
        IILM LMS can’t reach the network right now. Check your connection and try
        again.
      </p>
      <Link
        href="/"
        className="text-sm font-medium text-primary underline-offset-4 hover:underline"
      >
        Retry home
      </Link>
    </main>
  );
}
