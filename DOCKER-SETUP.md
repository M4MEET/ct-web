# Docker Setup Documentation

## Overview

This project uses Docker Compose to orchestrate multiple services for both development and production environments. The setup includes PostgreSQL database, Redis cache, Next.js applications (web and admin), and Nginx reverse proxy.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Nginx (Port 80/443)                 │
│                     (Reverse Proxy & SSL Termination)       │
└─────────────┬──────────────────────┬───────────────────────┘
              │                      │
              ▼                      ▼
┌──────────────────────┐  ┌──────────────────────┐
│   Web Application    │  │   Admin Application  │
│     (Port 3000)      │  │     (Port 3001)      │
└──────────┬───────────┘  └──────────┬───────────┘
           │                          │
           ▼                          ▼
┌─────────────────────────────────────────────────┐
│              PostgreSQL Database                 │
│                  (Port 5432)                     │
└───────────────────────────────────────────────────┘
           │                          │
           ▼                          ▼
┌─────────────────────────────────────────────────┐
│                Redis Cache                       │
│                (Port 6379)                       │
└───────────────────────────────────────────────────┘
```

## Quick Start

### Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- Make (optional, for using Makefile commands)
- 4GB RAM minimum
- 10GB free disk space

### First Time Setup

```bash
# Clone the repository
git clone <repository-url>
cd ct-web

# Initialize the project (automated setup)
make init

# Or manually:
cp .env.example .env.local
# Edit .env.local with your configuration
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d
docker compose exec admin sh -c "cd packages/database && pnpm prisma migrate deploy"
docker compose exec admin sh -c "cd packages/database && pnpm prisma db seed"
```

### Starting Services

#### Development Environment
```bash
# Using Make
make dev

# Using Docker Compose
docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d
```

#### Production Environment
```bash
# Using Make
make prod

# Using Docker Compose
docker compose --profile production up -d
```

## Services

### PostgreSQL Database
- **Image**: postgres:15-alpine
- **Port**: 5432
- **Default Credentials** (dev):
  - Database: codex_terminal_dev
  - User: codex_dev
  - Password: localdev123
- **Volume**: postgres_data (persistent storage)
- **Health Check**: pg_isready command

### Redis Cache
- **Image**: redis:7-alpine
- **Port**: 6379
- **Default Password** (dev): none
- **Volume**: redis_data (persistent storage)
- **Health Check**: redis-cli ping

### Web Application
- **Build**: apps/web/Dockerfile
- **Port**: 3000
- **URL**: http://localhost:3000
- **Features**:
  - Public-facing website
  - Multi-language support (EN/DE/FR)
  - Server-side rendering
  - Image optimization

### Admin Application
- **Build**: apps/admin/Dockerfile
- **Port**: 3001
- **URL**: http://localhost:3001
- **Features**:
  - CMS interface
  - User management
  - Content editing
  - 2FA support

### Nginx (Production Only)
- **Image**: nginx:alpine
- **Ports**: 80, 443
- **Purpose**: Reverse proxy, SSL termination, static file serving
- **Profile**: production (not started by default)

### Prisma Studio (Development Only)
- **Port**: 5555
- **URL**: http://localhost:5555
- **Purpose**: Database GUI management
- **Start**: `make studio`

## File Structure

```
ct-web/
├── docker-compose.yml          # Main Docker Compose configuration
├── docker-compose.dev.yml      # Development overrides
├── Makefile                    # Convenience commands
├── .dockerignore              # Files to exclude from Docker context
├── .env.example               # Environment variable template
├── apps/
│   ├── web/
│   │   ├── Dockerfile         # Production build
│   │   └── Dockerfile.dev     # Development build
│   └── admin/
│       ├── Dockerfile         # Production build
│       └── Dockerfile.dev     # Development build
└── nginx/
    ├── nginx.conf             # Main Nginx configuration
    └── sites/                 # Site-specific configs
```

## Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | `production` or `development` |
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host:5432/db` |
| `REDIS_URL` | Redis connection string | `redis://:password@host:6379` |
| `NEXTAUTH_SECRET` | Authentication secret (min 64 chars) | Generate with `openssl rand -base64 64` |
| `NEXTAUTH_URL` | Authentication callback URL | `https://admin.codexterminal.com` |

### Optional Variables

See `.env.example` for complete list including:
- OAuth providers (GitHub, Google)
- Email configuration (Resend, SMTP)
- Analytics (PostHog, Google Analytics)
- File storage (S3, R2)
- Security (hCaptcha, rate limiting)

## Database Management

### Running Migrations
```bash
# Apply pending migrations
make db-migrate

# Or manually
docker compose exec admin sh -c "cd packages/database && pnpm prisma migrate deploy"
```

### Seeding Database
```bash
# Seed with initial data
make db-seed

# Or manually
docker compose exec admin sh -c "cd packages/database && pnpm prisma db seed"
```

### Database Backup
```bash
# Create backup
make db-backup

# Backups are stored in ./backups/ directory
```

### Database Restore
```bash
# Restore from backup
make db-restore
# Follow prompts to select backup file
```

### Reset Database (WARNING: Destroys all data)
```bash
make db-reset
```

### Access Prisma Studio
```bash
# Start Prisma Studio
make studio
# Open http://localhost:5555
```

## Development Workflow

### Hot Reload
Development containers are configured with volume mounts for hot reload:
- Source code changes are immediately reflected
- No need to rebuild containers for code changes
- Next.js Fast Refresh enabled

### Viewing Logs
```bash
# All services
make logs

# Specific service
docker compose logs -f web
docker compose logs -f admin
docker compose logs -f postgres
```

### Accessing Container Shell
```bash
# Web app shell
docker compose exec web /bin/sh

# Admin app shell
docker compose exec admin /bin/sh

# Database shell
docker compose exec postgres psql -U codex_user -d codex_terminal
```

### Debugging
1. Check service status: `make ps`
2. View logs: `make logs`
3. Health check: `make health`
4. Restart services: `make restart`

## Production Deployment

### Building for Production
```bash
# Build production images
make prod-build

# Or manually
docker compose build --no-cache
```

### Production Configuration
1. Update `.env.production` with production values
2. Configure SSL certificates in `./ssl/` directory
3. Update Nginx configuration in `./nginx/sites/`
4. Set proper domain names in environment variables

### Starting Production
```bash
# Start with production profile
docker compose --env-file .env.production --profile production up -d
```

### SSL/TLS Setup
1. Obtain SSL certificates (Let's Encrypt recommended)
2. Place certificates in `./ssl/` directory
3. Update Nginx configuration to reference certificates
4. Restart Nginx: `docker compose restart nginx`

## Makefile Commands

| Command | Description |
|---------|-------------|
| `make help` | Show all available commands |
| **Development** |
| `make dev` | Start development environment |
| `make dev-build` | Build development containers |
| `make dev-logs` | Show development logs |
| `make dev-shell` | Access development shell |
| **Production** |
| `make prod` | Start production environment |
| `make prod-build` | Build production containers |
| `make prod-logs` | Show production logs |
| **Database** |
| `make db-migrate` | Run database migrations |
| `make db-seed` | Seed database |
| `make db-reset` | Reset database (destroys data) |
| `make db-backup` | Backup database |
| `make db-restore` | Restore from backup |
| `make studio` | Open Prisma Studio |
| **Common** |
| `make logs` | Show all logs |
| `make ps` | Show running containers |
| `make clean` | Remove all containers/volumes |
| `make restart` | Restart all services |
| `make health` | Check service health |
| `make init` | First-time project setup |

## Troubleshooting

### Container Won't Start
```bash
# Check for port conflicts
lsof -i :3000
lsof -i :3001
lsof -i :5432

# Check logs
docker compose logs [service-name]

# Rebuild containers
docker compose build --no-cache
```

### Database Connection Issues
```bash
# Test database connection
docker compose exec postgres pg_isready -U codex_user

# Check database logs
docker compose logs postgres

# Verify environment variables
docker compose config
```

### Memory Issues
```bash
# Check Docker resource usage
docker stats

# Increase Docker memory allocation in Docker Desktop settings
# Recommended: 4GB minimum
```

### Permission Issues
```bash
# Fix volume permissions
docker compose exec -u root [service] chown -R nextjs:nodejs /app
```

### Clean Start
```bash
# Remove everything and start fresh
make clean
make init
```

## Performance Optimization

### Docker Build Cache
- Multi-stage builds minimize final image size
- Layer caching speeds up rebuilds
- `.dockerignore` excludes unnecessary files

### Production Optimizations
- Next.js standalone output reduces image size by 85%
- Alpine Linux base images for minimal footprint
- Health checks ensure service availability
- Non-root user for security

### Resource Limits (Optional)
Add to docker-compose.yml for production:
```yaml
services:
  web:
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 1G
        reservations:
          cpus: '0.5'
          memory: 512M
```

## Security Considerations

### Production Security Checklist
- [ ] Change all default passwords
- [ ] Use strong NEXTAUTH_SECRET (min 64 chars)
- [ ] Configure SSL/TLS certificates
- [ ] Set up firewall rules
- [ ] Enable rate limiting
- [ ] Regular security updates
- [ ] Backup strategy in place
- [ ] Monitor logs for suspicious activity

### Container Security
- Non-root user in production containers
- Read-only root filesystem (optional)
- No unnecessary packages installed
- Regular base image updates

## Monitoring

### Health Checks
All services include health checks:
```bash
# Manual health check
make health

# Docker native health status
docker compose ps
```

### Logging
- Centralized logging with Docker Compose
- Log rotation configured
- Structured logging in JSON format

### Metrics (Optional)
Consider adding:
- Prometheus for metrics collection
- Grafana for visualization
- Uptime Kuma for uptime monitoring

## Backup Strategy

### Automated Backups
```bash
# Add to crontab for daily backups
0 2 * * * cd /path/to/project && make db-backup
```

### Backup Locations
- Database: `./backups/` directory
- Uploads: Volume backups
- Configuration: Git repository

## Updates and Maintenance

### Updating Dependencies
```bash
# Update base images
docker compose pull

# Rebuild with new dependencies
make prod-build
```

### Rolling Updates
```bash
# Update one service at a time
docker compose up -d --no-deps --build web
docker compose up -d --no-deps --build admin
```

## Support

For issues or questions:
1. Check logs: `make logs`
2. Review this documentation
3. Check GitHub Issues
4. Contact support@codexterminal.com

---

*Last updated: $(date +%Y-%m-%d)*