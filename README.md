# Point of Sale and Billing System

A comprehensive point of sale and billing system built with React and Node.js, designed to manage both physical and online store operations.

## Features

### Employee Mode (Point of Sale)
- Sales Registration
- Customer Management
- Document Generation (Tickets and Invoices)
- Automatic Tax and Total Calculations

### Customer Mode (Online Store)
- User Registration and Profile Management
- Shopping Cart
- Order History
- Invoice Generation and Download

### Admin Mode
- Inventory Management
- Sales History
- Financial Reports
- User Management

## Technology Stack

### Frontend
- React
- Redux for state management
- React Router for navigation
- Material-UI for components
- Axios for API requests

### Backend
- Node.js
- Express.js
- MongoDB
- JWT for authentication
- PDFKit for document generation

## Project Structure

```
project/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── redux/
│   │   ├── services/
│   │   └── utils/
│   └── public/
└── backend/
    ├── src/
    │   ├── controllers/
    │   ├── models/
    │   ├── routes/
    │   ├── middleware/
    │   └── utils/
    └── config/
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a .env file with the following variables:
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   ```

4. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a .env file with the following variables:
   ```
   REACT_APP_API_URL=http://localhost:5000
   ```

4. Start the development server:
   ```bash
   npm start
   ```

## API Documentation

### Authentication Endpoints
- POST /api/auth/register - Register new user
- POST /api/auth/login - User login
- GET /api/auth/profile - Get user profile

### Product Endpoints
- GET /api/products - List all products
- POST /api/products - Create new product
- PUT /api/products/:id - Update product
- DELETE /api/products/:id - Delete product

### Order Endpoints
- POST /api/orders - Create new order
- GET /api/orders - List all orders
- GET /api/orders/:id - Get order details
- PUT /api/orders/:id - Update order status

### Customer Endpoints
- POST /api/customers - Create new customer
- GET /api/customers - List all customers
- GET /api/customers/:id - Get customer details
- PUT /api/customers/:id - Update customer information

## Development Guidelines

### Code Style
- Use ES6+ features
- Follow component-based architecture
- Implement proper error handling
- Use async/await for asynchronous operations

### Security
- Input validation on both frontend and backend
- JWT for authentication
- Role-based access control
- Data encryption for sensitive information

### Testing
- Write unit tests for components
- Integration tests for API endpoints
- End-to-end testing for critical flows

### Version Control
- Use feature branches
- Write meaningful commit messages
- Review code before merging

## Production Deployment

### Backend
1. Set up environment variables for production
2. Configure MongoDB production database
3. Set up proper logging
4. Enable SSL/TLS
5. Configure CORS properly

### Frontend
1. Build the production bundle:
   ```bash
   npm run build
   ```
2. Deploy static files to a CDN or web server

## License

MIT License