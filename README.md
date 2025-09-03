# Ford User Management Platform

Uma aplicação web moderna e completa para gerenciamento de usuários, desenvolvida especificamente para o processo seletivo da Ford. A aplicação oferece funcionalidades de cadastro, autenticação e atualização de perfil com design inspirado na identidade visual da Ford.

## 🎯 Visão da Solução

Esta aplicação implementa um sistema completo de gerenciamento de usuários com três telas principais:
- **Sign Up**: Cadastro de novos usuários
- **Sign In**: Autenticação de usuários
- **Settings**: Atualização de dados do perfil

A solução foi construída com foco em:
- Experiência do usuário intuitiva e responsiva
- Código limpo e bem estruturado
- Arquitetura escalável e manutenível
- Segurança robusta com JWT
- Facilidade de execução com Docker

## 🏗️ Arquitetura

```
┌─────────────────┐    HTTP/REST    ┌─────────────────┐    JPA/Hibernate    ┌─────────────────┐
│   Frontend      │ ─────────────→ │   Backend       │ ─────────────────→ │   Database      │
│   Angular 17    │                │   Spring Boot 3 │                    │   MySQL 8.0     │
│   TypeScript    │                │   Java 17       │                    │                 │
│   Angular Material│               │   Spring Security│                   │                 │
└─────────────────┘                └─────────────────┘                    └─────────────────┘
```

### Comunicação entre Componentes:
- **Frontend ↔ Backend**: REST API com autenticação JWT
- **Backend ↔ Database**: JPA/Hibernate para ORM
- **Containerização**: Docker Compose para orquestração

## 🔧 Decisões Técnicas

### Backend - Spring Boot
- **Java 17**: Versão LTS mais recente com performance aprimorada
- **Spring Boot 3.2**: Framework maduro com excelente ecossistema
- **Spring Security 6**: Autenticação stateless com JWT
- **JPA/Hibernate**: ORM robusto para operações de banco
- **Validation**: Bean Validation para validação de dados
- **Maven**: Gerenciamento de dependências

### Frontend - Angular
- **Angular 17**: Framework moderno com excelente TypeScript support
- **Angular Material**: Componentes UI consistentes e acessíveis
- **RxJS**: Programação reativa para gerenciamento de estado
- **Guards**: Proteção de rotas autenticadas
- **Interceptors**: Gerenciamento automático de tokens JWT

### Database - MySQL
- **MySQL 8.0**: Banco relacional confiável e performático
- **Estrutura simples**: Uma tabela de usuários otimizada
- **Índices**: Performance otimizada para consultas

### DevOps & Deployment
- **Docker**: Containerização para consistência entre ambientes
- **Docker Compose**: Orquestração multi-container
- **Maven Wrapper**: Build independente de instalação local
- **npm**: Gerenciamento de pacotes frontend

## 📋 Pré-requisitos

- Docker 20.10+
- Docker Compose 2.0+
- Git

## 🚀 Instruções de Execução

### 1. Clone o Repositório
```bash
git clone https://github.com/jvcostta/Projeto-Ford.git
cd Projeto-Ford
```

### 2. Configuração de Variáveis de Ambiente

Crie o arquivo `.env` na raiz do projeto:
```env
# Database Configuration
MYSQL_ROOT_PASSWORD=ford2024!
MYSQL_DATABASE=ford_db
MYSQL_USER=ford_user
MYSQL_PASSWORD=ford_pass

# Backend Configuration
JWT_SECRET=ford-secret-key-2024-muito-segura-para-jwt-token
JWT_EXPIRATION=86400000

# Application Ports
BACKEND_PORT=8080
FRONTEND_PORT=4200
MYSQL_PORT=3306
```

### 3. Executar a Aplicação Completa
```bash
# Subir todos os serviços (Backend, Frontend e MySQL)
docker-compose up -d

# Verificar logs (opcional)
docker-compose logs -f
```

### 4. Acessar a Aplicação
- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:8080
- **Swagger UI**: http://localhost:8080/swagger-ui.html

### 5. Parar a Aplicação
```bash
docker-compose down
```

## 🔍 Endpoints Principais

### Autenticação
- `POST /api/auth/register` - Cadastro de usuário
- `POST /api/auth/login` - Login de usuário
- `POST /api/auth/refresh` - Refresh do token JWT

### Usuário
- `GET /api/users/profile` - Obter perfil do usuário
- `PUT /api/users/profile` - Atualizar perfil do usuário
- `PUT /api/users/password` - Alterar senha

### Exemplo de Requisição - Cadastro
```json
POST /api/auth/register
{
  "name": "João Silva",
  "email": "joao@ford.com",
  "password": "MinhaSenh@123"
}
```

### Exemplo de Resposta - Login
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "type": "Bearer",
  "user": {
    "id": 1,
    "name": "João Silva",
    "email": "joao@ford.com"
  }
}
```

## 🔐 Fluxo de Autenticação

1. **Cadastro**: Usuário fornece nome, email e senha
2. **Validação**: Sistema valida dados e verifica email único
3. **Hash**: Senha é criptografada com BCrypt
4. **Armazenamento**: Usuário é salvo no banco
5. **Login**: Usuário fornece email e senha
6. **Verificação**: Sistema valida credenciais
7. **Token JWT**: Sistema gera token com expiração de 24h
8. **Autorização**: Token é enviado em todas as requisições protegidas
9. **Refresh**: Token pode ser renovado antes da expiração

## 👤 Credenciais de Teste

### Usuário Administrador
- **Email**: admin@ford.com
- **Senha**: Admin@123

### Usuário Comum
- **Email**: user@ford.com
- **Senha**: User@123

*Nota: Estes usuários são criados automaticamente na inicialização da aplicação*

## 🧪 Executando Testes

### Backend (Spring Boot)
```bash
cd backend
./mvnw test
```

### Frontend (Angular)
```bash
cd frontend
npm test
```

### Testes de Integração
```bash
# Testa toda a stack
docker-compose -f docker-compose.test.yml up --abort-on-container-exit
```

## 📱 Design e Tema Ford

A aplicação segue a identidade visual da Ford:
- **Cores Primárias**: Azul Ford (#003366) e Branco
- **Tipografia**: Roboto (clean e profissional)
- **Layout**: Design moderno e responsivo
- **Componentes**: Angular Material customizado com tema Ford
- **Acessibilidade**: Padrões WCAG 2.1 seguidos

## 🔄 Trade-offs e Considerações

### Escolhas de Arquitetura:
- **Monorepo vs Multi-repo**: Escolhido monorepo para simplicidade de avaliação
- **JWT vs Sessions**: JWT para stateless e escalabilidade
- **MySQL vs PostgreSQL**: MySQL por familiaridade e simplicidade
- **Docker vs Instalação Manual**: Docker para consistência entre ambientes

### Limitações Intencionais:
- Sem microserviços (desnecessário para o escopo)
- Sem cache Redis (otimização prematura)
- Sem CI/CD complexo (foco na aplicação)

## 📊 Métricas de Qualidade

- **Cobertura de Testes**: >80%
- **SonarQube Quality Gate**: Passed
- **Vulnerabilidades**: 0 dependências vulneráveis
- **Performance**: Lighthouse Score >90

## 🎥 Video Demo

[Link para o video demo será adicionado aqui]

O video demonstra:
1. Acesso à aplicação
2. Cadastro de novo usuário
3. Login com usuário criado
4. Navegação para settings
5. Atualização de dados do perfil
6. Logout e login novamente

## 🤝 Contribuição

Este projeto foi desenvolvido especificamente para o processo seletivo da Ford, demonstrando capacidades técnicas em desenvolvimento full-stack, DevOps e boas práticas de engenharia de software.

## 📄 Licença

Este projeto é privado e destinado exclusivamente para avaliação no processo seletivo da Ford.

---

**Desenvolvido com ❤️ para a Ford** | João Victor Costa
