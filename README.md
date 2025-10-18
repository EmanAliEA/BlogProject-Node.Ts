# Getting Started: How to Run This Project

1. **Clone the repository**
  ```bash
  git clone <repo-url>
  cd BlogProject
  ```
2. **Install dependencies**
  ```bash
  npm install
  ```
3. **Set up environment variables**
  - Copy the example or create a `.env` file in the project root:
    ```env
    MONGODB_URI=mongodb://localhost:27017/BlogProject
    JWT_PRIVATE_KEY=your_jwt_secret
    PORT=3000
    ```
  - Make sure MongoDB is running locally or update the URI for your setup use this command
     -brew services start mongodb/brew/mongodb-community 
4. **Run the project in development mode**
  ```bash
  npx nodemon --exec npx ts-node src/index.ts
  ```
  Or use the npm script (if available):
  ```bash
  npm run dev
  ```
5. **Run tests**
  ```bash
  npm test -- --config=jest.config.cjs
  ```
6. **Access the API**
  - The server will start on the port you set (default: 3000).
  - Use tools like Postman or curl to interact with the API endpoints.
## Advanced Usage

- **Authentication:** All blog and user routes require a valid JWT token in the `x-auth-token` header.
- **Error Handling:** API returns clear error messages for validation, authentication, and database errors.
- **Environment Variables:**
  - `MONGODB_URI`: MongoDB connection string
  - `JWT_PRIVATE_KEY`: Secret for JWT signing
  - `PORT`: Server port (default 3000)

## Common Errors & Solutions

- **401 Unauthorized:**
  - Make sure to send a valid JWT token in the `x-auth-token` header.
  - Check that your token is not expired and matches the user.
- **Validation Errors:**
  - API will return messages like `"title" is required` or `"email" must be a valid email`.
  - Ensure your request body matches the expected schema.
- **Database Errors:**
  - If MongoDB is not running or the URI is wrong, you will get a connection error.
  - Check your `.env` file and MongoDB status.

## API Reference

- **POST /register** — Register a new user
- **POST /login** — Login and get JWT token
- **POST /blogs** — Create a blog (auth required)
- **GET /blogs** — Get all blogs for the authenticated user
- **GET /blogs?category=Technology** — Get blogs for the authenticated user filtered by category

## Filtering Blogs by Category

To filter blogs by category, use the `category` query parameter:

```http
GET /blogs?category=Technology
Headers: x-auth-token: <JWT>
```

This will return only blogs in the specified category for the authenticated user.

- **PUT /blogs/:id** — Update a blog (auth required)
- **DELETE /blogs/:id** — Delete a blog (auth required)

## Important: JWT_PRIVATE_KEY Setup

For security, you should set your own value for `JWT_PRIVATE_KEY` in your `.env` file before running the project for the first time. If not set, the default is `valid_PrivateKey` (see `src/config/config.ts`).

## Example .env file

```env
MONGODB_URI=mongodb://localhost:27017/BlogProject
JWT_PRIVATE_KEY=your_jwt_secret
PORT=3000
```

The coverage report will be available in the `coverage/` directory.

## Sample API Responses

### Register User (Success)

```json
{
  "_id": "6531a1b2c3d4e5f6a7b8c9d0",
  "name": "ahmed",
  "email": "ahmed@gmail.com"
}
```

### Login (Success)

```json
{
  "token": "<JWT_TOKEN>"
}
```

### Create Blog (Validation Error)

```json
{
  "error": "\"title\" is required"
}
```

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Commit your changes (`git commit -am 'Add some fooBar'`)
4. Push to the branch (`git push origin feature/fooBar`)
5. Open a Pull Request

## Contact

For questions or support, please contact:

- Project owner: [Your Name](mailto:your.email@example.com)
- Or open an issue on GitHub

# BlogProject

A Node.js + TypeScript + Express blog API with testing and validation.

## Prerequisites

- Node.js (v18+ recommended)
- npm
- MongoDB (local or cloud instance)

## Install dependencies

```bash
npm install
```

## Run the project (development)

```bash
npx nodemon --exec npx ts-node src/index.ts
```

## Run tests with config (if needed)

```bash
npm test -- --config=jest.config.cjs
```

## Project structure

- `src/` — Source code
- `tests/` — Unit and integration tests
- `models/` — Mongoose models (MongoDB ODM)
- `routes/` — Express routes
- `middleware/` — Express middleware

## Environment Setup

- Create a `.env` file in the project root with:
  ```env
  MONGODB_URI=mongodb://localhost:27017/blogproject
  JWT_PRIVATE_KEY=your_jwt_secret
  ```

## Example API Usage

### Register User

```http
POST /resgister
{
	"name": "ahmed",
	"email": "ahmed@gmail.com",
	"password": "ahmed12"
}
```

### Login

```http
POST /login
{
	"email": "ahmed@gmail.com",
	"password": "ahmed12"
}
```

### Create Blog

```http
POST /blogs
Headers: x-auth-token: <JWT>
{
	"title": "First Blog",
	"content": "This is my first blog post.",
	"category": "Technology"
}
```

## Troubleshooting

- If you get a MongoDB connection error, check your `MONGODB_URI` and that MongoDB is running.
- For JWT errors, ensure `JWT_PRIVATE_KEY` is set in your environment.
- For TypeScript build errors, check that all source files are under `src/` and your `tsconfig.json` is correct.

---

For more details, see the code and comments in each folder.
