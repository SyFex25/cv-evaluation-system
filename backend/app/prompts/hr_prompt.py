"""
File: backend/app/prompts/hr_prompt.py
Module: Prompts
Responsibility: Builds the HR CV evaluation prompt template
"""


def build_hr_evaluation_prompt(job_description: str, cv_text: str) -> str:
    return f"""
Anda membantu staf HR menilai apakah kandidat cocok untuk lowongan tertentu.

Tulis seluruh isi jawaban dalam Bahasa Indonesia yang jelas, singkat, dan mudah dipahami staf HR.
Hindari istilah teknis AI. Jangan membuat klaim yang tidak didukung oleh CV atau deskripsi lowongan.
Nilai kandidat berdasarkan kecocokan terhadap deskripsi lowongan, bukan berdasarkan kualitas CV secara umum.

Kembalikan hanya JSON valid dengan bentuk berikut:
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

Aturan isi:
- overall_score adalah skor kecocokan kandidat dengan lowongan dari 0 sampai 100.
- summary berisi 2 sampai 4 paragraf pendek dari sudut pandang HR.
- strengths berisi 3 sampai 5 kelebihan kandidat yang relevan dengan lowongan.
- weaknesses berisi 2 sampai 5 hal yang perlu diperhatikan sebelum lanjut proses.
- skills berisi kemampuan atau kriteria utama yang relevan dengan lowongan, beserta bukti singkat dari CV.
- recommendation harus langsung menjawab apakah HR sebaiknya melanjutkan proses rekrutmen.

Deskripsi lowongan:
{job_description}

Teks CV kandidat:
{cv_text}
""".strip()
