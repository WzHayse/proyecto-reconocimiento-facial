"use client"

import { useState, createContext, useContext, ReactNode } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { cn } from "@/lib/utils"

interface SidebarContextType {
  collapsed: boolean
  setCollapsed: (collapsed: boolean) => void
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined)

export function useSidebar() {
  const context = useContext(SidebarContext)
  if (!context) {
    throw new Error("useSidebar must be used within AppLayout")
  }
  return context
}

interface AppLayoutProps {
  children: ReactNode
  onLogout?: () => void
}

export function AppLayout({ children, onLogout }: AppLayoutProps) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed }}>
      <div className="min-h-screen bg-background">
        <AppSidebar onLogout={onLogout} />
        <main
          className={cn(
            "min-h-screen transition-all duration-300",
            "lg:ml-64",
            "pt-16 lg:pt-0"
          )}
        >
          <div className="p-4 lg:p-6">{children}</div>
        </main>
      </div>
    </SidebarContext.Provider>
  )
}
