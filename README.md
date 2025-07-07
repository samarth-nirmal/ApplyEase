# 🤖 AI-Powered Job Auto Apply System

This project automates job applications on platforms like Naukri using:
- 🧠 Generative AI (OpenAI/Gemini) to answer screening questions
- 📄 Dynamic Resume Tailoring
- ⚙️ Frontend (Angular) + Backend (.NET Core) + Scraper (Python + Playwright)

---

## 🚀 Features

- Auto-search & apply to jobs based on role, location, and experience
- AI-generated answers for custom application questions
- Resume modification tailored to job descriptions
- Tracks application status (applied, shortlisted, rejected)
- JWT-based Google OAuth2 login
- Admin/User dashboards, filtering, job history

---

## 🗂️ Project Structure

/frontend → Angular app
/backend → .NET Core Web API
/job-scraper → Python Playwright bot for job automation
/resumes/ → Resume storage

---

## 🔑 Prerequisites

You'll need your own API keys:
Gemini - For AI Generated Responses
Google OAuth2 - For Login and Signup
Naukri Account - For Scraping and Applying Jobs

> **⚠️ Do NOT commit your API keys to Git. Use environment files as shown below.**


## 🛠️ How to Run Locally

🔹 1. Clone the Repository
```
git clone https://github.com/your-username/ai-job-auto-apply.git
```
```
cd ai-job-auto-apply
```

🔹 2. Setup Angular Frontend
```
cd frontend
npm install
```
📄 src/environments/environment.ts
```
export const environment = {
  production: false,
  googleClientId: 'YOUR_GOOGLE_CLIENT_ID'
};
```

Run the frontend:
```
ng serve
```

🔹 3. Setup .NET Core Backend
```
cd backend
dotnet restore
```

📄 appsettings.Development.json
```
{
  "JwtSettings": {
    "Key": "YourJWTSecret",
    "Issuer": "YourIssuer"
  },
  "GoogleAuth": {
    "ClientId": "YOUR_GOOGLE_CLIENT_ID"
  },
  "AI": {
    "OpenAIKey": "YOUR_OPENAI_KEY"
  }
}
```

Run the backend:

```
dotnet run
```

🔹 4. Setup Python Scraper
Install dependencies:
```
cd job-scraper
pip install -r requirements.txt
```

Store your API keys and secrets in .env:

📄 .env
```
OPENAI_API_KEY=your-openai-api-key
GOOGLE_CLIENT_ID=your-client-id
```
Run the scraper:
```
python auto_apply.py
```
📦 Deployment Notes

Angular: ng build --prod → deploy dist/

Backend: deploy with IIS, Azure App Service, etc.

Python scraper can be hosted with a scheduler

👨‍💻 Contributors
Samartha Nirmal — Full Stack Dev & AI Integrator

