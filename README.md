# Midnight Cravings - Full Stack Food App (Indian Edition)

A premium, nocturnal-themed food delivery application built with the MERN stack (MongoDB, Express, React, Node.js) and Redux for state management.

## Features

### Frontend (React + Redux + Tailwind)
- **Responsive UI**: Fully mobile-ready design using Tailwind CSS.
- **Premium Aesthetic**: Dark-themed UI with neon accents, custom typography, and high-quality Indian food photography.
- **Indian Localization**: Uses ₹ (Rupees) for pricing and features Indian cuisines (Biryani, North Indian, South Indian, Street Food).
- **Navigation Flow**:
  1. **Login**: Entry point with premium social login options.
  2. **Home/Landing**: Main dashboard with categories and trending items.
  3. **Category View**: Dynamic listing of restaurants/items filtered by choice (Figma Screenshot 3).
  4. **Product Detail**: In-depth item view with energy metrics and customizations (Figma Screenshot 1).
  5. **Checkout**: Full-featured cart review with delivery address and payment management (Figma Screenshot 2).

### Backend (Node.js + MongoDB)
- **RESTful API**: Structured endpoints for authentication and product management.
- **Data Modeling**: Mongoose schemas for Users and Products (Product schema updated for Indian currency).
- **Security**: Password hashing with Bcrypt and JWT-based authentication structure.
- **Database**: MongoDB integration for persistent storage of users and menu items.

## Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB (Local or Atlas)

### Installation

1. **Clone the repository**
2. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
3. **Setup Backend**
   ```bash
   cd backend
   npm install
   # Configure your .env file with MONGO_URI
   npm run start
   ```

## Project Structure

### Frontend
- `/src/views`: Main page components (Login, Landing, Category, ProductDetail, Checkout).
- `/src/store`: Redux store configuration and slices.
- `/src/components`: Reusable UI elements.
- `/public`: Static assets (generated Indian food images).

### Backend
- `/src/models`: MongoDB Data models (User, Product).
- `/src/routes`: API route definitions.
- `/src/controllers`: Request handling logic.
- `/src/config`: Database connection setup.
