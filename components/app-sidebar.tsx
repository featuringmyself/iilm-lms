import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getContentTree } from "@/lib/content";
import Link from "next/link";
import { AppSidebarNav, AppSidebarScheduleLink } from "./app-sidebar-nav";

export function AppSidebar() {
  const tree = getContentTree();

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border px-3 py-3">
        <div className="flex items-center gap-2.5 px-1">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary text-[11px] font-semibold tracking-tight text-primary-foreground">
            I
          </div>
          <Link href="/" className="min-w-0 leading-tight">
            <p className="truncate text-[13px] font-semibold tracking-tight text-sidebar-foreground">
              IILM LMS
            </p>
            <p className="truncate text-[11px] text-muted-foreground">
              Unofficial · Student Led
            </p>
          </Link>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <ScrollArea className="h-full">
          <div className="px-2 py-2">
            <AppSidebarNav tree={tree} />
          </div>
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border px-2 py-2">
        <AppSidebarScheduleLink />
        <p className="px-2 pt-1.5 font-mono text-[11px] tabular-nums text-muted-foreground">
          {tree.totalCourses} course{tree.totalCourses === 1 ? "" : "s"}
          <span className="mx-1.5 text-border">·</span>
          {tree.totalDocuments} material
          {tree.totalDocuments === 1 ? "" : "s"}
        </p>
      </SidebarFooter>
    </Sidebar>
  );
}
