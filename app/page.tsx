"use client"
import { supabase } from "@/lib/supabase"
import { AppLayout } from "@/components/app-layout"
import { DashboardContent } from "@/components/dashboard-content"
import { LoginPage } from "@/components/login-page"
import { UserInterface } from "@/components/user-interface"
import { useAuth } from "@/lib/auth-context"

export default function HomePage() {
  console.log(supabase)
  const { isAuthenticated, userType, login, logout } = useAuth()

  if (!isAuthenticated) {
    return <LoginPage onLogin={login} />
  }

  // User interface for regular users
  if (userType === "user") {
    return <UserInterface onLogout={logout} />
  }

  // Admin interface for administrators
  return (
    <AppLayout onLogout={logout}>
      <DashboardContent />
    </AppLayout>
  )
}
