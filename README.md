# To-Do Website ✅
This is a full-stack to-do application built using Next.js for the frontend, FastAPI for the backend, and Neon as the database. It utilizes Specify and Claude Native for design and native functionality.

Technologies Used 🛠️

Frontend: Next.js 🌐

Backend: Python FastAPI 🐍⚡

Database: Neon 🌩️

Design Tools: Specify 🎨, Claude Native 🤖

# Features 🌟
User authentication and session management 🔐

Add, edit, delete, and mark tasks as complete ✅

Responsive UI built with Next.js 📱💻

Fast API server for handling backend logic ⚙️

Real-time updates with a dynamic front-end 🔄

Data persistence using Neon DB 💾

# Prerequisites 📋
Before you begin, ensure you have the following installed:

Node.js (for Next.js) 🟩

Python 3.8+ (for FastAPI) 🐍

pip (for managing Python dependencies) 📦

Neon account (for the database) 💡

# Setup Instructions 🛠️
Clone the repository git clone https://github.com/yourusername/todo-website.git cd todo-website
# 2. Frontend Setup (Next.js) 🌐
Navigate to the frontend directory:

cd frontend

Install the required dependencies:

npm install

Start the development server:

npm run dev

This will start the Next.js server on http://localhost:3000 🌍.

# 3. Backend Setup (FastAPI) 🐍⚡
Navigate to the backend directory:

cd backend

Create and activate a virtual environment:

python -m venv venv source venv/bin/activate # For macOS/Linux venv\Scripts\activate # For Windows

Install the required Python dependencies:

pip install -r requirements.txt

# Set up the database (Neon) 🔑:
Create a Neon database and configure your database credentials (in .env file).

Run the FastAPI server:

uvicorn main:app --reload

This will start the FastAPI server on http://localhost:8000 🚀.

# 4. Configure the Database (Neon) 💾
Create a Neon DB instance and set up the schema for the to-do tasks. Refer to the schema.sql file in the backend directory to create the necessary tables.

# 5. Environment Variables 🌍
Make sure to configure your environment variables for both frontend and backend:

Frontend: Create a .env.local file in the frontend directory with any necessary API URLs or keys.

Backend: Create a .env file in the backend directory with the following variables:

DB_HOST=your_neon_db_host DB_USER=your_db_user DB_PASSWORD=your_db_password DB_NAME=your_db_name

# 6. Running Both Servers 🚦
Run the frontend server (Next.js) as described above.

Run the backend server (FastAPI) as described above.

You should now have the to-do website running locally! 🎉

# Contributing 🤝
If you'd like to contribute to this project, feel free to fork the repository, make changes, and create a pull request. Please follow the code style and write tests where necessary.

# Made with ❤️ by Syeda
