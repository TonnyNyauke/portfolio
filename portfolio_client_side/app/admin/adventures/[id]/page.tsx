// app/admin/adventures/[id]/page.tsx
'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Save, X, Image as ImageIcon, ArrowLeft, Eye, Trash2, Calendar, MapPin } from 'lucide-react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'

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

export default function EditAdventurePage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState('')
  
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
    fetchAdventure()
  }, [params.id])

  const fetchAdventure = async () => {
    try {
      console.log('Fetching adventure:', params.id)
      const res = await fetch(`/api/admin/adventures/${params.id}`)
      
      console.log('Response status:', res.status)
      console.log('Response headers:', res.headers.get('content-type'))
      
      // Check if response is JSON
      const contentType = res.headers.get('content-type')
      if (!contentType || !contentType.includes('application/json')) {
        const text = await res.text()
        console.error('Non-JSON response:', text.substring(0, 200))
        throw new Error('Server returned non-JSON response. Check if the API route exists.')
      }
      
      const data = await res.json()
      console.log('Response data:', data)
      
      if (data.success && data.adventure) {
        setFormData(data.adventure)
        setError('')
      } else {
        setError(data.error || 'Adventure not found')
      }
    } catch (error: any) {
      console.error('Error fetching adventure:', error)
      setError(error.message || 'Failed to load adventure. Please check the console for details.')
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

  const handleSubmit = async () => {
    if (!formData.title || !formData.subtitle || !formData.description || !formData.content) {
      alert('Please fill in all required fields')
      return
    }

    setSaving(true)
    setError('')

    try {
      const res = await fetch('/api/admin/adventures', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await res.json()

      if (data.success) {
        alert('Adventure updated successfully!')
        router.push('/admin/adventures')
      } else {
        setError('Error saving adventure: ' + data.error)
      }
    } catch (error) {
      console.error('Error saving adventure:', error)
      setError('Error saving adventure')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this adventure? This action cannot be undone.')) {
      return
    }

    setDeleting(true)
    setError('')

    try {
      const res = await fetch('/api/admin/adventures', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: formData.id })
      })

      const data = await res.json()

      if (data.success) {
        alert('Adventure deleted successfully!')
        router.push('/admin/adventures')
      } else {
        setError('Error deleting adventure')
      }
    } catch (error) {
      console.error('Error deleting adventure:', error)
      setError('Error deleting adventure')
    } finally {
      setDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-8">
        <div className="max-w-5xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-slate-200 dark:bg-slate-700 rounded w-64"></div>
            <div className="h-96 bg-slate-200 dark:bg-slate-700 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error && !formData.id) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-8">
        <div className="max-w-5xl mx-auto">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-red-700 dark:text-red-300 mb-4">
              Failed to Load Adventure
            </h2>
            <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
            <div className="bg-slate-100 dark:bg-slate-800 rounded p-4 mb-4 text-sm">
              <p className="font-semibold mb-2">Troubleshooting:</p>
              <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-400">
                <li>Check that the adventure ID exists in your adventures.json file</li>
                <li>Verify the API route file exists at: app/api/adventures/[id]/route.ts</li>
                <li>Check the browser console for more details</li>
                <li>Ensure your fileStore.ts readJsonFile function is working</li>
              </ul>
            </div>
            <Link href="/admin/adventures">
              <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Back to Adventures
              </button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link href="/admin/adventures">
              <button className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors">
                <ArrowLeft className="w-6 h-6 text-slate-600 dark:text-slate-400" />
              </button>
            </Link>
            <div>
              <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-200">
                Edit Adventure
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                ID: {formData.id}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <a
              href={`/adventures/${formData.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
            >
              <Eye className="w-5 h-5" />
              Preview
            </a>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
          >
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </motion.div>
        )}

        {/* Form */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg border border-slate-200 dark:border-slate-700">
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
                rows={20}
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
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAddImage()
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={handleAddImage}
                  className="px-4 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
                >
                  Add
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

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-slate-200 dark:border-slate-700">
              <button
                onClick={handleSubmit}
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Changes
                  </>
                )}
              </button>

              <Link href="/admin/adventures" className="flex-1">
                <button className="w-full px-6 py-3 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
                  Cancel
                </button>
              </Link>

              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-5 h-5" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Metadata Info */}
        <div className="mt-6 bg-slate-100 dark:bg-slate-800 rounded-lg p-4 text-sm text-slate-600 dark:text-slate-400">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>Created: {formData.date}</span>
            </div>
            {formData.location && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span>{formData.location}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              <span>{formData.images.length} image{formData.images.length !== 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}