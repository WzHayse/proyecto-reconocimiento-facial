// Types for the facial recognition system
export interface Personnel {
  id: string
  code: string
  name: string
  dni: string
  position: string
  area: string
  photo: string
  status: 'Activo' | 'Inactivo'
  faceRegistered: boolean
  allowedSchedule: {
    start: string
    end: string
  }
}

export interface AccessRecord {
  id: string
  personnelId: string
  personnelName: string
  dni: string
  area: string
  date: string
  entryTime: string
  exitTime: string | null
  status: 'Autorizado' | 'Denegado' | 'Fuera de horario'
  verificationMethod: 'Reconocimiento facial'
}

export interface DailyStats {
  date: string
  accesses: number
}

export interface HourlyStats {
  hour: string
  accesses: number
}

// Mock personnel data
export const mockPersonnel: Personnel[] = [
  {
    id: '1',
    code: 'EMP-001',
    name: 'Carlos Rodríguez Mendoza',
    dni: '45678912',
    position: 'Técnico de Soporte',
    area: 'Soporte Técnico',
    photo: '/placeholder-avatar.jpg',
    status: 'Activo',
    faceRegistered: true,
    allowedSchedule: { start: '08:00', end: '18:00' }
  },
  {
    id: '2',
    code: 'EMP-002',
    name: 'María García López',
    dni: '78912345',
    position: 'Analista de Sistemas',
    area: 'OGTI',
    photo: '/placeholder-avatar.jpg',
    status: 'Activo',
    faceRegistered: true,
    allowedSchedule: { start: '08:00', end: '17:00' }
  },
  {
    id: '3',
    code: 'EMP-003',
    name: 'Juan Pérez Sánchez',
    dni: '12345678',
    position: 'Administrador de Redes',
    area: 'OGTI',
    photo: '/placeholder-avatar.jpg',
    status: 'Activo',
    faceRegistered: true,
    allowedSchedule: { start: '07:00', end: '16:00' }
  },
  {
    id: '4',
    code: 'EMP-004',
    name: 'Ana Torres Ramos',
    dni: '34567891',
    position: 'Especialista en Seguridad',
    area: 'Soporte Técnico',
    photo: '/placeholder-avatar.jpg',
    status: 'Activo',
    faceRegistered: true,
    allowedSchedule: { start: '08:00', end: '18:00' }
  },
  {
    id: '5',
    code: 'EMP-005',
    name: 'Pedro Castillo Vera',
    dni: '56789123',
    position: 'Técnico de Redes',
    area: 'OGTI',
    photo: '/placeholder-avatar.jpg',
    status: 'Inactivo',
    faceRegistered: false,
    allowedSchedule: { start: '08:00', end: '17:00' }
  },
  {
    id: '6',
    code: 'EMP-006',
    name: 'Lucía Fernández Díaz',
    dni: '67891234',
    position: 'Jefa de Soporte',
    area: 'Soporte Técnico',
    photo: '/placeholder-avatar.jpg',
    status: 'Activo',
    faceRegistered: true,
    allowedSchedule: { start: '07:30', end: '17:30' }
  },
  {
    id: '7',
    code: 'EMP-007',
    name: 'Roberto Salazar Cruz',
    dni: '89123456',
    position: 'Desarrollador',
    area: 'OGTI',
    photo: '/placeholder-avatar.jpg',
    status: 'Activo',
    faceRegistered: true,
    allowedSchedule: { start: '09:00', end: '18:00' }
  },
  {
    id: '8',
    code: 'EMP-008',
    name: 'Carmen Vargas Morales',
    dni: '91234567',
    position: 'Analista de Datos',
    area: 'OGTI',
    photo: '/placeholder-avatar.jpg',
    status: 'Activo',
    faceRegistered: true,
    allowedSchedule: { start: '08:00', end: '17:00' }
  }
]

// Mock access records
export const mockAccessRecords: AccessRecord[] = [
  {
    id: '1',
    personnelId: '1',
    personnelName: 'Carlos Rodríguez Mendoza',
    dni: '45678912',
    area: 'Soporte Técnico',
    date: '2026-05-20',
    entryTime: '08:15',
    exitTime: '17:45',
    status: 'Autorizado',
    verificationMethod: 'Reconocimiento facial'
  },
  {
    id: '2',
    personnelId: '2',
    personnelName: 'María García López',
    dni: '78912345',
    area: 'OGTI',
    date: '2026-05-20',
    entryTime: '08:02',
    exitTime: null,
    status: 'Autorizado',
    verificationMethod: 'Reconocimiento facial'
  },
  {
    id: '3',
    personnelId: '3',
    personnelName: 'Juan Pérez Sánchez',
    dni: '12345678',
    area: 'OGTI',
    date: '2026-05-20',
    entryTime: '07:05',
    exitTime: '16:10',
    status: 'Autorizado',
    verificationMethod: 'Reconocimiento facial'
  },
  {
    id: '4',
    personnelId: '5',
    personnelName: 'Pedro Castillo Vera',
    dni: '56789123',
    area: 'OGTI',
    date: '2026-05-20',
    entryTime: '08:30',
    exitTime: null,
    status: 'Denegado',
    verificationMethod: 'Reconocimiento facial'
  },
  {
    id: '5',
    personnelId: '4',
    personnelName: 'Ana Torres Ramos',
    dni: '34567891',
    area: 'Soporte Técnico',
    date: '2026-05-20',
    entryTime: '08:05',
    exitTime: null,
    status: 'Autorizado',
    verificationMethod: 'Reconocimiento facial'
  },
  {
    id: '6',
    personnelId: '6',
    personnelName: 'Lucía Fernández Díaz',
    dni: '67891234',
    area: 'Soporte Técnico',
    date: '2026-05-20',
    entryTime: '07:28',
    exitTime: null,
    status: 'Autorizado',
    verificationMethod: 'Reconocimiento facial'
  },
  {
    id: '7',
    personnelId: '7',
    personnelName: 'Roberto Salazar Cruz',
    dni: '89123456',
    area: 'OGTI',
    date: '2026-05-20',
    entryTime: '09:10',
    exitTime: null,
    status: 'Autorizado',
    verificationMethod: 'Reconocimiento facial'
  },
  {
    id: '8',
    personnelId: '8',
    personnelName: 'Carmen Vargas Morales',
    dni: '91234567',
    area: 'OGTI',
    date: '2026-05-20',
    entryTime: '06:45',
    exitTime: null,
    status: 'Fuera de horario',
    verificationMethod: 'Reconocimiento facial'
  },
  {
    id: '9',
    personnelId: '1',
    personnelName: 'Carlos Rodríguez Mendoza',
    dni: '45678912',
    area: 'Soporte Técnico',
    date: '2026-05-19',
    entryTime: '08:10',
    exitTime: '17:50',
    status: 'Autorizado',
    verificationMethod: 'Reconocimiento facial'
  },
  {
    id: '10',
    personnelId: '2',
    personnelName: 'María García López',
    dni: '78912345',
    area: 'OGTI',
    date: '2026-05-19',
    entryTime: '07:55',
    exitTime: '17:05',
    status: 'Autorizado',
    verificationMethod: 'Reconocimiento facial'
  }
]

// Daily access statistics
export const mockDailyStats: DailyStats[] = [
  { date: 'Lun', accesses: 45 },
  { date: 'Mar', accesses: 52 },
  { date: 'Mié', accesses: 48 },
  { date: 'Jue', accesses: 51 },
  { date: 'Vie', accesses: 42 },
  { date: 'Sáb', accesses: 12 },
  { date: 'Dom', accesses: 5 }
]

// Hourly access statistics
export const mockHourlyStats: HourlyStats[] = [
  { hour: '06:00', accesses: 3 },
  { hour: '07:00', accesses: 12 },
  { hour: '08:00', accesses: 35 },
  { hour: '09:00', accesses: 18 },
  { hour: '10:00', accesses: 8 },
  { hour: '11:00', accesses: 5 },
  { hour: '12:00', accesses: 15 },
  { hour: '13:00', accesses: 12 },
  { hour: '14:00', accesses: 6 },
  { hour: '15:00', accesses: 4 },
  { hour: '16:00', accesses: 10 },
  { hour: '17:00', accesses: 25 },
  { hour: '18:00', accesses: 8 }
]
