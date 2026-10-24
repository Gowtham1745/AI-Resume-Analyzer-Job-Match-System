import { useState, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Upload, FileText, CheckCircle, AlertCircle, X, Brain, ArrowRight, Briefcase } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card, CardContent } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { Progress } from '../components/ui/Progress'
import { Spinner } from '../components/ui/Spinner'
import { useToast } from '../hooks/useToast'
import { cn } from '../lib/utils'
import { resumeApi } from '../lib/api'
import type { UploadProgress } from '../lib/types'

export function AnalyzerPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const validateFile = useCallback((file: File): boolean => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ]
    const maxSize = 10 * 1024 * 1024 // 10MB

    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a PDF, DOC, or DOCX file')
      return false
    }

    if (file.size > maxSize) {
      setError('File size must be less than 10MB')
      return false
    }

    setError(null)
    return true
  }, [])

  const handleFileSelect = useCallback((file: File) => {
    if (validateFile(file)) {
      setSelectedFile(file)
      setError(null)
    }
  }, [validateFile])

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }, [handleFileSelect])

  const removeFile = useCallback(() => {
    setSelectedFile(null)
    setUploadProgress(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [])

  const handleAnalyze = async () => {
    if (!selectedFile) return

    setIsProcessing(true)
    setError(null)

    try {
      const analysis = await resumeApi.uploadResume(selectedFile, setUploadProgress)
      toast.success('Analysis Complete!', 'Your resume has been analyzed successfully.')
      navigate(`/results/${analysis.id}`)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Analysis failed. Please try again.'
      setError(message)
      toast.error('Analysis Failed', message)
    } finally {
      setIsProcessing(false)
      setUploadProgress(null)
    }
  }

  const stages = [
    { key: 'uploading', label: 'Uploading', icon: Upload },
    { key: 'parsing', label: 'Parsing', icon: FileText },
    { key: 'analyzing', label: 'Analyzing', icon: Brain },
    { key: 'matching', label: 'Matching', icon: ArrowRight },
  ]

  return (
    <div className="pt-16 pb-8 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <Badge variant="primary" className="mb-4 inline-flex items-center gap-2">
            <Brain className="w-4 h-4" />
            AI Resume Analysis
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Upload Your Resume
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Get instant AI-powered analysis with ATS scoring, keyword optimization, and job matches
          </p>
        </div>

        {/* Upload Zone */}
        <Card className="mb-8">
          <CardContent className="p-8">
            {!selectedFile ? (
              <div
                className={cn(
                  'relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-200',
                  'cursor-pointer',
                  dragActive
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600'
                )}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  id="resume-upload"
                  disabled={isProcessing}
                />
                <label htmlFor="resume-upload" className="cursor-pointer">
                  <div className="w-16 h-16 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mx-auto mb-6">
                    <Upload className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Drag & drop your resume here
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    or click to browse
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    Supports PDF, DOC, DOCX · Max 10MB
                  </p>
                </label>
              </div>
            ) : (
              <div className="space-y-6">
                {/* File Info */}
                <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <div className="w-14 h-14 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-7 h-7 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <h4 className="font-semibold text-gray-900 dark:text-white truncate">{selectedFile.name}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB · {selectedFile.type}
                    </p>
                  </div>
                  <button
                    onClick={removeFile}
                    className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    aria-label="Remove file"
                    disabled={isProcessing}
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Progress Stages */}
                <div className="space-y-3">
                  {stages.map((stage, index) => {
                    const isActive = uploadProgress?.stage === stage.key
                    const isComplete = uploadProgress && stages.findIndex(s => s.key === uploadProgress.stage) > index

                    return (
                      <div key={stage.key} className="flex items-center gap-3">
                        <div className={cn(
                          'w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all',
                          isComplete ? 'bg-green-500 text-white' :
                          isActive ? 'bg-primary-500 text-white animate-pulse' :
                          'bg-gray-100 dark:bg-gray-800 text-gray-400'
                        )}>
                          {isComplete ? <CheckCircle className="w-5 h-5" /> : <stage.icon className="w-5 h-5" />}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between text-sm mb-1">
                            <span className={cn(
                              'font-medium',
                              isComplete ? 'text-green-600 dark:text-green-400' :
                              isActive ? 'text-primary-600 dark:text-primary-400' :
                              'text-gray-600 dark:text-gray-400'
                            )}>
                              {stage.label}
                            </span>
                            {isActive && uploadProgress && (
                              <span className="text-gray-500 dark:text-gray-400">{uploadProgress.progress}%</span>
                            )}
                          </div>
                          <Progress value={isComplete ? 100 : isActive ? uploadProgress?.progress || 0 : 0} size="sm" />
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Error Message */}
                {error && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <p className="text-red-700 dark:text-red-300 text-sm">{error}</p>
                  </div>
                )}

                {/* Analyze Button */}
                <Button
                  className="w-full"
                  size="lg"
                  onClick={handleAnalyze}
                  disabled={isProcessing}
                  isLoading={isProcessing}
                  leftIcon={<Brain className="w-5 h-5" />}
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                >
                  {isProcessing ? 'Analyzing...' : 'Analyze Resume'}
                </Button>

                <p className="text-center text-xs text-gray-500 dark:text-gray-500">
                  By uploading, you agree to our <a href="#" className="text-primary-600 hover:underline">Privacy Policy</a> and <a href="#" className="text-primary-600 hover:underline">Terms of Service</a>
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Features Preview */}
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { icon: CheckCircle, title: 'ATS Compatibility', desc: 'Check if your resume passes ATS filters' },
            { icon: Brain, title: 'Keyword Analysis', desc: 'Find missing keywords for your target roles' },
            { icon: Briefcase, title: 'Job Matches', desc: 'Get personalized job recommendations' },
          ].map((item, index) => (
            <Card key={index} className="text-center">
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">{item.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-400">{item.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}