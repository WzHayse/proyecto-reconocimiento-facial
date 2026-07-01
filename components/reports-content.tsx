"use client"

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  UserCheck,
  UserX,
  Clock,
  Users,
  Calendar,
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
import { mockAccessRecords, mockPersonnel, mockDailyStats } from "@/lib/mock-data"

const accessByStatus = [
  { name: "Autorizados", value: 185, color: "hsl(var(--success))" },
  { name: "Denegados", value: 12, color: "hsl(var(--destructive))" },
  { name: "Fuera de horario", value: 8, color: "hsl(var(--warning))" },
]

const topAccessPersonnel = [
  { name: "Carlos Rodríguez M.", area: "Soporte Técnico", accesses: 22 },
  { name: "María García L.", area: "OGTI", accesses: 20 },
  { name: "Juan Pérez S.", area: "OGTI", accesses: 19 },
  { name: "Ana Torres R.", area: "Soporte Técnico", accesses: 18 },
  { name: "Lucía Fernández D.", area: "Soporte Técnico", accesses: 17 },
]

const busiestDays = [
  { day: "Lunes", accesses: 45, trend: "up" },
  { day: "Martes", accesses: 52, trend: "up" },
  { day: "Miércoles", accesses: 48, trend: "down" },
  { day: "Jueves", accesses: 51, trend: "up" },
  { day: "Viernes", accesses: 42, trend: "down" },
]

export function ReportsContent() {
  const stats = {
    totalWeek: 205,
    authorized: 185,
    denied: 12,
    outOfSchedule: 8,
    changePercent: 12,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Reportes
          </h1>
          <p className="text-muted-foreground">
            Estadísticas y análisis del sistema de control de accesos
          </p>
        </div>
        <Select defaultValue="week">
          <SelectTrigger className="w-[150px]">
            <Calendar className="mr-2 h-4 w-4" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="today">Hoy</SelectItem>
            <SelectItem value="week">Esta semana</SelectItem>
            <SelectItem value="month">Este mes</SelectItem>
            <SelectItem value="year">Este año</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Semanal</p>
                <p className="text-2xl font-bold">{stats.totalWeek}</p>
                <p className="flex items-center gap-1 text-xs text-success">
                  <TrendingUp className="h-3 w-3" />+{stats.changePercent}% vs. semana anterior
                </p>
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
                <p className="text-2xl font-bold text-success">{stats.authorized}</p>
                <p className="text-xs text-muted-foreground">
                  {((stats.authorized / stats.totalWeek) * 100).toFixed(1)}% del total
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
                <p className="text-2xl font-bold text-destructive">{stats.denied}</p>
                <p className="text-xs text-muted-foreground">
                  {((stats.denied / stats.totalWeek) * 100).toFixed(1)}% del total
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
                <p className="text-2xl font-bold text-warning">{stats.outOfSchedule}</p>
                <p className="text-xs text-muted-foreground">
                  {((stats.outOfSchedule / stats.totalWeek) * 100).toFixed(1)}% del total
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
                <Clock className="h-5 w-5 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Accesses by Day */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-base">Accesos por Día</CardTitle>
            <CardDescription>Distribución semanal de accesos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockDailyStats}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis
                    dataKey="date"
                    tick={{ fill: "hsl(var(--muted-foreground))" }}
                  />
                  <YAxis tick={{ fill: "hsl(var(--muted-foreground))" }} />
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

        {/* Accesses by Status */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-base">Accesos por Estado</CardTitle>
            <CardDescription>Distribución de resultados de verificación</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={accessByStatus}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {accessByStatus.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex justify-center gap-4">
              {accessByStatus.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="text-sm text-muted-foreground">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tables Row */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Top Personnel */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-base">Personal con Mayor Accesos</CardTitle>
            <CardDescription>Top 5 de esta semana</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>Personal</TableHead>
                  <TableHead>Área</TableHead>
                  <TableHead className="text-right">Accesos</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topAccessPersonnel.map((person, index) => (
                  <TableRow key={person.name}>
                    <TableCell className="font-medium">{index + 1}</TableCell>
                    <TableCell>{person.name}</TableCell>
                    <TableCell>{person.area}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline">{person.accesses}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Busiest Days */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-base">Días con Mayor Flujo</CardTitle>
            <CardDescription>Análisis de tendencias semanales</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Día</TableHead>
                  <TableHead className="text-right">Accesos</TableHead>
                  <TableHead className="text-right">Tendencia</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {busiestDays.map((day) => (
                  <TableRow key={day.day}>
                    <TableCell className="font-medium">{day.day}</TableCell>
                    <TableCell className="text-right">{day.accesses}</TableCell>
                    <TableCell className="text-right">
                      {day.trend === "up" ? (
                        <Badge className="bg-success hover:bg-success/80">
                          <TrendingUp className="mr-1 h-3 w-3" />
                          Subiendo
                        </Badge>
                      ) : (
                        <Badge variant="secondary">
                          <TrendingDown className="mr-1 h-3 w-3" />
                          Bajando
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
