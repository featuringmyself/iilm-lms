import { ExternalLink, MapPin } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { AddToCalendarButton } from "@/components/schedule/add-to-calendar-button";
import { ScheduleView } from "@/components/schedule/schedule-view";
import { Button } from "@/components/ui/button";
import { getHomework, getReminders, timetableMeta } from "@/lib/schedule";

const EDUPAGE_TIMETABLE_URL = "https://iilmgn.edupage.org/timetable/";

export default function SchedulePage() {
  const homework = getHomework();
  const reminders = getReminders();

  return (
    <>
      <PageHeader
        title="Schedule"
        description={`${timetableMeta.university} · ${timetableMeta.school} · Section ${timetableMeta.section}`}
        action={
          <>
            <Button
              variant="outline"
              size="sm"
              className="h-10 w-full justify-center sm:h-8 sm:w-auto"
              nativeButton={false}
              render={
                <a
                  href={EDUPAGE_TIMETABLE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                />
              }
            >
              <span className="sm:hidden">EduPage</span>
              <span className="hidden sm:inline">Official timetable</span>
              <ExternalLink data-icon="inline-end" strokeWidth={1.75} />
            </Button>
            <AddToCalendarButton />
          </>
        }
      />

      <div className="mb-4 flex flex-col gap-1.5 text-[12px] text-muted-foreground sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-4 sm:gap-y-1 sm:text-[13px]">
        <p className="flex items-start gap-1.5">
          <MapPin className="mt-0.5 size-3.5 shrink-0" strokeWidth={1.75} />
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

      <ScheduleView homework={homework} reminders={reminders} />
    </>
  );
}
