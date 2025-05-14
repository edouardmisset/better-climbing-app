import { oc as orpcContract } from '@orpc/contract'
import { z } from 'zod'
import * as ascents from './ascents'

export const contract = {
  ascents,
  healthCheck: orpcContract
    .route({ method: 'GET', path: '/check' })
    .output(z.string()),
  privateData: orpcContract.route({ method: 'GET', path: '/private' }).output(
    z.object({
      message: z.string(),
      user: z.object({
        id: z.string(),
        name: z.string(),
        email: z.string(),
      }),
    }),
  ),
}
