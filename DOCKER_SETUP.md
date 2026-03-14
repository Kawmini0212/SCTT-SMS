# Docker Deployment Guide

## Prerequisites

1. **Install Docker Desktop**
   - Double-click the `Docker Desktop Installer.exe` file
   - Follow the installation wizard
   - Restart your computer if prompted
   - Start Docker Desktop from the Start menu
   - Wait for Docker Desktop to start (you'll see the whale icon in the system tray)

2. **Verify Docker Installation**
   ```powershell
   docker --version
   docker-compose --version
   ```

## Quick Start

### Step 1: Stop Currently Running Services

If you have services running locally, stop them first:
- Press `Ctrl+C` in each terminal running a service
- Or close the terminal windows

### Step 2: Build and Start All Services

Navigate to the project root and run:

```powershell
cd C:\Users\Kawmi\Desktop\sms\TestApp
docker-compose up --build
```

This command will:
- Build Docker images for all services
- Create and start all containers (MySQL, 5 backend services, frontend)
- Initialize the database automatically
- Set up the network connections

### Step 3: Access the Application

Once all containers are running (you'll see logs from all services):

- **Frontend**: http://localhost (port 80)
- **Auth Service**: http://localhost:5001
- **Student Service**: http://localhost:5002
- **Course Service**: http://localhost:5003
- **Enrollment Service**: http://localhost:5004
- **Audit Service**: http://localhost:5005
- **MySQL Database**: localhost:3306

## Docker Commands

### Start Services (Detached Mode)
```powershell
docker-compose up -d
```

### Stop Services
```powershell
docker-compose down
```

### Stop Services and Remove Volumes (Clean Reset)
```powershell
docker-compose down -v
```

### View Logs
```powershell
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f auth-service
docker-compose logs -f frontend
docker-compose logs -f mysql
```

### Rebuild Specific Service
```powershell
docker-compose up -d --build auth-service
```

### Check Running Containers
```powershell
docker-compose ps
```

### Execute Commands in Container
```powershell
# Access MySQL database
docker-compose exec mysql mysql -uroot -pKawmini

# Access a service container
docker-compose exec auth-service sh
```

## Architecture

The Docker setup includes:

- **MySQL Container**: Stores all databases (auth_db, student_db, course_db, enrollment_db, audit_db)
- **5 Backend Microservices**: Node.js applications running on Alpine Linux
- **Frontend Container**: React app built and served via Nginx
- **Custom Network**: All containers communicate through `sms-network`
- **Persistent Volume**: MySQL data is persisted in `mysql_data` volume

## Configuration

### Environment Variables

Each service's environment variables are defined in `docker-compose.yml`. To modify:

1. Edit `docker-compose.yml`
2. Rebuild the affected service:
   ```powershell
   docker-compose up -d --build <service-name>
   ```

### Database Initialization

The database is automatically initialized using `backend/init-database.sql` when the MySQL container starts for the first time.

To reinitialize:
```powershell
docker-compose down -v
docker-compose up -d
```

## Troubleshooting

### Port Already in Use
If you get port binding errors:
1. Stop locally running services
2. Or change ports in `docker-compose.yml`

### Database Connection Issues
```powershell
# Check if MySQL is healthy
docker-compose ps

# View MySQL logs
docker-compose logs mysql

# Wait for MySQL to be ready (check health status)
```

### Service Won't Start
```powershell
# View service logs
docker-compose logs <service-name>

# Rebuild service
docker-compose up -d --build <service-name>
```

### Clean Slate
To completely reset everything:
```powershell
docker-compose down -v
docker system prune -a
docker-compose up --build
```

## Development vs Production

### Development (Current Setup)
- Services rebuild on command
- Logs visible in console
- Easy debugging

### Production Considerations
1. Change JWT_SECRET in environment variables
2. Change MySQL root password
3. Use proper domain names instead of localhost
4. Set up SSL/TLS certificates
5. Configure proper backup strategy for MySQL volume
6. Use Docker Swarm or Kubernetes for orchestration
7. Implement proper logging and monitoring

## File Structure

```
TestApp/
├── docker-compose.yml              # Main orchestration file
├── backend/
│   ├── init-database.sql           # Database initialization
│   └── services/
│       ├── auth-service/
│       │   ├── Dockerfile
│       │   └── .dockerignore
│       ├── student-service/
│       │   ├── Dockerfile
│       │   └── .dockerignore
│       ├── course-service/
│       │   ├── Dockerfile
│       │   └── .dockerignore
│       ├── enrollment-service/
│       │   ├── Dockerfile
│       │   └── .dockerignore
│       └── audit-service/
│           ├── Dockerfile
│           └── .dockerignore
└── frontend/
    ├── Dockerfile
    ├── nginx.conf                  # Nginx configuration
    └── .dockerignore
```

## Performance Tips

1. **Use BuildKit**: Set environment variable for faster builds
   ```powershell
   $env:DOCKER_BUILDKIT=1
   docker-compose build
   ```

2. **Limit Logs**: Prevent log file growth
   ```yaml
   # Add to each service in docker-compose.yml
   logging:
     driver: "json-file"
     options:
       max-size: "10m"
       max-file: "3"
   ```

3. **Allocate Resources**: In Docker Desktop settings, increase CPU and Memory allocation

## Next Steps

After successfully running with Docker:

1. **Monitor Performance**: Use `docker stats` to monitor resource usage
2. **Set Up CI/CD**: Automate building and deployment
3. **Configure Backups**: Set up automated MySQL backups
4. **Add Health Checks**: Implement application-level health endpoints
5. **Implement Logging**: Use centralized logging (ELK stack, etc.)

## Support

For issues:
1. Check logs: `docker-compose logs -f`
2. Verify all containers are running: `docker-compose ps`
3. Check Docker Desktop is running
4. Verify port availability: `netstat -ano | findstr :5001`
