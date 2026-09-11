"use client";

import { Sidebar } from "@heroui-pro/react";

import { CURRENT_PAGE_ID, NAV_SECTIONS } from "@/components/dashboard/navigation";

/** Navigation groups, shared by the desktop sidebar and its mobile sheet. */
export function DashboardNav() {
  return (
    <>
      {NAV_SECTIONS.map((section, index) => (
        <Sidebar.Group key={section.label ?? `section-${index}`}>
          {section.label ? (
            <Sidebar.GroupLabel>{section.label}</Sidebar.GroupLabel>
          ) : null}
          <Sidebar.Menu aria-label={section.label ?? "Navigation"}>
            {section.items.map((item) => (
              <Sidebar.MenuItem
                key={item.id}
                href="#"
                id={item.id}
                isCurrent={item.id === CURRENT_PAGE_ID}
                textValue={item.label}
              >
                <Sidebar.MenuIcon>
                  <item.icon className="size-4" />
                </Sidebar.MenuIcon>
                <Sidebar.MenuLabel>{item.label}</Sidebar.MenuLabel>
              </Sidebar.MenuItem>
            ))}
          </Sidebar.Menu>
        </Sidebar.Group>
      ))}
    </>
  );
}

/** Workspace badge shown at the top of the sidebar. */
export function DashboardBrand() {
  return (
    <div className="flex items-center gap-3 px-1 py-2">
      <div className="flex size-6 shrink-0 items-center justify-center rounded-md bg-foreground">
        <span className="text-sm font-bold text-background">H</span>
      </div>
      <span className="text-sm font-semibold text-foreground" data-sidebar="label">
        HeroUI Pro
      </span>
    </div>
  );
}
