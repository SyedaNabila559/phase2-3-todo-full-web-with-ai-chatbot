
#!/bin/bash

# Backend folder mein jana
cd backend

# Dependencies install karna
pip install -r requirements.txt

# Uvicorn ke through FastAPI app start karna
uvicorn main:app --host 0.0.0.0 --port $PORT
