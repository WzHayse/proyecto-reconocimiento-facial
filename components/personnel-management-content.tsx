"use client"

import { useEffect, useMemo, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Search, User, ScanFace, Plus, X } from "lucide-react"

type Personal = {
  id_personal: string
  nombres: string
  apellidos: string
  area: string
  rol: string
  carpeta_rostro: string | null
  estado: string
  fecha_registro: string
}

export function PersonnelManagementContent() {
  const [personal, setPersonal] = useState<Personal[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [faceImage, setFaceImage] = useState<File | null>(null)

  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    area: "OGTI - Soporte Técnico",
    rol: "Personal autorizado",
    estado: "Activo",
    carpeta_rostro: "",
  })

  const cargarPersonal = async () => {
    setLoading(true)

    const { data, error } = await supabase
      .from("personal")
      .select("*")
      .order("fecha_registro", { ascending: false })

    if (error) {
      console.error("Error cargando personal:", error)
      setPersonal([])
      setLoading(false)
      return
    }

    setPersonal((data as Personal[]) || [])
    setLoading(false)
  }

  useEffect(() => {
    cargarPersonal()
  }, [])

  const personalFiltrado = useMemo(() => {
    const search = searchTerm.toLowerCase()

    return personal.filter((item) => {
      const nombreCompleto = `${item.nombres} ${item.apellidos}`.toLowerCase()
      const area = item.area?.toLowerCase() || ""
      const rol = item.rol?.toLowerCase() || ""
      const carpeta = item.carpeta_rostro?.toLowerCase() || ""

      return (
        nombreCompleto.includes(search) ||
        area.includes(search) ||
        rol.includes(search) ||
        carpeta.includes(search)
      )
    })
  }, [personal, searchTerm])

  const generarCarpetaRostro = (nombres: string, apellidos: string) => {
    const texto = `${nombres}_${apellidos}`
    return texto.trim().replace(/\s+/g, "_").replace(/[^\w_]/g, "")
  }

  const guardarPersonal = async () => {
    if (!formData.nombres || !formData.apellidos) {
      alert("Ingrese nombres y apellidos")
      return
    }

    if (!faceImage) {
      alert("Seleccione una imagen del rostro")
      return
    }

    setSaving(true)

    const carpeta =
      formData.carpeta_rostro ||
      generarCarpetaRostro(formData.nombres, formData.apellidos)

    try {
      const apiUrl = process.env.NEXT_PUBLIC_IA_API_URL || "http://localhost:8000"

      const faceFormData = new FormData()
      faceFormData.append("folder_name", carpeta)
      faceFormData.append("file", faceImage)

      const response = await fetch(`${apiUrl}/register-person-face`, {
        method: "POST",
        headers: {
          "ngrok-skip-browser-warning": "true",
        },
        body: faceFormData,
      })

      const faceResult = await response.json()

      if (!faceResult.success) {
        alert("No se pudo registrar la imagen del rostro")
        return
      }

      const { error } = await supabase.from("personal").insert({
        nombres: formData.nombres,
        apellidos: formData.apellidos,
        area: formData.area,
        rol: formData.rol,
        estado: formData.estado,
        carpeta_rostro: carpeta,
      })

      if (error) {
        console.error("Error guardando personal:", error)
        alert("No se pudo registrar el personal")
        return
      }

      setModalOpen(false)

      setFormData({
        nombres: "",
        apellidos: "",
        area: "OGTI - Soporte Técnico",
        rol: "Personal autorizado",
        estado: "Activo",
        carpeta_rostro: "",
      })

      setFaceImage(null)
      cargarPersonal()
    } catch (error) {
      console.error("Error registrando personal:", error)
      alert("Ocurrió un error al registrar el personal")
    } finally {
      setSaving(false)
    }
  }

  const totalPersonal = personal.length
  const activos = personal.filter((item) => item.estado === "Activo").length
  const inactivos = personal.filter((item) => item.estado !== "Activo").length
  const rostrosRegistrados = personal.filter((item) => item.carpeta_rostro).length

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Gestión de Personal
          </h1>
          <p className="text-muted-foreground">
            Administra el personal autorizado del sistema
          </p>
        </div>

        <Button className="gap-2" onClick={() => setModalOpen(true)}>
          <Plus className="h-4 w-4" />
          Agregar Personal
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Personal</p>
                <p className="text-2xl font-bold">{loading ? "..." : totalPersonal}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <User className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Activos</p>
                <p className="text-2xl font-bold text-success">
                  {loading ? "..." : activos}
                </p>
              </div>
              <Badge className="bg-success hover:bg-success/80">{activos}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Inactivos</p>
                <p className="text-2xl font-bold text-destructive">
                  {loading ? "..." : inactivos}
                </p>
              </div>
              <Badge variant="destructive">{inactivos}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Rostro Registrado</p>
                <p className="text-2xl font-bold">
                  {loading ? "..." : rostrosRegistrados}
                </p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <ScanFace className="h-5 w-5 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre, área, cargo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-border">
        <CardContent className="pt-6">
          <h2 className="mb-1 text-xl font-semibold">Personal Registrado</h2>
          <p className="mb-4 text-sm text-muted-foreground">
            {personalFiltrado.length} usuarios encontrados
          </p>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre Completo</TableHead>
                  <TableHead>Área</TableHead>
                  <TableHead>Cargo</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Rostro</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {personalFiltrado.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">
                      No hay personal registrado.
                    </TableCell>
                  </TableRow>
                ) : (
                  personalFiltrado.map((persona) => (
                    <TableRow key={persona.id_personal}>
                      <TableCell className="font-medium">
                        {persona.nombres} {persona.apellidos}
                      </TableCell>

                      <TableCell>{persona.area}</TableCell>
                      <TableCell>{persona.rol}</TableCell>

                      <TableCell>
                        <Badge
                          className={
                            persona.estado === "Activo"
                              ? "bg-success hover:bg-success/80"
                              : ""
                          }
                          variant={
                            persona.estado === "Activo" ? "default" : "destructive"
                          }
                        >
                          {persona.estado}
                        </Badge>
                      </TableCell>

                      <TableCell>
                        {persona.carpeta_rostro ? (
                          <Badge className="bg-primary">Registrado</Badge>
                        ) : (
                          <Badge variant="outline">Pendiente</Badge>
                        )}
                      </TableCell>

                      <TableCell>
                        <Button variant="outline" size="sm">
                          Ver detalles
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-xl rounded-xl bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold">Agregar Personal</h2>

              <Button variant="ghost" size="icon" onClick={() => setModalOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="grid gap-4">
              <Input
                placeholder="Nombres"
                value={formData.nombres}
                onChange={(e) => setFormData({ ...formData, nombres: e.target.value })}
              />

              <Input
                placeholder="Apellidos"
                value={formData.apellidos}
                onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
              />

              <Input
                placeholder="Área"
                value={formData.area}
                onChange={(e) => setFormData({ ...formData, area: e.target.value })}
              />

              <Input
                placeholder="Cargo / Rol"
                value={formData.rol}
                onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
              />

              <Input
                placeholder="Estado"
                value={formData.estado}
                onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
              />

              <Input
                placeholder="Carpeta rostro (opcional)"
                value={formData.carpeta_rostro}
                onChange={(e) =>
                  setFormData({ ...formData, carpeta_rostro: e.target.value })
                }
              />

              <div className="space-y-2">
                <label className="text-sm font-medium">Imagen del rostro</label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null
                    setFaceImage(file)
                  }}
                />
                <p className="text-xs text-muted-foreground">
                  Seleccione una imagen clara del rostro.
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setModalOpen(false)}>
                Cancelar
              </Button>

              <Button onClick={guardarPersonal} disabled={saving}>
                {saving ? "Guardando..." : "Registrar Personal"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}