# PocketFinance — Micro SaaS for Personal Finance Management

PocketFinance is an educational project designed to practice full-stack software engineering using:

- **Java + Spring Boot (Spring Web, Spring Data, Flyway)**
- **PostgreSQL + Docker**
- **React + Next.js**
- **LLM integration for natural-language expense input**

The goal of this project is to build solid engineering foundations, while creating a real product that can be showcased in a portfolio or internship application.

---

## 🚀 Project Status
In development — **Sprint 1: Initial Setup (backend + infrastructure)**

---

## 📦 Tech Stack

### **Backend**
- Java 21
- Spring Boot 3.x
- Spring Web
- Spring Data JPA
- Flyway
- Spring Validation
- Testcontainers (future)
- Maven

### **Frontend**
- React + Next.js (TypeScript)
- React Query
- Axios

### **Infrastructure**
- Docker + Docker Compose
- PostgreSQL 15
- Adminer (database UI)
- Railway / Render / Vercel (deployment)

---

## 🗂 Project Structure
pocketfinance/
├── backend/
│     ├── src/main/java/… (Spring Boot source code)
│     ├── src/main/resources/db/migration/ (Flyway migrations)
│     └── pom.xml
│
├── frontend/
│     ├── pages/
│     ├── components/
│     └── package.json
│
├── docker-compose.yml
└── README.md

---

## 🐘 Database Setup (Docker)

Start PostgreSQL and Adminer:

```bash
docker compose up -d
```

▶️ Running the Backend (development)
Inside the backend folder:
```
./mvnw spring-boot:run
```
Health check:
`curl http://localhost:8080/health`

▶️ Running the Frontend (development)

```
npm install
npm run dev
```

Visit:
`http://localhost:3000`

📌 Git Workflow
1.	Create a new branch from main
2.	Make small, focused commits
3.	Open a Pull Request targeting main
4.	Request review (1 reviewer minimum)
5.	After approval → Squash & Merge

🧪 Testing (future)
•	Integration tests using Testcontainers
•	Basic unit tests for services and controllers

🤖 LLM Integration (future)

The endpoint /api/parse-text will accept natural language inputs such as:

“I spent 45 dollars at the grocery store yesterday.”

Expected JSON output:
```Json
{
  "amount": 45,
  "category": "Grocery",
  "occurred_at": "2024-03-10"
}
```

👥 Authors
•	Jonathan Lameira — Tech Lead - @jlameira
•	Raphael Lameira — Developer - @Raphaelsl