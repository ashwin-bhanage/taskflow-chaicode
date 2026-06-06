# TaskFlow - Personal Task Manager

A full-stack Next.js application demonstrating modern web development concepts including server-side rendering, API routes, server actions, and database integration.

## Project Overview

**TaskFlow** is a productivity application that helps users organize and track their tasks efficiently. The project showcases essential Next.js concepts taught in class including file-based routing, layouts, server-side rendering, incremental static regeneration, API routes, and server actions.

## Tech Stack

| Technology   | Version | Purpose                        |
| ------------ | ------- | ------------------------------ |
| Next.js      | 16.2.7  | React framework with SSR & ISR |
| React        | 19.2.4  | UI library                     |
| TypeScript   | 5       | Type-safe JavaScript           |
| Prisma       | 7.8.0   | Database ORM                   |
| PostgreSQL   | -       | Relational database            |
| Tailwind CSS | 4       | Utility-first styling          |

## Features

### Core Functionality

- ✅ **Create Tasks** - Add tasks with title, description, priority, and due date
- ✅ **View Tasks** - List all tasks sorted by priority and creation date
- ✅ **Update Tasks** - Edit task details or change status
- ✅ **Delete Tasks** - Remove completed or unwanted tasks
- ✅ **Task Status** - Manage workflow: Pending → In Progress → Completed
- ✅ **Priority Levels** - Organize by importance: Low, Medium, High
- ✅ **Analytics Dashboard** - View completion statistics and progress
- ✅ **Public Stats** - Share aggregate task data

## Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **PostgreSQL** 12+ (local or remote)

### Installation & Setup

1. **Clone the repository**

    ```bash
    git clone <your-repo-url>
    cd taskflow-project
    ```

2. **Install dependencies**

    ```bash
    npm install
    ```

3. **Configure environment variables**

    ```bash
    cp .env.example .env.local
    ```

    Edit `.env.local` and add your PostgreSQL connection string:

    ```env
    DATABASE_URL="postgresql://user:password@localhost:5432/taskflow"
    ```

4. **Setup database**

    ```bash
    # Run migrations
    npx prisma migrate deploy

    # Generate Prisma client
    npx prisma generate
    ```

5. **Start development server**

    ```bash
    npm run dev
    ```

    Open [http://localhost:3000](http://localhost:3000) in your browser.

6. **Build for production**
    ```bash
    npm run build
    npm run start
    ```

## Project Structure

```
taskflow-project/
├── app/                          # Next.js app directory
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home page
│   ├── dashboard/               # Dashboard section
│   │   ├── layout.tsx          # Dashboard layout
│   │   └── page.tsx            # Analytics dashboard
│   ├── tasks/                   # Tasks section
│   │   ├── page.tsx            # Task list
│   │   ├── [id]/page.tsx       # Task detail
│   │   └── new/page.tsx        # Create task
│   ├── public-stats/            # Public statistics
│   └── api/                     # API routes
│       └── tasks/
│           ├── route.ts         # GET, POST
│           └── [id]/route.ts    # PATCH, DELETE
├── components/                   # React components
│   ├── task-form.tsx           # Task creation/edit form
│   ├── task-list.tsx           # Task list display
│   └── ...
├── actions/                     # Server actions
│   └── tasks.ts                # Task mutations
├── lib/                         # Utilities
│   └── prisma.ts               # Prisma client
├── prisma/                      # Database
│   ├── schema.prisma           # Database schema
│   └── migrations/             # Database migrations
└── public/                      # Static assets
```

## Environment Variables

```env
# Database connection
DATABASE_URL=postgresql://[user]:[password]@[host]:[port]/[database]
```

## Routes & Pages

| Route           | Rendering | Purpose                                  |
| --------------- | --------- | ---------------------------------------- |
| `/`             | SSG       | Home page with introduction              |
| `/about`        | SSG       | About information                        |
| `/dashboard`    | SSR       | Analytics and statistics (force-dynamic) |
| `/tasks`        | SSR       | All tasks list (force-dynamic)           |
| `/tasks/[id]`   | SSR       | Individual task detail (force-dynamic)   |
| `/tasks/new`    | SSG       | Create new task form                     |
| `/public-stats` | SSR       | Public statistics (force-dynamic)        |

## API Endpoints

### Tasks API

**GET** `/api/tasks`

- Fetch all tasks
- Response: `{ success: true, data: Task[] }`

**POST** `/api/tasks`

- Create a new task
- Body: `{ title: string, description?: string, status?: string }`
- Response: `{ success: true, data: Task }`

**PATCH** `/api/tasks/[id]`

- Update task details
- Body: `{ title?: string, description?: string, status?: string }`
- Response: `{ success: true, data: Task }`

**DELETE** `/api/tasks/[id]`

- Delete a task
- Response: `{ success: true, message: string }`

All responses include error handling:

```json
{ "success": false, "error": "Error message" }
```

## Server Actions

Server Actions in `actions/tasks.ts` handle direct database mutations:

```typescript
// Create task
await createTaskAction(title, description?, priority?, dueDate?)

// Update task
await updateTaskAction(id, { title, description?, priority?, dueDate? })

// Update status only
await updateTaskStatusAction(id, status)

// Delete task
await deleteTaskAction(id)
```

Each action:

- Uses `"use server"` directive
- Returns `{ success: boolean, data?: T, error?: string }`
- Triggers `revalidatePath()` for automatic cache updates

## Rendering Strategies

### Server-Side Rendering (SSR)

**Pages:** Dashboard, Tasks, Task Detail, Public Stats

```typescript
export const dynamic = "force-dynamic";
```

- Queries database on **every request**
- Ensures **real-time** task data
- Displays accurate statistics and counts
- Best for: Dynamic, user-specific content

### Static Site Generation (SSG)

**Pages:** Home, About, Task Form

- Generated at **build time**
- Served from **cache** (fastest)
- Best for: Static content that rarely changes

### Incremental Static Regeneration (ISR)

**Implementation:** Server Actions with `revalidatePath()`

- Cached pages revalidate when data changes
- Triggered by: Create, Update, Delete operations
- Revalidated paths: `/tasks`, `/dashboard`, `/public-stats`

## Database Schema

### Task Model

```prisma
model Task {
  id          String       @id @default(cuid())
  title       String
  description String?
  status      TaskStatus   @default(PENDING)
  priority    TaskPriority @default(MEDIUM)
  dueDate     DateTime?
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
}

enum TaskStatus {
  PENDING
  IN_PROGRESS
  COMPLETED
}

enum TaskPriority {
  LOW
  MEDIUM
  HIGH
}
```

## Key Concepts Covered

### Next.js Fundamentals

- ✅ **File-based Routing** - Routes from directory structure
- ✅ **Layouts** - Nested layouts for UI hierarchy
- ✅ **Dynamic Routes** - `[id]` pattern for parameters
- ✅ **Server Components** - Default in Next.js App Router

### Rendering Strategies

- ✅ **SSR** - `force-dynamic` for real-time data
- ✅ **SSG** - Static pages generated at build time
- ✅ **ISR** - Cache revalidation via `revalidatePath()`

### API & Data Handling

- ✅ **API Routes** - RESTful endpoints with proper HTTP methods
- ✅ **Server Actions** - Direct server mutations from client
- ✅ **Database Integration** - Prisma ORM with PostgreSQL
- ✅ **Error Handling** - Structured responses with validation

### Code Quality

- ✅ **TypeScript** - Full type safety
- ✅ **Separation of Concerns** - API routes vs Server Actions
- ✅ **Environment Variables** - Secure configuration
- ✅ **Meaningful Error Messages** - User-friendly feedback

## API Routes vs Server Actions

| Aspect                 | API Routes                            | Server Actions                    |
| ---------------------- | ------------------------------------- | --------------------------------- |
| **When to Use**        | Public APIs, third-party integrations | Form submissions, page mutations  |
| **HTTP Methods**       | GET, POST, PATCH, DELETE              | N/A (direct function calls)       |
| **Response Type**      | JSON only                             | Any type                          |
| **Cache Revalidation** | Manual                                | Automatic with `revalidatePath()` |
| **Use Case**           | `/api/tasks` - fetch from JavaScript  | Create task from form submission  |

## Limitations & Future Enhancements

### Current Limitations

- No user authentication
- No pagination (loads all tasks)
- No search/advanced filtering
- Single-user environment

### Potential Improvements

- Add user authentication (Clerk, Auth0)
- Implement pagination for scalability
- Search and filter by title/status/priority
- Task categories and projects
- Recurring tasks and subtasks
- Task collaboration and comments
- Email notifications for due dates

## Deployment

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Connect repository to [Vercel](https://vercel.com)
3. Set environment variables in Vercel dashboard
4. Deploy automatically on push

```bash
# Or deploy via CLI
npm install -g vercel
vercel
```

## Troubleshooting

**"DATABASE_URL is not set"**

- Ensure `.env.local` exists with valid `DATABASE_URL`

**"Can't reach database server"**

- Verify PostgreSQL is running
- Check connection string format
- Test with: `psql <DATABASE_URL>`

**"Prisma migrations pending"**

- Run: `npx prisma migrate deploy`

**Port 3000 already in use**

- Use different port: `npm run dev -- -p 3001`

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma ORM Guide](https://www.prisma.io/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## License

MIT
