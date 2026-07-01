"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Search, Filter, ScanFace, Calendar } from "lucide-react"
import { mockAccessRecords, type AccessRecord } from "@/lib/mock-data"

const statusColors: Record<AccessRecord["status"], string> = {
  Autorizado: "bg-success hover:bg-success/80",
  Denegado: "bg-destructive hover:bg-destructive/80",
  "Fuera de horario": "bg-warning text-warning-foreground hover:bg-warning/80",
}

export function AccessRegistryContent() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [dateFilter, setDateFilter] = useState<string>("")

  const filteredRecords = useMemo(() => {
    return mockAccessRecords.filter((record) => {
      const matchesSearch =
        record.personnelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.dni.includes(searchTerm) ||
        record.area.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus =
        statusFilter === "all" || record.status === statusFilter

      const matchesDate = !dateFilter || record.date === dateFilter

      return matchesSearch && matchesStatus && matchesDate
    })
  }, [searchTerm, statusFilter, dateFilter])

  const stats = useMemo(() => {
    const today = "2026-05-20"
    const todayRecords = mockAccessRecords.filter((r) => r.date === today)
    return {
      total: todayRecords.length,
      authorized: todayRecords.filter((r) => r.status === "Autorizado").length,
      denied: todayRecords.filter((r) => r.status === "Denegado").length,
      outOfSchedule: todayRecords.filter((r) => r.status === "Fuera de horario").length,
    }
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Registro de Accesos
        </h1>
        <p className="text-muted-foreground">
          Historial de ingresos y salidas del personal del área de soporte
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Hoy</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <ScanFace className="h-5 w-5 text-primary" />
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
              </div>
              <Badge className="bg-success hover:bg-success/80">{stats.authorized}</Badge>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Denegados</p>
                <p className="text-2xl font-bold text-destructive">{stats.denied}</p>
              </div>
              <Badge variant="destructive">{stats.denied}</Badge>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Fuera de Horario</p>
                <p className="text-2xl font-bold text-warning">{stats.outOfSchedule}</p>
              </div>
              <Badge className="bg-warning text-warning-foreground hover:bg-warning/80">
                {stats.outOfSchedule}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-base">Filtros</CardTitle>
          <CardDescription>Filtra los registros por fecha, estado o nombre</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, DNI o área..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="date"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                  className="w-[180px] pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="Autorizado">Autorizado</SelectItem>
                  <SelectItem value="Denegado">Denegado</SelectItem>
                  <SelectItem value="Fuera de horario">Fuera de horario</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-base">Historial de Accesos</CardTitle>
          <CardDescription>
            {filteredRecords.length} registros encontrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Personal</TableHead>
                  <TableHead>DNI</TableHead>
                  <TableHead>Área</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Ingreso</TableHead>
                  <TableHead>Salida</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Método</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecords.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground">
                      No se encontraron registros
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRecords.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">
                        {record.personnelName}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {record.dni}
                      </TableCell>
                      <TableCell>{record.area}</TableCell>
                      <TableCell>{record.date}</TableCell>
                      <TableCell className="font-mono">{record.entryTime}</TableCell>
                      <TableCell className="font-mono">
                        {record.exitTime || "-"}
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[record.status]}>
                          {record.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="gap-1">
                          <ScanFace className="h-3 w-3" />
                          Facial
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
