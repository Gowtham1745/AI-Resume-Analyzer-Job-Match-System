import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Bot, Briefcase, BarChart2, HelpCircle } from 'lucide-react'
import { cn } from '../../lib/utils'
import { Button } from '../ui/Button'

const navigation = [
  { name: 'Home', href: '/', icon: Bot },
  { name: 'Analyze', href: '/analyze', icon: BarChart2 },
  { name: 'Job Matches', href: '/jobs', icon: Briefcase },
  { name: 'About', href: '/about', icon: HelpCircle },
]

export function Navbar() {
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isActive = (href: string) => location.pathname === href || (href !== '/' && location.pathname.startsWith(href))

  return (
    <nav className="fixed top-0 left-0 right-0 z-40 glass border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-xl font-bold gradient-text" aria-label="AI Resume Analyzer Home">
            <Bot className="w-8 h-8" />
            <span className="hidden sm:block">AI Resume Analyzer</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navigation.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    'flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                    active
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-800'
                  )}
                  aria-current={active ? 'page' : undefined}
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </Link>
              )
            })}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link to="/analyze">
              <Button size="sm" leftIcon={<BarChart2 className="w-4 h-4" />}>
                Analyze Resume
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 dark:border-gray-800 animate-slide-down">
          <div className="px-4 py-4 space-y-2">
            {navigation.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                    active
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-gray-100 dark:hover:bg-gray-800'
                  )}
                >
                  <Icon className="w-5 h-5" />
                  {item.name}
                </Link>
              )
            })}
            <div className="pt-2 border-t border-gray-100 dark:border-gray-800">
              <Link to="/analyze" onClick={() => setMobileMenuOpen(false)}>
                <Button className="w-full" leftIcon={<BarChart2 className="w-4 h-4" />}>
                  Analyze Resume
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}