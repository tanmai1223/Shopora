# 🛍️ SHOPORA — Full-Stack E-Commerce Application

SHOPORA is a full-stack e-commerce web application built using **React, Java Spring Boot, and PostgreSQL**. It provides a seamless shopping experience with product browsing, live search, category filtering, user authentication, shopping cart functionality, and administrative product management.

🚀 **Live Demo:** https://shoporas.netlify.app/
⚙️ **Backend API:** https://shopora-g7bh.onrender.com  
📂 **GitHub Repository:** https://github.com/tanmai1223/Shopora

---

## ✨ Features

### 🛒 Shopping Experience
- Browse products across multiple categories.
- Search products with live search suggestions.
- Filter products by category.
- View detailed product information, including images, descriptions, brands, prices, and availability.
- Add products to the shopping cart.
- View and manage cart items.
- View product stock and availability status.

### 🔐 Authentication & User Management
- User registration and login.
- JWT-based authentication.
- Role-based access for users and administrators.
- View and update user profile details.
- Secure password storage using BCrypt.

### ⚙️ Admin Dashboard
- Add new products with images and product details.
- Update existing product information.
- Delete products from the catalogue.
- View registered user profiles.

### ☁️ Cloud & Deployment
- PostgreSQL database hosted on Neon.
- Product image uploads using Cloudinary.
- Dockerized Spring Boot backend.
- Backend deployment on Render.
- Frontend deployment on Netlify.

---

## 🧰 Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React, Vite, JavaScript |
| Routing | React Router |
| API Requests | Axios |
| Styling | CSS Modules |
| UI Notifications | React Hot Toast |
| Icons | Font Awesome |
| Backend | Java 21, Spring Boot |
| Persistence | Spring Data JPA, Hibernate |
| Security | Spring Security, JWT |
| Password Hashing | BCrypt |
| Database | PostgreSQL, Neon |
| Image Storage | Cloudinary |
| Containerization | Docker |
| Deployment | Netlify, Render |
| Version Control | Git, GitHub |

---

## 📁 Project Structure

```text
Shopora/
│
├── fullStackProject/                 # Spring Boot backend
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       └── resources/
│   ├── pom.xml
│   ├── Dockerfile
│   └── ...
│
├── fullStackProjectFrontend/         # React + Vite frontend
│   ├── public/
│   ├── src/
│   │   ├── Components/
│   │   ├── Pages/
│   │   └── Styles/
│   ├── package.json
│   ├── vite.config.js
│   └── ...
│
├── .gitignore
└── README.md
```

The frontend and backend are maintained in a single GitHub repository and deployed independently.

---

## ⚙️ Getting Started

Follow these steps to run SHOPORA locally.

### Prerequisites

Make sure you have the following installed:

- Java 21
- Node.js and npm
- Git
- A PostgreSQL database or Neon account
- A Cloudinary account for product image uploads

### 1. Clone the Repository

```bash
git clone https://github.com/tanmai1223/Shopora.git
cd Shopora
```

### 2. Configure the Backend

Open the backend folder:

```bash
cd fullStackProject
```

Configure your environment variables before starting the application.

| Environment Variable | Description |
|---|---|
| `DB_URL` | PostgreSQL JDBC connection URL |
| `DB_USERNAME` | PostgreSQL username |
| `DB_PASSWORD` | PostgreSQL password |
| `JWT_SECRET` | Secret used to sign JWT tokens |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |

Example JDBC URL format:

```text
jdbc:postgresql://<host>/<database>?sslmode=require
```

Replace the placeholders with your actual database connection details.

Configure the variables using your IDE's run configuration or your operating system's environment variables.

**Important:** Never commit database credentials, JWT secrets, or private API keys to GitHub.

#### Run the Backend

On Windows:

```powershell
.\mvnw.cmd spring-boot:run
```

On macOS/Linux:

```bash
./mvnw spring-boot:run
```

Alternatively, open the backend project in IntelliJ IDEA and run the Spring Boot application.

The application uses port `8080` by default unless overridden by the `PORT` environment variable or your local configuration.

### 3. Configure the Frontend

Open a new terminal and navigate to the frontend folder from the repository root:

```bash
cd fullStackProjectFrontend
```

Create a `.env` file in this folder:

```env
VITE_API_URL=http://localhost:8080
```

This configures the frontend to communicate with the locally running backend.

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Vite typically serves the frontend at:

```text
http://localhost:5173
```

Open this URL in your browser to use SHOPORA locally.

### 4. Configure CORS

Ensure your backend CORS configuration allows requests from your frontend origin.

For local development, this is typically:

```text
http://localhost:5173
```

For production, allow your actual Netlify website origin as well.

Only permit trusted origins.

---

## 🚀 Deployment

SHOPORA's frontend and backend are hosted separately while using the same GitHub repository.

### Backend Deployment — Render

The Spring Boot backend uses Docker for deployment.

1. Connect your GitHub repository to Render.
2. Configure the backend directory as the build context: `fullStackProject`.
3. Set the required environment variables in Render.
4. Ensure the backend connects successfully to Neon PostgreSQL.
5. Configure CORS to allow the deployed Netlify frontend.
6. Deploy the service and check the application logs.

Required environment variables include:

```text
DB_URL
DB_USERNAME
DB_PASSWORD
JWT_SECRET
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
```

Add only the variables your application actually uses.

### Frontend Deployment — Netlify

Configure your Netlify site to use the frontend directory.

| Setting | Value |
|---|---|
| Base directory | `fullStackProjectFrontend` |
| Build command | `npm run build` |
| Publish directory | `dist` |

Add the following environment variable in Netlify:

```env
VITE_API_URL=https://shopora-g7bh.onrender.com
```

Replace the URL if your Render backend address changes.

After updating environment variables, trigger a new deployment so the frontend is built with the correct API URL.

---

## 🔌 API Integration

The frontend communicates with the Spring Boot backend through Axios.

The backend URL is configured using the Vite environment variable:

```javascript
const API_URL = import.meta.env.VITE_API_URL;
```

Protected API requests include the JWT in the `Authorization` header:

```javascript
headers: {
  Authorization: `Bearer ${token}`
}
```

Product creation uses multipart form data containing:

- `product`: JSON data containing the product name, description, price, brand, category, availability, and stock.
- `image`: The product image file.

The backend processes the request, uploads the image to Cloudinary, and stores the product information in PostgreSQL.

Refer to the backend controllers for the available endpoints, request formats, and authorization requirements.

---

## 🔒 Security Considerations

- Store database credentials and private keys in environment variables.
- Never commit real secrets or `.env` files to GitHub.
- Rotate credentials if they have been exposed.
- Keep private API keys out of frontend environment variables prefixed with `VITE_`.
- Use HTTPS for deployed services.
- Configure CORS to allow only trusted frontend origins.
- Validate incoming data on the backend.
- Enforce authorization checks on protected operations.

---

## 🔮 Future Enhancements

Potential improvements include:

- Order placement and checkout functionality.
- Payment gateway integration.
- Product reviews and ratings.
- Pagination and advanced product filters.
- Automated testing.
- Order history and tracking.
- Improved product recommendations.

---

## 👩‍💻 Author

**Tanmai**

GitHub: [@tanmai1223](https://github.com/tanmai1223)

---

⭐ If you find this project interesting, feel free to explore the repository!
