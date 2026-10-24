export interface ResumeAnalysis {
  id: string
  fileName: string
  uploadedAt: string
  overallScore: number
  sections: SectionScore[]
  keywords: KeywordAnalysis
  suggestions: Suggestion[]
  matchedJobs: JobMatch[]
  parsedData: ParsedResumeData
}

export interface SectionScore {
  name: string
  score: number
  maxScore: number
  feedback: string
  details: string[]
}

export interface KeywordAnalysis {
  found: string[]
  missing: string[]
  density: Record<string, number>
}

export interface Suggestion {
  type: 'critical' | 'important' | 'optional'
  category: string
  title: string
  description: string
  example?: string
}

export interface JobMatch {
  id: string
  title: string
  company: string
  location: string
  type: 'full-time' | 'part-time' | 'contract' | 'remote'
  salaryRange?: string
  matchScore: number
  requiredSkills: string[]
  matchedSkills: string[]
  missingSkills: string[]
  description: string
  postedDate: string
  applyUrl?: string
}

export interface ParsedResumeData {
  personalInfo: PersonalInfo
  experience: Experience[]
  education: Education[]
  skills: string[]
  certifications: Certification[]
  projects: Project[]
  summary?: string
}

export interface PersonalInfo {
  name?: string
  email?: string
  phone?: string
  location?: string
  linkedin?: string
  github?: string
  portfolio?: string
}

export interface Experience {
  id: string
  title: string
  company: string
  location?: string
  startDate: string
  endDate?: string
  current: boolean
  description: string[]
  skills: string[]
}

export interface Education {
  id: string
  degree: string
  institution: string
  location?: string
  graduationDate?: string
  gpa?: string
  honors?: string[]
}

export interface Certification {
  id: string
  name: string
  issuer: string
  date: string
  expiryDate?: string
  credentialId?: string
  url?: string
}

export interface Project {
  id: string
  name: string
  description: string
  technologies: string[]
  url?: string
  startDate?: string
  endDate?: string
}

export interface UploadProgress {
  stage: 'uploading' | 'parsing' | 'analyzing' | 'matching' | 'complete' | 'error'
  progress: number
  message: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}