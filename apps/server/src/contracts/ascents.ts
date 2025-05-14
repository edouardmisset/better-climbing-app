import { ascentInsertSchema, ascentSelectSchema } from '@/db/schema/ascent'
import { validNumberWithFallback } from '@edouardmisset/math'
import { oc as orpcContract } from '@orpc/contract'
import { z } from 'zod'

export const list = orpcContract
  .route({ method: 'GET', path: '/ascents' })
  // .input(optionalAscentFilterSchema)
  .output(ascentSelectSchema.array())

export const search = orpcContract
  .route({ method: 'GET', path: '/ascents/search' })
  .input(
    z.object({
      query: z.string().min(1),
      limit: z.string().transform(val => validNumberWithFallback(val, 10)),
    }),
  )
  .output(ascentSelectSchema.array())

export const findById = orpcContract
  .route({ method: 'GET', path: '/ascents/{id}' })
  .input(ascentSelectSchema.pick({ id: true }))
  .output(ascentSelectSchema.or(z.undefined()))

export const create = orpcContract
  .route({ method: 'POST', path: '/ascents', successStatus: 201 })
  .input(ascentInsertSchema)
  .output(ascentSelectSchema)
