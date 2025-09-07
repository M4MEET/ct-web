# CodeX Terminal Docker Management
# Usage: make [command]

.PHONY: help dev prod build up down restart logs clean

# Default command
help:
	@echo "CodeX Terminal Docker Commands:"
	@echo ""
	@echo "Development:"
	@echo "  make dev           - Start development environment with hot-reload"
	@echo "  make dev-build     - Build development containers"
	@echo "  make dev-logs      - Show development logs"
	@echo "  make dev-shell     - Access development shell"
	@echo ""
	@echo "Production:"
	@echo "  make prod          - Start production environment"
	@echo "  make prod-build    - Build production containers"
	@echo "  make prod-logs     - Show production logs"
	@echo ""
	@echo "Database:"
	@echo "  make db-migrate    - Run database migrations"
	@echo "  make db-seed       - Seed database with initial data"
	@echo "  make db-reset      - Reset database (WARNING: destroys data)"
	@echo "  make db-backup     - Backup database"
	@echo "  make db-restore    - Restore database from backup"
	@echo "  make studio        - Open Prisma Studio"
	@echo ""
	@echo "Common:"
	@echo "  make logs          - Show all container logs"
	@echo "  make ps            - Show running containers"
	@echo "  make clean         - Stop and remove all containers/volumes"
	@echo "  make restart       - Restart all services"

# Development commands
dev:
	docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d
	@echo "✅ Development environment started!"
	@echo "📱 Web app: http://localhost:3000"
	@echo "🔧 Admin app: http://localhost:3001"
	@echo "🗄️ PostgreSQL: localhost:5432"
	@echo "📦 Redis: localhost:6379"

dev-build:
	docker compose -f docker-compose.yml -f docker-compose.dev.yml build

dev-logs:
	docker compose -f docker-compose.yml -f docker-compose.dev.yml logs -f

dev-shell:
	docker compose -f docker-compose.yml -f docker-compose.dev.yml exec web /bin/sh

# Production commands
prod:
	docker compose --profile production up -d
	@echo "✅ Production environment started!"
	@echo "🌐 Configure nginx to proxy to:"
	@echo "   - Web app: http://localhost:3000"
	@echo "   - Admin app: http://localhost:3001"

prod-build:
	docker compose build --no-cache

prod-logs:
	docker compose logs -f

# Database commands
db-migrate:
	docker compose exec admin sh -c "cd packages/database && pnpm prisma migrate deploy"
	@echo "✅ Database migrations applied!"

db-seed:
	docker compose exec admin sh -c "cd packages/database && pnpm prisma db seed"
	@echo "✅ Database seeded!"

db-reset:
	@echo "⚠️  WARNING: This will destroy all data in the database!"
	@read -p "Are you sure? (y/N) " confirm && [ "$$confirm" = "y" ] || exit 1
	docker compose exec admin sh -c "cd packages/database && pnpm prisma migrate reset --force"
	@echo "✅ Database reset complete!"

db-backup:
	@mkdir -p backups
	docker compose exec postgres pg_dump -U codex_user codex_terminal > backups/backup_$$(date +%Y%m%d_%H%M%S).sql
	@echo "✅ Database backed up to backups/backup_$$(date +%Y%m%d_%H%M%S).sql"

db-restore:
	@echo "Available backups:"
	@ls -la backups/*.sql
	@read -p "Enter backup filename to restore: " backup && \
	docker compose exec -T postgres psql -U codex_user codex_terminal < backups/$$backup
	@echo "✅ Database restored!"

studio:
	docker compose --profile dev-tools up prisma-studio -d
	@echo "✅ Prisma Studio started at http://localhost:5555"

# Common commands
up:
	docker compose up -d

down:
	docker compose down

restart:
	docker compose restart

logs:
	docker compose logs -f --tail=100

ps:
	docker compose ps

clean:
	@echo "⚠️  WARNING: This will remove all containers and volumes!"
	@read -p "Are you sure? (y/N) " confirm && [ "$$confirm" = "y" ] || exit 1
	docker compose down -v
	@echo "✅ All containers and volumes removed!"

# Health check
health:
	@echo "Checking service health..."
	@docker compose exec postgres pg_isready -U codex_user && echo "✅ PostgreSQL is healthy" || echo "❌ PostgreSQL is not responding"
	@docker compose exec redis redis-cli ping && echo "✅ Redis is healthy" || echo "❌ Redis is not responding"
	@curl -f http://localhost:3000 > /dev/null 2>&1 && echo "✅ Web app is healthy" || echo "❌ Web app is not responding"
	@curl -f http://localhost:3001 > /dev/null 2>&1 && echo "✅ Admin app is healthy" || echo "❌ Admin app is not responding"

# Initialize project (first time setup)
init:
	@echo "🚀 Initializing CodeX Terminal..."
	cp .env.example .env.local
	@echo "📝 Created .env.local from template"
	@echo "⚠️  Please edit .env.local with your configuration"
	@read -p "Press enter when ready to continue..." _
	make dev-build
	make dev
	sleep 10
	make db-migrate
	make db-seed
	@echo "✅ Project initialized successfully!"
	@echo "📱 Web app: http://localhost:3000"
	@echo "🔧 Admin app: http://localhost:3001"