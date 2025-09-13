# AquaMind Technical Walkthrough Guide
## Complete Code Tour & Implementation Details

---

## 🗂️ **FILE STRUCTURE OVERVIEW**

```
/Users/vivekdagur/Desktop/new/
├── 📁 src/                          # Frontend React Application
│   ├── 📁 components/               # Reusable UI Components
│   │   ├── ChatWidget.tsx          # AI Chatbot with Voice
│   │   ├── Navbar.tsx              # Top Navigation
│   │   ├── Sidebar.tsx             # Side Navigation
│   │   ├── TankCard.tsx            # Tank Display Cards
│   │   ├── WaterChart.tsx          # Data Visualization
│   │   └── 📁 ui/                  # Shadcn UI Components
│   ├── 📁 pages/                   # Main Application Pages
│   │   ├── Dashboard.tsx           # Main Dashboard
│   │   ├── Index.tsx               # Landing Page
│   │   ├── Login.tsx               # Authentication
│   │   └── Reports.tsx             # Analytics Reports
│   ├── 📁 context/                 # React Context
│   │   ├── AuthProvider.tsx        # Authentication State
│   │   └── authContext.ts          # Auth Type Definitions
│   ├── 📁 hooks/                   # Custom React Hooks
│   │   ├── useAuth.ts              # Authentication Hook
│   │   └── useLocalStorage.ts      # Local Storage Hook
│   ├── 📁 utils/                   # Utility Functions
│   │   ├── api.ts                  # API Client Configuration
│   │   ├── mockData.ts             # Sample Data
│   │   └── sensors.ts              # Sensor Simulation
│   ├── App.jsx                     # Main App Component
│   └── main.tsx                    # Application Entry Point
├── 📁 backend/                     # Backend Node.js Application
│   ├── 📁 models/                  # MongoDB Schemas
│   │   ├── User.js                 # User Model
│   │   ├── Tank.js                 # Tank Model
│   │   ├── Message.js              # Chat Message Model
│   │   ├── Conversation.js         # Chat Session Model
│   │   └── OpenAILog.js            # AI Interaction Logs
│   ├── 📁 routes/                  # API Routes
│   │   ├── aiRoutes.js             # AI Chat Endpoints
│   │   ├── chatRoutes.js           # Legacy Chat Routes
│   │   └── tankRoutes.js           # Tank Data Endpoints
│   ├── index.js                    # Server Entry Point
│   ├── db.js                       # Database Connection
│   └── package.json                # Backend Dependencies
├── 📁 public/                      # Static Assets
│   ├── droplet.svg                 # Custom Favicon
│   └── favicon.ico                 # Default Favicon
├── package.json                    # Frontend Dependencies
├── vite.config.ts                  # Vite Configuration
├── tailwind.config.ts              # Tailwind CSS Config
└── tsconfig.json                   # TypeScript Configuration
```

---

## 🎯 **DETAILED CODE WALKTHROUGH**

### **1. FRONTEND ENTRY POINT**

#### **📄 src/main.tsx**
```typescript
// Application entry point
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

#### **📄 src/App.jsx**
```jsx
// Main application component with routing
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './context/AuthProvider'
import { Toaster } from './components/ui/toaster'
import ChatWidget from './components/ChatWidget'
import GlobalErrorBoundary from './components/GlobalErrorBoundary'

// Routes configuration
<Routes>
  <Route path="/" element={<Index />} />
  <Route path="/login" element={<Login />} />
  <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
  <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
  <Route path="/alerts" element={<ProtectedRoute><Alerts /></ProtectedRoute>} />
</Routes>
```

### **2. AUTHENTICATION SYSTEM**

#### **📄 src/context/AuthProvider.tsx**
```typescript
// Authentication context and state management
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [authToken, setAuthToken] = useState<string | null>(null)

  // Demo mode setup
  const setDemoMode = () => {
    const demoUser = {
      id: 'demo-user',
      name: 'Demo User',
      email: 'demo@aquamind.com',
      role: 'user',
      demoMode: true
    }
    localStorage.setItem('user', JSON.stringify(demoUser))
    localStorage.setItem('authToken', 'demo-token')
    setUser(demoUser)
    setAuthToken('demo-token')
  }

  // Authentication state management
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    const storedToken = localStorage.getItem('authToken')
    
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser))
      setAuthToken(storedToken)
    }
  }, [])
}
```

### **3. MAIN DASHBOARD COMPONENT**

#### **📄 src/pages/Dashboard.tsx**
```typescript
// Main dashboard with real-time data
export default function Dashboard() {
  const [tanks, setTanks] = useState<Tank[]>([])
  const [selectedTank, setSelectedTank] = useState<Tank | null>(null)
  const [kpis, setKpis] = useState<KPIData | null>(null)

  // Fetch real-time data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tanksResponse, kpisResponse] = await Promise.all([
          apiClient.get('/tanks'),
          apiClient.get('/kpis')
        ])
        
        if (tanksResponse.data?.length > 0) {
          setTanks(tanksResponse.data)
          setSelectedTank(tanksResponse.data[0])
        } else {
          // Fallback to mock data
          setTanks(mockTanks)
          setSelectedTank(mockTanks[0])
        }
        
        setKpis(kpisResponse.data || mockKPIs)
      } catch (error) {
        console.error('Error fetching data:', error)
        // Use mock data as fallback
        setTanks(mockTanks)
        setSelectedTank(mockTanks[0])
        setKpis(mockKPIs)
      }
    }

    fetchData()
  }, [])

  // Real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      if (selectedTank) {
        // Simulate real-time data updates
        setSelectedTank(prev => prev ? {
          ...prev,
          current_level: Math.max(0, prev.current_level + (Math.random() - 0.5) * 2)
        } : null)
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [selectedTank])
}
```

### **4. AI CHATBOT COMPONENT**

#### **📄 src/components/ChatWidget.tsx**
```typescript
// AI Chatbot with voice integration
export default function ChatWidget() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)

  // Voice recognition setup
  const recognition = useRef<SpeechRecognition | null>(null)
  const synthesis = useRef<SpeechSynthesisUtterance | null>(null)

  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
      recognition.current = new SpeechRecognition()
      recognition.current.continuous = false
      recognition.current.interimResults = false
      recognition.current.lang = 'en-US'

      recognition.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        setInput(transcript)
        handleSendMessage(transcript)
      }
    }
  }, [])

  // Send message to AI
  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: message,
      role: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInput('')

    try {
      // Capture page context
      const pageContext = {
        title: document.title,
        url: window.location.href,
        content: document.body.innerText.substring(0, 1000)
      }

      // Send to AI API
      const response = await apiClient.post('/ai/chat', {
        query: message,
        context: pageContext
      })

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response.data.response,
        role: 'assistant',
        timestamp: new Date()
      }

      setMessages(prev => [...prev, aiMessage])

      // Voice output if enabled
      if (isSpeaking && response.data.response) {
        speakText(response.data.response)
      }
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  // Text-to-speech
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = 0.9
      utterance.pitch = 1
      utterance.volume = 0.8
      speechSynthesis.speak(utterance)
    }
  }
}
```

### **5. DATA VISUALIZATION**

#### **📄 src/components/WaterChart.tsx**
```typescript
// Water level trend chart
export const WaterChart: React.FC<WaterChartProps> = ({ 
  data, 
  title = "Water Level Trend", 
  className = "",
  height = 300 
}) => {
  // Format data for chart
  const chartData = data.map(item => ({
    ...item,
    time: new Date(item.timestamp).getHours() + ':' + 
          String(new Date(item.timestamp).getMinutes()).padStart(2, '0'),
    fullTime: item.timestamp
  }))

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
    if (active && payload && payload.length) {
      const data = payload[0]?.payload as { percentage: number; liters: number; fullTime?: string } | undefined;
      if (data) {
        const displayTime = data.fullTime ? new Date(data.fullTime).toLocaleString() : label;
        
        return (
          <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
            <p className="text-sm text-muted-foreground mb-1">
              {displayTime}
            </p>
            <div className="space-y-1">
              <p className="text-sm font-medium text-primary">
                Level: {data.percentage}% ({data.liters.toLocaleString()} L)
              </p>
            </div>
          </div>
        );
      }
    }
    return null;
  };

  return (
    <Card className={`animate-fade-in ${className}`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ height }} className="w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="time" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              <Line 
                type="monotone" 
                dataKey="percentage" 
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: 'hsl(var(--primary))' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
```

---

## 🔧 **BACKEND IMPLEMENTATION**

### **6. SERVER ENTRY POINT**

#### **📄 backend/index.js**
```javascript
// Main server file
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './db.js';
import aiRoutes from './routes/aiRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import tankRoutes from './routes/tankRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5050;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
await connectDB();

// API Routes
app.use('/api/ai', aiRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/tanks', tankRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  console.log(`🟢 Server running on port ${PORT}`);
});
```

### **7. AI INTEGRATION**

#### **📄 backend/routes/aiRoutes.js**
```javascript
// AI chat endpoints
import express from 'express';
import OpenAI from 'openai';
import { Conversation } from '../models/Conversation.js';
import { Message } from '../models/Message.js';
import { OpenAILog } from '../models/OpenAILog.js';

const router = express.Router();

// OpenAI client configuration
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  project: process.env.OPENAI_PROJECT,
  baseURL: process.env.OPENAI_BASE_URL
});

// Main chat endpoint
router.post('/chat', async (req, res) => {
  try {
    const { query, context } = req.body;
    
    // Create conversation if it doesn't exist
    let conversation = await Conversation.findOne({ 
      userId: 'demo-user' 
    }).sort({ createdAt: -1 });
    
    if (!conversation) {
      conversation = new Conversation({
        userId: 'demo-user',
        title: 'AquaMind Chat Session'
      });
      await conversation.save();
    }

    // Save user message
    const userMessage = new Message({
      conversationId: conversation._id,
      role: 'user',
      content: query,
      metadata: { context }
    });
    await userMessage.save();

    // Prepare context for OpenAI
    const systemPrompt = `You are AquaMind, an AI assistant for water management. 
    You help users monitor water levels, predict usage, and provide insights.
    Current page context: ${context?.title || 'Unknown page'}
    Page content: ${context?.content || 'No content available'}`;

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: query }
      ],
      max_tokens: 500,
      temperature: 0.7
    });

    const aiResponse = completion.choices[0].message.content;

    // Save AI response
    const aiMessage = new Message({
      conversationId: conversation._id,
      role: 'assistant',
      content: aiResponse
    });
    await aiMessage.save();

    // Log OpenAI interaction
    const openaiLog = new OpenAILog({
      conversationId: conversation._id,
      userQuery: query,
      aiResponse: aiResponse,
      tokensUsed: completion.usage?.total_tokens || 0,
      model: 'gpt-4o-mini'
    });
    await openaiLog.save();

    res.json({ 
      response: aiResponse,
      conversationId: conversation._id 
    });

  } catch (error) {
    console.error('AI Chat Error:', error);
    
    // Fallback response
    const fallbackResponse = `I'm AquaMind, your water management assistant. 
    I can help you monitor water levels, predict usage, and provide insights.
    However, I'm currently experiencing technical difficulties. 
    Please try again later or contact support.`;
    
    res.json({ 
      response: fallbackResponse,
      error: 'AI service temporarily unavailable'
    });
  }
});

// Streaming chat endpoint
router.get('/chat/stream', async (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*'
  });

  try {
    const { query } = req.query;
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are AquaMind, a water management AI assistant.' },
        { role: 'user', content: query }
      ],
      stream: true
    });

    for await (const chunk of completion) {
      const content = chunk.choices[0]?.delta?.content || '';
      if (content) {
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }

    res.write('data: [DONE]\n\n');
    res.end();

  } catch (error) {
    console.error('Streaming Error:', error);
    res.write(`data: ${JSON.stringify({ error: 'Streaming failed' })}\n\n`);
    res.end();
  }
});

export default router;
```

### **8. DATABASE MODELS**

#### **📄 backend/models/User.js**
```javascript
// User model
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  demoMode: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const User = mongoose.model('User', userSchema);
```

#### **📄 backend/models/Tank.js**
```javascript
// Tank model
import mongoose from 'mongoose';

const tankSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  capacity: { type: Number, required: true },
  current_level: { type: Number, default: 0 },
  avg_consumption_lph: { type: Number, default: 0 },
  last_refill: { type: Date, default: Date.now },
  status: { type: String, enum: ['active', 'inactive', 'maintenance'], default: 'active' },
  userId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export const Tank = mongoose.model('Tank', tankSchema);
```

#### **📄 backend/models/Message.js**
```javascript
// Chat message model
import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Conversation', required: true },
  role: { type: String, enum: ['user', 'assistant'], required: true },
  content: { type: String, required: true },
  metadata: { type: Object, default: {} },
  timestamp: { type: Date, default: Date.now }
});

export const Message = mongoose.model('Message', messageSchema);
```

---

## 🗄️ **DATABASE CONNECTION**

#### **📄 backend/db.js**
```javascript
// Database connection with fallback
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer;

export const connectDB = async () => {
  try {
    if (process.env.MONGO_URI) {
      // Connect to MongoDB Atlas
      await mongoose.connect(process.env.MONGO_URI);
      console.log('✅ Connected to MongoDB Atlas');
    } else {
      // Fallback to in-memory MongoDB
      mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      await mongoose.connect(mongoUri);
      console.log('✅ Connected to in-memory MongoDB (mock)');
    }
  } catch (error) {
    console.error('❌ DB Connection Error:', error);
    
    // Fallback to in-memory MongoDB
    try {
      mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      await mongoose.connect(mongoUri);
      console.log('⚠️ Fallback: Connected to in-memory MongoDB');
    } catch (fallbackError) {
      console.error('❌ Fallback DB Error:', fallbackError);
    }
  }
};
```

---

## 🚀 **DEPLOYMENT CONFIGURATION**

### **Frontend Deployment (Netlify)**
- **Build Command**: `npm run build`
- **Publish Directory**: `dist`
- **Environment Variables**: `VITE_API_URL`

### **Backend Deployment (Railway)**
- **Start Command**: `node index.js`
- **Environment Variables**: 
  - `OPENAI_API_KEY`
  - `OPENAI_PROJECT`
  - `MONGO_URI`
  - `PORT`

### **Database (MongoDB Atlas)**
- **Collections**: Users, Tanks, Messages, Conversations, OpenAILogs
- **Indexes**: Optimized for real-time queries
- **Backup**: Automated daily backups

---

*This technical walkthrough provides complete implementation details for every component of your AquaMind system, perfect for the video script and technical documentation.*
