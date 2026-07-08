"use client"

import * as XLSX from "xlsx"
import { saveAs } from "file-saver"
import { Button } from "@/components/ui/button"
import { useEffect, useMemo, useState } from "react"
import { supabase } from "@/lib/supabase"
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

type AccessRecord = {
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

const statusColors: Record<string, string> = {
  Autorizado: "bg-success hover:bg-success/80",
  Denegado: "bg-destructive hover:bg-destructive/80",
  "Fuera de horario": "bg-warning text-warning-foreground hover:bg-warning/80",
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

export function AccessRegistryContent() {
  const [records, setRecords] = useState<AccessRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [dateFilter, setDateFilter] = useState<string>("")

  const today = new Date().toLocaleDateString("en-CA", {
    timeZone: "America/Lima",
  })

  const loadAccessRecords = async () => {
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
          area,
          rol
        )
      `)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error cargando asistencias:", error)
      setRecords([])
      setLoading(false)
      return
    }

    setRecords((data as unknown as AccessRecord[]) || [])
    setLoading(false)
  }

  useEffect(() => {
    loadAccessRecords()
  }, [])

  const filteredRecords = useMemo(() => {
    return records.filter((record) => {
      const fullName = `${record.personal?.nombres || ""} ${record.personal?.apellidos || ""}`.toLowerCase()
      const area = record.personal?.area?.toLowerCase() || ""
      const search = searchTerm.toLowerCase()

      const matchesSearch =
        fullName.includes(search) ||
        area.includes(search) ||
        record.metodo_validacion.toLowerCase().includes(search)

      const matchesStatus =
        statusFilter === "all" || record.estado_acceso === statusFilter

      const matchesDate = !dateFilter || record.fecha === dateFilter
      return matchesSearch && matchesStatus && matchesDate
    })
  }, [records, searchTerm, statusFilter, dateFilter])

  const stats = useMemo(() => {
    const todayRecords = records.filter((record) => record.fecha === today)

    return {
      total: todayRecords.length,
      authorized: todayRecords.filter((record) => record.estado_acceso === "Autorizado").length,
      denied: todayRecords.filter((record) => record.estado_acceso === "Denegado").length,
      outOfSchedule: todayRecords.filter((record) => record.estado_acceso === "Fuera de horario").length,
    }
  }, [records, today])

  const exportarExcel = () => {
    const datos = filteredRecords.map((item) => ({
      Fecha: formatDate(item.fecha),
      Hora: formatTime(item.hora),
      Personal: item.personal
        ? `${item.personal.nombres} ${item.personal.apellidos}`
        : "Personal no encontrado",
      Área: item.personal?.area || "Sin área",
      Estado: item.estado_acceso,
      Método: item.metodo_validacion,
      Observación: item.observacion || "-",
    }))

    const hoja = XLSX.utils.json_to_sheet(datos)
    const libro = XLSX.utils.book_new()

    XLSX.utils.book_append_sheet(libro, hoja, "Asistencias")

    const excelBuffer = XLSX.write(libro, {
      bookType: "xlsx",
      type: "array",
    })

    const archivo = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    })

    saveAs(
      archivo,
      `Reporte_Asistencias_${new Date().toLocaleDateString("en-CA", {
        timeZone: "America/Lima",
      })}.xlsx`
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Registro de Accesos
        </h1>
        <p className="text-muted-foreground">
          Historial de ingresos del personal del área de soporte
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Hoy</p>
                <p className="text-2xl font-bold">{loading ? "..." : stats.total}</p>
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
                <p className="text-2xl font-bold text-success">{loading ? "..." : stats.authorized}</p>
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
                <p className="text-2xl font-bold text-destructive">{loading ? "..." : stats.denied}</p>
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
                <p className="text-2xl font-bold text-warning">{loading ? "..." : stats.outOfSchedule}</p>
              </div>
              <Badge className="bg-warning text-warning-foreground hover:bg-warning/80">
                {stats.outOfSchedule}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
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
                placeholder="Buscar por nombre, área o método..."
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
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="Autorizado">Autorizado</SelectItem>
                  <SelectItem value="Denegado">Denegado</SelectItem>
                  <SelectItem value="Fuera de horario">Fuera de horario</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Historial de Accesos</CardTitle>
            <CardDescription>
              {filteredRecords.length} registros encontrados
            </CardDescription>
          </div>

          <Button onClick={exportarExcel}>
            Exportar Excel
          </Button>
        </CardHeader>

        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Personal</TableHead>
                  <TableHead>Área</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Hora</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Método</TableHead>
                  <TableHead>Observación</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredRecords.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center text-muted-foreground">
                      No se encontraron registros
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRecords.map((record) => (
                    <TableRow key={record.id_asistencia}>
                      <TableCell className="font-medium">
                        {record.personal
                          ? `${record.personal.nombres} ${record.personal.apellidos}`
                          : "Personal no encontrado"}
                      </TableCell>
                      <TableCell>{record.personal?.area || "Sin área"}</TableCell>
                      <TableCell>{formatDate(record.fecha)}</TableCell>
                      <TableCell className="font-mono">{formatTime(record.hora)}</TableCell>
                      <TableCell>
                        <Badge className={statusColors[record.estado_acceso] || "bg-secondary"}>
                          {record.estado_acceso}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="gap-1">
                          <ScanFace className="h-3 w-3" />
                          {record.metodo_validacion || "Facial"}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-[240px] truncate">
                        {record.observacion || "-"}
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