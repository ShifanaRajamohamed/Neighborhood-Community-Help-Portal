# Docker Setup Guide

This guide will help you run the Neighborhood Community Help Portal using Docker Compose.

## Prerequisites

- Docker Engine 20.10 or later
- Docker Compose 2.0 or later
- At least 2GB of free RAM

## Quick Start

1. **Copy the environment file:**
   ```bash
   cp .env.example .env
   ```

2. **Edit the `.env` file and set your variables:**
   ```bash
   nano .env  # or use your preferred editor
   ```
   
   At minimum, update these values:
   - `DB_PASSWORD` - Set a strong database password
   - `DB_ROOT_PASSWORD` - Set a strong root password
   - `JWT_SECRET` - Generate with: `openssl rand -base64 32`

3. **Build and start all services:**
   ```bash
   docker-compose up -d
   ```

4. **Check the status of services:**
   ```bash
   docker-compose ps
   ```

5. **View logs:**
   ```bash
   # All services
   docker-compose logs -f
   
   # Specific service
   docker-compose logs -f backend
   docker-compose logs -f frontend
   docker-compose logs -f mysql
   ```

## Access the Application

- **Frontend:** http://localhost (or http://localhost:80)
- **Backend API:** http://localhost:3001
- **Health Check:** http://localhost:3001/health

## Common Commands

### Start services
```bash
docker-compose up -d
```

### Stop services
```bash
docker-compose down
```

### Restart services
```bash
docker-compose restart
```

### Rebuild images
```bash
docker-compose build
docker-compose up -d --force-recreate
```

### Stop and remove everything (including volumes)
```bash
docker-compose down -v
```

## Database Management

### Access MySQL CLI
```bash
docker-compose exec mysql mysql -u root -p
# Enter your DB_ROOT_PASSWORD when prompted
```

### Import SQL file
```bash
docker-compose exec -T mysql mysql -u root -p${DB_ROOT_PASSWORD} ${DB_NAME} < your-file.sql
```

### Backup database
```bash
docker-compose exec mysql mysqldump -u root -p${DB_ROOT_PASSWORD} ${DB_NAME} > backup.sql
```

### View database logs
```bash
docker-compose logs -f mysql
```

## Development Mode

For development with hot reload, you can:

1. Uncomment the volume mount in `docker-compose.yml` under the backend service:
   ```yaml
   volumes:
     - ./backend/src:/app/src
   ```

2. Use the dev script by creating a development compose file:
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
   ```

## Troubleshooting

### Services not starting
```bash
# Check logs
docker-compose logs

# Check individual service
docker-compose logs backend
```

### Database connection issues
```bash
# Verify MySQL is healthy
docker-compose ps mysql

# Check database logs
docker-compose logs mysql

# Restart database
docker-compose restart mysql
```

### Port already in use
If you get port conflicts, edit `.env` and change:
- `PORT` for backend (default: 3001)
- `FRONTEND_PORT` for frontend (default: 80)
- `DB_PORT` for MySQL (default: 3306)

### Reset everything
```bash
# Stop all services and remove volumes
docker-compose down -v

# Remove all images
docker-compose down --rmi all

# Start fresh
docker-compose up -d --build
```


## Volumes

- `mysql_data` - Persistent database storage
- `backend_logs` - Application logs

## Networks

All services communicate through the `app-network` bridge network.
