"use client";

import {
  ChevronRight,
  ChevronsUpDown,
  LogOut,
  ShieldUser,
  UserCog,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";
import { toast } from "sonner";
import clsx from "clsx";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

export function NavUser({
  user,
}: {
  user: {
    name: string;
    email: string;
    roles: string;
  };
}) {
  const onLogout = async () => {
    await authClient.signOut();
    toast.success("Sikeres kijelentkezés!");
    redirect("/login");
  };

  const { isMobile } = useSidebar();

  const isOperator = user.roles.includes("operator");
  const isAdmin = user.roles.includes("admin");

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span
                  className={clsx("truncate font-medium", {
                    italic: isOperator,
                    "italic underline": isAdmin,
                  })}
                >
                  {isOperator && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <UserCog className="inline mb-0.5 mr-1 size-4" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Operátor</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                  {isAdmin && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <ShieldUser className="inline mb-0.5 mr-1 size-4" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Admin</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                  {user.name}
                </span>
                <span className="truncate text-xs">{user.email}</span>
              </div>
              {isMobile ? (
                <ChevronsUpDown className="ml-auto size-4" />
              ) : (
                <ChevronRight className="ml-auto size-4" />
              )}
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuItem onClick={onLogout}>
              <LogOut />
              Kijelentkezés
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
