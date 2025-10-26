# **Just5 To-Do App**

A full-stack task management web application with **React + TypeScript frontend**, **Node.js + Express backend**, and **MySQL database**, all containerized using **Docker**. Users can create, complete, and delete tasks with a simple interface.  

## **Tech Stack**  

**Frontend:**  
- React + TypeScript  
- Tailwind CSS  
- Lucide Icons  

**Backend:**  
- Node.js + Express.js  
- MySQL   

**Tools / Environment:**  
- Docker – frontend, backend, and database  
- Postman – for API testing  


## **Features**  
- Add new tasks with title, description, and due date  
- Mark tasks as completed  
- Delete tasks  
- Dynamic and responsive UI  

## **1.Setup & Running with Docker**  

### **1. Clone the repository**  

git clone: https://github.com/hibarhm/Just5_To-do.git

## **2.Docker Setup**
Make sure Docker and Docker Compose are installed.

Create a docker-compose.yml with services for:
- frontend 
- backend  
- db 

Start the containers :
docker-compose up --build

## **4. Access the app**

Frontend: http://localhost:5173

Backend API: http://localhost:3000

## **5. .env for Backend**

DB_HOST=db

DB_USER=root

DB_PASSWORD=your_password

DB_NAME=todo_db

DB_PORT=3306

PORT=3000



