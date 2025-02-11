# To-Do Application

A simple and intuitive task management tool designed to help you organize, track, and complete your tasks efficiently. This application allows you to create task lists, add tasks, set due dates, mark tasks as completed, and delete tasks — all in a clean, user-friendly interface.

## Features

- **Create Task Lists**: Organize your tasks into different lists (e.g., "Work", "Personal", "Shopping").
- **Task Management**: Add, update, mark as complete, and delete tasks.
- **Due Dates**: Set deadlines for each task to stay on track.
- **Task Completion**: Easily mark tasks as completed.
- **Search and Filter**: Find tasks or filter them by due date, status, or list.
- **Persistent Storage**: All data is saved in a database, ensuring your tasks are preserved.
- **Responsive Design**: Optimized for both desktop and mobile devices.

## Technologies Used

- **Backend**: Spring Boot (Java)
- **Frontend**: React 
- **Database**: MySQL
- **Other Technologies**: Spring Data JPA

## Getting Started

### Prerequisites

Before you begin, make sure you have the following installed:

- Java 17 or higher
- MySQL or PostgreSQL (depending on your choice of database)
- Maven (for building the project)
- Node.js and npm (if using React for frontend)

### Installation

1. **Clone the repository**:

    ```bash
    git clone https://github.com/yourusername/todolist-app.git
    ```

2. **Navigate to the backend directory**:

    ```bash
    cd todolist-app/backend
    ```

3. **Install backend dependencies**:

    ```bash
    mvn clean install
    ```

4. **Set up your database**:
    - Create a database in MySQL and update the `application.properties` file with your database details.
    - Example for MySQL:
      ```properties
      spring.datasource.url=jdbc:mysql://localhost:3306/todolist
      spring.datasource.username=root
      spring.datasource.password=password
      ```

5. **Run the Spring Boot application**:

    ```bash
    mvn spring-boot:run
    ```

6. **If using React**:
    - Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
    - Install React dependencies:
    ```bash
    npm install
    ```
    - Run the React app:
    ```bash
    npm start
    ```
