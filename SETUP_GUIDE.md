# 🚀 Step-by-Step Setup Guide
## Separate Frontend & Backend Structure

---

## 📁 **Your New Project Structure**

```
D:\capstone\
│
├── neighborhood-portal-frontend/     ← Angular 21
│   ├── src/
│   │   ├── app/
│   │   │   ├── auth/
│   │   │   ├── core/
│   │   │   ├── dashboard/
│   │   │   └── requests/
│   │   ├── environments/
│   │   └── styles.css
│   ├── package.json
│   └── angular.json
│
├── neighborhood-portal-backend/      ← Node.js + Express
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── index.ts
│   ├── database/
│   │   └── schema.sql
│   ├── package.json
│   └── .env (you'll create this)
│
└── README.md                         ← Master guide
```

---

## ✅ **Step-by-Step Installation**

### **STEP 1: Database Setup**

Open PowerShell and run:

```powershell
# Login to MySQL
mysql -u root -p

# Then in MySQL prompt, run:
CREATE DATABASE neighborhood_portal CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE neighborhood_portal;
source D:/capstone/neighborhood-portal-backend/database/schema.sql;
exit;
```

**Alternative (PowerShell one-liner):**
```powershell
Get-Content "D:\capstone\neighborhood-portal-backend\database\schema.sql" | mysql -u root -p neighborhood_portal
```

✅ **Verify:** `mysql -u root -p -e "USE neighborhood_portal; SHOW TABLES;"`

Should show: `Users` and `HelpRequests`

---

### **STEP 2: Backend Installation**

**Open Terminal 1 (PowerShell):**

```powershell
# Navigate to backend
cd D:\capstone\neighborhood-portal-backend

# Install dependencies
npm install

# Create environment file
Copy-Item .env.example .env

# Edit the .env file
notepad .env
```

**Edit `.env` file with YOUR MySQL password:**
```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD_HERE
DB_NAME=neighborhood_portal
JWT_SECRET=my_super_secret_key_12345_change_this
```

**Start the backend server:**
```powershell
npm run dev
```

✅ **Success looks like:**
```
✓ Database connected successfully
✓ Server is running on port 3000
✓ Environment: development
```

**Keep this terminal running!**

---

### **STEP 3: Frontend Installation**

**Open Terminal 2 (NEW PowerShell window):**

```powershell
# Navigate to frontend
cd D:\capstone\neighborhood-portal-frontend

# Install dependencies
npm install

# Start Angular dev server
npm start
```

✅ **Success looks like:**
```
** Angular Live Development Server is listening on localhost:4200 **
✔ Compiled successfully
```

**Keep this terminal running too!**

---

### **STEP 4: Open in Browser**

Navigate to: **`http://localhost:4200`**

You should see the **Login page** 🎉

---

## 🧪 **Testing the Application**

### **Create a Resident Account:**

1. Click **"Register here"**
2. Fill in:
   - Name: `John Doe`
   - Email: `john@example.com`
   - Location: `123 Main Street`
   - Role: **Resident (Request Help)**
   - Password: `password123`
3. Click **"Register"**
4. You'll be logged in automatically → Dashboard

### **Create a Help Request:**

1. Click **"Create New Request"**
2. Fill in:
   - Title: `Need plumbing help`
   - Category: `Plumbing`
   - Description: `Kitchen sink is leaking badly`
3. Click **"Create Request"**
4. See your request in the dashboard

### **Create a Helper Account:**

1. **Logout** (button in dashboard)
2. Click **"Register here"** again
3. Fill in:
   - Name: `Jane Smith`
   - Email: `jane@example.com`
   - Location: `456 Oak Avenue`
   - Role: **Helper (Provide Help)**
   - Password: `password123`
4. Click **"Register"**

### **Accept a Request (as Helper):**

1. You'll see available requests
2. Click **"Accept"** on John's request
3. Click **"Start Work"**
4. Click **"Mark Complete"**

✅ **You've successfully tested the full workflow!**

---

## 🔍 **Verify Everything is Working**

### Check Backend API:
```powershell
# Health check
curl http://localhost:3000/health

# Should return: {"success":true,"message":"Server is running"}
```

### Check Database:
```powershell
mysql -u root -p -e "USE neighborhood_portal; SELECT * FROM Users;"
```

You should see your registered users!

---

## 🎯 **What You Have Now**

Two **separate** projects:

### **Frontend (Angular):**
- Location: `D:\capstone\neighborhood-portal-frontend`
- Runs on: `http://localhost:4200`
- Terminal: Keep running `npm start`

### **Backend (Node.js):**
- Location: `D:\capstone\neighborhood-portal-backend`
- Runs on: `http://localhost:3000`
- Terminal: Keep running `npm run dev`

---

## ⚠️ **Common Issues**

### **"Port 3000 already in use"**
```powershell
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process -Force
```

### **"Port 4200 already in use"**
```powershell
Get-Process -Id (Get-NetTCPConnection -LocalPort 4200).OwningProcess | Stop-Process -Force
```

### **"Database connection failed"**
- Check MySQL is running: `Get-Service MySQL*`
- Verify password in `backend\.env`
- Test connection: `mysql -u root -p`

### **"Cannot find module"**
```powershell
# Backend
cd neighborhood-portal-backend
npm install

# Frontend
cd neighborhood-portal-frontend
npm install
```

---

## 🎓 **Development Workflow**

### **Making Changes:**

**Frontend changes:**
1. Edit files in `neighborhood-portal-frontend/src/app/`
2. Angular auto-reloads in browser
3. No restart needed

**Backend changes:**
1. Edit files in `neighborhood-portal-backend/src/`
2. Nodemon auto-restarts server
3. No manual restart needed

### **Stop Servers:**
Press `Ctrl + C` in each terminal

### **Restart:**
```powershell
# Terminal 1 - Backend
cd D:\capstone\neighborhood-portal-backend
npm run dev

# Terminal 2 - Frontend
cd D:\capstone\neighborhood-portal-frontend
npm start
```

---

## 📦 **Folder Contents**

### **Frontend Folder:**
- All Angular code
- UI components
- Services for API calls
- Route guards
- Styling

### **Backend Folder:**
- Express server
- REST API endpoints
- Database connection
- Authentication logic
- Business logic

### **They communicate via:**
- Frontend calls: `http://localhost:3000/api/*`
- Backend responds with JSON

---

## ✅ **You're All Set!**

Both frontend and backend are now in **separate folders** and running independently.

- ✅ Frontend: `neighborhood-portal-frontend`
- ✅ Backend: `neighborhood-portal-backend`
- ✅ Database: MySQL `neighborhood_portal`

**Happy Coding! 🚀**
