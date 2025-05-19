import { type SQL, and, eq } from 'drizzle-orm'
import { z } from 'zod'
import { db } from '../index'
import {
  type TrainingSession,
  type TrainingSessionInsert,
  trainingSession,
  trainingSessionSelectSchema,
} from '../schema/training'

export const optionalTrainingFilterSchema = z
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

export async function getTrainingSessions(options: OptionalTrainingFilter) {
  const {
    anatomicalRegion,
    discipline,
    energySystem,
    location,
    intensity,
    load,
    type,
    volume,
    year,
  } = options ?? {}

  const filters: SQL[] = []

  if (anatomicalRegion != null)
    filters.push(eq(trainingSession.anatomicalRegion, anatomicalRegion))
  if (discipline != null)
    filters.push(eq(trainingSession.discipline, discipline))
  if (energySystem != null)
    filters.push(eq(trainingSession.energySystem, energySystem))
  if (location != null) filters.push(eq(trainingSession.location, location))
  if (intensity != null) filters.push(eq(trainingSession.intensity, intensity))
  if (load != null) filters.push(eq(trainingSession.load, load))
  if (type != null) filters.push(eq(trainingSession.type, type))
  if (volume != null) filters.push(eq(trainingSession.volume, volume))

  const filteredSessions = await db
    .select()
    .from(trainingSession)
    .where(and(...filters))

  return year == null
    ? filteredSessions
    : filteredSessions.filter(
        session => new Date(session.date).getFullYear() === year,
      )
}

export async function insertTrainingSession(
  ...sessions: TrainingSessionInsert[]
) {
  return await db.insert(trainingSession).values(sessions).returning()
}

export async function getTrainingSessionById(id: TrainingSession['id']) {
  return await db
    .select()
    .from(trainingSession)
    .where(eq(trainingSession.id, id))
    .limit(1)
}
