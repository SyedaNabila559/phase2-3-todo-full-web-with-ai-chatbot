
#!/bin/sh
python -m uvicorn app.main:app --host 0.0.0.0 --port $PORT

# Backend folder mein jana
cd backend

# Dependencies install karna
pip install -r requirements.txt


