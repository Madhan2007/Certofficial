/**
 * Applies every SQL file in supabase/migrations (in filename order), then
 * supabase/seed.sql, against DATABASE_URL.
 *
 *   DATABASE_URL="postgresql://postgres:...@db.<ref>.supabase.co:5432/postgres" \
 *     npm run db:apply
 *
 * Use the direct database host (port 5432) or the session pooler (port 5432)
 * from Supabase → Connect. Transaction pooler (port 6543) will not work for
 * multi-statement DDL.
 */
import { readdir, readFile } from "node:fs/promises";
import fs from "node:fs";
import path from "node:path";

import { Client } from "pg";

const root = process.cwd();

// Load .env.local if present
try {
  const envLocal = fs.readFileSync(path.join(root, ".env.local"), "utf8");
  for (const line of envLocal.split("\n")) {
    const match = line.match(/^([A-Za-z_0-9]+)=(.*)$/);
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2].trim();
    }
  }
} catch {
  // ignore if file doesn't exist
}

async function run(client: Client, file: string, sql: string) {
  process.stdout.write(`→ ${file} (${(sql.length / 1024).toFixed(1)} kB) … `);
  const started = Date.now();
  await client.query(sql);
  process.stdout.write(`ok ${Date.now() - started}ms\n`);
}

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    console.error(
      "DATABASE_URL is not set. Copy it from Supabase → Connect → Session pooler.",
    );
    process.exit(1);
  }

  const client = new Client({
    connectionString: url,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();
  try {
    await client.query("set statement_timeout = 0");

    const dir = path.join(root, "supabase", "migrations");
    const files = (await readdir(dir)).filter((f) => f.endsWith(".sql")).sort();
    for (const file of files) {
      const sql = await readFile(path.join(dir, file), "utf8");
      await run(client, `migrations/${file}`, sql);
    }

    const seedPath = path.join(root, "supabase", "seed.sql");
    const seed = await readFile(seedPath, "utf8");
    await run(client, "seed.sql", seed);

    const { rows } = await client.query<{
      categories: string;
      providers: string;
      exams: string;
      offers: string;
      leads: string;
    }>(`
      select
        (select count(*) from categories)::text as categories,
        (select count(*) from providers)::text as providers,
        (select count(*) from exams)::text as exams,
        (select count(*) from offers)::text as offers,
        (select count(*) from leads)::text as leads
    `);
    console.table(rows[0]);
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error("\nFailed:", error instanceof Error ? error.message : error);
  process.exit(1);
});
