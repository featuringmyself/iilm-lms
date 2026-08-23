# PostHog Self-driving Setup Report

**Project:** iilm-lms  
**Date:** 2026-08-23  
**Inbox:** https://us.posthog.com/project/572906/inbox

## Summary

PostHog Self-driving is now configured for this project. Session Replay, Error Tracking, and Support (Conversations) products are enabled; their signal sources are wired to the inbox alongside health checks and the scout gate. A five-scout troop (general + four specialists) is active and will begin scanning within ~30 minutes. Two Replay Vision scanners watch the document-viewer flow and rage-click sessions with signals on, so any on-screen breakage or user frustration discovered in recordings will feed the inbox automatically. Findings will start appearing at https://us.posthog.com/project/572906/inbox within about 30 minutes.

---

## AI data processing

**Approved.** Organization-level AI data processing consent was confirmed before this run started.

---

## GitHub

**Connected during this run.**  
Integration id: 243692 — GitHub account: `featuringmyself`. Self-driving can now investigate findings against repo code and open fix PRs.

---

## Products enabled

| Product | Status | Notes |
|---|---|---|
| Session Replay | **enabled** | Server flip applied. No `disable_session_recording` override in `instrumentation-client.ts` — recordings will arrive as soon as users visit the site. |
| Error Tracking | **enabled** | `capture_exceptions: true` already set in `posthog.init` — both server and client are aligned. |
| Support (Conversations) | **enabled** | Product is on. Tickets only arrive once an inbound channel is connected — see Follow-ups. |

---

## Signal sources

| source_product | source_type | Action | Config id |
|---|---|---|---|
| `signals_scout` | `cross_source_issue` | **On by default** — no row needed; scout findings reach the inbox without a config row. | — |
| `health_checks` | `health_issue` | **Created & enabled** | `01a02fa6-799e-7e06-944b-1781e5e382c7` |
| `error_tracking` | `issue_created` | **Created & enabled** | `01a02fa6-7ef2-7248-86f1-b9a486743372` |
| `error_tracking` | `issue_reopened` | **Created & enabled** | `01a02fa6-8498-748c-830c-a8ee5c8f74d3` |
| `error_tracking` | `issue_spiking` | **Created & enabled** | `01a02fa6-86bf-79bf-a79f-15576d451004` |
| `session_replay` | `session_analysis_cluster` | **Created & enabled** (sample_rate: 0.1) | `01a02fa6-9930-7e1b-a057-cb0f5db9a9d8` |
| `conversations` | `ticket` | **Created & enabled** — dormant until a support channel is connected | `01a02fa6-9d07-79d3-ba55-4782bde12aa5` |
| `llm_analytics` | any | **Skipped** — no LLM/AI product in use |
| `logs` | any | **Skipped** — not a v1 responder |
| `replay_vision` | any | **Skipped** — Replay Vision scanners are self-authorizing via `emits_signals`; no row needed |

---

## Connected tools

No connected-tool sources were selected (user cancelled the prompt). No responder rows created for external issue trackers, error trackers, or support desks.

| Tool | Status |
|---|---|
| GitHub Issues | not used |
| Linear | not used |
| Jira | not used |
| Sentry | not used |
| Zendesk | not used |

---

## Scout troop

**Run budget:** 100 runs/day (early-access default, confirmed via `scout-metadata-get`). 0 runs used today.  
**Banner:** *"Scouts are in early access. Each project gets up to 100 scout runs a day. Contact team-self-driving@posthog.com if you need more."*

### Enabled (5)

| Scout | Why enabled |
|---|---|
| `signals-scout-general` | Always on — cross-product correlations and surfaces no specialist covers |
| `signals-scout-health-checks` | New PostHog setup; catches instrumentation issues early |
| `signals-scout-observability-gaps` | Surfaces events with no insight/dashboard/alert coverage — essential for a project just starting analytics |
| `signals-scout-web-analytics` | Web app with multi-page navigation; watches session volume, attribution, and landing-page health |
| `signals-scout-web-vitals` | Document-heavy app (PDFs, PPTX, DOCX); watches LCP/INP/CLS/FCP per page |

### Disabled (22)

| Scout | Reason |
|---|---|
| `signals-scout-error-tracking` | **Covered by native source** — error tracking signal source already routes findings to the inbox |
| `signals-scout-session-replay` | **Covered by native source** — session replay source already routes findings to the inbox |
| `signals-scout-feature-flags` | No feature flags in use |
| `signals-scout-surveys` | No PostHog surveys in use |
| `signals-scout-experiments` | No A/B experiments running |
| `signals-scout-ai-observability` | No LLM/AI product or `$ai_*` events |
| `signals-scout-revenue-analytics` | No payment SDK or revenue data |
| `signals-scout-logs` | PostHog logs product not in use |
| `signals-scout-csp-violations` | No CSP reporting configured |
| `signals-scout-customer-analytics` | No group/account analytics (B2B) |
| `signals-scout-data-pipelines` | No CDP destinations, batch exports, or hog flows |
| `signals-scout-data-warehouse` | No warehouse imports active |
| `signals-scout-apm` | No distributed tracing / OpenTelemetry |
| `signals-scout-conversations` | No conversation ticket data yet |
| `signals-scout-anomaly-detection` | No dashboards or insights to watch yet |
| `signals-scout-product-analytics` | No saved funnels or retention insights yet |
| `signals-scout-replay-vision` | Reads trends across accumulated observations — none exist yet (scanners were just created) |
| `signals-scout-inbox-validation` | Not useful on a fresh setup (no shipped fixes to validate) |
| `signals-scout-insight-alerts` | No configured insight alerts |
| `signals-scout-mcp-tool-calls` | No `$mcp_tool_call` events |
| `signals-scout-skills-store` | Internal PostHog skill hygiene, not relevant |
| `signals-scout-tasks` | Internal PostHog tasks scout, not relevant |

You can enable any disabled specialist later from PostHog as those surfaces come into use.

---

## Custom scouts

One custom scout was proposed and declined:

| Scout | Decision | Rationale |
|---|---|---|
| **Watch your content funnel for engagement drop-offs** | Proposed, **declined by user** | Would have watched the multi-step navigation from dashboard → semester → course → document via `$pageview` URL depth. The built-in `web-analytics` scout covers per-channel traffic; this would have added in-app funnel-depth analysis. |

**Surfaces considered and ruled out:**
- Upload activity monitor — no custom `capture("file_uploaded")` event; upload errors are covered by error tracking
- Document download/share engagement — autocaptured button clicks too fragile without named events
- Cross-semester activity patterns — no session-scoped events to build a meaningful scout

**Noise escape hatch:** If any enabled scout produces noisy findings, set `emit: false` on its config in PostHog → Self-driving → Scouts to switch it to dry-run.

---

## Replay Vision scanners

Scanners are the sensor layer that watches **individual session recordings** on a schedule and pushes what they find to the inbox. Findings arrive at half weight; a second corroborating finding from a different session promotes it into a full report. Monthly credit spend was not estimated (the in-product sizing skill was unavailable on this deploy); at current volumes (no recordings yet) spend is 0.

| Scanner | Type | What it watches | Query scope | `emits_signals` | Status |
|---|---|---|---|---|---|
| **Course material loading failures** | monitor | Visible product breakage: blank/failed document renders, stuck spinners, unresponsive download/share buttons, empty course listings | Sessions that visited a 3-segment URL (document viewer pages at `/{semester}/{course}/{doc}`), 50% sample | ✓ | Created (id: `01a02fb0-818c-7ace-9cde-b2f63d0950a0`) |
| **Student navigation friction** | monitor | User frustration: repeated button hammering, failed upload retries, unresponsive sidebar links, abandoned content searches | Sessions containing `$rageclick` events, 100% sample | ✓ | Created (id: `01a02fb0-a7e8-73ea-a867-8162635f7a27`) |

Both scanners have no recordings to scan yet — they are armed and will begin working the day recordings arrive, with no second setup.

---

## Follow-ups

- [ ] **Connect a Conversations inbound channel** (email / inbox / Slack) in PostHog so Support tickets start flowing into the inbox. The `conversations/ticket` source is enabled and will route tickets automatically once a channel exists.
- [ ] **Add custom `posthog.capture()` calls** for key actions — `document_viewed`, `document_downloaded`, `file_uploaded`, `document_shared` — so product-analytics and funnel scouts have concrete domain events to watch. Without these, coverage relies entirely on autocaptured `$pageview` and click events.
- [ ] **Review Replay Vision scanner credit spend** once recordings begin arriving. The in-product sizing skill was unavailable during this run, so projected spend was not formally verified.
- [ ] **Enable `signals-scout-product-analytics`** once you have saved funnel or retention insights in PostHog — that scout watches them for conversion/retention regressions.
- [ ] **Enable `signals-scout-feature-flags`** if you start using PostHog feature flags.
- [ ] **Enable `signals-scout-experiments`** if you run A/B experiments.
- [ ] **Connect issue trackers** (GitHub Issues, Linear, Jira, etc.) at https://us.posthog.com/project/572906/pipeline/new/source if you want Self-driving to watch and auto-fix open issues.

---

## What happens next

The scout coordinator picks up fresh configs within **~30 minutes**; the first scans fire on the next tick. Scout runs draw from the project's daily budget (100 runs/day during early access). Replay Vision scanners sweep new recordings every 5 minutes once recordings exist. Findings cluster into reports in the inbox; immediately-actionable ones can start coding tasks automatically. Check your inbox at: https://us.posthog.com/project/572906/inbox
