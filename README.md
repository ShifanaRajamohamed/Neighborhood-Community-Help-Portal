# Help Hive - Neighborhood Community Help Portal

A full-stack web application connecting neighbors who need help with those willing to provide assistance. Built with Angular, Node.js, Express, TypeScript, and MySQL.

## 🌟 Features

### For Requesters (Residents)
- **Create Help Requests** with detailed information:
  - Title and description
  - Category (General, Plumbing, Electrical, Grocery, etc.)
  - Location (full address with privacy controls)
  - Urgency flag
  - Complexity level (Low, Medium, High)
  - Estimated duration
  - Preferred time
- **View Offers** from multiple helpers
- **Accept Helpers** to assign tasks
- **Track Progress** through request timeline
- **Auto-approved** upon registration

### For Helpers
- **Browse Available Requests** in the community
- **Make Offers** to help with specific requests
- **Update Status** (Start Task, Mark Complete)
- **View Assigned Tasks** organized by status:
  - Accepted Tasks
  - In-Progress Tasks
  - Completed Tasks
- **Requires Admin Approval** before offering help

### For Admins
- **Approve Helpers** who register
- **View All Requests** across the platform
- **Manage Requests** (delete if needed)
- **Dashboard Statistics** showing total, pending, active, and completed requests
- **User Management** capabilities

### General Features
- **JWT Authentication** with secure token storage
- **Session Persistence** - stay logged in across page refreshes
- **Role-Based Access Control** (Requester, Helper, Admin)
- **Real-time Updates** after actions
- **Responsive Design** with Tailwind CSS
- **Privacy Controls** - show full address only to involved parties

## 🛠️ Tech Stack

### Frontend
- **Angular 19** - Modern web framework with standalone components
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **RxJS** - Reactive programming
- **Signals** - State management

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **TypeScript** - Type-safe backend
- **MySQL2** - Database driver
- **JWT (jsonwebtoken)** - Authentication
- **bcrypt** - Password hashing
- **ts-node** - TypeScript execution

### Database
- **MySQL** - Relational database
- **2-Table Design**:
  - Users (with roles and approval status)
  - HelpRequests (with JSON fields for offers and timeline)

## 📋 Prerequisites

Before you start, ensure you have the following installed:
- **Node.js** v18 or higher ([Download here](https://nodejs.org/))
- **MySQL** v8 or higher ([Download here](https://dev.mysql.com/downloads/mysql/))
- **npm** (comes with Node.js) or **yarn**

## 🚀 Quick Start Guide for Teammates

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd capstone
```

### Step 2: Database Setup

**Option A: Using MySQL Command Line**
```bash
# Login to MySQL
mysql -u root -p
# Enter your MySQL password when prompted

# Create the database
CREATE DATABASE help_hive;
EXIT;

# Import the schema
mysql -u root -p help_hive < backend/database/schema.sql
# Enter password again when prompted
```

**Option B: Using MySQL Workbench**
1. Open MySQL Workbench
2. Create new schema named `help_hive`
3. Open `backend/database/schema.sql`
4. Execute the script (⚡ icon or Ctrl+Shift+Enter)

**Verify Database Setup:**
```bash
mysql -u root -p help_hive -e "SHOW TABLES;"
# Should show: HelpRequests, Users
```

### Step 3: Backend Setup

```bash
# Navigate to backend folder
cd backend

# Install all dependencies
npm install

# Create your environment file from the template
# Option A: Copy the example file (Mac/Linux)
cp .env.example .env

# Option B: Copy the example file (Windows PowerShell)
Copy-Item .env.example .env

# Option C: Manually create .env file
# Copy the contents from .env.example and create a new file named .env
```

**Edit `backend/.env` file:**
- Open the newly created `.env` file
- **Change** `DB_PASSWORD=your_mysql_password_here` to your actual MySQL password
- Save the file

**⚠️ IMPORTANT:** 
- Never commit `.env` to git (it's already in `.gitignore`)
- The `.env.example` is safe to commit (contains no secrets)

**Configure Environment Variables:**
```bash
# Copy the example file
cp .env.example .env

# Then edit .env and update DB_PASSWORD with your MySQL password
```

Or manually create `backend/.env` using the template in `.env.example`

**Start the Backend Server:**
```bash
npm run dev
```

**Success indicators:**
- ✓ Database connected successfully
- ✓ Server is running on port 3001
- ✓ Environment: development

**Keep this terminal running!** Open a new terminal for frontend.

### Step 4: Frontend Setup

```bash
# Open a NEW terminal window/tab
# Navigate to frontend folder
cd frontend

# Install all dependencies
npm install

# Start the development server
npm run dev
```

**Frontend will be available at:** http://localhost:4200

**Success indicators:**
- Application bundle generation complete
- Local server running at http://localhost:4200
- Watch mode enabled

### Step 5: Access the Application

**Open your browser and go to:** http://localhost:4200

**Test Login Credentials:**
| Role | Email | Password |
|------|-------|----------|
| Requester | john.doe@email.com | password |
| Helper | jane.smith@email.com | password |
| Admin | admin@portal.com | password |

Or **register a new account** at http://localhost:4200/register

## 🔄 Daily Development Workflow

**Starting the application:**

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```

**Stopping the servers:**
- Press `Ctrl+C` in each terminal
- Confirm with `Y` if prompted

## 👥 Default User Accounts

The database comes with three pre-configured test accounts:

| Role | Email | Password | Status | Capabilities |
|------|-------|----------|--------|-------------|
| **Requester** | john.doe@email.com | password | ✓ Approved | Create & manage help requests |
| **Helper** | jane.smith@email.com | password | ✓ Approved | Offer help on requests |
| **Admin** | admin@portal.com | password | ✓ Approved | Approve helpers, manage all requests |

### Create New Account
1. Navigate to http://localhost:4200/register
2. Fill in all required fields:
   - **Name**: Your full name
   - **Email**: Valid email address (used for login)
   - **Full Address**: Complete address with street, city, zip
   - **Role**: Choose either:
     - **Requester** - Can post help requests (auto-approved)
     - **Helper** - Can offer help (requires admin approval)
   - **Password**: Minimum 6 characters
3. Click "CREATE ACCOUNT"
4. **Requesters** are automatically approved and redirected to dashboard
5. **Helpers** must wait for admin approval before they can offer help

## 📖 How to Use

### Creating a Help Request (Requester)
1. Login as a requester
2. Navigate to Dashboard
3. Click "+ Create Request"
4. Fill in the form:
   - **Title**: Brief description (e.g., "Fix leaking sink")
   - **Description**: Detailed explanation
   - **Category**: Select from dropdown
   - **Full Address**: Your location
   - **Complexity**: Low/Medium/High
   - **Duration**: Estimated time (e.g., "2 hours")
   - **Preferred Time**: When you're available (e.g., "Weekends")
   - **Mark as Urgent**: Toggle if urgent
5. Click "POST REQUEST"

### Offering Help (Helper)
1. Login as an approved helper
2. Browse "Available Requests"
3. Click "Offer Help" on a request
4. Wait for requester to accept your offer

### Accepting Help (Requester)
1. View your request with offers
2. Review helper profiles
3. Click "Accept" on preferred helper
4. Request status changes to "Accepted"

### Completing Tasks (Helper)
1. View "My Accepted Tasks"
2. Click "Start Task" when beginning
3. Click "Finish Task" when complete
4. Request shows as "Completed"

### Approving Helpers (Admin)
1. Login as admin
2. View "Pending Helpers" section
3. Click "Approve" next to helper's name
4. Helper can now make offers

## 📁 Project Structure

```
capstone/
├── README.md                        # You are here! 📍
│
├── shared/                          # Shared types between frontend & backend
│   └── types.ts                     # Common TypeScript interfaces
│
├── backend/                         # Node.js/Express API Server
│   ├── src/
│   │   ├── config/
│   │   │   └── database.ts          # MySQL connection pool setup
│   │   ├── controllers/             # Request handlers
│   │   │   ├── adminController.ts   # Admin-only endpoints
│   │   │   ├── requestController.ts # CRUD for help requests
│   │   │   └── userController.ts    # Authentication & user management
│   │   ├── middleware/
│   │   │   ├── auth.ts              # JWT token verification
│   │   │   ├── errorHandler.ts      # Global error handling
│   │   │   └── validation.ts        # Input validation & sanitization
│   │   ├── routes/                  # API route definitions
│   │   │   ├── adminRoutes.ts       # /api/admin/*
│   │   │   ├── requestRoutes.ts     # /api/requests/*
│   │   │   └── userRoutes.ts        # /api/users/*
│   │   ├── services/                # Business logic layer
│   │   │   ├── adminService.ts      # Admin operations
│   │   │   ├── requestService.ts    # Request operations
│   │   │   └── userService.ts       # User operations
│   │   ├── types/
│   │   │   └── index.ts             # Backend-specific TypeScript types
│   │   └── index.ts                 # Express app entry point
│   ├── database/
│   │   ├── schema.sql               # Database creation script
│   │   └── fix_data.sql             # JSON field cleanup (optional)
│   ├── .env                         # Environment variables (DO NOT COMMIT!)
│   ├── .gitignore                   # Git ignore rules
│   ├── package.json                 # Backend dependencies
│   └── tsconfig.json                # TypeScript configuration
│
└── frontend/                        # Angular 18 Application
    ├── src/
    │   ├── app/
    │   │   ├── components/          # UI Components (all standalone)
    │   │   │   ├── create-request.component.ts   # Request creation form
    │   │   │   ├── dashboard.component.ts        # Role-specific dashboards
    │   │   │   ├── landing.component.ts          # Homepage
    │   │   │   ├── login.component.ts            # Login form
    │   │   │   ├── navbar.component.ts           # Navigation bar
    │   │   │   ├── register.component.ts         # Registration form
    │   │   │   └── request-card.component.ts     # Request display card
    │   │   ├── guards/              # Route protection
    │   │   │   ├── auth.guard.ts    # Must be logged in
    │   │   │   ├── helper.guard.ts  # Must be approved helper
    │   │   │   └── requester.guard.ts # Must be requester
    │   │   ├── interceptors/
    │   │   │   └── auth.interceptor.ts # Auto-attach JWT to requests
    │   │   ├── models/              # Frontend type aliases
    │   │   │   ├── user.model.ts    # Re-exports from shared
    │   │   │   └── request.model.ts # Re-exports from shared
    │   │   ├── services/
    │   │   │   └── data.service.ts  # HTTP API client + Signal state
    │   │   ├── app-routing.module.ts # Route definitions
    │   │   ├── app.component.ts     # Root component
    │   │   └── app.module.ts        # App module configuration
    │   └── main.ts                  # Bootstrap entry point
    ├── angular.json                 # Angular CLI configuration
    ├── package.json                 # Frontend dependencies
    └── tsconfig.json                # TypeScript configuration
```

### Key Files Explained

| File | Purpose |
|------|---------|
| `backend/.env` | **SECRET!** Database credentials, JWT secret |
| `backend/src/index.ts` | Express server setup, middleware, routes |
| `backend/database/schema.sql` | Database structure + sample data |
| `shared/types.ts` | TypeScript interfaces shared across frontend/backend |
| `frontend/src/app/services/data.service.ts` | API client + reactive state management |
| `frontend/src/app/app-routing.module.ts` | URL routing + guard assignments |

## 🗄️ Database Schema

### Users Table
```sql
- id (PRIMARY KEY)
- name
- contact_info (UNIQUE)
- email
- location
- full_address
- abstract_address
- role (ENUM: resident, helper, admin, requester)
- password (hashed with bcrypt)
- is_approved (BOOLEAN)
- created_at (TIMESTAMP)
```

### HelpRequests Table
```sql
- id (PRIMARY KEY)
- resident_id (FOREIGN KEY → Users)
- requester_id
- requester_name
- helper_id (FOREIGN KEY → Users, nullable)
- helper_name
- title
- description
- category
- status (VARCHAR: pending, offered, accepted, in_progress, completed)
- attachments
- full_address
- abstract_address
- is_urgent (BOOLEAN)
- complexity (ENUM: Low, Medium, High)
- estimated_duration
- preferred_time
- offers (JSON array of helper offers)
- timeline (JSON array of status changes)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

## 🔌 API Endpoints

### Authentication
- `POST /api/users/register` - Register new user
- `POST /api/users/login` - Login user

### Users
- `GET /api/users` - Get all users (authenticated)
- `PUT /api/users/approve/:id` - Approve helper (admin only)

### Requests
- `GET /api/requests` - Get all requests (authenticated)
- `POST /api/requests` - Create request (requester only)
- `GET /api/requests/:id` - Get single request
- `PUT /api/requests/:id/status` - Update request status
- `PUT /api/requests/:id/offers` - Make offer (helper only)
- `PUT /api/requests/:id/accept/:helperId` - Accept offer (requester only)
- `DELETE /api/requests/:id` - Delete request (admin or owner)

### Admin
- `GET /api/admin/requests` - Get all requests with filters
- `GET /api/admin/requests/:id` - Get request details
- `PUT /api/admin/requests/:id/status` - Update status (admin override)
- `GET /api/admin/stats` - Get dashboard statistics

## 🔐 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: 7-day token expiration
- **HTTP-Only Tokens**: Stored in localStorage (client-side)
- **Role-Based Access**: Middleware authorization
- **Input Validation**: Request validation middleware
- **SQL Injection Prevention**: Parameterized queries
- **CORS Protection**: Configured for development

## 🎨 Design Highlights

- **Color Scheme**: Yellow/Amber theme ("Hive" branding)
- **Typography**: Serif headings, sans-serif body
- **Components**: Card-based layout
- **Animations**: Smooth transitions and hover effects
- **Icons**: SVG icons for better quality
- **Responsive**: Mobile-first design

## 🐛 Common Issues & Solutions

### ❌ "Cannot connect to MySQL"
**Problem:** Backend can't connect to database
```
Error: connect ECONNREFUSED 127.0.0.1:3306
```
**Solutions:**
1. **Check MySQL is running:**
   ```bash
   # Windows
   services.msc
   # Look for MySQL80 service - ensure it's running
   
   # Or test connection
   mysql -u root -p
   ```
2. **Verify database exists:**
   ```bash
   mysql -u root -p -e "SHOW DATABASES;"
   # Should list 'help_hive'
   ```
3. **Check `.env` credentials:**
   - Open `backend/.env`
   - Verify `DB_PASSWORD` matches your MySQL root password
   - Verify `DB_NAME=help_hive`

### ❌ "Port 3001 already in use"
**Problem:** Backend port is occupied
```
Error: listen EADDRINUSE: address already in use :::3001
```
**Solutions:**
1. **Kill the process using port 3001:**
   ```bash
   # Windows PowerShell
   netstat -ano | findstr :3001
   taskkill /PID <PID_NUMBER> /F
   ```
2. **Or change the port:**
   - Edit `backend/.env`: Change `PORT=3001` to `PORT=3002`
   - Update frontend API URL in `frontend/src/app/services/data.service.ts`

### ❌ "Cannot find module '../../../../shared/types'"
**Problem:** TypeScript can't find shared types
**Solution:**
```bash
# Ensure shared folder exists at project root
cd capstone
ls shared/types.ts  # Should exist

# If frontend still has errors, restart dev server
cd frontend
# Press Ctrl+C to stop
npm run dev
```

### ❌ Frontend shows blank page
**Problem:** Application doesn't load
**Solutions:**
1. **Check browser console** (F12) for errors
2. **Verify backend is running:**
   - Open http://localhost:3001/api/users in browser
   - Should see JSON response or "Cannot GET" (both mean server is running)
3. **Clear browser cache:**
   - Press `Ctrl+Shift+Delete`
   - Clear cached images and files
   - Reload page
4. **Check localStorage:**
   - Open DevTools (F12) → Application → Local Storage
   - Delete `auth_token` if it exists
   - Refresh page

### ❌ "Cannot login" / "Invalid credentials"
**Problem:** Login fails with correct password
**Solutions:**
1. **Verify account exists:**
   ```bash
   mysql -u root -p help_hive
   SELECT email, role, is_approved FROM Users WHERE email='your@email.com';
   ```
2. **For helpers, check approval status:**
   - Helpers must be approved by admin before full access
   - Login as admin@portal.com / password
   - Go to dashboard → Approve pending helpers
3. **Password minimum length:** Ensure password is at least 6 characters
4. **Clear localStorage and retry:**
   - F12 → Application → Local Storage → Clear All
   - Try logging in again

### ❌ "401 Unauthorized" errors in console
**Problem:** API requests fail with 401
```
GET http://localhost:3001/api/requests 401 (Unauthorized)
```
**Solutions:**
1. **Token expired** (JWT tokens last 7 days)
   - Logout and login again
2. **Clear storage and re-login:**
   - F12 → Application → Local Storage
   - Delete `auth_token`
   - Login again

### ❌ "npm install" fails
**Problem:** Dependency installation errors
**Solutions:**
1. **Clear npm cache:**
   ```bash
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```
2. **Check Node.js version:**
   ```bash
   node --version  # Should be v18 or higher
   ```
3. **Use legacy peer deps (if needed):**
   ```bash
   npm install --legacy-peer-deps
   ```

### ❌ Database schema errors
**Problem:** Tables don't exist or have wrong structure
**Solution:** **Re-import schema:**
```bash
# WARNING: This will delete all data!
mysql -u root -p help_hive < backend/database/schema.sql
```

### ❌ "CORS policy" errors in browser
**Problem:** Cross-origin request blocked
```
Access to XMLHttpRequest blocked by CORS policy
```
**Solution:**
- Backend should already have CORS enabled for localhost:4200
- Verify backend is running on port 3001
- Check `backend/src/index.ts` has `cors()` middleware

## 🆘 Getting Help

If you encounter issues not listed above:

1. **Check terminal output** for error messages in both frontend and backend terminals
2. **Check browser console** (F12) for frontend errors
3. **Verify all prerequisites** are installed correctly
4. **Try the setup from scratch:**
   ```bash
   # Clean start
   cd backend
   rm -rf node_modules package-lock.json
   npm install
   
   cd ../frontend  
   rm -rf node_modules package-lock.json
   npm install
   ```

## 📝 Development Notes

### NPM Scripts Reference

**Backend (`backend/package.json`):**
```bash
npm run dev      # Start with ts-node (development, hot reload)
npm run watch    # Start with nodemon (auto-restart on file changes)
npm run build    # Compile TypeScript to JavaScript (dist folder)
npm start        # Run compiled JavaScript (production)
```

**Frontend (`frontend/package.json`):**
```bash
npm run dev      # Start development server (http://localhost:4200)
npm run build    # Build for production (creates dist folder)
npm run preview  # Preview production build
```

### Code Conventions
- **Backend Database Fields**: `snake_case` (e.g., `requester_id`, `full_address`)
- **Backend TypeScript**: `camelCase` (e.g., `requesterId`, `fullAddress`)
- **Frontend**: `camelCase` throughout
- **Components**: Standalone Angular components (no NgModule needed)
- **State Management**: Signal-based reactive state in `data.service.ts`
- **API Response Format**: 
  ```typescript
  {
    success: boolean,
    data?: T,
    message?: string,
    error?: string
  }
  ```

### Authentication Flow
1. User logs in via `/api/users/login`
2. Backend validates credentials, generates JWT token (7-day expiration)
3. Frontend stores token in `localStorage` as `auth_token`
4. `AuthInterceptor` automatically attaches token to all HTTP requests
5. Backend `auth` middleware verifies token on protected routes
6. User data decoded from token and stored in `data.service.ts` signal

### Database Design Decisions
1. **Only 2 Tables** (per requirements):
   - `Users` - All user types (role-based)
   - `HelpRequests` - All requests with status tracking
2. **JSON Columns** for complex data:
   - `offers` - Array of helper offers on a request
   - `timeline` - Status change history
3. **Helper Approval** - `is_approved` flag for manual vetting
4. **Privacy** - `full_address` vs `abstract_address` for location privacy

## 🚧 Future Enhancements

- [ ] Real-time notifications (WebSocket/Socket.io)
- [ ] File upload for attachments
- [ ] Email notifications
- [ ] Password reset functionality
- [ ] User profiles with ratings/reviews
- [ ] Search and filter requests
- [ ] Map view of nearby requests
- [ ] Mobile app (React Native/Flutter)
- [ ] Admin analytics dashboard
- [ ] Chat between requester and helper

## 📄 License

This project is created as a capstone project for educational purposes.

## 👨‍💻 Author

Developed as a neighborhood community help portal capstone project.

---

**Need Help?** Check the troubleshooting section or create an issue in the repository.
