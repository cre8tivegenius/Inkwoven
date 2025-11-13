export interface Project {
  id: string
  name: string
  createdAt: Date
  updatedAt: Date
}

export interface Document {
  id: string
  projectId: string | null
  title: string
  content: any // JSON content from Tiptap
  format: string
  fontFamily?: string
  textColor?: string
  backgroundColor?: string
  createdAt: Date
  updatedAt: Date
}

export interface Character {
  id: string
  projectId: string
  name: string
  traits: Record<string, any>
  image?: Blob
  createdAt: Date
  updatedAt: Date
}

export interface World {
  id: string
  projectId: string
  name: string
  description: string
  notes: any // JSON content
  createdAt: Date
  updatedAt: Date
}

export interface Exercise {
  id: string
  type: string
  prompt: string
  completed: boolean
  completedAt?: Date
  createdAt: Date
}

export interface ImageAttachment {
  id: string
  projectId: string | null
  documentId: string | null
  name: string
  data: Blob
  mimeType: string
  createdAt: Date
}

