import { supabase } from '@/lib/supabase'
import type { Adventure } from '@/app/api/admin/adventures/route'

// Convert database row to Adventure type
function dbToAdventure(row: any): Adventure {
  return {
    id: row.id,
    title: row.title,
    subtitle: row.subtitle,
    description: row.description,
    content: row.content,
    date: row.date,
    type: row.type,
    color: row.color,
    icon: row.icon,
    images: row.images || [],
    location: row.location || undefined,
    status: row.status || undefined,
  }
}

// Convert Adventure type to database insert format
function adventureToDb(adventure: Partial<Adventure>): any {
  return {
    id: adventure.id,
    title: adventure.title,
    subtitle: adventure.subtitle,
    description: adventure.description,
    content: adventure.content,
    date: adventure.date || new Date().toISOString().split('T')[0],
    type: adventure.type || 'Experience',
    color: adventure.color || 'from-rose-500 to-pink-600',
    icon: adventure.icon || 'Heart',
    images: adventure.images || [],
    location: adventure.location || null,
    status: adventure.status || 'completed',
  }
}

export async function getAllAdventures(): Promise<Adventure[]> {
  const { data, error } = await supabase
    .from('adventures')
    .select('*')
    .order('date', { ascending: false })

  if (error) {
    console.error('Error fetching adventures:', error)
    throw new Error(`Failed to fetch adventures: ${error.message}`)
  }

  return (data || []).map(dbToAdventure)
}

export async function getAdventureById(id: string): Promise<Adventure | null> {
  const { data, error } = await supabase
    .from('adventures')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return null
    }
    console.error('Error fetching adventure:', error)
    throw new Error(`Failed to fetch adventure: ${error.message}`)
  }

  return data ? dbToAdventure(data) : null
}

export async function createAdventure(adventure: Partial<Adventure>): Promise<Adventure> {
  const adventureData = adventureToDb({
    ...adventure,
    id: adventure.id || `${Date.now()}`,
  })

  const { data, error } = await supabase
    .from('adventures')
    .insert(adventureData)
    .select()
    .single()

  if (error) {
    console.error('Error creating adventure:', error)
    throw new Error(`Failed to create adventure: ${error.message}`)
  }

  return dbToAdventure(data)
}

export async function updateAdventure(id: string, updates: Partial<Adventure>): Promise<Adventure> {
  const updateData: any = {}
  
  if (updates.title !== undefined) updateData.title = updates.title
  if (updates.subtitle !== undefined) updateData.subtitle = updates.subtitle
  if (updates.description !== undefined) updateData.description = updates.description
  if (updates.content !== undefined) updateData.content = updates.content
  if (updates.date !== undefined) updateData.date = updates.date
  if (updates.type !== undefined) updateData.type = updates.type
  if (updates.color !== undefined) updateData.color = updates.color
  if (updates.icon !== undefined) updateData.icon = updates.icon
  if (updates.images !== undefined) updateData.images = updates.images
  if (updates.location !== undefined) updateData.location = updates.location
  if (updates.status !== undefined) updateData.status = updates.status

  const { data, error } = await supabase
    .from('adventures')
    .update(updateData)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating adventure:', error)
    throw new Error(`Failed to update adventure: ${error.message}`)
  }

  if (!data) {
    throw new Error('Adventure not found')
  }

  return dbToAdventure(data)
}

export async function deleteAdventure(id: string): Promise<void> {
  const { error } = await supabase.from('adventures').delete().eq('id', id)

  if (error) {
    console.error('Error deleting adventure:', error)
    throw new Error(`Failed to delete adventure: ${error.message}`)
  }
}

