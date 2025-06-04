"use client"

import type React from "react"
import { useState } from "react"
import { Bell, Moon, Sun, Search, Settings, LogOut, UserCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useTheme } from "next-themes"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export function Header() {
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState("")
  const [showNotifications, setShowNotifications] = useState(false)

  const notifications = [
    {
      id: 1,
      title: "Novo candidato",
      message: "João Silva aplicou para Desenvolvedor Frontend",
      time: "2 min atrás",
      unread: true,
    },
    {
      id: 2,
      title: "Entrevista agendada",
      message: "Maria Santos - Designer UX/UI às 14h",
      time: "1 hora atrás",
      unread: true,
    },
    { id: 3, title: "Vaga preenchida", message: "Analista de RH foi preenchida", time: "3 horas atrás", unread: false },
  ]

  const unreadCount = notifications.filter((n) => n.unread).length

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      toast({
        title: "Busca realizada",
        description: `Buscando por: "${searchTerm}"`,
      })
      // Aqui você pode implementar a lógica de busca real
      router.push(`/search?q=${encodeURIComponent(searchTerm)}`)
    }
  }

  const handleLogout = () => {
    toast({
      title: "Logout realizado",
      description: "Você foi desconectado com sucesso",
    })
    // Aqui você implementaria a lógica real de logout
    router.push("/login")
  }

  const handleProfile = () => {
    router.push("/profile")
  }

  const handleSettings = () => {
    router.push("/settings")
  }

  const markNotificationAsRead = (id: number) => {
    toast({
      title: "Notificação marcada como lida",
      description: "A notificação foi marcada como lida",
    })
  }

  return (
    <>
      <header className="sticky top-0 z-30 flex items-center justify-between p-4 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800" />
          <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100 hidden md:block">
            Sistema de Recrutamento
          </h1>
          <form onSubmit={handleSearch} className="relative hidden md:flex items-center max-w-md w-full">
            <Search className="absolute left-3 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar candidatos, vagas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus-visible:ring-red-500"
            />
            <Button type="submit" size="sm" className="ml-2 bg-red-600 hover:bg-red-700">
              Buscar
            </Button>
          </form>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Alternar tema</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowNotifications(true)}
            className="relative text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-600 text-white text-xs">
                {unreadCount}
              </Badge>
            )}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 px-2 hover:bg-gray-100 dark:hover:bg-gray-800">
                <Avatar className="h-8 w-8 border-2 border-gray-200 dark:border-gray-700">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback className="bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300">
                    AM
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start text-left">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Admin</span>
                  <span className="text-xs text-gray-500">Administrador</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={handleProfile} className="cursor-pointer">
                <UserCircle className="mr-2 h-4 w-4" />
                <span>Meu Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSettings} className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Configurações</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-red-600 cursor-pointer">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Modal de Notificações */}
      <Dialog open={showNotifications} onOpenChange={setShowNotifications}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notificações
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  notification.unread
                    ? "bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-800"
                    : "bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700"
                }`}
                onClick={() => markNotificationAsRead(notification.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100">{notification.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{notification.message}</p>
                    <p className="text-xs text-gray-500 mt-2">{notification.time}</p>
                  </div>
                  {notification.unread && <div className="w-2 h-2 bg-red-600 rounded-full mt-1"></div>}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-end pt-4">
            <Button variant="outline" onClick={() => setShowNotifications(false)}>
              Fechar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
