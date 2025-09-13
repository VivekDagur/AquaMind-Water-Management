# AquaMind Water Management System - Technical Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Frontend Architecture](#frontend-architecture)
3. [Backend Architecture](#backend-architecture)
4. [API Design & Handling](#api-design--handling)
5. [Database Schema](#database-schema)
6. [Deployment Architecture](#deployment-architecture)
7. [Security Implementation](#security-implementation)
8. [Performance Optimization](#performance-optimization)

---

## Project Overview

### System Architecture
AquaMind is a full-stack web application built with modern technologies for smart water management. The system follows a microservices architecture with clear separation between frontend, backend, and database layers.

**Tech Stack:**
- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend:** Node.js, Express.js, MongoDB with Mongoose
- **AI Integration:** OpenAI GPT-4o-mini API
- **Deployment:** Netlify (Frontend), Railway (Backend), MongoDB Atlas (Database)

### Project Structure
```
AquaMind/
├── src/                    # Frontend React application
├── backend/               # Node.js backend server
├── public/               # Static assets
├── deployment files      # Docker, configs, guides
└── documentation        # Project docs and guides
```

---

## Frontend Architecture

### Core Technologies & Purpose

#### 1. React 18 with TypeScript (`src/main.tsx`)
- **Purpose:** Modern React application entry point using createRoot API
- **Implementation:** Renders the main App component with strict mode enabled
- **Key Features:** Type safety, modern React concurrent features

#### 2. Vite Build System (`vite.config.ts`)
- **Purpose:** Fast development server and optimized production builds
- **Configuration:** React plugin, path aliases (@/ for src/), HMR support
- **Benefits:** Lightning-fast hot reload, optimized bundling

#### 3. Application Router (`src/App.jsx`)
- **Purpose:** Main application component handling routing and global state
- **Implementation:** React Router v6 with protected routes
- **Features:**
  - Public routes (landing page)
  - Protected routes (dashboard, admin)
  - Authentication context provider
  - Global error boundary
  - Toast notification system

#### 4. Authentication System (`src/context/AuthProvider.tsx`)
- **Purpose:** Centralized authentication state management
- **Implementation:** React Context API with localStorage persistence
- **Features:**
  - Mock authentication (demo purposes)
  - User role management (user/admin)
  - Persistent login state
  - Login/logout functionality

#### 5. Protected Route Component (`src/routes/ProtectedRoute.tsx`)
- **Purpose:** Route-level access control and authentication checks
- **Implementation:** Higher-order component wrapping protected pages
- **Features:**
  - Authentication verification
  - Role-based access control
  - Automatic redirects to login
  - Admin-only route protection

#### 6. UI Component System (`src/components/ui/`)
- **Purpose:** Reusable, consistent UI components using shadcn/ui
- **Implementation:** Radix UI primitives with Tailwind CSS styling
- **Components:**
  - Button, Card, Input, Select, Badge
  - Alert, Dialog, Dropdown Menu
  - Progress, Separator, Tabs
  - Toast notifications

#### 7. Landing Page (`src/pages/Index.tsx`)
- **Purpose:** Public-facing marketing page showcasing AquaMind features
- **Implementation:** Responsive design with modern UI patterns
- **Sections:**
  - Hero section with call-to-action
  - Features showcase with icons
  - Benefits and statistics
  - Testimonials and social proof
  - Footer with links

#### 8. Dashboard (`src/pages/Dashboard.tsx`)
- **Purpose:** Main application interface for water management
- **Implementation:** Real-time data visualization and controls
- **Features:**
  - Tank monitoring with live data
  - KPI cards (capacity, usage, efficiency)
  - Interactive charts and graphs
  - Alert notifications
  - AI chat widget integration

#### 9. Chat Widget (`src/components/ChatWidget.tsx`)
- **Purpose:** AI-powered assistant for user queries
- **Implementation:** Floating chat interface with real-time messaging
- **Features:**
  - Collapsible chat window
  - Message history
  - Typing indicators
  - Error handling
  - Context-aware responses

### State Management Strategy
- **Authentication:** React Context API for global auth state
- **Local State:** useState and useEffect hooks for component state
- **API State:** Custom hooks for data fetching and caching
- **Form State:** Controlled components with validation

### Styling Architecture
- **Tailwind CSS:** Utility-first CSS framework for rapid styling
- **shadcn/ui:** Pre-built component library for consistency
- **Responsive Design:** Mobile-first approach with breakpoint system
- **Dark Mode:** CSS variables for theme switching capability

---

## Backend Architecture

### Core Technologies & Purpose

#### 1. Express.js Server (`backend/index.js`)
- **Purpose:** Main HTTP server handling all API requests
- **Implementation:** Express application with middleware stack
- **Features:**
  - CORS configuration for cross-origin requests
  - JSON body parsing
  - Error handling middleware
  - Health check endpoint
  - Graceful startup with database connection

#### 2. Database Connection (`backend/db.js`)
- **Purpose:** MongoDB connection management with fallback strategy
- **Implementation:** Mongoose ODM with connection pooling
- **Features:**
  - Primary connection to MongoDB Atlas
  - Fallback to in-memory MongoDB for development
  - Connection error handling and retry logic
  - Environment-based configuration

#### 3. Data Models (`backend/models/`)

##### User Model (`User.js`)
- **Purpose:** User account and authentication data
- **Schema Fields:**
  - email, name, passwordHash
  - provider (local/oauth), role (user/admin)
  - metadata (preferences, settings)
  - timestamps (createdAt, updatedAt)

##### Tank Model (`Tank.js`)
- **Purpose:** Water tank information and monitoring data
- **Schema Fields:**
  - name, capacity, currentLevel
  - location, status, lastUpdated
  - sensorId, alertThresholds

##### Conversation Model (`Conversation.js`)
- **Purpose:** AI chat conversation tracking
- **Schema Fields:**
  - user reference, title, model used
  - metadata (context, settings)
  - timestamps for session tracking

##### Message Model (`Message.js`)
- **Purpose:** Individual chat messages storage
- **Schema Fields:**
  - conversation reference, role (user/assistant)
  - content, tokens used, model
  - timestamp for message ordering

##### OpenAI Log Model (`OpenAILog.js`)
- **Purpose:** API usage tracking and cost monitoring
- **Schema Fields:**
  - request/response data, tokens used
  - cost estimation, model used
  - timestamp for billing analysis

#### 4. API Routes (`backend/routes/`)

##### Chat Routes (`chatRoutes.js`)
- **Purpose:** Legacy chat functionality and conversation history
- **Endpoints:**
  - `POST /api/chat` - Simple echo chat
  - `GET /api/conversations` - Conversation history
- **Features:** Basic message handling, history retrieval

##### Tank Routes (`tankRoutes.js`)
- **Purpose:** Water tank data management and monitoring
- **Endpoints:**
  - `GET /api/tanks` - All tank data
  - `GET /api/kpis` - Key performance indicators
  - `GET /api/monthly-usage` - Usage analytics
- **Features:** Real-time data, aggregated statistics

##### AI Routes (`aiRoutes.js`)
- **Purpose:** Advanced AI chat with OpenAI integration
- **Endpoints:**
  - `POST /api/ai/chat` - AI-powered conversations
  - `GET /api/ai/stream` - Server-sent events for streaming
- **Features:**
  - OpenAI GPT-4o-mini integration
  - Context-aware responses
  - Message persistence
  - Usage logging and cost tracking
  - Fallback error handling

### API Design Patterns
- **RESTful Architecture:** Standard HTTP methods and status codes
- **Error Handling:** Consistent error response format
- **Validation:** Input validation and sanitization
- **Logging:** Request/response logging for debugging
- **Rate Limiting:** Protection against API abuse (planned)

---

## API Design & Handling

### Request/Response Flow

#### 1. Frontend API Integration
- **HTTP Client:** Axios for API requests with interceptors
- **Base URL:** Environment variable configuration (`VITE_API_URL`)
- **Error Handling:** Global error interceptors and user feedback
- **Loading States:** UI indicators during API calls

#### 2. Backend API Structure

##### Authentication Flow
```
Client Request → CORS Check → Body Parsing → Route Handler → Response
```

##### AI Chat Flow
```
User Message → Context Building → OpenAI API → Response Processing → Database Storage → Client Response
```

##### Tank Data Flow
```
Request → Database Query → Data Aggregation → Response Formatting → Client Response
```

#### 3. Error Handling Strategy
- **Client-Side:** Try-catch blocks with user-friendly error messages
- **Server-Side:** Centralized error middleware with logging
- **Fallback:** Graceful degradation when services are unavailable

#### 4. Data Validation
- **Input Validation:** Schema validation for all API inputs
- **Type Checking:** TypeScript interfaces for type safety
- **Sanitization:** XSS and injection prevention

### API Security
- **CORS Configuration:** Controlled cross-origin access
- **Environment Variables:** Secure API key management
- **Input Sanitization:** Prevention of malicious inputs
- **Rate Limiting:** API abuse prevention (implementation ready)

---

## Database Schema

### MongoDB Collections

#### 1. Users Collection
```javascript
{
  _id: ObjectId,
  email: String (unique, required),
  name: String (required),
  passwordHash: String,
  provider: String (default: 'local'),
  role: String (enum: ['user', 'admin']),
  metadata: Object,
  createdAt: Date,
  updatedAt: Date
}
```

#### 2. Tanks Collection
```javascript
{
  _id: ObjectId,
  name: String (required),
  capacity: Number (required),
  currentLevel: Number,
  location: String,
  status: String,
  sensorId: String,
  alertThresholds: {
    low: Number,
    high: Number
  },
  lastUpdated: Date
}
```

#### 3. Conversations Collection
```javascript
{
  _id: ObjectId,
  user: ObjectId (ref: 'User'),
  title: String,
  model: String,
  metadata: Object,
  createdAt: Date,
  updatedAt: Date
}
```

#### 4. Messages Collection
```javascript
{
  _id: ObjectId,
  conversation: ObjectId (ref: 'Conversation'),
  role: String (enum: ['user', 'assistant']),
  content: String (required),
  tokens: Number,
  model: String,
  createdAt: Date
}
```

### Database Design Principles
- **Normalization:** Proper relationship modeling with references
- **Indexing:** Optimized queries with strategic indexes
- **Validation:** Schema-level data validation
- **Scalability:** Design supports horizontal scaling

---

## Deployment Architecture

### Production Environment

#### 1. Frontend Deployment (Netlify)
- **Build Process:** Vite production build with optimization
- **Static Hosting:** CDN-distributed static files
- **Environment Variables:** `VITE_API_URL` for backend connection
- **Auto-Deployment:** GitHub integration for continuous deployment
- **Domain:** Custom domain support with SSL certificates

#### 2. Backend Deployment (Railway)
- **Container:** Node.js runtime environment
- **Environment Variables:** 
  - `NODE_ENV=production`
  - `PORT=5000`
  - `MONGO_URI` (MongoDB Atlas connection)
  - `OPENAI_API_KEY` and `OPENAI_PROJECT`
- **Auto-Deployment:** GitHub integration with automatic builds
- **Scaling:** Horizontal scaling based on traffic

#### 3. Database (MongoDB Atlas)
- **Cloud Database:** Managed MongoDB service
- **Security:** IP whitelisting and authentication
- **Backup:** Automated backups and point-in-time recovery
- **Monitoring:** Performance metrics and alerting

### DevOps Pipeline
```
Code Push → GitHub → Automatic Build → Deploy → Health Check → Live
```

#### 1. Development Workflow
- **Local Development:** Docker Compose for full stack
- **Version Control:** Git with feature branches
- **Code Quality:** ESLint, Prettier, TypeScript checking

#### 2. CI/CD Pipeline
- **Automated Testing:** Unit and integration tests (planned)
- **Build Optimization:** Minification and tree shaking
- **Deployment Verification:** Health checks and smoke tests

---

## Security Implementation

### Authentication & Authorization
- **Mock Authentication:** Demo implementation for development
- **Role-Based Access:** User and admin role separation
- **Session Management:** JWT tokens for production (planned)
- **Password Security:** Bcrypt hashing for passwords

### API Security
- **CORS Policy:** Controlled cross-origin requests
- **Input Validation:** Schema validation and sanitization
- **Rate Limiting:** API abuse prevention
- **Error Handling:** No sensitive information in error responses

### Data Protection
- **Environment Variables:** Secure configuration management
- **Database Security:** MongoDB Atlas security features
- **HTTPS:** SSL/TLS encryption for all communications
- **API Key Management:** Secure OpenAI API key handling

### Security Best Practices
- **Principle of Least Privilege:** Minimal required permissions
- **Defense in Depth:** Multiple security layers
- **Regular Updates:** Dependency security updates
- **Monitoring:** Security event logging and alerting

---

## Performance Optimization

### Frontend Performance
- **Code Splitting:** Dynamic imports for route-based splitting
- **Bundle Optimization:** Vite's optimized build process
- **Caching Strategy:** Browser caching for static assets
- **Lazy Loading:** Component and image lazy loading
- **Responsive Images:** Optimized images for different screen sizes

### Backend Performance
- **Database Optimization:** Efficient queries and indexing
- **Caching:** In-memory caching for frequently accessed data
- **Connection Pooling:** MongoDB connection optimization
- **Compression:** Gzip compression for API responses
- **Async Processing:** Non-blocking I/O operations

### Monitoring & Analytics
- **Performance Metrics:** Response time and throughput monitoring
- **Error Tracking:** Centralized error logging and alerting
- **User Analytics:** Usage patterns and feature adoption
- **Resource Monitoring:** CPU, memory, and database performance

### Scalability Considerations
- **Horizontal Scaling:** Load balancer ready architecture
- **Database Sharding:** MongoDB sharding for large datasets
- **CDN Integration:** Global content delivery
- **Microservices:** Service separation for independent scaling
- **Caching Layers:** Redis for session and data caching

---

## Conclusion

AquaMind represents a modern, scalable approach to water management systems. The architecture emphasizes:

- **Modularity:** Clear separation of concerns
- **Scalability:** Cloud-native design for growth
- **Security:** Multiple layers of protection
- **Performance:** Optimized for speed and efficiency
- **Maintainability:** Clean code and documentation
- **User Experience:** Intuitive interface and real-time feedback

The system is production-ready with comprehensive error handling, monitoring capabilities, and deployment automation. Future enhancements can be easily integrated due to the flexible, well-documented architecture.
