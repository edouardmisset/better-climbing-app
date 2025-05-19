import { oc as orpcContract } from '@orpc/contract'
import {
  ascentQueryParams,
  optionalAscentFilterSchema,
} from '@repo/db-schema/helpers/ascent'
import {
  ascentInsertSchema,
  ascentSelectSchema,
} from '@repo/db-schema/schema/ascent'

export const list = orpcContract
  .route({ method: 'GET', path: '/ascents' })
  .input(optionalAscentFilterSchema)
  .output(ascentSelectSchema.array())

export const search = orpcContract
  .route({ method: 'GET', path: '/ascents/search' })
  .input(ascentQueryParams)
  .output(ascentSelectSchema.array())

export const findById = orpcContract
  .route({ method: 'GET', path: '/ascents/{id}' })
  .input(ascentSelectSchema.pick({ id: true }))
  .output(ascentSelectSchema.optional())

export const create = orpcContract
  .route({ method: 'POST', path: '/ascents', successStatus: 201 })
  .input(ascentInsertSchema)
  .output(ascentSelectSchema)
