import React from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { medicationService, notificationsService, type Medication, type CreateMedicationRequest, type UpdateMedicationRequest, type TodayMedication, type MedicationCalendarResponse, type ApiError } from '@/lib/api'
import createContextHook from '@nkzw/create-context-hook'
import { useAuth } from './AuthContext'

// Toggle for local mock data; should remain false in production
const MOCK_MODE = false

const formatTimeDisplay = (time: string) => {
  if (!time.includes(':')) return time
  const [hourStr, minuteStr] = time.split(':')
  const hour = parseInt(hourStr, 10)
  const period = hour >= 12 ? 'PM' : 'AM'
  const hour12 = hour % 12 || 12
  return `${hour12}:${minuteStr} ${period}`
}

const buildReminderTimes = (times: string[], isoNow: string) =>
  times.map((time, idx) => ({
    id: `mock-reminder-${idx}-${time}`,
    time,
    time_display: formatTimeDisplay(time),
    is_active: true,
    created_at: isoNow,
  }))

const createMockMedication = (overrides: Partial<Medication> = {}): Medication => {
  const now = new Date()
  const isoNow = now.toISOString()
  const today = isoNow.split('T')[0]
  const times = overrides.time ?? ['08:00', '20:00']

  return {
    id: overrides.id ?? `mock-med-${Math.random().toString(36).slice(2, 9)}`,
    name: overrides.name ?? 'Sample Medication',
    medication_type: overrides.medication_type ?? 'Pill',
    dosage_display: overrides.dosage_display ?? `${overrides.dosage_amount ?? 1} ${overrides.dosage_unit ?? 'tablet'}`,
    dosage_amount: overrides.dosage_amount ?? 1,
    dosage_unit: overrides.dosage_unit ?? 'tablet',
    frequency: overrides.frequency ?? 'Daily',
    start_date: overrides.start_date ?? today,
    end_date: overrides.end_date,
    notes: overrides.notes,
    reminder_enabled: overrides.reminder_enabled ?? true,
    is_active: overrides.is_active ?? true,
    is_current: overrides.is_current ?? true,
    time: times,
    startDate: overrides.startDate ?? today,
    endDate: overrides.endDate,
    reminderEnabled: overrides.reminderEnabled ?? true,
    dateAdded: overrides.dateAdded ?? today,
    taken: overrides.taken ?? false,
    created_at: overrides.created_at ?? isoNow,
    updated_at: overrides.updated_at ?? isoNow,
    reminder_times: overrides.reminder_times ?? buildReminderTimes(times, isoNow),
    taken_records: overrides.taken_records ?? [],
  }
}

const MOCK_MEDICATIONS: Medication[] = [
  createMockMedication({
    id: 'mock-med-aspirin',
    name: 'Aspirin',
    dosage_amount: 100,
    dosage_unit: 'mg',
    dosage_display: '100 mg',
    time: ['08:00', '20:00'],
  }),
  createMockMedication({
    id: 'mock-med-metformin',
    name: 'Metformin',
    dosage_amount: 500,
    dosage_unit: 'mg',
    dosage_display: '500 mg',
    time: ['09:00'],
    taken: true,
    notes: 'Take with breakfast',
  }),
]

const mapMedicationsToToday = (meds: Medication[]): TodayMedication[] => {
  const today = new Date().toISOString().split('T')[0]
  return meds
    .filter((med) => med.dateAdded === today && med.is_active)
    .map((med) => ({
      id: med.id,
      name: med.name,
      dosage: med.dosage_display || `${med.dosage_amount} ${med.dosage_unit}`,
      time: med.time || [],
      taken: med.taken,
      medication_type: med.medication_type,
      notes: med.notes,
    }))
}

export interface MedicationContextType {
  medications: Medication[]
  todayMedications: TodayMedication[]
  isLoading: boolean
  error: Error | null
  
  // CRUD operations
  createMedication: (data: CreateMedicationRequest) => Promise<{ success: boolean; medication?: Medication; error?: string }>
  updateMedication: (id: string, data: UpdateMedicationRequest) => Promise<{ success: boolean; medication?: Medication; error?: string }>
  deleteMedication: (id: string) => Promise<{ success: boolean; error?: string }>
  getMedication: (id: string) => Medication | undefined
  
  // Medication tracking
  toggleMedicationTaken: (id: string) => Promise<{ success: boolean; error?: string }>
  
  // Data fetching
  refetchMedications: () => Promise<void>
  refetchTodayMedications: () => Promise<void>
  getMedicationCalendar: (month?: number, year?: number) => Promise<MedicationCalendarResponse>
}

export const [MedicationProvider, useMedication] = createContextHook(() => {
  const queryClient = useQueryClient()
  const { isAuthenticated, loading: authLoading } = useAuth()
  const [hasToken, setHasToken] = React.useState(false)
  const [mockMedications, setMockMedications] = React.useState<Medication[]>(MOCK_MODE ? MOCK_MEDICATIONS : [])
  const mockTodayMedications = React.useMemo(() => mapMedicationsToToday(mockMedications), [mockMedications])

  // Check if token exists in AsyncStorage
  React.useEffect(() => {
    const checkToken = async () => {
      if (isAuthenticated && !authLoading) {
        const token = await AsyncStorage.getItem('accessToken')
        setHasToken(!!token)
      } else {
        setHasToken(false)
      }
    }
    checkToken()
  }, [isAuthenticated, authLoading])

  // Fetch medications - only when authenticated, auth initialized, and token exists
  const {
    data: medications = [],
    isLoading: isLoadingMedications,
    error: medicationsError,
    refetch: refetchMedications,
  } = useQuery({
    queryKey: ['medications'],
    queryFn: () => medicationService.getMedications(),
    staleTime: 30000, // 30 seconds
    enabled: isAuthenticated && !authLoading && hasToken,
    retry: false, // Don't retry on error
  })

  // Fetch today's medications - only when authenticated, auth initialized, and token exists
  const {
    data: todayMedications = [],
    isLoading: isLoadingToday,
    error: todayError,
    refetch: refetchTodayMedications,
  } = useQuery({
    queryKey: ['medications', 'today'],
    queryFn: () => medicationService.getTodayMedications(),
    staleTime: 60000, // 1 minute
    refetchInterval: isAuthenticated && hasToken ? 300000 : false,
    enabled: isAuthenticated && !authLoading && hasToken,
    retry: false, // Don't retry on 404
  })

  // Create medication mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateMedicationRequest) => medicationService.createMedication(data),
    onSuccess: () => {
      // Invalidate queries to refetch, but don't throw errors if refetch fails
      queryClient.invalidateQueries({ queryKey: ['medications'] }).catch(() => {
        // Silently handle refetch errors - medication was already created
      })
      queryClient.invalidateQueries({ queryKey: ['medications', 'today'] }).catch(() => {
        // Silently handle refetch errors - medication was already created
      })
    },
  })

  // Update medication mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateMedicationRequest }) =>
      medicationService.updateMedication(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medications'] })
      queryClient.invalidateQueries({ queryKey: ['medications', 'today'] })
    },
  })

  // Delete medication mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => medicationService.deleteMedication(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medications'] })
      queryClient.invalidateQueries({ queryKey: ['medications', 'today'] })
    },
  })

  // Toggle medication taken mutation
  const toggleTakenMutation = useMutation({
    mutationFn: (id: string) => medicationService.toggleMedicationTaken(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['medications'] })
      queryClient.invalidateQueries({ queryKey: ['medications', 'today'] })
      queryClient.invalidateQueries({ queryKey: ['medications', 'calendar'] })
    },
  })

  const createMedication = async (data: CreateMedicationRequest) => {
    if (MOCK_MODE) {
      const now = new Date()
      const isoNow = now.toISOString()
      const today = isoNow.split('T')[0]
      const times = data.reminder_times && data.reminder_times.length > 0 ? data.reminder_times : ['08:00']

      const newMedication: Medication = {
        id: `mock-med-${Date.now()}`,
        name: data.name,
        medication_type: data.medication_type,
        dosage_display: `${data.dosage_amount} ${data.dosage_unit}`,
        dosage_amount: data.dosage_amount,
        dosage_unit: data.dosage_unit,
        frequency: data.frequency,
        start_date: data.start_date ?? today,
        end_date: data.end_date,
        notes: data.notes,
        reminder_enabled: data.reminder_enabled ?? true,
        is_active: true,
        is_current: true,
        time: times,
        startDate: data.start_date ?? today,
        endDate: data.end_date,
        reminderEnabled: data.reminder_enabled ?? true,
        dateAdded: today,
        taken: false,
        created_at: isoNow,
        updated_at: isoNow,
        reminder_times: buildReminderTimes(times, isoNow),
        taken_records: [],
      }

      setMockMedications((prev) => [newMedication, ...prev])
      return { success: true, medication: newMedication }
    }

    try {
      // Verify token exists before making request
      const token = await AsyncStorage.getItem('accessToken')
      if (!token) {
        console.error('❌ No token found when creating medication')
        return {
          success: false,
          error: 'Authentication credentials were not provided. Please log in again.',
        }
      }
      console.log('✅ Token verified before creating medication:', token.substring(0, 20) + '...')
      
      const medication = await createMutation.mutateAsync(data)
      
      // If we got here, the medication was created successfully
      // Even if refetch fails, the creation was successful
      return { success: true, medication }
    } catch (error: any) {
      console.error('❌ Error creating medication:', error)
      const apiError = error as ApiError
      
      // Check if the error is about authentication on a refetch (not the POST itself)
      // If the medication was actually created, we should still return success
      const errorMessage = apiError.message || 'Failed to create medication'
      const isAuthError = errorMessage.toLowerCase().includes('authentication') || 
                         errorMessage.toLowerCase().includes('credentials')
      
      // If it's an auth error, it might be from a refetch, not the POST
      // In that case, we should still check if the medication was created
      // For now, we'll return the error but log it as potentially a refetch issue
      if (isAuthError) {
        console.warn('⚠️ Auth error after medication creation - might be from refetch, not POST')
      }
      
      return {
        success: false,
        error: errorMessage,
      }
    }
  }

  const updateMedication = async (id: string, data: UpdateMedicationRequest) => {
    if (MOCK_MODE) {
      let updatedMedication: Medication | undefined
      setMockMedications((prev) =>
        prev.map((med) => {
          if (med.id !== id) return med
          updatedMedication = {
            ...med,
            ...data,
            dosage_display: data.dosage_amount && data.dosage_unit ? `${data.dosage_amount} ${data.dosage_unit}` : med.dosage_display,
            dosage_amount: data.dosage_amount ?? med.dosage_amount,
            dosage_unit: data.dosage_unit ?? med.dosage_unit,
            frequency: data.frequency ?? med.frequency,
            medication_type: data.medication_type ?? med.medication_type,
            reminder_enabled: data.reminder_enabled ?? med.reminder_enabled,
            reminderEnabled: data.reminder_enabled ?? med.reminderEnabled,
            time: data.reminder_times ?? med.time,
            updated_at: new Date().toISOString(),
          }
          return updatedMedication!
        })
      )

      return { success: true, medication: updatedMedication }
    }

    try {
      const medication = await updateMutation.mutateAsync({ id, data })
      return { success: true, medication }
    } catch (error: any) {
      const apiError = error as ApiError
      return {
        success: false,
        error: apiError.message || 'Failed to update medication',
      }
    }
  }

  const deleteMedication = async (id: string) => {
    if (MOCK_MODE) {
      setMockMedications((prev) => prev.filter((med) => med.id !== id))
      return { success: true }
    }

    try {
      await deleteMutation.mutateAsync(id)
      return { success: true }
    } catch (error: any) {
      const apiError = error as ApiError
      return {
        success: false,
        error: apiError.message || 'Failed to delete medication',
      }
    }
  }

  const getMedication = (id: string) => {
    const source = MOCK_MODE ? mockMedications : medications
    return source.find(med => med.id === id)
  }

  const toggleMedicationTaken = async (id: string) => {
    if (MOCK_MODE) {
      setMockMedications((prev) =>
        prev.map((med) => (med.id === id ? { ...med, taken: !med.taken } : med))
      )
      return { success: true }
    }

    try {
      // Get medication details before toggling
      const medication = getMedication(id) || todayMedications.find(med => med.id === id)
      const wasTaken = medication && ('taken' in medication ? medication.taken : false)
      
      // Toggle medication taken status
      await toggleTakenMutation.mutateAsync(id)
      
      // Create a notification only when medication is marked as taken (not when untaken)
      if (isAuthenticated && hasToken && medication && !wasTaken) {
        try {
          const medicationName = medication.name || 'Medication'
          const medicationDosage = 'dosage' in medication ? medication.dosage : medication.dosage_display || ''
          
          await notificationsService.createNotification({
            type: 'medication',
            title: 'Medication Taken',
            message: `You marked ${medicationName}${medicationDosage ? ` (${medicationDosage})` : ''} as taken`,
            metadata: {
              medication_id: id,
              medication_name: medicationName,
              action: 'marked_taken',
            },
          })
          
          // Invalidate notifications to show the new one
          queryClient.invalidateQueries({ queryKey: ['notifications'] })
          console.log('✅ Notification created for medication taken:', medicationName)
        } catch (notificationError) {
          // Don't fail the medication toggle if notification creation fails
          console.warn('⚠️ Failed to create notification for medication taken:', notificationError)
        }
      }
      
      return { success: true }
    } catch (error: any) {
      const apiError = error as ApiError
      return {
        success: false,
        error: apiError.message || 'Failed to toggle medication taken status',
      }
    }
  }

  const getMedicationCalendar = async (month?: number, year?: number) => {
    if (MOCK_MODE) {
      return mockMedications.reduce<MedicationCalendarResponse>((acc, med) => {
        const date = med.dateAdded || med.start_date
        if (!date) return acc
        if (!acc[date]) {
          acc[date] = []
        }
        acc[date].push(med)
        return acc
      }, {})
    }

    try {
      return await medicationService.getMedicationCalendar(month, year)
    } catch (error: any) {
      console.error('Failed to fetch medication calendar:', error)
      return {}
    }
  }

  const effectiveMedications = MOCK_MODE ? mockMedications : medications
  const effectiveTodayMedications = MOCK_MODE ? mockTodayMedications : todayMedications

  return {
    medications: effectiveMedications,
    todayMedications: effectiveTodayMedications,
    isLoading: MOCK_MODE ? false : isLoadingMedications || isLoadingToday,
    error: MOCK_MODE ? null : (medicationsError || todayError) as Error | null,
    createMedication,
    updateMedication,
    deleteMedication,
    getMedication,
    toggleMedicationTaken,
    refetchMedications: async () => {
      if (!MOCK_MODE) {
        await refetchMedications()
      }
    },
    refetchTodayMedications: async () => {
      if (!MOCK_MODE) {
        await refetchTodayMedications()
      }
    },
    getMedicationCalendar,
  }
})
