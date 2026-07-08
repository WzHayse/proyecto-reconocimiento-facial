"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, Calendar, User } from "lucide-react"

type Asistencia = {
    id_asistencia: string
    fecha: string
    hora: string
    estado_acceso: string
    metodo_validacion: string
    observacion: string | null
}

type Personal = {
    nombres: string
    apellidos: string
    area: string
    rol: string
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

export default function MisAsistenciasPage() {
    const [personal, setPersonal] = useState<Personal | null>(null)
    const [asistencias, setAsistencias] = useState<Asistencia[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const cargarDatos = async () => {
            setLoading(true)

            const { data: sessionData } = await supabase.auth.getSession()
            const user = sessionData.session?.user

            if (!user) {
                window.location.href = "/"
                return
            }

            const { data: perfil, error: perfilError } = await supabase
                .from("perfiles")
                .select("id_personal")
                .eq("id_perfil", user.id)
                .maybeSingle()

            if (perfilError || !perfil?.id_personal) {
                console.error("No se encontró perfil:", perfilError)
                setLoading(false)
                return
            }

            const { data: personalData } = await supabase
                .from("personal")
                .select("nombres, apellidos, area, rol")
                .eq("id_personal", perfil.id_personal)
                .maybeSingle()

            const { data: asistenciasData } = await supabase
                .from("asistencias")
                .select("id_asistencia, fecha, hora, estado_acceso, metodo_validacion, observacion")
                .eq("id_personal", perfil.id_personal)
                .order("created_at", { ascending: false })

            setPersonal(personalData as Personal)
            setAsistencias((asistenciasData as Asistencia[]) || [])
            setLoading(false)
        }

        cargarDatos()
    }, [])

    const cerrarSesion = async () => {
        await supabase.auth.signOut()
        window.location.href = "/"
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 p-6">
            <div className="mx-auto max-w-5xl space-y-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Mis Asistencias</h1>
                        <p className="text-muted-foreground">
                            Consulta personal del historial de asistencias
                        </p>
                    </div>

                    <button
                        onClick={cerrarSesion}
                        className="rounded-lg bg-slate-900 px-4 py-2 text-sm text-white hover:bg-slate-700"
                    >
                        Cerrar sesión
                    </button>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5" />
                            Información del Usuario
                        </CardTitle>
                        <CardDescription>Datos asociados a la cuenta actual</CardDescription>
                    </CardHeader>

                    <CardContent>
                        {loading ? (
                            <p>Cargando...</p>
                        ) : personal ? (
                            <div className="grid gap-4 sm:grid-cols-3">
                                <div>
                                    <p className="text-xs text-muted-foreground">Nombre</p>
                                    <p className="font-semibold">
                                        {personal.nombres} {personal.apellidos}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs text-muted-foreground">Área</p>
                                    <p className="font-semibold">{personal.area}</p>
                                </div>

                                <div>
                                    <p className="text-xs text-muted-foreground">Cargo</p>
                                    <p className="font-semibold">{personal.rol}</p>
                                </div>
                            </div>
                        ) : (
                            <p className="text-sm text-red-600">
                                No se encontró información del personal asociado.
                            </p>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Historial de Asistencias</CardTitle>
                        <CardDescription>
                            {asistencias.length} registros encontrados
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b text-left text-muted-foreground">
                                        <th className="py-2">Fecha</th>
                                        <th className="py-2">Hora</th>
                                        <th className="py-2">Estado</th>
                                        <th className="py-2">Método</th>
                                        <th className="py-2">Observación</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {asistencias.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="py-4 text-center text-muted-foreground">
                                                No hay asistencias registradas.
                                            </td>
                                        </tr>
                                    ) : (
                                        asistencias.map((item) => (
                                            <tr key={item.id_asistencia} className="border-b">
                                                <td className="py-2">
                                                    <Calendar className="mr-1 inline h-3 w-3" />
                                                    {formatDate(item.fecha)}
                                                </td>
                                                <td className="py-2">
                                                    <Clock className="mr-1 inline h-3 w-3" />
                                                    {formatTime(item.hora)}
                                                </td>
                                                <td className="py-2">
                                                    <Badge
                                                        className={
                                                            item.estado_acceso === "Autorizado"
                                                                ? "bg-green-600 hover:bg-green-700"
                                                                : "bg-red-600 hover:bg-red-700"
                                                        }
                                                    >
                                                        {item.estado_acceso}
                                                    </Badge>
                                                </td>
                                                <td className="py-2">{item.metodo_validacion}</td>
                                                <td className="py-2">{item.observacion || "-"}</td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}