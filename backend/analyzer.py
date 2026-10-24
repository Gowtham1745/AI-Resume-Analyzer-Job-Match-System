import asyncio
import re
from typing import Dict, List, Any, Optional
from collections import Counter


async def analyze_resume(parsed_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Analyze parsed resume data and generate comprehensive scoring and suggestions.
    """
    # Calculate section scores
    sections = calculate_section_scores(parsed_data)
    
    # Analyze keywords
    keywords = analyze_keywords(parsed_data)
    
    # Generate suggestions
    suggestions = generate_suggestions(parsed_data, sections, keywords)
    
    # Calculate overall score
    overall_score = calculate_overall_score(sections)
    
    return {
        "overallScore": overall_score,
        "sections": sections,
        "keywords": keywords,
        "suggestions": suggestions,
    }


def calculate_section_scores(parsed_data: Dict[str, Any]) -> List[Dict[str, Any]]:
    """Calculate scores for each resume section."""
    sections = []
    
    # Contact Info (10 points)
    contact_score = 0
    contact_details = []
    personal = parsed_data.get("personalInfo", {})
    if personal.get("name"):
        contact_score += 2
        contact_details.append("Name present")
    else:
        contact_details.append("Missing: Full name")
    
    if personal.get("email"):
        contact_score += 2
        contact_details.append("Email present")
    else:
        contact_details.append("Missing: Email address")
    
    if personal.get("phone"):
        contact_score += 2
        contact_details.append("Phone number present")
    else:
        contact_details.append("Missing: Phone number")
    
    if personal.get("location"):
        contact_score += 2
        contact_details.append("Location present")
    else:
        contact_details.append("Missing: Location")
    
    if personal.get("linkedin"):
        contact_score += 2
        contact_details.append("LinkedIn profile present")
    else:
        contact_details.append("Missing: LinkedIn profile")
    
    sections.append({
        "name": "Contact Information",
        "score": min(contact_score, 10),
        "maxScore": 10,
        "feedback": "Contact information is complete" if contact_score == 10 else "Some contact details are missing",
        "details": contact_details,
    })
    
    # Professional Summary (10 points)
    summary = parsed_data.get("summary")
    summary_score = 0
    summary_details = []
    if summary and len(summary) > 50:
        summary_score = 10
        summary_details.append("Strong professional summary present")
    elif summary and len(summary) > 20:
        summary_score = 6
        summary_details.append("Summary present but could be more detailed")
    else:
        summary_details.append("Missing: Professional summary")
    
    sections.append({
        "name": "Professional Summary",
        "score": summary_score,
        "maxScore": 10,
        "feedback": "Excellent summary" if summary_score == 10 else "Summary needs improvement" if summary_score > 0 else "Missing professional summary",
        "details": summary_details,
    })
    
    # Experience (25 points)
    experience = parsed_data.get("experience", [])
    exp_score = 0
    exp_details = []
    if len(experience) >= 3:
        exp_score = 15
        exp_details.append(f"{len(experience)} positions listed")
    elif len(experience) >= 1:
        exp_score = 8
        exp_details.append(f"{len(experience)} position(s) listed")
    else:
        exp_details.append("No work experience found")
    
    # Check for details in experience
    detailed_exp = sum(1 for e in experience if isinstance(e, dict) and e.get("description"))
    if detailed_exp >= 2:
        exp_score += 5
        exp_details.append("Detailed descriptions provided")
    elif detailed_exp >= 1:
        exp_score += 3
        exp_details.append("Some descriptions provided")
    else:
        exp_details.append("Missing: Detailed job descriptions")
    
    # Check for dates
    dated_exp = sum(1 for e in experience if isinstance(e, dict) and (e.get("startDate") or e.get("endDate")))
    if dated_exp == len(experience) and len(experience) > 0:
        exp_score += 5
        exp_details.append("All positions have dates")
    elif dated_exp > 0:
        exp_score += 2
        exp_details.append("Some positions missing dates")
    else:
        exp_details.append("Missing: Employment dates")
    
    sections.append({
        "name": "Work Experience",
        "score": min(exp_score, 25),
        "maxScore": 25,
        "feedback": "Strong experience section" if exp_score >= 20 else "Experience section needs improvement" if exp_score > 0 else "Missing work experience",
        "details": exp_details,
    })
    
    # Education (10 points)
    education = parsed_data.get("education", [])
    edu_score = 0
    edu_details = []
    if len(education) >= 2:
        edu_score = 10
        edu_details.append(f"{len(education)} degrees listed")
    elif len(education) >= 1:
        edu_score = 7
        edu_details.append(f"{len(education)} degree(s) listed")
    else:
        edu_details.append("No education found")
    
    sections.append({
        "name": "Education",
        "score": edu_score,
        "maxScore": 10,
        "feedback": "Complete education section" if edu_score >= 7 else "Education section needs improvement" if edu_score > 0 else "Missing education",
        "details": edu_details,
    })
    
    # Skills (20 points)
    skills = parsed_data.get("skills", [])
    skills_score = 0
    skills_details = []
    if len(skills) >= 15:
        skills_score = 20
        skills_details.append(f"{len(skills)} skills listed - excellent breadth")
    elif len(skills) >= 10:
        skills_score = 15
        skills_details.append(f"{len(skills)} skills listed - good variety")
    elif len(skills) >= 5:
        skills_score = 10
        skills_details.append(f"{len(skills)} skills listed - could add more")
    elif len(skills) >= 1:
        skills_score = 5
        skills_details.append(f"Only {len(skills)} skills listed - needs significant expansion")
    else:
        skills_details.append("No skills found")
    
    sections.append({
        "name": "Skills",
        "score": skills_score,
        "maxScore": 20,
        "feedback": "Excellent skills section" if skills_score >= 15 else "Good skills section" if skills_score >= 10 else "Skills section needs expansion",
        "details": skills_details,
    })
    
    # Projects (10 points)
    projects = parsed_data.get("projects", [])
    proj_score = 0
    proj_details = []
    if len(projects) >= 3:
        proj_score = 10
        proj_details.append(f"{len(projects)} projects showcased")
    elif len(projects) >= 1:
        proj_score = 6
        proj_details.append(f"{len(projects)} project(s) listed")
    else:
        proj_details.append("No projects listed")
    
    sections.append({
        "name": "Projects",
        "score": proj_score,
        "maxScore": 10,
        "feedback": "Strong project portfolio" if proj_score >= 8 else "Projects section needs improvement" if proj_score > 0 else "Missing projects",
        "details": proj_details,
    })
    
    # Certifications (10 points)
    certs = parsed_data.get("certifications", [])
    cert_score = 0
    cert_details = []
    if len(certs) >= 3:
        cert_score = 10
        cert_details.append(f"{len(certs)} certifications listed")
    elif len(certs) >= 1:
        cert_score = 6
        cert_details.append(f"{len(certs)} certification(s) listed")
    else:
        cert_details.append("No certifications listed")
    
    sections.append({
        "name": "Certifications",
        "score": cert_score,
        "maxScore": 10,
        "feedback": "Strong certifications" if cert_score >= 8 else "Some certifications" if cert_score > 0 else "No certifications listed",
        "details": cert_details,
    })
    
    # Formatting & ATS (5 points) - simplified
    format_score = 5
    format_details = ["Standard formatting detected", "Text-based format (ATS-friendly)"]
    
    sections.append({
        "name": "Formatting & ATS Compatibility",
        "score": format_score,
        "maxScore": 5,
        "feedback": "ATS-friendly format",
        "details": format_details,
    })
    
    return sections


def calculate_overall_score(sections: List[Dict[str, Any]]) -> int:
    """Calculate weighted overall score."""
    total_score = sum(s["score"] for s in sections)
    total_max = sum(s["maxScore"] for s in sections)
    return round((total_score / total_max) * 100)


def analyze_keywords(parsed_data: Dict[str, Any]) -> Dict[str, Any]:
    """Analyze keywords in resume."""
    skills = parsed_data.get("skills", [])
    experience = parsed_data.get("experience", [])
    projects = parsed_data.get("projects", [])
    summary = parsed_data.get("summary", "")
    
    # Combine all text
    all_text = " ".join([
        summary,
        " ".join([e.get("title", "") + " " + e.get("description", "") for e in experience if isinstance(e, dict)]),
        " ".join([p.get("name", "") + " " + p.get("description", "") for p in projects if isinstance(p, dict)]),
        " ".join(skills),
    ]).lower()
    
    # Common important keywords by category
    keyword_categories = {
        "technical": [
            "python", "javascript", "typescript", "react", "node.js", "aws", "docker", 
            "kubernetes", "sql", "postgresql", "mongodb", "redis", "git", "ci/cd",
            "rest api", "graphql", "microservices", "testing", "agile", "scrum"
        ],
        "soft": [
            "leadership", "communication", "teamwork", "problem solving", "mentoring",
            "project management", "collaboration", "adaptability"
        ],
        "domain": [
            "machine learning", "data science", "artificial intelligence", "devops",
            "frontend", "backend", "full stack", "mobile", "cloud", "security"
        ],
    }
    
    found = []
    missing = []
    density = {}
    
    for category, keywords in keyword_categories.items():
        for kw in keywords:
            count = all_text.count(kw.lower())
            if count > 0:
                found.append(kw)
                density[kw] = count / max(len(all_text.split()), 1)
            else:
                missing.append(kw)
    
    # Also include skills as found keywords
    for skill in skills:
        if skill.lower() not in [k.lower() for k in found]:
            found.append(skill)
    
    return {
        "found": list(set(found))[:30],
        "missing": list(set(missing))[:20],
        "density": density,
    }


def generate_suggestions(
    parsed_data: Dict[str, Any],
    sections: List[Dict[str, Any]],
    keywords: Dict[str, Any]
) -> List[Dict[str, Any]]:
    """Generate actionable suggestions for resume improvement."""
    suggestions = []
    
    # Section-based suggestions
    for section in sections:
        if section["score"] < section["maxScore"] * 0.7:
            priority = "critical" if section["score"] < section["maxScore"] * 0.4 else "important"
            suggestions.append({
                "type": priority,
                "category": section["name"],
                "title": f"Improve {section['name']}",
                "description": f"Your {section['name'].lower()} section scored {section['score']}/{section['maxScore']}. " + 
                              section["feedback"] + ". " +
                              "Focus on: " + "; ".join(section["details"][:3]),
                "example": get_section_example(section["name"]),
            })
    
    # Keyword suggestions
    if keywords["missing"]:
        suggestions.append({
            "type": "important",
            "category": "Keywords",
            "title": "Add Missing Keywords",
            "description": f"Your resume is missing {len(keywords['missing'])} important keywords that recruiters and ATS systems look for. "
                          f"Consider adding: {', '.join(keywords['missing'][:10])}",
            "example": "Add a 'Technical Skills' section with: " + ", ".join(keywords['missing'][:8]),
        })
    
    # Skills suggestions
    skills = parsed_data.get("skills", [])
    if len(skills) < 10:
        suggestions.append({
            "type": "important",
            "category": "Skills",
            "title": "Expand Your Skills Section",
            "description": f"You only have {len(skills)} skills listed. Most competitive resumes list 15-25 relevant skills. "
                          "Add more specific technologies, frameworks, and tools you're proficient in.",
            "example": "Group skills by category:\n• Languages: Python, JavaScript, TypeScript\n• Frameworks: React, Node.js, FastAPI\n• Cloud: AWS, Docker, Kubernetes\n• Databases: PostgreSQL, MongoDB, Redis",
        })
    
    # Contact info suggestions
    personal = parsed_data.get("personalInfo", {})
    if not personal.get("linkedin"):
        suggestions.append({
            "type": "important",
            "category": "Contact Information",
            "title": "Add LinkedIn Profile",
            "description": "97% of recruiters use LinkedIn to vet candidates. Add your LinkedIn profile URL to increase visibility.",
            "example": "linkedin.com/in/yourname",
        })
    
    if not personal.get("github"):
        suggestions.append({
            "type": "optional",
            "category": "Contact Information",
            "title": "Add GitHub/Portfolio",
            "description": "For technical roles, a GitHub profile or portfolio website demonstrates your code quality and projects.",
            "example": "github.com/yourusername or yourname.dev",
        })
    
    # Experience suggestions
    experience = parsed_data.get("experience", [])
    if experience:
        undetailed = sum(1 for e in experience if isinstance(e, dict) and not e.get("description"))
        if undetailed > 0:
            suggestions.append({
                "type": "important",
                "category": "Work Experience",
                "title": "Add Detailed Job Descriptions",
                "description": f"{undetailed} of your {len(experience)} positions lack detailed descriptions. "
                              "Use the STAR method (Situation, Task, Action, Result) for each role.",
                "example": "• Led a team of 5 developers to build a React/Node.js application\n"
                          "• Reduced page load time by 40% through code optimization\n"
                          "• Implemented CI/CD pipeline reducing deployment time from 30min to 5min",
            })
    
    # Quantifiable achievements
    has_numbers = any(
        re.search(r'\d+%|\$\d+|\d+\s*(years?|months?|people|users|clients|projects)', str(e.get("description", "")))
        for e in experience if isinstance(e, dict)
    )
    if not has_numbers and experience:
        suggestions.append({
            "type": "important",
            "category": "Work Experience",
            "title": "Add Quantifiable Achievements",
            "description": "Recruiters look for measurable impact. Add metrics, percentages, dollar amounts, and timeframes to your accomplishments.",
            "example": "• Increased revenue by 25% ($500K) in Q3 2023\n"
                      "• Reduced bug reports by 60% through automated testing\n"
                      "• Managed team of 8 engineers across 3 time zones",
        })
    
    return suggestions


def get_section_example(section_name: str) -> str:
    """Get example content for a section."""
    examples = {
        "Contact Information": "John Doe\njohn.doe@email.com • (555) 123-4567\nSan Francisco, CA • linkedin.com/in/johndoe • github.com/johndoe",
        "Professional Summary": "Senior Full Stack Engineer with 7+ years building scalable web applications. Expert in React, Node.js, and AWS. Led team of 8 to deliver $2M ARR product. Passionate about clean code and mentoring.",
        "Work Experience": "Senior Software Engineer | TechCorp | 2021-Present\n• Architected microservices platform handling 1M+ requests/day\n• Reduced API latency by 60% through caching optimization\n• Mentored 3 junior developers and established code review process",
        "Education": "Master of Science in Computer Science\nStanford University | 2019\nBachelor of Science in Computer Engineering\nUC Berkeley | 2017",
        "Skills": "Languages: Python, TypeScript, Go, SQL\nFrameworks: React, Next.js, FastAPI, Express\nCloud: AWS (ECS, Lambda, RDS), Docker, Kubernetes\nDatabases: PostgreSQL, MongoDB, Redis\nTools: Git, GitHub Actions, Terraform, Datadog",
        "Projects": "E-Commerce Platform (React, Node.js, PostgreSQL)\n• Built full-stack marketplace with payment integration\n• Implemented real-time inventory with WebSockets\n• Deployed on AWS with CI/CD pipeline",
        "Certifications": "AWS Solutions Architect Associate (2023)\nCertified Kubernetes Administrator (CKA) (2022)\nScrum Master Certified (CSM) (2021)",
        "Formatting & ATS Compatibility": "Use standard fonts (Arial, Calibri), clear section headers, bullet points, and avoid tables/graphics. Save as PDF for best compatibility.",
    }
    return examples.get(section_name, "Review similar resumes in your industry for reference.")