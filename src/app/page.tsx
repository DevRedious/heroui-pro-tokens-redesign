import { Sidebar } from "@heroui-pro/react";

import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { TokensView } from "@/components/tokens/tokens-view";

export default function TokensPage() {
  return (
    <Sidebar.Provider>
      <DashboardSidebar />
      <Sidebar.Main>
        {/* The sidebar collapses into a sheet below md, so the trigger only
            needs to be reachable there. */}
        <div className="flex items-center gap-3 p-4 md:hidden">
          <Sidebar.Trigger />
        </div>
        <TokensView />
      </Sidebar.Main>
    </Sidebar.Provider>
  );
}
