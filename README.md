# CasaDin - Sistema de Gerenciamento de Casamentos

Sistema completo de gerenciamento de casamentos e presentes com backend em NestJS, frontend em Next.js e infraestrutura em Docker.

## Quick Start

```bash
# Clone o repositório
git clone <url-do-repositorio>
cd casadin-nuvem

# Suba todos os serviços
docker-compose up --build
```

Acesse:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Swagger**: http://localhost:3001/api
- **MinIO Console**: http://localhost:9001 (minioadmin/minioadmin)

## Serviços

| Serviço | Porta | Descrição |
|---------|-------|-----------|
| Frontend | 3000 | Interface Next.js |
| Backend | 3001 | API NestJS |
| PostgreSQL | 5432 | Banco de dados |
| MinIO | 9000 | Storage de imagens |
| MinIO Console | 9001 | Interface do MinIO |

## Funcionalidades

- ✅ Autenticação JWT
- ✅ Criação e gerenciamento de casamentos
- ✅ Sistema de convites
- ✅ Upload e armazenamento de fotos
- ✅ Lista de presentes com pagamentos
- ✅ Integração com Mercado Pago
- ✅ Interface responsiva

## Documentação

- [Backend README](casadin-backend/README.md) - Detalhes da API e arquitetura
- [Swagger API](http://localhost:3001/api) - Documentação interativa

## 🛠️ Desenvolvimento

### Comandos Principais

```bash
# Iniciar todos os serviços
docker compose up

# Iniciar em background
docker compose up -d

# Ver logs
docker compose logs -f

# Parar tudo
docker compose down

# Parar e limpar volumes
docker compose down -v

# Reconstruir imagens
docker compose up --build
```

### Desenvolvimento Local

```bash
# Apenas infraestrutura (banco + MinIO)
docker compose up database minio minio-init

# Backend
cd casadin-backend
npm install
npm run start:dev

# Frontend
cd casadin-frontend
npm install
npm run dev
```

## Arquitetura

```
casadin-nuvem/
├── docker-compose.yml           # Orquestração
├── casadin-backend/            # API NestJS
│   ├── src/
│   │   ├── modules/
│   │   │   ├── authentication/  # Auth JWT
│   │   │   ├── users/          # Usuários
│   │   │   └── weddings/       # Casamentos
│   │   └── main.ts
│   └── Dockerfile
└── casadin-frontend/           # App Next.js
    ├── src/
    │   ├── app/               # Páginas
    │   ├── components/        # Componentes
    │   ├── services/          # APIs
    │   └── providers/         # Context
    └── Dockerfile
```

```