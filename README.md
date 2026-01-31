# 📦 Inventory Management System

A complete, full-stack Inventory Management System built with the MERN stack (MongoDB, Express.js, React.js, Node.js). Features modern UI/UX, role-based access control, real-time inventory tracking, and comprehensive reporting.

![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

### 🔐 Authentication & Authorization
- User registration and login with JWT
- Role-based access control (Admin & Staff)
- Protected routes and API endpoints
- Secure password hashing with bcrypt

### 📊 Dashboard
- Real-time inventory statistics
- Quick action buttons
- Visual indicators for stock levels
- Responsive design

### 🛍️ Product Management
- Add, edit, delete products
- Search and filter products
- Stock quantity tracking
- Low stock and out-of-stock alerts
- SKU management
- Category and supplier assignment

### 📁 Category Management
- Create and manage product categories
- Category-based organization
- Full CRUD operations (Admin only)

### 🚚 Supplier Management
- Supplier contact information
- Email and phone tracking
- Address management
- Full CRUD operations (Admin only)

### 📈 Inventory Tracking
- Complete inventory log history
- Stock addition and removal tracking
- User activity logging
- Date range filtering
- Reason tracking for stock changes

### 📊 Reports & Analytics
- Daily, weekly, and monthly reports
- Stock movement summaries
- Category-wise distribution charts
- Inventory value analysis
- Low stock alerts
- Visual charts (Bar charts, Pie charts)

### 🎨 UI/UX Features
- Modern, professional dashboard design
- Dark mode support
- Fully responsive (mobile, tablet, desktop)
- Smooth animations and transitions
- Toast notifications
- Loading states
- Error handling

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - Chart library
- **React Icons** - Icon library
- **React Hot Toast** - Toast notifications
- **Vite** - Build tool

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

## 📁 Project Structure

```
Inventory Management System/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── contexts/      # React Context providers
│   │   ├── pages/         # Page components
│   │   ├── services/      # API service functions
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   ├── package.json
│   └── vite.config.js
│
├── server/                 # Backend Express application
│   ├── src/
│   │   ├── config/        # Configuration files
│   │   ├── controllers/   # Route controllers
│   │   ├── middleware/    # Custom middleware
│   │   ├── models/        # Mongoose models
│   │   ├── routes/        # API routes
│   │   ├── utils/         # Utility functions
│   │   └── server.js      # Server entry point
│   ├── package.json
│   └── .env.example
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16 or higher)
- **MongoDB** (local installation or MongoDB Atlas account)
- **npm** or **yarn**

### Installation

#### 1. Clone the repository

```bash
git clone <your-repo-url>
cd "Inventory Management System"
```

#### 2. Backend Setup

```bash
# Navigate to server directory
cd server

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env file with your configuration
# MONGODB_URI=mongodb://localhost:27017/inventory_db
# JWT_SECRET=your_super_secret_jwt_key
# PORT=5000
# NODE_ENV=development
```

#### 3. Frontend Setup

```bash
# Navigate to client directory (from root)
cd client

# Install dependencies
npm install
```

#### 4. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# If using local MongoDB
mongod

# Or use MongoDB Atlas (cloud) - update MONGODB_URI in .env
```

#### 5. Run the Application

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
# Server runs on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
# Frontend runs on http://localhost:3000
```

### 🌐 Access the Application

Open your browser and navigate to:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (Protected)

### Products
- `GET /api/products` - Get all products (with search, filter, pagination)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)
- `PUT /api/products/:id/stock` - Update stock (Admin only)

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get single category
- `POST /api/categories` - Create category (Admin only)
- `PUT /api/categories/:id` - Update category (Admin only)
- `DELETE /api/categories/:id` - Delete category (Admin only)

### Suppliers
- `GET /api/suppliers` - Get all suppliers
- `GET /api/suppliers/:id` - Get single supplier
- `POST /api/suppliers` - Create supplier (Admin only)
- `PUT /api/suppliers/:id` - Update supplier (Admin only)
- `DELETE /api/suppliers/:id` - Delete supplier (Admin only)

### Inventory
- `GET /api/inventory/logs` - Get inventory logs (with filters)
- `GET /api/inventory/report` - Get inventory report (Admin only)

## 👤 Default Users

After setting up, you can register users through the registration page. The first user should be registered as an **Admin** to access all features.

**Note**: In production, you may want to create a default admin user via a seed script.

## 🎨 UI Components

### Reusable Components
- **Sidebar** - Navigation sidebar with menu items
- **Header** - Top header with theme toggle
- **StatCard** - Statistics display card
- **Table** - Reusable data table component
- **Modal** - Modal dialog component
- **ProtectedRoute** - Route protection wrapper

### Pages
- **Dashboard** - Main dashboard with stats
- **Products** - Product management page
- **Categories** - Category management page
- **Suppliers** - Supplier management page
- **Inventory** - Inventory logs page
- **Reports** - Analytics and reports page (Admin only)

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Protected API routes
- Role-based access control
- Input validation
- CORS configuration
- Environment variables for sensitive data

## 📱 Responsive Design

The application is fully responsive and works on:
- 📱 Mobile devices (320px+)
- 📱 Tablets (768px+)
- 💻 Desktop (1024px+)
- 🖥️ Large screens (1280px+)

## 🌙 Dark Mode

The application includes a built-in dark mode toggle. The preference is saved in localStorage and persists across sessions.

## 🐛 Common Issues & Solutions

### MongoDB Connection Error
- **Issue**: Cannot connect to MongoDB
- **Solution**: 
  - Ensure MongoDB is running locally, or
  - Update `MONGODB_URI` in `.env` with your MongoDB Atlas connection string

### Port Already in Use
- **Issue**: Port 5000 or 3000 is already in use
- **Solution**: 
  - Change `PORT` in server `.env` file
  - Update `vite.config.js` proxy target if backend port changes

### CORS Errors
- **Issue**: CORS errors when making API requests
- **Solution**: 
  - Ensure backend CORS is configured correctly
  - Check that frontend proxy is set up in `vite.config.js`

### JWT Token Expired
- **Issue**: Getting 401 errors after some time
- **Solution**: 
  - Tokens expire after 30 days
  - Simply log in again to get a new token

## 🚀 Deployment

### Backend Deployment (Render/Heroku)

1. Create a new web service
2. Connect your repository
3. Set environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `NODE_ENV=production`
   - `PORT` (usually auto-set)
4. Deploy!

### Frontend Deployment (Vercel/Netlify)

1. Connect your repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Update API base URL in production
5. Deploy!

### MongoDB Atlas Setup

1. Create a free MongoDB Atlas account
2. Create a new cluster
3. Get connection string
4. Update `MONGODB_URI` in backend `.env`

## 📚 Learning Resources

This project is designed to be beginner-friendly. Key concepts demonstrated:

- **RESTful API Design** - Clean API structure
- **Authentication & Authorization** - JWT, role-based access
- **State Management** - React Context API
- **Form Handling** - Controlled components
- **Error Handling** - Try-catch, error boundaries
- **Responsive Design** - Mobile-first approach
- **Database Design** - MongoDB schema design
- **API Integration** - Axios, async/await

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Built with ❤️ for learning and portfolio purposes.

## 🎯 Future Enhancements

- [ ] Email notifications for low stock
- [ ] Barcode scanning
- [ ] Export reports to PDF/Excel
- [ ] Multi-warehouse support
- [ ] Advanced analytics dashboard
- [ ] Product image uploads
- [ ] Inventory forecasting
- [ ] User activity logs
- [ ] API rate limiting
- [ ] Unit and integration tests

## 📞 Support

If you encounter any issues or have questions, please open an issue on GitHub.

---

**Happy Coding! 🚀**
