# 🚀 Quick Start Guide

Get your Inventory Management System up and running in 5 minutes!

## Step 1: Install Dependencies

### Backend
```bash
cd server
npm install
```

### Frontend
```bash
cd client
npm install
```

## Step 2: Configure Environment

### Backend (.env file)
Create `server/.env` file with:
```
MONGODB_URI=mongodb://localhost:27017/inventory_db
JWT_SECRET=your_super_secret_jwt_key_12345
PORT=5000
NODE_ENV=development
```

**For MongoDB Atlas (Cloud):**
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/inventory_db
```

## Step 3: Start MongoDB

**Option A: Local MongoDB**
```bash
# Make sure MongoDB is installed and running
mongod
```

**Option B: MongoDB Atlas (Recommended for beginners)**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster
4. Get your connection string
5. Update `MONGODB_URI` in `.env`

## Step 4: Run the Application

### Terminal 1 - Backend
```bash
cd server
npm run dev
```
✅ Backend running on http://localhost:5000

### Terminal 2 - Frontend
```bash
cd client
npm run dev
```
✅ Frontend running on http://localhost:3000

## Step 5: Create Your First Account

1. Open http://localhost:3000
2. Click "Sign up"
3. Register as **Admin** (select Admin role)
4. Login with your credentials

## 🎉 You're All Set!

Start managing your inventory:
- Add products
- Create categories
- Add suppliers
- Track inventory
- View reports

## 📝 Default Test Data

You can manually add:
- **Categories**: Electronics, Clothing, Food, etc.
- **Suppliers**: Add supplier information
- **Products**: Create products with categories and suppliers

## 🆘 Troubleshooting

**MongoDB Connection Error?**
- Check if MongoDB is running
- Verify `MONGODB_URI` in `.env`
- For Atlas: Check network access (allow all IPs for testing)

**Port Already in Use?**
- Change `PORT` in server `.env`
- Or kill the process using the port

**Module Not Found?**
- Run `npm install` in both `server` and `client` directories

---

**Need Help?** Check the main [README.md](./README.md) for detailed documentation.
