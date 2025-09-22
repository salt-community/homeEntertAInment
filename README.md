# HomeEntertAInment

A comprehensive home entertainment platform featuring AI-powered applications for family fun and interactive experiences.

## 🎯 Features

### ✅ Implemented Features

- **Story Generator** - AI-powered story creation tool with customizable characters, themes, and age groups
- **Quiz Generator** - Create custom quizzes with AI-generated questions on any topic
- **Board Game Rule Inspector** - Interactive chat-based assistant for board game rule clarification and dispute resolution
- **Movie Mood** - Movie recommendation system (UI placeholder - coming soon)

### 🏗️ Architecture

**Backend (Spring Boot + Java 21)**

- RESTful API with Spring Boot 3.5.5
- PostgreSQL database with JPA/Hibernate
- Google Gemini AI integration for content generation
- ConvertAPI integration for PDF processing
- Comprehensive package structure:
  - `controller` - REST API endpoints
  - `service` - Business logic and AI integration
  - `storybuilder` - Story generation system
  - `boardgame` - Board game rule inspector functionality
  - `dto` - Data transfer objects

**Frontend (React + TypeScript)**

- React 19 with TypeScript and Vite
- TanStack Router for navigation
- TanStack Query for state management
- Tailwind CSS for styling
- Responsive design with modern UI components

## 🚀 Getting Started

### Prerequisites

- Java 21+
- Node.js 18+
- PostgreSQL database
- Google Gemini API key
- ConvertAPI token (for PDF processing)

### Environment Setup

Create environment variables:

```bash
GEMINI_API_KEY=your_gemini_api_key
CONVERT_API_TOKEN=your_convert_api_token
JDBC_DATABASE_URL=jdbc:postgresql://localhost:5432/entertainmentdb
JDBC_DATABASE_USERNAME=entertainmentdb
JDBC_DATABASE_PASSWORD=entertainmentdb
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
│   │   ├── controller/          # REST API controllers
│   │   │   ├── GeminiController.java
│   │   │   └── QuizController.java
│   │   ├── service/             # Business logic services
│   │   ├── storybuilder/        # Story generation system
│   │   │   ├── http/            # Story API endpoints
│   │   │   └── model/           # Story data models
│   │   ├── boardgame/           # Board game rule inspector
│   │   │   ├── controller/       # Chat API endpoints
│   │   │   ├── service/         # Chat and bot services
│   │   │   ├── entity/          # Database entities
│   │   │   └── utils/           # Utility classes
│   │   └── dto/                 # Data transfer objects
│   └── src/main/resources/
│       ├── application.yml      # Configuration
│       └── data.sql            # Database initialization
├── frontend/
│   ├── src/
│   │   ├── pages/              # Application pages
│   │   │   ├── Home.tsx
│   │   │   ├── StoryGenerator.tsx
│   │   │   ├── BoardGameRuleInspector.tsx
│   │   │   ├── BoardGameSessionChat.tsx
│   │   │   ├── MovieMood.tsx
│   │   │   └── Quiz/           # Quiz pages
│   │   ├── components/         # Reusable components
│   │   ├── story/             # Story generation components
│   │   ├── services/          # API services
│   │   └── router.tsx         # Routing configuration
└── README.md
```

## 🔧 API Endpoints

### Story Generation

- `POST /api/story/generate` - Generate a new story

### Quiz Management

- `POST /api/quiz/create` - Create a new quiz
- `GET /api/quiz/{quizId}` - Get quiz by ID
- `GET /api/quiz/all` - Get all quizzes

### Board Game Chat

- `GET /api/sessions/{sessionId}/chatEntries` - Get chat history
- `POST /api/sessions/{sessionId}/chatEntry` - Send message
- `POST /api/sessions/{sessionId}/chatbot` - Initialize chatbot

### System

- `GET /api/gemini/status` - Check Gemini API connectivity

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

- **Backend**: Spring Boot, Spring Data JPA, Spring Web, Lombok
- **Frontend**: React, TypeScript, Vite, TanStack Router, TanStack Query
- **Database**: PostgreSQL
- **AI**: Google Gemini API
- **Styling**: Tailwind CSS

## 📝 Development Notes

- The application follows a clean architecture pattern with separate layers for controllers, services, and data access
- AI prompts are carefully crafted for each use case (stories, quizzes, chat)
- The board game rule inspector includes session management and chat history
- All API endpoints include proper error handling and logging
- Frontend components are modular and reusable

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes with proper testing
4. Commit with descriptive messages
5. Create a pull request for review

## 📄 License

This project is part of the Home Entertainment Platform development.
