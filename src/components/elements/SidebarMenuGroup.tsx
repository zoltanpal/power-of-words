import {
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarGroupContent,
    SidebarGroupLabel,
  } from "@/components/ui/sidebar";
  import { NavLink } from "react-router-dom";
  import { cn } from "@/lib/utils";
  
  type MenuItem = {
    title: string;
    url: string;
    icon: React.ElementType;
  };
  
  type Props = {
    items: MenuItem[];
    label?: string;
  };
  
  export function SidebarMenuGroup({ items, label }: Props) {
    return (
      <SidebarGroupContent className="mt-2">
        {label && <SidebarGroupLabel className="font-medium">{label}</SidebarGroupLabel>}
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <NavLink to={item.url}>
                {({ isActive }) => (
                  <SidebarMenuButton
                    asChild
                    className={cn(
                      "rounded-md",
                      isActive
                        ? "bg-gray-200 text-zinc-950 text-foreground font-medium"
                        : ""
                    )}
                  >
                    <span className="flex items-center gap-2 px-2 py-2">
                      <item.icon className="h-4 w-4" />
                      <span className="text-base">{item.title}</span>
                    </span>
                  </SidebarMenuButton>
                )}
              </NavLink>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    );
  }
  