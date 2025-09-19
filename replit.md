# StudentDrive - AI-Powered Study Platform

## Overview

StudentDrive is an AI-powered study platform designed to help students accelerate their academic performance through personalized learning tools. The platform provides AI-generated flashcards, mock exams, study summaries, mind maps, and spaced repetition learning paths. Built as a React SPA with TypeScript, the frontend connects to a Laravel backend API to deliver a comprehensive educational experience with subscription-based monetization.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern React features
- **Build Tool**: Vite for fast development and optimized production builds
- **Routing**: React Router v6 for client-side navigation with protected routes
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent, accessible UI components
- **State Management**: 
  - React Query (TanStack Query) for server state management and caching
  - Zustand for lightweight client-side state management
  - Local state with React hooks for component-level state

### Component Structure
- **Layout System**: Shared layout with responsive sidebar navigation and header
- **Authentication Flow**: Separate auth pages (SignIn/SignUp) with form validation using React Hook Form and Zod
- **Dashboard**: Centralized hub showing user stats, progress, and quick actions
- **Feature Modules**: Organized by domain (auth, content, AI tools, exams, learning paths)
- **UI Components**: Reusable shadcn/ui components with consistent styling and accessibility

### API Integration
- **HTTP Client**: Axios-based API client with centralized error handling and request/response interceptors
- **Type Safety**: Comprehensive TypeScript interfaces for all API responses and request payloads
- **Authentication**: JWT token management with automatic token refresh
- **Error Handling**: Global error boundary with user-friendly error messages

### Styling and Design System
- **Design Tokens**: CSS custom properties for brand colors (Primary Green #1DB954, Dark Navy #0B1B3C, Teal #A6D5D5)
- **Component Library**: shadcn/ui for consistent, accessible components
- **Responsive Design**: Mobile-first approach with Tailwind's responsive utilities
- **Dark Mode**: Prepared with CSS variables for future dark theme support

### Development Tools
- **Testing**: Vitest and React Testing Library for unit and integration tests
- **Storybook**: Component documentation and isolated development
- **Linting**: ESLint with TypeScript and React-specific rules
- **Type Checking**: Strict TypeScript configuration with path mapping

### Key Features Architecture
- **PDF Viewing**: Integration with pdfjs-dist for document rendering
- **AI Tools**: Structured interfaces for flashcard generation, quiz creation, and summarization
- **Exam Engine**: Timed exam functionality with auto-save and progress tracking
- **Learning Paths**: Spaced repetition system with SM-2 algorithm implementation
- **Analytics Dashboard**: Performance tracking with visual progress indicators

## External Dependencies

### Core Libraries
- **React Ecosystem**: React 18, React DOM, React Router v6
- **TypeScript**: Full TypeScript support with strict type checking
- **Build Tools**: Vite with React plugin for fast development and builds

### UI and Styling
- **Tailwind CSS**: Utility-first CSS framework with custom configuration
- **shadcn/ui**: Accessible component library built on Radix UI primitives
- **Lucide React**: Icon library for consistent iconography
- **Class Variance Authority**: Utility for component variant management

### State Management and Data Fetching
- **TanStack React Query**: Server state management, caching, and synchronization
- **Zustand**: Lightweight state management for client-side state
- **Axios**: HTTP client for API communication with interceptors

### Form Handling and Validation
- **React Hook Form**: Performant forms with minimal re-renders
- **Zod**: Runtime type validation and schema definition
- **Hookform Resolvers**: Integration between React Hook Form and Zod

### Development and Testing
- **Vitest**: Fast unit test runner with Jest-compatible API
- **React Testing Library**: Testing utilities focused on user interactions
- **Storybook**: Component documentation and isolated development environment
- **MSW (Mock Service Worker)**: API mocking for development and testing

### Specialized Features
- **pdfjs-dist**: PDF rendering and manipulation for document viewing
- **date-fns**: Date manipulation and formatting utilities
- **React Flow Renderer**: Interactive node-based diagrams for mind maps

### Backend Integration
- **Laravel API**: RESTful API backend with authentication endpoints
- **JWT Authentication**: Token-based authentication with automatic refresh
- **File Upload**: Multipart form data handling for document uploads
- **Real-time Updates**: Prepared for WebSocket integration for live features

### Third-party Services (Prepared)
- **Payment Processing**: Stripe integration for subscription management
- **AI Services**: OpenAI API integration for content generation
- **Analytics**: User behavior tracking and performance metrics
- **Email Service**: Transactional email capabilities for notifications