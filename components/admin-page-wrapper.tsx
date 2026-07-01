"use client"

import { AppLayout } from "@/components/app-layout"
import { useAuth } from "@/lib/auth-context"
import { LoginPage } from "@/components/login-page"
import { ReactNode } from "react"

interface AdminPageWrapperProps {
  children: ReactNode
}

export function AdminPageWrapper({ children }: AdminPageWrapperProps) {
  const { isAuthenticated, userType, logout, login } = useAuth()

  if (!isAuthenticated) {
    return <LoginPage onLogin={login} />
  }

  // Si no es admin, mostrar login
  if (userType !== "admin") {
    return <LoginPage onLogin={login} />
  }

  return (
    <AppLayout onLogout={logout}>
      {children}
    </AppLayout>
  )
}
