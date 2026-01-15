#!/bin/sh
set -e

# Backend folder me jao
cd backend

# Install dependencies
pip install -r requirements.txt

# Run FastAPI app
python -m uvicorn app.main:app --host 0.0.0.0 --port $PORT
