# Memory Extraction System

A comprehensive memory extraction and query system that analyzes chat conversations to extract and store meaningful memories using AI, with a modern web interface for searching and managing extracted memories.

## 🚀 Live Demo

- **API**: https://memory-api-faff.onrender.com
- **Frontend**: https://memory-frontend-faff.vercel.app
- **Backend Repository**: https://github.com/LogicalGuy77/memory-api-faff

## 🎯 Overview

The Memory Extraction System is designed to solve the problem of automatically capturing and organizing meaningful information from chat conversations. Instead of manually tracking user preferences, personal information, and important details scattered across multiple conversations, this system uses AI to intelligently extract, categorize, and store memories that can be easily searched and retrieved.

### Key Problems Solved

1. **Information Overload**: Automatically processes large volumes of chat data
2. **Memory Organization**: Categorizes memories into meaningful types
3. **Intelligent Search**: Provides semantic and text-based search capabilities
4. **Data Persistence**: Reliably stores and manages extracted memories
5. **User Experience**: Offers an intuitive interface for memory management

## 🏗️ Architecture

The system follows a modern three-tier architecture:

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Database      │
│   (React)       │◄──►│   (FastAPI)     │◄──►│  (PostgreSQL)   │
│                 │    │                 │    │                 │
│ • Memory Query  │    │ • Memory        │    │ • Chat Messages │
│ • Chat Upload   │    │   Extraction    │    │ • Memories      │
│ • Results View  │    │ • AI Processing │    │ • Associations  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Data Flow

1. **Chat Upload**: Users upload chat data via the frontend
2. **AI Processing**: Gemini AI analyzes conversations and extracts memories
3. **Memory Storage**: Extracted memories are categorized and stored in PostgreSQL
4. **Query & Search**: Users can search and filter memories through the frontend
5. **Results Display**: Relevant memories are highlighted and presented

## ✨ Features

### Backend (FastAPI)
- **Memory Extraction**: AI-powered extraction using Google Gemini
- **RESTful API**: Complete CRUD operations for chats and memories
- **Advanced Search**: Semantic search with filtering capabilities
- **Data Validation**: Robust input validation and error handling
- **PostgreSQL Integration**: Scalable database with proper indexing
- **CORS Support**: Cross-origin requests for frontend integration

### Frontend (React)
- **Chat Upload**: File upload with real-time processing feedback
- **Memory Query**: Advanced search interface with multiple filters
- **Result Highlighting**: Search term highlighting in results
- **Type Filtering**: Filter memories by category
- **Modern UI**: Responsive design with Tailwind CSS
- **Error Handling**: Comprehensive error states and user feedback

### Memory Categories
- **Food Preferences**: Dietary restrictions, favorite cuisines, allergies
- **Travel Preferences**: Destinations, transportation, accommodation
- **Personal Information**: Names, relationships, important dates
- **Delivery Instructions**: Addresses, special instructions, preferences
- **Hobbies & Interests**: Activities, sports, entertainment preferences
- **Routine & Timing**: Schedules, availability, time preferences

## 💻 Technology Stack

### Backend
- **FastAPI**: Modern, fast web framework for building APIs
- **Google Gemini AI**: Advanced language model for memory extraction
- **PostgreSQL**: Robust relational database for production
- **Psycopg2**: PostgreSQL adapter for Python
- **Pydantic**: Data validation and settings management
- **Uvicorn**: ASGI server for FastAPI

### Frontend
- **React**: Modern JavaScript library for building user interfaces
- **Tailwind CSS**: Utility-first CSS framework
- **Axios**: HTTP client for API communication
- **Vite**: Fast build tool and development server

### Deployment
- **Render**: Backend deployment with PostgreSQL
- **Vercel**: Frontend deployment with CDN
- **Environment Variables**: Secure configuration management

## 📁 Project Structure

```
faff/
├── memory-api/                 # Backend API
│   ├── main.py                # FastAPI application
│   ├── database.py            # PostgreSQL connection
│   ├── requirements.txt       # Python dependencies
│   └── .env                   # Environment variables
├── frontend-memory/           # React frontend
│   ├── src/
│   │   ├── components/        # React components
│   │   │   ├── ChatUpload.jsx # Chat upload interface
│   │   │   ├── MemoryQuery.jsx# Memory search interface
│   │   │   └── ui/            # Reusable UI components
│   │   ├── services/          # API communication
│   │   └── App.jsx            # Main application
│   ├── package.json           # Node.js dependencies
│   └── tailwind.config.js     # Tailwind configuration
└── README.md                  # This file
```

## 🛠️ Setup & Installation

### Prerequisites
- Python 3.8+
- Node.js 16+
- PostgreSQL (for local development)

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd faff/memory-api
   ```

2. **Create virtual environment**
   ```bash
   python -m venv memory_env
   source memory_env/bin/activate  # On Windows: memory_env\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Environment configuration**
   ```bash
   # Create .env file
   GEMINI_API_KEY=your_gemini_api_key
   DATABASE_URL=postgresql://username:password@localhost:5432/memory_db
   ```

5. **Run the server**
   ```bash
   uvicorn main:app --reload
   ```

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd ../frontend-memory
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

## 📚 API Documentation

### Core Endpoints

#### Chat Management
- `POST /upload-chat` - Upload and process chat data
- `GET /chats` - List all chats
- `GET /chats/{chat_id}` - Get specific chat details

#### Memory Operations
- `GET /memories` - List all memories with optional filtering
- `GET /memories/search` - Advanced memory search
- `GET /memories/types` - Get available memory types
- `DELETE /memories/{memory_id}` - Delete specific memory

#### Health Check
- `GET /health` - API health status

### Request/Response Examples

**Upload Chat:**
```json
POST /upload-chat
{
  "chat_data": [
    {
      "message_id": "msg_1",
      "timestamp": "2024-01-01T10:00:00",
      "sender": "user",
      "content": "I love Italian food, especially pasta",
      "chat_id": "chat_1"
    }
  ]
}
```

**Search Memories:**
```json
GET /memories/search?query=food&types=food_preference&chat_id=chat_1
{
  "memories": [
    {
      "memory_id": "mem_1",
      "content": "User loves Italian food, especially pasta",
      "memory_type": "food_preference",
      "confidence": 0.95,
      "created_at": "2024-01-01T10:00:00"
    }
  ]
}
```

## 🧠 Memory Types

The system categorizes extracted information into six primary types:

1. **Food Preferences** (`food_preference`)
   - Favorite cuisines, dishes, restaurants
   - Dietary restrictions and allergies
   - Cooking preferences and habits

2. **Travel Preferences** (`travel_preference`)
   - Preferred destinations and activities
   - Transportation preferences
   - Accommodation requirements

3. **Personal Information** (`personal_info`)
   - Names, relationships, family details
   - Important dates and events
   - Contact information

4. **Delivery Instructions** (`delivery_instruction`)
   - Addresses and locations
   - Special delivery requirements
   - Access instructions

5. **Hobbies & Interests** (`hobby_interest`)
   - Sports and activities
   - Entertainment preferences
   - Skills and talents

6. **Routine & Timing** (`routine_timing`)
   - Daily schedules and habits
   - Availability patterns
   - Time preferences

## ⚖️ Design Decisions & Trade-offs

### Database Choice: PostgreSQL vs SQLite

**Decision**: Migrated from SQLite to PostgreSQL for production deployment.

**Rationale**:
- **Scalability**: PostgreSQL handles concurrent connections better
- **Production Ready**: Industry standard for web applications
- **Advanced Features**: Better text search, indexing, and query optimization
- **Render Compatibility**: Native PostgreSQL support on hosting platform

**Trade-offs**:
- ✅ Better performance and reliability
- ✅ Advanced search capabilities (ILIKE, full-text search)
- ✅ Production-grade features
- ❌ Increased complexity for local development
- ❌ Additional hosting costs

### AI Model: Google Gemini

**Decision**: Using Google Gemini for memory extraction.

**Rationale**:
- **Advanced Understanding**: Excellent context comprehension
- **Structured Output**: Reliable JSON response format
- **Cost Effective**: Competitive pricing for API usage
- **Integration**: Good Python SDK support

**Trade-offs**:
- ✅ High-quality memory extraction
- ✅ Reliable structured responses
- ✅ Good performance
- ❌ External dependency and API costs
- ❌ Rate limiting considerations
- ❌ Requires internet connectivity

### Frontend Framework: React

**Decision**: React with functional components and hooks.

**Rationale**:
- **Modern Development**: Current best practices
- **Component Reusability**: Modular UI components
- **State Management**: Built-in hooks for state handling
- **Ecosystem**: Rich library ecosystem

**Trade-offs**:
- ✅ Fast development and good DX
- ✅ Reusable components
- ✅ Large community support
- ❌ Bundle size considerations
- ❌ Learning curve for new developers

### CSS Framework: Tailwind CSS

**Decision**: Utility-first CSS framework.

**Rationale**:
- **Rapid Prototyping**: Quick UI development
- **Consistency**: Predefined design tokens
- **Performance**: Optimized production builds
- **Flexibility**: Easy customization

**Trade-offs**:
- ✅ Fast development
- ✅ Consistent design
- ✅ Small production bundle
- ❌ Learning curve
- ❌ HTML verbosity

### Deployment Strategy: Microservices

**Decision**: Separate deployments for frontend and backend.

**Rationale**:
- **Scalability**: Independent scaling of services
- **Technology Freedom**: Use best tools for each service
- **Deployment Flexibility**: Different update schedules
- **Reliability**: Isolated failure domains

**Trade-offs**:
- ✅ Better scalability and flexibility
- ✅ Independent deployments
- ✅ Technology diversity
- ❌ Increased operational complexity
- ❌ Network latency between services
- ❌ CORS configuration requirements

### Memory Extraction Approach: Batch Processing

**Decision**: Process entire conversations rather than individual messages.

**Rationale**:
- **Context Preservation**: Better understanding of conversation flow
- **Relationship Detection**: Connections between related information
- **Efficiency**: Fewer API calls to AI service
- **Quality**: More accurate memory extraction

**Trade-offs**:
- ✅ Higher quality extraction
- ✅ Better context understanding
- ✅ More efficient API usage
- ❌ Longer processing time for large chats
- ❌ Memory usage for large conversations
- ❌ All-or-nothing processing

## 🚀 Deployment

### Backend (Render)

1. **Database Setup**
   - PostgreSQL database automatically provisioned
   - Environment variables configured via Render dashboard

2. **Service Configuration**
   ```yaml
   # render.yaml
   services:
     - type: web
       name: memory-api
       env: python
       buildCommand: pip install -r requirements.txt
       startCommand: uvicorn main:app --host 0.0.0.0 --port $PORT
   ```

3. **Environment Variables**
   ```
   GEMINI_API_KEY=<your-api-key>
   DATABASE_URL=<auto-generated-by-render>
   ```

### Frontend (Vercel)

1. **Build Configuration**
   ```json
   {
     "builds": [
       {
         "src": "package.json",
         "use": "@vercel/static-build"
       }
     ]
   }
   ```

2. **Environment Variables**
   ```
   VITE_API_BASE_URL=https://memory-api-faff.onrender.com
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow existing code style and conventions
- Add tests for new features
- Update documentation for API changes
- Ensure all tests pass before submitting PR

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Google Gemini AI for advanced language processing
- FastAPI team for the excellent web framework
- React community for the robust frontend ecosystem
- Render and Vercel for reliable deployment platforms

---

**Project Status**: ✅ Production Ready

For questions, issues, or contributions, please reach out or create an issue in the repository.
