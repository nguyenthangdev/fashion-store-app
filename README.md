# fashion-store-app
---
This is a fashion website project, including a customer-facing site (Client) and an administrative system (Admin). The project is built on the MERN stack (MongoDB, Express, React, Node) but modernized with Vite, TypeScript.

<img width="1918" height="919" alt="image" src="https://github.com/user-attachments/assets/e168bbfe-cf73-4ebe-85ac-47bdc1fcc411" />

- Frontend Deploy (Vercel): [https://luxues-store.vercel.app]

- Backend Deploy (Render): [https://luxues-store.onrender.com]

---

## 1. Key Features

The project is divided into two separate parts: front-end (Client) and back-end (Admin/API).

1.1. Client

- Authentication:

  - Registration and Login using bcrypt (password hashing) and JWT (JSON Web Token).

  - Uses httpOnly cookies for accessToken and refreshToken, enhancing security (prevents XSS).

  - Google Login (OAuth 2.0): Integrated with Passport.js for quick sign-in/sign-up via Google.

  - Secure "Forgot Password" flow using temporary JWTs sent via emai.

- Shopping:

  - Advanced Cart Logic: Automatically creates carts for guests. When a guest logs in, the system automatically merges the guest cart into their account cart.

  - Product listing page with multi-level filtering: Filter by Category (multi-level), Price (slider), Color, and Size.

  - Product Sorting: Sort by "Default" (createdAt), Name (A-Z, Z-A), and especially sort by Discounted Price (calculated via Aggregation).

  - Product detail page with an image gallery (Image Swiper), color/size selection, and review display.

- Search:

  - "Classic Search" (pressing Enter) navigates to a paginated results page.
 
  - Real-time search suggestions (using debounce) directly under the search bar.

- User Account (Private Routes):

  - Account information page (update avatar, details).
 
  - "My Orders" page (view history, filter orders).
 
  - Cancel order (if status allows).
 
  - Product Reviews: Allows verified purchasers to leave a rating and upload images.

- Chat Real-time:

  - Uses Socket.io for 1-on-1 real-time chat with Admin.
 
  - Automatic authentication via httpOnly cookie on socket connection.
 
  - Displayed as a convenient chat bubble on the site.

1.2. Admin

- Admin Authentication: Separate login system, also using JWT (cookie accessToken and refreshToken) and bcrypt.

- Authorization: Integrates role_id logic into the JWT payload to control API access (e.g., Admin, Product, Order,..).

- Statistic: Overview of revenue, orders.

- Full CRUD Management:

  - Product Management (Add, Edit, Delete, Update Status, Trash).
 
  - Order Management (View details, update status: Processing -> Transporting -> Confirmed..., Trash).
 
  - Brand Management.
 
  - User (Client) & Account (Admin) Management.
 
  - Role & Permission Management.

- Excel Export:

  - Feature to export the entire (filtered) order list to an .xlsx file using exceljs on the backend.

- Real-time Chat (Admin View):

  - 2-column interface displaying all customer chat sessions.
 
  - Receive real-time messages and reply directly to each customer.

## 2. Tech Stack

2.1. Frontend

- Framework/Library: React 19, Vite

- Language: TypeScript

- Styling: Tailwind CSS, Framer Motion (for animations)

- Routing: React Router v7+

- State Management: React Context

- API Client: Axios

- Real-time: Socket.io-client

- Components: Material-UI (MUI) (for Skeletons, Menus, Dialogs), Swiper.js (for sliders)

- Validator: Zod, react-hook-form

2.2. Backend

- Framework: Node.js, Express.js

- Language: TypeScript

- Database: MongoDB (with Mongoose)

- Authentication: jsonwebtoken (JWT), bcrypt (Hashing), passport, passport-google-oauth20

- Real-time: Socket.io

- API: REST API, Cookie-Parser, CORS

- File Upload: Multer (file handling), Cloudinary (image storage)

- Validator: Joi

- Others: exceljs (Excel Export), mongoose-slug-updater

2.3. Deployment

- Frontend: Vercel (connected to the front-end directory and vercel.json for SPA routing)

- Backend: Render (connected to the back-end directory and running npm run build & npm run start)

--- 

