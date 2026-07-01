"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import {
  ScanFace,
  Camera,
  CheckCircle2,
  XCircle,
  Loader2,
  User,
  Building2,
  Briefcase,
  Clock,
  Shield,
} from "lucide-react"
import { mockPersonnel } from "@/lib/mock-data"

type VerificationStep =
  | "idle"
  | "detecting"
  | "comparing"
  | "verified"
  | "authorized"
  | "denied"

const verificationSteps = {
  idle: { label: "Esperando", progress: 0 },
  detecting: { label: "Detectando rostro...", progress: 20 },
  comparing: { label: "Comparando con base de datos...", progress: 50 },
  verified: { label: "Identidad verificada", progress: 80 },
  authorized: { label: "Acceso autorizado", progress: 100 },
  denied: { label: "Acceso denegado", progress: 100 },
}

export function FacialRecognitionContent() {
  const [isRecognizing, setIsRecognizing] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [verificationStep, setVerificationStep] = useState<VerificationStep>("idle")
  const [recognizedPerson, setRecognizedPerson] = useState<typeof mockPersonnel[0] | null>(null)
  const [accessTime, setAccessTime] = useState<string>("")

  const simulateRecognition = () => {
    setIsRecognizing(true)
    setShowModal(true)
    setVerificationStep("detecting")

    const randomPerson = mockPersonnel[Math.floor(Math.random() * mockPersonnel.length)]
    const currentTime = new Date().toLocaleTimeString("es-PE", {
      hour: "2-digit",
      minute: "2-digit",
    })

    setTimeout(() => {
      setVerificationStep("comparing")
    }, 1500)

    setTimeout(() => {
      setVerificationStep("verified")
      setRecognizedPerson(randomPerson)
      setAccessTime(currentTime)
    }, 3000)

    setTimeout(() => {
      if (randomPerson.status === "Activo" && randomPerson.faceRegistered) {
        setVerificationStep("authorized")
      } else {
        setVerificationStep("denied")
      }
      setIsRecognizing(false)
    }, 4500)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setVerificationStep("idle")
    setRecognizedPerson(null)
    setAccessTime("")
  }

  const isSuccess = verificationStep === "authorized"
  const isDenied = verificationStep === "denied"
  const isProcessing = ["detecting", "comparing", "verified"].includes(verificationStep)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Reconocimiento Facial
        </h1>
        <p className="text-muted-foreground">
          Sistema de verificación biométrica para control de accesos
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Camera View */}
        <Card className="border-border lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-base">Cámara de Seguridad</CardTitle>
                <CardDescription>Vista en vivo del punto de acceso</CardDescription>
              </div>
              <Badge className="bg-success hover:bg-success/80">
                <span className="mr-1.5 h-2 w-2 rounded-full bg-white animate-pulse" />
                En vivo
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {/* Simulated Camera View */}
            <div className="relative aspect-video overflow-hidden rounded-lg bg-foreground/5">
              {/* Camera background pattern */}
              <div className="absolute inset-0 bg-gradient-to-br from-muted/50 to-muted" />
              
              {/* Grid overlay */}
              <div className="absolute inset-0 opacity-20">
                <div
                  className="h-full w-full"
                  style={{
                    backgroundImage:
                      "linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)",
                    backgroundSize: "40px 40px",
                  }}
                />
              </div>

              {/* Face detection frame */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className={`relative h-48 w-40 rounded-xl border-2 transition-colors duration-300 ${
                    isRecognizing
                      ? "border-primary animate-pulse"
                      : "border-muted-foreground/30"
                  }`}
                >
                  {/* Corner markers */}
                  <div className="absolute -left-1 -top-1 h-4 w-4 border-l-2 border-t-2 border-primary" />
                  <div className="absolute -right-1 -top-1 h-4 w-4 border-r-2 border-t-2 border-primary" />
                  <div className="absolute -bottom-1 -left-1 h-4 w-4 border-b-2 border-l-2 border-primary" />
                  <div className="absolute -bottom-1 -right-1 h-4 w-4 border-b-2 border-r-2 border-primary" />

                  {/* Face icon placeholder */}
                  <div className="flex h-full items-center justify-center">
                    <ScanFace
                      className={`h-20 w-20 ${
                        isRecognizing
                          ? "text-primary animate-pulse"
                          : "text-muted-foreground/30"
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Camera info overlay */}
              <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-lg bg-foreground/80 px-3 py-1.5 text-xs text-background">
                <Camera className="h-3.5 w-3.5" />
                <span>CAM-01 | Entrada Principal | DIRIS Lima Este</span>
              </div>

              {/* Timestamp */}
              <div className="absolute right-4 top-4 rounded-lg bg-foreground/80 px-3 py-1.5 text-xs text-background">
                {new Date().toLocaleString("es-PE")}
              </div>
            </div>

            {/* Action Button */}
            <div className="mt-6 flex justify-center">
              <Button
                size="lg"
                className="gap-2 bg-primary px-8 hover:bg-primary/90"
                onClick={simulateRecognition}
                disabled={isRecognizing}
              >
                {isRecognizing ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Procesando...
                  </>
                ) : (
                  <>
                    <ScanFace className="h-5 w-5" />
                    Iniciar Reconocimiento
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Status Panel */}
        <div className="space-y-4">
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-base">Estado del Sistema</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between rounded-lg bg-secondary/50 p-3">
                <div className="flex items-center gap-2">
                  <Camera className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Cámara</span>
                </div>
                <Badge className="bg-success hover:bg-success/80">Activa</Badge>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-secondary/50 p-3">
                <div className="flex items-center gap-2">
                  <ScanFace className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Reconocimiento</span>
                </div>
                <Badge className="bg-success hover:bg-success/80">Operativo</Badge>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-secondary/50 p-3">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Seguridad</span>
                </div>
                <Badge className="bg-success hover:bg-success/80">Alta</Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border">
            <CardHeader>
              <CardTitle className="text-base">Instrucciones</CardTitle>
            </CardHeader>
            <CardContent>
              <ol className="space-y-2 text-sm text-muted-foreground">
                <li className="flex gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                    1
                  </span>
                  <span>Posicione su rostro dentro del recuadro</span>
                </li>
                <li className="flex gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                    2
                  </span>
                  <span>Presione el botón de reconocimiento</span>
                </li>
                <li className="flex gap-2">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                    3
                  </span>
                  <span>Espere la verificación del sistema</span>
                </li>
              </ol>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Verification Modal */}
      <Dialog open={showModal} onOpenChange={handleCloseModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Verificación Facial</DialogTitle>
            <DialogDescription>
              Procesando identidad del personal
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {verificationSteps[verificationStep].label}
                </span>
                <span className="font-medium">
                  {verificationSteps[verificationStep].progress}%
                </span>
              </div>
              <Progress
                value={verificationSteps[verificationStep].progress}
                className={`h-2 ${
                  isSuccess
                    ? "[&>div]:bg-success"
                    : isDenied
                    ? "[&>div]:bg-destructive"
                    : ""
                }`}
              />
            </div>

            {/* Status Icon */}
            <div className="flex justify-center">
              {isProcessing && (
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                  <Loader2 className="h-10 w-10 animate-spin text-primary" />
                </div>
              )}
              {isSuccess && (
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success/10">
                  <CheckCircle2 className="h-10 w-10 text-success" />
                </div>
              )}
              {isDenied && (
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
                  <XCircle className="h-10 w-10 text-destructive" />
                </div>
              )}
            </div>

            {/* Person Info (shown when verified or final status) */}
            {recognizedPerson && (verificationStep === "verified" || isSuccess || isDenied) && (
              <div className="space-y-3 rounded-lg bg-secondary/50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <User className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">{recognizedPerson.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {recognizedPerson.code}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <span>{recognizedPerson.area}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <span>{recognizedPerson.position}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{accessTime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <Badge
                      variant={isSuccess ? "default" : "destructive"}
                      className={isSuccess ? "bg-success hover:bg-success/80" : ""}
                    >
                      {isSuccess ? "Autorizado" : "Denegado"}
                    </Badge>
                  </div>
                </div>
              </div>
            )}

            {/* Close Button */}
            {(isSuccess || isDenied) && (
              <Button onClick={handleCloseModal} className="w-full">
                Cerrar
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
