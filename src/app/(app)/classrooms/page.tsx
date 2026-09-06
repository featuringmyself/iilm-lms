import type { Metadata } from "next";
import Link from "next/link";
import { Calendar } from "lucide-react";

import { VacantClassroomsView } from "@/components/classrooms/vacant-classrooms-view";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { getCurrentCampusPeriod, getVacantRooms } from "@/lib/classrooms";

export const metadata: Metadata = {
  title: "Vacant Classrooms",
  description:
    "Find available and vacant classrooms across IILM University campus based on day and period.",
};

export default function ClassroomsPage() {
  const current = getCurrentCampusPeriod();
  const initialResult = getVacantRooms(current.day, current.period);

  return (
    <>
      <PageHeader
        title="Vacant Classrooms"
        action={
          <Button
            variant="outline"
            size="sm"
            className="h-10 w-full justify-center sm:h-8 sm:w-auto"
            nativeButton={false}
            render={<Link href="/schedule" />}
          >
            <Calendar className="size-3.5 text-foreground/70" strokeWidth={1.75} />
            <span>Timetable</span>
          </Button>
        }
      />

      <VacantClassroomsView
        initialResult={initialResult}
        initialDay={current.day}
        initialPeriod={current.period}
      />
    </>
  );
}
