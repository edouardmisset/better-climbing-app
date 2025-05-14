import { db } from '../db'
import { ascent, ascentSelectSchema } from '../db/schema/ascent'
import { publicProcedure } from '../lib/orpc'

export const ascentRouter = {
  getAll: publicProcedure.handler(async () => {
    const ascentFromDB = await db.select().from(ascent)
    const res = await ascentSelectSchema.array().spa(ascentFromDB)

    if (!res.success) {
      console.error('Error parsing ascent data:', res.error)
    }

    return res.data ?? []
  }),
}
