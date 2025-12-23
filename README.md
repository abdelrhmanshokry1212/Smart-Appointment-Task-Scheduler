# Smart Appointment & Task Scheduler (SmartPlan)

A comprehensive, microservices-based application designed to help users manage their appointments, track tasks, and monitor personal productivity. This project features a modern, responsive React frontend and a robust backend architecture composed of specialized microservices.

## 🚀 Features

-   **Smart Dashboard**: Overview of tasks, upcoming appointments, and productivity score.
-   **Appointment Management**: Create, update, delete, and categorize appointments (Work, Personal, Health, Finance).
-   **Productivity Analytics**: Track your productivity score based on task completion.
-   **Real-time Notifications**: improved notification system for reminders and updates.
-   **User Profiles**: Manage personal details and upload profile photos.
-   **Secure Authentication**: User registration and login with session persistence.
-   **Dark Mode**: Fully supported light and dark themes for better accessibility.
-   **Microservices Architecture**: Scalable backend design.

## 🛠️ Technology Stack

### Frontend
-   **React.js**: Core UI framework.
-   **Tailwind CSS**: Utility-first styling for a modern, responsive design.
-   **Lucide React**: Beautiful, consistent iconography.
-   **Axios**: For API communication.

### Backend (Microservices)
-   **Node.js & Express**: Server-side runtime and framework.
-   **API Gateway**: Central entry point routing requests to appropriate services.
-   **MongoDB**: NoSQL database for data persistence.

### Services
1.  **User Service**: Handles authentication and user profile management.
2.  **Appointment Service**: Manages appointment creation, scheduling, and status updates.
3.  **Notification Service**: Handles system notifications.
4.  **Analytics Service**: Calculates productivity scores and statistics.
5.  **Storage Service**: Manages file uploads (e.g., profile photos).
6.  **Audit Service**: Logs system activities for security and debugging.
7.  **API Gateway**: Routes traffic and manages cross-service communication.

## 📂 Project Structure

```
Smart-Appointment-Task-Scheduler/
├── frontend/               # React Application
├── api-gateway/            # Main entry point for backend APIs
├── user-service/           # User management APIs
├── appointment-service/    # Appointment logic
├── notification-service/   # Notification logic
├── analytics-service/      # Productivity calculation
├── storage-service/        # File upload handling
├── audit-service/          # System logging
├── start-all.bat           # Windows script to start all services
└── README.md
```

## ⚡ Getting Started

### Prerequisites
-   **Node.js** (v14 or higher recommended)
-   **MongoDB** (Ensure MongoDB is running locally or provide connection string)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/abdelrhmanshokry1212/Smart-Appointment-Task-Scheduler.git
    cd Smart-Appointment-Task-Scheduler
    ```

2.  **Install dependencies for all services:**
    You will need to run `npm install` in the frontend directory and each service directory (`api-gateway`, `user-service`, etc.).

    *Example:*
    ```bash
    cd frontend
    npm install
    cd ../api-gateway
    npm install
    # Repeat for all service folders...
    ```

### Running the Application

For **Windows** users, a convenient batch script is provided to start all services and the frontend simultaneously.

1.  **Run the start script:**
    ```bash
    ./start-all.bat
    ```

    This will open separate terminal windows for the Gateway, each Microservice, and the Frontend.

2.  **Access the Application:**
    Open your browser and navigate to:
    `http://localhost:5173` (or the port shown in your React start output).

## 🔮 Future Improvements

-   Cloud storage integration (AWS S3) for profile pictures.
-   Calendar view implementation.
-   Email notifications.
-   Mobile application (React Native).

---

