import { getAscentsFromGS } from '@repo/google-sheets/ascent'
import { getTrainingSessionsFromDB as getTrainingSessionsFromGS } from '@repo/google-sheets/training'
import { db } from '../index'
import { ascent } from './schema/ascent'
import { trainingSession } from './schema/training'

// Load all the ascents from google sheets
// Load all the training sessions from Google Sheets
const ascentsFromGS = await getAscentsFromGS()
const trainingSessionsFromGS = await getTrainingSessionsFromGS()

// Transform the data to fit the database schemas
const ascentsToDB = ascentsFromGS.map(ascent => {
  const { discipline, points, id, ...rest } = ascent
  return {
    ...rest,
    discipline,
    points: points ?? fromAscentToPoints(ascent),
  }
})

const trainingSessionsToDB = trainingSessionsFromGS.map(
  ({ id, discipline, sessionType, gymCrag, ...rest }) => ({
    discipline,
    location: gymCrag,
    type: sessionType,
    ...rest,
  }),
)

// Erase all the data in the database
await db.delete(ascent)
await db.delete(trainingSession)

// Insert the data into the database
await db.insert(ascent).values(ascentsToDB)
await db.insert(trainingSession).values(trainingSessionsToDB)
