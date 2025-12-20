# Quick Start Guide

## Option 1: Automated Setup (Windows)
```cmd
setup.bat
```

## Option 2: Automated Setup (Linux/Mac)
```bash
chmod +x setup.sh
./setup.sh
```

## Option 3: Manual Setup

### Install Dependencies
```bash
# Frontend
npm install

# Backend
cd backend
npm install
cd ..
```

### Configure Database
1. Create MySQL database named `neighborhood_portal`
2. Run schema: `mysql -u root -p neighborhood_portal < backend/database/schema.sql`
3. Create `backend/.env` from `backend/.env.example`
4. Update database credentials in `backend/.env`

### Start Development Servers

Terminal 1 (Backend):
```bash
cd backend
npm run dev
```

Terminal 2 (Frontend):
```bash
npm start
```

### Access Application
- Frontend: http://localhost:4200
- Backend API: http://localhost:3000
- Health Check: http://localhost:3000/health

## Default Test User
After running the schema with sample data:
- Email: admin@portal.com
- Password: (check schema.sql - default is hashed)

## Troubleshooting

### Port Already in Use
```bash
# Change PORT in backend/.env
# Change port in src/environments/environment.ts
```

### Database Connection Failed
- Verify MySQL is running
- Check credentials in backend/.env
- Ensure database exists

### Angular Material Not Found
```bash
npm install @angular/material @angular/cdk @angular/animations
```
