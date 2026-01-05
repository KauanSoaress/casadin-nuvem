# CasaDin - Sistema de Gerenciamento de Casamentos

Sistema completo de gerenciamento de casamentos e presentes desenvolvido com NestJS, Next.js e Docker.

## 🚀 Funcionalidades

- **Autenticação**: Sistema de login e registro com JWT
- **Gerenciamento de Casamentos**: Criação, edição e visualização de casamentos
- **Sistema de Convidados**: Controle de permissões baseado em relações (noivos vs convidados)
- **Upload de Imagens**: Armazenamento seguro no MinIO com exclusão automática
- **Sistema de Presentes**: Controle de pagamentos e contribuições via Mercado Pago
- **Interface Responsiva**: Frontend moderno em Next.js com Material-UI
- **Documentação API**: Swagger completo para todos os endpoints

## 📋 Pré-requisitos

- Docker e Docker Compose
- Node.js 20+ (para desenvolvimento local)

## 🛠️ Instalação e Execução

### Com Docker (Recomendado)

1. Clone o repositório:
```bash
git clone https://github.com/KauanSoaress/casadin-nuvem.git
cd casadin-nuvem
```

2. Suba todos os serviços:
```bash
docker compose up --build
```

Isso irá inicializar:
- **Backend** (NestJS) em `http://localhost:3001`
- **Frontend** (Next.js) em `http://localhost:3000`
- **PostgreSQL** em `localhost:5432`
- **MinIO** em `http://localhost:9000` (console: `http://localhost:9001`)

### Desenvolvimento Local (Opcional)

Se preferir rodar apenas alguns serviços em Docker:

```bash
# Subir apenas banco e MinIO
docker-compose up database minio minio-init

# Backend (em outro terminal)
cd casadin-backend
npm install
npm run start:dev

# Frontend (em outro terminal)
cd casadin-frontend
npm install
npm run dev
```

## 📚 Documentação da API

A documentação completa da API está disponível através do Swagger UI:

**URL**: http://localhost:3001/api

### Endpoints Principais

#### Autenticação (`/auth`)
- `POST /auth/register` - Registrar novo usuário
- `POST /auth/login` - Fazer login
- `GET /auth/profile` - Obter perfil do usuário (autenticado)

#### Usuários (`/users`)
- `GET /users` - Listar todos os usuários

#### Casamentos (`/weddings`)
- `POST /weddings` - Criar novo casamento (apenas noivos)
- `GET /weddings` - Listar todos os casamentos
- `GET /weddings/my-weddings` - Listar casamentos do usuário
- `GET /weddings/:id` - Buscar casamento por ID
- `PATCH /weddings/:id` - Atualizar casamento (apenas noivos)
- `DELETE /weddings/:id` - Remover casamento (apenas noivos)
- `GET /weddings/invitation/:code` - Buscar casamento por código de convite

#### Participação em Casamentos
- `POST /weddings/join` - Juntar-se a um casamento via código de convite
- `POST /weddings/:id/accept-guest` - Aceitar convidado (apenas noivos)

#### Upload de Imagens
- `POST /weddings/upload/couple-photos` - Upload de fotos do casal
- `POST /weddings/upload/footer-photo` - Upload da foto do rodapé
- `POST /weddings/upload/godparent-photo` - Upload da foto do padrinho
- `POST /weddings/upload/gift-photo` - Upload da foto do presente

#### Sistema de Presentes
- `POST /weddings/gifts/:id/payment` - Contribuir para pagamento de presente
- `GET /weddings/gifts/:id/payment-stats` - Obter estatísticas de pagamento

## 🔐 Sistema de Permissões

O sistema utiliza um modelo de relações baseado em papéis:

### Papéis
- **fiance** (Noivo): Pode criar, editar e gerenciar casamentos
- **guest** (Convidado): Pode visualizar e contribuir para presentes

### Fluxo de Trabalho
1. **Criação**: Qualquer usuário pode criar um casamento (torna-se automaticamente noivo)
2. **Convite**: Noivos geram códigos de convite únicos
3. **Junção**: Convidados usam o código para solicitar participação
4. **Aceitação**: Noivos devem aceitar os convidados
5. **Contribuição**: Convidados aceitos podem contribuir para presentes


## 🗄️ Modelos de Dados

### Wedding (Casamento)
- Informações básicas do casamento
- Lista de padrinhos e presentes
- Código de convite único
- Relações com usuários

### Gift (Presente)
- Informações do presente
- Sistema de pagamento agregado
- Controle de status e valores

### WeddingUserRelation (Relação Usuário-Casamento)
- Controle de papéis (noivo/convidado)
- Status de aceitação
- Histórico de ações

## 🚀 Comandos Úteis

```bash
# Docker
docker-compose up --build           # Subir todos os serviços
docker-compose up -d                # Subir em background
docker-compose down                 # Parar todos os serviços
docker-compose down -v              # Parar e remover volumes
docker-compose logs -f backend      # Ver logs do backend
docker-compose restart frontend     # Reiniciar frontend

# Desenvolvimento (Backend)
cd casadin-backend
npm run start:dev          # Iniciar em modo desenvolvimento
npm run build              # Compilar o projeto
npm run start:prod         # Iniciar em produção

# Desenvolvimento (Frontend)
cd casadin-frontend
npm run dev                # Iniciar em modo desenvolvimento
npm run build              # Compilar o projeto
npm run start              # Iniciar em produção

# Testes
npm run test               # Executar testes unitários
npm run test:e2e           # Executar testes end-to-end
npm run test:cov           # Executar testes com cobertura
```

## � Serviços Docker

O projeto utiliza Docker Compose com os seguintes serviços:

### casadin-backend
- **Porta**: 3001
- **Tecnologia**: NestJS
- **Variáveis de ambiente**: Configuradas no docker-compose.yml

### casadin-frontend
- **Porta**: 3000
- **Tecnologia**: Next.js 15 com React 19
- **Otimização de imagens**: Desabilitada para compatibilidade com MinIO

### database
- **Porta**: 5432
- **Tecnologia**: PostgreSQL
- **Credenciais**: casadin/casadin
- **Database**: casadin_db

### minio
- **Porta API**: 9000
- **Porta Console**: 9001
- **Credenciais**: minioadmin/minioadmin
- **Bucket**: casadin (criado automaticamente)
- **Acesso**: Público para leitura (configurado automaticamente)

### minio-init
- Serviço auxiliar que configura o MinIO na primeira execução
- Cria o bucket e define permissões públicas de leitura

## 🔧 Configuração do MinIO

O MinIO é configurado automaticamente pelo serviço `minio-init`:

1. Bucket `casadin` criado automaticamente
2. Permissões públicas de leitura configuradas
3. Imagens acessíveis em `http://localhost:9000/casadin/...`
4. Exclusão automática de imagens ao remover casamentos

**Console MinIO**: Acesse http://localhost:9001 (minioadmin/minioadmin) para gerenciar buckets e arquivos

## � Detalhes Técnicos

### Backend
- **Framework**: NestJS 10+
- **ORM**: TypeORM
- **Banco de Dados**: PostgreSQL
- **Autenticação**: JWT via Passport
- **Storage**: MinIO para arquivos
- **Pagamentos**: Mercado Pago SDK
- **Documentação**: Swagger/OpenAPI

### Frontend
- **Framework**: Next.js 15 (App Router)
- **UI**: Material-UI (MUI) 7+
- **Styling**: TailwindCSS 4
- **Estado**: React Context API
- **HTTP Client**: Axios
- **Pagamentos**: Mercado Pago React SDK


