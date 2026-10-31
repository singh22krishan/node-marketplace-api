# Node Marketplace API

A clean portfolio REST API for marketplace inventory management built with Node.js, Express, MongoDB, and Mongoose.

## Features

- Create marketplace items
- List all items
- Retrieve an item by ID
- Search items by name
- Update item records
- Health-check endpoint
- Environment-based database configuration

## Tech Stack

- Node.js
- Express
- MongoDB
- Mongoose
- CORS
- dotenv

## API Endpoints

- `GET /health`
- `GET /api/items`
- `GET /api/items/search?searchString=`
- `GET /api/items/:itemId`
- `POST /api/items`
- `PUT /api/items/:itemId`

## Local Setup

1. Install Node.js 18 or newer.
2. Run `npm install`.
3. Copy `.env.example` to `.env`.
4. Set `MONGO_URI` to your own MongoDB connection string.
5. Run `npm start` or `npm run dev`.

## Security

Real environment files are ignored by Git. This portfolio repository contains no database credentials or API keys.

## Academic Context

Originally developed as an academic marketplace backend exercise and maintained here as a standalone software engineering portfolio project.
