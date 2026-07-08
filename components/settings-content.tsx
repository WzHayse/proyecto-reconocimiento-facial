"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Camera,
  Clock,
  Save,
  Shield,
  Wifi,
} from "lucide-react"

export function SettingsContent() {
  const [scheduleSettings, setScheduleSettings] = useState({
    accessPointName: "Entrada Principal",
    defaultStart: "08:00",
    defaultEnd: "18:00",
    allowWeekends: false,
    holidayMode: false,
  })

  const [horarioId, setHorarioId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const cargarConfiguracion = async () => {
    setLoading(true)

    const { data, error } = await supabase
      .from("horarios")
      .select("*")
      .limit(1)
      .maybeSingle()

    if (error) {
      console.error("Error cargando configuración:", error)
      setLoading(false)
      return
    }

    if (data) {
      setHorarioId(data.id_horario)
      setScheduleSettings({
        accessPointName: data.nombre_punto_acceso || "Entrada Principal",
        defaultStart: String(data.hora_entrada || "08:00").slice(0, 5),
        defaultEnd: String(data.hora_salida || "18:00").slice(0, 5),
        allowWeekends: Boolean(data.permitir_fines_semana),
        holidayMode: Boolean(data.modo_feriado),
      })
    }

    setLoading(false)
  }

  const guardarConfiguracion = async () => {
    setSaving(true)

    const payload = {
      nombre_punto_acceso: scheduleSettings.accessPointName,
      hora_entrada: scheduleSettings.defaultStart,
      hora_salida: scheduleSettings.defaultEnd,
      permitir_fines_semana: scheduleSettings.allowWeekends,
      modo_feriado: scheduleSettings.holidayMode,
      updated_at: new Date().toISOString(),
    }

    const { error } = horarioId
      ? await supabase.from("horarios").update(payload).eq("id_horario", horarioId)
      : await supabase.from("horarios").insert(payload)

    setSaving(false)

    if (error) {
      console.error("Error guardando configuración:", error)
      alert("No se pudo guardar la configuración")
      return
    }

    alert("Configuración guardada correctamente")
    cargarConfiguracion()
  }

  useEffect(() => {
    cargarConfiguracion()
  }, [])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Configuración
        </h1>
        <p className="text-muted-foreground">
          Ajustes del sistema de control de accesos
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Camera Connection Status */}
        <Card className="border-border">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Camera className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">Cámara de Seguridad</CardTitle>
            </div>
            <CardDescription>
              Estado de conexión del punto de acceso
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between rounded-lg bg-secondary/50 p-3">
              <div className="flex items-center gap-2">
                <Wifi className="h-4 w-4 text-success" />
                <span className="text-sm">Estado de Conexión</span>
              </div>
              <Badge className="bg-success hover:bg-success/80">Conectada</Badge>
            </div>

            <div className="space-y-2">
              <Label>Nombre del Punto de Acceso</Label>
              <Input
                type="text"
                value={scheduleSettings.accessPointName}
                onChange={(e) =>
                  setScheduleSettings({
                    ...scheduleSettings,
                    accessPointName: e.target.value,
                  })
                }
                placeholder="Nombre del punto de acceso"
              />
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card className="border-border">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">Estado del Sistema</CardTitle>
            </div>
            <CardDescription>
              Información general del sistema
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between rounded-lg bg-secondary/50 p-3">
              <span className="text-sm">Versión del Sistema</span>
              <Badge variant="outline">v2.1.0</Badge>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-secondary/50 p-3">
              <span className="text-sm">Última Actualización</span>
              <Badge variant="outline">2024-05-25</Badge>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-secondary/50 p-3">
              <span className="text-sm">Estado General</span>
              <Badge className="bg-success hover:bg-success/80">Óptimo</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Schedule Settings */}
        <Card className="border-border lg:col-span-2">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <CardTitle className="text-base">Horarios Permitidos</CardTitle>
            </div>
            <CardDescription>
              Configuración de horarios por defecto
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="space-y-2">
                <Label>Hora de Entrada</Label>
                <Input
                  type="time"
                  value={scheduleSettings.defaultStart}
                  onChange={(e) =>
                    setScheduleSettings({
                      ...scheduleSettings,
                      defaultStart: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Hora de Salida</Label>
                <Input
                  type="time"
                  value={scheduleSettings.defaultEnd}
                  onChange={(e) =>
                    setScheduleSettings({
                      ...scheduleSettings,
                      defaultEnd: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <div className="flex items-center justify-between">
                  <Label>Permitir Fines de Semana</Label>
                  <Switch
                    checked={scheduleSettings.allowWeekends}
                    onCheckedChange={(checked) =>
                      setScheduleSettings({
                        ...scheduleSettings,
                        allowWeekends: checked,
                      })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-lg bg-secondary/50 p-3">
              <div>
                <p className="text-sm font-medium">Modo Feriado</p>
                <p className="text-xs text-muted-foreground">
                  Bloquea todos los accesos en feriados
                </p>
              </div>
              <Switch
                checked={scheduleSettings.holidayMode}
                onCheckedChange={(checked) =>
                  setScheduleSettings({
                    ...scheduleSettings,
                    holidayMode: checked,
                  })
                }
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button className="gap-2" onClick={guardarConfiguracion} disabled={saving || loading}>
          <Save className="h-4 w-4" />
          {saving ? "Guardando..." : "Guardar Configuración"}
        </Button>
      </div>
    </div>
  )
}
