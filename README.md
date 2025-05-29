# bableTalk

**bableTalk** is a real-time multilingual chat application built with **React**, **Node.js**, **Express**, **Socket.io**, **JWT**, and **MongoDB**.  
It allows users to chat in their own language while messages are automatically translated for the recipient.  
This makes it easy for people from different countries to communicate seamlessly.

---

## ⭐ Features

- Real-time messaging using **Socket.io**  
- Automatic translation between users using an external translation API  
- User authentication with **JWT**  
- **MongoDB** used to store users and messages  
- Built with **React + Vite** for a fast and modern frontend  
- Clean and responsive user interface

---

## 🛠 Technologies Used

**Frontend:**  
React, Vite, Axios, CSS  

**Backend:**  
Node.js, Express.js, Socket.io, JWT, MongoDB (Mongoose)  

**Translation:**  
Google Translate API

---

## 🚀 Getting Started

To run the project locally:

1. Clone the repository from GitHub  
2. Go to the `server` folder and create a `.env` file with the following variables:  
   - `MONGO_URI`: your MongoDB connection string  
   - `TOKEN_SECRET_KEY`: your JWT access token secret key  
   - `REFRESH_TOKEN_SECRET_KEY`: your JWT refresh token secret key  
   - `TOKEN_EXPIRES_IN`: access token expiration time (e.g. "15m", "1h")  
   - `REFRESH_TOKEN_EXPIRES_IN`: refresh token expiration time (e.g. "7d")  
   - `TRANSLATION_API_KEY`: your API key for the translation service (example: "9E1tzWakcoSjfrORWD5LTU01xaNtDRLE")  
   - `NODE_ENV`: environment mode (e.g. "production")  
3. Install dependencies in both `client` and `server` folders using npm  
4. Start the backend server (from the `server` folder)  
5. Start the frontend app (from the `client` folder)  
6. Open your browser and go to **http://localhost:5173**

---

## 📁 Project Structure

- `client/` — React frontend (built with Vite)  
- `server/` — Node.js backend with Express, Socket.io, and JWT  
   - Includes routes, controllers, models, middleware, and socket logic

---

## 🔮 Future Improvements

- Add private messaging and group chats  
- Show online/offline status for users  
- Save translation preferences per user  
- Add voice messages and text-to-speech  
- Deploy using **Vercel** (frontend) and **Render** or **Railway** (backend)

---

If you want, I can also prepare a short summary for your LinkedIn profile or translate the README into Hebrew. Just let me know!
