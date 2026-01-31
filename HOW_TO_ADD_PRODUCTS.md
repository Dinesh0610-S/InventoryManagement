# 📦 How to Add Products - Step by Step Guide

## ✅ Prerequisites

Before adding products, you need:
1. **Admin Account** - Only admins can add products
2. **At least one Category** - Products must belong to a category
3. **At least one Supplier** - Products must have a supplier

---

## 🚀 Step-by-Step Instructions

### Step 1: Create Categories (If you don't have any)

1. Go to **Categories** page from the sidebar
2. Click the **"Add Category"** button (top right)
3. Fill in the form:
   - **Category Name** (required) - e.g., "Electronics", "Clothing", "Food"
   - **Description** (optional) - Brief description of the category
4. Click **"Create"**
5. Repeat to create more categories as needed

**Example Categories:**
- Electronics
- Clothing
- Food & Beverages
- Books
- Home & Garden

---

### Step 2: Create Suppliers (If you don't have any)

1. Go to **Suppliers** page from the sidebar
2. Click the **"Add Supplier"** button (top right)
3. Fill in the form:
   - **Supplier Name** (required) - e.g., "ABC Electronics Inc."
   - **Contact Person** (optional) - Name of contact person
   - **Email** (optional) - Supplier email
   - **Phone** (optional) - Supplier phone number
   - **Address** (optional) - Supplier address
4. Click **"Create"**
5. Repeat to create more suppliers as needed

**Example Suppliers:**
- ABC Electronics Inc.
- XYZ Clothing Co.
- Fresh Foods Ltd.

---

### Step 3: Add Your First Product

1. **Navigate to Products Page**
   - Click **"Products"** in the sidebar
   - Or click **"Add Product"** from Dashboard Quick Actions

2. **Click "Add Product" Button**
   - Located at the top right of the Products page
   - Only visible if you're logged in as Admin

3. **Fill in the Product Form**

   **Required Fields (marked with *):**
   - **Product Name*** - e.g., "iPhone 15 Pro"
   - **Category*** - Select from dropdown (must have categories created)
   - **Supplier*** - Select from dropdown (must have suppliers created)

   **Optional Fields:**
   - **SKU** - Stock Keeping Unit (e.g., "IPH15PRO-128GB")
   - **Description** - Product description
   - **Quantity** - Initial stock quantity (default: 0)
   - **Low Stock Threshold** - Alert when stock goes below this (default: 10)
   - **Price** - Product price (default: 0)
   - **Unit** - Unit of measurement (default: "pcs" - pieces)

4. **Click "Create" Button**
   - Product will be saved and appear in the products list
   - You'll see a success message

---

## 📝 Example Product Entry

**Product Name:** iPhone 15 Pro  
**SKU:** IPH15PRO-128GB-BLK  
**Description:** Latest iPhone with 128GB storage, Black color  
**Category:** Electronics  
**Supplier:** ABC Electronics Inc.  
**Quantity:** 50  
**Low Stock Threshold:** 10  
**Price:** ₹999.99  
**Unit:** pcs  

---

## 🎯 Quick Tips

### Adding Multiple Products
- After creating a product, click "Add Product" again to add more
- The form will be empty and ready for the next product

### Required vs Optional Fields
- **Required:** Name, Category, Supplier
- **Optional:** Everything else (but recommended to fill for better tracking)

### Stock Management
- You can set initial quantity when creating
- Or create with 0 quantity and use "Update Stock" button later
- Low Stock Threshold triggers alerts when stock is low

### SKU (Stock Keeping Unit)
- Unique identifier for your product
- Helps with inventory tracking
- Optional but recommended for better organization

---

## ⚠️ Common Issues & Solutions

### Issue: "Add Product" button not visible
**Solution:** You need to be logged in as **Admin**. Staff users can only view products.

### Issue: Category dropdown is empty
**Solution:** Go to Categories page and create at least one category first.

### Issue: Supplier dropdown is empty
**Solution:** Go to Suppliers page and create at least one supplier first.

### Issue: Form won't submit
**Solution:** Make sure all required fields (Name, Category, Supplier) are filled.

### Issue: Error message appears
**Solution:** 
- Check if you're connected to the backend
- Verify MongoDB is running
- Check browser console for detailed error

---

## 🔄 After Adding Products

### Update Stock
- Click **"Stock"** button on any product
- Choose **"Add Stock"** or **"Remove Stock"**
- Enter quantity and reason
- Click **"Update Stock"**

### Edit Product
- Click **Edit icon** (blue pencil) on any product
- Modify any fields
- Click **"Update"**

### Delete Product
- Click **Delete icon** (red trash) on any product
- Confirm deletion
- ⚠️ This action cannot be undone

---

## 📊 Product Status Indicators

After adding products, you'll see status badges:

- 🟢 **In Stock** - Quantity is above low stock threshold
- 🟡 **Low Stock** - Quantity is at or below threshold
- 🔴 **Out of Stock** - Quantity is 0

---

## 🎨 Visual Guide

```
Products Page
├── Header
│   ├── Products Icon
│   └── "Add Product" Button (Admin only)
├── Search Bar
│   └── Search products by name, SKU, or description
├── Low Stock Filter
│   └── Toggle to show only low stock items
└── Products Table
    ├── Product Name
    ├── Category
    ├── Supplier
    ├── Quantity
    ├── Status Badge
    └── Action Buttons
        ├── Update Stock
        ├── Edit (Admin)
        └── Delete (Admin)
```

---

## 🚀 Quick Start Checklist

- [ ] Login as Admin
- [ ] Create at least 1 Category
- [ ] Create at least 1 Supplier
- [ ] Go to Products page
- [ ] Click "Add Product"
- [ ] Fill required fields (Name, Category, Supplier)
- [ ] Fill optional fields (recommended)
- [ ] Click "Create"
- [ ] ✅ Product added successfully!

---

**Need Help?** Check the main README.md for setup instructions or troubleshooting.
