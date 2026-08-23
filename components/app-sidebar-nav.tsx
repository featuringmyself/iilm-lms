"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, ChevronDown } from "lucide-react";
import { useState } from "react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { getCourseTheme } from "@/lib/course-themes";
import type { ContentTree } from "@/lib/content";
import { cn } from "@/lib/utils";

interface AppSidebarNavProps {
  tree: ContentTree;
}

export function AppSidebarNav({ tree }: AppSidebarNavProps) {
  const pathname = usePathname();
  const [openSemesters, setOpenSemesters] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(tree.semesters.map((s) => [s.slug, true]))
  );
  const isScheduleActive = pathname === "/schedule";

  return (
    <>
      <SidebarGroup className="py-1.5">
        <SidebarGroupContent>
          <SidebarMenu className="gap-0.5">
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={isScheduleActive}
                size="sm"
                className="h-8 text-[13px] font-normal transition-colors duration-150"
                render={<Link href="/schedule" />}
              >
                <Calendar className="!size-3.5 text-primary" />
                <span className="truncate">Schedule</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      {tree.semesters.map((semester) => {
        const isOpen = openSemesters[semester.slug] ?? true;
        const isSemesterActive = pathname.startsWith(`/${semester.slug}`);

        return (
          <SidebarGroup key={semester.slug} className="py-1.5">
            <button
              type="button"
              onClick={() =>
                setOpenSemesters((prev) => ({
                  ...prev,
                  [semester.slug]: !prev[semester.slug],
                }))
              }
              className={cn(
                "mb-0.5 flex h-7 w-full items-center justify-between rounded-md px-2 transition-colors duration-150",
                "hover:bg-sidebar-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
              )}
            >
              <span
                className={cn(
                  "text-[11px] font-medium tracking-wide uppercase",
                  isSemesterActive
                    ? "text-sidebar-foreground"
                    : "text-muted-foreground"
                )}
              >
                {semester.displayName}
              </span>
              <ChevronDown
                className={cn(
                  "size-3.5 text-muted-foreground transition-transform duration-150",
                  !isOpen && "-rotate-90"
                )}
              />
            </button>
            {isOpen ? (
              <SidebarGroupContent>
                <SidebarMenu className="gap-0.5">
                  {semester.courses.map((course) => {
                    const theme = getCourseTheme(course.slug);
                    const Icon = theme.icon;
                    const courseHref = `/${semester.slug}/${course.slug}`;
                    const isCourseActive =
                      pathname === courseHref ||
                      pathname.startsWith(`${courseHref}/`);

                    return (
                      <SidebarMenuItem key={course.slug}>
                        <SidebarMenuButton
                          isActive={pathname === courseHref}
                          size="sm"
                          className={cn(
                            "h-8 text-[13px] font-normal transition-colors duration-150",
                            isCourseActive && pathname !== courseHref
                              ? "bg-sidebar-accent/60 text-sidebar-accent-foreground"
                              : null
                          )}
                          render={<Link href={courseHref} />}
                        >
                          <Icon className={cn("!size-3.5", theme.iconColor)} />
                          <span className="truncate">{course.name}</span>
                          <SidebarMenuBadge className="font-mono text-[10px] text-muted-foreground">
                            {course.documents.length}
                          </SidebarMenuBadge>
                        </SidebarMenuButton>
                        {isCourseActive && course.documents.length > 0 ? (
                          <SidebarMenuSub className="mx-0 ml-3.5 border-l border-sidebar-border px-0 pl-2.5">
                            {course.documents.map((doc) => {
                              const docHref = `/${semester.slug}/${course.slug}/${doc.slug}`;
                              return (
                                <SidebarMenuSubItem key={doc.slug}>
                                  <SidebarMenuSubButton
                                    size="sm"
                                    isActive={pathname === docHref}
                                    className="h-7 text-[12px] text-muted-foreground transition-colors duration-150 data-active:font-medium data-active:text-sidebar-accent-foreground"
                                    render={<Link href={docHref} />}
                                  >
                                    <span className="truncate">{doc.name}</span>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              );
                            })}
                          </SidebarMenuSub>
                        ) : null}
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            ) : null}
          </SidebarGroup>
        );
      })}
    </>
  );
}
