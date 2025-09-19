import { useState, useEffect } from 'react'

export interface Content {
  id: string
  title: string
  type: 'notes' | 'past-exams' | 'questions' | 'video' | 'document'
  course: string
  uploader: string
  downloads: number
  rating: number
  size: string
  uploadedAt: Date
  verified: boolean
  description?: string
  file?: File
  tags?: string[]
}

export interface ContentFilters {
  searchQuery: string
  selectedType: string
  sortBy: 'recent' | 'popular' | 'rating'
}

const STORAGE_KEY = 'studentdrive_content_library'

const DEFAULT_FILTERS: ContentFilters = {
  searchQuery: '',
  selectedType: 'all',
  sortBy: 'recent',
}

export function useContentLibrary() {
  const [contents, setContents] = useState<Content[]>([])
  const [filters, setFilters] = useState<ContentFilters>(DEFAULT_FILTERS)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadContents()
  }, [])

  const loadContents = () => {
    try {
      const savedContents = localStorage.getItem(STORAGE_KEY)
      if (savedContents) {
        const parsed = JSON.parse(savedContents)
        setContents(parsed.map((content: any) => ({
          ...content,
          uploadedAt: new Date(content.uploadedAt)
        })))
      }
    } catch (error) {
      console.error('Error loading contents:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const saveContents = (newContents: Content[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newContents))
      setContents(newContents)
    } catch (error) {
      console.error('Error saving contents:', error)
    }
  }

  const addContent = (contentData: Omit<Content, 'id' | 'uploadedAt' | 'downloads' | 'rating'>) => {
    const newContent: Content = {
      ...contentData,
      id: Date.now().toString(),
      uploadedAt: new Date(),
      downloads: 0,
      rating: 0,
    }

    const updatedContents = [newContent, ...contents]
    saveContents(updatedContents)
  }

  const updateContent = (id: string, updates: Partial<Content>) => {
    const updatedContents = contents.map(content => 
      content.id === id ? { ...content, ...updates } : content
    )
    saveContents(updatedContents)
  }

  const deleteContent = (id: string) => {
    const updatedContents = contents.filter(content => content.id !== id)
    saveContents(updatedContents)
  }

  const incrementDownloads = (id: string) => {
    updateContent(id, { 
      downloads: contents.find(c => c.id === id)?.downloads + 1 || 1 
    })
  }

  const addRating = (id: string, newRating: number) => {
    const content = contents.find(c => c.id === id)
    if (!content) return

    // Simple average calculation
    const currentRating = content.rating || 0
    const averageRating = currentRating === 0 ? newRating : (currentRating + newRating) / 2
    
    updateContent(id, { rating: Math.round(averageRating * 10) / 10 })
  }

  const getFilteredContents = () => {
    let filtered = contents

    // Filter by search query
    if (filters.searchQuery) {
      filtered = filtered.filter(content =>
        content.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        content.course.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
        content.uploader.toLowerCase().includes(filters.searchQuery.toLowerCase())
      )
    }

    // Filter by type
    if (filters.selectedType !== 'all') {
      filtered = filtered.filter(content => content.type === filters.selectedType)
    }

    // Sort
    switch (filters.sortBy) {
      case 'popular':
        filtered.sort((a, b) => b.downloads - a.downloads)
        break
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating)
        break
      case 'recent':
      default:
        filtered.sort((a, b) => b.uploadedAt.getTime() - a.uploadedAt.getTime())
        break
    }

    return filtered
  }

  const updateFilters = (newFilters: Partial<ContentFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }))
  }

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS)
  }

  return {
    contents: getFilteredContents(),
    allContents: contents,
    filters,
    isLoading,
    addContent,
    updateContent,
    deleteContent,
    incrementDownloads,
    addRating,
    updateFilters,
    resetFilters,
  }
}