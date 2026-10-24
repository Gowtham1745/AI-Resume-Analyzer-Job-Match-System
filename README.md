# AI Resume Analyzer & Job Match System

A modern, AI-powered resume analysis platform that helps job seekers optimize their resumes for ATS systems and find matching job opportunities instantly.

## 🌟 Features

### Resume Analysis
- **ATS Compatibility Scoring** - Check if your resume passes Applicant Tracking Systems
- **Keyword Optimization** - Identify missing keywords for your target roles
- **Section-by-Section Analysis** - Detailed scoring for contact info, summary, experience, education, skills, projects, and certifications
- **Actionable Suggestions** - Prioritized recommendations with examples
- **Instant Results** - Complete analysis in under 60 seconds

### Smart Job Matching
- **Intelligent Matching** - AI matches your skills and experience to relevant jobs
- **Match Scoring** - See exactly how well you match each position (0-100%)
- **Skill Gap Analysis** - Identify missing skills for each job
- **Detailed Job Info** - Salary ranges, locations, job types, and direct apply links
- **Filter & Sort** - Filter by job type, location, match score, and more

### Professional Features
- **PDF/DOCX Support** - Upload resumes in common formats
- **Downloadable Reports** - Export detailed analysis as Markdown
- **Privacy First** - Your data is processed securely, never stored permanently
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **Dark/Light Mode** - Comfortable viewing in any environment

## 🛠 Tech Stack

### Frontend
- **React 19** + **TypeScript** - Modern, type-safe UI development
- **Vite** - Lightning-fast build tool and dev server
- **Tailwind CSS** - Utility-first styling with custom design system
- **React Router v7** - Client-side routing
- **Lucide React** - Beautiful, consistent icons
- **Framer Motion** - Smooth animations and transitions
- **React Dropzone** - Drag-and-drop file uploads
- **Axios** - HTTP client for API communication

### Backend
- **FastAPI** - High-performance Python API framework
- **PyPDF2** - PDF text extraction
- **python-docx** - DOCX text extraction
- **Pydantic** - Data validation and serialization
- **Uvicorn** - ASGI server for production deployment

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.11+
- npm or yarn

### Frontend Setup
```bash
# Navigate to project root
cd ai-resume-analyzer

# Install dependencies
npm install

# Start development server
npm run dev
```
Frontend runs at `http://localhost:5173`

### Backend Setup
```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start API server
uvicorn main:app --reload
```
Backend runs at `http://localhost:8000`

### Full Stack with Docker
```bash
# From project root
docker-compose up --build
```

## 📁 Project Structure

```
ai-resume-analyzer/
├── frontend/                 # React + TypeScript frontend
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   │   ├── ui/           # Base components (Button, Card, Input, etc.)
│   │   │   └── layout/       # Layout components (Navbar, Footer)
│   │   ├── pages/            # Page components
│   │   │   ├── LandingPage.tsx
│   │   │   ├── AnalyzerPage.tsx
│   │   │   ├── ResultsPage.tsx
│   │   │   ├── JobMatchesPage.tsx
│   │   │   └── AboutPage.tsx
│   │   ├── hooks/            # Custom React hooks
│   │   ├── lib/              # Utilities and API client
│   │   ├── App.tsx           # Main app with routing
│   │   └── main.tsx          # Entry point
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── tsconfig.json
│
├── backend/                   # FastAPI backend
│   ├── main.py               # FastAPI app and routes
│   ├── analyzer.py           # Resume analysis logic
│   ├── resume_parser.py      # PDF/DOCX parsing
│   ├── job_matcher.py        # Job matching algorithm
│   ├── requirements.txt
│   └── Dockerfile
│
├── docker-compose.yml        # Multi-container orchestration
├── .env.example              # Environment variables template
├── .gitignore
└── README.md
```

## 🎯 Usage

1. **Visit the landing page** - Learn about features and get started
2. **Upload your resume** - Drag & drop PDF, DOC, or DOCX (max 10MB)
3. **Get instant analysis** - View overall score, section breakdown, and keyword analysis
4. **Review suggestions** - Prioritized actionable improvements with examples
5. **Explore job matches** - See personalized job recommendations with match scores
6. **Download report** - Export detailed analysis for offline review

## 🔧 Configuration

### Environment Variables
Copy `.env.example` to `.env` and configure:

```env
# Frontend
VITE_API_URL=http://localhost:8000

# Backend (for production AI features)
OPENAI_API_KEY=your-openai-api-key
DATABASE_URL=postgresql://user:pass@localhost:5432/resume_analyzer
SECRET_KEY=your-secret-key
```

### Customizing Job Database
Edit `backend/main.py` to add your own job listings to `SAMPLE_JOBS` or connect to a job API.

### Adding New Analysis Sections
1. Add scoring logic in `backend/analyzer.py`
2. Update types in `frontend/src/lib/types.ts`
3. Display results in `frontend/src/pages/ResultsPage.tsx`

## 🚀 Deployment

### Vercel (Frontend) + Render/Railway (Backend)

**Frontend (Vercel):**
1. Connect GitHub repo to Vercel
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variable: `VITE_API_URL=https://your-backend-url.com`

**Backend (Render):**
1. Create new Web Service
2. Connect GitHub repo
3. Set build command: `pip install -r backend/requirements.txt`
4. Set start command: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables

### Docker Deployment
```bash
# Production build
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

MIT License - feel free to use this project for learning or commercial purposes.

## 👥 Team

### Keerthana - Project Creator & Lead Developer
- **Role**: Core AI analysis engine, resume parsing & NLP pipeline, job matching algorithms, frontend architecture & UI/UX, project planning & design
- **Email**: keerselva595@gmail.com

### Gowtham - Deployment & Infrastructure Engineer
- **Role**: CI/CD pipeline setup, cloud infrastructure (AWS/Vercel), database optimization, monitoring & logging, security & compliance
- **Email**: gowthamgo1745@gmail.com

---

Built with ❤️ for job seekers everywhere. Good luck with your job search!