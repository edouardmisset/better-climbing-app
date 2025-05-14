import { ORPCError } from '@orpc/server'
import { implement } from '@orpc/server'
import { contract } from '../contracts/contract'
import type { Context } from './context'

export const orpcServer = implement(contract).$context<Context>()

export const publicProcedure = orpcServer

export const requireAuth = orpcServer.middleware(async ({ context, next }) => {
  if (!context.session?.user) {
    throw new ORPCError('UNAUTHORIZED')
  }
  return next({
    context: {
      ...context,
      session: context.session,
    },
  })
})

export const protectedProcedure = publicProcedure.use(requireAuth)
