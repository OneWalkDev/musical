.PHONY: up down build logs clean restart restart-backend help

help:
	@echo "Available commands:"
	@echo "  make up              - Start all services"
	@echo "  make down            - Stop all services"
	@echo "  make build           - Build all services"
	@echo "  make logs            - Show logs for all services"
	@echo "  make clean           - Remove all containers and volumes"
	@echo "  make restart         - Restart all services"
	@echo "  make restart-backend - Restart Django backend only"
	@echo "  make backend         - Show backend logs"
	@echo "  make frontend        - Show frontend logs"
	@echo "  make db              - Access PostgreSQL shell"

up:
	docker-compose up -d

down:
	docker-compose down

build:
	docker-compose up -d --build

logs:
	docker-compose logs -f

backend:
	docker-compose logs -f backend

frontend:
	docker-compose logs -f frontend

clean:
	docker-compose down -v

restart:
	docker-compose restart

restart-backend:
	docker-compose restart backend

db:
	docker-compose exec db psql -U postgres -d musical
