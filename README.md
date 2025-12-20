# Neighborhood Community Help Portal

A production-ready full-stack application with **separate frontend and backend** folders.

## 📁 Project Structure

```
capstone/
├── neighborhood-portal-frontend/    ← Angular 21 Application
│   ├── src/
│   ├── package.json
│   └── angular.json
│
├── neighborhood-portal-backend/     ← Node.js + Express API
│   ├── src/
│   ├── database/
│   ├── package.json
│   └── tsconfig.json
│
└── README.md                        ← This file
```

---

## 🚀 Quick Start Guide

### **Step 1: Set Up Database**

```powershell
mysql -u root -p
```

```sql
CREATE DATABASE neighborhood_portal CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE neighborhood_portal;
source D:/capstone/neighborhood-portal-backend/database/schema.sql;
exit;
```

Or use PowerShell:
```powershell
Get-Content ".\neighborhood-portal-backend\database\schema.sql" | mysql -u root -p neighborhood_portal
```

---

### **Step 2: Backend Setup**

**Terminal 1 - Backend:**
```powershell
cd D:\capstone\neighborhood-portal-backend

# Install dependencies
npm install

# Create .env file
Copy-Item .env.example .env

# Edit .env with your MySQL credentials
# Then start the server
npm run dev
```

**Backend runs on:** `http://localhost:3000`

You should see:
```
✓ Database connected successfully
✓ Server is running on port 3000
```

---

### **Step 3: Frontend Setup**

**Terminal 2 - Frontend:**
```powershell
cd D:\capstone\neighborhood-portal-frontend

# Install dependencies
npm install

# Start Angular dev server
npm start
```

**Frontend runs on:** `http://localhost:4200`

---

## 📝 Environment Configuration

### **Backend (.env file)**

Create `neighborhood-portal-backend\.env`:
```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=neighborhood_portal
JWT_SECRET=your_super_secret_jwt_key_change_in_production
```

### **Frontend (environment.ts)**

Update `neighborhood-portal-frontend\src\environments\environment.ts`:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```

---

## 🧪 Testing the Application

### **1. Open Browser**
Navigate to: `http://localhost:4200`

### **2. Register a User**
- Click "Register here"
- Fill in the form (choose "Resident" or "Helper" role)
- Submit

### **3. Test Features**
- **As Resident:** Create help requests
- **As Helper:** Accept and complete requests
- View dashboard with statistics

---

## 📚 API Endpoints

**Base URL:** `http://localhost:3000/api`

### Authentication
```
POST   /users/register
POST   /users/login
GET    /users/me (protected)
```

### Requests
```
POST   /requests (Residents only)
GET    /requests (All authenticated)
GET    /requests/:id
PUT    /requests/:id/status (Residents & Helpers)
```

---

## 🗄️ Database Schema

### Users Table
- id, name, contact_info (unique), location, role, password, created_at

### HelpRequests Table
- id, resident_id (FK), helper_id (FK), title, description, category, status, attachments, created_at

**Status Workflow:**
```
pending → accepted → in_progress → completed
```

---

## 🛠️ Development

### Backend Development
```powershell
cd neighborhood-portal-backend
npm run dev          # Auto-restart with nodemon
npm run build        # Compile TypeScript
npm start            # Run compiled code
```

### Frontend Development
```powershell
cd neighborhood-portal-frontend
npm start            # Dev server with hot reload
npm run build        # Production build
npm test             # Run tests
```

---

## 🌐 Deployment

### Frontend (Static Hosting)
```powershell
cd neighborhood-portal-frontend
npm run build
```
Deploy `dist/neighborhood-portal/browser` to Netlify, Vercel, or any static host.

### Backend (Node.js Hosting)
```powershell
cd neighborhood-portal-backend
npm run build
```
Deploy to Heroku, Railway, Render, or AWS.

Update production environment variables accordingly.

---

## 🔧 Troubleshooting

### Port Already in Use
```powershell
# Kill process on port 3000
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process -Force

# Kill process on port 4200
Get-Process -Id (Get-NetTCPConnection -LocalPort 4200).OwningProcess | Stop-Process -Force
```

### Database Connection Failed
- Verify MySQL is running
- Check credentials in `backend\.env`
- Ensure database exists: `mysql -u root -p -e "SHOW DATABASES;"`

### CORS Errors
- Ensure backend is running on port 3000
- Check `apiUrl` in frontend `environment.ts`

---

## 📖 Documentation

- **Frontend README:** [neighborhood-portal-frontend/README.md](neighborhood-portal-frontend/README.md)
- **Backend README:** [neighborhood-portal-backend/database/README.md](neighborhood-portal-backend/database/README.md)
- **Quick Start:** [neighborhood-portal-frontend/QUICKSTART.md](neighborhood-portal-frontend/QUICKSTART.md)

---

## 🎯 Tech Stack

**Frontend:**
- Angular 21 (Standalone Components)
- Angular Material
- TypeScript
- RxJS

**Backend:**
- Node.js + Express
- TypeScript
- MySQL 8.0+
- JWT Authentication
- bcrypt

**Architecture:**
- Clean separation of concerns
- RESTful API design
- Role-based access control
- Secure authentication

---

## ✅ Features

- ✅ User registration & authentication
- ✅ Role-based dashboards (Resident/Helper)
- ✅ Create and manage help requests
- ✅ Request status tracking
- ✅ Minimal professional UI
- ✅ Complete API with validation
- ✅ Security best practices

---

## 📄 License

MIT License - Free for educational and commercial use.

---

**Status:** ✅ Production Ready | Interview Grade | Portfolio Quality
