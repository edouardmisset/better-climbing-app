import {
  trainingSessionInsertSchema,
  trainingSessionSelectSchema,
} from '@/db/schema/training'
import { oc as orpcContract } from '@orpc/contract'
import { z } from 'zod'

const optionalTrainingFilterSchema = z
  .object({
    type: trainingSessionSelectSchema.shape.type.optional(),
    discipline: trainingSessionSelectSchema.shape.discipline.optional(),

    year: z.number().int().optional(),
    location: trainingSessionSelectSchema.shape.location.optional(),

    anatomicalRegion:
      trainingSessionSelectSchema.shape.anatomicalRegion.optional(),
    energySystem: trainingSessionSelectSchema.shape.energySystem.optional(),

    load: trainingSessionSelectSchema.shape.load.optional(),
    intensity: trainingSessionSelectSchema.shape.intensity.optional(),
    volume: trainingSessionSelectSchema.shape.volume.optional(),
  })
  .optional()

export type OptionalTrainingFilter = z.infer<
  typeof optionalTrainingFilterSchema
>

export const list = orpcContract
  .route({ method: 'GET', path: '/trainings' })
  .input(optionalTrainingFilterSchema)
  .output(trainingSessionSelectSchema.array())

export const findById = orpcContract
  .route({ method: 'GET', path: '/trainings/{id}' })
  .input(trainingSessionSelectSchema.pick({ id: true }))
  .output(trainingSessionSelectSchema.or(z.undefined()))

export const create = orpcContract
  .route({ method: 'POST', path: '/trainings', successStatus: 201 })
  .input(trainingSessionInsertSchema)
  .output(trainingSessionSelectSchema)
