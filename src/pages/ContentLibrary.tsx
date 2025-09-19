import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useContentLibrary } from '@/hooks/useContentLibrary'
import { 
  Upload, 
  Search, 
  Filter, 
  Download, 
  Star, 
  FileText, 
  Video, 
  BookOpen,
  File,
  Plus,
  Grid,
  List,
  SortAsc,
  Eye,
  Trash2,
  FolderOpen
} from 'lucide-react'

const contentTypes = [
  { id: 'all', label: 'All Content', icon: FileText },
  { id: 'notes', label: 'Study Notes', icon: BookOpen },
  { id: 'past-exams', label: 'Past Exams', icon: FileText },
  { id: 'questions', label: 'Practice Questions', icon: File },
  { id: 'video', label: 'Video Lectures', icon: Video },
  { id: 'document', label: 'Documents', icon: File },
]


export default function ContentLibrary() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploadData, setUploadData] = useState({ 
    title: '', 
    course: '', 
    type: 'notes', 
    file: null as File | null 
  })
  
  const { 
    contents, 
    filters, 
    isLoading, 
    updateFilters, 
    addContent, 
    incrementDownloads,
    uploadContentMutation
  } = useContentLibrary()

  const handleUpload = () => {
    if (uploadData.title && uploadData.course && uploadData.file) {
      addContent({
        title: uploadData.title,
        type: uploadData.type,
        course: uploadData.course,
        file: uploadData.file
      })
      setShowUploadModal(false)
      setUploadData({ title: '', course: '', type: 'notes', file: null })
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setUploadData(prev => ({ ...prev, file }))
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="text-lg font-medium">Loading content library...</div>
        </div>
      </div>
    )
  }

  const getTypeIcon = (type: string) => {
    const typeConfig = contentTypes.find(t => t.id === type)
    return typeConfig?.icon || FileText
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-dark-navy">Content Library</h1>
          <p className="text-muted-foreground">Access and share study materials with your peers</p>
        </div>
        <Button onClick={() => setShowUploadModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Upload Content
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title, course, or topic..."
                value={filters.searchQuery}
                onChange={(e) => updateFilters({ searchQuery: e.target.value })}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <Button variant="outline" size="sm">
                <SortAsc className="h-4 w-4 mr-2" />
                Sort
              </Button>
              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Content Type Filters */}
          <div className="flex flex-wrap gap-2 mt-4">
            {contentTypes.map((type) => {
              const Icon = type.icon
              return (
                <Button
                  key={type.id}
                  variant={filters.selectedType === type.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => updateFilters({ selectedType: type.id })}
                  className="flex items-center space-x-2"
                >
                  <Icon className="h-4 w-4" />
                  <span>{type.label}</span>
                </Button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Content Grid/List */}
      {contents.length === 0 ? (
        <Card>
          <CardContent className="p-12 text-center">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="font-medium mb-2">No content found</h3>
            <p className="text-sm text-muted-foreground mb-4">
              {filters.searchQuery ? 'No content matches your search criteria.' : 'Be the first to upload study materials!'}
            </p>
            <Button onClick={() => setShowUploadModal(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Upload First Content
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
          {contents.map((item) => {
            const TypeIcon = getTypeIcon(item.type)
            const formatDate = (dateString: string) => {
              const date = new Date(dateString)
              return date.toLocaleDateString()
            }
            
            return (
              <Card key={item.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-2">
                      <TypeIcon className="h-5 w-5 text-primary-green" />
                      {item.is_verified && (
                        <div className="w-2 h-2 bg-primary-green rounded-full" title="Verified Content" />
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">{formatDate(item.created_at)}</div>
                  </div>
                  <CardTitle className="text-lg leading-tight">{item.title}</CardTitle>
                  <CardDescription>
                    <div className="flex items-center justify-between">
                      <span>{item.course?.name || 'Unknown Course'}</span>
                      <span className="text-xs">
                        {item.file_size ? `${Math.round(item.file_size / 1024)} KB` : 'N/A'}
                      </span>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">
                        by {item.uploader?.name || 'Unknown'}
                      </span>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{item.average_rating.toFixed(1)}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Download className="h-4 w-4" />
                        <span>{item.downloads_count} downloads</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" className="flex-1">
                        <Eye className="h-4 w-4 mr-2" />
                        Preview
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="flex-1"
                        onClick={() => incrementDownloads(item.id.toString())}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Upload Modal Placeholder */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Upload Content</CardTitle>
              <CardDescription>Share your study materials with the community</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <Input placeholder="Enter content title" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Course</label>
                <Input placeholder="e.g., MATH 101, CS 201" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">File</label>
                <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Drag and drop your file here, or click to browse
                  </p>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={() => setShowUploadModal(false)} variant="outline" className="flex-1">
                  Cancel
                </Button>
                <Button className="flex-1">Upload</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}