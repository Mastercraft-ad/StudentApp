import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/services/api'

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

const DEFAULT_FILTERS: ContentFilters = {
  searchQuery: '',
  selectedType: 'all',
  sortBy: 'recent',
}

export function useContentLibrary() {
  const queryClient = useQueryClient()
  const [filters, setFilters] = useState<ContentFilters>(DEFAULT_FILTERS)
  
  // Fetch contents from API
  const { data: allContents = [], isLoading, error } = useQuery({
    queryKey: ['contents'],
    queryFn: async () => {
      try {
        const response = await apiClient.getContents()
        return response.data || []
      } catch (error) {
        console.warn('Failed to fetch contents, using empty array:', error)
        return []
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 1,
  })

  // Upload content mutation
  const uploadContentMutation = useMutation({
    mutationFn: async (data: { title: string; type: string; course_id: number; file: File; description?: string }) => {
      return await apiClient.uploadContent({
        title: data.title,
        type: data.type as any,
        course_id: data.course_id,
        file: data.file,
        description: data.description,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contents'] })
    },
  })

  // Rate content mutation
  const rateContentMutation = useMutation({
    mutationFn: async ({ id, rating, feedback }: { id: number; rating: number; feedback?: string }) => {
      return await apiClient.rateContent(id, rating, feedback)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contents'] })
    },
  })

  const addContent = (contentData: { title: string; type: string; course: string; file?: File; description?: string }) => {
    if (!contentData.file) {
      console.error('File is required for content upload')
      return
    }
    
    uploadContentMutation.mutate({
      title: contentData.title,
      type: contentData.type,
      course_id: 1, // TODO: Get actual course ID
      file: contentData.file,
      description: contentData.description,
    })
  }

  const updateContent = (id: string, updates: Partial<Content>) => {
    // For now, optimistically update - in real app, you'd have update endpoints
    const updatedContents = allContents.map(content => 
      content.id === id ? { ...content, ...updates } : content
    )
    queryClient.setQueryData(['contents'], updatedContents)
  }

  const deleteContent = (id: string) => {
    // Optimistically remove - in real app, you'd have delete endpoint
    const updatedContents = allContents.filter(content => content.id !== id)
    queryClient.setQueryData(['contents'], updatedContents)
  }

  const incrementDownloads = (id: string) => {
    const content = allContents.find(c => c.id === id)
    if (content) {
      updateContent(id, { downloads: content.downloads + 1 })
    }
  }

  const addRating = (id: string, newRating: number) => {
    const numId = parseInt(id)
    if (!isNaN(numId)) {
      rateContentMutation.mutate({ id: numId, rating: newRating })
    }
  }

  const getFilteredContents = () => {
    let filtered = allContents

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
    allContents,
    filters,
    isLoading,
    addContent,
    updateContent,
    deleteContent,
    incrementDownloads,
    addRating,
    updateFilters,
    resetFilters,
    uploadContentMutation,
  }
}