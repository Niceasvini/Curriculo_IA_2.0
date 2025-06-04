import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { SidebarInset } from "@/components/ui/sidebar"
import { isSupabaseConfigured } from "@/lib/supabase"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Info } from "lucide-react"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Viana Moura - Sistema ATS",
  description: "Sistema de Análise de Currículos - Applicant Tracking System",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabaseConfigured = isSupabaseConfigured()

  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="bg-gray-50 dark:bg-gray-950">
              <Header />
              <main className="flex-1 p-6">
                {!supabaseConfigured && (
                  <Alert className="mb-6 border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950">
                    <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <AlertDescription className="text-blue-800 dark:text-blue-200">
                      <strong>Modo Demo:</strong> Configure as variáveis de ambiente NEXT_PUBLIC_SUPABASE_URL e
                      NEXT_PUBLIC_SUPABASE_ANON_KEY para conectar ao Supabase. Atualmente usando dados de demonstração.
                    </AlertDescription>
                  </Alert>
                )}
                {children}
              </main>
              <Footer />
            </SidebarInset>
          </SidebarProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
