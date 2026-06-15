# 🚀 RoundOne – AI Mock Interview & Career Preparation Platform

RoundOne is a full-stack AI-powered interview preparation platform designed to help students, freshers, and job seekers prepare for placements and professional interviews.

The platform provides realistic mock interviews, resume analysis, coding practice, and performance analytics in a single dashboard. Users can identify skill gaps, improve interview performance, track progress, and build confidence for technical and HR interviews.

---

## 🌐 Live Demo

🔗 https://interview-prep-three-brown.vercel.app/

---

## ✨ Features

### 🎤 AI Mock Interviews
- Role-based interview preparation
- Technical and HR interview simulations
- Timed interview rounds
- Realistic interview experience
- Structured interview workflow

### 📄 Resume Review
- Resume evaluation and analysis
- Skill alignment checking
- Identification of missing skills
- Actionable improvement suggestions
- Candidate profile assessment

### 💻 Coding Practice
- Curated coding challenges
- Difficulty-based problem sets
- Guided hints and feedback
- Problem-solving skill development
- Coding performance tracking

### 📊 Performance Analytics
- Session history tracking
- Score trends visualization
- Performance insights
- Role-wise progress analysis
- Personalized recommendations

### 🔐 Authentication & User Management
- Secure user authentication
- Personalized dashboard
- Session management
- User-specific progress tracking

---

## 🎯 Project Highlights

- Full Stack Web Application
- AI-Powered Interview Preparation
- Resume Review & Skill Gap Analysis
- Coding Assessment Platform
- Performance Analytics Dashboard
- Modern Responsive User Interface
- Database Integration with Prisma
- Production Deployment on Vercel

---

## 🛠️ Tech Stack

### Frontend
- Next.js 15
- React 19
- TypeScript
- Tailwind CSS 4

### Backend
- Next.js API Routes
- Server Actions

### Database
- SQLite
- Prisma ORM

### Tools & Platforms
- Git
- GitHub
- VS Code
- Vercel

---

## 🏗️ System Architecture

```text
User
 │
 ▼
Authentication
 │
 ▼
Dashboard
 │
 ├──────────────┬──────────────┬──────────────┐
 ▼              ▼              ▼              ▼
Mock         Resume         Coding       Analytics
Interview    Review         Practice     Dashboard
 │              │              │              │
 └──────────────┴──────────────┴──────────────┘
                     │
                     ▼
                 SQLite DB
                     │
                     ▼
                 Prisma ORM

---

## 🚀 Getting Started

### Clone Repository

```bash
git clone https://github.com/Akshaysahu9/interview-prep.git
```

### Navigate to Project Directory

```bash
cd interview-prep
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

```bash
copy .env.example .env
```

### Setup Database

```bash
npx prisma db push
```

### Start Development Server

```bash
npm run dev
```

Open your browser and visit:

```text
http://localhost:3000
```

---

## ⚙️ Environment Variables

| Variable | Required | Description |
|-----------|-----------|-------------|
| DATABASE_URL | Yes | SQLite database connection string |
| OPENAI_API_KEY | No | Optional AI evaluation support |

---

## 📜 Available Scripts

```bash
npm run dev
npm run build
npm run start
npx prisma studio
```

---

## 🎓 Use Cases

- Campus Placement Preparation
- Technical Interview Practice
- HR Interview Preparation
- Resume Improvement
- Coding Skill Development
- Internship Preparation
- Career Readiness Assessment

---

## 🔮 Future Enhancements

- AI-Powered Interview Feedback
- Voice-Based Mock Interviews
- Video Interview Analysis
- Company-Specific Interview Tracks
- AI Career Guidance
- Job Recommendation System
- ATS Resume Scoring
- Advanced Performance Reports

---

## 👨‍💻 Author

**Akshay gupta**

B.Tech Computer Science Engineering

📧 Email: Akshayguptasahu@gmail.com

💼 LinkedIn: https://linkedin.com/in/akshay-gupta-97b6323a7

🐙 GitHub: https://github.com/Akshaysahu9

---

## ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub.

---

### Built with ❤️ using Next.js, React, TypeScript, Prisma, and Modern Web Technologies.
