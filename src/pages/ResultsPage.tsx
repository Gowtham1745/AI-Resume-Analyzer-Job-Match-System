import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { 
  ArrowLeft, Download, RefreshCw, CheckCircle, AlertCircle, 
  Target, Lightbulb, FileText, Briefcase, 
  Star, Award, Brain, Search, X 
} from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Progress, CircularProgress } from '../components/ui/Progress'
import { Spinner } from '../components/ui/Spinner'
import { useToast } from '../hooks/useToast'
import { cn, formatDate, getScoreColor, getScoreBg } from '../lib/utils'
import { resumeApi } from '../lib/api'
import type { ResumeAnalysis } from '../lib/types'

export function ResultsPage() {
  const { analysisId } = useParams<{ analysisId: string }>()
  const navigate = useNavigate()
  const toast = useToast()

  const [analysis, setAnalysis] = useState<ResumeAnalysis | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'sections' | 'keywords' | 'suggestions'>('overview')
  const [expandedSuggestions, setExpandedSuggestions] = useState<string[]>([])

  useEffect(() => {
    if (!analysisId) return

    const fetchAnalysis = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await resumeApi.getAnalysis(analysisId)
        setAnalysis(data)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to load analysis'
        setError(message)
        toast.error('Error', message)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalysis()
  }, [analysisId, toast])

  const handleReanalyze = () => {
    navigate('/analyze')
  }

  const handleDownloadReport = () => {
    if (!analysis) return
    const report = generateReport(analysis)
    const blob = new Blob([report], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `resume-analysis-${analysis.fileName.replace(/\.[^/.]+$/, '')}-${analysis.id}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('Report Downloaded', 'Your analysis report has been downloaded.')
  }

  const toggleSuggestion = (id: string) => {
    setExpandedSuggestions(prev => 
      prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
    )
  }

  if (loading) {
    return (
      <div className="pt-16 pb-8 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Spinner size="xl" className="mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading your analysis...</p>
        </div>
      </div>
    )
  }

  if (error || !analysis) {
    return (
      <div className="pt-16 pb-8 px-4 sm:px-6 lg:px-8 min-h-screen">
        <div className="max-w-md mx-auto text-center">
          <Card>
            <CardContent className="p-8">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Unable to Load Analysis</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">{error || 'Analysis not found'}</p>
              <div className="flex gap-3 justify-center">
                <Button onClick={handleReanalyze} leftIcon={<RefreshCw className="w-4 h-4" />}>
                  Try Again
                </Button>
                <Button variant="outline" onClick={() => navigate('/analyze')} leftIcon={<ArrowLeft className="w-4 h-4" />}>
                  New Analysis
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: FileText },
    { id: 'sections', label: 'Sections', icon: Target },
    { id: 'keywords', label: 'Keywords', icon: Search },
    { id: 'suggestions', label: 'Suggestions', icon: Lightbulb },
  ] as const

  return (
    <div className="pt-16 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" onClick={() => navigate('/analyze')} leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Back to Analyzer
            </Button>
            <div>
              <Badge variant="primary" className="mb-2 inline-flex items-center gap-1">
                <Brain className="w-3 h-3" />
                AI Analysis Complete
              </Badge>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                {analysis.fileName}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Analyzed on {formatDate(analysis.uploadedAt)}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleDownloadReport} leftIcon={<Download className="w-4 h-4" />}>
              Download Report
            </Button>
            <Link to={`/jobs/${analysis.id}`}>
              <Button leftIcon={<Briefcase className="w-4 h-4" />}>
                View Job Matches
              </Button>
            </Link>
          </div>
        </div>

        {/* Overall Score */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
              <div className="flex items-center gap-8">
                <CircularProgress 
                  value={analysis.overallScore} 
                  size={140} 
                  strokeWidth={10}
                  variant={analysis.overallScore >= 80 ? 'success' : analysis.overallScore >= 60 ? 'warning' : 'danger'}
                />
                <div>
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Overall Score: <span className={getScoreColor(analysis.overallScore)}>{analysis.overallScore}/100</span>
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">
                    {analysis.overallScore >= 80 
                      ? 'Excellent! Your resume is well-optimized for ATS and recruiters.'
                      : analysis.overallScore >= 60 
                        ? 'Good foundation. Some improvements will significantly boost your chances.'
                        : 'Needs improvement. Focus on the suggestions below to optimize your resume.'}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-6 text-center md:ml-8">
                <div>
                  <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">{analysis.sections.length}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Sections Analyzed</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-accent-600 dark:text-accent-400">{analysis.keywords.missing.length}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Missing Keywords</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400">{analysis.matchedJobs.length}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Job Matches</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="flex gap-1 overflow-x-auto" role="tablist">
              {tabs.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    role="tab"
                    aria-selected={isActive}
                    aria-controls={`panel-${tab.id}`}
                    id={`tab-${tab.id}`}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      'flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-t-xl transition-all',
                      isActive
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300 border-b-2 border-primary-500'
                        : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Tab Panels */}
        <div role="tabpanel" id={`panel-${activeTab}`} aria-labelledby={`tab-${activeTab}`}>
          {activeTab === 'overview' && <OverviewPanel analysis={analysis} />}
          {activeTab === 'sections' && <SectionsPanel analysis={analysis} />}
          {activeTab === 'keywords' && <KeywordsPanel analysis={analysis} />}
          {activeTab === 'suggestions' && <SuggestionsPanel analysis={analysis} expanded={expandedSuggestions} onToggle={toggleSuggestion} />}
        </div>
      </div>
    </div>
  )
}

function OverviewPanel({ analysis }: { analysis: ResumeAnalysis }) {
  const { parsedData } = analysis

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Experience', value: parsedData.experience?.length || 0, icon: Briefcase, color: 'primary' },
          { label: 'Education', value: parsedData.education?.length || 0, icon: Award, color: 'accent' },
          { label: 'Skills', value: parsedData.skills?.length || 0, icon: Star, color: 'success' },
          { label: 'Projects', value: parsedData.projects?.length || 0, icon: Lightbulb, color: 'warning' },
        ].map((stat, index) => (
          <Card key={index} hover>
            <CardContent className="p-5 text-center">
              <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mx-auto mb-2">
                <stat.icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Parsed Data Sections */}
      <div className="grid lg:grid-cols-2 gap-6">
        {parsedData.experience?.length && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-primary-600" />
                Experience ({parsedData.experience.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {parsedData.experience.slice(0, 3).map((exp, index) => (
                  <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h5 className="font-semibold text-gray-900 dark:text-white">{exp.title}</h5>
                        <p className="text-primary-600 dark:text-primary-400 text-sm">{exp.company}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate || '')}
                          {exp.location && ` · ${exp.location}`}
                        </p>
                      </div>
                    </div>
                    {exp.skills.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {exp.skills.slice(0, 5).map((skill) => (
                          <Badge key={skill} variant="secondary" size="sm">{skill}</Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
                {parsedData.experience.length > 3 && (
                  <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-2">
                    +{parsedData.experience.length - 3} more experiences
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {parsedData.education?.length && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-accent-600" />
                Education ({parsedData.education.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {parsedData.education.map((edu, index) => (
                  <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <h5 className="font-semibold text-gray-900 dark:text-white">{edu.degree}</h5>
                    <p className="text-accent-600 dark:text-accent-400 text-sm">{edu.institution}</p>
                    {edu.graduationDate && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(edu.graduationDate)}</p>
                    )}
                    {edu.gpa && (
                      <Badge variant="success" size="sm" className="mt-1">GPA: {edu.gpa}</Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {parsedData.skills?.length && (
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-600" />
                Skills ({parsedData.skills.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {parsedData.skills.slice(0, 20).map((skill) => (
                  <Badge key={skill} variant="primary" size="sm">{skill}</Badge>
                ))}
                {parsedData.skills.length > 20 && (
                  <Badge variant="secondary" size="sm">+{parsedData.skills.length - 20} more</Badge>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {parsedData.projects?.length && (
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-warning-600" />
                Projects ({parsedData.projects.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {parsedData.projects.slice(0, 3).map((project, index) => (
                  <div key={index} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <h5 className="font-semibold text-gray-900 dark:text-white">{project.name}</h5>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{project.description}</p>
                    {project.technologies.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {project.technologies.slice(0, 5).map((tech) => (
                          <Badge key={tech} variant="secondary" size="sm">{tech}</Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {parsedData.certifications?.length && (
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="w-5 h-5 text-green-600" />
                Certifications ({parsedData.certifications.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {parsedData.certifications.map((cert, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{cert.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{cert.issuer} · {formatDate(cert.date)}</p>
                    </div>
                    {cert.url && (
                      <a href={cert.url} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline text-sm">
                        View Credential
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

function SectionsPanel({ analysis }: { analysis: ResumeAnalysis }) {
  return (
    <div className="space-y-4">
      {analysis.sections.map((section, index) => (
        <Card key={index}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{section.name}</h3>
                  <Badge 
                    variant={section.score >= 80 ? 'success' : section.score >= 60 ? 'warning' : 'danger'}
                    className={getScoreBg(section.score)}
                  >
                    {section.score}/{section.maxScore}
                  </Badge>
                </div>
                <Progress value={section.score} max={section.maxScore} showLabel size="lg" />
                <p className="mt-3 text-gray-600 dark:text-gray-400">{section.feedback}</p>
              </div>
              <CircularProgress 
                value={section.score} 
                max={section.maxScore} 
                size={80} 
                strokeWidth={6}
                variant={section.score >= 80 ? 'success' : section.score >= 60 ? 'warning' : 'danger'}
              />
            </div>
            {section.details.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Details:</h4>
                <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  {section.details.map((detail, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

function KeywordsPanel({ analysis }: { analysis: ResumeAnalysis }) {
  return (
    <div className="space-y-6">
      {/* Found Keywords */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <CheckCircle className="w-5 h-5 text-green-600" />
          Keywords Found ({analysis.keywords.found.length})
        </h3>
        <div className="flex flex-wrap gap-2">
          {analysis.keywords.found.slice(0, 30).map((keyword) => (
            <Badge key={keyword} variant="success" size="sm" dot>{keyword}</Badge>
          ))}
          {analysis.keywords.found.length > 30 && (
            <Badge variant="secondary" size="sm">+{analysis.keywords.found.length - 30} more</Badge>
          )}
        </div>
      </div>

      {/* Missing Keywords */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-yellow-600" />
          Missing Keywords ({analysis.keywords.missing.length})
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          Add these keywords to improve your ATS score and match more job descriptions:
        </p>
        <div className="flex flex-wrap gap-2">
          {analysis.keywords.missing.slice(0, 25).map((keyword) => (
            <Badge key={keyword} variant="warning" size="sm" dot>{keyword}</Badge>
          ))}
          {analysis.keywords.missing.length > 25 && (
            <Badge variant="secondary" size="sm">+{analysis.keywords.missing.length - 25} more</Badge>
          )}
        </div>
      </div>

      {/* Keyword Density */}
      {Object.keys(analysis.keywords.density).length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Search className="w-5 h-5 text-primary-600" />
            Keyword Density
          </h3>
          <div className="space-y-3">
            {Object.entries(analysis.keywords.density)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 10)
              .map(([keyword, density]) => (
                <div key={keyword}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-900 dark:text-white">{keyword}</span>
                    <span className="text-gray-500 dark:text-gray-400">{(density * 100).toFixed(1)}%</span>
                  </div>
                  <Progress value={density * 100} max={100} size="sm" variant="default" />
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}

function SuggestionsPanel({ 
  analysis, 
  expanded, 
  onToggle 
}: { 
  analysis: ResumeAnalysis 
  expanded: string[]
  onToggle: (id: string) => void
}) {
  const groupedSuggestions = analysis.suggestions.reduce((acc, suggestion) => {
    if (!acc[suggestion.category]) acc[suggestion.category] = []
    acc[suggestion.category].push(suggestion)
    return acc
  }, {} as Record<string, typeof analysis.suggestions>)

  return (
    <div className="space-y-6">
      {Object.entries(groupedSuggestions).map(([category, suggestions]) => (
        <div key={category}>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Badge variant="primary" size="sm">{category}</Badge>
            <span className="text-gray-500 dark:text-gray-400">({suggestions.length} suggestions)</span>
          </h3>
          <div className="space-y-3">
            {suggestions.map((suggestion) => {
              const isExpanded = expanded.includes(suggestion.title)
              return (
                <Card key={suggestion.title} className="overflow-hidden">
                  <div 
                    className={cn('p-4 cursor-pointer transition-colors', isExpanded ? 'bg-gray-50 dark:bg-gray-800/50' : 'hover:bg-gray-50 dark:hover:bg-gray-800/50')}
                    onClick={() => onToggle(suggestion.title)}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <Badge 
                            variant={suggestion.type === 'critical' ? 'danger' : suggestion.type === 'important' ? 'warning' : 'info'}
                            size="sm"
                          >
                            {suggestion.type.charAt(0).toUpperCase() + suggestion.type.slice(1)}
                          </Badge>
                          <h4 className="font-semibold text-gray-900 dark:text-white">{suggestion.title}</h4>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400">{suggestion.description}</p>
                      </div>
                      <X className={cn('w-5 h-5 text-gray-400 transition-transform', isExpanded ? 'rotate-180' : '')} />
                    </div>
                  </div>
                  {isExpanded && (
                    <div className="px-4 pb-4 border-t border-gray-100 dark:border-gray-800 animate-slide-down">
                      {suggestion.example && (
                        <div className="p-4 bg-gray-100 dark:bg-gray-900 rounded-xl">
                          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Example:</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 font-mono whitespace-pre-wrap">{suggestion.example}</p>
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

function generateReport(analysis: ResumeAnalysis): string {
  const sectionScores = analysis.sections.map(s => `- **${s.name}**: ${s.score}/${s.maxScore} - ${s.feedback}`).join('\n')
  const suggestionsText = analysis.suggestions.map(s => `### ${s.title} (${s.type})\n${s.description}\n${s.example ? `**Example:** ${s.example}` : ''}`).join('\n\n')
  const jobsText = analysis.matchedJobs.map(j => `- **${j.title}** at ${j.company} (${j.matchScore}% match)`).join('\n')

  return `# Resume Analysis Report

**File:** ${analysis.fileName}
**Date:** ${formatDate(analysis.uploadedAt)}
**Analysis ID:** ${analysis.id}

## Overall Score: ${analysis.overallScore}/100

## Section Scores
${sectionScores}

## Keywords Found
${analysis.keywords.found.join(', ')}

## Missing Keywords
${analysis.keywords.missing.join(', ')}

## Suggestions
${suggestionsText}

## Matched Jobs
${jobsText}

---
*Generated by AI Resume Analyzer*`.trim()
}