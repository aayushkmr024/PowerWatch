# PowerWatch ⚡

PowerWatch is a full-stack industrial electrical equipment monitoring and maintenance system.

It provides a web dashboard to monitor equipment parameters, identify abnormal operating conditions using configurable threshold rules, track maintenance information, and visualize equipment data.

## 🚀 Live Project

[Open PowerWatch](https://power-watch-phi.vercel.app)

## 🛠️ Tech Stack

### Frontend
- React.js
- JavaScript
- HTML5
- CSS3
- Vite
- Chart.js

### Backend
- Node.js
- Express.js
- REST API

### Database
- MongoDB
- Mongoose
- MongoDB Atlas

### Tools & Deployment
- VS Code
- Postman
- Git & GitHub
- Vercel
- Render

## ⚙️ Features

- Equipment monitoring dashboard
- Transformer, Motor and Generator monitoring
- Temperature and load monitoring
- Normal / Warning / Critical status detection
- Equipment search
- Add equipment
- Update equipment
- Delete equipment
- Maintenance tracking
- Dashboard statistics
- Data visualization using charts
- RESTful API
- MongoDB data persistence

## 🏗️ System Architecture

User
↓
React Frontend
↓
REST API
↓
Node.js + Express
↓
Mongoose
↓
MongoDB Atlas
↓
JSON Response
↓
React Dashboard

## 📊 Equipment Parameters

The prototype currently monitors parameters such as:

- Temperature
- Load
- Equipment type
- Equipment status
- Maintenance information

## 🔍 Condition Monitoring

The prototype uses configurable temperature thresholds:

- Below 75°C → Normal
- 75–85°C → Warning
- Above 85°C → Critical

These values are prototype thresholds and are not intended to represent universal electrical safety limits.

## 🧪 API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/equipment` | Get all equipment |
| POST | `/api/equipment` | Add equipment |
| PUT | `/api/equipment/:id` | Update equipment |
| DELETE | `/api/equipment/:id` | Delete equipment |

## 📁 Project Structure

```text
PowerWatch/
│
├── Backend/
│   ├── models/
│   │   └── Equipment.js
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── frontend-react/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
└── README.md
