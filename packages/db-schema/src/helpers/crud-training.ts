import { type SQL, and, eq } from 'drizzle-orm'
import { db } from '../../index'
import {
  type OptionalTrainingFilter,
  type TrainingSession,
  type TrainingSessionInsert,
  trainingSessionTable,
} from '../schema/training'

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
    filters.push(eq(trainingSessionTable.anatomicalRegion, anatomicalRegion))
  if (discipline != null)
    filters.push(eq(trainingSessionTable.discipline, discipline))
  if (energySystem != null)
    filters.push(eq(trainingSessionTable.energySystem, energySystem))
  if (location != null)
    filters.push(eq(trainingSessionTable.location, location))
  if (intensity != null)
    filters.push(eq(trainingSessionTable.intensity, intensity))
  if (load != null) filters.push(eq(trainingSessionTable.load, load))
  if (type != null) filters.push(eq(trainingSessionTable.type, type))
  if (volume != null) filters.push(eq(trainingSessionTable.volume, volume))

  const filteredSessions = await db
    .select()
    .from(trainingSessionTable)
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
  return await db.insert(trainingSessionTable).values(sessions).returning()
}

export async function getTrainingSessionById(id: TrainingSession['id']) {
  return await db
    .select()
    .from(trainingSessionTable)
    .where(eq(trainingSessionTable.id, id))
    .limit(1)
}
