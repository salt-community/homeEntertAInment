# HomeEntertAInment

A comprehensive home entertainment platform featuring AI-powered applications for family fun and interactive experiences.

## 🎯 Features

### ✅ Implemented Features

- **Story Generator** - AI-powered story creation with customizable characters, themes, age groups, and AI-generated illustrations
- **Quiz Generator** - Create, play, and share custom quizzes with AI-generated questions on any topic
- **Board Game Rule Inspector** - Interactive chat-based assistant for board game rule clarification with PDF rule book upload
- **Movie Mood** - AI-powered movie recommendation system with personalized lists and OMDB integration
- **User Authentication** - Secure authentication system using Clerk
- **Image Generation** - AI-powered story illustrations using Runware API

### 🏗️ Architecture

**Backend (Spring Boot + Java 21)**

- RESTful API with Spring Boot 3.5.5
- PostgreSQL database with JPA/Hibernate
- Google Gemini AI integration for content generation
- Runware API for AI image generation
- ConvertAPI for PDF processing
- OMDB API for movie data
- Clerk JWT authentication
- OpenAPI documentation with Swagger UI
- Comprehensive package structure:
  - `controller` - REST API endpoints
  - `service` - Business logic and AI integration
  - `storybuilder` - Story generation system
  - `boardgame` - Board game rule inspector functionality
  - `quiz` - Quiz management system
  - `entity` - JPA entities and repositories
  - `dto` - Data transfer objects
  - `config` - Security and CORS configuration

**Frontend (React + TypeScript)**

- React 19 with TypeScript and Vite
- TanStack Router for navigation
- TanStack Query for state management
- Tailwind CSS 4.x for styling
- Clerk React for authentication
- Comprehensive testing with Vitest and Testing Library
- Responsive design with modern UI components

## 🚀 Getting Started

### Prerequisites

- Java 21+
- Node.js 18+
- PostgreSQL database (or use Docker Compose)
- Google Gemini API key
- ConvertAPI token (for PDF processing)
- Runware API key (for image generation)
- OMDB API key (for movie data)
- Clerk account (for authentication)

### Database Setup

You can either install PostgreSQL locally or use Docker:

```bash
cd backend
docker-compose up -d
```

This will start a PostgreSQL container with the required database.

### Environment Setup

#### Backend Environment (.env in backend directory)

```bash
# Clerk Authentication
CLERK_JWT_ISSUER_URI=https://your-clerk-domain.clerk.accounts.dev

# Database Configuration
JDBC_DATABASE_URL=jdbc:postgresql://localhost:5432/entertainmentdb
JDBC_DATABASE_USERNAME=entertainmentdb
JDBC_DATABASE_PASSWORD=entertainmentdb
JPA_DDL_AUTO=create-drop
JPA_SHOW_SQL=true

# API Keys
GEMINI_API_KEY=your_gemini_api_key
CONVERT_API_TOKEN=your_convert_api_token
RUNWARE_API_KEY=your_runware_api_key
OMDB_API_KEY=your_omdb_api_key

# Server Configuration
SERVER_PORT=8080
APP_BASE_URL=http://localhost:8080
```

#### Frontend Environment (.env in frontend directory)

```bash
# Clerk Configuration
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key

# API Configuration
VITE_API_BASE_URL=http://localhost:8080
```

### Backend Setup

```bash
cd backend
./mvnw spring-boot:run
```

Backend runs on `http://localhost:8080`

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:5173`

## 📁 Project Structure

```
HomeEntertAInment/
├── backend/
│   ├── src/main/java/com/bestgroup/HomeEntertAInment/
│   │   ├── controller/          # Main REST API controllers
│   │   │   ├── GeminiController.java
│   │   │   ├── MovieController.java
│   │   │   └── MovieListController.java
│   │   ├── service/             # Core business logic services
│   │   ├── config/              # Security and CORS configuration
│   │   ├── entity/              # JPA entities
│   │   ├── repository/          # Data repositories
│   │   ├── dto/                 # Data transfer objects
│   │   ├── storybuilder/        # Story generation system
│   │   │   ├── http/            # Story API endpoints
│   │   │   ├── model/           # Story data models
│   │   │   └── service/         # Story generation services
│   │   ├── quiz/                # Quiz management system
│   │   │   ├── controller/      # Quiz API endpoints
│   │   │   ├── service/         # Quiz business logic
│   │   │   ├── model/           # Quiz data models
│   │   │   ├── dto/             # Quiz DTOs
│   │   │   └── repository/      # Quiz repositories
│   │   └── boardgame/           # Board game rule inspector
│   │       ├── controller/      # Chat and session API endpoints
│   │       ├── service/         # Chat and bot services
│   │       ├── entity/          # Database entities
│   │       ├── repository/      # Data repositories
│   │       ├── dto/             # Board game DTOs
│   │       └── utils/           # Utility classes
│   ├── src/main/resources/
│   │   ├── application.yml      # Application configuration
│   │   └── data.sql            # Database initialization
│   ├── docker-compose.yml       # PostgreSQL container setup
│   └── pom.xml                 # Maven dependencies
├── frontend/
│   ├── src/
│   │   ├── pages/              # Application pages
│   │   │   ├── Home.tsx
│   │   │   ├── MovieMood.tsx
│   │   │   ├── SavedMovieLists.tsx
│   │   │   ├── BoardGameRuleInspector.tsx
│   │   │   ├── BoardGameSessionChat.tsx
│   │   │   ├── story/          # Story generation pages
│   │   │   └── Quiz/           # Quiz pages
│   │   ├── components/         # Reusable UI components
│   │   │   ├── movie/          # Movie-related components
│   │   │   └── quiz/           # Quiz-related components
│   │   ├── story/             # Story generation system
│   │   │   ├── components/     # Story UI components
│   │   │   ├── hooks/          # Story React hooks
│   │   │   ├── api/            # Story API calls
│   │   │   ├── types/          # Story TypeScript types
│   │   │   └── utils/          # Story utilities
│   │   ├── services/          # API service layer
│   │   ├── hooks/             # Custom React hooks
│   │   ├── types/             # TypeScript type definitions
│   │   ├── layouts/           # Layout components
│   │   └── router.tsx         # Routing configuration
│   ├── package.json           # Node.js dependencies
│   └── tailwind.config.js     # Tailwind CSS configuration
└── README.md
```

## 🔧 API Endpoints

### Story Generation

- `POST /api/story/generate` - Generate a new story
- `POST /api/story/generate-image` - Generate AI illustrations for stories
- `GET /api/story/saved` - Get saved stories
- `POST /api/story/save` - Save a story

### Quiz Management

- `POST /api/quiz/create` - Create a new quiz
- `GET /api/quiz/{quizId}` - Get quiz by ID
- `GET /api/quiz/all` - Get all quizzes
- `GET /api/quiz/user/{userId}` - Get user's quizzes
- `DELETE /api/quiz/{quizId}` - Delete a quiz

### Movie Recommendations

- `POST /api/movies/recommend` - Get AI-powered movie recommendations
- `GET /api/movie-lists` - Get saved movie lists
- `POST /api/movie-lists` - Create a new movie list
- `GET /api/movie-lists/{listId}` - Get specific movie list
- `DELETE /api/movie-lists/{listId}` - Delete a movie list

### Board Game Rule Inspector

- `POST /api/boardgame/sessions` - Create a new game session
- `GET /api/boardgame/sessions` - Get user's game sessions
- `GET /api/sessions/{sessionId}/chatEntries` - Get chat history
- `POST /api/sessions/{sessionId}/chatEntry` - Send message
- `POST /api/sessions/{sessionId}/chatbot` - Initialize chatbot
- `POST /api/boardgame/convert/pdf-to-text` - Convert PDF rule book to text

### System & Health

- `GET /api/gemini/status` - Check Gemini API connectivity
- `GET /actuator/health` - Application health check

## 🧪 Testing

### Backend Tests

```bash
cd backend
./mvnw test
```

### Frontend Tests

```bash
cd frontend
npm test
```

## 🛠️ Development

### Database

The application uses PostgreSQL with JPA/Hibernate. Database schema is automatically created from entities and initialized with sample data from `data.sql`.

### AI Integration

- **Gemini API**: Used for story generation, quiz creation, and chat responses
- **ConvertAPI**: Used for PDF to text conversion in board game rule processing

### Key Technologies

**Backend Stack:**

- **Framework**: Spring Boot 3.5.5, Spring Security, Spring Data JPA
- **Language**: Java 21
- **Database**: PostgreSQL 14 with Hibernate/JPA
- **Authentication**: Clerk JWT
- **AI Services**: Google Gemini API, Runware API for image generation
- **External APIs**: ConvertAPI (PDF processing), OMDB API (movie data)
- **Documentation**: OpenAPI 3 with Swagger UI
- **Build Tool**: Maven
- **Utilities**: Lombok, JSON processing

**Frontend Stack:**

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 7.x
- **Routing**: TanStack Router
- **State Management**: TanStack Query (React Query)
- **Styling**: Tailwind CSS 4.x
- **Authentication**: Clerk React
- **Testing**: Vitest, Testing Library, jsdom
- **Markdown**: React Markdown for story display

**Development & Deployment:**

- **Containerization**: Docker Compose for PostgreSQL
- **Code Quality**: ESLint, TypeScript strict mode
- **Testing**: Comprehensive unit and integration tests
- **Environment**: Multi-environment configuration support

## 📝 Development Notes

### Architecture Patterns

- **Clean Architecture**: Separate layers for controllers, services, repositories, and entities
- **Domain-Driven Design**: Feature-based package organization (story, quiz, boardgame)
- **RESTful API Design**: Consistent endpoint naming and HTTP methods
- **Component-Based Frontend**: Modular, reusable React components

### AI Integration

- **Gemini API**: Powers story generation, quiz creation, movie recommendations, and chat responses
- **Runware API**: Generates AI illustrations for stories
- **Prompt Engineering**: Carefully crafted prompts for each use case with context-aware responses
- **Error Handling**: Robust error handling for AI service failures

### Security & Authentication

- **JWT Authentication**: Clerk-based authentication with Spring Security
- **CORS Configuration**: Proper cross-origin resource sharing setup
- **Input Validation**: Comprehensive validation using Spring Boot Validation
- **Secure File Upload**: PDF processing with size limits and validation

### Database Design

- **JPA Entities**: Well-structured entities with proper relationships
- **Database Initialization**: Automated schema creation and sample data loading
- **Connection Pooling**: HikariCP for optimal database performance
- **Migration Support**: Flexible DDL auto configuration for different environments

### Testing Strategy

- **Backend**: Unit tests for services and integration tests for controllers
- **Frontend**: Component testing with Testing Library and Vitest
- **API Testing**: Comprehensive endpoint testing
- **Mock Services**: Proper mocking of external API dependencies

### Performance Considerations

- **Lazy Loading**: Efficient data loading strategies
- **Caching**: TanStack Query for client-side caching
- **Image Optimization**: Efficient AI image generation and storage
- **Database Indexing**: Proper indexing for query performance

## 🔗 Additional Resources

### API Documentation

- **Swagger UI**: Available at `http://localhost:8080/swagger-ui.html` when backend is running
- **OpenAPI Spec**: Available at `http://localhost:8080/v3/api-docs`

### External Service Setup

1. **Clerk Authentication**: [Setup Guide](https://clerk.com/docs)
2. **Google Gemini API**: [Get API Key](https://makersuite.google.com/app/apikey)
3. **Runware API**: [Sign up](https://runware.ai) for image generation
4. **ConvertAPI**: [Get Token](https://www.convertapi.com/) for PDF processing
5. **OMDB API**: [Get Key](http://www.omdbapi.com/apikey.aspx) for movie data

### Development Commands

```bash
# Backend
cd backend
./mvnw clean install          # Build project
./mvnw spring-boot:run        # Run development server
./mvnw test                   # Run tests

# Frontend
cd frontend
npm install                   # Install dependencies
npm run dev                   # Start development server
npm run build                 # Build for production
npm run test                  # Run tests
npm run test:watch            # Run tests in watch mode
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes with proper testing
4. Commit with descriptive messages (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Create a pull request for review

### Development Guidelines

- Follow existing code style and patterns
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR
- Use meaningful commit messages

## 📄 License

This project is part of the Home Entertainment Platform development.

---

**Built with ❤️ for family entertainment and AI-powered fun!**
