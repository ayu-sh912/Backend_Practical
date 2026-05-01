# Inventory Management REST API

A complete REST API for inventory management built with Express.js and MongoDB. Includes CRUD operations, filtering, search, and comprehensive validation.

## Features

✓ Complete CRUD operations for products
✓ Filter products by low stock
✓ Search products by name
✓ Input validation with async/await and error handling
✓ MongoDB integration with Mongoose
✓ Express.js REST API
✓ CORS enabled
✓ Comprehensive error handling

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## Installation

1. **Clone or navigate to the project directory**
   ```bash
   cd inventory-management-api
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create a `.env` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/inventory_management
   PORT=5000
   NODE_ENV=development
   ```

   For MongoDB Atlas, replace with:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/inventory_management
   ```

4. **Start the server**
   - Development (with nodemon):
     ```bash
     npm run dev
     ```
   - Production:
     ```bash
     npm start
     ```

   Server will run on `http://localhost:5000`

## Product Schema

```javascript
{
  productName: String (required, min 3 chars),
  quantity: Number (required, non-negative),
  price: Number (required, non-negative),
  supplier: String (required),
  inStock: Boolean (auto-calculated from quantity),
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

## API Endpoints

### 1. Add Product
- **POST** `/api/products`
- **Content-Type:** application/json
- **Request Body:**
  ```json
  {
    "productName": "Laptop",
    "quantity": 50,
    "price": 899.99,
    "supplier": "TechCorp"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Product added successfully",
    "data": {
      "_id": "6476...",
      "productName": "Laptop",
      "quantity": 50,
      "price": 899.99,
      "supplier": "TechCorp",
      "inStock": true,
      "createdAt": "2024-...",
      "updatedAt": "2024-..."
    }
  }
  ```

### 2. Get All Products
- **GET** `/api/products`
- **Response:**
  ```json
  {
    "success": true,
    "count": 5,
    "data": [...]
  }
  ```

### 3. Get Product by ID
- **GET** `/api/products/:id`
- **Example:** `/api/products/6476a1b2c3d4e5f6g7h8i9j0`
- **Response:**
  ```json
  {
    "success": true,
    "data": { ... }
  }
  ```

### 4. Update Product
- **PUT** `/api/products/:id`
- **Content-Type:** application/json
- **Request Body:** (all fields optional)
  ```json
  {
    "quantity": 45,
    "price": 899.99,
    "productName": "Laptop Pro",
    "supplier": "TechCorp Premium"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Product updated successfully",
    "data": { ... }
  }
  ```

### 5. Delete Product
- **DELETE** `/api/products/:id`
- **Response:**
  ```json
  {
    "success": true,
    "message": "Product deleted successfully",
    "data": { ... }
  }
  ```

### 6. Get Low Stock Products
- **GET** `/api/products/filter/lowstock?threshold=10`
- **Query Parameters:**
  - `threshold` (optional, default: 10) - Stock level threshold
- **Response:**
  ```json
  {
    "success": true,
    "threshold": 10,
    "count": 3,
    "data": [...]
  }
  ```

### 7. Get Out of Stock Products
- **GET** `/api/products/filter/outofstock`
- **Response:**
  ```json
  {
    "success": true,
    "count": 2,
    "data": [...]
  }
  ```

### 8. Search Products by Name
- **GET** `/api/products/search/:name`
- **Example:** `/api/products/search/laptop`
- **Response:**
  ```json
  {
    "success": true,
    "searchTerm": "laptop",
    "count": 2,
    "data": [...]
  }
  ```

### 9. Health Check
- **GET** `/api/health`
- **Response:**
  ```json
  {
    "success": true,
    "message": "Server is running",
    "timestamp": "2024-..."
  }
  ```

## Validation Rules

### Product Creation
- `productName` - Required, minimum 3 characters
- `quantity` - Required, must be non-negative number
- `price` - Required, must be positive number
- `supplier` - Required, string

### Product Update
- All fields are optional
- `quantity` - If provided, must be non-negative
- `price` - If provided, must be positive
- `productName` - If provided, minimum 3 characters

### Validation Error Response
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "quantity",
      "message": "Quantity cannot be negative"
    },
    {
      "field": "price",
      "message": "Price is required"
    }
  ]
}
```

## Error Handling

All endpoints include comprehensive error handling:

### Not Found Error (404)
```json
{
  "success": false,
  "message": "Product not found"
}
```

### Validation Error (400)
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [...]
}
```

### Server Error (500)
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error information"
}
```

## Testing with cURL

```bash
# Add Product
curl -X POST http://localhost:5000/api/products \
  -H "Content-Type: application/json" \
  -d '{"productName":"Mouse","quantity":100,"price":25.99,"supplier":"PeripheralCorp"}'

# Get All Products
curl http://localhost:5000/api/products

# Get Low Stock Products
curl "http://localhost:5000/api/products/filter/lowstock?threshold=20"

# Search Product
curl "http://localhost:5000/api/products/search/Mouse"

# Update Product
curl -X PUT http://localhost:5000/api/products/[PRODUCT_ID] \
  -H "Content-Type: application/json" \
  -d '{"quantity":80}'

# Delete Product
curl -X DELETE http://localhost:5000/api/products/[PRODUCT_ID]
```

## Project Structure

```
inventory-management-api/
├── config/
│   └── db.js                      # MongoDB connection
├── controllers/
│   └── productController.js       # Business logic
├── middleware/
│   └── validation.js              # Input validation
├── models/
│   └── Product.js                 # Mongoose schema
├── routes/
│   └── products.js                # API routes
├── app.js                         # Express app setup
├── server.js                      # Entry point
├── package.json                   # Dependencies
├── .env                           # Environment variables
└── README.md                      # This file
```

## Key Features Explained

### 1. Automatic inStock Status
The `inStock` field is automatically calculated based on quantity:
- Updated on product creation
- Updated on product update

### 2. Async/Await
All database operations use async/await for clean, readable code and proper error handling.

### 3. Validation
- Schema-level validation in Mongoose
- Route-level validation using express-validator
- Comprehensive error messages

### 4. Search & Filter
- Case-insensitive product name search
- Configurable low stock threshold
- Out of stock product filtering

### 5. Error Handling
- Try-catch blocks in all controllers
- Validation error middleware
- Global error handling middleware
- Meaningful error messages

## Dependencies

- **express**: Web framework
- **mongoose**: MongoDB ORM
- **dotenv**: Environment variable management
- **cors**: Cross-Origin Resource Sharing
- **express-validator**: Input validation
- **nodemon**: Development hot-reload (dev only)

## License

ISC

## Author

Inventory Management API

---

**Last Updated:** May 2026
