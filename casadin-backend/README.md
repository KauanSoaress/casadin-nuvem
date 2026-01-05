# CasaDin Backend

Sistema de gerenciamento de casamentos e presentes desenvolvido com NestJS e TypeORM.

## 🚀 Funcionalidades

- **Autenticação**: Sistema de login e registro com JWT
- **Gerenciamento de Casamentos**: Criação, edição e visualização de casamentos
- **Sistema de Convidados**: Controle de permissões baseado em relações (noivos vs convidados)
- **Upload de Arquivos**: Armazenamento de binários no MinIO
- **Sistema de Presentes**: Controle de pagamentos e contribuições
- **Documentação API**: Swagger completo para todos os endpoints

## 📋 Pré-requisitos

- Node.js (versão 16 ou superior)
- npm ou yarn
- MySQL ou PostgreSQL
- Instância MinIO acessível (local ou hospedada)

## 🛠️ Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd casadin-backend
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:
```env
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=sua_senha
DB_DATABASE=casadin_db

# JWT
JWT_SECRET=seu_jwt_secret_super_seguro

# MinIO
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_USE_SSL=false
MINIO_ACCESS_KEY=seu_access_key
MINIO_SECRET_KEY=seu_secret_key
MINIO_BUCKET=casadin
MINIO_REGION=us-east-1
# URL pública opcional (use quando o endpoint expõe os objetos via HTTP/S)
MINIO_PUBLIC_URL=http://localhost:9000

# App
PORT=3000
```

4. Execute as migrações:
```bash
npm run migration:run
```

5. Inicie o servidor:
```bash
z'
```

## 📚 Documentação da API

A documentação completa da API está disponível através do Swagger UI:

**URL**: http://localhost:3000/api

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

## 🏗️ Estrutura do Projeto

```
src/
├── modules/
│   ├── authentication/     # Autenticação e autorização
│   ├── users/             # Gerenciamento de usuários
│   └── weddings/          # Gerenciamento de casamentos
│       ├── models/        # Entidades do banco
│       ├── dto/           # Data Transfer Objects
│       ├── guards/        # Guards de permissão
│       └── services/      # Serviços de upload
├── common/                # Utilitários compartilhados
└── config/               # Configurações
```

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
# Desenvolvimento
npm run start:dev          # Iniciar em modo desenvolvimento
npm run build              # Compilar o projeto
npm run start:prod         # Iniciar em produção

# Banco de dados
npm run migration:generate # Gerar nova migração
npm run migration:run      # Executar migrações
npm run migration:revert   # Reverter última migração

# Testes
npm run test               # Executar testes unitários
npm run test:e2e           # Executar testes end-to-end
npm run test:cov           # Executar testes com cobertura
```

## 🔧 Configuração do MinIO

Para armazenar arquivos, configure o MinIO:

1. Tenha uma instância MinIO rodando (ex.: `docker run -p 9000:9000 -p 9001:9001 -e MINIO_ROOT_USER=admin -e MINIO_ROOT_PASSWORD=senha minio/minio server /data --console-address ":9001"`)
2. Crie um usuário ou use as credenciais padrão e defina bucket e região
3. Preencha as variáveis `MINIO_*` no `.env`
4. Consulte `src/modules/weddings/MINIO_SETUP.md` para detalhes e exemplos de URLs

## 📝 Licença

Este projeto está sob a licença MIT.

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

