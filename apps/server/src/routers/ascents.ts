import {
  getAscentById,
  getFilteredAscents,
  insertAscent,
  searchAscents,
} from '@repo/db-schema/helpers/ascent'
import { protectedProcedure, publicProcedure } from '../lib/orpc'

export const list = publicProcedure.ascents.list.handler(async ({ input }) => {
  try {
    return await getFilteredAscents(input)
  } catch (error) {
    globalThis.console.log(`Failed to filter ascents: ${error}`)
    return []
  }
})

export const search = publicProcedure.ascents.search.handler(
  async ({ input }) => {
    return await searchAscents(input)
  },
)

export const findById = publicProcedure.ascents.findById.handler(
  async ({ input }) => {
    const foundAscents = await getAscentById(input.id)

    if (foundAscents === undefined || foundAscents?.[0]) return undefined

    return foundAscents[0]
  },
)

export const create = protectedProcedure.ascents.create.handler(
  async ({ input }) => {
    try {
      const inserted = await insertAscent(input)
      return inserted[0]
    } catch (error) {
      throw new Error(`Failed to add ascent: ${error}`)
    }
  },
)
