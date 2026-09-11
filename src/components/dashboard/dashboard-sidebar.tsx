"use client";

import { Avatar } from "@heroui/react";
import { Sidebar } from "@heroui-pro/react";

import { DashboardBrand, DashboardNav } from "@/components/dashboard/dashboard-nav";
import { DEMO_ACCOUNT } from "@/data/demo-data";

/** Desktop sidebar plus the sheet it turns into on small screens. */
export function DashboardSidebar() {
  return (
    <>
      <Sidebar>
        <Sidebar.Header>
          <DashboardBrand />
        </Sidebar.Header>
        <Sidebar.Content>
          <DashboardNav />
        </Sidebar.Content>
        <Sidebar.Footer>
          <AccountSummary />
        </Sidebar.Footer>
        <Sidebar.Rail />
      </Sidebar>
      <Sidebar.Mobile>
        <Sidebar.Header>
          <DashboardBrand />
        </Sidebar.Header>
        <Sidebar.Content>
          <DashboardNav />
        </Sidebar.Content>
        <Sidebar.Footer>
          <AccountSummary />
        </Sidebar.Footer>
      </Sidebar.Mobile>
    </>
  );
}

function AccountSummary() {
  return (
    <div className="flex items-center gap-3 px-1 py-2">
      <Avatar className="size-7">
        <Avatar.Fallback className="text-xs">AR</Avatar.Fallback>
      </Avatar>
      <div className="flex min-w-0 flex-col" data-sidebar="label">
        <span className="truncate text-sm font-medium text-foreground">
          {DEMO_ACCOUNT.name}
        </span>
        <span className="truncate text-xs text-muted">{DEMO_ACCOUNT.email}</span>
      </div>
    </div>
  );
}
