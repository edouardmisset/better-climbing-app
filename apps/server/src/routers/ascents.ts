import { ascentSchema } from '@repo/schema/ascent'
import { db } from '../db'
import { ascent } from '../db/schema/ascent'
import { publicProcedure } from '../lib/orpc'

export const ascentRouter = {
  getAll: publicProcedure.handler(async () => {
    const ascentsFromDB = await db.select().from(ascent)

    return ascentSchema.array().parse(ascentsFromDB)
  }),
}
