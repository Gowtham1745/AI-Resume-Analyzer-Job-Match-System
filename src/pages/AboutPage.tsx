import { Link } from 'react-router-dom'
import { 
  Bot, Shield, Zap, Brain, Target, Users, 
  CheckCircle, ArrowRight, Heart, Code, 
  Server, Globe, Mail, Github, Linkedin, Twitter
} from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Card, CardContent } from '../components/ui/Card'
import { Badge } from '../components/ui/Badge'
import { cn } from '../lib/utils'

const techStack = [
  { name: 'React 19', icon: Code, color: 'text-blue-600' },
  { name: 'TypeScript', icon: Code, color: 'text-blue-500' },
  { name: 'Vite', icon: Zap, color: 'text-yellow-600' },
  { name: 'Tailwind CSS', icon: Code, color: 'text-cyan-600' },
  { name: 'FastAPI', icon: Server, color: 'text-green-600' },
  { name: 'Python', icon: Code, color: 'text-blue-600' },
  { name: 'OpenAI GPT', icon: Brain, color: 'text-purple-600' },
  { name: 'PostgreSQL', icon: Server, color: 'text-blue-700' },
]

const features = [
  {
    icon: Shield,
    title: 'Privacy First',
    description: 'Your resume data is processed securely and never stored permanently. We respect your privacy.',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Get comprehensive analysis results in under 60 seconds with our optimized AI pipeline.',
  },
  {
    icon: Target,
    title: 'Accurate Matching',
    description: 'Advanced NLP algorithms ensure precise job matching based on skills, experience, and preferences.',
  },
  {
    icon: Brain,
    title: 'AI-Powered Insights',
    description: 'Leverage cutting-edge LLMs for deep resume analysis and personalized career guidance.',
  },
  {
    icon: Globe,
    title: 'Global Job Market',
    description: 'Access job opportunities from thousands of companies worldwide, updated in real-time.',
  },
  {
    icon: Users,
    title: 'Community Driven',
    description: 'Built with feedback from thousands of job seekers and hiring professionals.',
  },
]

const team = [
  {
    name: 'Keerthana',
    role: 'Project Creator & Developer',
    email: 'keerselva595@gmail.com',
    image: 'https://raw.githubusercontent.com/Gowtham1745/AI-Resume-Analyzer-Job-Match-System/main/KEERTHANA%20PROFILE%20PIC.jpeg',
    color: 'bg-primary-500',
    contributions: [
      'Original project concept and direction',
      'Website development and interface design',
      'Resume analysis and job-matching project work',
    ],
  },
  {
    name: 'Gowtham',
    role: 'Deployment & Hosting Engineer',
    email: 'gowthamgo1745@gmail.com',
    avatar: 'G',
    color: 'bg-accent-500',
    contributions: [
      'Deployment and hosting setup',
      'Release configuration and deployment troubleshooting',
      'Helping prepare the website for public access',
    ],
  },
]

export function AboutPage() {
  return (
    <div className="pt-16 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Hero */}
        <section className="text-center">
          <Badge variant="primary" size="lg" className="mb-6 inline-flex items-center gap-2">
            <Bot className="w-4 h-4" />
            About AI Resume Analyzer
          </Badge>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6">
            Empowering Job Seekers with{' '}
            <span className="gradient-text">AI Intelligence</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            We built AI Resume Analyzer to solve a simple problem: job applications are broken. 
            ATS systems reject qualified candidates, resumes lack the right keywords, and job matching is a guessing game. 
            Our platform changes that with intelligent analysis and precise matching.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/analyze">
              <Button size="lg" leftIcon={<Brain className="w-5 h-5" />} rightIcon={<ArrowRight className="w-5 h-5" />}>
                Try It Free
              </Button>
            </Link>
            <Button variant="outline" size="lg" onClick={() => document.getElementById('team')?.scrollIntoView({ behavior: 'smooth' })}>
              Meet the Team
            </Button>
          </div>
        </section>

        {/* Mission & Values */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Our Mission
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              To democratize career advancement by making professional resume optimization 
              and intelligent job matching accessible to everyone, regardless of background or resources.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Heart, title: 'Candidate First', desc: 'Every feature is designed with the job seeker\'s success as the primary goal.' },
              { icon: Shield, title: 'Transparency', desc: 'Clear scoring, actionable feedback, and honest job matching—no black boxes.' },
              { icon: Zap, title: 'Continuous Innovation', desc: 'We constantly improve our AI models based on real hiring data and user feedback.' },
            ].map((value, index) => (
              <Card key={index} hover className="text-center">
                <CardContent className="p-8">
                  <div className="w-16 h-16 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{value.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{value.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Features */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose AI Resume Analyzer?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Built with modern technology and real hiring expertise
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} hover>
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Tech Stack */}
        <section>
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Built with Modern Technology
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Our stack is chosen for performance, scalability, and developer experience
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {techStack.map((tech, index) => (
              <Card key={index} hover className="text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-3">
                    <tech.icon className={cn('w-6 h-6', tech.color)} />
                  </div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">{tech.name}</h4>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Team */}
        <section id="team">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              The Team Behind the Platform
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              A passionate duo combining AI expertise with deployment excellence
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-8">
                  <div className="flex items-start gap-6 mb-6">
                    {member.image ? (
                      <img src={member.image} alt={`${member.name} profile`} loading="lazy" className="w-20 h-20 rounded-2xl object-cover object-center flex-shrink-0 ring-4 ring-primary-100 dark:ring-primary-900/30" onError={(event) => { event.currentTarget.style.display = 'none' }} />
                    ) : (
                      <div className={cn('w-20 h-20 rounded-2xl flex items-center justify-center text-white font-bold text-2xl flex-shrink-0', member.color)}>
                        {member.avatar}
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{member.name}</h3>
                      <p className="text-primary-600 dark:text-primary-400 font-medium mb-2">{member.role}</p>
                      <a href={`mailto:${member.email}`} className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                        {member.email}
                      </a>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Key Contributions</h4>
                    <ul className="space-y-2">
                      {member.contributions.map((contrib, i) => (
                        <li key={i} className="flex items-start gap-3 text-gray-600 dark:text-gray-400">
                          <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          {contrib}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Footer CTA */}
        <section className="text-center">
          <Card className="bg-gradient-to-r from-primary-600 to-accent-600">
            <CardContent className="p-10 sm:p-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Ready to Optimize Your Resume?
              </h2>
              <p className="text-primary-100 text-lg mb-8 max-w-2xl mx-auto">
                Join thousands of professionals who have improved their resumes and landed better jobs.
              </p>
              <Link to="/analyze">
                <Button size="xl" variant="secondary" leftIcon={<ArrowRight className="w-6 h-6" />} className="w-auto">
                  Start Free Analysis
                </Button>
              </Link>
            </CardContent>
          </Card>
        </section>

        {/* Social Links */}
        <div className="text-center pt-8 border-t border-gray-100 dark:border-gray-800">
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Connect with us
          </p>
          <div className="flex items-center justify-center gap-4">
            <a href="https://github.com" className="text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors" aria-label="GitHub">
              <Github className="w-6 h-6" />
            </a>
            <a href="https://linkedin.com" className="text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors" aria-label="LinkedIn">
              <Linkedin className="w-6 h-6" />
            </a>
            <a href="https://twitter.com" className="text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors" aria-label="Twitter">
              <Twitter className="w-6 h-6" />
            </a>
            <a href="mailto:keerselva595@gmail.com" className="text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors" aria-label="Email">
              <Mail className="w-6 h-6" />
            </a>
          </div>
          <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
            © 2024 AI Resume Analyzer. Built with ❤️ for job seekers everywhere.
          </p>
        </div>
      </div>
    </div>
  )
}