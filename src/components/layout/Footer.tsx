import { Link } from 'react-router-dom'
import { Bot, Mail, GitBranch, Shield } from 'lucide-react'

const keerthanaPhoto = 'https://raw.githubusercontent.com/Gowtham1745/AI-Resume-Analyzer-Job-Match-System/main/KEERTHANA%20PROFILE%20PIC.jpeg'
const gowthamPhoto = 'https://github.com/Gowtham1745.png'

export function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <Link to="/" className="flex items-center gap-2 text-xl font-bold gradient-text mb-4">
              <Bot className="w-8 h-8" />
              AI Resume Analyzer
            </Link>
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              Resume insights and job matching to help candidates prepare clearer, more relevant applications.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Explore</h4>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <li><Link to="/analyze" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Resume Analysis</Link></li>
              <li><Link to="/" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Home</Link></li>
              <li><Link to="/about" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">About the Project</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Project Repository</h4>
            <a href="https://github.com/Gowtham1745/AI-Resume-Analyzer-Job-Match-System" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400">
              <GitBranch className="w-4 h-4" /> View source on GitHub
            </a>
            <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
              Questions about the project? Contact the project creator or deployment engineer below.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Contact</h4>
            <a href="mailto:keerselva595@gmail.com" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 break-all">keerselva595@gmail.com</a>
            <a href="mailto:gowthamgo1745@gmail.com" className="mt-2 block text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 break-all">gowthamgo1745@gmail.com</a>
          </div>
        </div>

        <section aria-labelledby="team-credits-heading" className="pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="text-center max-w-3xl mx-auto mb-7">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-600 dark:text-primary-400">Project Team</p>
            <h3 id="team-credits-heading" className="mt-2 text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Built with purpose. Delivered with care.</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Project created by Keerthana. Website deployment and hosting by Gowtham A.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto">
            <article className="flex items-center gap-4 rounded-2xl border border-primary-200 dark:border-primary-900/60 bg-white dark:bg-gray-950 p-5 shadow-sm">
              <img
                src={keerthanaPhoto}
                alt="Keerthana profile"
                className="h-20 w-20 rounded-full object-cover object-center ring-4 ring-primary-100 dark:ring-primary-900/40 flex-shrink-0"
                loading="lazy"
                onError={(event) => { event.currentTarget.style.display = 'none' }}
              />
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-primary-600 dark:text-primary-400">Project Creator & Developer</p>
                <h4 className="mt-1 text-xl font-bold text-gray-900 dark:text-white">Keerthana</h4>
                <a href="mailto:keerselva595@gmail.com" className="mt-1 inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 break-all">
                  <Mail className="h-4 w-4 flex-shrink-0" /> keerselva595@gmail.com
                </a>
              </div>
            </article>

            <article className="flex items-center gap-4 rounded-2xl border border-accent-200 dark:border-accent-900/60 bg-white dark:bg-gray-950 p-5 shadow-sm">
              <img
                src={gowthamPhoto}
                alt="Gowtham A profile"
                className="h-20 w-20 rounded-full object-cover object-center ring-4 ring-accent-50 dark:ring-accent-900/20 flex-shrink-0"
                loading="lazy"
                onError={(event) => { event.currentTarget.style.display = "none" }}
              />
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-wider text-accent-600 dark:text-accent-400">Deployment & Hosting</p>
                <h4 className="mt-1 text-xl font-bold text-gray-900 dark:text-white">Gowtham A</h4>
                <a href="mailto:gowthamgo1745@gmail.com" className="mt-1 inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-accent-600 dark:hover:text-accent-400 break-all">
                  <Mail className="h-4 w-4 flex-shrink-0" /> gowthamgo1745@gmail.com
                </a>
              </div>
            </article>
          </div>

          <div className="mt-7 text-center">
            <p className="text-xs text-gray-500 dark:text-gray-500">© {new Date().getFullYear()} AI Resume Analyzer & Job Match System</p>
          </div>
        </section>
      </div>
    </footer>
  )
}
