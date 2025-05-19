import {
  getTrainingSessionById,
  getTrainingSessions,
  insertTrainingSession,
} from '@repo/db-schema/helpers/training'
import { protectedProcedure, publicProcedure } from '../lib/orpc'

export const list = publicProcedure.trainingSessions.list.handler(
  async ({ input }) => {
    try {
      return await getTrainingSessions(input)
    } catch (error) {
      globalThis.console.log(`Failed to filter training sessions: ${error}`)
      return []
    }
  },
)

export const findById = publicProcedure.trainingSessions.findById.handler(
  async ({ input }) => {
    const foundSessions = await getTrainingSessionById(input.id)

    if (foundSessions === undefined || foundSessions?.[0]) return undefined

    return foundSessions[0]
  },
)

export const create = protectedProcedure.trainingSessions.create.handler(
  async ({ input }) => {
    try {
      const inserted = await insertTrainingSession(input)
      return inserted[0]
    } catch (error) {
      throw new Error(`Failed to add training: ${error}`)
    }
  },
)
