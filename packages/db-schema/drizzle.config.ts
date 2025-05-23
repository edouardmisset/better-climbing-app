import { defineConfig } from 'drizzle-kit'

const DATABASE_URL = process.env.DATABASE_URL

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined in the environment variables.')
}

export default defineConfig({
  schema: './src/schema',
  out: './src/migrations',
  dialect: 'turso',
  dbCredentials: {
    url: DATABASE_URL || '',
    authToken: process.env.DATABASE_AUTH_TOKEN,
  },
})
