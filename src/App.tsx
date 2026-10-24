import { Routes, Route, Navigate } from 'react-router-dom'
import { ToastProvider } from './hooks/useToast'
import { Toaster } from './components/ui/Toaster'
import { Navbar } from './components/layout/Navbar'
import { Footer } from './components/layout/Footer'
import { LandingPage } from './pages/LandingPage'
import { AnalyzerPage } from './pages/AnalyzerPage'
import { ResultsPage } from './pages/ResultsPage'
import { JobMatchesPage } from './pages/JobMatchesPage'
import { AboutPage } from './pages/AboutPage'

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <ToastProvider>
      <Layout>
        <Toaster />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/analyze" element={<AnalyzerPage />} />
          <Route path="/results/:analysisId" element={<ResultsPage />} />
          <Route path="/jobs/:analysisId" element={<JobMatchesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </ToastProvider>
  )
}