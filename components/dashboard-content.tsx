"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, UserCheck, UserX, Clock, Camera, Brain } from "lucide-react"

type Asistencia = {
  id_asistencia: string
  fecha: string
  hora: string
  estado_acceso: string
  metodo_validacion: string
  observacion: string | null
  personal: {
    nombres: string
    apellidos: string
    area: string
    rol: string
  } | null
}

const formatDate = (date: string) => {
  if (!date) return "-"
  const [year, month, day] = date.split("-")
  return `${day}/${month}/${year}`
}

const formatTime = (time: string) => {
  if (!time) return "-"
  return time.split(".")[0]
}

const badgeColor = (estado: string) => {
  if (estado === "Autorizado") return "bg-green-600 hover:bg-green-700"
  if (estado === "Denegado") return "bg-red-600 hover:bg-red-700"
  return "bg-yellow-500 hover:bg-yellow-600"
}

export function DashboardContent() {
  const [personalTotal, setPersonalTotal] = useState(0)
  const [asistenciasHoy, setAsistenciasHoy] = useState(0)
  const [autorizadosHoy, setAutorizadosHoy] = useState(0)
  const [denegadosHoy, setDenegadosHoy] = useState(0)
  const [ultimasAsistencias, setUltimasAsistencias] = useState<Asistencia[]>([])
  const [loading, setLoading] = useState(true)

  const fechaHoy = new Date().toLocaleDateString("en-CA", {
    timeZone: "America/Lima",
  })

  const cargarDashboard = async () => {
    setLoading(true)

    const { count: totalPersonal } = await supabase
      .from("personal")
      .select("*", { count: "exact", head: true })

    const { count: totalAsistenciasHoy } = await supabase
      .from("asistencias")
      .select("*", { count: "exact", head: true })

    const { count: totalAutorizadosHoy } = await supabase
      .from("asistencias")
      .select("*", { count: "exact", head: true })
      .eq("estado_acceso", "Autorizado")

    const { count: totalDenegadosHoy } = await supabase
      .from("asistencias")
      .select("*", { count: "exact", head: true })
      .eq("estado_acceso", "Denegado")

    const { data: asistencias } = await supabase
      .from("asistencias")
      .select(`
        id_asistencia,
        fecha,
        hora,
        estado_acceso,
        metodo_validacion,
        observacion,
        personal (
          nombres,
          apellidos,
          area,
          rol
        )
      `)
      .order("created_at", { ascending: false })
      .limit(8)

    setPersonalTotal(totalPersonal || 0)
    setAsistenciasHoy(totalAsistenciasHoy || 0)
    setAutorizadosHoy(totalAutorizadosHoy || 0)
    setDenegadosHoy(totalDenegadosHoy || 0)
    setUltimasAsistencias((asistencias as unknown as Asistencia[]) || [])
    setLoading(false)
  }

  useEffect(() => {
    cargarDashboard()
  }, [])

  const ultimoAcceso = ultimasAsistencias[0]

  const ultimaAlerta = ultimasAsistencias.find(
    (item) => item.estado_acceso === "Denegado"
  )

  const stats = [
    {
      title: "Total de Asistencias",
      value: asistenciasHoy,
      icon: Users,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Personal Registrado",
      value: personalTotal,
      icon: UserCheck,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Accesos Autorizados",
      value: autorizadosHoy,
      icon: UserCheck,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Accesos Denegados",
      value: denegadosHoy,
      icon: UserX,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Panel de control del sistema de reconocimiento facial - DIRIS Lima Este
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-border">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`rounded-lg p-2 ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loading ? "..." : stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {ultimaAlerta && (
        <Card className="border-red-200 bg-red-50 shadow-sm">
          <CardHeader>
            <CardTitle className="text-base text-red-700">
              ⚠ Alerta de Seguridad
            </CardTitle>
            <CardDescription>
              Se detectó un intento de acceso no autorizado.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="grid gap-2 text-sm sm:grid-cols-3">
              <div>
                <p className="text-muted-foreground">Fecha</p>
                <p className="font-semibold">{formatDate(ultimaAlerta.fecha)}</p>
              </div>

              <div>
                <p className="text-muted-foreground">Hora</p>
                <p className="font-semibold">{formatTime(ultimaAlerta.hora)}</p>
              </div>

              <div>
                <p className="text-muted-foreground">Estado</p>
                <Badge className="bg-red-600 hover:bg-red-700">
                  {ultimaAlerta.estado_acceso}
                </Badge>
              </div>
            </div>

            <p className="mt-3 rounded-lg bg-white/70 p-3 text-sm">
              {ultimaAlerta.observacion || "Rostro no reconocido"}
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-base">Estado del Sistema</CardTitle>
            <CardDescription>Monitoreo general</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg bg-secondary/50 p-3">
              <div className="flex items-center gap-3">
                <Camera className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-medium">Cámara Web</span>
              </div>
              <Badge className="bg-green-600 hover:bg-green-700">Operativa</Badge>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-secondary/50 p-3">
              <div className="flex items-center gap-3">
                <Brain className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-medium">Reconocimiento IA</span>
              </div>
              <Badge className="bg-green-600 hover:bg-green-700">Activo</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Último Acceso Registrado</CardTitle>
            <CardDescription>Información del ingreso más reciente</CardDescription>
          </CardHeader>
          <CardContent>
            {ultimoAcceso ? (
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                    <Users className="h-7 w-7 text-primary" />
                  </div>

                  {ultimoAcceso.estado_acceso === "Denegado" ? (
                    <div>
                      <p className="font-semibold text-red-600">⚠ Acceso denegado</p>
                      <p className="text-sm text-muted-foreground">
                        {ultimoAcceso.observacion || "Rostro no reconocido"}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="font-semibold">
                        {ultimoAcceso.personal?.nombres} {ultimoAcceso.personal?.apellidos}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {ultimoAcceso.personal?.area || "Sin área"}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">
                    <Clock className="mr-1 h-3 w-3" />
                    {formatTime(ultimoAcceso.hora)}
                  </Badge>
                  <Badge className={badgeColor(ultimoAcceso.estado_acceso)}>
                    {ultimoAcceso.estado_acceso}
                  </Badge>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                Todavía no hay asistencias registradas.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-base">Últimas Asistencias</CardTitle>
          <CardDescription>Registros recientes del sistema</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="py-2">Fecha</th>
                  <th className="py-2">Hora</th>
                  <th className="py-2">Personal</th>
                  <th className="py-2">Área</th>
                  <th className="py-2">Método</th>
                  <th className="py-2">Estado</th>
                </tr>
              </thead>
              <tbody>
                {ultimasAsistencias.length > 0 ? (
                  ultimasAsistencias.map((item) => (
                    <tr key={item.id_asistencia} className="border-b">
                      <td className="py-2">{formatDate(item.fecha)}</td>
                      <td className="py-2">{formatTime(item.hora)}</td>
                      <td className="py-2 font-medium">
                        {item.personal
                          ? `${item.personal.nombres} ${item.personal.apellidos}`
                          : "Acceso denegado"}
                      </td>
                      <td className="py-2">
                        {item.personal?.area || "Rostro no reconocido"}
                      </td>
                      <td className="py-2">{item.metodo_validacion}</td>
                      <td className="py-2">
                        <Badge className={badgeColor(item.estado_acceso)}>
                          {item.estado_acceso}
                        </Badge>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-4 text-center text-muted-foreground">
                      No hay asistencias registradas.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}