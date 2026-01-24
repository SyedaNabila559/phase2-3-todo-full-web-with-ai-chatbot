<!--
Sync Impact Report:
Version change: 2.0.0 → 3.0.0
Modified principles: Phase II principles enhanced with AI-first focus, Cohere integration, MCP tools
Added sections: Chatbot Functionality & Natural Language Handling, Database Extensions, MCP Tools Specification, Cohere API Adaptation
Removed sections: None
Templates requiring updates: ✅ .specify/templates/spec-template.md (no changes needed)
                          ✅ .specify/templates/plan-template.md (Constitution Check remains valid)
                          ✅ .specify/templates/tasks-template.md (no changes needed)
Follow-up TODOs: None
-->

# Full-Stack Web Application for The Evolution of Todo - Phase III Constitution

## Project Overview

This constitution governs Phase III of "The Evolution of Todo" - the integration of an intelligent AI chatbot powered by Cohere API and Model Context Protocol (MCP). Building on the completed Phase II full-stack foundation (Next.js frontend, FastAPI backend, Neon PostgreSQL, Better Auth), Phase III introduces natural language task management through a conversational interface.

The chatbot enables users to manage tasks using natural language commands (e.g., "Add weekly meeting", "List pending tasks", "Complete task #3") without navigating UI forms. The system adapts OpenAI-style agent behavior to Cohere's API, exposing 5 MCP tools for task CRUD operations while maintaining strict multi-user security and stateless operation.

## Core Requirements

- Conversational interface supporting all 5 core features: Add, Delete, Update, View, Mark Complete
- Single stateless endpoint: `/api/{user_id}/chat`
- Multi-turn conversations with tool invocation support
- User email extraction and identity queries (e.g., "Who am I?" → "Logged in as example@email.com")
- Graceful error handling with user-friendly messages
- Action confirmations (e.g., "Task added successfully")
- Conversation persistence per user in PostgreSQL

## Chatbot Functionality & Natural Language Handling

### Message Flow

1. User sends natural language message
2. Backend extracts JWT, validates user identity
3. System loads conversation history from database
4. Full message history sent to Cohere API with tool definitions
5. Cohere reasons and returns tool invocation or direct response
6. If tool call: execute via MCP, return result to Cohere
7. Final response sent to user
8. Both user and assistant messages persisted to DB

### Tool Mapping Examples

| User Query | MCP Tool Invoked |
|------------|------------------|
| "Add weekly meeting for Friday" | `add_task(title="weekly meeting", description="Friday", status="pending")` |
| "List all pending tasks" | `list_tasks(status="pending")` |
| "Mark task #5 as complete" | `complete_task(task_id=5)` |
| "Delete task #2" | `delete_task(task_id=2)` |
| "Update task #3 - make it high priority" | `update_task(task_id=3, priority="high")` |
| "Who am I?" | Query user info from JWT → "Logged in as user@example.com" |

### Confirmations and Errors

- Successful operations: "Task [title] added successfully", "Task #3 marked complete"
- Error handling: "Unable to add task - please try again", "Task not found"
- Clarification requests: "Which task would you like to update? Please specify the task ID"
- Chain operations: "Adding weekly meeting and listing pending tasks..."

## Authentication & Security

JWT authentication extends to chatbot with strict user isolation:

- `user_id` extracted from JWT via `BETTER_AUTH_SECRET`
- All MCP tool calls enforce `user_id` filtering on queries
- Conversations table includes `user_id` foreign key
- Users can only access their own tasks and conversations
- `COHERE_API_KEY` used exclusively for AI calls (ZCpzCoO6NkF4Ed9TYZjbYKH3Stom3P1d1yNSdgCt)
- No server-side state - all data persisted in Neon PostgreSQL

## Non-Functional Requirements

- **Clean Code**: TypeScript/Python standards, full type coverage
- **Async Operations**: All database and API calls non-blocking
- **Scalability**: Stateless endpoint enables horizontal scaling
- **Graceful Errors**: User-friendly messages, no stack traces exposed
- **Performance**: API response times under 1 second for simple queries
- **Security**: Input validation, SQL injection prevention, JWT verification

## Technology Stack and Tools

### Extended Stack

**Frontend** (unchanged):
- Next.js 16+ (App Router)
- TypeScript
- Tailwind CSS
- Better Auth (JWT plugin)

**Backend** (enhanced):
- Python 3.11+
- FastAPI
- SQLModel
- Neon PostgreSQL
- PyJWT

**AI & Tools (NEW)**:
- Cohere API (chat/completions with tool support)
- Official MCP SDK (tools exposure)

**Infrastructure** (unchanged):
- Claude Code
- Spec-Kit Plus
- Docker Compose
- Git

## Development Workflow

1. Create chatbot specifications in `specs/chatbot/`
2. Design MCP tool contracts and database models
3. Generate implementation plan using `/sp.plan`
4. Execute via agent tasks using `/sp.implement`
5. Integrate Cohere API for natural language understanding
6. Test end-to-end conversation flows
7. Validate tool chaining (e.g., "Add task and list tasks")

All development performed via Claude Code agents - no manual coding.

## Monorepo Updates

```
backend/
├── app/
│   ├── api/
│   │   └── routes/
│   │       └── chat.py          # NEW: /api/{user_id}/chat endpoint
│   ├── services/
│   │   └── chatbot.py           # NEW: Chatbot service with Cohere integration
│   └── mcp/
│       └── tools/               # NEW: MCP tool implementations
├── models/
│   ├── conversation.py          # NEW: Conversation SQLModel
│   └── message.py               # NEW: Message SQLModel
└── tests/

frontend/
└── components/
    └── chatbot/                 # OPTIONAL: ChatKit integration
```

## Database Extensions

### Conversation Model

```python
class Conversation(SQLModel, table=True):
    id: str = Field(primary_key=True)
    user_id: str = Field(foreign_key="users.id", ondelete="CASCADE")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
```

### Message Model

```python
class Message(SQLModel, table=True):
    id: str = Field(primary_key=True)
    conversation_id: str = Field(foreign_key="conversations.id", ondelete="CASCADE")
    role: str = "user" | "assistant" | "system"
    content: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
```

## MCP Tools Specification

Five tools exposed via Official MCP SDK:

| Tool | Parameters | Returns | Description |
|------|------------|---------|-------------|
| `add_task` | `title: str`, `description: str = ""`, `status: str = "pending"` | Task object | Create new task |
| `list_tasks` | `status: str = "all"`, `limit: int = 50` | Task array | Retrieve user's tasks |
| `complete_task` | `task_id: int` | Success boolean | Mark task complete |
| `delete_task` | `task_id: int` | Success boolean | Delete a task |
| `update_task` | `task_id: int`, `title: str = None`, `description: str = None`, `status: str = None` | Updated task | Modify task |

All tools enforce `user_id` isolation via async database queries.

## Cohere API Adaptation

Since Cohere does not have native tool calling like OpenAI:

1. **System Prompt**: Configure Cohere with detailed system prompt explaining available tools, their parameters, and expected JSON output format
2. **Tool Definitions**: Include structured tool descriptions in conversation context
3. **Reasoning Output**: Prompt Cohere to reason step-by-step and output tool calls as JSON
4. **Response Parsing**: Backend parses Cohere response for JSON tool calls
5. **Execution**: Execute tool, return result to Cohere for next reasoning step
6. **Final Response**: Cohere generates natural language response with tool results

Example system prompt: "You are a task management assistant. You have access to tools to add, list, complete, delete, and update tasks. When user asks to perform an action, reason step-by-step and output tool calls as JSON: {\"tool\": \"tool_name\", \"params\": {...}}"

## Guiding Principles

- **AI-First Design**: Every feature designed for natural language interaction
- **Stateless Operation**: No server memory - all state in PostgreSQL
- **Strict Security**: JWT validation, user isolation on every operation
- **Agentic Development**: All code via Claude Code agents - no manual coding
- **Hackathon Transparency**: Full PHR documentation for judging
- **Cohere Excellence**: Optimal prompt engineering for reliable tool calling
- **Graceful Degradation**: Fallback responses when AI or tools fail

## Deliverables and Success Criteria

- Working chatbot accessible via `/api/{user_id}/chat`
- All 5 task features callable via natural language
- Multi-user security verified with isolated conversations
- Clean, agent-generated code with documentation
- Demo: "Add weekly meeting" → task created → "List pending" → shows task
- ChatKit frontend integration (optional)
- Complete specifications in `specs/chatbot/` directory

## Governance

This constitution supersedes Phase II for all chatbot-related development. All amendments require documentation and PHR creation. Compliance verified through architecture reviews.

**Version**: 3.0 | **Ratified**: 2025-12-30 | **Last Amended**: 2026-01-06
