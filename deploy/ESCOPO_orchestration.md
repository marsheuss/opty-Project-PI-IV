# Technical Scope: Opty - Docker Orchestration

## 1. Overview

This document defines the containerization and orchestration configuration for all services and infrastructure components of the Opty project. The goal is to create a consistent, easily replicable development and production environment using Docker containers.

## 2. Technologies

- **Containerization:** Docker
- **Orchestration:** Docker Compose

## 3. Service Architecture

### 3.1 Database Layer

#### MongoDB (mongo)
- **Image:** `mongo:8`
- **Purpose:** Primary NoSQL database for application data
- **Network:** `db-network`
- **Restart Policy:** `unless-stopped`

**Configuration:**
- Root user for administrative tasks
- Application user with read/write permissions on `opty` database
- Automatic user creation via initialization script

**Health Check:**
- Command: `mongosh --eval "db.adminCommand('ping')"`
- Interval: 10 seconds
- Timeout: 5 seconds
- Retries: 5

**Volumes:**
- `./data/mongo:/data/db` - Data persistence
- `./infra/mongo-init:/docker-entrypoint-initdb.d:ro` - Initialization scripts

**Environment Variables:**
- `MONGO_INITDB_ROOT_USERNAME` - Root username
- `MONGO_INITDB_ROOT_PASSWORD` - Root password
- `MONGO_APP_USER` - Application user
- `MONGO_APP_PASSWORD` - Application password

### 3.2 Application Services

#### Socket Backend (socket-backend)
- **Image:** `edu3983/opty-socket:1.0.0`
- **Purpose:** Real-time communication server using WebSocket/Socket.IO
- **Network:** `db-network`
- **Restart Policy:** `unless-stopped`
- **Dependencies:** MongoDB (waits for healthy status)

**Environment Variables:**
- `OPTY_SOCKET_MAX_CONNECTIONS` - Maximum simultaneous connections
- `OPTY_SOCKET_CORS_ALLOWED_ORIGINS` - Allowed CORS origins (comma-separated)
- `OPTY_SOCKET_SESSION_TIMEOUT_MINUTES` - Session timeout in minutes

## 4. Network Architecture

### db-network
- **Type:** Bridge
- **Driver:** `bridge`
- **Purpose:** Internal communication between services

**Service Communication:**
- MongoDB accessible at `mongo:27017` within the network
- Socket Backend accessible at `socket-backend:8080` within the network
- Services communicate using DNS resolution by service name

## 5. Data Persistence

### MongoDB Data
- **Host Path:** `./data/mongo`
- **Container Path:** `/data/db`
- **Purpose:** Persists database data across container restarts
- **Note:** This directory is created automatically by Docker

## 6. Initialization Process

### Database Initialization
1. MongoDB container starts
2. Root user is created by MongoDB using `MONGO_INITDB_ROOT_USERNAME` and `MONGO_INITDB_ROOT_PASSWORD`
3. Initialization script (`001-init.sh`) executes:
   - Waits for MongoDB to be ready
   - Connects using root credentials
   - Creates `opty` database
   - Creates application user with read/write permissions on `opty` database

### Service Startup Order
1. MongoDB starts and runs health checks
2. Once MongoDB is healthy, Socket Backend starts
3. Socket Backend connects to MongoDB using application credentials

## 7. Environment Configurations

### Production (docker-compose.yml)
- No ports exposed to host
- Services communicate internally via `db-network`
- Suitable for deployment behind reverse proxy/load balancer

### Development (docker-compose.yml + docker-compose-dev.yml)
- MongoDB port exposed: `27017:27017`
- Socket Backend port exposed: `8080:8080`
- Allows direct connection from development tools
- Uses Docker Compose override pattern

## 8. Security Considerations

### Secrets Management
- Credentials stored in `.env` file (not committed to version control)
- Separate root and application credentials
- Application user has minimal required permissions (readWrite only on `opty` db)

### Network Isolation
- Services isolated in custom bridge network
- In production, no direct external access to database
- CORS configuration restricts allowed origins

### Best Practices
- Use strong passwords in production
- Regularly update base images
- Keep `.env` file out of version control
- Use principle of least privilege for database users

## 9. Monitoring & Health

### Health Checks
- MongoDB has built-in health check using `mongosh`
- Health checks ensure dependent services only start when database is ready
- Failed health checks trigger automatic container restart

### Logging
- All container logs accessible via `docker compose logs`
- Logs can be monitored in real-time with `-f` flag
- Individual service logs can be filtered

## 10. Backup Strategy

### Database Backup
- Use `mongodump` from within MongoDB container
- Export to `/backup` directory in container
- Copy to host using `docker compose cp`
- Recommended: Automate backups with cron jobs

### Configuration Backup
- Version control all Docker Compose files
- Store `.env.example` in repository as template
- Document all required environment variables

## 11. Scalability Considerations

### Current Limitations
- Single MongoDB instance (no replica set)
- Single Socket Backend instance

### Future Improvements
- MongoDB replica set for high availability
- Multiple Socket Backend instances with load balancing
- Shared session storage (Redis) for Socket Backend
- Kubernetes migration for advanced orchestration

## 12. Development Workflow

### Local Development
1. Clone repository
2. Copy `.env.example` to `.env`
3. Configure environment variables
4. Run `docker compose -f docker-compose.yml -f docker-compose-dev.yml up -d`
5. Connect development tools to exposed ports

### Testing Changes
1. Modify code in respective service repositories
2. Rebuild specific service: `docker compose up -d --build [service-name]`
3. Check logs: `docker compose logs -f [service-name]`
4. Verify functionality

### Debugging
- Use `docker compose exec [service-name] sh` for shell access
- Check environment variables: `docker compose exec [service-name] env`
- Inspect networks: `docker network inspect opty-orchestration_db-network`

## 13. Deployment

### Production Deployment
1. Ensure `.env` has production credentials
2. Run `docker compose up -d`
3. Verify all services are healthy: `docker compose ps`
4. Monitor logs for errors: `docker compose logs -f`
5. Set up external monitoring and alerting

### Updates
1. Pull new images: `docker compose pull`
2. Restart services: `docker compose up -d`
3. Verify health: `docker compose ps`

## 14. Troubleshooting Guide

### Common Issues

**MongoDB won't start:**
- Check disk space
- Verify volume permissions
- Review logs: `docker compose logs mongo`

**Socket Backend can't connect to MongoDB:**
- Verify MongoDB is healthy: `docker compose ps`
- Check credentials in `.env`
- Ensure `MONGO_URL` uses correct credentials

**Port conflicts:**
- Check if ports are in use: `lsof -i :27017` or `lsof -i :8080`
- Stop conflicting services
- Modify ports in `docker-compose-dev.yml` if needed

## 15. File Structure Reference

```
opty-orchestration/
├── docker-compose.yml              # Base configuration (production)
├── docker-compose-dev.yml          # Development overrides
├── .env                            # Environment variables (not in git)
├── .env.example                    # Environment template
├── .gitignore                      # Git ignore rules
├── README.md                       # User documentation
├── ESCOPO_orchestration.md         # This technical scope document
├── infra/                          # Infrastructure scripts
│   └── mongo-init/
│       └── 001-init.sh            # MongoDB user initialization
└── data/                           # Persistent data (not in git)
    └── mongo/                      # MongoDB data files
```

## 16. Related Documentation

- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [MongoDB Docker Documentation](https://hub.docker.com/_/mongo)
- [MongoDB Connection String URI Format](https://www.mongodb.com/docs/manual/reference/connection-string/)

## 17. Changelog

### Version 2.0 (2025-11-01)
- Complete rewrite of technical scope
- Updated to reflect actual current architecture
- Removed references to non-existent services (frontend, backend API)
- Added MongoDB 8 and Socket Backend service details
- Improved documentation of initialization process
- Added troubleshooting guide
- Enhanced security considerations

### Version 1.0 (Previous)
- Initial version with outdated service descriptions
