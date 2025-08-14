# Project Context Documentation

## Overview

This project is a Next.js 14 application (using App Router) for user management with search, sorting, and pagination capabilities. It uses TypeScript, Supabase for data persistence, React Query for data management, and Tailwind CSS for styling.

## Architecture Decisions

### Core Technologies
- **Next.js 14 App Router**: Pages and API routes located in `src/app/`
- **Database**: Supabase with `@supabase/supabase-js` client
- **State Management**: `@tanstack/react-query` for server state with caching and invalidation
- **Styling**: Tailwind CSS for consistent design system
- **TypeScript**: Strict mode with explicit typing throughout

### Development Tools
- **Testing**: Jest 30 for unit and E2E tests (with mocks)
- **Linting**: ESLint with flat config
- **Code Formatting**: Prettier for consistent code style

## Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Main user interface
│   └── api/
│       ├── users/route.ts          # Users CRUD with filtering
│       ├── users/[id]/route.ts     # Individual user operations
│       ├── analytics/route.ts      # Analytics and metrics
│       ├── health/route.ts         # Health check endpoint
│       └── test-connection/route.ts # Database connection test
├── components/                     # Reusable UI components
├── hooks/                         # Custom React hooks
├── services/                      # API service layer
├── lib/                          # Third-party integrations
├── constants/                    # Configuration and constants
├── utils/                        # Utility functions
└── types/                        # TypeScript type definitions
```

## Data Flow Architecture

### Request Flow
1. **UI Layer**: Components use custom hooks for state management
2. **Hook Layer**: Custom hooks (`useUsers`, `useUserFilters`) manage state and side effects
3. **Service Layer**: Domain-specific services (`userService`) handle business logic
4. **API Layer**: HTTP client wrapper provides typed request/response handling
5. **Backend API**: Next.js API routes execute database operations
6. **Database**: Supabase handles data persistence and querying

### Key Components

#### Frontend State Management
- `useUsers`: Manages user data queries and mutations with React Query
- `useUserFilters`: Handles search, sorting, and pagination state
- `useErrorHandler`: Centralizes error state and user feedback

#### Backend API Endpoints
- `GET /api/users`: List users with filtering, sorting, and pagination
- `POST /api/users`: Create new users
- `GET|PUT|DELETE /api/users/[id]`: Individual user operations
- `GET /api/analytics`: Application metrics and recent users

## Development Standards

### Code Conventions
- **TypeScript**: Strict mode with explicit types (no `any`)
- **Functions**: Arrow functions preferred
- **Naming**: Descriptive names following camelCase convention
- **Error Handling**: Consistent error responses with `{ error: string }` format

### File Organization
- **Tests**: Unit tests in `src/**/__tests__/`, E2E tests in `tests/`
- **Constants**: Centralized in `src/constants/` by category
- **Types**: Domain-specific types in `src/types/`
- **Utilities**: Helper functions in `src/utils/`

## Configuration Management

### Environment Variables
Required environment variables for Supabase integration:
- Database connection and authentication keys
- API endpoint configuration

### Constants Structure
- `api.ts`: API endpoints and base URL configuration
- `pagination.ts`: Page size options and defaults
- `sorting.ts`: Sort options and debounce settings
- `messages.ts`: User-facing messages and placeholders

## Testing Strategy

### Unit Tests
- API route testing with mocked dependencies
- Component testing for UI logic
- Service layer testing for business logic

### E2E Tests (Mocked)
- Complete user flows and interactions
- Filter and pagination behavior
- Error handling scenarios

## Extension Guidelines

### Adding New Features
1. **API Routes**: Create in `src/app/api/` using Supabase client
2. **Frontend Services**: Add to `userService` or create new service
3. **UI Components**: Place in `src/components/` with proper TypeScript types
4. **State Management**: Create custom hooks following existing patterns

### Best Practices
- Maintain separation of concerns across layers
- Use React Query for server state management
- Implement proper error handling at each layer
- Add comprehensive tests for new functionality
- Update type definitions for new data structures

### Data Persistence
- Use Supabase client from `src/lib/supabase.ts`
- Implement proper query patterns with filtering and pagination
- Handle database errors appropriately
- Maintain data consistency with proper validation

## Quick Start for Development

1. **Environment Setup**: Configure Supabase credentials
2. **Dependencies**: Install with `npm install`
3. **Development**: Run with `npm run dev`
4. **Testing**: Execute with `npm test`
5. **Building**: Build with `npm run build`

This documentation serves as a reference for maintaining code consistency and architectural decisions throughout the project lifecycle.
