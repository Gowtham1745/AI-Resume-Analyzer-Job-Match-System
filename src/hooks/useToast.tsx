import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
}

interface ToastContextType {
  toasts: Toast[]
  success: (title: string, message?: string) => void
  error: (title: string, message?: string) => void
  warning: (title: string, message?: string) => void
  info: (title: string, message?: string) => void
  remove: (id: string) => void
}

const ToastContext = createContext<ToastContextType | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const addToast = useCallback((type: Toast['type'], title: string, message?: string) => {
    const id = Math.random().toString(36).slice(2, 9)
    const toast: Toast = { id, type, title, message }
    setToasts(prev => [...prev, toast])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, 5000)
  }, [])

  const remove = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const success = useCallback((title: string, message?: string) => {
    addToast('success', title, message)
  }, [addToast])

  const error = useCallback((title: string, message?: string) => {
    addToast('error', title, message)
  }, [addToast])

  const warning = useCallback((title: string, message?: string) => {
    addToast('warning', title, message)
  }, [addToast])

  const info = useCallback((title: string, message?: string) => {
    addToast('info', title, message)
  }, [addToast])

  const value: ToastContextType = {
    toasts,
    success,
    error,
    warning,
    info,
    remove,
  }

  return (
    <ToastContext.Provider value={value}>
      {children}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  return context
}