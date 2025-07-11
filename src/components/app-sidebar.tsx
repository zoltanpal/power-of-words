import {
  Mail,
  Target,
  RssIcon,
  TrendingUpIcon,
  //RadioReceiverIcon,
  SearchIcon,
  InfoIcon,
  LinkIcon,
  ScaleIcon,
  //AlertTriangleIcon,
  ZapIcon,
  Link2Icon
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarFooter
} from "@/components/ui/sidebar";

import { Separator } from "@/components/ui/separator";
import { SidebarMenuGroup } from "@/components/elements/SidebarMenuGroup";

const mainMenuItems = [
  { title: "Overview", url: "/", icon: Target },
  { title: "Feeds", url: "/feeds", icon: RssIcon },
];

const analyticsMenuItems = [
  { title: "Trends", url: "/trends", icon: TrendingUpIcon },
  { title: "Source Correlation", url: "/correlation_between_sources", icon: LinkIcon },
  { title: "Bias Detection", url: "/bias_detection", icon: ScaleIcon },
  { title: "Word Co-Occurences", url: "/word_co_occurences", icon: Link2Icon },
  //{ title: "Extreme Detection", url: "/extreme_detection", icon: AlertTriangleIcon },
];

const liveAnalyticsMenuItems = [
  { title: "Search by Keyword", url: "/live_analysis_keyword", icon: SearchIcon },
  //{ title: "Monitor RSS Feeds", url: "/live_analysis_rss", icon: RadioReceiverIcon }
];

const footerMenuItems = [
  { title: "About", url: "/about", icon: InfoIcon },
  { title: "TechStack", url: "/tech_stack", icon: ZapIcon },
  { title: "Contact", url: "/contact", icon: Mail },
];

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarHeader className="px-1">
            <div className="flex items-center gap-2 text-xl font-bold">
              <img src="/favicon.png" className="w-12 h-12 rounded-full" alt="Logo" />
              <span>Power of Words</span>
            </div>
          </SidebarHeader>

          <Separator />

          <SidebarMenuGroup items={mainMenuItems} />
          <SidebarMenuGroup items={analyticsMenuItems} label="Historycal Analytics" />
          <SidebarMenuGroup items={liveAnalyticsMenuItems} label="Live Analysis" />
        </SidebarGroup>
      </SidebarContent>

      <Separator />

      <SidebarFooter>
        <SidebarGroup>
          <SidebarMenuGroup items={footerMenuItems}  />
        </SidebarGroup>
      </SidebarFooter>
      <div className="text-xs p-2 text-right">(beta v{import.meta.env.VITE_APP_VERSION})</div>
    </Sidebar>
  );
} 