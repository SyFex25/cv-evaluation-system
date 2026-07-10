"""
File: backend/app/prompts/hr_prompt.py
Module: Prompts
Responsibility: Builds the HR CV evaluation prompt template
"""

def build_hr_evaluation_prompt(cv_text: str) -> str:
    return f"""
You are evaluating a candidate CV for an internal Human Resources application.

Return only valid JSON matching this shape:
{{
  "overall_score": 0,
  "summary": "",
  "strengths": [],
  "weaknesses": [],
  "skills": [
    {{
      "name": "",
      "score": 0,
      "evidence": ""
    }}
  ],
  "recommendation": ""
}}

Use scores from 0 to 100. Base every claim on the CV text.

CV text:
{cv_text}
""".strip()