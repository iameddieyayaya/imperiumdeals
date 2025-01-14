
# Imperium Deals
This is a full-stack application forged in the crucible of battle to aid commanders in their eternal quest for the most strategic acquisitions of Warhammer 40k relics and resources. The app scouts across the far reaches of the warp—including Amazon, Games Workshop, and other hobby strongholds—to compare prices. It empowers you to search for specific artifacts, review the chronicles of price fluctuations, and identify the most advantageous offers for bolstering your armies. Embrace the wisdom of the Omnissiah and claim victory in the economic skirmishes of the 41st millennium!

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [License](#license)

---

## Features

- Search for Warhammer 40k products by name.
- Fetch and display current prices from Amazon, Games Workshop, and other vendors.
- Maintain price history for tracking trends.
- Store product data in a PostgreSQL database.
- User-friendly UI built with Next.js for seamless navigation.
- Backend API using Express.js to handle search and data management.

---

## Tech Stack

**Frontend**  
- [Next.js](https://nextjs.org)  
- TypeScript  
- TailwindCSS  

**Backend**  
- [Express.js](https://expressjs.com)  
- Puppeteer (for web scraping)  

**Database**  
- PostgreSQL (running in Docker)  

**Other**  
- Docker (for database containerization)  
- Prisma (ORM for database interaction)  

---

## Project Structure

```plaintext
.
├── frontend/          # Next.js frontend
├── backend/           # Express.js backend
├── docker-compose.yml # Docker configuration for PostgreSQL
├── .env.example       # Example environment variables
├── README.md          # Project documentation
```

---

## Installation

### Prerequisites
- Node.js (v16 or later)
- Docker and Docker Compose
- NPM (preferred package manager)

### Steps
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/warhammer-price-tracker.git
   cd warhammer-price-tracker
   ```

2. **Set Up the Environment Variables**:
   Copy `.env.example` to `.env` and update the variables:
   ```bash
   cp .env.example .env
   ```

3. **Start the Database with Docker**:
   ```bash
   docker-compose up -d
   ```

4. **Install Dependencies**:
   Install frontend and backend dependencies:
   ```bash
   cd frontend
   npm install
   cd ../backend
   npm install
   ```

5. **Run Database Migrations**:
   (If using Prisma)
   ```bash
   cd backend
   npx prisma migrate dev
   ```

6. **Start the Development Servers**:
   - Frontend:
     ```bash
     cd frontend
     npm dev
     ```
   - Backend:
     ```bash
     cd backend
     npm dev
     ```

---

## Usage

1. Navigate to the frontend application (default: `http://localhost:3000`).
2. Search for a Warhammer 40k product (e.g., "Tyranids Warriors").
3. View prices from multiple vendors and compare deals.
4. Check the price history for trends.

---

## API Endpoints

### Search for Products
**GET** `/api/products?query=:query`  
Fetch product details and prices based on a search query.

### Save Product Data
**POST** `/api/products`  
Save product details to the database.

### Fetch Price History
**GET** `/api/products/:id/history`  
Retrieve the price history for a specific product.

---

## Environment Variables

Create a `.env` file in the root directory and configure the following variables:

### Frontend
```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:4000
```

### Backend
```env
PORT=4000
DATABASE_URL=postgresql://user:password@localhost:5432/warhammer
AMAZON_ASSOCIATE_ID=your-amazon-associate-id
```

### PostgreSQL (Docker)
```env
POSTGRES_USER=user
POSTGRES_PASSWORD=password
POSTGRES_DB=warhammer
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
```

---

## License

This project is licensed under the MIT License. See the LICENSE file for details.

---

Enjoy tracking the best Warhammer 40k deals! 🎲
