# Node Marketplace API

A clean portfolio REST API for marketplace inventory management built with Node.js, Express, MongoDB, and Mongoose.

## Features

- Create marketplace items
- List recent items with bounded result counts
- Retrieve an item by validated MongoDB ObjectId
- Search items by escaped literal name text
- Update only approved item fields with Mongoose validation enabled
- Health-check endpoint
- Environment-based database configuration
- Node unit test + GitHub Actions CI

## Tech Stack

**Node.js · Express · MongoDB · Mongoose · Helmet · express-rate-limit · CORS · Node Test Runner · GitHub Actions**

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
5. Optionally set `CORS_ORIGINS` to a comma-separated list of allowed frontend origins.
6. Run `npm start` or `npm run dev`.

## Security / Reliability

- Real environment files are ignored; no database credentials or API keys are committed.
- Helmet security headers are enabled.
- API traffic is rate-limited and JSON request bodies are capped at 64 KB.
- CORS defaults to local frontend origins instead of `*`.
- User search strings are length-capped and regex metacharacters are escaped before MongoDB regex queries.
- Item IDs are validated before database lookup.
- Schema text lengths, prices, and quantities are bounded/validated.
- Updates use an allowlist of fields and `runValidators: true`.
- Internal exception messages are logged rather than returned directly to clients.

This repository intentionally remains a small portfolio API and does **not** implement authentication/authorization. Do not expose write endpoints publicly without adding an auth layer and deployment-level controls.

## Tests

```bash
npm install
npm test
```

The current unit test verifies that regex metacharacters in marketplace searches are treated as literal text rather than executable regex patterns. GitHub Actions runs the test on pushes and pull requests.

## Academic Context

Originally developed as an academic marketplace backend exercise and maintained here as a standalone software engineering portfolio project.
