import { NextRequest, NextResponse } from "next/server";

import {
  fetchVacantRooms,
  isValidPeriod,
  isValidWeekday,
} from "@/lib/classrooms";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const day = searchParams.get("day");
  const periodParam = searchParams.get("period");
  const forceFresh = searchParams.get("fresh") === "true";

  if (!day || !isValidWeekday(day)) {
    return NextResponse.json(
      {
        error:
          "Invalid or missing 'day' parameter. Allowed values: monday, tuesday, wednesday, thursday, friday, saturday.",
      },
      { status: 400 }
    );
  }

  const period = parseInt(periodParam ?? "", 10);
  if (!isValidPeriod(period)) {
    return NextResponse.json(
      {
        error:
          "Invalid or missing 'period' parameter. Allowed values: integers from 1 to 9.",
      },
      { status: 400 }
    );
  }

  try {
    const result = await fetchVacantRooms(day, period, { forceFresh });
    return NextResponse.json(result, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=900, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to retrieve vacant classrooms",
      },
      { status: 502 }
    );
  }
}
