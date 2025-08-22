
'use client'

import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from './ui/button'
import { User, LogOut, Heart } from 'lucide-react'

export function NavBar() {
  const { data: session } = useSession()
  const pathname = usePathname()

  if (!session) return null

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo/Title */}
          <div className="flex items-center space-x-2">
            <Heart className="h-6 w-6 text-blue-600" />
            <h1 className="text-xl font-semibold text-gray-900">Krankmeldung</h1>
          </div>

          {/* Navigation */}
          <nav className="flex items-center space-x-6">
            <Link
              href="/neu"
              className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                pathname === '/neu'
                  ? 'text-blue-600 border-b-2 border-blue-600 pb-4'
                  : 'text-gray-600'
              }`}
            >
              Neu einreichen
            </Link>
            <Link
              href="/uebersicht"
              className={`text-sm font-medium transition-colors hover:text-blue-600 ${
                pathname === '/uebersicht'
                  ? 'text-blue-600 border-b-2 border-blue-600 pb-4'
                  : 'text-gray-600'
              }`}
            >
              Übersicht
            </Link>
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <User className="h-4 w-4" />
              <span>{session.user?.name}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="text-gray-600 hover:text-gray-900"
            >
              <LogOut className="h-4 w-4 mr-1" />
              Abmelden
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
