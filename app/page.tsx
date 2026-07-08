"use client"

import { useState } from "react"
import { AppLayout } from "@/components/app-layout"
import { DashboardContent } from "@/components/dashboard-content"
import { LoginPage } from "@/components/login-page"
import { UserInterface } from "@/components/user-interface"
import { useAuth } from "@/lib/auth-context"

export default function HomePage() {
  const { isAuthenticated, userType, login, logout } = useAuth()
  const [showAdminLogin, setShowAdminLogin] = useState(false)

  const volverReconocimiento = async () => {
    await logout()
    setShowAdminLogin(false)
  }
  if (isAuthenticated && userType === "user") {
    window.location.href = "/mis-asistencias"
    return null
  }
  if (isAuthenticated && userType === "admin") {
    return (
      <AppLayout onLogout={volverReconocimiento}>
        <DashboardContent />
      </AppLayout>
    )
  }

  if (showAdminLogin) {
    return (
      <div className="relative">
        <LoginPage onLogin={login} />

        <button
          onClick={() => setShowAdminLogin(false)}
          className="fixed bottom-4 left-4 rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-lg hover:bg-slate-700"
        >
          Volver al reconocimiento
        </button>
      </div>
    )
  }

  return (
    <div className="relative">
      <UserInterface onLogout={() => setShowAdminLogin(true)} />

      <button
        onClick={() => setShowAdminLogin(true)}
        className="fixed bottom-4 right-4 rounded-full bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-lg hover:bg-slate-700"
      >
        Iniciar sesión
      </button>
    </div>
  )
}