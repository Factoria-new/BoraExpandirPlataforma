'use client'

// import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Calendar, Clock, MapPin } from 'lucide-react'

interface AppointmentReminderProps {
  appointmentDate: string // ISO string format
  appointmentTime: string // "HH:MM" format
  service: string
  location?: string
}



export function AppointmentReminder({
  appointmentDate,
  appointmentTime,
  service,
  location = "Online - WhatsApp/Zoom"
}: AppointmentReminderProps) {

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 border-blue-200 dark:border-blue-800 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-blue-900 dark:text-blue-100">
          <Calendar className="h-5 w-5" />
          <span>Seu Próximo Agendamento</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Service Info */}
        <div className="space-y-4">
          <div className="flex items-start space-x-2">
            <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Serviço</p>
              <p className="text-base font-semibold text-gray-900 dark:text-white">{service}</p>
            </div>
          </div>

          <div className="flex items-start space-x-2">
            <Clock className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Data e Hora</p>
              <p className="text-sm text-gray-900 dark:text-white capitalize">{formatDate(appointmentDate)}</p>
              <p className="text-sm text-gray-900 dark:text-white">{appointmentTime}</p>
            </div>
          </div>

          {location && (
            <div className="flex items-start space-x-2">
              <MapPin className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Local</p>
                <p className="text-sm text-gray-900 dark:text-white">{location}</p>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
