#!/bin/sh
# Activate the virtual environment (if required)
# source .venv/bin/activate

# Start uvicorn server
uvicorn backend.main:app --host 0.0.0.0 --port $PORT
