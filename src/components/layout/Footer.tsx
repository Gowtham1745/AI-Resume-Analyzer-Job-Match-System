import { Link } from 'react-router-dom'
import { Bot, Mail, GitBranch, User, MessageSquare, Zap, Shield } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 text-xl font-bold gradient-text mb-4">
              <Bot className="w-8 h-8" />
              AI Resume Analyzer
            </Link>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Empowering job seekers with AI-powered resume analysis and intelligent job matching.
              Built with precision to help you land your dream job.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li><Link to="/analyze" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Resume Analysis</Link></li>
              <li><Link to="/jobs" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Job Matching</Link></li>
              <li><Link to="/about" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">How It Works</Link></li>
              <li><a href="#" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Pricing</a></li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li><a href="#" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Blog</a></li>
              <li><a href="#" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Careers</a></li>
              <li><a href="#" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Legal & Social */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Legal & Social</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
              <li><a href="#" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Cookie Policy</a></li>
            </ul>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors" aria-label="GitHub">
                <Github className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors" aria-label="LinkedIn">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors" aria-label="Twitter">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="mailto:keerselva595@gmail.com" className="text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors" aria-label="Email">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Team Credits & Copyright */}
        <div className="pt-8 border-t border-gray-100 dark:border-gray-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Team Credits */}
            <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
              <div className="flex items-center gap-4 p-3 rounded-xl bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-900/30">
                <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                  <Bot className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-primary-700 dark:text-primary-300">Created by Keerthana</p>
                  <p className="text-xs text-primary-600 dark:text-primary-400">Project Creator & Developer</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-3 rounded-xl bg-accent-50 dark:bg-accent-900/20 border border-accent-100 dark:border-accent-900/30">
                <div className="w-12 h-12 rounded-full bg-accent-100 dark:bg-accent-900/30 flex items-center justify-center">
                  <Shield className="w-6 h-6 text-accent-600 dark:text-accent-400" />
                </div>
                <div className="text-left">
                  <p className="font-medium text-accent-700 dark:text-accent-300">Deployed by Gowtham</p>
                  <p className="text-xs text-accent-600 dark:text-accent-400">Deployment Engineer</p>
                </div>
              </div>
            </div>

            {/* Copyright & Contact */}
            <div className="flex flex-col items-center gap-2 text-center md:text-right">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                © 2024 AI Resume Analyzer. All rights reserved.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
                <a href="mailto:keerselva595@gmail.com" className="text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" />
                  keerselva595@gmail.com
                </a>
                <span className="text-gray-400">·</span>
                <a href="mailto:gowthamgo1745@gmail.com" className="text-accent-600 dark:text-accent-400 hover:underline flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5" />
                  gowthamgo1745@gmail.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}