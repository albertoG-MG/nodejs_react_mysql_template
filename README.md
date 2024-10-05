This project provides a full-stack template for building web applications using the following technologies:

- React + TanStack + Tailwind CSS: A Powerful Frontend Stack for Dynamic and Customizable UI Design (PORT 3001)
- Node.js (backend) for handling API requests and server-side logic. (PORT 3000)
- MySQL for database management. (PORT 3306)
- NGINX as a reverse proxy to efficiently manage and serve your frontend and backend services. (PORT 8080)

Features:
- Pre-configured NGINX to act as an intermediary,traffic between the React frontend and Node.js backend.
- Tailored for scalability and performance, leveraging the flexibility of Docker containers.
- Quick setup for local development or production environments.
- Optimized Dockerfile structure, including multi-stage builds to minimize image size and improve deployment speed.
- Integrated TanStack Table for efficient and scalable data table management using SOLID principles.

How to use:
- Frontend: Build your React application with Tailwind CSS for styling (You can use npm run start or run docker image por development purposes).
- Backend: Use Node.js for your API and server logic (Same as front end, you can use npm run dev for development, it has supervisor installed).
- Database: Connect to the MySQL database for data storage and management (You can download an image from docker hub or install a server provider like wamp or xampp).

This setup uses the official NGINX image to serve static files from the React frontend and route API calls to the Node.js backend. The NGINX instance is configured to:

- Serve static files from React: It efficiently delivers the built React application, ensuring fast load times for users.
- Proxy API requests to the Node.js backend: All API calls made from the React application are forwarded to the Node.js service, enabling seamless communication between the frontend and backend.

(I have also included and official nginx folder that contains a nginx.exe in case docker doesn't work in your computer)

Structure of the project

```/Your_proyect

├── /backend                
├── /frontend             
├── /nginx 
├── .env                    
└── docker-compose.yml      
```

NGINX default.conf

```nginx
upstream frontend {
  server frontend:3001;
}

upstream backend {
  server backend:3000;
}

server {
  listen 8080;

  location / {
    proxy_pass http://frontend;
  }

  location /ws {
    proxy_pass http://frontend;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection "Upgrade";
  }

  location /api {
    rewrite /api/(.*) /$1 break;
    proxy_pass http://backend;
  }
}
```

.ENV

```
DB_HOST=
DB_USER=
DB_PASSWORD=
DB_NAME=
PORT=

MYSQL_ROOT_PASSWORD=
MYSQL_DATABASE= 
MYSQL_USER=
MYSQL_PASSWORD=

JWT_SECRET=
```

Docker-compose

```
services:
  db:
    image: mysql:5.7
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: "12345678"
      MYSQL_DATABASE: ${MYSQL_DATABASE}
      MYSQL_USER: ${MYSQL_USER}
      MYSQL_PASSWORD: ${MYSQL_PASSWORD}
    ports:
      - "3306:3306"
    volumes:
      - db_data:/var/lib/mysql
  phpmyadmin:
    image: phpmyadmin/phpmyadmin
    restart: always
    depends_on:
      - db
    ports:
      - "3500:80"
    environment:
      PMA_HOST: db
      PMA_PORT: 3306
  nginx:
    depends_on:
      - frontend
      - backend
    restart: always
    build:
      dockerfile: Dockerfile.dev
      context: ./nginx
    ports:
      - '8080:8080'
  backend:
    build: 
       dockerfile: Dockerfile.dev
       context: ./backend
    image: <My tag>
    volumes:
      - /home/node/app/node_modules
      - ./backend:/home/node/app
    environment:
      DB_HOST: ${DB_HOST}
      DB_USER: ${DB_USER}
      DB_PASSWORD: ${DB_PASSWORD}
      DB_NAME: ${DB_NAME}
      JWT_SECRET: ${JWT_SECRET}
    ports:
      - "3000:3000"
  testbackend:
    stdin_open: true
    build:
      dockerfile: Dockerfile.dev
      context: ./backend
    volumes:
      - /home/node/app/node_modules
      - ./backend:/home/node/app
    command: ["npm", "run", "test"]
  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile.dev
    image: <My tag>
    volumes:
      - /home/node/app/node_modules
      - ./frontend:/home/node/app
    ports:
      - "3001:3001"
  testfrontend:
    stdin_open: true
    build:
      dockerfile: Dockerfile.dev
      context: ./frontend
    volumes:
      - /home/node/app/node_modules
      - ./frontend:/home/node/app
    command: ["npm", "run", "test"]

volumes:
  db_data:

```
