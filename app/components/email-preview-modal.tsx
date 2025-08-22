
'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from './ui/dialog'
import { Button } from './ui/button'
import { Separator } from './ui/separator'
import { Mail, Send, X } from 'lucide-react'

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

interface EmailPreviewModalProps {
  isOpen: boolean
  onClose: () => void
  onSend: () => void
  formData: FormData
  userName: string
  userManager: string
  isSubmitting: boolean
}

export function EmailPreviewModal({
  isOpen,
  onClose,
  onSend,
  formData,
  userName,
  userManager,
  isSubmitting
}: EmailPreviewModalProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('de-DE')
  }

  const generateEmailContent = () => {
    const projects = formData.projects
      .map(p => `${p.customer} - ${p.project}`)
      .join('\n')

    let customerInfo = ''
    if (formData.customerInfoType === 'informed') {
      customerInfo = `Der Kunde wurde bereits durch mich über den Ausfall und die Dauer informiert. Hier ist eine Vertretung durch ${formData.substituteName} gegeben.`
    } else {
      customerInfo = `Der Kunde ist noch nicht informiert. Ich bitte euch, die Information an den Kunden weiterzugeben.\n\nKontaktdaten Kunde:\n${formData.customerContact}`
    }

    return `Liebe Kolleginnen und Kollegen,

Ich falle krankheitsbedingt von ${formatDate(formData.startDate)} bis voraussichtlich ${formatDate(formData.endDate)} aus.

Während der Krankmeldung bin ich in folgenden Projekten eingesetzt:
${projects}

${customerInfo}

${formData.tasks ? `Es müssen Aufgaben im Projekt übernommen werden:\n${formData.tasks}\n\n` : ''}Viele Grüße,
${userName}`
  }

  const generateMailtoLink = () => {
    const subject = `Krankmeldung ${userName} - ${formatDate(formData.startDate)} bis ${formatDate(formData.endDate)}`
    const body = generateEmailContent()
    
    const recipients = ['krankmeldung@netlution.de']
    if (userManager) {
      recipients.push(userManager)
    }
    recipients.push(...formData.ccRecipients)

    const to = recipients[0]
    const cc = recipients.slice(1).join(',')
    
    const params = new URLSearchParams({
      subject,
      body,
      ...(cc && { cc })
    })
    
    return `mailto:${to}?${params.toString()}`
  }

  const handleSendEmail = () => {
    // Open email client
    window.open(generateMailtoLink(), '_blank')
    
    // Submit the form to save to database
    onSend()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Mail className="h-5 w-5 text-blue-600" />
            <span>E-Mail Vorschau</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Email Headers */}
          <div className="space-y-2 bg-gray-50 p-4 rounded-lg">
            <div className="grid grid-cols-12 gap-2 text-sm">
              <div className="col-span-2 font-medium text-gray-600">An:</div>
              <div className="col-span-10">krankmeldung@netlution.de</div>
              
              {userManager && (
                <>
                  <div className="col-span-2 font-medium text-gray-600">CC:</div>
                  <div className="col-span-10">
                    {[userManager, ...formData.ccRecipients].join(', ')}
                  </div>
                </>
              )}
              
              <div className="col-span-2 font-medium text-gray-600">Betreff:</div>
              <div className="col-span-10">
                Krankmeldung {userName} - {formatDate(formData.startDate)} bis {formatDate(formData.endDate)}
              </div>
            </div>
          </div>

          <Separator />

          {/* Email Body */}
          <div className="space-y-4">
            <div className="whitespace-pre-wrap text-sm bg-white p-4 border rounded-lg min-h-[300px]">
              {generateEmailContent()}
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            <X className="h-4 w-4 mr-2" />
            Abbrechen
          </Button>
          <Button 
            onClick={handleSendEmail} 
            disabled={isSubmitting}
            className="bg-green-600 hover:bg-green-700"
          >
            <Send className="h-4 w-4 mr-2" />
            {isSubmitting ? 'Wird gespeichert...' : 'E-Mail senden & Speichern'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
