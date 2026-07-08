"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { ScanFace, Lock, User, Shield } from "lucide-react"

interface LoginPageProps {
  onLogin: (email: string, password: string) => Promise<{ error?: string }>
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!email || !password) {
      setError("Por favor complete todos los campos")
      return
    }

    setIsLoading(true)
    const result = await onLogin(email, password)
    console.log(result)
    setIsLoading(false)

    if (result?.error) {
      setError(result.error)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-4">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAwMDAiIGZpbGwtb3BhY2l0eT0iMC4wMiI+PGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMiIvPjwvZz48L2c+PC9zdmc+')] opacity-50" />

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-primary shadow-lg shadow-primary/25">
            <ScanFace className="h-10 w-10 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Sistema de Control de Accesos OGTI
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Reconocimiento Facial con Inteligencia Artificial
          </p>
        </div>

        <Card className="border-border shadow-xl">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-center text-lg">Iniciar Sesión</CardTitle>
            <CardDescription className="text-center">
              Ingrese sus credenciales para acceder al sistema
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="rounded-lg border bg-muted/40 p-3 text-sm text-muted-foreground">
                El tipo de acceso se valida automáticamente según el rol registrado en Supabase.
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Ingrese su correo"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Ingrese su contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-9"
                    disabled={isLoading}
                  />
                </div>
              </div>

              {error && <p className="text-sm text-destructive">{error}</p>}

              <Button type="submit" className="w-full gap-2" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Verificando...
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4" />
                    Iniciar Sesión
                  </>
                )}
              </Button>
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-border" />
                <span className="text-xs text-muted-foreground">o</span>
                <div className="h-px flex-1 bg-border" />
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full gap-2"
                onClick={() => {
                  window.location.href = "/"
                }}
              >
                <ScanFace className="h-4 w-4" />
                Ingresar con Reconocimiento Facial
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <div className="inline-flex items-center gap-2 rounded-lg bg-white/80 px-4 py-2 shadow-sm backdrop-blur-sm">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
              <Shield className="h-4 w-4 text-primary" />
            </div>
            <div className="text-left">
              <p className="text-xs font-medium text-foreground">DIRIS Lima Este</p>
              <p className="text-xs text-muted-foreground">
                Dirección de Redes Integradas de Salud Lima Este
              </p>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Oficina de Gestión de Tecnologías de la Información
        </p>
      </div>
    </div>
  )
}