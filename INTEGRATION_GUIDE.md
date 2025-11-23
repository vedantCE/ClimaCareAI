# Healthify AI - Frontend-Backend Integration Guide

## 🚀 Quick Start

### Frontend Setup
1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm start
   ```
   Frontend will run on `http://localhost:3000`

### Backend Setup
1. Ensure your FastAPI backend is running on `http://localhost:8000`
2. Make sure CORS is properly configured (see `backend/cors_example.py`)

## 🔧 Configuration

### Environment Variables
- Create `.env` file in the root directory
- Set `VITE_BACKEND_URL=http://localhost:8000` (already configured)
- For production, update this to your production backend URL

### API Endpoint
- **URL**: `POST /chat`
- **Request**: `{ "user_input": "How to reduce stress?" }`
- **Response**: `{ "bot": "AI response here..." }`

## 🎯 Features Implemented

✅ **API Service** (`src/services/api.ts`)
- Centralized API communication
- Environment variable support
- Comprehensive error handling
- 30-second timeout configuration

✅ **Enhanced Chat UI**
- Real-time typing indicators
- Auto-scroll to new messages
- Clickable suggestion cards
- Toast notifications for errors

✅ **Error Handling**
- Network connection errors
- Server errors (500, 422)
- User-friendly error messages
- Fallback error handling

✅ **Environment Configuration**
- `.env` file for backend URL
- Production-ready configuration
- Secure environment variable handling

## 🧪 Testing the Integration

1. **Start Backend**: Ensure FastAPI server is running on port 8000
2. **Start Frontend**: Run `npm start`
3. **Test Message**: Type "How to reduce stress?" and press Send
4. **Verify Response**: Check that AI response appears in chat
5. **Test Error Handling**: Stop backend and try sending a message

## 🔒 Security Notes

- Environment variables are in `.env` (added to `.gitignore`)
- CORS is configured for development (`allow_origins=["*"]`)
- For production, restrict CORS to specific domains
- API timeout prevents hanging requests

## 📁 File Structure

```
src/
├── services/
│   └── api.ts              # API communication service
├── components/
│   ├── ChatWindow.tsx      # Enhanced with clickable suggestions
│   ├── ChatInput.tsx       # Send button with loading states
│   └── ...
├── types/
│   └── index.ts           # Updated API response types
└── App.tsx                # Main app with toast notifications
```

## 🚨 Troubleshooting

**Backend Connection Issues:**
- Verify backend is running on `http://localhost:8000`
- Check CORS configuration in FastAPI
- Ensure `/chat` endpoint exists and accepts POST requests

**Environment Variables:**
- Restart development server after changing `.env`
- Verify `VITE_BACKEND_URL` is properly set

**API Response Format:**
- Backend must return `{ "bot": "response" }` format
- Check network tab in browser dev tools for API calls