import os
import sys
import json
from google import genai
import pdfplumber
from docx import Document
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=api_key)

def extract_text_from_pdf(file_path):
    text = ""
    with pdfplumber.open(file_path) as pdf:
        for page in pdf.pages:
            text += page.extract_text() + "\n"
    return text.strip()

def extract_text_from_docx(file_path):
    doc = Document(file_path)
    return "\n".join([para.text for para in doc.paragraphs]).strip()

def extract_resume_text(file_path):
    ext = os.path.splitext(file_path)[1].lower()
    if ext == ".pdf":
        return extract_text_from_pdf(file_path)
    elif ext in [".doc", ".docx"]:
        return extract_text_from_docx(file_path)
    return None

def process_resume_with_gemini(resume_text):
    response = client.models.generate_content(model = "gemini-2.0-flash", contents= f"""
    You are an AI specialized in parsing resumes and extracting structured data. Your task is to accurately extract key information, even when the resume lacks explicit headings or a standard format.
    Given the following resume text in a single unstructured string format, extract key details accurately. The resume may lack proper spacing, have irregular formatting, or contain merged words. Use intelligent parsing techniques to reconstruct missing spaces and identify key information.
    extract the candidate's work experience accurately
    Extract and return the data strictly in valid JSON format as follows, Just give the data in json, don't even write a extra word:
    ```json
    {{
      "full_name": "Candidate's Full Name",
      "email": "Candidate's Email Address",
      "phone_number": "Candidate's Phone Number",
      "total_experience": "Total Years of Experience (e.g., 5)" (Calculate this based on the work experience years eg. if working from dec 2023 to present, 1.3, If they are workign from Feb 2019 to March 2022 means 3.1),
      "current_job_title": "Most Recent Job Title",
      "current_company": "Current or Most Recent Employer",
      "industry": "Industry Inferred from Experience or Skills",
      "primary_skills": "Skill1", "Skill2", "Skill3", (return , seperated string)
      "secondary_skills": "SkillA", "SkillB", (return , seperated string)
      "certifications": "Certification1", "Certification2", (return , seperated string)
      "highest_qualification": "Highest Degree (e.g., Bachelor's, Master's, PhD)",
      "specialization": "Field of Study (e.g., Computer Science, Finance)",
      "graduation_year": "Year of Graduation (if available)",
      "projects"": "Project Title 1 (Tech Used)", "Project Title 2 (Tech Used)", (if available)  (return , seperated string)",
      "preferred_job_role": "Desired Job Role (if mentioned)"
      "linkedin_URL": "Linkedin URL (if mentioned and in proper url format, with or without http)"
      "Github_URL": "Github URL (if mentioned)"
      "preferredJobRole": "Get this based on Skills, Work experience and Projects" (if Mentioned)
      "preferedLocation" : "Get if there is any location mentioned in the resume in user info section" (if mentioned),
      "XPercentage" : "10th Standard% (if mentioned)",
      "XIIPercentage" : "12th Standard% (if mentioned)",
    }}
    ```
    Guidelines:
    - If explicit headings are missing, infer details from context.
    - Ensure valid JSON syntax with correct data types (strings, arrays, etc.).
    - Exclude unrelated text such as hobbies or personal interests.
    - If any information is unavailable, return "Not Mentioned" instead of leaving it blank.

    Now, extract and return the details in JSON format from the following resume:
    {resume_text}
    """)

    try:
        json_str = response.text.strip()

        
        if json_str.startswith("```json"):
            json_str = json_str[7:-3].strip()

        json_response = json.loads(json_str)
    except json.JSONDecodeError as e:
        json_response = {"error": f"Failed to parse Gemini response: {str(e)}"}

    print(json.dumps(json_response, indent=2))


if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No file provided"}))
        sys.exit(1)
    
    file_path = sys.argv[1]
    
    if not os.path.exists(file_path):
        print(json.dumps({"error": "File not found"}))
        sys.exit(1)
    
    resume_text = extract_resume_text(file_path)
    if not resume_text:
        print(json.dumps({"error": "Unsupported file format or empty text"}))
        sys.exit(1)
    
    extracted_data = process_resume_with_gemini(resume_text)
    
