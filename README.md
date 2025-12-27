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

- Node.js (v18 or higher)
- MySQL (v8 or higher)
- npm or yarn

## 🚀 Setup Instructions

### 1. Clone the Repository
```bash
git clone <repository-url>
cd capstone
```

### 2. Database Setup

**Create Database:**
```bash
mysql -u root -p
CREATE DATABASE neighborhood_portal;
EXIT;
```

**Import Schema:**
```bash
cd backend/database
mysql -u root -p neighborhood_portal < schema.sql
```

### 3. Backend Setup

**Install Dependencies:**
```bash
cd backend
npm install
```

**Configure Environment:**
Create `.env` file in `backend/` directory:
```env
PORT=3001
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=neighborhood_portal
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
```

**Start Backend:**
```bash
npm run dev
```
Backend runs on http://localhost:3001

### 4. Frontend Setup

**Install Dependencies:**
```bash
cd frontend
npm install
```

**Start Frontend:**
```bash
npm start
# or
ng serve
```
Frontend runs on http://localhost:4200

## 👥 User Accounts

### Demo Accounts (from schema.sql)
- **Requester**: alice@test.com / password
- **Helper**: bob@test.com / password
- **Admin**: admin@portal.com / password

### Create New Account
1. Go to http://localhost:4200/register
2. Fill in:
   - Name
   - Email
   - Full Address
   - Role (Requester or Helper)
   - Password (minimum 6 characters)
3. Click "CREATE ACCOUNT"
   - **Requesters**: Auto-approved, redirect to dashboard
   - **Helpers**: Requires admin approval before making offers

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
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.ts          # MySQL connection
│   │   ├── controllers/
│   │   │   ├── adminController.ts   # Admin endpoints
│   │   │   ├── requestController.ts # Request CRUD
│   │   │   └── userController.ts    # Auth & users
│   │   ├── middleware/
│   │   │   ├── auth.ts              # JWT verification
│   │   │   ├── errorHandler.ts      # Error handling
│   │   │   └── validation.ts        # Input validation
│   │   ├── routes/
│   │   │   ├── adminRoutes.ts
│   │   │   ├── requestRoutes.ts
│   │   │   └── userRoutes.ts
│   │   ├── services/
│   │   │   ├── adminService.ts      # Admin business logic
│   │   │   ├── requestService.ts    # Request business logic
│   │   │   └── userService.ts       # User business logic
│   │   ├── types/
│   │   │   └── index.ts             # TypeScript types
│   │   └── index.ts                 # Entry point
│   ├── database/
│   │   └── schema.sql               # Database schema
│   ├── .env                         # Environment variables
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/
│   └── src/
│       └── app/
│           ├── components/
│           │   ├── create-request.component.ts
│           │   ├── dashboard.component.ts
│           │   ├── landing.component.ts
│           │   ├── login.component.ts
│           │   ├── navbar.component.ts
│           │   ├── register.component.ts
│           │   └── request-card.component.ts
│           ├── guards/
│           │   ├── auth.guard.ts
│           │   ├── helper.guard.ts
│           │   └── requester.guard.ts
│           ├── interceptors/
│           │   └── auth.interceptor.ts     # JWT attachment
│           ├── services/
│           │   └── data.service.ts         # API & state
│           ├── app-routing.module.ts
│           ├── app.component.ts
│           └── app.module.ts
│
└── shared/
    └── types.ts                     # Shared TypeScript types
```

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

## 🐛 Troubleshooting

### Backend won't start
- Check MySQL is running: `mysql -u root -p`
- Verify `.env` credentials are correct
- Ensure port 3001 is not in use

### Frontend won't start
- Clear node_modules: `rm -rf node_modules && npm install`
- Check port 4200 is available
- Verify Angular CLI is installed: `npm install -g @angular/cli`

### Cannot login
- Check password is at least 6 characters
- For helpers, verify admin approval
- Clear localStorage and try again

### 401 Unauthorized errors
- Token may be expired (7 days)
- Logout and login again
- Check if JWT_SECRET matches between sessions

### Data not displaying
- Check browser console for errors
- Verify backend is running
- Check network tab for API responses

## 📝 Development Notes

### Code Conventions
- **Backend**: snake_case for database fields, camelCase for TypeScript
- **Frontend**: camelCase throughout
- **Components**: Standalone Angular components
- **State**: Signal-based reactive state management
- **API**: REST with JSON responses wrapped in `{success, data, message}`

### Key Design Decisions
1. **2-Table Schema**: Simplified structure with JSON for complex data
2. **JWT in localStorage**: Simple authentication for MVP
3. **Standalone Components**: Modern Angular approach
4. **Signal State**: Better performance than traditional observables
5. **Manual Approval**: Helpers vetted before participating

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
