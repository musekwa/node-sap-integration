# SAP Business One Integration API

A robust Node.js REST API for integrating with SAP Business One Service Layer. This project provides a clean, well-structured interface to interact with SAP B1's OData services, handling authentication, session management, and common business operations.

## 🚀 Features

- **Complete SAP B1 Integration**: Full CRUD operations for Business Partners, Items, Orders, Invoices, and more
- **Automatic Session Management**: Handles SAP B1 login/logout with session timeout and renewal
- **RESTful API Design**: Clean, intuitive endpoints following REST conventions
- **Error Handling**: Comprehensive error handling with detailed error messages
- **Security**: Rate limiting, CORS, and security headers with Helmet
- **Pagination**: Built-in pagination support for large datasets
- **OData Query Support**: Advanced filtering, sorting, and field selection
- **Graceful Shutdown**: Proper cleanup of SAP sessions on server shutdown

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** (v8 or higher)
- **SAP Business One Service Layer** (v9.0 or higher)
- Access to SAP B1 database and Service Layer endpoint

## 🛠️ Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd node-sap-integration
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:

   ```env
   # SAP B1 Configuration
   SAP_BASE_URL=https://your-sap-server:50000/b1s/v1
   SAP_COMPANY_DB=your_company_database
   SAP_USER=your_username
   SAP_PASSWORD=your_password
   SAP_SESSION_TIMEOUT=30

   # Server Configuration
   PORT=3000
   NODE_ENV=development
   ```

4. **Start the application**

   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

## 📚 API Documentation

The API is available at `http://localhost:3000/api` (or your configured port).

### Base Endpoints

| Endpoint      | Method | Description                 |
| ------------- | ------ | --------------------------- |
| `/api/`       | GET    | API status and version info |
| `/api/health` | GET    | Health check endpoint       |

### Business Partners (Customers)

| Endpoint                   | Method | Description                                  |
| -------------------------- | ------ | -------------------------------------------- |
| `/api/customers`           | GET    | Get all customers with pagination and search |
| `/api/customers/:cardCode` | GET    | Get specific customer by CardCode            |
| `/api/customers`           | POST   | Create new customer                          |
| `/api/customers/:cardCode` | PATCH  | Update customer                              |
| `/api/customers/:cardCode` | DELETE | Delete customer                              |

**Query Parameters for GET /api/customers:**

- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 50)
- `search` (string): Search by customer name

### Items

| Endpoint               | Method | Description                               |
| ---------------------- | ------ | ----------------------------------------- |
| `/api/items`           | GET    | Get all items with pagination and filters |
| `/api/items/:itemCode` | GET    | Get specific item by ItemCode             |
| `/api/items`           | POST   | Create new item                           |
| `/api/items/:itemCode` | PATCH  | Update item                               |

**Query Parameters for GET /api/items:**

- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 50)
- `search` (string): Search by item name
- `inStock` (boolean): Filter items with stock > 0

### Sales Orders

| Endpoint                       | Method | Description                                |
| ------------------------------ | ------ | ------------------------------------------ |
| `/api/orders`                  | GET    | Get all orders with pagination and filters |
| `/api/orders/:docEntry`        | GET    | Get specific order by DocEntry             |
| `/api/orders`                  | POST   | Create new order                           |
| `/api/orders/:docEntry`        | PATCH  | Update order                               |
| `/api/orders/:docEntry/cancel` | POST   | Cancel order                               |

**Query Parameters for GET /api/orders:**

- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 50)
- `status` (string): Filter by order status
- `customer` (string): Filter by customer CardCode

## 💡 Usage Examples

### Creating a Customer

```bash
curl -X POST http://localhost:3000/api/customers \
  -H "Content-Type: application/json" \
  -d '{
    "cardCode": "CUST001",
    "cardName": "John Doe",
    "currency": "USD",
    "phone": "+1234567890",
    "email": "john.doe@example.com"
  }'
```

### Getting Items with Filters

```bash
curl "http://localhost:3000/api/items?search=laptop&inStock=true&page=1&limit=10"
```

### Creating a Sales Order

```bash
curl -X POST http://localhost:3000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "cardCode": "CUST001",
    "docDate": "2024-01-15",
    "docDueDate": "2024-01-30",
    "comments": "Urgent order",
    "documentLines": [
      {
        "ItemCode": "ITEM001",
        "Quantity": 2,
        "Price": 100.00
      }
    ]
  }'
```

## 🏗️ Project Structure

```
node-sap-integration/
├── src/
│   ├── config/
│   │   └── sap.config.js          # SAP B1 configuration
│   ├── controllers/
│   │   ├── customer.controller.js  # Customer business logic
│   │   ├── item.controller.js     # Item business logic
│   │   └── order.controller.js    # Order business logic
│   ├── middleware/
│   │   ├── errorHandler.js        # Global error handling
│   │   └── validator.js           # Request validation
│   ├── routes/
│   │   ├── index.js              # Main router
│   │   ├── customer.routes.js    # Customer routes
│   │   ├── item.routes.js        # Item routes
│   │   └── order.routes.js       # Order routes
│   ├── services/
│   │   └── sapB1.service.js      # SAP B1 service layer
│   ├── utils/
│   │   └── logger.js             # Logging utilities
│   └── app.js                    # Express app configuration
├── server.js                     # Application entry point
├── package.json                  # Dependencies and scripts
├── .env.example                  # Environment variables template
└── README.md                     # This file
```

## 🔧 Configuration

### Environment Variables

| Variable              | Description                | Required | Default     |
| --------------------- | -------------------------- | -------- | ----------- |
| `SAP_BASE_URL`        | SAP B1 Service Layer URL   | Yes      | -           |
| `SAP_COMPANY_DB`      | SAP B1 Company Database    | Yes      | -           |
| `SAP_USER`            | SAP B1 Username            | Yes      | -           |
| `SAP_PASSWORD`        | SAP B1 Password            | Yes      | -           |
| `SAP_SESSION_TIMEOUT` | Session timeout in minutes | No       | 30          |
| `PORT`                | Server port                | No       | 3000        |
| `NODE_ENV`            | Environment mode           | No       | development |

### SAP B1 Service Layer Setup

1. Ensure SAP B1 Service Layer is running and accessible
2. Verify the Service Layer URL format: `https://server:port/b1s/v1`
3. Ensure your user has appropriate permissions for the required operations
4. For production, configure SSL certificates properly

## 🚦 Error Handling

The API provides comprehensive error handling with detailed error messages:

```json
{
  "success": false,
  "error": {
    "status": 400,
    "message": "Invalid request data",
    "code": "VALIDATION_ERROR"
  }
}
```

### Common Error Codes

- `NETWORK_ERROR`: Cannot connect to SAP B1 server
- `AUTHENTICATION_ERROR`: Invalid credentials or session expired
- `VALIDATION_ERROR`: Invalid request data
- `NOT_FOUND`: Resource not found
- `INTERNAL_SERVER_ERROR`: Unexpected server error

## 🔒 Security Features

- **Rate Limiting**: 100 requests per 15 minutes per IP
- **CORS**: Configurable cross-origin resource sharing
- **Helmet**: Security headers protection
- **Input Validation**: Request data validation
- **Session Management**: Secure SAP B1 session handling

## 🧪 Testing

```bash
# Test API health
curl http://localhost:3000/api/health

# Test with authentication
curl -H "Authorization: Bearer your-token" http://localhost:3000/api/customers
```

## 🚀 Deployment

### Production Considerations

1. **Environment Variables**: Set all required environment variables
2. **SSL Configuration**: Configure proper SSL certificates
3. **Database Connection**: Ensure stable SAP B1 connection
4. **Monitoring**: Implement logging and monitoring
5. **Load Balancing**: Consider load balancing for high availability

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:

1. Check the [Issues](https://github.com/your-repo/issues) page
2. Create a new issue with detailed description
3. Include error logs and configuration details

## 🔄 Changelog

### Version 1.0.0

- Initial release
- Complete SAP B1 integration
- Business Partners, Items, and Orders management
- Session management and error handling
- RESTful API design

## 📖 Additional Resources

- [SAP Business One Service Layer Documentation](https://help.sap.com/viewer/8e71b41b9ea043c8bccee1a39d5b4848/9.3/en-US/4b2b1c5a6e394b4a9c8b8b8b8b8b8b8b.html)
- [OData Query Options](https://www.odata.org/getting-started/basic-tutorial/)
- [Express.js Documentation](https://expressjs.com/)
- [Axios Documentation](https://axios-http.com/)

---

**Happy Coding! 🎉**

If you find this project helpful, please give it a ⭐ star!
