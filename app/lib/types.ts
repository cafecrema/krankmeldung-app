
// Type definitions for the Krankmeldung app

export interface User {
  id: string
  name: string | null
  email: string
  manager: string | null
  createdAt: Date
  updatedAt: Date
}

export interface Project {
  id: string
  sickLeaveId: string
  customer: string
  project: string
}

export interface SickLeave {
  id: string
  userId: string
  startDate: Date
  endDate: Date
  status: string
  customerInfoType: 'informed' | 'not_informed'
  substituteName: string | null
  customerContact: string | null
  tasks: string | null
  ccRecipients: string[]
  projects: Project[]
  user?: User
  createdAt: Date
  updatedAt: Date
}

export interface EmailTemplate {
  to: string[]
  cc: string[]
  subject: string
  body: string
}

export interface FormDataType {
  startDate: string
  endDate: string
  projects: Array<{
    customer: string
    project: string
  }>
  customerInfoType: 'informed' | 'not_informed'
  substituteName: string
  customerContact: string
  tasks: string
  ccRecipients: string[]
}

// NextAuth session type extension
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      manager?: string | null
    }
  }

  interface User {
    id: string
    manager?: string | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    manager?: string | null
  }
}
