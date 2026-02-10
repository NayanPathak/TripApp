# Trip Itinerary App

Full-stack mobile app for managing travel itineraries with **Agent** and **User** roles. Agents create packages and assign them to users; users view assigned packages and day-wise itineraries.

## Tech Stack

- **Backend:** Node.js, Express, MongoDB Atlas, Mongoose, JWT, bcryptjs, Cloudinary (images)
- **Frontend:** React Native, Expo, React Navigation, Axios, AsyncStorage, Context API

## Project Structure

```
trip-itinerary-app/
├── backend/          # Node.js + Express + MongoDB
│   ├── config/       # DB & Cloudinary
│   ├── models/       # User, Package, PackageAssignment
│   ├── routes/       # auth, users, packages, assignments
│   ├── controllers/
│   ├── middleware/   # auth, upload
│   └── server.js
└── frontend/         # React Native + Expo
    └── src/
        ├── screens/  # Login, Agent screens, User screens
        ├── navigation/
        ├── context/  # AuthContext
        ├── services/ # API (Axios)
        └── styles/   # Theme (#0C7779 cards, black/white fonts)
```

## Setup

### Backend

1. **Install and env**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   ```
2. **Edit `.env`**
   - `MONGODB_URI` – MongoDB Atlas connection string
   - `JWT_SECRET` – any long random string
   - `CLOUDINARY_*` – Cloud name, API key, API secret (for image uploads)

3. **Optional: seed an agent**
   ```bash
   node scripts/seedAgent.js
   ```
   Creates `agent@example.com` / `agent123`.

4. **Run**
   ```bash
   npm run dev
   ```
   Server: `http://localhost:5000`.

### Frontend

1. **Install**
   ```bash
   cd frontend
   npm install
   ```

2. **API URL**
   - `src/services/api.js` uses `localhost:5000` (iOS) and `10.0.2.2:5000` (Android emulator). For a real device, replace with your machine’s IP, e.g. `http://192.168.1.x:5000/api`.

3. **Run**
   ```bash
   npx expo start
   ```
   Then press `i` for iOS or `a` for Android.

## Features

### Agent
- Login with email/password
- Create travel packages (title, cities, total days, day-wise itinerary: hotel, taxi, places, images)
- View and update packages
- Create user accounts (email + password set by agent)
- Assign packages to users

### User
- Login with credentials provided by agent
- View assigned packages
- Browse day-wise itinerary cards
- Day detail: hotel check-in, taxi pickup, places to visit, images (read-only)

## API Overview

- `POST /api/auth/login` – login
- `GET /api/auth/me` – current user (protected)
- `POST /api/users` – create user (agent)
- `GET /api/users` – list users (agent)
- `POST /api/packages` – create package (agent)
- `POST /api/packages/upload-images` – upload images (agent)
- `GET /api/packages` – list my packages (agent)
- `GET /api/packages/:id` – get package (agent)
- `PUT /api/packages/:id` – update package (agent)
- `POST /api/assignments` – assign package to user (agent)
- `GET /api/assignments/my-packages` – my assigned packages (user)

## Theme

- Cards and primary UI: **#0C7779**
- Text: black and white (white on teal, black on light)
