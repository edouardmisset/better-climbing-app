import { createClient } from '@libsql/client'
import 'dotenv/config'
import { drizzle } from 'drizzle-orm/libsql'

const DATABASE_URL = process.env.DATABASE_URL

if (!DATABASE_URL) {
  throw new Error('DATABASE_URL is not defined in the environment variables.')
}

const client = createClient({
  url: DATABASE_URL || '',
  authToken: process.env.DATABASE_AUTH_TOKEN,
})

export const db = drizzle({ client })
