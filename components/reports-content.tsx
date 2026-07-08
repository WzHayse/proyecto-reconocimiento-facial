"use client"

import { useEffect, useMemo, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  UserCheck,
  UserX,
  Clock,
  Users,
  TrendingUp,
  TrendingDown,
} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

type ReporteAsistencia = {
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
  } | null
}

const formatDate = (date: string) => {
  if (!date) return "-"
  const [year, month, day] = date.split("-")
  return `${day}/${month}/${year}`
}

const getDayName = (date: string) => {
  const dias = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]
  const d = new Date(`${date}T00:00:00`)
  return dias[d.getDay()]
}

export function ReportsContent() {
  const [records, setRecords] = useState<ReporteAsistencia[]>([])
  const [loading, setLoading] = useState(true)

  const cargarReportes = async () => {
    setLoading(true)

    const { data, error } = await supabase
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
          area
        )
      `)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error cargando reportes:", error)
      setRecords([])
      setLoading(false)
      return
    }

    setRecords((data as unknown as ReporteAsistencia[]) || [])
    setLoading(false)
  }

  useEffect(() => {
    cargarReportes()
  }, [])

  const total = records.length
  const authorized = records.filter((r) => r.estado_acceso === "Autorizado").length
  const denied = records.filter((r) => r.estado_acceso === "Denegado").length
  const outOfSchedule = records.filter((r) => r.estado_acceso === "Fuera de horario").length

  const accessByStatus = useMemo(() => {
    return [
      { name: "Autorizados", value: authorized, color: "hsl(var(--success))" },
      { name: "Denegados", value: denied, color: "hsl(var(--destructive))" },
      { name: "Fuera de horario", value: outOfSchedule, color: "hsl(var(--warning))" },
    ].filter((item) => item.value > 0)
  }, [authorized, denied, outOfSchedule])

  const accessByDay = useMemo(() => {
    const grouped: Record<string, number> = {}

    records.forEach((record) => {
      const day = getDayName(record.fecha)
      grouped[day] = (grouped[day] || 0) + 1
    })

    return Object.entries(grouped).map(([day, accesses]) => ({
      day,
      accesses,
    }))
  }, [records])

  const topAccessPersonnel = useMemo(() => {
    const grouped: Record<string, { name: string; area: string; accesses: number }> = {}

    records
      .filter((r) => r.personal)
      .forEach((record) => {
        const name = `${record.personal?.nombres} ${record.personal?.apellidos}`
        const area = record.personal?.area || "Sin área"

        if (!grouped[name]) {
          grouped[name] = { name, area, accesses: 0 }
        }

        grouped[name].accesses += 1
      })

    return Object.values(grouped)
      .sort((a, b) => b.accesses - a.accesses)
      .slice(0, 5)
  }, [records])

  const busiestDays = useMemo(() => {
    return [...accessByDay]
      .sort((a, b) => b.accesses - a.accesses)
      .slice(0, 5)
      .map((item, index) => ({
        day: item.day,
        accesses: item.accesses,
        trend: index <= 1 ? "up" : "down",
      }))
  }, [accessByDay])

  const porcentaje = (valor: number) => {
    if (total === 0) return "0%"
    return `${((valor / total) * 100).toFixed(1)}%`
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Reportes
        </h1>
        <p className="text-muted-foreground">
          Estadísticas y análisis del sistema de control de accesos
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total de Accesos</p>
                <p className="text-2xl font-bold">{loading ? "..." : total}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Autorizados</p>
                <p className="text-2xl font-bold text-success">
                  {loading ? "..." : authorized}
                </p>
                <p className="text-xs text-muted-foreground">
                  {porcentaje(authorized)} del total
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-success/10">
                <UserCheck className="h-5 w-5 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Denegados</p>
                <p className="text-2xl font-bold text-destructive">
                  {loading ? "..." : denied}
                </p>
                <p className="text-xs text-muted-foreground">
                  {porcentaje(denied)} del total
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
                <UserX className="h-5 w-5 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Fuera de Horario</p>
                <p className="text-2xl font-bold text-warning">
                  {loading ? "..." : outOfSchedule}
                </p>
                <p className="text-xs text-muted-foreground">
                  {porcentaje(outOfSchedule)} del total
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
                <Clock className="h-5 w-5 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-base">Accesos por Día</CardTitle>
            <CardDescription>Distribución de registros por fecha</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={accessByDay}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="day" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar
                    dataKey="accesses"
                    fill="hsl(var(--primary))"
                    radius={[4, 4, 0, 0]}
                    name="Accesos"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-base">Accesos por Estado</CardTitle>
            <CardDescription>Distribución de resultados de verificación</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {accessByStatus.length === 0 ? (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  No hay datos disponibles
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={accessByStatus}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      label
                    >
                      {accessByStatus.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-base">Personal con Mayor Accesos</CardTitle>
            <CardDescription>Top 5 según registros reales</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Personal</TableHead>
                  <TableHead>Área</TableHead>
                  <TableHead>Accesos</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topAccessPersonnel.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                      No hay datos disponibles.
                    </TableCell>
                  </TableRow>
                ) : (
                  topAccessPersonnel.map((person, index) => (
                    <TableRow key={person.name}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell className="font-medium">{person.name}</TableCell>
                      <TableCell>{person.area}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{person.accesses}</Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-base">Días con Mayor Flujo</CardTitle>
            <CardDescription>Análisis de días con más accesos</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Día</TableHead>
                  <TableHead>Accesos</TableHead>
                  <TableHead>Tendencia</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {busiestDays.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center text-muted-foreground">
                      No hay datos disponibles.
                    </TableCell>
                  </TableRow>
                ) : (
                  busiestDays.map((day) => (
                    <TableRow key={day.day}>
                      <TableCell className="font-medium">{day.day}</TableCell>
                      <TableCell>{day.accesses}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            day.trend === "up"
                              ? "bg-success hover:bg-success/80"
                              : "bg-warning text-warning-foreground hover:bg-warning/80"
                          }
                        >
                          {day.trend === "up" ? (
                            <TrendingUp className="mr-1 h-3 w-3" />
                          ) : (
                            <TrendingDown className="mr-1 h-3 w-3" />
                          )}
                          {day.trend === "up" ? "Mayor flujo" : "Menor flujo"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}