import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, Filter, Briefcase, MapPin, DollarSign, 
  Clock, X, ExternalLink, Star, 
  Building2, Globe, Home
} from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card, CardContent } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Progress } from '../components/ui/Progress'
import { Spinner } from '../components/ui/Spinner'
import { useToast } from '../hooks/useToast'
import { cn, formatDate } from '../lib/utils'
import { resumeApi } from '../lib/api'
import type { JobMatch } from '../lib/types'

export function JobMatchesPage() {
  const { analysisId } = useParams<{ analysisId: string }>()
  const navigate = useNavigate()
  const toast = useToast()

  const [jobs, setJobs] = useState<JobMatch[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState({
    type: 'all' as 'all' | 'full-time' | 'part-time' | 'contract' | 'remote',
    location: '',
    minMatch: 0,
    sortBy: 'match' as 'match' | 'date' | 'salary',
  })

  useEffect(() => {
    if (!analysisId) return

    const fetchJobs = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await resumeApi.getJobMatches(analysisId)
        setJobs(data)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load job matches'
        setError(message)
        toast.error('Error', message)
      } finally {
        setLoading(false)
      }
    }

    fetchJobs()
  }, [analysisId, toast])

  const filteredJobs = jobs.filter(job => {
    if (filters.type !== 'all' && job.type !== filters.type) return false
    if (filters.location && !job.location.toLowerCase().includes(filters.location.toLowerCase())) return false
    if (job.matchScore < filters.minMatch) return false
    return true
  }).sort((a, b) => {
    switch (filters.sortBy) {
      case 'match': return b.matchScore - a.matchScore
      case 'date': return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()
      case 'salary': return (b.salaryRange ? parseInt(b.salaryRange.replace(/\D/g, '')) : 0) - (a.salaryRange ? parseInt(a.salaryRange.replace(/\D/g, '')) : 0)
      default: return 0
    }
  })

  const typeOptions = [
    { value: 'all', label: 'All Types', icon: Briefcase },
    { value: 'full-time', label: 'Full-time', icon: Building2 },
    { value: 'remote', label: 'Remote', icon: Globe },
    { value: 'contract', label: 'Contract', icon: Clock },
    { value: 'part-time', label: 'Part-time', icon: Home },
  ]

  const sortOptions = [
    { value: 'match', label: 'Match Score' },
    { value: 'date', label: 'Date Posted' },
    { value: 'salary', label: 'Salary' },
  ]

  const handleFilterChange = (key: keyof typeof filters, value: string | number) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const clearFilters = () => {
    setFilters({
      type: 'all',
      location: '',
      minMatch: 0,
      sortBy: 'match',
    })
  }

  if (loading) {
    return (
      <div className="pt-16 pb-8 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Spinner size="xl" className="mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Finding your perfect job matches...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="pt-16 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto text-center">
          <Card>
            <CardContent className="p-8">
              <X className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Failed to Load Jobs</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
              <Button onClick={() => navigate(`/results/${analysisId}`)} leftIcon={<ArrowLeft className="w-4 h-4" />}>
                Back to Results
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-16 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate(`/results/${analysisId}`)} leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Back to Analysis
            </Button>
            <div>
              <Badge variant="primary" className="mb-2 inline-flex items-center gap-1">
                <Briefcase className="w-3 h-3" />
                Job Matches
              </Badge>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                {filteredJobs.length} Job Matches Found
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Based on your resume analysis
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={clearFilters} leftIcon={<Filter className="w-4 h-4" />}>
              Clear Filters
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              {/* Job Type Filter */}
              <div className="flex items-center gap-2 flex-wrap">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  value={filters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {typeOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Location Filter */}
              <div className="relative flex-1 sm:w-64">
                <input
                  type="text"
                  placeholder="Filter by location..."
                  value={filters.location}
                  onChange={(e) => handleFilterChange('location', e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>

              {/* Min Match Score */}
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500" />
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={filters.minMatch}
                  onChange={(e) => handleFilterChange('minMatch', parseInt(e.target.value))}
                  className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none accent-primary-500"
                />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300 w-12 text-right">
                  {filters.minMatch}%
                </span>
              </div>

              {/* Sort By */}
              <div className="flex items-center gap-2">
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  {sortOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Job Results */}
        {filteredJobs.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Briefcase className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Matches Found</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Try adjusting your filters or analyze a different resume to find more matches.
              </p>
              <Button onClick={clearFilters} leftIcon={<Filter className="w-4 h-4" />}>
                Clear All Filters
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function JobCard({ job }: { job: JobMatch }) {
  const getTypeIcon = (type: JobMatch['type']) => {
    switch (type) {
      case 'remote': return <Globe className="w-3.5 h-3.5" />
      case 'full-time': return <Building2 className="w-3.5 h-3.5" />
      case 'contract': return <Clock className="w-3.5 h-3.5" />
      case 'part-time': return <Home className="w-3.5 h-3.5" />
    }
  }

  const getTypeColor = (type: JobMatch['type']) => {
    switch (type) {
      case 'remote': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
      case 'full-time': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
      case 'contract': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
      case 'part-time': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300'
    }
  }

  return (
    <Card hover className="flex flex-col h-full">
      <CardContent className="p-5 flex-1 flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <Badge variant={job.matchScore >= 80 ? 'success' : job.matchScore >= 60 ? 'warning' : 'info'} size="sm">
            {job.matchScore}% Match
          </Badge>
          <Badge variant="secondary" size="sm" className={cn('flex items-center gap-1', getTypeColor(job.type))}>
            {getTypeIcon(job.type)}
            {job.type.charAt(0).toUpperCase() + job.type.slice(1)}
          </Badge>
        </div>

        {/* Job Info */}
        <h3 className="font-semibold text-gray-900 dark:text-white text-lg mb-1 line-clamp-1">{job.title}</h3>
        <p className="text-primary-600 dark:text-primary-400 font-medium mb-1">{job.company}</p>
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
          <MapPin className="w-3.5 h-3.5" />
          <span className="truncate">{job.location}</span>
        </div>

        {/* Salary */}
        {job.salaryRange && (
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-3">
            <DollarSign className="w-3.5 h-3.5" />
            <span>{job.salaryRange}</span>
          </div>
        )}

        {/* Posted Date */}
        <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 mb-4">
          <Clock className="w-3.5 h-3.5" />
          <span>Posted {formatDate(job.postedDate)}</span>
        </div>

        {/* Skills Match */}
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-500 dark:text-gray-400">Skills Match</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {job.matchedSkills.length} / {job.requiredSkills.length}
            </span>
          </div>
          <Progress value={job.matchedSkills.length} max={job.requiredSkills.length} size="sm" />
        </div>

        {/* Matched Skills */}
        {job.matchedSkills.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-medium text-green-600 dark:text-green-400 mb-2">Matched Skills:</p>
            <div className="flex flex-wrap gap-1">
              {job.matchedSkills.slice(0, 6).map((skill) => (
                <Badge key={skill} variant="success" size="sm" dot>{skill}</Badge>
              ))}
              {job.matchedSkills.length > 6 && (
                <Badge variant="secondary" size="sm">+{job.matchedSkills.length - 6}</Badge>
              )}
            </div>
          </div>
        )}

        {/* Missing Skills */}
        {job.missingSkills.length > 0 && (
          <div className="mb-4">
            <p className="text-xs font-medium text-yellow-600 dark:text-yellow-400 mb-2">Missing Skills:</p>
            <div className="flex flex-wrap gap-1">
              {job.missingSkills.slice(0, 4).map((skill) => (
                <Badge key={skill} variant="warning" size="sm" dot>{skill}</Badge>
              ))}
              {job.missingSkills.length > 4 && (
                <Badge variant="secondary" size="sm">+{job.missingSkills.length - 4}</Badge>
              )}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-800 flex gap-2">
          <Button variant="outline" className="flex-1" leftIcon={<ExternalLink className="w-4 h-4" />}>
            View Details
          </Button>
          {job.applyUrl && (
            <Button className="flex-1" leftIcon={<ExternalLink className="w-4 h-4" />}>
              Apply Now
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}