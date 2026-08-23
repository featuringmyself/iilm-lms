"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, ChevronDown } from "lucide-react";
import { useState, type ReactNode } from "react";

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
  useSidebar,
} from "@/components/ui/sidebar";
import { getCourseTheme } from "@/lib/course-themes";
import type { ContentTree } from "@/lib/content";
import { cn } from "@/lib/utils";

interface AppSidebarNavProps {
  tree: ContentTree;
}

/** Closes the mobile sheet on navigate; no-op on desktop. */
function useCloseMobileSidebar() {
  const { isMobile, setOpenMobile } = useSidebar();
  return () => {
    if (isMobile) setOpenMobile(false);
  };
}

export function AppSidebarBrandLink({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const closeMobile = useCloseMobileSidebar();

  return (
    <Link href="/" className={className} onClick={closeMobile}>
      {children}
    </Link>
  );
}

export function AppSidebarScheduleLink() {
  const pathname = usePathname();
  const closeMobile = useCloseMobileSidebar();
  const isScheduleActive = pathname === "/schedule";

  return (
    <SidebarMenu className="gap-0.5">
      <SidebarMenuItem>
        <SidebarMenuButton
          isActive={isScheduleActive}
          size="sm"
          className="h-8 text-[13px] font-normal transition-colors duration-150"
          render={<Link href="/schedule" onClick={closeMobile} />}
        >
          <Calendar className="!size-3.5 text-primary" strokeWidth={1.75} />
          <span className="truncate">Schedule</span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

export function AppSidebarNav({ tree }: AppSidebarNavProps) {
  const pathname = usePathname();
  const closeMobile = useCloseMobileSidebar();
  const [openSemesters, setOpenSemesters] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(tree.semesters.map((s) => [s.slug, true]))
  );

  return (
    <>
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
                "mb-0.5 flex h-9 w-full items-center justify-between rounded-md px-2 transition-colors duration-150 md:h-7",
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
                strokeWidth={1.75}
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
                            "h-10 text-[13px] font-normal transition-colors duration-150 md:h-8",
                            isCourseActive && pathname !== courseHref
                              ? "bg-sidebar-accent/60 text-sidebar-accent-foreground"
                              : null
                          )}
                          render={
                            <Link href={courseHref} onClick={closeMobile} />
                          }
                        >
                          <Icon
                            className={cn("!size-3.5", theme.iconColor)}
                            strokeWidth={1.75}
                          />
                          <span className="truncate">{course.name}</span>
                          <SidebarMenuBadge className="font-mono text-[10px] text-muted-foreground">
                            {course.documents.length}
                          </SidebarMenuBadge>
                        </SidebarMenuButton>
                        {isCourseActive && course.documents.length > 0 ? (
                          <SidebarMenuSub className="mx-0 ml-3.5 border-l border-sidebar-border px-0 pl-2.5">
                            {course.documents.map((doc) => {
                              const isPdf = doc.extension === "pdf";
                              const docHref = isPdf
                                ? doc.publicPath
                                : `/${semester.slug}/${course.slug}/${doc.slug}`;
                              return (
                                <SidebarMenuSubItem key={doc.slug}>
                                  <SidebarMenuSubButton
                                    size="sm"
                                    isActive={!isPdf && pathname === docHref}
                                    className="h-9 text-[12px] text-muted-foreground transition-colors duration-150 data-active:font-medium data-active:text-sidebar-accent-foreground md:h-7"
                                    render={
                                      isPdf ? (
                                        <a href={docHref} onClick={closeMobile} />
                                      ) : (
                                        <Link
                                          href={docHref}
                                          onClick={closeMobile}
                                        />
                                      )
                                    }
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
