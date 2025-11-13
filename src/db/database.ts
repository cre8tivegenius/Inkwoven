import Dexie, { Table } from 'dexie'
import type { Project, Document, Character, World, Exercise, ImageAttachment } from '@/types'

export class InkwovenDatabase extends Dexie {
  projects!: Table<Project, string>
  documents!: Table<Document, string>
  characters!: Table<Character, string>
  worlds!: Table<World, string>
  exercises!: Table<Exercise, string>
  images!: Table<ImageAttachment, string>

  constructor() {
    super('InkwovenDB')
    
    this.version(1).stores({
      projects: 'id, name, createdAt, updatedAt',
      documents: 'id, projectId, title, createdAt, updatedAt',
      characters: 'id, projectId, name, createdAt, updatedAt',
      worlds: 'id, projectId, name, createdAt, updatedAt',
      exercises: 'id, type, completed, createdAt',
      images: 'id, projectId, documentId, createdAt',
    })
  }
}

export const db = new InkwovenDatabase()

// Database service functions
export const projectService = {
  async getAll(): Promise<Project[]> {
    return db.projects.orderBy('updatedAt').reverse().toArray()
  },

  async getById(id: string): Promise<Project | undefined> {
    return db.projects.get(id)
  },

  async create(name: string): Promise<string> {
    const id = crypto.randomUUID()
    const now = new Date()
    await db.projects.add({
      id,
      name,
      createdAt: now,
      updatedAt: now,
    })
    return id
  },

  async update(id: string, updates: Partial<Project>): Promise<void> {
    await db.projects.update(id, {
      ...updates,
      updatedAt: new Date(),
    })
  },

  async delete(id: string): Promise<void> {
    // Delete related documents, characters, and worlds
    await db.documents.where('projectId').equals(id).delete()
    await db.characters.where('projectId').equals(id).delete()
    await db.worlds.where('projectId').equals(id).delete()
    await db.images.where('projectId').equals(id).delete()
    await db.projects.delete(id)
  },
}

export const documentService = {
  async getAll(projectId?: string | null): Promise<Document[]> {
    if (projectId) {
      return db.documents.where('projectId').equals(projectId).orderBy('updatedAt').reverse().toArray()
    }
    return db.documents.where('projectId').equals(null).orderBy('updatedAt').reverse().toArray()
  },

  async getById(id: string): Promise<Document | undefined> {
    return db.documents.get(id)
  },

  async create(data: Omit<Document, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const id = crypto.randomUUID()
    const now = new Date()
    await db.documents.add({
      id,
      ...data,
      createdAt: now,
      updatedAt: now,
    })
    return id
  },

  async update(id: string, updates: Partial<Document>): Promise<void> {
    await db.documents.update(id, {
      ...updates,
      updatedAt: new Date(),
    })
  },

  async delete(id: string): Promise<void> {
    await db.images.where('documentId').equals(id).delete()
    await db.documents.delete(id)
  },
}

export const characterService = {
  async getAll(projectId: string): Promise<Character[]> {
    return db.characters.where('projectId').equals(projectId).orderBy('name').toArray()
  },

  async getById(id: string): Promise<Character | undefined> {
    return db.characters.get(id)
  },

  async create(data: Omit<Character, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const id = crypto.randomUUID()
    const now = new Date()
    await db.characters.add({
      id,
      ...data,
      createdAt: now,
      updatedAt: now,
    })
    return id
  },

  async update(id: string, updates: Partial<Character>): Promise<void> {
    await db.characters.update(id, {
      ...updates,
      updatedAt: new Date(),
    })
  },

  async delete(id: string): Promise<void> {
    await db.characters.delete(id)
  },
}

export const worldService = {
  async getAll(projectId: string): Promise<World[]> {
    return db.worlds.where('projectId').equals(projectId).orderBy('name').toArray()
  },

  async getById(id: string): Promise<World | undefined> {
    return db.worlds.get(id)
  },

  async create(data: Omit<World, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const id = crypto.randomUUID()
    const now = new Date()
    await db.worlds.add({
      id,
      ...data,
      createdAt: now,
      updatedAt: now,
    })
    return id
  },

  async update(id: string, updates: Partial<World>): Promise<void> {
    await db.worlds.update(id, {
      ...updates,
      updatedAt: new Date(),
    })
  },

  async delete(id: string): Promise<void> {
    await db.worlds.delete(id)
  },
}

export const exerciseService = {
  async getAll(): Promise<Exercise[]> {
    return db.exercises.orderBy('createdAt').reverse().toArray()
  },

  async getById(id: string): Promise<Exercise | undefined> {
    return db.exercises.get(id)
  },

  async create(data: Omit<Exercise, 'id' | 'createdAt'>): Promise<string> {
    const id = crypto.randomUUID()
    await db.exercises.add({
      id,
      ...data,
      createdAt: new Date(),
    })
    return id
  },

  async update(id: string, updates: Partial<Exercise>): Promise<void> {
    await db.exercises.update(id, updates)
  },

  async delete(id: string): Promise<void> {
    await db.exercises.delete(id)
  },
}

export const imageService = {
  async getAll(projectId?: string | null, documentId?: string | null): Promise<ImageAttachment[]> {
    let query = db.images.toCollection()
    if (projectId) {
      query = db.images.where('projectId').equals(projectId)
    } else if (documentId) {
      query = db.images.where('documentId').equals(documentId)
    }
    return query.orderBy('createdAt').reverse().toArray()
  },

  async getById(id: string): Promise<ImageAttachment | undefined> {
    return db.images.get(id)
  },

  async create(data: Omit<ImageAttachment, 'id' | 'createdAt'>): Promise<string> {
    const id = crypto.randomUUID()
    await db.images.add({
      id,
      ...data,
      createdAt: new Date(),
    })
    return id
  },

  async delete(id: string): Promise<void> {
    await db.images.delete(id)
  },
}

