"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  ScanFace,
  ClipboardList,
  Users,
  BarChart3,
  Settings,
  Shield,
  Menu,
  X,
  ChevronLeft,
  LogOut,
} from "lucide-react"
import { Button } from "@/components/ui/button"

const navigation = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Reconocimiento Facial",
    href: "/reconocimiento",
    icon: ScanFace,
  },
  {
    name: "Registro de Accesos",
    href: "/registro",
    icon: ClipboardList,
  },
  {
    name: "Gestión de Personal",
    href: "/personal",
    icon: Users,
  },
  {
    name: "Reportes",
    href: "/reportes",
    icon: BarChart3,
  },
  {
    name: "Configuración",
    href: "/configuracion",
    icon: Settings,
  },
]

interface AppSidebarProps {
  onLogout?: () => void
}

export function AppSidebar({ onLogout }: AppSidebarProps) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed left-4 top-4 z-50 lg:hidden"
        onClick={() => setMobileOpen(!mobileOpen)}
      >
        {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen bg-sidebar text-sidebar-foreground transition-all duration-300",
          collapsed ? "w-20" : "w-64",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sidebar-primary">
              <Shield className="h-6 w-6 text-sidebar-primary-foreground" />
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className="text-sm font-semibold">DIRIS Lima Este</span>
                <span className="text-xs text-sidebar-foreground/70">Control de Accesos</span>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 overflow-y-auto p-3">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                  )}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {!collapsed && <span>{item.name}</span>}
                </Link>
              )
            })}
          </nav>

          {/* Collapse button - desktop only */}
          <div className="hidden border-t border-sidebar-border p-3 lg:block">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-center text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              onClick={() => setCollapsed(!collapsed)}
            >
              <ChevronLeft
                className={cn(
                  "h-4 w-4 transition-transform",
                  collapsed && "rotate-180"
                )}
              />
              {!collapsed && <span className="ml-2">Colapsar</span>}
            </Button>
          </div>

          {/* Logout Button */}
          {onLogout && (
            <div className="border-t border-sidebar-border p-3">
              <Button
                variant="ghost"
                size="sm"
                className="w-full justify-start gap-2 text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                onClick={onLogout}
              >
                <LogOut className="h-4 w-4" />
                {!collapsed && <span>Cerrar Sesión</span>}
              </Button>
            </div>
          )}

          {/* Footer */}
          <div className="border-t border-sidebar-border p-4">
            {!collapsed && (
              <div className="text-xs text-sidebar-foreground/60">
                <p>Sistema de Reconocimiento Facial</p>
                <p>v1.0.0 - OGTI</p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  )
}
