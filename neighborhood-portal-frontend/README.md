# Neighborhood Community Help Portal

A production-ready, full-stack community-driven platform where residents can request local help, helpers can accept and complete tasks, and both can track progress in real time.

## 🎯 Project Overview

This application enables neighborhood residents to connect with community helpers for various services including plumbing, grocery shopping, tutoring, and more. Built with modern web technologies and following industry-standard architecture patterns.

### Key Features
- ✅ User registration and authentication with JWT
- ✅ Role-based access control (Resident, Helper, Admin)
- ✅ Create and manage help requests
- ✅ Real-time request status tracking
- ✅ Dashboard with statistics and analytics
- ✅ Minimal, professional UI design
- ✅ Fully validated API with error handling

## 📚 Tech Stack

### Frontend
- **Angular 21** (Standalone Components)
- **Angular Material** - UI component library
- **TypeScript** (Strict mode)
- **RxJS** - Reactive programming
- **Angular Router** - Client-side routing
- **Reactive Forms** - Form validation

### Backend
- **Node.js** + **Express** 4.x
- **TypeScript** (Strict mode)
- **MySQL 8.0+** - Database
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing

### Architecture Patterns
- Clean architecture with separation of concerns
- Service-based API communication
- Repository pattern for data access
- Interceptors for auth and error handling
- Route guards for authorization

## 🗂️ Project Structure

```
neighborhood-portal/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.ts
│   │   ├── controllers/
│   │   │   ├── userController.ts
│   │   │   └── requestController.ts
│   │   ├── services/
│   │   │   ├── userService.ts
│   │   │   └── requestService.ts
│   │   ├── middleware/
│   │   │   ├── auth.ts
│   │   │   ├── errorHandler.ts
│   │   │   └── validation.ts
│   │   ├── routes/
│   │   │   ├── userRoutes.ts
│   │   │   └── requestRoutes.ts
│   │   ├── types/
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── database/
│   │   ├── schema.sql
│   │   └── README.md
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── src/
│   ├── app/
│   │   ├── auth/
│   │   │   ├── login/
│   │   │   └── registration/
│   │   ├── core/
│   │   │   ├── guards/
│   │   │   │   ├── auth.guard.ts
│   │   │   │   └── role.guard.ts
│   │   │   ├── services/
│   │   │   │   ├── auth.service.ts
│   │   │   │   ├── request.service.ts
│   │   │   │   └── user.service.ts
│   │   │   └── interceptors/
│   │   │       ├── auth.interceptor.ts
│   │   │       └── error.interceptor.ts
│   │   ├── dashboard/
│   │   │   └── dashboard.component.ts
│   │   ├── requests/
│   │   │   ├── help-request/
│   │   │   └── request-list/
│   │   ├── shared/
│   │   │   ├── models/
│   │   │   │   └── types.ts
│   │   │   └── components/
│   │   │       └── unauthorized/
│   │   ├── app.config.ts
│   │   ├── app.routes.ts
│   │   └── app.ts
│   ├── environments/
│   │   ├── environment.ts
│   │   └── environment.prod.ts
│   └── styles.css
│
├── angular.json
├── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js 20.x or higher
- MySQL 8.0 or higher
- npm 9.x or higher

### 1. Database Setup

#### Create Database
```bash
mysql -u root -p
```

```sql
CREATE DATABASE neighborhood_portal CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE neighborhood_portal;
```

#### Run Schema
```bash
cd backend
mysql -u root -p neighborhood_portal < database/schema.sql
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=neighborhood_portal
JWT_SECRET=your_super_secret_jwt_key_change_this
```

Start backend server:
```bash
# Development mode
npm run dev

# Production mode
npm run build
npm start
```

Backend runs on: `http://localhost:3000`

### 3. Frontend Setup

```bash
cd neighborhood-portal
npm install
```

Update `src/environments/environment.ts` if needed:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```

Start Angular development server:
```bash
npm start
```

Frontend runs on: `http://localhost:4200`

## 📊 Database Schema

### Users Table
| Column | Type | Constraints |
|--------|------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT |
| name | VARCHAR(255) | NOT NULL |
| contact_info | VARCHAR(255) | NOT NULL, UNIQUE |
| location | VARCHAR(255) | NOT NULL |
| role | ENUM | resident, helper, admin |
| password | VARCHAR(255) | NOT NULL (bcrypt hashed) |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |

### HelpRequests Table
| Column | Type | Constraints |
|--------|------|-------------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT |
| resident_id | INT | FOREIGN KEY → Users(id) |
| helper_id | INT | FOREIGN KEY → Users(id), NULLABLE |
| title | VARCHAR(255) | NOT NULL |
| description | TEXT | NOT NULL |
| category | VARCHAR(100) | NOT NULL |
| status | ENUM | pending, accepted, in_progress, completed |
| attachments | TEXT | NULLABLE |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP ON UPDATE |

## 🔐 API Endpoints

### Authentication
```http
POST /api/users/register
POST /api/users/login
GET  /api/users/me (protected)
```

### Users
```http
GET  /api/users/:id (protected)
PUT  /api/users/:id (protected)
```

### Help Requests
```http
POST /api/requests (Residents only)
GET  /api/requests (All authenticated users)
GET  /api/requests/:id
PUT  /api/requests/:id/status (Residents & Helpers)
```

### Query Parameters for GET /api/requests
- `status` - Filter by status (pending, accepted, in_progress, completed)
- `resident_id` - Filter by resident
- `helper_id` - Filter by helper (use 'null' for unassigned)

## 🔄 Status Workflow

Requests follow a strict status flow:
```
pending → accepted → in_progress → completed
```

Invalid transitions are rejected with a 400 error.

## 🎨 UI Design Principles

This application follows **strict minimal design** principles:

✅ **DO:**
- Use neutral colors (grays, off-white)
- Single accent color (blue)
- Clean spacing and typography
- Subtle hover effects (opacity, underline)
- Dashboard-style cards and tables
- Angular Material components only

❌ **DON'T:**
- No gradients
- No glassmorphism
- No excessive animations
- No neon or flashy colors
- No more than 2-3 colors

## 🔒 Security Features

- Password hashing with bcrypt
- JWT-based authentication
- HTTP-only tokens recommended for production
- Role-based authorization
- Input validation on both frontend and backend
- SQL injection prevention with parameterized queries
- CORS configuration
- Error handling without exposing sensitive data

## 🧪 Testing the Application

### Health Check
```bash
curl http://localhost:3000/health
```

### Register a User
```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "contact_info": "john@example.com",
    "location": "123 Main St",
    "role": "resident",
    "password": "password123"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "contact_info": "john@example.com",
    "password": "password123"
  }'
```

### Create Request (with token)
```bash
curl -X POST http://localhost:3000/api/requests \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Need plumbing help",
    "description": "Kitchen sink is leaking",
    "category": "Plumbing"
  }'
```

## 📱 User Flows

### Resident Flow
1. Register account → Select "Resident" role
2. Login → Redirected to dashboard
3. Create new help request
4. Track request status
5. Accept/decline helper offers

### Helper Flow
1. Register account → Select "Helper" role
2. Login → Redirected to dashboard
3. Browse available requests
4. Accept request
5. Update status to "in progress"
6. Mark as completed

## 🌐 Deployment

### Frontend (Angular)
```bash
npm run build
```
Deploy `dist/neighborhood-portal/browser` to static hosting (Netlify, Vercel, etc.)

### Backend (Node.js)
```bash
cd backend
npm run build
```
Deploy to:
- Heroku
- AWS EC2
- DigitalOcean
- Railway
- Render

### Environment Variables for Production
Update these in your hosting platform:
- `DB_HOST`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `JWT_SECRET` (use a strong random key)
- `NODE_ENV=production`

## 🛠️ Development

### Frontend Development
```bash
npm start
```
Hot reload at `http://localhost:4200`

### Backend Development
```bash
cd backend
npm run dev
```
Auto-restart with nodemon

## 📝 API Response Format

All API responses follow this structure:

```typescript
{
  success: boolean;
  data?: any;
  message?: string;
  error?: string;
}
```

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error message here"
}
```

## 🎓 Interview-Ready Features

This project demonstrates:
- ✅ Full-stack development skills
- ✅ RESTful API design
- ✅ Database design and normalization
- ✅ Authentication & Authorization
- ✅ Clean code architecture
- ✅ TypeScript best practices
- ✅ Reactive programming with RxJS
- ✅ Modern Angular patterns
- ✅ Security best practices
- ✅ Error handling strategies
- ✅ Professional UI/UX design

## 📄 License

MIT License - Free to use for educational and commercial purposes.

## 👨‍💻 Author

Built as a final-year capstone project demonstrating production-ready full-stack development skills.

---

**Note:** This is a complete, production-ready application suitable for portfolio demonstration, final-year projects, or as a foundation for real-world deployment.
