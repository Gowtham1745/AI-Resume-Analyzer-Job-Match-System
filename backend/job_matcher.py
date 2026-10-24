from typing import List, Dict, Any


async def match_jobs(analysis: Dict[str, Any], jobs_db: List[Dict]) -> List[Dict]:
    """
    Match resume analysis against job database and return ranked matches.
    """
    skills = set(skill.lower() for skill in analysis.get("parsedData", {}).get("skills", []))
    experience_titles = [e.get("title", "").lower() for e in analysis.get("parsedData", {}).get("experience", []) if isinstance(e, dict)]
    
    matched_jobs = []
    
    for job in jobs_db:
        required_skills = set(skill.lower() for skill in job.get("requiredSkills", []))
        
        # Calculate skill match
        matched_skills = list(skills & required_skills)
        missing_skills = list(required_skills - skills)
        
        skill_match_score = 0
        if required_skills:
            skill_match_score = round((len(matched_skills) / len(required_skills)) * 100)
        
        # Calculate experience match
        exp_match_score = 0
        for exp_title in experience_titles:
            if any(word in job["title"].lower() for word in exp_title.split()):
                exp_match_score = 100
                break
            if any(word in exp_title for word in job["title"].lower().split()):
                exp_match_score = max(exp_match_score, 50)
        
        # Calculate overall match score (weighted)
        match_score = round(skill_match_score * 0.7 + exp_match_score * 0.3)
        
        # Boost score if we have some matching skills
        if matched_skills:
            match_score = min(100, match_score + len(matched_skills) * 2)
        
        matched_jobs.append({
            "id": job["id"],
            "title": job["title"],
            "company": job["company"],
            "location": job["location"],
            "type": job["type"],
            "salaryRange": job.get("salaryRange"),
            "matchScore": match_score,
            "requiredSkills": job["requiredSkills"],
            "matchedSkills": matched_skills,
            "missingSkills": missing_skills,
            "description": job["description"],
            "postedDate": job["postedDate"],
            "applyUrl": job.get("applyUrl"),
        })
    
    # Sort by match score descending
    matched_jobs.sort(key=lambda x: x["matchScore"], reverse=True)
    
    # Return top 10 matches
    return matched_jobs[:10]