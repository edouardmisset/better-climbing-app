import { protectedProcedure, publicProcedure } from '../lib/orpc'
import { ascentRouter } from './ascents'
import { todoRouter } from './todo'

export const appRouter = {
  healthCheck: publicProcedure.handler(() => 'OK'),
  privateData: protectedProcedure.handler(({ context }) => ({
    message: 'This is private',
    user: context.session?.user,
  })),
  todo: todoRouter,
  ascents: ascentRouter,
}
export type AppRouter = typeof appRouter
