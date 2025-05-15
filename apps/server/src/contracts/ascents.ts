import { ascentInsertSchema, ascentSelectSchema } from '@/db/schema/ascent'
import { validNumberWithFallback } from '@edouardmisset/math'
import { oc as orpcContract } from '@orpc/contract'
import { z } from 'zod'

const optionalAscentFilterSchema = z
  .object({
    discipline: ascentSelectSchema.shape.discipline.optional(),
    crag: ascentSelectSchema.shape.crag.optional(),
    topoGrade: ascentSelectSchema.shape.topoGrade.optional(),
    height: ascentSelectSchema.shape.height.optional(),
    holds: ascentSelectSchema.shape.holds.optional(),
    profile: ascentSelectSchema.shape.profile.optional(),
    style: ascentSelectSchema.shape.style.optional(),
    tries: ascentSelectSchema.shape.tries.optional(),
    rating: ascentSelectSchema.shape.rating.optional(),
    year: z.number().int().optional(),
  })
  .optional()

export type OptionalAscentFilter = z.infer<typeof optionalAscentFilterSchema>

export const list = orpcContract
  .route({ method: 'GET', path: '/ascents' })
  .input(optionalAscentFilterSchema)
  .output(ascentSelectSchema.array())

const ascentQueryParams = z.object({
  query: z.string().min(1),
  limit: z.string().transform(val => validNumberWithFallback(val, 10)),
})
export type AscentQueryParams = z.infer<typeof ascentQueryParams>

export const search = orpcContract
  .route({ method: 'GET', path: '/ascents/search' })
  .input(ascentQueryParams)
  .output(ascentSelectSchema.array())

export const findById = orpcContract
  .route({ method: 'GET', path: '/ascents/{id}' })
  .input(ascentSelectSchema.pick({ id: true }))
  .output(ascentSelectSchema.or(z.undefined()))

export const create = orpcContract
  .route({ method: 'POST', path: '/ascents', successStatus: 201 })
  .input(ascentInsertSchema)
  .output(ascentSelectSchema)
