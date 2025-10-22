#!/usr/bin/env python3
"""
Resume-Job Description Matcher - Python Analysis Engine

This script extracts text from a PDF resume and matches it against
keywords extracted from a job description. It returns a JSON-formatted
result containing the match score and keyword analysis.

Skills are loaded from skills.json for easy customization and scaling.
"""

import sys
import json
import re
import os
import pdfplumber

# ========== Load Skills from JSON File ==========
def load_skills_from_json():
    """
    Muat pola keterampilan dari file skills.json.
    
    Returns:
        dict: Kamus keterampilan dan pola regex mereka
        
    Raises:
        Exception: Jika skills.json tidak dapat ditemukan atau diuraikan
    """
    # Dapatkan direktori tempat skrip ini berada
    script_dir = os.path.dirname(os.path.abspath(__file__))
    skills_file = os.path.join(script_dir, 'skills.json')
    
    try:
        with open(skills_file, 'r', encoding='utf-8') as f:
            skills_data = json.load(f)
        
        # Ratakan kamus bersarang menjadi satu kamus
        # misalnya, {"programming_languages": {"python": "...", "java": "..."}, ...}
        # menjadi {"python": "...", "java": "...", ...}
        flat_skills = {}
        for category, skills in skills_data.items():
            if isinstance(skills, dict):
                flat_skills.update(skills)
        
        if not flat_skills:
            raise Exception("Tidak ada keterampilan yang ditemukan dalam skills.json")
        
        return flat_skills
    
    except FileNotFoundError:
        raise Exception(f"skills.json tidak ditemukan di {skills_file}")
    except json.JSONDecodeError:
        raise Exception("skills.json bukan JSON yang valid")

# Load skills at startup
SKILL_PATTERNS = load_skills_from_json()

# Create a compiled regex for fast matching
def create_skill_pattern(skill_dict):
    """Buat pola regex gabungan dari kamus keterampilan."""
    patterns = '|'.join(f'({pattern})' for pattern in skill_dict.values())
    return re.compile(patterns, re.IGNORECASE)

SKILL_PATTERN = create_skill_pattern(SKILL_PATTERNS)


def extract_pdf_text(pdf_path):
    """
    Ekstrak teks dari semua halaman file PDF.
    
    Args:
        pdf_path (str): Jalur ke file PDF
        
    Returns:
        str: Teks gabungan dari semua halaman
        
    Raises:
        Exception: Jika PDF tidak dapat dibaca
    """
    try:
        resume_text = ""
        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                page_text = page.extract_text()
                if page_text:
                    resume_text += page_text + "\n"
        
        if not resume_text.strip():
            raise Exception("Tidak ada teks yang dapat diekstrak dari PDF.")
        
        return resume_text
    
    except FileNotFoundError:
        raise Exception(f"File PDF tidak ditemukan: {pdf_path}")
    except pdfplumber.exceptions.PDFException as e:
        raise Exception(f"Kesalahan membaca PDF: {str(e)}")
    except Exception as e:
        raise Exception(f"Kesalahan mengekstrak teks dari PDF: {str(e)}")


def find_skills(text):
    """
    Temukan semua keterampilan dalam teks yang diberikan menggunakan pola regex dari skills.json.
    
    Args:
        text (str): Teks untuk dicari keterampilan
        
    Returns:
        set: Set keterampilan unik yang ditemukan (dipetakan ke nama keterampilan dari skills.json)
    """
    if not text:
        return set()
    
    text_lower = text.lower()
    found_skills = set()
    
    # Periksa setiap pola keterampilan terhadap teks
    for skill_name, pattern in SKILL_PATTERNS.items():
        try:
            # Cari pola dalam teks
            if re.search(pattern, text_lower, re.IGNORECASE):
                found_skills.add(skill_name)
        except re.error as e:
            # Lewati pola regex yang tidak valid
            print(f"Peringatan: Pola regex tidak valid untuk '{skill_name}': {str(e)}", file=sys.stderr)
            continue
    
    return found_skills


def calculate_match_score(found_count, total_count):
    """
    Hitung skor kecocokan sebagai persentase.
    
    Args:
        found_count (int): Jumlah kata kunci yang ditemukan dalam resume
        total_count (int): Total jumlah kata kunci dalam deskripsi pekerjaan
        
    Returns:
        float: Skor kecocokan sebagai persentase (0-100)
    """
    if total_count == 0:
        return 0.0
    
    score = (found_count / total_count) * 100
    return min(100.0, max(0.0, score))  # Jepit antara 0-100


def main():
    """
    Fungsi utama: mengatur alur kerja analisis.
    """
    try:
        # ========== Validasi Argumen ==========
        if len(sys.argv) != 3:
            raise Exception("Jumlah argumen tidak valid. Diharapkan: pdf_path dan job_description")
        
        pdf_path = sys.argv[1]
        jd_text = sys.argv[2]
        
        # ========== Ekstrak Teks PDF ==========
        resume_text = extract_pdf_text(pdf_path)
        
        # ========== Temukan Keterampilan di Kedua Teks ==========
        resume_skills = find_skills(resume_text)
        jd_skills = find_skills(jd_text)
        
        # ========== Tangani Set Keterampilan Kosong ==========
        if len(jd_skills) == 0:
            result = {
                "score": 0,
                "found": [],
                "missing": [],
                "error": "Tidak ada keterampilan yang dikenali ditemukan dalam deskripsi pekerjaan."
            }
        else:
            # ========== Hitung Kecocokan ==========
            found_keywords = sorted(list(jd_skills.intersection(resume_skills)))
            missing_keywords = sorted(list(jd_skills.difference(resume_skills)))
            score_percentage = calculate_match_score(len(found_keywords), len(jd_skills))
            
            # ========== Format Output ==========
            result = {
                "score": round(score_percentage),
                "found": found_keywords,
                "missing": missing_keywords,
                "error": None
            }
        
        # ========== Output JSON ==========
        print(json.dumps(result))
        return 0
    
    except Exception as e:
        # Terjadi kesalahan selama pemrosesan
        result = {
            "score": 0,
            "found": [],
            "missing": [],
            "error": str(e)
        }
        print(json.dumps(result))
        return 1


if __name__ == "__main__":
    sys.exit(main())
