# Home Entertainment Platform

A collection of interactive applications designed for family fun and entertainment at home.

## 🎯 Project Overview

This platform consists of multiple entertainment applications:

- **Story Generator**: AI-powered story creation tool for parent-child bonding
- **Board Game Rule Inspector**: Intelligent assistant for board game rule interpretation
- **Movie Mood**: Personalized movie/show recommendation engine
- **Quiz Generator**: Custom quiz creation tool for various topics

## 🏗️ Architecture

### Backend (Spring Boot)
- **Framework**: Spring Boot with Java
- **AI Integration**: Gemini API for content generation
- **Package Structure**:
  - `com.bestgroup.HomeEntertAInment.controller` - REST API controllers
  - `com.bestgroup.HomeEntertAInment.service` - Business logic services
  - `com.bestgroup.HomeEntertAInment.dto` - Data transfer objects
  - `com.bestgroup.HomeEntertAInment.boardgame` - Board Game Rule Inspector logic
    - `boardgame.utils` - Utility classes for board game functionality

### Frontend (React + TypeScript)
- **Framework**: React with TypeScript and Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **Pages**: Home, Story Generator, Board Game Rule Inspector, Movie Mood, Quiz Generator

## 🎲 Board Game Rule Inspector - Current Status

### ✅ Completed
- **Package Structure**: Created dedicated `boardgame` package
- **Base64 Decoder Utility**: `DecodeBase64ToString` class with comprehensive functionality
  - Static method for Base64 to string decoding
  - Support for custom charsets
  - Input validation and error handling
  - Comprehensive test coverage (11 tests, all passing)

### 🔄 In Progress
- Core rule processing logic
- Question answering system
- Game state management

### 📋 Next Steps
- Rule parser implementation
- AI integration for rule interpretation
- Basic user interface components
- Game rule database setup

## 🚀 Getting Started

### Prerequisites
- Java 21+
- Node.js 18+
- Maven 3.6+

### Backend Setup
```bash
cd backend
./mvnw spring-boot:run
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

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

## 📁 Project Structure

```
HomeEntertAInment/
├── backend/
│   ├── src/main/java/com/bestgroup/HomeEntertAInment/
│   │   ├── controller/          # REST API controllers
│   │   ├── service/            # Business logic services
│   │   ├── dto/                # Data transfer objects
│   │   └── boardgame/          # Board Game Rule Inspector
│   │       └── utils/          # Utility classes
│   └── src/test/java/          # Test classes
├── frontend/
│   ├── src/
│   │   ├── pages/              # Application pages
│   │   ├── layouts/            # Layout components
│   │   └── router.tsx          # Routing configuration
│   └── public/                 # Static assets
└── .cursor/                    # Development rules and guidelines
```

## 🔧 Development Workflow

### Branch Strategy
- `feature/[component-name]` - for new features
- `fix/[issue-description]` - for bug fixes
- `refactor/[component-name]` - for code refactoring
- `docs/[update-type]` - for documentation updates

### Commit Convention
- `feat: [component] - [description]` - for new features
- `fix: [component] - [description]` - for bug fixes
- `refactor: [component] - [description]` - for refactoring
- `docs: [component] - [description]` - for documentation

## 📝 Development Rules

See `.cursor/` directory for detailed development guidelines:
- `general-rules.mdc` - Overall project rules and standards
- `game-rules-engine-rules.mdc` - Specific rules for Board Game Rule Inspector development

## 🤝 Contributing

1. Create a feature branch following the naming convention
2. Make your changes with proper testing
3. Commit with descriptive messages
4. Update documentation as needed
5. Create a pull request for review

## 📄 License

This project is part of the Home Entertainment Platform development.
