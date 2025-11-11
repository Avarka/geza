"use client";

import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { NavUser } from "./nav-user";
import { FullUser } from "@/lib/auth";
import { usePathname } from "next/navigation";
import Link from "next/link";

type NavItem = {
  title: string;
  url: string;
  isActive?: boolean;
}

type NavGroup = {
  title: string;
  items: NavItem[];
}

const data: {
  [key: string]: NavGroup[];
} = {
  navMain: [
    {
      title: "Általános",
      items: [
        {
          title: "Órarend",
          url: "/dashboard/schedule"
        },
        {
          title: "Kért ZH módok",
          url: "/dashboard/bookings",
        },
      ],
    },
  ],
  navOperator: [
    {
      title: "Operátori",
      items: [
        {
          title: "Kérések kezelése",
          url: "/dashboard/bookings",
        },
        {
          title: "Szabályok kezelése",
          url: "/dashboard/operator/rules",
        },
        {
          title: "Felhasználók kezelése",
          url: "/dashboard/operator/users",
        },
        {
          title: "Félév kezelés",
          url: "/dashboard/operator/semester",
        }
      ]
    }
  ]
};

export function AppSidebar({ user, ...props }: {user: FullUser} & React.ComponentProps<typeof Sidebar>) {
  const isOperator = user.role?.includes("operator");
  const isAdmin = user.role?.includes("admin");
  const navToRender = isOperator ? data.navOperator : isAdmin ? [...data.navMain, ...data.navOperator] : data.navMain;
  const pathname = usePathname();

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <NavUser 
          user={{
            name: user.displayName || user.fullname || user.name,
            email: user.email,
            roles: user.role || "",
          }}
        />
      </SidebarHeader>
      <SidebarContent>
        {navToRender.map(item => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map(item => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={pathname === item.url}>
                      <Link href={item.url} >{item.title}</Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
