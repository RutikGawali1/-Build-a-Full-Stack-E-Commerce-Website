
# 🛒 E-Commerce Web Application (MERN Stack)

This is a full-stack e-commerce application built using the MERN stack (MongoDB, Express.js, React.js, Node.js). It supports user authentication, product browsing, cart management, and admin-level product control. The backend is hosted on AWS EC2.

---

## 📌 Features

### 👤 User Functionality
- Sign up / Login (JWT Authentication)
- View product listings and details
- Add items to cart
- Update/remove items from cart
- Simulated checkout flow

### 🔐 Admin Functionality
- Add new products
- Edit product details
- Delete products
- Access restricted routes via token-based role verification

---

## 🛠️ Tech Stack

| Layer       | Technology                |
|-------------|---------------------------|
| Frontend    | React.js                  |
| Backend     | Node.js + Express.js      |
| Database    | MongoDB (via Mongoose)    |
| Authentication | JWT                    |
| Hosting     | AWS EC2 (Backend Only)    |
| API Testing | Postman                   |

---

## 🧩 Architecture

Frontend (React.js)
    |
    v
Backend (Express.js - EC2) <--- Auth Middleware (JWT)
    |
    v
MongoDB Atlas (User, Product, Cart, Order Models)

---

## 🗂️ Folder Structure

📁 root  
├── backend/  
│   ├── models/  
│   ├── routes/  
│   ├── controllers/  
│   ├── middleware/  
│   └── server.js  
└── frontend/  
    ├── src/  
    │   ├── pages/  
    │   ├── components/  
    │   └── App.jsx

---

## 🧪 API Overview

**📍 Base URL (Local):** http://localhost:5000

| Method | Endpoint               | Description                | Access     |
|--------|------------------------|----------------------------|------------|
| POST   | /api/auth/register     | Register user              | Public     |
| POST   | /api/auth/login        | Login user                 | Public     |
| GET    | /api/products          | Get all products           | Public     |
| GET    | /api/products/:id      | Get product by ID          | Public     |
| POST   | /api/products          | Add new product            | Admin Only |
| PUT    | /api/products/:id      | Update product             | Admin Only |
| DELETE | /api/products/:id      | Delete product             | Admin Only |
| POST   | /api/cart              | Add to cart                | User       |
| GET    | /api/cart/:userId      | Get cart by user           | User/Admin |
| POST   | /api/orders            | Place order                | User       |

---

## 🚀 Hosting

- 🖥️ **Backend** hosted on **AWS EC2**

---

## 🧾 How to Run Locally

### 🔧 Backend Setup
```bash
cd backend
npm install
# Add a .env file with MONGO_URI and JWT_SECRET
npm start
```

### 🌐 Frontend Setup
```bash
cd frontend
npm install
npm start
```

---

## 📮 Postman Collection

A Postman collection is available to test the following:
- Auth (login/register)
- Product CRUD
- Cart APIs
- Order API

---

## 📚 License

This project is open-source and available under the MIT License.

---

## 🙌 Credits

Built as part of a full-stack e-commerce learning project using MERN + AWS EC2 hosting.

---

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### npm start

Runs the app in the development mode.  
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.  
You may also see any lint errors in the console.

### npm test

Launches the test runner in the interactive watch mode.  
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### npm run build

Builds the app for production to the build folder.  
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.  
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### npm run eject

**Note: this is a one-way operation. Once you eject, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can eject at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except eject will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use eject. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [Code Splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [Analyzing the Bundle Size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [Making a Progressive Web App](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [Advanced Configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [Deployment](https://facebook.github.io/create-react-app/docs/deployment)

### npm run build fails to minify

This section has moved here: [Troubleshooting](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
