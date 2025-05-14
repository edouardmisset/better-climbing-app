import { db } from '@/db'
import { ascent } from '@/db/schema/ascent'
import { eq, like } from 'drizzle-orm'
import { orpcServer } from '../lib/orpc'

export const list = orpcServer.ascents.list.handler(async () => {
  return await db.select().from(ascent)
})

export const search = orpcServer.ascents.search.handler(async ({ input }) => {
  return await db
    .select()
    .from(ascent)
    .where(like(ascent.routeName, input.query))
    .limit(input.limit)
})

export const findById = orpcServer.ascents.findById.handler(
  async ({ input }) => {
    const foundAscents = await db
      .select()
      .from(ascent)
      .where(eq(ascent.id, input.id))

    if (foundAscents === undefined || foundAscents?.[0]) return undefined

    return foundAscents[0]
  },
)

export const create = orpcServer.ascents.create.handler(async ({ input }) => {
  try {
    const inserted = await db.insert(ascent).values(input).returning()
    return inserted[0]
  } catch (error) {
    throw new Error(`Failed to add ascent: ${error}`)
  }
})
