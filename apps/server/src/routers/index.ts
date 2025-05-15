import { orpcServer, protectedProcedure, publicProcedure } from '../lib/orpc'
import * as ascents from './ascents'
import * as trainingSessions from './training'

export const router = orpcServer.router({
  healthCheck: publicProcedure.healthCheck.handler(() => 'OK'),
  privateData: protectedProcedure.privateData.handler(({ context }) => ({
    message: 'This is private',
    user: context.session?.user,
  })),
  ascents,
  trainingSessions,
})
export type AppRouter = typeof router
