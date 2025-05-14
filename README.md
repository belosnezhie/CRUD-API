# CRUD API

A simple RESTful API for managing users. Built with **Node.js** and **TypeScript**, using an **in-memory database**.

## Features

- Full CRUD operations on `/api/users` endpoint.
- In-memory data storage.
- Proper HTTP status code handling.
- Input validation (UUIDs, required fields).
- Error handling for 400, 404, and 500.
- Environment-based configuration.
- Supports development, production, and multi-process (clustered) modes.
- Includes basic API test scenarios.

## API Endpoints

| Method | Endpoint         | Description       |
| ------ | ---------------- | ----------------- |
| GET    | `/api/users`     | Get all users     |
| GET    | `/api/users/:id` | Get user by ID    |
| POST   | `/api/users`     | Create new user   |
| PUT    | `/api/users/:id` | Update user by ID |
| DELETE | `/api/users/:id` | Delete user by ID |

### User Object Format

```json
{
  "id": "uuid",
  "username": "John Doe",
  "age": 30,
  "hobbies": ["hobby horsing", "knitting"]
}
```

## Getting Started

### Prerequisites

- **Node.js** ≥ 22.14.0
- **npm** ≥ 9.x

## Installation

1. **Clone the repository**

```bash
git clone <repo-url>
cd <repo-folder>
```

2. **Install dependencies**

```bash
npm install
```

3. **Create `.env` file**

```env
PORT=4000
```

## Scripts

| Command               | Description                                                      |
| --------------------- | ---------------------------------------------------------------- |
| `npm run start:dev`   | Start server in development mode with hot reload (`ts-node-dev`) |
| `npm run start:prod`  | Build and run server in production mode                          |
| `npm run build`       | Compile TypeScript into JavaScript                               |
| `npm run start:multi` | Start server in cluster mode with load balancing                 |
| `npm test`            | Run API tests                                                    |
| `npm run lint`        | Lint the codebase with ESLint                                    |

---

## Running the App

### Development

```bash
npm run start:dev
```

Runs the server with `ts-node-dev` and watches for changes.

### Production

```bash
npm run start:prod
```

Builds the project and runs the compiled code.

### Cluster Mode

```bash
npm run start:multi
```

- Starts a load balancer on `PORT`
- Spawns N-1 worker processes on ports `PORT + 1`, `PORT + 2`, etc.
- Balances traffic between workers using round-robin strategy
- Shared in-memory DB between workers (in implementation logic)

## Testing

Run the test scenarios:

```bash
npm test
```

Sample test flow includes:

1. `GET /api/users` → returns empty array.
2. `POST /api/users` → creates user.
3. `GET /api/users/:id` → returns created user.
4. `PUT /api/users/:id` → updates user.
5. `DELETE /api/users/:id` → deletes user.
6. `GET /api/users/:id` → returns 404.

## Technologies

- **Node.js**
- **TypeScript**
- **ESLint** / **Prettier**
- **dotenv**
- **uuid**
- **ts-node-dev**
- **Cluster API** (multi-process support)
