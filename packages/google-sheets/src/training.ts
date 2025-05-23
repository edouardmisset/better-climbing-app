import {
  type TrainingSession,
  trainingSessionSelectSchema,
} from '@repo/db-schema/schema/training'
import type { GoogleSpreadsheetWorksheet } from 'google-spreadsheet'
import { loadWorksheet } from './google-sheets'
import {
  transformTrainingSessionFromGSToJS,
  transformTrainingSessionFromJSToGS,
} from './helpers/transformers'

/**
 * Retrieves all training sessions from the Google Sheets 'training' worksheet,
 * transforms them from Google Sheets format to JavaScript object format,
 * and validates them against the trainingSession schema.
 *
 * @returns A promise that resolves to an array of TrainingSessions objects.
 */
export async function getTrainingSessionsFromDB(): Promise<TrainingSession[]> {
  let rows:
    | undefined
    | Awaited<ReturnType<GoogleSpreadsheetWorksheet['getRows']>>

  try {
    const allTrainingSessionsSheet = await loadWorksheet('training')
    rows = await allTrainingSessionsSheet.getRows()
  } catch (error) {
    globalThis.console.error(error)
  }

  if (rows === undefined) return []

  const rawTrainingSessions = rows.map((row, index) =>
    Object.assign(transformTrainingSessionFromGSToJS(row.toObject()), {
      id: index,
    }),
  )

  const parsedTrainingSession = trainingSessionSelectSchema
    .array()
    .safeParse(rawTrainingSessions)

  if (!parsedTrainingSession.success) {
    globalThis.console.error(parsedTrainingSession.error)
    return []
  }
  return parsedTrainingSession.data
}

export async function addTrainingSession(
  trainingSession: Omit<TrainingSession, 'id'>,
): Promise<void> {
  const manualTrainingSessionsSheet = await loadWorksheet('training', {
    edit: true,
  })

  const trainingSessionInGS =
    transformTrainingSessionFromJSToGS(trainingSession)

  try {
    await manualTrainingSessionsSheet.addRow(trainingSessionInGS)
    globalThis.console.log(
      `Training session added successfully (${new Date().getUTCMinutes()}):`,
      trainingSessionInGS,
    )
  } catch (error) {
    globalThis.console.error('Error adding training session:', error)
  }
}
