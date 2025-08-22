
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create test users
  const hashedPassword = await bcrypt.hash('test123', 12)

  const user1 = await prisma.user.upsert({
    where: { email: 'max.mustermann@netlution.de' },
    update: {},
    create: {
      name: 'Max Mustermann',
      email: 'max.mustermann@netlution.de',
      password: hashedPassword,
      manager: 'manager@netlution.de',
    },
  })

  const user2 = await prisma.user.upsert({
    where: { email: 'anna.schmidt@netlution.de' },
    update: {},
    create: {
      name: 'Anna Schmidt',
      email: 'anna.schmidt@netlution.de',
      password: hashedPassword,
      manager: 'manager@netlution.de',
    },
  })

  // Create sample sick leaves
  const currentDate = new Date()
  const pastDate = new Date(currentDate.getTime() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
  const futureDate = new Date(currentDate.getTime() + 3 * 24 * 60 * 60 * 1000) // 3 days from now

  // Past sick leave
  const sickLeave1 = await prisma.sickLeave.create({
    data: {
      userId: user1.id,
      startDate: pastDate,
      endDate: new Date(currentDate.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      status: 'expired',
      customerInfoType: 'informed',
      substituteName: 'Thomas Weber',
      tasks: 'Code-Review für Website-Update, Kundenmeetings am Mittwoch',
      ccRecipients: ['team@netlution.de'],
      projects: {
        create: [
          {
            customer: 'Musterfirma GmbH',
            project: 'Website-Redesign'
          },
          {
            customer: 'TechStart AG',
            project: 'Mobile App Development'
          }
        ]
      }
    }
  })

  // Active sick leave
  const sickLeave2 = await prisma.sickLeave.create({
    data: {
      userId: user2.id,
      startDate: currentDate,
      endDate: futureDate,
      status: 'active',
      customerInfoType: 'not_informed',
      customerContact: 'Herr Müller\nE-Mail: mueller@beispielkunde.de\nTelefon: +49 123 456789',
      tasks: 'Server-Wartung durchführen, Backup-Scripts überprüfen',
      ccRecipients: ['it@netlution.de', 'projekt@netlution.de'],
      projects: {
        create: [
          {
            customer: 'Beispielkunde e.K.',
            project: 'Server-Migration'
          }
        ]
      }
    }
  })

  // Another active sick leave for variety
  const sickLeave3 = await prisma.sickLeave.create({
    data: {
      userId: user1.id,
      startDate: new Date(currentDate.getTime() + 1 * 24 * 60 * 60 * 1000), // tomorrow
      endDate: new Date(currentDate.getTime() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      status: 'active',
      customerInfoType: 'informed',
      substituteName: 'Sarah Klein',
      tasks: 'Datenbank-Migration abschließen, Performance-Tests durchführen',
      ccRecipients: [],
      projects: {
        create: [
          {
            customer: 'InnoTech Solutions',
            project: 'E-Commerce Platform'
          },
          {
            customer: 'GreenEnergy Corp',
            project: 'Monitoring Dashboard'
          }
        ]
      }
    }
  })

  console.log('✅ Database seeded successfully!')
  console.log(`👤 Created users: ${user1.name}, ${user2.name}`)
  console.log(`🏥 Created sick leaves: ${sickLeave1.id}, ${sickLeave2.id}, ${sickLeave3.id}`)
  console.log('')
  console.log('🔑 Test login credentials:')
  console.log('Email: max.mustermann@netlution.de')
  console.log('Email: anna.schmidt@netlution.de')
  console.log('Password: test123 (for both accounts)')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
