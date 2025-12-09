// app/admin/adventures/page.tsx
'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit, Trash2, Save, X, Image as ImageIcon, Eye, Calendar, MapPin } from 'lucide-react'
import Link from 'next/link'

interface Adventure {
  id: string
  title: string
  subtitle: string
  description: string
  content: string
  date: string
  type: 'Experience' | 'Community' | 'Travel'
  color: string
  icon: string
  images: string[]
  location?: string
  status?: 'ongoing' | 'completed'
}

const typeOptions = [
  { value: 'Experience', label: 'Experience', color: 'from-rose-500 to-pink-600' },
  { value: 'Community', label: 'Community', color: 'from-blue-500 to-indigo-600' },
  { value: 'Travel', label: 'Travel', color: 'from-emerald-500 to-teal-600' }
]

const iconOptions = ['Heart', 'Users', 'Compass', 'MessageCircle', 'Camera', 'Code']

export default function AdventuresAdminPanel() {
  const [adventures, setAdventures] = useState<Adventure[]>([])
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  
  const [formData, setFormData] = useState<Adventure>({
    id: '',
    title: '',
    subtitle: '',
    description: '',
    content: '',
    date: new Date().toISOString().split('T')[0],
    type: 'Experience',
    color: 'from-rose-500 to-pink-600',
    icon: 'Heart',
    images: [],
    location: '',
    status: 'completed'
  })

  const [imageInput, setImageInput] = useState('')

  useEffect(() => {
    fetchAdventures()
  }, [])

  const fetchAdventures = async () => {
    try {
      const res = await fetch('/api/adventures')
      const data = await res.json()
      setAdventures(data.adventures || [])
    } catch (error) {
      console.error('Error fetching adventures:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleTypeChange = (type: 'Experience' | 'Community' | 'Travel') => {
    const selectedType = typeOptions.find(t => t.value === type)
    setFormData(prev => ({
      ...prev,
      type,
      color: selectedType?.color || prev.color
    }))
  }

  const handleAddImage = () => {
    if (imageInput.trim()) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, imageInput.trim()]
      }))
      setImageInput('')
    }
  }

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const generateId = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const handleSubmit = async () => {
    if (!formData.title || !formData.subtitle || !formData.description || !formData.content) {
      alert('Please fill in all required fields')
      return
    }

    setSaving(true)

    try {
      const adventureData = {
        ...formData,
        id: editingId || generateId(formData.title + '-' + Date.now())
      }

      const res = editingId
        ? await fetch(`/api/adventures/${editingId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(adventureData)
          })
        : await fetch('/api/adventures', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(adventureData)
          })

      const data = await res.json()

      if (data.success) {
        alert(editingId ? 'Adventure updated successfully!' : 'Adventure created successfully!')
        fetchAdventures()
        handleCancel()
      } else {
        alert('Error saving adventure: ' + data.error)
      }
    } catch (error) {
      console.error('Error saving adventure:', error)
      alert('Error saving adventure')
    } finally {
      setSaving(false)
    }
  }

  const handleEdit = (adventure: Adventure) => {
    setFormData(adventure)
    setEditingId(adventure.id)
    setIsEditing(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this adventure?')) return

    try {
      const res = await fetch(`/api/adventures/${id}`, {
        method: 'DELETE'
      })

      const data = await res.json()

      if (data.success) {
        alert('Adventure deleted successfully!')
        fetchAdventures()
      } else {
        alert('Error deleting adventure')
      }
    } catch (error) {
      console.error('Error deleting adventure:', error)
      alert('Error deleting adventure')
    }
  }

  const handleCancel = () => {
    setFormData({
      id: '',
      title: '',
      subtitle: '',
      description: '',
      content: '',
      date: new Date().toISOString().split('T')[0],
      type: 'Experience',
      color: 'from-rose-500 to-pink-600',
      icon: 'Heart',
      images: [],
      location: '',
      status: 'completed'
    })
    setEditingId(null)
    setIsEditing(false)
    setImageInput('')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded w-64"></div>
            <div className="h-96 bg-slate-200 dark:bg-slate-700 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-200">
            Adventures Admin
          </h1>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              New Adventure
            </button>
          )}
        </div>

        {/* Form */}
        {isEditing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg mb-8 border border-slate-200 dark:border-slate-700"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                {editingId ? 'Edit Adventure' : 'New Adventure'}
              </h2>
              <button
                onClick={handleCancel}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </button>
            </div>

            <div className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Adventure title"
                />
              </div>

              {/* Subtitle */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Subtitle *
                </label>
                <input
                  type="text"
                  name="subtitle"
                  value={formData.subtitle}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Short subtitle"
                />
              </div>

              {/* Type, Icon, Status */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Type *
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={(e) => handleTypeChange(e.target.value as any)}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {typeOptions.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Icon
                  </label>
                  <select
                    name="icon"
                    value={formData.icon}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {iconOptions.map(icon => (
                      <option key={icon} value={icon}>
                        {icon}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="completed">Completed</option>
                    <option value="ongoing">Ongoing</option>
                  </select>
                </div>
              </div>

              {/* Date and Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Date *
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Location
                  </label>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nairobi, Kenya"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Description * (for listing page)
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Brief description for the listing page"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Content * (Markdown supported)
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleInputChange}
                  rows={15}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none font-mono text-sm"
                  placeholder="# Your Adventure Story&#10;&#10;Write your full adventure content here using Markdown..."
                />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  Supports Markdown: # Headers, **bold**, *italic*, lists, links, etc.
                </p>
              </div>

              {/* Images */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Images
                </label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={imageInput}
                    onChange={(e) => setImageInput(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="/images/adventures/your-image.jpg"
                  />
                  <button
                    type="button"
                    onClick={handleAddImage}
                    className="px-4 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                  Add images from /public/images/adventures/ folder
                </p>
                {formData.images.length > 0 && (
                  <div className="space-y-2">
                    {formData.images.map((image, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-900 rounded-lg"
                      >
                        <ImageIcon className="w-5 h-5 text-slate-400" />
                        <span className="flex-1 text-sm text-slate-600 dark:text-slate-400">
                          {image}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="p-1 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
                        >
                          <X className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleSubmit}
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-5 h-5" />
                      {editingId ? 'Update' : 'Create'} Adventure
                    </>
                  )}
                </button>
                <button
                  onClick={handleCancel}
                  className="px-6 py-3 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Adventures List */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4">
            All Adventures ({adventures.length})
          </h2>
          
          {adventures.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 text-center border border-slate-200 dark:border-slate-700">
              <p className="text-slate-600 dark:text-slate-400">
                No adventures yet. Create your first one!
              </p>
            </div>
          ) : (
            adventures.map((adventure) => (
              <div
                key={adventure.id}
                className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md border border-slate-200 dark:border-slate-700"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full bg-gradient-to-r ${adventure.color} text-white`}>
                        {adventure.type}
                      </span>
                      {adventure.status === 'ongoing' && (
                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-500 text-white flex items-center gap-1">
                          <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                          Ongoing
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">
                      {adventure.title}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                      {adventure.subtitle}
                    </p>
                    <p className="text-slate-600 dark:text-slate-300 mb-4 line-clamp-2">
                      {adventure.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {adventure.date}
                      </div>
                      {adventure.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {adventure.location}
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <ImageIcon className="w-4 h-4" />
                        {adventure.images.length} images
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <a
                      href={`/adventures/${adventure.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-colors"
                      title="View"
                    >
                      <Eye className="w-5 h-5 text-blue-600" />
                    </a>
                    <Link href={`/admin/adventures/${adventure.id}`}>
                      <button
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                      </button>
                    </Link>
                    <button
                      onClick={() => handleDelete(adventure.id)}
                      className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5 text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}