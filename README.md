# Neighborhood Community Help Portal

A production-ready full-stack community platform where residents can request local help, helpers can accept and complete tasks, and admins can manage the system. Built with Angular 21 and Node.js + Express.

---

## 📑 Table of Contents
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation Setup](#-installation-setup)
- [API Routes](#-api-routes)
- [Frontend Routes](#-frontend-routes)
- [Database Schema](#-database-schema)
- [Usage Guide](#-usage-guide)

---

## ✨ Features

### Core Features
- **User Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (Resident, Helper, Admin)
  - Secure password hashing with bcrypt
  - Protected routes with guards

- **Help Request Management**
  - Create help requests (Residents only)
  - Browse and filter requests
  - Accept and track requests (Helpers)
  - Real-time status updates
  - Categories: Plumbing, Grocery, Tutoring, etc.

- **User Dashboard**
  - View personal statistics
  - Track active requests
  - Monitor completed tasks
  - Role-specific views

- **Admin Panel**
  - System-wide statistics
  - Manage all requests
  - User management
  - Archive/delete requests

### Technical Features
- Clean architecture with separation of concerns
- TypeScript strict mode
- Reactive programming with RxJS
- HTTP interceptors for auth and error handling
- Form validation (frontend and backend)
- RESTful API design
- Responsive Material Design UI

---

## 🛠️ Tech Stack

### Frontend
- **Angular 21** (Standalone Components)
- **Angular Material** - UI components
- **TypeScript** - Type safety
- **RxJS** - Reactive programming
- **Tailwind CSS** - Utility-first styling

### Backend
- **Node.js** + **Express 4.x**
- **TypeScript** - Strict mode
- **MySQL 8.0+** - Relational database
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing

---

## 📁 Project Structure

```
capstone/
├── neighborhood-portal-frontend/          # Angular 21 Application
│   ├── src/
│   │   ├── app/
│   │   │   ├── auth/                     # Login & Registration
│   │   │   │   ├── login/
│   │   │   │   └── registration/
│   │   │   ├── core/
│   │   │   │   ├── guards/               # Auth & Role guards
│   │   │   │   ├── interceptors/         # HTTP interceptors
│   │   │   │   └── services/             # API services
│   │   │   ├── dashboard/                # User dashboard
│   │   │   ├── requests/                 # Request management
│   │   │   │   ├── help-request/         # Create request
│   │   │   │   ├── request-list/         # Browse requests
│   │   │   │   └── request-detail/       # View single request
│   │   │   ├── admin/                    # Admin panel
│   │   │   │   ├── admin-dashboard/      # Admin stats
│   │   │   │   ├── admin-requests/       # Manage requests
│   │   │   │   └── admin-request-detail/ # Request details
│   │   │   ├── landing/                  # Landing page
│   │   │   └── shared/                   # Shared components & models
│   │   ├── environments/                 # Environment configs
│   │   └── styles.css
│   ├── package.json
│   └── angular.json
│
├── neighborhood-portal-backend/           # Node.js + Express API
│   ├── src/
│   │   ├── controllers/                  # Request handlers
│   │   │   ├── userController.ts
│   │   │   ├── requestController.ts
│   │   │   └── adminController.ts
│   │   ├── services/                     # Business logic
│   │   │   ├── userService.ts
│   │   │   ├── requestService.ts
│   │   │   └── adminService.ts
│   │   ├── routes/                       # API routes
│   │   │   ├── userRoutes.ts
│   │   │   ├── requestRoutes.ts
│   │   │   └── adminRoutes.ts
│   │   ├── middleware/                   # Auth, validation, errors
│   │   │   ├── auth.ts
│   │   │   ├── validation.ts
│   │   │   └── errorHandler.ts
│   │   ├── config/                       # Database config
│   │   │   └── database.ts
│   │   ├── types/                        # TypeScript types
│   │   │   └── index.ts
│   │   └── index.ts                      # Entry point
│   ├── database/
│   │   └── schema.sql                    # Database schema
│   ├── package.json
│   ├── tsconfig.json
│   └── .env                              # Environment variables
│
└── README.md                              # This file
```

---

## 🚀 Installation Setup

### Prerequisites
- **Node.js** 18.x or higher
- **MySQL** 8.0 or higher
- **npm** or **yarn**

### Step 1: Database Setup

**Open PowerShell/Terminal and run:**

```powershell
# Login to MySQL
mysql -u root -p
```

**In MySQL prompt, execute:**

```sql
CREATE DATABASE neighborhood_portal CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE neighborhood_portal;
source D:/capstone/neighborhood-portal-backend/database/schema.sql;
exit;
```

**Alternative (PowerShell one-liner):**
```powershell
Get-Content "D:\capstone\neighborhood-portal-backend\database\schema.sql" | mysql -u root -p neighborhood_portal
```

**Verify database:**
```powershell
mysql -u root -p -e "USE neighborhood_portal; SHOW TABLES;"
```

You should see: `Users` and `HelpRequests`

---

### Step 2: Backend Setup

**Terminal 1 - Backend:**

```powershell
# Navigate to backend folder
cd D:\capstone\neighborhood-portal-backend

# Install dependencies
npm install

# Create environment file
Copy-Item .env.example .env

# Edit .env file with your credentials
notepad .env
```

**Configure your `.env` file:**
```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=YOUR_MYSQL_PASSWORD_HERE
DB_NAME=neighborhood_portal
JWT_SECRET=your_super_secret_jwt_key_change_in_production
```

**Start the backend server:**
```powershell
npm run dev
```

**Backend runs on:** `http://localhost:3000`

You should see:
```
✓ Database connected successfully
✓ Server is running on port 3000
```

---

### Step 3: Frontend Setup

**Terminal 2 - Frontend:**

```powershell
# Navigate to frontend folder
cd D:\capstone\neighborhood-portal-frontend

# Install dependencies
npm install

# Start development server
npm start
```

**Frontend runs on:** `http://localhost:4200`

---

### Step 4: Environment Configuration

**Frontend environment file** is located at:
`neighborhood-portal-frontend\src\environments\environment.ts`

Ensure it contains:
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```

---

### Step 5: Verify Installation

1. Open browser: `http://localhost:4200`
2. You should see the landing page
3. Click "Get Started" or "Login"

---

## 🔗 API Routes

**Base URL:** `http://localhost:3000/api`

### User Routes (`/api/users`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/users/register` | Public | Register new user |
| POST | `/users/login` | Public | Login user |
| GET | `/users/me` | Protected | Get current user profile |
| GET | `/users/:id` | Protected | Get user by ID |
| PUT | `/users/:id` | Protected | Update user profile |

**Registration Request Body:**
```json
{
  "name": "John Doe",
  "contact_info": "john@example.com",
  "location": "123 Main St",
  "role": "resident",
  "password": "SecurePass123!"
}
```

**Login Request Body:**
```json
{
  "contact_info": "john@example.com",
  "password": "SecurePass123!"
}
```

---

### Help Request Routes (`/api/requests`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/requests` | Resident | Create new help request |
| GET | `/requests` | Protected | Get all requests (with filters) |
| GET | `/requests/:id` | Protected | Get single request |
| PUT | `/requests/:id/status` | Resident/Helper | Update request status |

**Create Request Body:**
```json
{
  "title": "Need help with plumbing",
  "description": "Kitchen sink is leaking",
  "category": "plumbing"
}
```

**Update Status Body:**
```json
{
  "status": "accepted",
  "helper_id": 5
}
```

**Query Parameters for GET /requests:**
- `status` - Filter by status (pending, accepted, in_progress, completed)
- `category` - Filter by category
- `resident_id` - Filter by resident
- `helper_id` - Filter by helper

---

### Admin Routes (`/api/admin`)

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/admin/stats` | Admin | Get dashboard statistics |
| GET | `/admin/requests` | Admin | Get all requests |
| GET | `/admin/requests/:id` | Admin | Get request details |
| PUT | `/admin/requests/:id/status` | Admin | Update request status |
| DELETE | `/admin/requests/:id` | Admin | Archive/delete request |

---

## 🌐 Frontend Routes

### Public Routes
- `/` - Landing page
- `/login` - Login page
- `/register` - Registration page

### Protected Routes (Requires Authentication)
- `/dashboard` - User dashboard (All roles)
- `/requests` - Browse all help requests
- `/requests/new` - Create new request (Resident only)
- `/requests/:id` - View request details

### Admin Routes (Requires Admin Role)
- `/admin` - Admin dashboard
- `/admin/requests` - Manage all requests
- `/admin/requests/:id` - Admin request details

### Other
- `/unauthorized` - Access denied page
- `**` - Redirects to login

---

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE Users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  contact_info VARCHAR(255) UNIQUE NOT NULL,
  location TEXT NOT NULL,
  role ENUM('resident', 'helper', 'admin') DEFAULT 'resident',
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Fields:**
- `id` - Auto-increment primary key
- `name` - User's full name
- `contact_info` - Email or phone (unique)
- `location` - User's address
- `role` - resident | helper | admin
- `password` - Bcrypt hashed password
- `created_at` - Registration timestamp

---

### HelpRequests Table
```sql
CREATE TABLE HelpRequests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  resident_id INT NOT NULL,
  helper_id INT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100) NOT NULL,
  status ENUM('pending', 'accepted', 'in_progress', 'completed') DEFAULT 'pending',
  attachments TEXT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (resident_id) REFERENCES Users(id),
  FOREIGN KEY (helper_id) REFERENCES Users(id)
);
```

**Fields:**
- `id` - Auto-increment primary key
- `resident_id` - Foreign key to Users (creator)
- `helper_id` - Foreign key to Users (assigned helper, nullable)
- `title` - Request title
- `description` - Detailed description
- `category` - plumbing, grocery, tutoring, etc.
- `status` - pending | accepted | in_progress | completed
- `attachments` - Optional file URLs (JSON)
- `created_at` - Creation timestamp
- `updated_at` - Last update timestamp

**Status Workflow:**
```
pending → accepted → in_progress → completed
```

---

## 📖 Usage Guide

### For Residents

1. **Register an account**
   - Go to `/register`
   - Select role: "Resident"
   - Fill in your details

2. **Create a help request**
   - Login and go to Dashboard
   - Click "Create Request"
   - Fill in title, description, category
   - Submit

3. **Track requests**
   - View all your requests on Dashboard
   - See status updates in real-time
   - View helper details when accepted

### For Helpers

1. **Register as Helper**
   - Go to `/register`
   - Select role: "Helper"

2. **Browse requests**
   - Login and view Dashboard
   - See all pending requests
   - Filter by category

3. **Accept and complete**
   - Click on a request
   - Click "Accept Request"
   - Update status to "In Progress" → "Completed"

### For Admins

1. **Access admin panel**
   - Login with admin credentials
   - Go to `/admin`

2. **View statistics**
   - Total users, requests
   - Pending, completed counts
   - System overview

3. **Manage requests**
   - View all requests
   - Update status
   - Archive requests

---

## 🛠️ Development Commands

### Backend Commands
```powershell
cd neighborhood-portal-backend

npm install              # Install dependencies
npm run dev              # Development with auto-reload
npm run build            # Compile TypeScript
npm start                # Run production build
npm test                 # Run tests
```

### Frontend Commands
```powershell
cd neighborhood-portal-frontend

npm install              # Install dependencies
npm start                # Development server (http://localhost:4200)
npm run build            # Production build
npm run build:prod       # Optimized production build
npm test                 # Run unit tests
npm run lint             # Lint code
```

---

## 🔧 Troubleshooting

### Database Connection Issues
```powershell
# Test MySQL connection
mysql -u root -p -e "SHOW DATABASES;"

# Verify database exists
mysql -u root -p -e "USE neighborhood_portal; SHOW TABLES;"
```

### Backend Not Starting
- Check `.env` file exists with correct credentials
- Verify MySQL is running
- Check port 3000 is not in use: `netstat -ano | findstr :3000`

### Frontend Not Starting
- Clear node_modules: `Remove-Item -Recurse -Force node_modules`
- Reinstall: `npm install`
- Check port 4200: `netstat -ano | findstr :4200`

### CORS Errors
- Ensure backend CORS is configured for `http://localhost:4200`
- Check backend console for CORS-related errors

---

## 📝 Default Test Accounts

After running the schema, you can create test accounts:

**Admin:**
```sql
INSERT INTO Users (name, contact_info, location, role, password) 
VALUES ('Admin User', 'admin@portal.com', 'Admin Office', 'admin', '$2a$10$...');
```

**Or register via the UI** and manually update the role in database:
```sql
UPDATE Users SET role = 'admin' WHERE contact_info = 'your@email.com';
```

---

## 🚀 Production Deployment

### Backend
1. Build: `npm run build`
2. Set environment variables on server
3. Run: `npm start`
4. Use PM2 or similar for process management

### Frontend
1. Build: `npm run build:prod`
2. Deploy `dist/` folder to web server
3. Configure environment.prod.ts with production API URL

### Database
1. Export schema: `mysqldump -u root -p neighborhood_portal > backup.sql`
2. Import on production server
3. Update connection credentials

---

## 📄 License

This project is for educational purposes (Capstone Project).

---

## 👨‍💻 Contributing

This is a capstone project. For issues or suggestions, contact the development team.

---

## 📞 Support

For setup issues or questions, refer to this README or contact support.

---

**Built with ❤️ using Angular, Node.js, and MySQL**

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
