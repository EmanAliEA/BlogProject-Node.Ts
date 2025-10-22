# BlogProject

A Node.js, TypeScript, and Express-powered blog API with JWT authentication, MongoDB storage, robust validation, and comprehensive testing.

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repo-url>
cd BlogProject-Node.Ts
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory. Use the following template:

```env
MONGODB_URI=mongodb://localhost:27017/BlogProject
JWT_PRIVATE_KEY=your_jwt_secret
PORT=3000
```

> **Note:**
>
> - Ensure MongoDB is running locally, or update `MONGODB_URI` for your setup.
> - To start MongoDB (Homebrew):
>   ```bash
>   brew services start mongodb/brew/mongodb-community
>   ```

### 4. Start the Development Server

You can use either:

```bash
npx nodemon --exec npx ts-node src/index.ts
```

or (if available):

```bash
npm run dev
```

### 5. Run Tests

```bash
npm test -- --config=jest.config.cjs
```

Test coverage will be available in the `coverage/` directory.

---

## 📚 API Reference

### Authentication

- All blog and user routes require a valid JWT in the `x-auth-token` header.

### Endpoints

| Method | Endpoint                     | Description                          | Auth Required |
| ------ | ---------------------------- | ------------------------------------ | ------------- |
| POST   | `/register`                  | Register a new user                  | No            |
| POST   | `/login`                     | Login and receive JWT token          | No            |
| POST   | `/blogs`                     | Create a blog                        | Yes           |
| GET    | `/blogs`                     | Get all blogs for authenticated user | Yes           |
| GET    | `/blogs?category=Technology` | Get blogs by category                | Yes           |
| PUT    | `/blogs/:id`                 | Update a blog                        | Yes           |
| DELETE | `/blogs/:id`                 | Delete a blog                        | Yes           |

#### Query Parameters for GET /blogs

- `category`: Filter blogs by category (e.g., `/blogs?category=Technology`)
- `title`: Search blogs by title (case-insensitive, partial match, e.g., `/blogs?title=foo`)
- `content`: Search blogs by content (case-insensitive, partial match, e.g., `/blogs?content=bar`)
- `limit`: Limit the number of returned blogs (e.g., `/blogs?limit=5`)

You can combine these parameters, for example:

```http
GET /blogs?category=Technology&title=ai&limit=2
Headers: x-auth-token: <JWT>
```

Returns up to 2 blogs in the Technology category with 'ai' in the title.

### Example: Filter Blogs by Category

```http
GET /blogs?category=Technology
Headers: x-auth-token: <JWT>
```

Returns blogs in the specified category for the authenticated user.

---

## 🛠️ Project Structure

```
src/
  controllers/      # Express route controllers (business logic)
  models/           # Mongoose models (MongoDB schemas)
  routes/           # Express route handlers
  middleware/       # Express middleware (auth, validation, etc.)
  helpers/          # Reusable helper functions (validation, query, etc.)
  config/           # Configuration files (JWT, DB, etc.)
tests/
  integration/      # Integration tests (API endpoints)
  unit/             # Unit tests (controllers, helpers)
package.json        # Project metadata and scripts
tsconfig.json       # TypeScript configuration
README.md           # Project documentation
```

---

## 🧩 Environment & Configuration

- Ensure `.env` is present in the root.
- Variables:
  - `MONGODB_URI`: MongoDB connection string
  - `JWT_PRIVATE_KEY`: JWT signing secret (recommended: set your own value)
  - `PORT`: Server port (default: 3000)

> For security, always set a strong `JWT_PRIVATE_KEY`.  
> Default is `valid_PrivateKey` if not set (see `src/config/conf...`).

---

## 📝 Sample API Usage

### Register User

```http
POST /register
Content-Type: application/json

{
  "name": "ahmed",
  "email": "ahmed@gmail.com",
  "password": "ahmed12"
}
```

#### Success Response

```json
{
  "_id": "6531a1b2c3d4e5f6a7b8c9d0",
  "name": "ahmed",
  "email": "ahmed@gmail.com"
}
```

### Login

```http
POST /login
Content-Type: application/json

{
  "email": "ahmed@gmail.com",
  "password": "ahmed12"
}
```

#### Success Response

```json
{
  "token": "<JWT_TOKEN>"
}
```

### Create Blog

```http
POST /blogs
Headers: x-auth-token: <JWT>
Content-Type: application/json

{
  "title": "First Blog",
  "content": "This is my first blog post.",
  "category": "Technology"
}
```

#### Validation Error Example

```json
{
  "error": "\"title\" is required"
}
```

---

## ⚠️ Common Errors & Solutions

| Error                 | Solution                                                                                 |
| --------------------- | ---------------------------------------------------------------------------------------- |
| **401 Unauthorized**  | Ensure a valid JWT token in `x-auth-token` header. Token must not be expired or invalid. |
| **Validation Errors** | API returns messages like `"title" is required` or `"email" must be a valid email`.      |
| **Database Errors**   | Check if MongoDB is running and `MONGODB_URI` is correct in your `.env` file.            |

---

## 🔍 Troubleshooting

- **MongoDB Connection Error:**
  - Verify `MONGODB_URI` and ensure MongoDB is running.
- **JWT Errors:**
  - Ensure `JWT_PRIVATE_KEY` is set.
- **TypeScript Build Errors:**
  - Confirm all source files are under `src/` and `tsconfig.json` is correct.

---

## 🤝 Contributing

Pull requests are welcome! For major changes, open an issue first to discuss your proposal.

**How to contribute:**

1. Fork the repository
2. Create your feature branch
   ```bash
   git checkout -b feature/fooBar
   ```
3. Commit your changes
   ```bash
   git commit -am 'Add some fooBar'
   ```
4. Push to the branch
   ```bash
   git push origin feature/fooBar
   ```
5. Open a Pull Request

---

## 📬 Contact

- Project owner: [Your Name](mailto:your.email@example.com)
- Or open an issue on GitHub

---

## 🧑‍💻 Prerequisites

- Node.js (v18+ recommended)
- npm
- MongoDB (local or cloud)

---

_For more details, see the code and comments in each folder._
