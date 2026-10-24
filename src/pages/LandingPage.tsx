import { Link } from 'react-router-dom'
import { Sparkles, Upload, ArrowRight, Bot, Brain, Target, BarChart2, Zap, Shield, Users } from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { cn } from '../lib/utils'

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Analysis',
    description: 'Advanced NLP algorithms analyze your resume against industry standards and ATS requirements.',
    color: 'primary',
  },
  {
    icon: Target,
    title: 'Smart Job Matching',
    description: 'Get matched with relevant job opportunities based on your skills, experience, and preferences.',
    color: 'accent',
  },
  {
    icon: BarChart2,
    title: 'Detailed Scoring',
    description: 'Receive comprehensive scores for each resume section with actionable improvement suggestions.',
    color: 'success',
  },
  {
    icon: Zap,
    title: 'Instant Results',
    description: 'Upload your resume and get detailed analysis with job matches in under 60 seconds.',
    color: 'warning',
  },
  {
    icon: Shield,
    title: 'ATS Optimization',
    description: 'Ensure your resume passes Applicant Tracking Systems with keyword optimization guidance.',
    color: 'info',
  },
  {
    icon: Users,
    title: 'Career Insights',
    description: 'Get personalized career path recommendations and skill gap analysis for your target roles.',
    color: 'danger',
  },
]

const stats = [
  { value: '50K+', label: 'Resumes Analyzed' },
  { value: '95%', label: 'ATS Pass Rate' },
  { value: '10K+', label: 'Job Matches Made' },
  { value: '4.9/5', label: 'User Satisfaction' },
]

const howItWorks = [
  {
    step: '01',
    title: 'Upload Resume',
    description: 'Drag and drop your PDF or DOCX resume. We support all common formats.',
    icon: Upload,
  },
  {
    step: '02',
    title: 'AI Analysis',
    description: 'Our AI analyzes content, structure, keywords, and ATS compatibility.',
    icon: Brain,
  },
  {
    step: '03',
    title: 'Get Results',
    description: 'Receive detailed scores, suggestions, and matched job opportunities.',
    icon: Search,
  },
  {
    step: '04',
    title: 'Apply & Succeed',
    description: 'Apply to matched jobs with confidence using your optimized resume.',
    icon: TrendingUp,
  },
]

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 via-transparent to-accent-50/50 dark:from-primary-900/10 dark:via-transparent dark:to-accent-900/10" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary-100/50 dark:bg-primary-900/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-accent-100/50 dark:bg-accent-900/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="primary" size="lg" className="mb-6 animate-fade-in">
              <Sparkles className="w-4 h-4 mr-2" />
              New: AI Resume Analyzer v2.0 with Job Matching
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 animate-slide-up">
              Analyze Your Resume,{' '}
              <span className="gradient-text">Land Your Dream Job</span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '100ms' }}>
              Upload your resume and get instant AI-powered analysis with ATS scoring, 
              keyword optimization, and personalized job matches — all in one platform.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '200ms' }}>
              <Link to="/analyze">
                <Button size="lg" leftIcon={<Upload className="w-5 h-5" />} rightIcon={<ArrowRight className="w-5 h-5" />}>
                  Analyze Resume Free
                </Button>
              </Link>
              <Link to="/about">
                <Button variant="outline" size="lg">
                  How It Works
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={stat.label} className="text-center animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                <div className="text-3xl sm:text-4xl font-bold gradient-text mb-2">{stat.value}</div>
                <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Powerful AI tools designed to make your job search efficient and effective
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature) => {
              const Icon = feature.icon
              return (
                <Card key={feature.title} hover className="group">
                  <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center mb-4', `bg-${feature.color}-100 dark:bg-${feature.color}-900/30`)}>
                    <Icon className={cn('w-6 h-6', `text-${feature.color}-600 dark:text-${feature.color}-400`)} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Get actionable insights in four simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
            {howItWorks.map((item, index) => (
              <div key={item.step} className="relative text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-primary-600 dark:text-primary-400">
                  {item.step}
                </div>
                <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{item.desc}</p>
                {index < 3 && (
                  <div className="absolute top-8 right-0 w-full h-0.5 bg-gradient-to-r from-primary-200 to-transparent hidden md:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Project Team Credits */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-950">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-600 dark:text-primary-400 mb-3">The People Behind the Project</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">Created by Keerthana. Deployed by Gowtham.</h2>
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">Project creation and deployment are credited separately to reflect each person's role.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <article className="flex items-center gap-5 rounded-2xl border border-primary-200 dark:border-primary-900/60 bg-gray-50 dark:bg-gray-900 p-6 shadow-sm">
              <img src="/KEERTHANA%20PROFILE%20PIC.jpeg" alt="Keerthana profile photo" loading="lazy" className="w-24 h-24 rounded-2xl object-cover object-center flex-shrink-0 ring-4 ring-primary-100 dark:ring-primary-900/40" />
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-wider font-semibold text-primary-600 dark:text-primary-400">Project Creator & Developer</p>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-1">Keerthana</h3>
                <a className="mt-2 inline-block text-sm text-gray-600 dark:text-gray-300 hover:text-primary-600 break-all" href="mailto:keerselva595@gmail.com">keerselva595@gmail.com</a>
              </div>
            </article>
            <article className="flex items-center gap-5 rounded-2xl border border-accent-200 dark:border-accent-900/60 bg-gray-50 dark:bg-gray-900 p-6 shadow-sm">
              <div className="w-24 h-24 rounded-2xl bg-accent-100 dark:bg-accent-900/30 flex items-center justify-center flex-shrink-0 ring-4 ring-accent-50 dark:ring-accent-900/20"><Shield className="w-10 h-10 text-accent-600 dark:text-accent-400" /></div>
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-wider font-semibold text-accent-600 dark:text-accent-400">Deployment & Hosting Engineer</p>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-1">Gowtham</h3>
                <a className="mt-2 inline-block text-sm text-gray-600 dark:text-gray-300 hover:text-accent-600 break-all" href="mailto:gowthamgo1745@gmail.com">gowthamgo1745@gmail.com</a>
              </div>
            </article>
          </div>
          <div className="text-center mt-7">
            <Link to="/about" className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline">Learn more about the project and team →</Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-primary-600 to-accent-600 rounded-3xl p-10 sm:p-16 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-from)_0%,transparent_70%)] opacity-20" />
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 relative z-10">
              Ready to Transform Your Career?
            </h2>
            <p className="text-primary-100 text-lg mb-8 max-w-2xl mx-auto relative z-10">
              Join thousands of professionals who have optimized their resumes and landed better jobs. 
              Start your free analysis today.
            </p>
            <Link to="/analyze" className="relative z-10">
              <Button size="xl" variant="secondary" leftIcon={<ArrowRight className="w-6 h-6" />}>
                Get Started Free
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}