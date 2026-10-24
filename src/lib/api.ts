import axios, { AxiosError } from 'axios'
import type { ResumeAnalysis, UploadProgress, ApiResponse, JobMatch } from './types'

const API_BASE = import.meta.env.VITE_API_URL || '/api'

const api = axios.create({
  baseURL: API_BASE,
  timeout: 120000,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
})

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiResponse<unknown>>) => {
    const message = error.response?.data?.error || error.message || 'An error occurred'
    return Promise.reject(new Error(message))
  }
)

export const resumeApi = {
  async uploadResume(file: File, onProgress?: (progress: UploadProgress) => void): Promise<ResumeAnalysis> {
    const formData = new FormData()
    formData.append('resume', file)

    // Simulate progress stages
    const stages: UploadProgress[] = [
      { stage: 'uploading', progress: 20, message: 'Uploading resume...' },
      { stage: 'parsing', progress: 40, message: 'Parsing document...' },
      { stage: 'analyzing', progress: 70, message: 'Analyzing with AI...' },
      { stage: 'matching', progress: 90, message: 'Finding job matches...' },
    ]

    for (const stage of stages) {
      onProgress?.(stage)
      await new Promise(resolve => setTimeout(resolve, 800))
    }

    const response = await api.post<ApiResponse<ResumeAnalysis>>('/analyze', formData, {
      onUploadProgress: (progressEvent) => {
        if (progressEvent.total) {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          onProgress?.({ stage: 'uploading', progress: Math.min(percent, 20), message: 'Uploading resume...' })
        }
      },
    })

    onProgress?.({ stage: 'complete', progress: 100, message: 'Analysis complete!' })
    return response.data.data!
  },

  async getAnalysis(id: string): Promise<ResumeAnalysis> {
    const response = await api.get<ApiResponse<ResumeAnalysis>>(`/analysis/${id}`)
    return response.data.data!
  },

  async getJobMatches(analysisId: string): Promise<JobMatch[]> {
    const response = await api.get<ApiResponse<JobMatch[]>>(`/analysis/${analysisId}/jobs`)
    return response.data.data!
  },
}