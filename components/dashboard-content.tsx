"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  UserCheck,
  UserX,
  Clock,
  Camera,
  Brain,
  TrendingUp,
} from "lucide-react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts"
import { mockDailyStats, mockHourlyStats, mockAccessRecords } from "@/lib/mock-data"

const stats = [
  {
    title: "Accesos Hoy",
    value: "47",
    change: "+12%",
    icon: Users,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    title: "Personal Autorizado",
    value: "43",
    description: "de 47 intentos",
    icon: UserCheck,
    color: "text-success",
    bgColor: "bg-success/10",
  },
  {
    title: "Accesos Denegados",
    value: "3",
    description: "hoy",
    icon: UserX,
    color: "text-destructive",
    bgColor: "bg-destructive/10",
  },
  {
    title: "Último Acceso",
    value: "09:10",
    description: "Roberto Salazar",
    icon: Clock,
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
]

const systemStatus = [
  {
    name: "Cámara de Seguridad",
    status: "Operativa",
    icon: Camera,
    online: true,
  },
  {
    name: "Sistema de Reconocimiento",
    status: "Activo",
    icon: Brain,
    online: true,
  },
]

export function DashboardContent() {
  const lastAccess = mockAccessRecords[6]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Dashboard
        </h1>
        <p className="text-muted-foreground">
          Panel de control del sistema de reconocimiento facial - DIRIS Lima Este
        </p>
      </div>

      {/* Stats Cards */}
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
              <div className="text-2xl font-bold">{stat.value}</div>
              {stat.change && (
                <p className="flex items-center gap-1 text-xs text-success">
                  <TrendingUp className="h-3 w-3" />
                  {stat.change} vs. ayer
                </p>
              )}
              {stat.description && (
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* System Status and Last Access */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* System Status */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-base">Estado del Sistema</CardTitle>
            <CardDescription>Monitoreo en tiempo real</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {systemStatus.map((system) => (
              <div
                key={system.name}
                className="flex items-center justify-between rounded-lg bg-secondary/50 p-3"
              >
                <div className="flex items-center gap-3">
                  <system.icon className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm font-medium">{system.name}</span>
                </div>
                <Badge
                  variant={system.online ? "default" : "destructive"}
                  className={system.online ? "bg-success hover:bg-success/80" : ""}
                >
                  {system.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Last Access */}
        <Card className="border-border lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Último Acceso Registrado</CardTitle>
            <CardDescription>Información del más reciente ingreso</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                  <Users className="h-7 w-7 text-primary" />
                </div>
                <div>
                  <p className="font-semibold">{lastAccess.personnelName}</p>
                  <p className="text-sm text-muted-foreground">{lastAccess.area}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">DNI: {lastAccess.dni}</Badge>
                <Badge variant="outline">Ingreso: {lastAccess.entryTime}</Badge>
                <Badge className="bg-success hover:bg-success/80">
                  {lastAccess.status}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Daily Accesses Chart */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-base">Accesos por Día</CardTitle>
            <CardDescription>Últimos 7 días</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockDailyStats}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis
                    dataKey="date"
                    className="text-xs"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                  />
                  <YAxis
                    className="text-xs"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
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

        {/* Hourly Accesses Chart */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-base">Accesos por Hora</CardTitle>
            <CardDescription>Distribución de hoy</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockHourlyStats}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis
                    dataKey="hour"
                    className="text-xs"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                  />
                  <YAxis
                    className="text-xs"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="accesses"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--primary))", strokeWidth: 2 }}
                    name="Accesos"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
