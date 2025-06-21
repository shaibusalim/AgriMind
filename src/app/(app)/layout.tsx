"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  AreaChart,
  Bug,
  CalendarDays,
  LayoutDashboard,
  Map,
  Sprout,
  User,
  MessageSquare,
  Languages,
} from "lucide-react";

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/logo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/crop-recommendation", label: "Crop Recommendation", icon: Sprout },
  { href: "/yield-prediction", label: "Yield Prediction", icon: AreaChart },
  { href: "/pest-detection", label: "Pest & Disease Detection", icon: Bug },
  { href: "/farm-map", label: "Farm Map", icon: Map },
  { href: "/seasonal-planning", label: "Seasonal Planning", icon: CalendarDays },
  { href: "/local-advisory", label: "Local Advisory", icon: Languages },
  { href: "/sms-notifications", label: "SMS Alerts", icon: MessageSquare },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Logo />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={{
                    children: item.label,
                    className: "bg-background text-foreground",
                  }}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
           <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9">
                <AvatarImage src="https://placehold.co/100x100.png" alt="@farmer" data-ai-hint="farmer avatar" />
                <AvatarFallback>F</AvatarFallback>
              </Avatar>
              <div className="flex flex-col group-data-[collapsible=icon]:hidden">
                <span className="text-sm font-semibold text-sidebar-foreground">
                  Farmer Joe
                </span>
                <span className="text-xs text-sidebar-foreground/70">
                  joe@agrimind.co
                </span>
              </div>
            </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center justify-between border-b bg-background/80 backdrop-blur-sm px-4 md:px-6 sticky top-0 z-30">
            <div className="flex items-center gap-2">
                 <SidebarTrigger className="md:hidden" />
                 <h1 className="text-lg font-semibold md:text-xl">
                    {navItems.find(item => item.href === pathname)?.label || 'Dashboard'}
                 </h1>
            </div>
            <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
                <span className="sr-only">Profile</span>
            </Button>
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8">
            {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
