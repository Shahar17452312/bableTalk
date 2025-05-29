bableTalk
bableTalk is a real-time multilingual chat application built with React, Node.js, Express, Socket.io, JWT, and MongoDB. It allows users to chat in their own language while messages are automatically translated for the recipient. This makes it easy for people from different countries to communicate seamlessly.

Features
Real-time messaging using Socket.io

Automatic translation between users using an external translation API

User authentication with JSON Web Tokens (JWT)

MongoDB used for storing users and messages

Modern frontend built with React and Vite

Clean and responsive user interface

Technologies Used
Frontend: React, Vite, Axios, CSS
Backend: Node.js, Express.js, Socket.io, JWT, MongoDB (via Mongoose)
Translation API: Google Translate API, LibreTranslate, or similar

Getting Started
To run the project locally, follow these steps:

Clone the repository from GitHub

Go to the server folder and create a .env file with the following environment variables:

MONGO_URI: your MongoDB connection string

JWT_SECRET: a secret key for token encryption

PORT: the port where the server will run (optional)

Install dependencies in both the server and client folders using npm

Start the backend server (from the server folder)

Start the frontend React app (from the client folder)

Open your browser and go to http://localhost:5173 or the port where Vite is running

Folder Structure
The project is divided into two main parts:

client: contains the React frontend

server: contains the Node.js backend with Express and Socket.io
Inside the server you’ll find routes, controllers, models, middleware, and socket logic

Future Improvements
Add private messaging and group chat

Add online/offline indicators for users

Save translation preferences per user

Add support for voice messages and text-to-speech

Add deployment to services like Vercel (frontend) and Render or Railway (backend)


Let me know if you'd like a short summary for your LinkedIn post or a Hebrew version as well!
