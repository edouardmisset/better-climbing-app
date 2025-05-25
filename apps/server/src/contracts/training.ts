import { oc as orpcContract } from '@orpc/contract'
import { optionalTrainingFilterSchema } from '@repo/db-schema/schema/training'
import {
  trainingSessionInsertSchema,
  trainingSessionSelectSchema,
} from '@repo/db-schema/schema/training'

export const list = orpcContract
  .route({ method: 'GET', path: '/trainings' })
  .input(optionalTrainingFilterSchema)
  .output(trainingSessionSelectSchema.array())

export const findById = orpcContract
  .route({ method: 'GET', path: '/trainings/{id}' })
  .input(trainingSessionSelectSchema.pick({ id: true }))
  .output(trainingSessionSelectSchema.optional())

export const create = orpcContract
  .route({ method: 'POST', path: '/trainings', successStatus: 201 })
  .input(trainingSessionInsertSchema)
  .output(trainingSessionSelectSchema)
