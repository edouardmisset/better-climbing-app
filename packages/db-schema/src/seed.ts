import { fromAscentToPoints } from '@/helpers/ascent-converter'
import { getAscentsFromGS } from '@/services/ascents'
import { getTrainingSessionsFromDB as getTrainingSessionsFromGS } from '@/services/training'
import { db } from '.'
import { ascent } from './schema/ascent'
import { trainingSession } from './schema/training'

// Load all the ascents from google sheets
// Load all the training sessions from Google Sheets
const ascentsFromGS = await getAscentsFromGS()
const trainingSessionsFromGS = await getTrainingSessionsFromGS()

// Transform the data to fit the database schemas
const ascentsToDB = ascentsFromGS.map(ascent => {
  const { climbingDiscipline, points, id, ...rest } = ascent
  return {
    ...rest,
    discipline: climbingDiscipline,
    points: points ?? fromAscentToPoints(ascent),
  }
})

const trainingSessionsToDB = trainingSessionsFromGS.map(
  ({ id, climbingDiscipline, sessionType, gymCrag, ...rest }) => ({
    discipline: climbingDiscipline,
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
