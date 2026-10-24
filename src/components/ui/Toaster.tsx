import { useState, useCallback } from 'react'
import { X, CheckCircle, AlertCircle, AlertTriangle } from 'lucide-react'
import { cn } from '../../lib/utils'

interface Toast {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message?: string
  duration?: number
}

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const add = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).slice(2, 9)
    const newToast = { ...toast, id }
    setToasts(prev => [...prev, newToast])
    if (toast.duration !== 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id))
      }, toast.duration ?? 5000)
    }
    return id
  }, [])

  const remove = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  return {
    toasts,
    success: (title: string, message?: string) => add({ type: 'success', title, message }),
    error: (title: string, message?: string) => add({ type: 'error', title, message }),
    warning: (title: string, message?: string) => add({ type: 'warning', title, message }),
    info: (title: string, message?: string) => add({ type: 'info', title, message }),
    remove,
  }
}

export function Toaster({ position = 'bottom-right' }: { position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' }) {
  const { toasts, remove } = useToast()

  const positions = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
  }

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <AlertCircle className="w-5 h-5 text-red-500" />,
    warning: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
    info: <AlertCircle className="w-5 h-5 text-blue-500" />,
  }

  const bgColors = {
    success: 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800',
    error: 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800',
    warning: 'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800',
    info: 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800',
  }

  if (toasts.length === 0) return null

  return (
    <div className={cn('fixed z-50 flex flex-col gap-3', positions[position])} role="region" aria-label="Notifications">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            'flex items-start gap-3 p-4 rounded-xl border shadow-lg min-w-[300px] max-w-md animate-slide-in',
            bgColors[toast.type]
          )}
          role="alert"
        >
          {icons[toast.type]}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 dark:text-white">{toast.title}</p>
            {toast.message && (
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{toast.message}</p>
            )}
          </div>
          <button
            onClick={() => remove(toast.id)}
            className="p-1 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors flex-shrink-0"
            aria-label="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  )
}