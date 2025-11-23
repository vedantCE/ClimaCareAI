# Example CORS configuration for FastAPI backend
# Add this to your main.py file

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins like ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Your existing routes here...
@app.post("/chat")
async def chat_endpoint(request: dict):
    user_input = request.get("user_input", "")
    # Your LangChain + Gemini logic here
    bot_response = "Your AI response here"
    
    return {"bot": bot_response}