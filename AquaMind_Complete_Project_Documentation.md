# AquaMind Smart Water Management System
## Complete Project Documentation

---

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture Overview](#architecture-overview)
3. [Frontend Documentation](#frontend-documentation)
4. [Backend Documentation](#backend-documentation)
5. [Database Schema](#database-schema)
6. [API Documentation](#api-documentation)
7. [AI Integration](#ai-integration)
8. [Deployment Guide](#deployment-guide)
9. [Security & Performance](#security--performance)

---

## Project Overview

**AquaMind** is a comprehensive smart water management platform that provides real-time monitoring, AI-powered insights, and intelligent alerts for water systems. The system helps users optimize water usage, prevent wastage, and ensure efficient water resource management.

### Key Features
- **Real-time Tank Monitoring**: Live water level tracking with visual indicators
- **Smart Analytics Dashboard**: KPIs including total capacity, current usage, efficiency metrics
- **AI-Powered Insights**: Intelligent recommendations for water optimization
- **Alert System**: Proactive notifications for low levels, leaks, and maintenance
- **Usage Forecasting**: Predictive analytics for consumption patterns
- **Community Management**: Multi-user access with role-based permissions
- **Mobile-Responsive Design**: Access from any device, anywhere
- **Historical Data Tracking**: Trends and patterns analysis

### Technology Stack
- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **AI Integration**: OpenAI GPT-4o-mini API
- **Real-time Features**: WebSocket-like SSE streaming
- **Authentication**: JWT-based with role management
- **Charts**: Recharts for data visualization

---

## Architecture Overview

### System Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │    Backend      │    │   Database      │
│   (React/Vite)  │◄──►│  (Node/Express) │◄──►│   (MongoDB)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web Browser   │    │   OpenAI API    │    │  In-Memory      │
│   (Chrome/Safari)│    │   (GPT-4o-mini) │    │  Fallback       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Data Flow
1. **User Interaction** → Frontend React Components
2. **API Calls** → Backend Express Routes
3. **Data Processing** → MongoDB Models & Business Logic
4. **AI Processing** → OpenAI API Integration
5. **Real-time Updates** → SSE Streaming & Sensor Simulation
6. **Response** → Frontend State Management & UI Updates

---

## Frontend Documentation

### Project Structure
```
src/
├── components/           # Reusable UI components
│   ├── ui/              # shadcn/ui base components
│   ├── ChatWidget.tsx   # AI Assistant component
│   ├── DashboardWrapper.tsx
│   ├── Navbar.tsx
│   ├── Sidebar.tsx
│   ├── TankCard.tsx
│   └── ...
├── pages/               # Route components
│   ├── Dashboard.tsx
│   ├── Login.tsx
│   ├── Reports.tsx
│   └── ...
├── hooks/               # Custom React hooks
├── context/             # React Context providers
├── utils/               # Utility functions
└── routes/              # Route protection
```

### Key Components

#### 1. Dashboard.tsx
**Purpose**: Main dashboard displaying water management overview
**Key Features**:
- Real-time tank monitoring with visual indicators
- KPI cards showing system metrics
- Interactive charts for usage analytics
- Alert notifications and status updates
- Tank selection and detailed views

**Data Sources**:
- Backend API: `/api/tanks`, `/api/kpis`, `/api/monthly-usage`
- Client-side simulation for real-time updates
- Fallback to mock data when backend unavailable

#### 2. ChatWidget.tsx
**Purpose**: AI-powered assistant for water management queries
**Key Features**:
- Voice input/output capabilities
- Context-aware responses based on current page data
- Streaming responses via Server-Sent Events
- Conversation history persistence
- Integration with OpenAI GPT-4o-mini

**Technical Implementation**:
- Web Speech API for voice recognition
- SpeechSynthesisUtterance for text-to-speech
- SSE streaming for real-time AI responses
- Context building from page state

#### 3. TankCard.tsx
**Purpose**: Individual tank display component
**Key Features**:
- Visual water level indicators
- Status badges (healthy, low, critical)
- Real-time consumption metrics
- Click-to-select functionality

#### 4. SmallBarChart.tsx & WaterChart.tsx
**Purpose**: Data visualization components
**Key Features**:
- Monthly usage trends
- Historical consumption patterns
- Interactive tooltips and legends
- Responsive design for mobile

### State Management
- **React Query**: Server state management and caching
- **React Context**: Authentication and user state
- **Local State**: Component-specific state with useState/useEffect
- **LocalStorage**: Demo analytics and session persistence

### Routing
- **React Router DOM**: Client-side routing
- **Protected Routes**: Authentication-based access control
- **Role-based Access**: Admin vs regular user permissions

---

## Backend Documentation

### Project Structure
```
backend/
├── models/              # MongoDB schemas
│   ├── User.js
│   ├── Tank.js
│   ├── Conversation.js
│   ├── Message.js
│   └── OpenAILog.js
├── routes/              # API endpoints
│   ├── aiRoutes.js      # AI chat functionality
│   ├── tankRoutes.js    # Tank management
│   └── chatRoutes.js    # Basic chat (legacy)
├── db.js                # Database connection
├── index.js             # Server entry point
└── package.json         # Dependencies
```

### Server Configuration
**Port**: 5050 (configurable via PORT environment variable)
**CORS**: Enabled for frontend communication
**Environment**: Development with production-ready features

### Key Files

#### 1. index.js
**Purpose**: Main server entry point
**Features**:
- Express server setup with middleware
- Database connection with fallback
- Route mounting and error handling
- Environment variable configuration

#### 2. db.js
**Purpose**: Database connection management
**Features**:
- MongoDB Atlas connection with Mongoose
- In-memory MongoDB fallback for development
- Connection error handling and retry logic
- Environment-based configuration

#### 3. aiRoutes.js
**Purpose**: AI chat functionality and OpenAI integration
**Key Endpoints**:
- `POST /api/ai/chat`: Standard chat with OpenAI
- `GET /api/ai/chat/stream`: Streaming chat via SSE
- `GET /api/ai/conversations/:id`: Chat history retrieval

**Features**:
- OpenAI GPT-4o-mini integration
- Context-aware responses based on page data
- Conversation persistence in MongoDB
- Fallback responses when OpenAI unavailable
- Support for project-specific API keys

#### 4. tankRoutes.js
**Purpose**: Tank data management
**Key Endpoints**:
- `GET /api/tanks`: Retrieve all tanks
- `GET /api/kpis`: Calculate and return KPIs
- `GET /api/monthly-usage`: Monthly usage analytics

#### 5. chatRoutes.js
**Purpose**: Basic chat functionality (legacy)
**Features**:
- Simple echo responses with context
- In-memory conversation storage
- Context-aware replies

---

## Database Schema

### MongoDB Collections

#### 1. Users Collection
```javascript
{
  email: String (unique, sparse, indexed),
  name: String,
  passwordHash: String,
  provider: String (enum: ['local','google','github','anonymous']),
  role: String (default: 'user'),
  metadata: Mixed,
  createdAt: Date,
  lastActiveAt: Date
}
```

#### 2. Tanks Collection
```javascript
{
  name: String,
  capacity: Number,
  currentLevel: Number,
  location: String
}
```

#### 3. Conversations Collection
```javascript
{
  user: ObjectId (ref: 'User', indexed),
  title: String,
  model: String (default: 'gpt-4o-mini'),
  metadata: Mixed,
  createdAt: Date,
  updatedAt: Date (indexed with user)
}
```

#### 4. Messages Collection
```javascript
{
  conversation: ObjectId (ref: 'Conversation', indexed),
  role: String (enum: ['user','assistant','system','function']),
  content: String,
  contentJSON: Mixed,
  tokens: Number,
  model: String,
  createdAt: Date (indexed)
}
```

#### 5. OpenAILogs Collection
```javascript
{
  request: Mixed,
  response: Mixed,
  model: String,
  tokensUsed: Number,
  costEstimate: Number,
  createdAt: Date (indexed)
}
```

### Database Features
- **Indexing**: Optimized queries with proper indexes
- **Text Search**: Full-text search on message content
- **TTL**: Optional automatic cleanup for logs
- **Fallback**: In-memory MongoDB for development

---

## API Documentation

### Base URL
`http://localhost:5050/api` (development)
`https://yourdomain.com/api` (production)

### Authentication
Currently uses demo authentication. Production implementation would include:
- JWT token validation
- Role-based access control
- Session management

### Endpoints

#### Tank Management
```
GET /api/tanks
Response: Array of tank objects
```

```
GET /api/kpis
Response: {
  totalWaterStored: number,
  totalCapacity: number,
  utilizationPercentage: number,
  communityTanks: number,
  nextRefillETA: number
}
```

```
GET /api/monthly-usage
Response: Array of monthly usage data
```

#### AI Chat
```
POST /api/ai/chat
Body: {
  query: string,
  conversationId?: string,
  context?: object
}
Response: {
  reply: string,
  conversationId: string
}
```

```
GET /api/ai/chat/stream?query=...&conversationId=...&context=...
Response: Server-Sent Events stream
```

```
GET /api/ai/conversations/:id
Response: Conversation object with messages
```

#### Basic Chat (Legacy)
```
POST /api/chat/chat
Body: {
  message: string,
  conversationId?: string,
  context?: object
}
Response: {
  reply: string,
  conversationId: string
}
```

### Error Handling
- **400**: Bad Request - Invalid input data
- **500**: Internal Server Error - Server-side issues
- **Fallback Responses**: Graceful degradation when services unavailable

---

## AI Integration

### OpenAI Integration
- **Model**: GPT-4o-mini for cost efficiency
- **API Version**: OpenAI SDK v5.x
- **Features**: Context-aware responses, streaming support
- **Fallback**: Local responses when API unavailable

### Context Building
The AI assistant receives rich context including:
- **Project Summary**: AquaMind system description
- **Selected Tank**: Current tank details and metrics
- **Recent Alerts**: System alerts and notifications
- **Page Content**: Current page context and user actions
- **KPIs**: System-wide performance metrics

### Conversation Management
- **Persistence**: All conversations stored in MongoDB
- **History**: Retrievable conversation history
- **Streaming**: Real-time response streaming via SSE
- **Logging**: Complete request/response logging for analytics

### Voice Features
- **Speech Recognition**: Web Speech API integration
- **Text-to-Speech**: SpeechSynthesisUtterance
- **Voice Commands**: Special commands like `/speak`
- **Accessibility**: Screen reader compatibility

---

## Deployment Guide

### Frontend Deployment
1. **Build**: `npm run build`
2. **Output**: `dist/` folder with static assets
3. **Hosting**: Any static hosting (Vercel, Netlify, AWS S3)
4. **Environment**: Set `VITE_API_URL` to backend URL

### Backend Deployment
1. **Dependencies**: `npm install`
2. **Environment**: Create `.env` with required variables
3. **Database**: Configure MongoDB Atlas connection
4. **Hosting**: Node.js hosting (Railway, Heroku, AWS EC2)
5. **Port**: Configure PORT environment variable

### Environment Variables
```bash
# Backend (.env)
MONGO_URI=mongodb+srv://...
OPENAI_API_KEY=sk-...
OPENAI_PROJECT=proj_... (optional)
OPENAI_BASE_URL=... (optional)
PORT=5050

# Frontend (.env)
VITE_API_URL=http://localhost:5050/api
```

### Production Considerations
- **Security**: HTTPS, CORS configuration, API key protection
- **Performance**: CDN for static assets, database indexing
- **Monitoring**: Error logging, performance metrics
- **Scaling**: Load balancing, database sharding

---

## Security & Performance

### Security Features
- **CORS**: Configured for frontend communication
- **Input Validation**: Request body validation
- **Error Handling**: Secure error responses
- **API Key Protection**: Environment variable storage
- **SQL Injection Prevention**: Mongoose ODM protection

### Performance Optimizations
- **Caching**: React Query for API response caching
- **Lazy Loading**: Component-based code splitting
- **Image Optimization**: SVG icons and optimized assets
- **Database Indexing**: Optimized MongoDB queries
- **Real-time Updates**: Efficient SSE streaming

### Monitoring & Analytics
- **Error Boundaries**: Global error handling
- **Performance Tracking**: Page load metrics
- **User Analytics**: Demo interaction tracking
- **API Monitoring**: Request/response logging

---

## Conclusion

AquaMind represents a comprehensive solution for smart water management, combining modern web technologies with AI-powered insights. The system is designed for scalability, maintainability, and user experience, providing both immediate value and long-term sustainability.

The architecture supports both development and production environments, with robust fallback mechanisms ensuring system reliability. The AI integration enhances user experience while maintaining cost efficiency through intelligent API usage.

This documentation provides a complete technical overview for developers, stakeholders, and users interested in understanding the AquaMind system architecture and implementation details.
