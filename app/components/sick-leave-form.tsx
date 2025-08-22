
'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Textarea } from './ui/textarea'
import { RadioGroup, RadioGroupItem } from './ui/radio-group'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { EmailPreviewModal } from './email-preview-modal'
import { Plus, Minus, Calendar, Mail } from 'lucide-react'
import { useToast } from '../hooks/use-toast'

interface Project {
  customer: string
  project: string
}

interface FormData {
  startDate: string
  endDate: string
  projects: Project[]
  customerInfoType: 'informed' | 'not_informed'
  substituteName: string
  customerContact: string
  tasks: string
  ccRecipients: string[]
}

export function SickLeaveForm() {
  const { data: session } = useSession()
  const { toast } = useToast()
  const [showPreview, setShowPreview] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [formData, setFormData] = useState<FormData>({
    startDate: '',
    endDate: '',
    projects: [{ customer: '', project: '' }],
    customerInfoType: 'informed',
    substituteName: '',
    customerContact: '',
    tasks: '',
    ccRecipients: []
  })

  const addProject = () => {
    setFormData(prev => ({
      ...prev,
      projects: [...prev.projects, { customer: '', project: '' }]
    }))
  }

  const removeProject = (index: number) => {
    if (formData.projects.length > 1) {
      setFormData(prev => ({
        ...prev,
        projects: prev.projects.filter((_, i) => i !== index)
      }))
    }
  }

  const updateProject = (index: number, field: keyof Project, value: string) => {
    setFormData(prev => ({
      ...prev,
      projects: prev.projects.map((project, i) => 
        i === index ? { ...project, [field]: value } : project
      )
    }))
  }

  const handleCCRecipientsChange = (value: string) => {
    const emails = value.split(',').map(email => email.trim()).filter(email => email)
    setFormData(prev => ({ ...prev, ccRecipients: emails }))
  }

  const validateForm = () => {
    if (!formData.startDate || !formData.endDate) {
      toast({
        title: "Fehler",
        description: "Bitte geben Sie Start- und Enddatum an.",
        variant: "destructive"
      })
      return false
    }

    if (formData.projects.some(p => !p.customer || !p.project)) {
      toast({
        title: "Fehler", 
        description: "Bitte füllen Sie alle Projekt-Felder aus.",
        variant: "destructive"
      })
      return false
    }

    if (formData.customerInfoType === 'informed' && !formData.substituteName) {
      toast({
        title: "Fehler",
        description: "Bitte geben Sie den Namen der Vertretung an.",
        variant: "destructive"
      })
      return false
    }

    if (formData.customerInfoType === 'not_informed' && !formData.customerContact) {
      toast({
        title: "Fehler",
        description: "Bitte geben Sie die Kontaktdaten des Kunden an.",
        variant: "destructive"
      })
      return false
    }

    return true
  }

  const handlePreview = () => {
    if (validateForm()) {
      setShowPreview(true)
    }
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/sick-leaves', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: "Erfolgreich",
          description: "Krankmeldung wurde gespeichert.",
        })
        
        // Reset form
        setFormData({
          startDate: '',
          endDate: '',
          projects: [{ customer: '', project: '' }],
          customerInfoType: 'informed',
          substituteName: '',
          customerContact: '',
          tasks: '',
          ccRecipients: []
        })
        setShowPreview(false)
      } else {
        const error = await response.json()
        toast({
          title: "Fehler",
          description: error.error || "Fehler beim Speichern der Krankmeldung.",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Fehler", 
        description: "Netzwerkfehler beim Speichern der Krankmeldung.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Card className="mx-auto max-w-2xl shadow-lg">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center space-x-2 text-2xl">
            <Calendar className="h-6 w-6 text-blue-600" />
            <span>Neue Krankmeldung einreichen</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Zeitraum */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Von Datum *</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">Bis voraussichtlich Datum *</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                className="w-full"
              />
            </div>
          </div>

          {/* Projekte */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Projekte *</Label>
            {formData.projects.map((project, index) => (
              <div key={index} className="flex items-end space-x-2">
                <div className="flex-1 space-y-2">
                  <Label>Kunde</Label>
                  <Input
                    value={project.customer}
                    onChange={(e) => updateProject(index, 'customer', e.target.value)}
                    placeholder="Kundenname"
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <Label>Projekt</Label>
                  <Input
                    value={project.project}
                    onChange={(e) => updateProject(index, 'project', e.target.value)}
                    placeholder="Projektname"
                  />
                </div>
                <div className="flex space-x-1">
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={addProject}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  {formData.projects.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeProject(index)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Kundeninformation */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Kundeninformation *</Label>
            <RadioGroup
              value={formData.customerInfoType}
              onValueChange={(value: 'informed' | 'not_informed') => 
                setFormData(prev => ({ ...prev, customerInfoType: value }))
              }
            >
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <RadioGroupItem value="informed" id="informed" className="mt-1" />
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="informed">Kunde informiert, Vertretung durch:</Label>
                    {formData.customerInfoType === 'informed' && (
                      <Input
                        value={formData.substituteName}
                        onChange={(e) => setFormData(prev => ({ ...prev, substituteName: e.target.value }))}
                        placeholder="Name der Vertretung"
                        className="w-full"
                      />
                    )}
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <RadioGroupItem value="not_informed" id="not_informed" className="mt-1" />
                  <div className="flex-1 space-y-2">
                    <Label htmlFor="not_informed">Kunde nicht informiert, Kontaktdaten:</Label>
                    {formData.customerInfoType === 'not_informed' && (
                      <Textarea
                        value={formData.customerContact}
                        onChange={(e) => setFormData(prev => ({ ...prev, customerContact: e.target.value }))}
                        placeholder="Kontaktdaten des Kunden (E-Mail, Telefon, etc.)"
                        className="w-full"
                        rows={3}
                      />
                    )}
                  </div>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Aufgaben */}
          <div className="space-y-2">
            <Label htmlFor="tasks">Zu übernehmende Aufgaben</Label>
            <Textarea
              id="tasks"
              value={formData.tasks}
              onChange={(e) => setFormData(prev => ({ ...prev, tasks: e.target.value }))}
              placeholder="Beschreibung der Aufgaben, die übernommen werden müssen..."
              rows={4}
            />
          </div>

          {/* CC-Empfänger */}
          <div className="space-y-2">
            <Label htmlFor="ccRecipients">Weitere Empfänger (CC)</Label>
            <Input
              id="ccRecipients"
              value={formData.ccRecipients.join(', ')}
              onChange={(e) => handleCCRecipientsChange(e.target.value)}
              placeholder="E-Mail-Adressen, durch Komma getrennt"
            />
            <p className="text-sm text-gray-500">
              Mehrere E-Mail-Adressen durch Komma trennen
            </p>
          </div>

          {/* Submit Button */}
          <Button
            onClick={handlePreview}
            className="w-full bg-blue-600 hover:bg-blue-700"
            size="lg"
          >
            <Mail className="h-4 w-4 mr-2" />
            Vorschau anzeigen & Senden
          </Button>
        </CardContent>
      </Card>

      <EmailPreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        onSend={handleSubmit}
        formData={formData}
        userName={session?.user?.name || ''}
        userManager={session?.user?.manager || ''}
        isSubmitting={isSubmitting}
      />
    </>
  )
}
