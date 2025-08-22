
'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Badge } from './ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Calendar, Eye, Users, Clock } from 'lucide-react'
import { useToast } from '../hooks/use-toast'

interface Project {
  id: string
  customer: string
  project: string
}

interface SickLeave {
  id: string
  startDate: string
  endDate: string
  status: string
  customerInfoType: string
  substituteName?: string
  customerContact?: string
  tasks?: string
  ccRecipients: string[]
  projects: Project[]
  createdAt: string
}

export function SickLeaveList() {
  const [sickLeaves, setSickLeaves] = useState<SickLeave[]>([])
  const [selectedLeave, setSelectedLeave] = useState<SickLeave | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchSickLeaves()
  }, [])

  const fetchSickLeaves = async () => {
    try {
      const response = await fetch('/api/sick-leaves')
      if (response.ok) {
        const data = await response.json()
        setSickLeaves(data)
      } else {
        toast({
          title: "Fehler",
          description: "Krankmeldungen konnten nicht geladen werden.",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Netzwerkfehler beim Laden der Krankmeldungen.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('de-DE')
  }

  const getStatusBadge = (status: string, endDate: string) => {
    const now = new Date()
    const end = new Date(endDate)
    
    if (end < now) {
      return <Badge variant="secondary">Abgelaufen</Badge>
    } else {
      return <Badge variant="default" className="bg-green-600">Aktiv</Badge>
    }
  }

  const getDuration = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
    return diffDays
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Lade Krankmeldungen...</div>
      </div>
    )
  }

  return (
    <>
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Meine Krankmeldungen {new Date().getFullYear()}
          </h1>
          <p className="text-gray-600">
            {sickLeaves.length} {sickLeaves.length === 1 ? 'Krankmeldung' : 'Krankmeldungen'} gefunden
          </p>
        </div>

        {sickLeaves.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Keine Krankmeldungen
              </h3>
              <p className="text-gray-500">
                Für das Jahr {new Date().getFullYear()} sind noch keine Krankmeldungen eingetragen.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {sickLeaves.map((leave) => {
              const isExpired = new Date(leave.endDate) < new Date()
              return (
                <Card 
                  key={leave.id} 
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    isExpired ? 'opacity-60' : ''
                  }`}
                  onClick={() => setSelectedLeave(leave)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 text-blue-600" />
                            <span className="font-medium">
                              {formatDate(leave.startDate)} - {formatDate(leave.endDate)}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-gray-500" />
                            <span className="text-sm text-gray-600">
                              {getDuration(leave.startDate, leave.endDate)} Tage
                            </span>
                          </div>
                          {getStatusBadge(leave.status, leave.endDate)}
                        </div>
                        
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <Users className="h-4 w-4" />
                          <span>
                            {leave.projects.length} {leave.projects.length === 1 ? 'Projekt' : 'Projekte'}
                            {leave.projects.length > 0 && (
                              <span className="ml-1">
                                ({leave.projects.map(p => p.customer).join(', ')})
                              </span>
                            )}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Eye className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-500">Details anzeigen</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <Dialog open={!!selectedLeave} onOpenChange={() => setSelectedLeave(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <span>Krankmeldung Details</span>
            </DialogTitle>
          </DialogHeader>

          {selectedLeave && (
            <div className="space-y-6">
              {/* Zeitraum */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Von</h4>
                  <p className="text-gray-600">{formatDate(selectedLeave.startDate)}</p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Bis</h4>
                  <p className="text-gray-600">{formatDate(selectedLeave.endDate)}</p>
                </div>
              </div>

              {/* Status */}
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Status</h4>
                {getStatusBadge(selectedLeave.status, selectedLeave.endDate)}
              </div>

              {/* Projekte */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Projekte</h4>
                <div className="space-y-2">
                  {selectedLeave.projects.map((project, index) => (
                    <div key={index} className="bg-gray-50 p-3 rounded-lg">
                      <div className="font-medium">{project.customer}</div>
                      <div className="text-sm text-gray-600">{project.project}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Kundeninformation */}
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Kundeninformation</h4>
                {selectedLeave.customerInfoType === 'informed' ? (
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="text-sm text-green-800">
                      Kunde informiert - Vertretung durch: <strong>{selectedLeave.substituteName}</strong>
                    </div>
                  </div>
                ) : (
                  <div className="bg-orange-50 p-3 rounded-lg">
                    <div className="text-sm text-orange-800 mb-2">
                      <strong>Kunde noch nicht informiert</strong>
                    </div>
                    <div className="text-sm text-gray-700 whitespace-pre-wrap">
                      {selectedLeave.customerContact}
                    </div>
                  </div>
                )}
              </div>

              {/* Aufgaben */}
              {selectedLeave.tasks && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Zu übernehmende Aufgaben</h4>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-700 whitespace-pre-wrap">
                      {selectedLeave.tasks}
                    </div>
                  </div>
                </div>
              )}

              {/* CC-Empfänger */}
              {selectedLeave.ccRecipients.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Weitere Empfänger (CC)</h4>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-sm text-gray-700">
                      {selectedLeave.ccRecipients.join(', ')}
                    </div>
                  </div>
                </div>
              )}

              {/* Erstellt am */}
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Erstellt am</h4>
                <p className="text-sm text-gray-600">
                  {new Date(selectedLeave.createdAt).toLocaleString('de-DE')}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
