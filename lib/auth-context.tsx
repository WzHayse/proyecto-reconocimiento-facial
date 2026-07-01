"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { supabase } from "@/lib/supabase"

type UserType = "user" | "admin"

interface AuthContextType {
  isAuthenticated: boolean
  userType?: UserType
  loading: boolean
  login: (email: string, password: string) => Promise<{ error?: string }>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [userType, setUserType] = useState<UserType | undefined>()
  const [loading, setLoading] = useState(true)

  const loadUserProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from("perfiles")
      .select("rol_usuario")
      .eq("id_perfil", userId)
      .maybeSingle()

    if (error) {
      console.log("ERROR PERFIL:", error)
      setIsAuthenticated(false)
      setUserType(undefined)
      return
    }

    if (!data) {
      console.log("No existe perfil para el usuario:", userId)
      setIsAuthenticated(false)
      setUserType(undefined)
      return
    }

    setIsAuthenticated(true)
    setUserType(data.rol_usuario === "administrador" ? "admin" : "user")
  }

  useEffect(() => {
    const initAuth = async () => {
      const { data } = await supabase.auth.getSession()

      if (data.session?.user) {
        await loadUserProfile(data.session.user.id)
      } else {
        setIsAuthenticated(false)
        setUserType(undefined)
      }

      setLoading(false)
    }

    initAuth()

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        await loadUserProfile(session.user.id)
      } else {
        setIsAuthenticated(false)
        setUserType(undefined)
      }
    })

    return () => {
      listener.subscription.unsubscribe()
    }
  }, [])

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.log("ERROR SUPABASE:", error)
      return { error: error.message }
    }

    if (!data.user) {
      return { error: "No se pudo obtener el usuario autenticado." }
    }

    await loadUserProfile(data.user.id)
    return {}
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setIsAuthenticated(false)
    setUserType(undefined)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, userType, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error("useAuth debe ser usado dentro de AuthProvider")
  }

  return context
}