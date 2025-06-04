"use client"

import { Building2, BarChart3, Users, FileText, Settings, LogOut } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const items = [
  {
    title: "Dashboard",
    url: "/",
    icon: BarChart3,
  },
  {
    title: "Vagas",
    url: "/jobs",
    icon: Building2,
  },
  {
    title: "Candidatos",
    url: "/candidates",
    icon: Users,
  },
  {
    title: "Análise de Currículos",
    url: "/analysis",
    icon: FileText,
  },
  {
    title: "Configurações",
    url: "/settings",
    icon: Settings,
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar className="border-r border-gray-200 dark:border-gray-800 shadow-lg">
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3">
          <div className="relative w-12 h-12 overflow-hidden rounded-xl shadow-lg">
            <Image src="/logo.png" alt="Viana e Moura" fill className="object-contain" />
          </div>
          <div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-red-700 to-red-600 bg-clip-text text-transparent">
              Viana e Moura
            </h2>
            <p className="text-sm font-medium text-amber-600">Sistema ATS</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link
                      href={item.url}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                        pathname === item.url
                          ? "bg-gradient-to-r from-red-700/10 to-red-600/5 text-red-700 dark:text-red-400 font-medium"
                          : "hover:bg-red-50 dark:hover:bg-red-950/20"
                      }`}
                    >
                      <item.icon className={`h-5 w-5 ${pathname === item.url ? "text-red-600" : ""}`} />
                      <span>{item.title}</span>
                      {pathname === item.url && (
                        <div className="absolute left-0 w-1 h-8 bg-gradient-to-b from-red-700 to-red-500 rounded-r-full" />
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-gray-100 dark:border-gray-800">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <button className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 text-red-600 w-full transition-all duration-300">
                <LogOut className="h-5 w-5" />
                <span>Sair</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
