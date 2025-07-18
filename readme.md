# ECommerce API Documentation

## 🔐 User Credentials

**Test accounts for API exploration:**

- **Admin User** (Full access privileges)
  - Email: admin@gmail.com
  - Password: admin123
- **Standard User** (Customer permissions)
  - Email: testuser1@gmail.com
  - Password: testuser1

## 🚀 Core Features

### 📦 Product Catalog

- **Product Operations**
  - List all products
  - Get active products
  - View product details
  - Search products by name
- **Admin-Exclusive Actions**
  - Create new products
  - Update product information
  - Archive/deactivate products
  - Reactivate products

### 👥 User Management

- **Authentication**
  - User registration
  - JWT-based authentication
  - Password updates
- **Profile Operations**
  - View user details
  - Admin privilege escalation (Admin-only)

### 🛒 Cart System

- **Cart Management**
  - View user's cart
  - Add/remove products
  - Modify quantities
  - Clear entire cart
- **Pricing Calculations**
  - Per-item subtotals
  - Total cart amount

### 📦 Order Processing

- **Order Operations**
  - Create orders (Customer checkout)
  - View personal order history
- **Admin Functions**
  - View all user orders
  - Order status management

## 🔒 Access Control

- Admin-restricted endpoints marked with (Admin)
- Role-based access control system
- JWT authentication for protected routes
