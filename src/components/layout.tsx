import { Outlet, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";

const routeTitleMap: Record<string, string> = {
  "/": "Overview",
  "/feeds": "Feeds",
  "/trends": "Trends",
  "/correlation_between_sources": "Sentiment Correlation Between Sources",
  "/bias_detection": "Bias Detection",
  "/advanced_analytics": "Advanced Analytics",
  "/extreme_detection": "Extreme Sentiment Detection",
  "/live_analysis_keyword": "Live Sentiment Analysis by Keyword",
  "/live_analysis_rss": "Live Sentiment Analysis from RSS",
  "/word_co_occurences": "Word Co-Occurrence",
  "/phrase_ferquency_trends": "Phrase Frequency Trends",
  "/raw_data": "Raw Data Viewer",
  "/about": "About",
  "/tech_stack": "Tech Stack",
  "/contact": "Contact",
};


export default function Layout() {
  const location = useLocation();
  const pageTitle = routeTitleMap[location.pathname] || "Page Not Found";
  const metaTitle = pageTitle

  useEffect(() => {
    document.title = `${metaTitle} | Power of Words`;
  }, [metaTitle]);


  return (
    <SidebarProvider>
      <div className="flex w-full min-h-screen">
        <AppSidebar />
        <div className="flex flex-col flex-1">
          <header className="border-b py-4">
            <div className="flex lg:px-3 h-5 items-center space-x-3 text-sm">
              <SidebarTrigger />
              <Separator orientation="vertical" />
              <h1 className="font-semibold text-xl">{pageTitle}</h1>
            </div>
          </header>

          <main className="flex-1 overflow-y-auto p-4">
            <Outlet context={{ pageTitle }} />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
} 