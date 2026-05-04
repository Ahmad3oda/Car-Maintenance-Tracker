# Car Maintenance Tracker API

A lightweight REST API built with **NestJS** + **TypeORM** + **SQLite** to track maintenance items and service records for a single car. Perfect for keeping a personal log of oil changes, tire rotations, brake replacements, and any other parts/services with their costs and mileage history.

![NestJS](https://img.shields.io/badge/NestJS-10-red?logo=nestjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![SQLite](https://img.shields.io/badge/SQLite-3-lightblue?logo=sqlite)

---

## ✨ Features

- **Items management** — Track car parts/services (engine oil, brake pads, tires, etc.)
- **Records management** — Log every maintenance event with date, mileage (km), and price
- **Photo upload** — Attach a photo to each item (stored locally in `/uploads`)
- **Search & filter**
  - Search items by name or description
  - Filter records by date range, mileage range, or notes
- **Last record highlight** — Each item automatically shows its most recent maintenance record
- **Pagination & sorting** — Paginate results, sort items by name, creation date, or last service date
- **Validation** — Strong DTO validation with `class-validator`
- **CORS enabled** — Ready to connect a frontend (React, Vue, Flutter, etc.)

---

## Tech Stack

| Layer     | Technology           |
| --------- | -------------------- |
| Framework | NestJS 10            |
| Language  | TypeScript           |
| Database  | SQLite (via TypeORM) |
| ORM       | TypeORM              |

> 💡 The DB can be swapped to PostgreSQL/MySQL by changing the connection config in `app.module.ts`.

---

## Project Structure

```
src/
├── items/
│   ├── dto/                # Create, update, query DTOs
│   ├── entities/           # Item entity (schema)
│   ├── items.controller.ts
│   ├── items.service.ts
│   └── items.module.ts
├── records/
│   ├── dto/
│   ├── entities/           # Record entity (schema)
│   ├── records.controller.ts
│   ├── records.service.ts
│   └── records.module.ts
├── app.module.ts
└── main.ts
uploads/                    # Auto-created for photos
data.sqlite                 # Auto-created on first run
```

---

## Installation & Setup

### Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher

### 1. Clone the repository

```bash
git clone https://github.com/Ahmad3oda/car-maintenance-tracker.git
cd car-maintenance-tracker
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file at the project root (or copy the example):

```bash
cp .env.example .env
```

Default `.env` values:

```env
PORT=3000
DB_PATH=data.sqlite
UPLOAD_DIR=uploads
```

### 4. Run the app

**Development (hot reload):**

```bash
npm run start:dev
```

**Production:**

```bash
npm run build
npm run start:prod
```

The API will be available at:  
👉 `http://localhost:3000`

Uploaded photos will be served at:  
👉 `http://localhost:3000/uploads/<filename>`

---

## Database

This app uses **SQLite** with TypeORM. On first run, `data.sqlite` is automatically created in the project root with all tables (`synchronize: true` in dev mode).

### Schema (defined in entity files)

**Item** — `src/items/entities/item.entity.ts`
| Field | Type | Notes |
|--------------|-----------|------------------------|
| id | int | PK, auto-increment |
| name | string | required |
| description | text | optional |
| photo | string | filename in `/uploads` |
| createdAt | datetime | auto |
| updatedAt | datetime | auto |

**Record** — `src/records/entities/record.entity.ts`
| Field | Type | Notes |
|--------------|-----------|-----------------------------|
| id | int | PK, auto-increment |
| itemId | int | FK → items.id (CASCADE) |
| date | datetime | when the service happened |
| kmCounter | int | car odometer reading |
| price | float | cost |
| notes | text | optional |

---

## API Endpoints

### Items

| Method | Endpoint     | Description                              |
| ------ | ------------ | ---------------------------------------- |
| POST   | `/items`     | Create item (multipart with photo)       |
| GET    | `/items`     | List items with search/filter/pagination |
| GET    | `/items/:id` | Get one item with its last record        |
| PATCH  | `/items/:id` | Update item                              |
| DELETE | `/items/:id` | Delete item (and all its records)        |

**Query params for `GET /items`:**

- `search` — search in name/description
- `page` (default `1`)
- `limit` (default `20`)
- `sortBy` — `name` | `createdAt` | `updatedAt`
- `order` — `ASC` | `DESC`

### Records

| Method | Endpoint                  | Description                    |
| ------ | ------------------------- | ------------------------------ |
| POST   | `/records`                | Create maintenance record      |
| GET    | `/records`                | List records with filters      |
| GET    | `/records/latest/:itemId` | Latest record for a given item |
| GET    | `/records/:id`            | Get one record                 |
| PATCH  | `/records/:id`            | Update record                  |
| DELETE | `/records/:id`            | Delete record                  |

**Query params for `GET /records`:**

- `itemId` — filter by item
- `fromDate`, `toDate` — date range (ISO format)
- `minKm`, `maxKm` — mileage range
- `search` — search in notes
- `page`, `limit`, `order`

---

## Switching to PostgreSQL / MySQL

The app uses TypeORM, so you only need to:

1. Install the driver:

   ```bash
   npm install pg          # for PostgreSQL
   # or
   npm install mysql2      # for MySQL
   ```

2. Update `src/app.module.ts`:
   ```typescript
   TypeOrmModule.forRoot({
     type: 'postgres',         // or 'mysql'
     host: 'localhost',
     port: 5432,
     username: 'postgres',
     password: 'password',
     database: 'car_maintenance',
     entities: [Item, Record],
     synchronize: true,
   }),
   ```

That's it — entities, services, and controllers stay the same.

---

## 🛣️ Roadmap

- [ ] JWT authentication
- [ ] Swagger / OpenAPI docs
- [ ] Maintenance reminders (notify when km since last service > X)
- [ ] Cost analytics dashboard
- [ ] Export records as CSV/PDF
- [ ] Frontend (React / Next.js)
- [ ] Docker support
- [ ] Cloud storage for photos (S3 / Cloudinary)
- [ ] Multi-car support
