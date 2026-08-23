import { ExternalLink, MapPin } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { AddToCalendarButton } from "@/components/schedule/add-to-calendar-button";
import { TimetableGrid } from "@/components/schedule/timetable-grid";
import { Button } from "@/components/ui/button";
import { timetableMeta } from "@/lib/schedule";

const EDUPAGE_TIMETABLE_URL = "https://iilmgn.edupage.org/timetable/";

export default function SchedulePage() {
  return (
    <>
      <PageHeader
        title="Schedule"
        description={`${timetableMeta.university} · ${timetableMeta.school} · Section ${timetableMeta.section}`}
        action={
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              nativeButton={false}
              render={
                <a
                  href={EDUPAGE_TIMETABLE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
            >
              Official timetable
              <ExternalLink data-icon="inline-end" />
            </Button>
            <AddToCalendarButton />
          </div>
        }
      />

      <div className="mb-4 flex flex-col gap-1.5 text-[12px] text-muted-foreground sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-4 sm:gap-y-1 sm:text-[13px]">
        <p className="flex items-start gap-1.5">
          <MapPin className="mt-0.5 size-3.5 shrink-0" />
          <span>
            <span className="font-medium text-foreground">
              {timetableMeta.defaultRoom}
            </span>
            <span className="mx-1.5 text-border">·</span>
            {timetableMeta.campus}
          </span>
        </p>
        <p className="font-mono tabular-nums">
          Valid {timetableMeta.validFromLabel}
          <span className="mx-1.5 text-border">–</span>
          {timetableMeta.validToLabel}
        </p>
      </div>

      <TimetableGrid />
    </>
  );
}
