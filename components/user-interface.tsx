"use client"

import { useRef, useState } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScanFace, User, Clock, MapPin, X, Shield } from "lucide-react"

interface UserInterfaceProps {
  onLogout: () => void
}

type ScanResult = {
  status: "authorized" | "denied" | "error"
  name: string
  department: string
  role: string
  time: string
  message: string
}

export function UserInterface({ onLogout }: UserInterfaceProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const [isCameraOpen, setIsCameraOpen] = useState(false)
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState<ScanResult | null>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)

  const stopCamera = () => {
    stream?.getTracks().forEach((track) => track.stop())
    setStream(null)
    setIsCameraOpen(false)
  }

  const handleStartScan = async () => {
    setScanResult(null)
    setIsCameraOpen(true)

    try {
      const cameraStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      })

      setStream(cameraStream)

      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = cameraStream
        }
      }, 100)
    } catch {
      setIsCameraOpen(false)
      setScanResult({
        status: "error",
        name: "No disponible",
        department: "No disponible",
        role: "No disponible",
        time: new Date().toLocaleTimeString("es-PE"),
        message: "No se pudo acceder a la cámara. Verifique los permisos del navegador.",
      })
    }
  }

  const captureAndRecognize = async () => {
    if (!videoRef.current || !canvasRef.current) return

    setIsScanning(true)

    const video = videoRef.current
    const canvas = canvasRef.current

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight

    const context = canvas.getContext("2d")
    if (!context) return

    context.drawImage(video, 0, 0, canvas.width, canvas.height)

    canvas.toBlob(async (blob) => {
      if (!blob) {
        setIsScanning(false)
        return
      }

      const formData = new FormData()
      formData.append("file", blob, "captura.jpg")

      try {
        const apiUrl = process.env.NEXT_PUBLIC_IA_API_URL || "http://localhost:8000"

        const response = await fetch(`${apiUrl}/recognize`, {
          method: "POST",
          headers: {
            "ngrok-skip-browser-warning": "true",
          },
          body: formData,
        })

        const data = await response.json()

        if (
          data.success &&
          (data.status === "authorized" || data.status === "out_of_schedule")
        ) {
          const folder = data.person?.folder || data.person?.name?.replaceAll(" ", "_")

          console.log("CARPETA:", folder)

          const { data: personalData, error: personalError } = await supabase
            .from("personal")
            .select("id_personal,nombres,apellidos,area,rol,estado")
            .eq("carpeta_rostro", folder)
            .maybeSingle()

          if (personalError || !personalData) {
            console.error("Error buscando personal:", personalError)
            setScanResult({
              status: "error",
              name: data.person?.name || "Usuario reconocido",
              department: "Supabase",
              role: "No disponible",
              time: new Date().toLocaleTimeString("es-PE"),
              message: "El rostro fue reconocido, pero no se encontró el registro del personal en Supabase.",
            })
            return
          }

          if (personalData.estado !== "Activo") {
            const { error: asistenciaError } = await supabase.from("asistencias").insert({
              id_personal: personalData.id_personal,
              estado_acceso: "Denegado",
              metodo_validacion: "Reconocimiento facial",
              observacion: `Personal inactivo: ${personalData.nombres} ${personalData.apellidos}`,
            })

            if (asistenciaError) {
              console.error("ERROR AL GUARDAR ACCESO DENEGADO:", asistenciaError)
            }

            setScanResult({
              status: "denied",
              name: `${personalData.nombres} ${personalData.apellidos}`,
              department: personalData.area,
              role: personalData.rol,
              time: new Date().toLocaleTimeString("es-PE"),
              message: "Usuario reconocido, pero se encuentra inactivo. Acceso denegado.",
            })

            return
          }

          const { error: asistenciaError } = await supabase.from("asistencias").insert({
            id_personal: personalData.id_personal,
            estado_acceso:
              data.status === "out_of_schedule" ? "Fuera de horario" : "Autorizado",
            metodo_validacion: "Reconocimiento facial",
            observacion: `Asistencia registrada para ${personalData.nombres} ${personalData.apellidos}`,
          })

          if (asistenciaError) {
            console.error("ERROR AL GUARDAR ASISTENCIA:", asistenciaError)
            setScanResult({
              status: "error",
              name: `${personalData.nombres} ${personalData.apellidos}`,
              department: personalData.area,
              role: personalData.rol,
              time: new Date().toLocaleTimeString("es-PE"),
              message: "El rostro fue reconocido, pero no se pudo registrar la asistencia.",
            })
            return
          }

          console.log("ASISTENCIA GUARDADA")

          setScanResult({
            status: data.status === "out_of_schedule" ? "denied" : "authorized",
            name: `${personalData.nombres} ${personalData.apellidos}`,
            department: personalData.area,
            role: personalData.rol,
            time: new Date().toLocaleTimeString("es-PE"),
            message:
              data.status === "out_of_schedule"
                ? data.message
                : "Asistencia registrada correctamente. Acceso autorizado.",
          })
        } else {
          const { error: denegadoError } = await supabase.from("asistencias").insert({
            id_personal: null,
            estado_acceso: "Denegado",
            metodo_validacion: "Reconocimiento facial",
            observacion: data.message || "Rostro no reconocido o sin permiso de acceso",
          })

          if (denegadoError) {
            console.error("ERROR AL GUARDAR ACCESO DENEGADO:", denegadoError)
          } else {
            console.log("ACCESO DENEGADO GUARDADO")
          }

          setScanResult({
            status: "denied",
            name: "Rostro no reconocido",
            department: "No autorizado",
            role: "Sin acceso",
            time: new Date().toLocaleTimeString("es-PE"),
            message: data.message || "El rostro no fue reconocido o no tiene acceso autorizado.",
          })
        }
      } catch {
        setScanResult({
          status: "error",
          name: "Error de conexión",
          department: "Backend IA",
          role: "No disponible",
          time: new Date().toLocaleTimeString("es-PE"),
          message: "No se pudo conectar con el backend de inteligencia artificial.",
        })
      } finally {
        setIsScanning(false)
        stopCamera()
      }
    }, "image/jpeg", 0.95)
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      <header className="border-b border-border bg-white/80 shadow-sm backdrop-blur-sm">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <ScanFace className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">Sistema de Control de Accesos</h1>
              <p className="text-xs text-muted-foreground">DIRIS Lima Este</p>
            </div>
          </div>

          <Button variant="outline" className="gap-2" onClick={onLogout}>
            <Shield className="h-4 w-4" />
            Administrador
          </Button>
        </div>
      </header>

      <div className="flex flex-1 items-center justify-center p-6">
        <div className="w-full max-w-2xl space-y-6">
          <Card className="border-border shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center gap-2">
                <ScanFace className="h-6 w-6 text-primary" />
                Verificación Biométrica
              </CardTitle>
              <CardDescription>
                Iniciar reconocimiento facial para registrar asistencia
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-b from-slate-900 to-slate-800">
                <div className="aspect-video flex items-center justify-center">
                  <div className="relative h-80 w-64 overflow-hidden rounded-2xl border-4 border-primary/30">
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-800 to-slate-900" />
                    <div className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-2xl border-2 border-primary/50" />
                    <div className="absolute bottom-4 left-0 right-0 text-center">
                      <p className="text-xs text-primary/70">
                        Presione iniciar para abrir la cámara
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Button onClick={handleStartScan} className="w-full gap-2 py-6 text-base">
                <ScanFace className="h-5 w-5" />
                Iniciar Reconocimiento
              </Button>
            </CardContent>
          </Card>

          {scanResult && (
            <Card
              className={`border-2 shadow-lg ${scanResult.status === "authorized"
                ? "border-green-200 bg-green-50"
                : scanResult.status === "denied"
                  ? "border-red-200 bg-red-50"
                  : "border-yellow-200 bg-yellow-50"
                }`}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">Resultado de Verificación</CardTitle>
                  <Badge variant="outline">
                    {scanResult.status === "authorized"
                      ? "✓ Autorizado"
                      : scanResult.status === "denied"
                        ? "✕ Denegado"
                        : "⚠ Error"}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Nombre</p>
                    <p className="flex items-center gap-2 font-semibold">
                      <User className="h-4 w-4 text-primary" />
                      {scanResult.name}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Rol</p>
                    <p className="font-semibold">{scanResult.role}</p>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Área</p>
                    <p className="flex items-center gap-2 font-semibold">
                      <MapPin className="h-4 w-4 text-primary" />
                      {scanResult.department}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Hora</p>
                    <p className="flex items-center gap-2 font-semibold">
                      <Clock className="h-4 w-4 text-primary" />
                      {scanResult.time}
                    </p>
                  </div>
                </div>

                <div className="rounded-lg bg-background/50 p-3 text-sm">
                  <p>{scanResult.message}</p>
                </div>

                <Button onClick={() => setScanResult(null)} variant="outline" className="w-full">
                  Nuevo Escaneo
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {isCameraOpen && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black">
          <div className="absolute right-4 top-4 z-10">
            <Button variant="outline" size="icon" onClick={stopCamera}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <video ref={videoRef} autoPlay playsInline muted className="h-full w-full object-cover" />

          <div className="absolute inset-x-0 bottom-0 bg-black/70 p-6">
            <Button
              onClick={captureAndRecognize}
              disabled={isScanning}
              className="w-full py-6 text-base"
            >
              {isScanning ? "Analizando rostro..." : "Capturar y registrar asistencia"}
            </Button>
          </div>

          <canvas ref={canvasRef} className="hidden" />
        </div>
      )}

      <footer className="border-t border-border bg-white/80 px-6 py-4 text-center text-xs text-muted-foreground">
        <p>DIRIS Lima Este - Dirección de Redes Integradas de Salud Lima Este</p>
      </footer>
    </div>
  )
}