# Task Manager Application

A full-stack task management application with React frontend and Laravel API backend.

## Overview

This Task Manager allows users to:
- Create tasks with title, image, and optional description
- View all tasks in a clean, intuitive interface
- Edit existing tasks
- Delete tasks
- Mark tasks as done/undone
- Filter tasks by status (done/pending)
- Sort tasks by creation date (newest/oldest)


[Watch a demo video here!]([https://www.youtube.com/watch?v=YOUR_YOUTUBE_VIDEO_ID](https://github.com/user-attachments/assets/51dd24f5-acd0-4cdc-bd97-0b76d2dce779 ))
## Tech Stack

### Frontend
- React.js
- React Hooks for state management
- Axios for API requests
- CSS/tailwind for styling
- Material UI

### Backend
- Laravel PHP framework
- MySQL database
- RESTful API architecture

## Features

### Frontend (React)
- **Task List Display**: Clean UI showing all tasks with status indicators
- **Task Creation**: Form to add new tasks with required title, image upload, and optional description
- **Task Editing**: Ability to modify existing task details
- **Task Deletion**: Remove tasks from the list
- **Status Toggle**: Mark tasks as complete or pending with a simple click
- **Filtering**: Filter tasks by completion status
- **Sorting**: Arrange tasks by creation date (newest or oldest first)

### Backend (Laravel)
- **RESTful API**: Complete CRUD operations for tasks
- **Input Validation**: Server-side validation ensuring all required fields are present
- **File Storage**: Image storage and retrieval
- **Error Handling**: Proper error responses with meaningful messages

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | http://localhost:8000/api/tasks | Get all tasks |
| POST | http://localhost:8000/api/tasks | Create a new task |
| PUT | http://localhost:8000/api/tasks/{id} | Update a task by ID |
| DELETE | http://localhost:8000/api/tasks/{id} | Delete a task by ID |

## API Request/Response Examples

### Get All Tasks
```
GET http://localhost:8000/api/tasks
```

Response:
```json
{
  "tasks": [
    {
      "id": 1,
      "title": "Complete project documentation",
      "description": "Write comprehensive README file",
      "image_url": "http://localhost:8000/storage/images/task1.jpg",
      "is_completed": false,
      "created_at": "2025-04-16T14:30:00Z",
      "updated_at": "2025-04-16T14:30:00Z"
    },
    {
      "id": 2,
      "title": "Setup development environment",
      "description": "Install all necessary dependencies",
      "image_url": "http://localhost:8000/storage/images/task2.jpg",
      "is_completed": true,
      "created_at": "2025-04-15T09:15:00Z",
      "updated_at": "2025-04-16T10:20:00Z"
    }
  ]
}
```

### Create Task
```
POST http://localhost:8000/api/tasks
```

Request Body (form-data):
```
title: New Task Title
description: This is a description for the new task
image: [file upload]
```

Response:
```json
{
  "message": "Task created successfully",
  "task": {
    "id": 3,
    "title": "New Task Title",
    "description": "This is a description for the new task",
    "image_url": "http://localhost:8000/storage/images/task3.jpg",
    "is_completed": false,
    "created_at": "2025-04-17T08:45:00Z",
    "updated_at": "2025-04-17T08:45:00Z"
  }
}
```

### Update Task
```
PUT http://localhost:8000/api/tasks/3
```

Request Body (form-data):
```
title: Updated Task Title
description: Updated task description
image: [file upload] (optional)
is_completed: true
```

Response:
```json
{
  "message": "Task updated successfully",
  "task": {
    "id": 3,
    "title": "Updated Task Title",
    "description": "Updated task description",
    "image_url": "http://localhost:8000/storage/images/task3.jpg",
    "is_completed": true,
    "created_at": "2025-04-17T08:45:00Z",
    "updated_at": "2025-04-17T09:30:00Z"
  }
}
```

### Delete Task
```
DELETE http://localhost:8000/api/tasks/1
```

Response:
```json
{
  "message": "Task deleted successfully"
}
```

## Installation & Setup

### Prerequisites
- Node.js and npm
- PHP 8.0 or higher
- Composer
- MySQL or PostgreSQL

### Frontend Setup
1. Clone this repository
2. Navigate to the frontend directory:
   ```
   cd task-manager/frontend
   ```
3. Install dependencies:
   ```
   npm install
   ```
4. Create a `.env` file and set the API base URL:
   ```
   REACT_APP_API_URL=http://localhost:8000/api
   ```
5. Start the development server:
   ```
   npm start
   ```

### Backend Setup
1. Navigate to the backend directory:
   ```
   cd task-manager/backend
   ```
2. Install dependencies:
   ```
   composer install
   ```
3. Create a `.env` file by copying `.env.example`:
   ```
   cp .env.example .env
   ```
4. Configure database settings in the `.env` file
5. Generate application key:
   ```
   php artisan key:generate
   ```
6. Run migrations:
   ```
   php artisan migrate
   ```
7. Link storage for image uploads:
   ```
   php artisan storage:link
   ```
8. Start the development server:
   ```
   php artisan serve
   ```
