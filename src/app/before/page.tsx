import { Sidebar } from "@heroui-pro/react";

import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { CurrentTokensView } from "@/components/tokens/current-tokens-view";

/** Baseline screen, kept side by side with the proposal for comparison. */
export default function CurrentTokensPage() {
  return (
    <Sidebar.Provider>
      <DashboardSidebar />
      <Sidebar.Main>
        <div className="flex items-center gap-3 p-4 md:hidden">
          <Sidebar.Trigger />
        </div>
        <CurrentTokensView />
      </Sidebar.Main>
    </Sidebar.Provider>
  );
}
