import { db } from '@/db'
import { filterAscents } from '@/db/helpers/filter-ascents'
import { ascent } from '@/db/schema/ascent'
import { eq, like } from 'drizzle-orm'
import { protectedProcedure, publicProcedure } from '../lib/orpc'

export const list = publicProcedure.ascents.list.handler(async ({ input }) => {
  try {
    return await filterAscents(input)
  } catch (error) {
    globalThis.console.log(`Failed to filter ascents: ${error}`)
    return []
  }
})

export const search = publicProcedure.ascents.search.handler(
  async ({ input }) => {
    return await db
      .select()
      .from(ascent)
      .where(like(ascent.routeName, input.query))
      .limit(input.limit)
  },
)

export const findById = publicProcedure.ascents.findById.handler(
  async ({ input }) => {
    const foundAscents = await db
      .select()
      .from(ascent)
      .where(eq(ascent.id, input.id))

    if (foundAscents === undefined || foundAscents?.[0]) return undefined

    return foundAscents[0]
  },
)

export const create = protectedProcedure.ascents.create.handler(
  async ({ input }) => {
    try {
      const inserted = await db.insert(ascent).values(input).returning()
      return inserted[0]
    } catch (error) {
      throw new Error(`Failed to add ascent: ${error}`)
    }
  },
)
