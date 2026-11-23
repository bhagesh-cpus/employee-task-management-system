
# Employee Task Management System

A full-stack web application for managing employees and tracking organizational tasks.

## Project Overview

The Employee Task Management System helps administrators manage employee records, assign tasks, update task information, and monitor task progress through a dashboard.

## Features

### Employee Management
- Add new employees
- View employee records
- Update employee information
- Delete employees
- Search employees

### Task Management
- Create tasks
- Assign tasks to employees
- Update task details
- Delete tasks
- Track task status
- Search tasks

### Dashboard
- Total employee count
- Total task count
- Pending tasks
- In-progress tasks
- Completed tasks

## Technology Stack

**Frontend**
- HTML5
- CSS3
- Bootstrap
- JavaScript

**Backend**
- Python
- FastAPI
- SQLAlchemy

**Database**
- PostgreSQL

**Tools**
- Visual Studio Code
- Git
- GitHub
- Postman

## Project Structure

```text
EmployeeTaskManager/
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── main.py
├── database.py
├── models.py
├── schemas.py
├── requirements.txt
├── .gitignore
└── README.md
```

## How to Run Locally

1. Clone the repository.
2. Create and activate a Python virtual environment.
3. Install dependencies using:

   `pip install -r requirements.txt`

4. Configure your PostgreSQL database and environment variables in a local `.env` file.
5. Start the FastAPI server:

   `uvicorn main:app --reload --port 8001`

6. Open the API documentation:

   `http://127.0.0.1:8001/docs`

7. Open `frontend/index.html` using VS Code Live Server.

## Future Improvements

- Cloud deployment
- User authentication and authorization
- Role-based access control
- Improved reporting and analytics

## Author

Bhagesh

B.Tech – Computer Science and Engineering

