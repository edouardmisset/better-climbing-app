import { orpcServer, protectedProcedure, publicProcedure } from '../lib/orpc'
import * as ascents from './ascents'

export const router = orpcServer.router({
  healthCheck: publicProcedure.healthCheck.handler(() => 'OK'),
  privateData: protectedProcedure.privateData.handler(({ context }) => ({
    message: 'This is private',
    user: context.session?.user,
  })),
  ascents,
})
export type AppRouter = typeof router
