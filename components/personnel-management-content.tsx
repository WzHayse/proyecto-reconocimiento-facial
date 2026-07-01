"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Switch } from "@/components/ui/switch"
import {
  Search,
  Plus,
  User,
  ScanFace,
  Clock,
  Building2,
  Briefcase,
  IdCard,
  Save,
  Camera,
} from "lucide-react"
import { mockPersonnel, type Personnel } from "@/lib/mock-data"

export function PersonnelManagementContent() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPerson, setSelectedPerson] = useState<Personnel | null>(null)
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [editedPerson, setEditedPerson] = useState<Personnel | null>(null)

  const filteredPersonnel = mockPersonnel.filter(
    (person) =>
      person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.code.includes(searchTerm) ||
      person.dni.includes(searchTerm) ||
      person.area.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleSelectPerson = (person: Personnel) => {
    setSelectedPerson(person)
    setEditedPerson({ ...person })
    setIsSheetOpen(true)
  }

  const handleCloseSheet = () => {
    setIsSheetOpen(false)
    setSelectedPerson(null)
    setEditedPerson(null)
  }

  const stats = {
    total: mockPersonnel.length,
    active: mockPersonnel.filter((p) => p.status === "Activo").length,
    inactive: mockPersonnel.filter((p) => p.status === "Inactivo").length,
    registered: mockPersonnel.filter((p) => p.faceRegistered).length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Gestión de Personal
          </h1>
          <p className="text-muted-foreground">
            Administra el personal autorizado del sistema
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Agregar Personal
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Personal</p>
                <p className="text-2xl font-bold">{stats.total}</p>
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
                <p className="text-2xl font-bold text-success">{stats.active}</p>
              </div>
              <Badge className="bg-success hover:bg-success/80">{stats.active}</Badge>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Inactivos</p>
                <p className="text-2xl font-bold text-destructive">{stats.inactive}</p>
              </div>
              <Badge variant="destructive">{stats.inactive}</Badge>
            </div>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Rostro Registrado</p>
                <p className="text-2xl font-bold">{stats.registered}</p>
              </div>
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10">
                <ScanFace className="h-5 w-5 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="border-border">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre, código, DNI o área..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card className="border-border">
        <CardHeader>
          <CardTitle className="text-base">Personal Registrado</CardTitle>
          <CardDescription>
            {filteredPersonnel.length} usuarios encontrados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Foto</TableHead>
                  <TableHead>Nombre Completo</TableHead>
                  <TableHead>Código</TableHead>
                  <TableHead>Cargo</TableHead>
                  <TableHead>Área</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Rostro</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPersonnel.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground">
                      No se encontró personal
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPersonnel.map((person) => (
                    <TableRow
                      key={person.id}
                      className="cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSelectPerson(person)}
                    >
                      <TableCell>
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                          <User className="h-5 w-5 text-primary" />
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{person.name}</TableCell>
                      <TableCell className="font-mono text-sm">{person.code}</TableCell>
                      <TableCell>{person.position}</TableCell>
                      <TableCell>{person.area}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            person.status === "Activo"
                              ? "bg-success hover:bg-success/80"
                              : "bg-destructive hover:bg-destructive/80"
                          }
                        >
                          {person.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={person.faceRegistered ? "default" : "outline"}>
                          {person.faceRegistered ? "Registrado" : "Pendiente"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleSelectPerson(person)
                          }}
                        >
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

      {/* Edit Sheet */}
      <Sheet open={isSheetOpen} onOpenChange={handleCloseSheet}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Detalles del Personal</SheetTitle>
            <SheetDescription>
              Ver y editar información del personal autorizado
            </SheetDescription>
          </SheetHeader>

          {editedPerson && (
            <div className="mt-6 space-y-6">
              {/* Avatar */}
              <div className="flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
                    <User className="h-12 w-12 text-primary" />
                  </div>
                  <Button
                    size="icon"
                    variant="outline"
                    className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                <div className="text-center">
                  <p className="font-semibold">{editedPerson.name}</p>
                  <p className="text-sm text-muted-foreground">{editedPerson.code}</p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    Nombre Completo
                  </Label>
                  <Input
                    value={editedPerson.name}
                    onChange={(e) =>
                      setEditedPerson({ ...editedPerson, name: e.target.value })
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <IdCard className="h-4 w-4 text-muted-foreground" />
                      Código
                    </Label>
                    <Input
                      value={editedPerson.code}
                      onChange={(e) =>
                        setEditedPerson({ ...editedPerson, code: e.target.value })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <IdCard className="h-4 w-4 text-muted-foreground" />
                      DNI
                    </Label>
                    <Input
                      value={editedPerson.dni}
                      onChange={(e) =>
                        setEditedPerson({ ...editedPerson, dni: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    Cargo
                  </Label>
                  <Input
                    value={editedPerson.position}
                    onChange={(e) =>
                      setEditedPerson({ ...editedPerson, position: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    Área
                  </Label>
                  <Select
                    value={editedPerson.area}
                    onValueChange={(value) =>
                      setEditedPerson({ ...editedPerson, area: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="OGTI">OGTI</SelectItem>
                      <SelectItem value="Soporte Técnico">Soporte Técnico</SelectItem>
                      <SelectItem value="Redes">Redes</SelectItem>
                      <SelectItem value="Desarrollo">Desarrollo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    Horario Permitido
                  </Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Entrada</Label>
                      <Input
                        type="time"
                        value={editedPerson.allowedSchedule.start}
                        onChange={(e) =>
                          setEditedPerson({
                            ...editedPerson,
                            allowedSchedule: {
                              ...editedPerson.allowedSchedule,
                              start: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-muted-foreground">Salida</Label>
                      <Input
                        type="time"
                        value={editedPerson.allowedSchedule.end}
                        onChange={(e) =>
                          setEditedPerson({
                            ...editedPerson,
                            allowedSchedule: {
                              ...editedPerson.allowedSchedule,
                              end: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-lg bg-secondary/50 p-4">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Estado del Usuario</p>
                      <p className="text-xs text-muted-foreground">
                        {editedPerson.status === "Activo"
                          ? "El usuario puede acceder al sistema"
                          : "El usuario no puede acceder"}
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={editedPerson.status === "Activo"}
                    onCheckedChange={(checked) =>
                      setEditedPerson({
                        ...editedPerson,
                        status: checked ? "Activo" : "Inactivo",
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between rounded-lg bg-secondary/50 p-4">
                  <div className="flex items-center gap-3">
                    <ScanFace className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Registro Biométrico</p>
                      <p className="text-xs text-muted-foreground">
                        {editedPerson.faceRegistered
                          ? "Rostro registrado en el sistema"
                          : "Pendiente de registro facial"}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={editedPerson.faceRegistered ? "default" : "outline"}
                    className={
                      editedPerson.faceRegistered ? "bg-success hover:bg-success/80" : ""
                    }
                  >
                    {editedPerson.faceRegistered ? "Registrado" : "Pendiente"}
                  </Badge>
                </div>

                {!editedPerson.faceRegistered && (
                  <Button variant="outline" className="w-full gap-2">
                    <ScanFace className="h-4 w-4" />
                    Registrar Rostro
                  </Button>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4">
                <Button className="flex-1 gap-2">
                  <Save className="h-4 w-4" />
                  Guardar Cambios
                </Button>
                <Button variant="outline" onClick={handleCloseSheet}>
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  )
}
