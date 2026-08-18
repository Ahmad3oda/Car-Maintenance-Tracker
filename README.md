# Car Maintenance Tracker

A full-stack application for tracking cars, their maintenance items (parts/services), and service history. Built with **NestJS** + **TypeORM** + **SQLite** on the backend and **Angular 19** on the frontend.

![NestJS](https://img.shields.io/badge/NestJS-11-red?logo=nestjs)
![Angular](https://img.shields.io/badge/Angular-19-red?logo=angular)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![SQLite](https://img.shields.io/badge/SQLite-3-lightblue?logo=sqlite)

---

## Features

### Backend

- **Multi-car support** — Register and manage multiple vehicles
- **Items management** — Track parts/services per car (oil, brake pads, tires, etc.)
- **Maintenance records** — Log every service event with date, mileage, item cost, extra costs, and notes
- **Photo upload** — Attach a photo to cars and items (stored locally in `/uploads`)
- **Search, filter & pagination** — Paginated list endpoints with search and multi-column sorting
- **Validation** — Strong DTO validation with `class-validator`
- **Swagger / OpenAPI** — Interactive API docs at `/api`
- **CORS enabled** — Connected to the Angular frontend

### Frontend

- **Dashboard** — Summary metrics and recent maintenance activity with sorting
- **Cars** — List, add, edit, and view car details with linked items
- **Items** — Add and edit maintenance items per vehicle
- **Maintenance events** — View, add, and edit service records per item
- **Interactive sorting & pagination** — Server-side sorting headers and responsive pagination controls
- **Theme support** — Dark and light mode toggle with persistent local storage
- **Responsive design** — Adaptive layout optimized for mobile, tablet, and desktop screens
- **Image lightbox & toast alerts** — Full-screen image preview and notification toasts
- **Full API integration** — Angular services connected to NestJS backend via `HttpClient`

### UI Draft

<img width="1919" height="1038" alt="image" src="https://github.com/user-attachments/assets/1e366ad6-1049-4502-b4d3-5ab106469576" />

---

## Tech Stack

| Layer | Technology |
| ----- | ---------- |
| **Backend framework** | NestJS 11 |
| **Frontend framework** | Angular 19 (standalone components) |
| **Language** | TypeScript 5 |
| **Database** | SQLite (via TypeORM) |
| **ORM** | TypeORM |
| **API docs** | Swagger (`@nestjs/swagger`) |
| **Validation** | class-validator, class-transformer |
| **File uploads** | Multer |
| **Frontend styling** | Tailwind CSS 3, DaisyUI 4, PostCSS |
| **Frontend fonts** | Fira Mono (`@fontsource/fira-mono`) |
| **Frontend testing** | Karma + Jasmine |

> The database can be swapped to PostgreSQL/MySQL by changing the TypeORM connection config in `Backend/app/src/app.module.ts`.

---

## Repository Structure

```
Car-Maintenance-Tracker/
├── Backend/
│   └── app/                          # NestJS API
│       ├── src/
│       │   ├── common/dtos/          # Shared pagination DTOs
│       │   ├── modules/
│       │   │   ├── cars/             # Cars module
│       │   │   ├── items/            # Items module
│       │   │   └── maintenance-records/
│       │   ├── app.module.ts
│       │   └── main.ts
│       ├── uploads/                  # Item photo storage (auto-created)
│       ├── data.sqlite               # SQLite DB (auto-created on first run)
│       └── package.json
├── Frontend/                         # Angular SPA
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/                 # Layouts & services
│   │   │   ├── features/             # Feature pages
│   │   │   └── shared/               # Models & reusable components
│   │   ├── styles.css
│   │   └── main.ts
│   ├── angular.json
│   ├── tailwind.config.js
│   └── package.json
└── README.md
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

### 2. Backend setup

```bash
cd Backend/app
npm install
```

Create a `.env` file in `Backend/app/` (optional — defaults shown):

```env
PORT=3000
DB_PATH=data.sqlite
```

**Development (hot reload):**

```bash
npm run start:dev
```

**Production:**

```bash
npm run build
npm run start:prod
```

The API runs at `http://localhost:3000`  
Swagger docs at `http://localhost:3000/api`  
Uploaded photos at `http://localhost:3000/uploads/<filename>`

### 3. Frontend setup

```bash
cd Frontend
npm install
```

**Development server:**

```bash
npm start
# or: ng serve
```

The app runs at `http://localhost:4200`

**Production build:**

```bash
npm run build
```

Build output is written to `Frontend/dist/frontend/`.

---

## Backend

### Project Structure (`Backend/app/src/modules/`)

```
modules/
├── cars/
│   ├── dtos/                   # create, update, query DTOs
│   ├── entities/               # Car entity (cars table)
│   ├── serializers/            # API response shape
│   ├── cars.controller.ts
│   ├── cars.service.ts
│   ├── cars.repository.ts
│   └── cars.module.ts
├── items/
│   ├── dtos/
│   ├── entities/               # Item entity (items table)
│   ├── serializers/
│   ├── items.controller.ts
│   ├── items.service.ts
│   ├── items.repository.ts
│   └── items.module.ts
└── maintenance-records/
    ├── dtos/
    ├── entities/               # MaintenanceRecord entity (maintenance_records table)
    ├── serializers/
    ├── maintenance-records.controller.ts
    ├── maintenance-records.service.ts
    ├── maintenance-records.repository.ts
    └── maintenance-records.module.ts
```

### Database

SQLite with TypeORM. On first run, `data.sqlite` is created automatically (`synchronize: true` in dev).

#### Entity relationships

```
cars (1) ──< items (many)
cars (1) ──< maintenance_records (many)
items (1) ──< maintenance_records (many)
```

Deleting a car cascades to its items and maintenance records. Deleting an item cascades to its maintenance records.

#### Table: `cars`

Defined in `Backend/app/src/modules/cars/entities/car.entity.ts`

| Column | Type | Notes |
| ------ | ---- | ----- |
| `id` | int | PK, auto-increment |
| `plateNumber` | string | required, unique |
| `brand` | string | required |
| `model` | string | required |
| `year` | int | required |
| `currentKm` | int | default `0` |
| `createdAt` | datetime | auto |
| `updatedAt` | datetime | auto |

#### Table: `items`

Defined in `Backend/app/src/modules/items/entities/item.entity.ts`

| Column | Type | Notes |
| ------ | ---- | ----- |
| `id` | int | PK, auto-increment |
| `carId` | int | FK → `cars.id` (CASCADE) |
| `name` | string | required |
| `description` | text | optional |
| `serialNumber` | string | optional |
| `photoPath` | string | filename in `/uploads` |
| `installedDate` | datetime | optional |
| `installedKm` | int | optional |
| `expectedMaintenanceKm` | int | optional — interval in km |
| `expectedMaintenanceMonths` | int | optional — interval in months |
| `lastMaintenanceId` | int | optional — FK to latest record |
| `nextMaintenanceKm` | int | optional — computed |
| `nextMaintenanceDate` | datetime | optional — computed |
| `createdAt` | datetime | auto |
| `updatedAt` | datetime | auto |

#### Table: `maintenance_records`

Defined in `Backend/app/src/modules/maintenance-records/entities/maintenance-record.entity.ts`

| Column | Type | Notes |
| ------ | ---- | ----- |
| `id` | int | PK, auto-increment |
| `carId` | int | FK → `cars.id` (CASCADE) |
| `itemId` | int | FK → `items.id` (CASCADE) |
| `maintenanceDate` | datetime | when the service happened |
| `kmCounter` | int | car odometer reading |
| `itemCost` | real | cost of the item/part |
| `extraCosts` | JSON | optional array of `{ name, cost }` |
| `notes` | text | optional |
| `createdAt` | datetime | auto |
| `updatedAt` | datetime | auto |

API responses for maintenance records include a computed `totalCost` field (`itemCost` + sum of `extraCosts`).

### API Endpoints

All list endpoints return a paginated envelope:

```json
{
  "data": [ /* ... */ ],
  "meta": {
    "page": 1,
    "limit": 10,
    "totalItems": 42,
    "totalPages": 5,
    "hasPreviousPage": false,
    "hasNextPage": true
  }
}
```

**Shared query params** (via `PageOptionsDto`):

| Param | Type | Default | Description |
| ----- | ---- | ------- | ----------- |
| `page` | int | `1` | Page number (min 1) |
| `limit` | int | `10` | Items per page (1–50) |
| `order` | `ASC` \| `DESC` | `ASC` | Sort direction |
| `search` | string | — | Full-text search |
| `sortBy` | string | — | Field to sort by |

#### Cars — `/cars`

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| POST | `/cars` | Create a car |
| GET | `/cars` | List cars (paginated) |
| GET | `/cars/:id` | Get one car |
| PATCH | `/cars/:id` | Update a car |
| DELETE | `/cars/:id` | Delete a car (cascades items & records) |

**Create body:** `plateNumber`, `brand`, `model`, `year`, `currentKm?`

#### Items — `/items`

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| POST | `/items` | Create item (`multipart/form-data`, optional `photo`) |
| GET | `/items` | List items (paginated) |
| GET | `/items/:id` | Get one item |
| PATCH | `/items/:id` | Update item (`multipart/form-data`, optional `photo`) |
| DELETE | `/items/:id` | Delete item (cascades records) |

**Extra query param:** `carId` — filter items by car

**Create body:** `carId`, `name`, `description?`, `serialNumber?`, `installedDate?`, `installedKm?`, `expectedMaintenanceKm?`, `expectedMaintenanceMonths?`

#### Maintenance Records — `/maintenance-records`

| Method | Endpoint | Description |
| ------ | -------- | ----------- |
| POST | `/maintenance-records` | Create a maintenance record |
| GET | `/maintenance-records` | List records (paginated) |
| GET | `/maintenance-records/:id` | Get one record |
| PATCH | `/maintenance-records/:id` | Update a record |
| DELETE | `/maintenance-records/:id` | Delete a record |

**Extra query params:** `carId`, `itemId`

**Create body:** `carId`, `itemId`, `maintenanceDate`, `kmCounter`, `itemCost`, `extraCosts?` (`[{ name, cost }]`), `notes?`

### Switching to PostgreSQL / MySQL

1. Install the driver:

   ```bash
   cd Backend/app
   npm install pg          # PostgreSQL
   # or
   npm install mysql2      # MySQL
   ```

2. Update `Backend/app/src/app.module.ts`:

   ```typescript
   TypeOrmModule.forRoot({
     type: 'postgres',       // or 'mysql'
     host: 'localhost',
     port: 5432,
     username: 'postgres',
     password: 'password',
     database: 'car_maintenance',
     autoLoadEntities: true,
     synchronize: true,
   }),
   ```

Entities, services, and controllers stay the same.

---

## Frontend

### Tech & Tooling

| Tool | Version | Purpose |
| ---- | ------- | ------- |
| Angular CLI | 19.2 | Scaffolding, dev server, build |
| Angular | 19.2 | Standalone components, routing, forms |
| TypeScript | 5.7 | Strict mode enabled |
| Tailwind CSS | 3.4 | Utility-first styling |
| DaisyUI | 4.12 | UI component plugin (themes disabled; custom palette) |
| PostCSS + Autoprefixer | — | CSS processing |
| `@tailwindcss/typography` | 0.5 | Prose/typography utilities |
| Karma + Jasmine | — | Unit tests |
| RxJS | 7.8 | Reactive data streams |

### Configuration Files

| File | Purpose |
| ---- | ------- |
| `angular.json` | Build/serve/test targets; output to `dist/frontend` |
| `tsconfig.json` | Strict TS + Angular compiler options (`ES2022`, bundler resolution) |
| `tailwind.config.js` | Custom color palette, Inter/Montserrat fonts, DaisyUI plugin, dark mode via `class` |
| `postcss.config.js` | Tailwind + Autoprefixer pipeline |
| `.editorconfig` | Editor formatting defaults |

### Application Architecture

```
Frontend/src/app/
├── app.config.ts              # Global config, HttpClient, ErrorInterceptor, Toast providers
├── app.routes.ts              # Route definitions
├── core/
│   ├── interceptors/          # ErrorInterceptor
│   ├── layouts/
│   │   ├── admin-layout/      # Responsive shell (sidebar + header + router-outlet)
│   │   ├── header/            # Search, dark mode toggler, user profile
│   │   └── sidebar/           # Dashboard, Cars navigation
│   └── services/
│       ├── api-http.service.ts    # Centralized HTTP request client
│       ├── car.service.ts         # Vehicle CRUD & photo upload
│       ├── item.service.ts        # Part/component CRUD & photo upload
│       ├── maintenance.service.ts # Service record CRUD & extra costs
│       ├── dashboard.service.ts   # Summary stats & recent event logs
│       ├── theme.service.ts       # Reactive dark/light mode state & persistence
│       └── notification.service.ts# Global toast notification dispatcher
├── features/
│   ├── dashboard/             # Stats cards + recent maintenance table
│   ├── cars/
│   │   ├── car-list/          # Vehicles list with grid view
│   │   ├── car-form/          # Add / edit vehicle with photo upload
│   │   └── car-details/       # Vehicle summary + installed items data table
│   ├── items/
│   │   └── item-form/         # Add / edit item with photo upload
│   └── maintenance/
│       ├── event-list/        # Service history data table per item
│       └── event-form/        # Add / edit maintenance record with dynamic extra costs
└── shared/
    ├── models/                # Car, Item, MaintenanceEvent, PageMeta, ApiModels
    └── components/
        ├── stat-card/         # Metric summary card
        ├── table/             # DataTableComponent & SortHeaderComponent
        ├── pagination/        # Responsive PaginationComponent
        ├── image-modal/       # Lightbox image preview modal
        ├── toast/             # Toast notification container
        └── empty-state/       # Empty placeholder component
```

All components are **standalone** (no NgModules). Styling uses Tailwind utility classes and responsive breakpoints.

### Routes

| Path | Component | Description |
| ---- | --------- | ----------- |
| `/dashboard` | DashboardComponent | Home — stats overview & recent events |
| `/cars` | CarListComponent | List all cars |
| `/cars/add` | CarFormComponent | Register a new car |
| `/cars/:id` | CarDetailsComponent | Car details and installed items table |
| `/cars/:id/edit` | CarFormComponent | Edit car details |
| `/cars/:id/items/add` | ItemFormComponent | Add item to car |
| `/cars/:carId/items/:itemId/edit` | ItemFormComponent | Edit item details |
| `/cars/:carId/items/:itemId/events` | EventListComponent | Maintenance history table |
| `/cars/:carId/items/:itemId/events/add` | EventFormComponent | Log new service event |
| `/cars/:carId/items/:itemId/events/:eventId/edit` | EventFormComponent | Edit service record |

All routes render inside `AdminLayoutComponent` (sidebar + header). Unknown paths redirect to `/dashboard`.

### Shared Models (`shared/models/models.ts`)

These TypeScript interfaces mirror the backend schema:

| Interface | Key fields |
| --------- | ---------- |
| `Car` | `id`, `plateNumber`, `brand`, `model`, `year`, `currentKm`, `photoPath?` |
| `Item` | `id`, `carId`, `name`, `manufacturer?`, `description?`, `installedKm?`, `expectedMaintenanceKm?`, `expectedMaintenanceMonths?`, `nextMaintenanceKm?`, `photoPath?` |
| `MaintenanceEvent` | `id`, `carId`, `itemId`, `maintenanceDate`, `kmCounter`, `itemCost`, `extraCosts[]`, `totalCost`, `notes?` |
| `ExtraCost` | `name`, `cost` |
| `DashboardStats` | `totalCars`, `totalItems`, `itemsReplacedLastMonth`, `itemsReplacedLastYear`, `costSpentLastMonth`, `costSpentLastYear` |

### NPM Scripts

| Command | Description |
| ------- | ----------- |
| `npm start` | Dev server at `http://localhost:4200` |
| `npm run build` | Production build → `dist/frontend/` |
| `npm run watch` | Dev build with file watching |
| `npm test` | Run Karma unit tests |

---

## Roadmap

- [x] Wire Angular services to the NestJS API (`HttpClient`)
- [x] Server-side pagination & multi-column interactive sorting
- [x] Full mobile & multi-device responsiveness overhaul
- [x] Dark / Light mode toggle with local storage persistence
- [ ] JWT authentication
- [ ] Maintenance reminders (notify when km/date threshold is reached)
- [ ] Cost analytics charts & reports
- [ ] Export records as CSV/PDF
- [ ] Docker support
- [ ] Cloud storage for photos (S3 / Cloudinary)
- [ ] Environment-based API URL configuration
