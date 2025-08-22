
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '../../lib/auth'
import { NavBar } from '../../components/nav-bar'
import { SickLeaveForm } from '../../components/sick-leave-form'

export default async function NeuPage() {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <main className="py-8 px-4 sm:px-6 lg:px-8">
        <SickLeaveForm />
      </main>
    </div>
  )
}
