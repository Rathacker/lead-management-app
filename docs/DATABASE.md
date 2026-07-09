# Database Schema

PostgreSQL, managed by Prisma. The authoritative definition lives in
[`server/prisma/schema.prisma`](../server/prisma/schema.prisma); migrations are in
`server/prisma/migrations/`. Apply them with `npx prisma migrate deploy`.

## Entity overview

```
User 1───1 Settings
Lead  (standalone)
```

## Tables

### `User`
The authenticated account(s). One admin user is seeded by default.

| Column         | Type         | Notes                    |
| -------------- | ------------ | ------------------------ |
| `id`           | text (uuid)  | Primary key              |
| `email`        | text         | Unique                   |
| `passwordHash` | text         | bcrypt hash              |
| `createdAt`    | timestamp    | Defaults to now          |

### `Settings`
Per-user preferences, persisted so they survive across sessions and devices.

| Column                | Type      | Default   | Notes                          |
| --------------------- | --------- | --------- | ------------------------------ |
| `id`                  | text uuid | —         | Primary key                    |
| `userId`              | text      | —         | Unique, FK → `User.id` (cascade) |
| `theme`               | text      | `light`   | `light` \| `dark`              |
| `pageSize`            | integer   | `5`       | Rows per page                  |
| `showAvatars`         | boolean   | `true`    | Show initials in the table     |
| `confirmBeforeDelete` | boolean   | `true`    | Require a delete confirmation  |
| `updatedAt`           | timestamp | —         | Auto-updated                   |

### `Lead`
The sales leads.

| Column      | Type          | Default | Notes                                             |
| ----------- | ------------- | ------- | ------------------------------------------------- |
| `id`        | text (uuid)   | —       | Primary key                                       |
| `name`      | text          | —       | Required                                          |
| `company`   | text          | null    |                                                   |
| `email`     | text          | null    |                                                   |
| `phone`     | text          | null    |                                                   |
| `source`    | text          | null    | Aggregated for the "leads by source" report       |
| `status`    | `LeadStatus`  | `NEW`   | Enum (below); indexed                              |
| `notes`     | text          | null    |                                                   |
| `createdAt` | timestamp     | now     | List is ordered by this, descending               |
| `updatedAt` | timestamp     | —       | Auto-updated                                      |

Indexes: `Lead(status)` and `Lead(name)` to keep status filtering and name
search efficient.

### `LeadStatus` enum

```
NEW · CONTACTED · QUALIFIED · WON · LOST
```

## Initial migration SQL

```sql
CREATE TYPE "LeadStatus" AS ENUM ('NEW', 'CONTACTED', 'QUALIFIED', 'WON', 'LOST');

CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Settings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "theme" TEXT NOT NULL DEFAULT 'light',
    "pageSize" INTEGER NOT NULL DEFAULT 5,
    "showAvatars" BOOLEAN NOT NULL DEFAULT true,
    "confirmBeforeDelete" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Settings_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Lead" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "company" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "source" TEXT,
    "status" "LeadStatus" NOT NULL DEFAULT 'NEW',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Lead_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "Settings_userId_key" ON "Settings"("userId");
CREATE INDEX "Lead_status_idx" ON "Lead"("status");
CREATE INDEX "Lead_name_idx" ON "Lead"("name");

ALTER TABLE "Settings" ADD CONSTRAINT "Settings_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
```
