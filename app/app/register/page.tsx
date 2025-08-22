
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Label } from '../../components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card'
import { Heart, UserPlus, LogIn } from 'lucide-react'
import { useToast } from '../../hooks/use-toast'

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    manager: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Fehler",
        description: "Die Passwörter stimmen nicht überein.",
        variant: "destructive"
      })
      setIsLoading(false)
      return
    }

    if (formData.password.length < 6) {
      toast({
        title: "Fehler", 
        description: "Das Passwort muss mindestens 6 Zeichen lang sein.",
        variant: "destructive"
      })
      setIsLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          manager: formData.manager || undefined,
        }),
      })

      if (response.ok) {
        toast({
          title: "Konto erstellt",
          description: "Sie können sich jetzt anmelden.",
        })
        router.push('/login')
      } else {
        const error = await response.json()
        toast({
          title: "Registrierung fehlgeschlagen",
          description: error.error || "Ein Fehler ist aufgetreten.",
          variant: "destructive"
        })
      }
    } catch (error) {
      toast({
        title: "Fehler",
        description: "Ein unerwarteter Fehler ist aufgetreten.",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Heart className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Krankmeldung</h1>
          </div>
          <p className="text-gray-600">Erstellen Sie Ihr Konto</p>
        </div>

        {/* Register Form */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-center space-x-2">
              <UserPlus className="h-5 w-5 text-blue-600" />
              <span>Registrieren</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Vollständiger Name *</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Max Mustermann"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">E-Mail-Adresse *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="max.mustermann@beispiel.de"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="manager">Manager E-Mail (optional)</Label>
                <Input
                  id="manager"
                  name="manager"
                  type="email"
                  value={formData.manager}
                  onChange={handleChange}
                  placeholder="manager@beispiel.de"
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Passwort *</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Mindestens 6 Zeichen"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Passwort bestätigen *</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Passwort wiederholen"
                  required
                  disabled={isLoading}
                />
              </div>

              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700"
                disabled={isLoading}
              >
                {isLoading ? 'Wird erstellt...' : 'Konto erstellen'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Bereits ein Konto?{' '}
                <Link 
                  href="/login" 
                  className="text-blue-600 hover:text-blue-500 font-medium"
                >
                  Jetzt anmelden
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Info */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            Interne Krankmeldungs-App für Netlution
          </p>
        </div>
      </div>
    </div>
  )
}
