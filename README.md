# TaskFlow — Full Stack Task Management System

---

## Tech Stack

**Backend**
- Node.js + Express + TypeScript
- Prisma ORM + SQLite ( replaceable with PostgreSQL)
- JWT Authentication (access + refresh token rotation)
- bcryptjs for password hashing
- express-validator for input validation
- express-rate-limit for brute-force protection

**Frontend**
- Next.js (App Router) + TypeScript
- Tailwind CSS (custom design system)
- Zustand for state management
- React Hook Form + Zod for form validation
- Axios with automatic token refresh interceptor
- react-hot-toast for notifications


### 1. Backend Setup

```bash
cd taskflow-backend

# Install dependencies
npm install

# Push schema to database and generate Prisma client
npm run db:push
npm run db:generate

# Start development server
npm run dev
```

---

### 2. Frontend Setup

```bash
cd taskflow-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

