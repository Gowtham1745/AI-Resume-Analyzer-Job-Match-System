import re
from typing import Dict, List, Any, Optional
import io

try:
    import PyPDF2
except ImportError:
    PyPDF2 = None

try:
    from docx import Document
except ImportError:
    Document = None


async def parse_resume(content: bytes, content_type: str, filename: str) -> Dict[str, Any]:
    """
    Parse resume content and extract structured data.
    """
    text = ""
    
    if content_type == "application/pdf" and PyPDF2:
        text = extract_text_from_pdf(content)
    elif content_type in [
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ] and Document:
        text = extract_text_from_docx(content)
    else:
        # Fallback: try to decode as text
        text = content.decode("utf-8", errors="ignore")

    # Extract structured data
    parsed = {
        "personalInfo": extract_personal_info(text),
        "experience": extract_experience(text),
        "education": extract_education(text),
        "skills": extract_skills(text),
        "certifications": extract_certifications(text),
        "projects": extract_projects(text),
        "summary": extract_summary(text),
    }

    return parsed


def extract_text_from_pdf(content: bytes) -> str:
    """Extract text from PDF content."""
    if not PyPDF2:
        return ""
    
    try:
        pdf_file = io.BytesIO(content)
        reader = PyPDF2.PdfReader(pdf_file)
        text = ""
        for page in reader.pages:
            text += page.extract_text() + "\n"
        return text
    except Exception:
        return ""


def extract_text_from_docx(content: bytes) -> str:
    """Extract text from DOCX content."""
    if not Document:
        return ""
    
    try:
        doc_file = io.BytesIO(content)
        doc = Document(doc_file)
        text = ""
        for para in doc.paragraphs:
            text += para.text + "\n"
        return text
    except Exception:
        return ""


def extract_personal_info(text: str) -> Dict[str, Optional[str]]:
    """Extract personal information from resume text."""
    info = {
        "name": None,
        "email": None,
        "phone": None,
        "location": None,
        "linkedin": None,
        "github": None,
        "portfolio": None,
    }

    # Email
    email_match = re.search(r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b', text)
    if email_match:
        info["email"] = email_match.group()

    # Phone
    phone_match = re.search(r'(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}', text)
    if phone_match:
        info["phone"] = phone_match.group()

    # LinkedIn
    linkedin_match = re.search(r'(linkedin\.com/in/|linkedin\.com/profile/)[A-Za-z0-9\-_]+', text, re.IGNORECASE)
    if linkedin_match:
        info["linkedin"] = "https://" + linkedin_match.group()

    # GitHub
    github_match = re.search(r'(github\.com/)[A-Za-z0-9\-_]+', text, re.IGNORECASE)
    if github_match:
        info["github"] = "https://" + github_match.group()

    # Portfolio/Website
    portfolio_match = re.search(r'(https?://)?(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(/[^\s]*)?', text)
    if portfolio_match and "linkedin" not in portfolio_match.group() and "github" not in portfolio_match.group():
        info["portfolio"] = portfolio_match.group()

    # Name (first non-empty line that looks like a name)
    lines = [line.strip() for line in text.split('\n') if line.strip()]
    for line in lines[:10]:  # Check first 10 lines
        if len(line.split()) >= 2 and len(line) < 50 and not any(kw in line.lower() for kw in ['resume', 'cv', 'curriculum', 'vitae', '@', 'http', 'phone', 'email']):
            info["name"] = line
            break

    return info


def extract_experience(text: str) -> List[Dict[str, Any]]:
    """Extract work experience from resume text."""
    experiences = []
    
    # Common section headers
    exp_headers = [
        'experience', 'employment', 'work history', 'professional experience',
        'career history', 'work experience', 'positions held'
    ]
    
    # Find experience section
    lines = text.split('\n')
    in_experience = False
    current_exp = {}
    
    for i, line in enumerate(lines):
        line_lower = line.strip().lower()
        
        # Check if we're entering experience section
        if any(header in line_lower for header in exp_headers) and len(line.strip()) < 50:
            in_experience = True
            continue
        
        # Check if we're leaving experience section (next major section)
        if in_experience and line.strip() and len(line.strip()) < 50:
            next_section_headers = ['education', 'skills', 'projects', 'certifications', 'awards', 'publications']
            if any(header in line_lower for header in next_section_headers):
                in_experience = False
        
        if in_experience and line.strip():
            # Try to parse job entries
            # Look for patterns like "Job Title at Company" or "Company - Job Title"
            pass
    
    # Fallback: try to extract any job-like patterns from entire text
    # This is a simplified extraction - in production, use NLP
    return []


def extract_education(text: str) -> List[Dict[str, Any]]:
    """Extract education from resume text."""
    education = []
    
    # Degree patterns
    degree_patterns = [
        r'\b(Bachelor|Master|PhD|Doctorate|Associate|B\.?S\.?|M\.?S\.?|B\.?A\.?|M\.?A\.?|MBA|Ph\.?D\.?)\b',
        r'\b(B\.?Tech|M\.?Tech|B\.?E\.?|M\.?E\.?)\b',
    ]
    
    # University patterns (simplified)
    lines = text.split('\n')
    in_education = False
    
    for line in lines:
        line_lower = line.strip().lower()
        
        if any(header in line_lower for header in ['education', 'academic', 'qualification', 'degree']):
            in_education = True
            continue
            
        if in_education and line.strip() and len(line.strip()) < 50:
            next_headers = ['experience', 'skills', 'projects', 'certifications', 'work']
            if any(header in line_lower for header in next_headers):
                in_education = False
        
        if in_education and line.strip():
            # Try to extract degree and institution
            for pattern in degree_patterns:
                if re.search(pattern, line, re.IGNORECASE):
                    education.append({
                        "id": f"edu-{len(education)}",
                        "degree": line.strip(),
                        "institution": "",
                        "location": "",
                        "graduationDate": "",
                        "gpa": "",
                        "honors": [],
                    })
                    break
    
    return education


def extract_skills(text: str) -> List[str]:
    """Extract skills from resume text."""
    # Common technical skills
    skill_keywords = [
        # Languages
        'Python', 'JavaScript', 'TypeScript', 'Java', 'C++', 'C#', 'Go', 'Rust', 'Ruby', 'PHP', 'Swift', 'Kotlin',
        'SQL', 'HTML', 'CSS', 'R', 'MATLAB', 'Scala', 'Perl', 'Shell', 'Bash', 'PowerShell',
        
        # Frontend
        'React', 'Vue', 'Angular', 'Svelte', 'Next.js', 'Nuxt.js', 'Remix', 'Gatsby',
        'Redux', 'Zustand', 'Context API', 'Tailwind CSS', 'Bootstrap', 'Material UI', 'Chakra UI',
        'Styled Components', 'Emotion', 'Sass', 'Less', 'PostCSS', 'Webpack', 'Vite', 'Rollup',
        
        # Backend
        'Node.js', 'Express', 'FastAPI', 'Django', 'Flask', 'Spring Boot', 'ASP.NET', 'Laravel',
        'NestJS', 'Koa', 'Hapi', 'GraphQL', 'REST', 'gRPC', 'WebSocket',
        
        # Databases
        'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'SQLite', 'DynamoDB', 'Cassandra', 'Elasticsearch',
        'Firebase', 'Supabase', 'Prisma', 'TypeORM', 'Sequelize', 'Mongoose',
        
        # Cloud & DevOps
        'AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Terraform', 'Ansible', 'Jenkins', 'GitHub Actions',
        'GitLab CI', 'CircleCI', 'Prometheus', 'Grafana', 'ELK', 'Datadog', 'New Relic',
        
        # Tools & Others
        'Git', 'GitHub', 'GitLab', 'Bitbucket', 'Jira', 'Confluence', 'Figma', 'Sketch', 'Adobe XD',
        'Linux', 'Unix', 'Windows', 'macOS', 'VS Code', 'IntelliJ', 'Vim', 'Emacs',
        
        # Data Science / ML
        'TensorFlow', 'PyTorch', 'Scikit-learn', 'Pandas', 'NumPy', 'Keras', 'OpenCV', 'NLTK', 'SpaCy',
        'Hugging Face', 'LangChain', 'OpenAI API', 'Vector Databases', 'MLOps',
        
        # Soft Skills
        'Leadership', 'Communication', 'Problem Solving', 'Teamwork', 'Agile', 'Scrum', 'Kanban',
        'Project Management', 'Mentoring', 'Code Review', 'CI/CD', 'Testing', 'TDD', 'BDD',
    ]

    found_skills = []
    text_lower = text.lower()
    
    for skill in skill_keywords:
        if skill.lower() in text_lower:
            found_skills.append(skill)

    # Remove duplicates while preserving order
    seen = set()
    unique_skills = []
    for skill in found_skills:
        if skill.lower() not in seen:
            seen.add(skill.lower())
            unique_skills.append(skill)

    return unique_skills[:50]  # Limit to top 50


def extract_certifications(text: str) -> List[Dict[str, Any]]:
    """Extract certifications from resume text."""
    certs = []
    
    cert_keywords = [
        'AWS Certified', 'Azure Certified', 'Google Cloud Certified', 'Kubernetes Certified',
        'CKA', 'CKAD', 'CKS', 'PMP', 'Scrum Master', 'CSM', 'PSM', 'SAFe',
        'CISSP', 'CISM', 'CISA', 'CompTIA', 'CCNA', 'CCNP', 'CCIE',
        'Oracle Certified', 'Microsoft Certified', 'Salesforce Certified',
    ]
    
    lines = text.split('\n')
    for line in lines:
        for keyword in cert_keywords:
            if keyword.lower() in line.lower():
                certs.append({
                    "id": f"cert-{len(certs)}",
                    "name": keyword,
                    "issuer": "",
                    "date": "",
                    "expiryDate": "",
                    "credentialId": "",
                    "url": "",
                })
                break
    
    return certs


def extract_projects(text: str) -> List[Dict[str, Any]]:
    """Extract projects from resume text."""
    projects = []
    
    project_headers = ['projects', 'personal projects', 'side projects', 'portfolio', 'key projects']
    lines = text.split('\n')
    in_projects = False
    
    for line in lines:
        line_lower = line.strip().lower()
        
        if any(header in line_lower for header in project_headers):
            in_projects = True
            continue
            
        if in_projects and line.strip() and len(line.strip()) < 50:
            next_headers = ['experience', 'education', 'skills', 'certifications', 'awards']
            if any(header in line_lower for header in next_headers):
                in_projects = False
        
        if in_projects and line.strip():
            projects.append({
                "id": f"proj-{len(projects)}",
                "name": line.strip(),
                "description": "",
                "technologies": [],
                "url": "",
                "startDate": "",
                "endDate": "",
            })
    
    return projects[:10]


def extract_summary(text: str) -> Optional[str]:
    """Extract professional summary from resume text."""
    summary_headers = ['summary', 'objective', 'profile', 'about', 'professional summary', 'career objective']
    lines = text.split('\n')
    
    for i, line in enumerate(lines):
        line_lower = line.strip().lower()
        if any(header in line_lower for header in summary_headers) and len(line.strip()) < 30:
            # Get next few lines as summary
            summary_lines = []
            for j in range(i + 1, min(i + 5, len(lines))):
                if lines[j].strip() and len(lines[j].strip()) > 20:
                    summary_lines.append(lines[j].strip())
                elif not lines[j].strip():
                    break
            if summary_lines:
                return ' '.join(summary_lines)
    
    return None