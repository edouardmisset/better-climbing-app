import { getAscentsFromGS } from '@repo/google-sheets/ascent'
import { getTrainingSessionsFromDB as getTrainingSessionsFromGS } from '@repo/google-sheets/training'
import { db } from '../index'
import { ascentTable } from './schema/ascent'
import { trainingSessionTable } from './schema/training'

// Load all the ascents from google sheets
// Load all the training sessions from Google Sheets
const ascentsFromGS = await getAscentsFromGS()
const trainingSessionsFromGS = await getTrainingSessionsFromGS()

// Transform the data to fit the database schemas
const ascentsToDB = ascentsFromGS.map(ascent => {
  const { points, id, ...rest } = ascent
  return {
    ...rest,
    points: points ?? fromAscentToPoints(ascent),
  }
})

const trainingSessionsToDB = trainingSessionsFromGS.map(({ id, ...rest }) => ({
  ...rest,
}))

// Erase all the data in the database
await db.delete(ascentTable)
await db.delete(trainingSessionTable)

// Insert the data into the database
await db.insert(ascentTable).values(ascentsToDB)
await db.insert(trainingSessionTable).values(trainingSessionsToDB)
