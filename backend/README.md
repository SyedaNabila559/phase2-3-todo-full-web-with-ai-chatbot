# Todo Backend API with AI Chatbot Integration

## Overview
FastAPI backend for The Evolution of Todo - Phase II & III featuring an intelligent AI Todo Assistant powered by Cohere.

## AI Magic Highlights

This application features an intelligent AI Todo Assistant powered by Cohere's command-r-plus model. The chatbot enables users to manage their tasks using natural language through:

- **Natural Language Task Management**: Add, list, complete, update, and delete tasks using conversational commands
- **Identity Queries**: Ask "Who am I?" to retrieve your user information
- **Multi-Step Operations**: Chain multiple operations in a single message (e.g., "Add meeting and list all tasks")
- **Context-Aware Conversations**: Maintains conversation history and context across interactions
- **Secure Integration**: All AI operations enforce user isolation and JWT authentication

## Run Instructions
1. Install dependencies: `pip install -r requirements.txt`
2. Configure `.env` from `.env.example` (ensure COHERE_API_KEY is set)
3. Run uvicorn: `uvicorn app.main:app --reload`

## API Documentation
Once running, visit [http://localhost:8000/docs](http://localhost:8000/docs)

## AI Chatbot API
- `POST /api/{user_id}/chat` - Send a message to the AI assistant

The AI chatbot leverages a Model Context Protocol (MCP) architecture with specialized tools:
- `add_task` - Create new tasks
- `list_tasks` - Retrieve tasks with filtering
- `complete_task` - Mark tasks as complete
- `delete_task` - Remove tasks
- `update_task` - Modify task properties
- `get_current_user` - Retrieve user identity
