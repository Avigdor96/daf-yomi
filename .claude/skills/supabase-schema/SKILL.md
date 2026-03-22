---
name: supabase-schema
description: Use this skill when working with the database layer of the "הש"ס שלי" project. Covers Drizzle ORM schema definitions, Supabase PostgreSQL setup, NextAuth adapter tables, and the user_progress table. Trigger when creating or modifying database schemas, writing queries, setting up migrations, or configuring the Supabase connection.
---

# Supabase + Drizzle ORM Setup

## Connection

```typescript
// src/lib/db/index.ts
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL!;
const client = postgres(connectionString);
export const db = drizzle(client, { schema });
```

## Schema

The project uses Drizzle ORM with the `drizzle-orm/pg-core` dialect.

### NextAuth Required Tables

NextAuth's Drizzle adapter requires these tables: `users`, `accounts`, `sessions`, `verificationTokens`. Use the official adapter schema from `@auth/drizzle-adapter`.

### Application Table

```typescript
// src/lib/db/schema.ts
import { pgTable, text, integer, timestamp, serial, unique, index } from 'drizzle-orm/pg-core';

// NextAuth tables (from @auth/drizzle-adapter)
export { users, accounts, sessions, verificationTokens } from '@auth/drizzle-adapter/pg';

// Application-specific
export const userProgress = pgTable('user_progress', {
  id: serial('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  masechetId: text('masechet_id').notNull(),
  daf: integer('daf').notNull(),
  learnedAt: timestamp('learned_at').defaultNow().notNull(),
}, (table) => ({
  userMasechetDaf: unique().on(table.userId, table.masechetId, table.daf),
  userIdx: index('user_progress_user_idx').on(table.userId),
  userMasechetIdx: index('user_progress_user_masechet_idx').on(table.userId, table.masechetId),
}));
```

### Key Design Decisions

1. **Sparse storage**: Only store learned dapim (INSERT on learn, DELETE on unlearn). A user with 500 learned dapim = 500 rows.
2. **`learnedAt` timestamp**: Enables streak calculation, recent activity, and analytics.
3. **Cascade delete**: If a user is deleted, their progress is cleaned up automatically.
4. **Composite unique constraint**: Prevents duplicate entries for the same user+masechet+daf.

## Common Queries

### Get all progress for a user
```typescript
import { eq } from 'drizzle-orm';

const progress = await db.select()
  .from(userProgress)
  .where(eq(userProgress.userId, userId));
```

### Toggle a daf (learn/unlearn)
```typescript
import { and, eq } from 'drizzle-orm';

// Check if exists
const existing = await db.select()
  .from(userProgress)
  .where(and(
    eq(userProgress.userId, userId),
    eq(userProgress.masechetId, masechetId),
    eq(userProgress.daf, daf),
  ))
  .limit(1);

if (existing.length > 0) {
  // Unlearn
  await db.delete(userProgress)
    .where(and(
      eq(userProgress.userId, userId),
      eq(userProgress.masechetId, masechetId),
      eq(userProgress.daf, daf),
    ));
} else {
  // Learn
  await db.insert(userProgress)
    .values({ userId, masechetId, daf });
}
```

### Get progress for a specific masechet
```typescript
const masechetProgress = await db.select()
  .from(userProgress)
  .where(and(
    eq(userProgress.userId, userId),
    eq(userProgress.masechetId, masechetId),
  ));
```

### Calculate streak (consecutive days with at least one daf learned)
```typescript
import { desc, sql } from 'drizzle-orm';

const recentDays = await db.select({
  day: sql<string>`DATE(${userProgress.learnedAt})`.as('day'),
})
  .from(userProgress)
  .where(eq(userProgress.userId, userId))
  .groupBy(sql`DATE(${userProgress.learnedAt})`)
  .orderBy(desc(sql`DATE(${userProgress.learnedAt})`));
```

## Drizzle Config

```typescript
// drizzle.config.ts
import type { Config } from 'drizzle-kit';

export default {
  schema: './src/lib/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config;
```

## Environment Variables

```
DATABASE_URL=postgresql://postgres:[password]@db.[project-ref].supabase.co:5432/postgres
```

## Migration Commands

```bash
npx drizzle-kit generate  # Generate migration files
npx drizzle-kit push      # Push schema directly (dev)
npx drizzle-kit migrate   # Run migrations (prod)
```
