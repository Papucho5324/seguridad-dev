import 'dotenv/config'
import { defineConfig } from 'prisma/config'

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  // Cambiamos env("DATABASE_URL") por process.env.DATABASE_URL
  datasource: {
    url: process.env.DATABASE_URL!, 
  },
});