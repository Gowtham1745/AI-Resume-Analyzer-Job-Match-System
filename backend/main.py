from fastapi import FastAPI, File, UploadFile, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import uuid
import json
import os
from datetime import datetime
import asyncio

# Import our analysis modules
from .resume_parser import parse_resume
from .analyzer import analyze_resume
from .job_matcher import match_jobs

app = FastAPI(
    title="AI Resume Analyzer API",
    description="Backend API for AI-powered resume analysis and job matching",
    version="1.0.0",
)

# CORS configuration: allow local development and configured production origins.
_allowed_origins = [
    origin.strip()
    for origin in os.getenv(
        "ALLOWED_ORIGINS",
        "http://localhost:5173,http://localhost:3000",
    ).split(",")
    if origin.strip()
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=_allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory storage (replace with database in production)
analyses_db: Dict[str, Dict] = {}
jobs_db: List[Dict] = []

# Load sample jobs
SAMPLE_JOBS = [
    {
        "id": "job-1",
        "title": "Senior Frontend Developer",
        "company": "TechCorp Inc.",
        "location": "San Francisco, CA (Remote)",
        "type": "full-time",
        "salaryRange": "$140,000 - $180,000",
        "requiredSkills": ["React", "TypeScript", "Next.js", "Tailwind CSS", "GraphQL", "Testing"],
        "description": "We're looking for a Senior Frontend Developer to join our growing team. You'll be responsible for building beautiful, performant user interfaces using React and Next.js.",
        "postedDate": "2024-01-15",
        "applyUrl": "https://techcorp.com/careers/senior-frontend",
    },
    {
        "id": "job-2",
        "title": "Full Stack Engineer",
        "company": "StartupXYZ",
        "location": "New York, NY (Hybrid)",
        "type": "full-time",
        "salaryRange": "$120,000 - $160,000",
        "requiredSkills": ["React", "Node.js", "PostgreSQL", "AWS", "Docker", "Python"],
        "description": "Join a fast-growing startup building the future of fintech. Work across the full stack with modern technologies.",
        "postedDate": "2024-01-14",
        "applyUrl": "https://startupxyz.com/jobs/fullstack",
    },
    {
        "id": "job-3",
        "title": "React Developer",
        "company": "Digital Agency Co.",
        "location": "Remote",
        "type": "remote",
        "salaryRange": "$100,000 - $140,000",
        "requiredSkills": ["React", "JavaScript", "Redux", "CSS", "REST APIs", "Git"],
        "description": "Work with diverse clients on exciting projects. Full remote position with flexible hours.",
        "postedDate": "2024-01-13",
        "applyUrl": "https://digitalagency.com/careers/react-dev",
    },
    {
        "id": "job-4",
        "title": "Backend Engineer (Python)",
        "company": "DataFlow Systems",
        "location": "Austin, TX",
        "type": "full-time",
        "salaryRange": "$130,000 - $170,000",
        "requiredSkills": ["Python", "FastAPI", "PostgreSQL", "Redis", "Kubernetes", "Machine Learning"],
        "description": "Build scalable backend systems for real-time data processing. Experience with ML pipelines is a plus.",
        "postedDate": "2024-01-12",
        "applyUrl": "https://dataflow.com/jobs/backend",
    },
    {
        "id": "job-5",
        "title": "DevOps Engineer",
        "company": "CloudScale Inc.",
        "location": "Seattle, WA (Remote)",
        "type": "remote",
        "salaryRange": "$140,000 - $180,000",
        "requiredSkills": ["AWS", "Kubernetes", "Terraform", "Docker", "CI/CD", "Monitoring"],
        "description": "Lead our infrastructure automation efforts. Build and maintain cloud-native platforms.",
        "postedDate": "2024-01-11",
        "applyUrl": "https://cloudscale.io/careers/devops",
    },
    {
        "id": "job-6",
        "title": "Mobile App Developer (React Native)",
        "company": "AppStudio",
        "location": "Los Angeles, CA",
        "type": "contract",
        "salaryRange": "$80/hr - $120/hr",
        "requiredSkills": ["React Native", "TypeScript", "Expo", "Firebase", "App Store Deployment"],
        "description": "6-month contract to build a consumer-facing mobile application. Potential for extension.",
        "postedDate": "2024-01-10",
        "applyUrl": "https://appstudio.com/contracts/mobile",
    },
]

# Initialize jobs
jobs_db.extend(SAMPLE_JOBS)


class AnalysisResponse(BaseModel):
    success: bool
    data: Optional[Dict[str, Any]] = None
    error: Optional[str] = None
    message: Optional[str] = None


class JobMatchResponse(BaseModel):
    success: bool
    data: Optional[List[Dict]] = None
    error: Optional[str] = None


@app.get("/")
async def root():
    return {"message": "AI Resume Analyzer API", "version": "1.0.0", "status": "running"}


@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}


@app.post("/api/analyze", response_model=AnalysisResponse)
async def analyze_resume_endpoint(
    background_tasks: BackgroundTasks,
    resume: UploadFile = File(...),
):
    """Analyze an uploaded resume file."""
    try:
        # Validate file type
        allowed_types = {
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        }
        if resume.content_type not in allowed_types:
            raise HTTPException(
                status_code=400,
                detail="Invalid file type. Please upload PDF, DOC, or DOCX files only.",
            )

        # Validate file size (10MB)
        content = await resume.read()
        if len(content) > 10 * 1024 * 1024:
            raise HTTPException(
                status_code=400,
                detail="File size exceeds 10MB limit.",
            )

        # Generate analysis ID
        analysis_id = str(uuid.uuid4())

        # Parse resume
        parsed_data = await parse_resume(content, resume.content_type, resume.filename)

        # Analyze with AI
        analysis_result = await analyze_resume(parsed_data)

        # Match jobs
        matched_jobs = await match_jobs(analysis_result, jobs_db)

        # Create analysis record
        analysis = {
            "id": analysis_id,
            "fileName": resume.filename,
            "uploadedAt": datetime.utcnow().isoformat(),
            "overallScore": analysis_result["overallScore"],
            "sections": analysis_result["sections"],
            "keywords": analysis_result["keywords"],
            "suggestions": analysis_result["suggestions"],
            "matchedJobs": matched_jobs,
            "parsedData": parsed_data,
        }

        # Store in database
        analyses_db[analysis_id] = analysis

        return AnalysisResponse(
            success=True,
            data=analysis,
            message="Analysis completed successfully",
        )

    except HTTPException:
        raise
    except Exception as e:
        return AnalysisResponse(
            success=False,
            error=str(e),
            message="Analysis failed. Please try again.",
        )


@app.get("/api/analysis/{analysis_id}", response_model=AnalysisResponse)
async def get_analysis(analysis_id: str):
    """Retrieve a previous analysis by ID."""
    if analysis_id not in analyses_db:
        raise HTTPException(status_code=404, detail="Analysis not found")

    return AnalysisResponse(
        success=True,
        data=analyses_db[analysis_id],
    )


@app.get("/api/analysis/{analysis_id}/jobs", response_model=JobMatchResponse)
async def get_job_matches(analysis_id: str):
    """Get job matches for a specific analysis."""
    if analysis_id not in analyses_db:
        raise HTTPException(status_code=404, detail="Analysis not found")

    analysis = analyses_db[analysis_id]
    matched_jobs = await match_jobs(
        {
            "overallScore": analysis["overallScore"],
            "sections": analysis["sections"],
            "keywords": analysis["keywords"],
            "suggestions": analysis["suggestions"],
        },
        jobs_db,
    )

    return JobMatchResponse(
        success=True,
        data=matched_jobs,
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)