import { createORPCClient } from '@orpc/client'
import type { ContractRouterClient } from '@orpc/contract'
import type { JsonifiedClient } from '@orpc/openapi-client'
import { OpenAPILink } from '@orpc/openapi-client/fetch'
import { createORPCReactQueryUtils } from '@orpc/react-query'
import type { RouterUtils } from '@orpc/react-query'
import { QueryCache, QueryClient } from '@tanstack/react-query'
import { createContext, use } from 'react'
import { toast } from 'sonner'
import { contract } from '../../../server/src/contracts/contract'

type ContractClient = JsonifiedClient<ContractRouterClient<typeof contract>>

type ORPCReactUtils = RouterUtils<ContractClient>

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: error => {
      toast.error(`Error: ${error.message}`, {
        action: {
          label: 'retry',
          onClick: () => {
            queryClient.invalidateQueries()
          },
        },
      })
    },
  }),
})

export const link = new OpenAPILink(contract, {
  url: `${import.meta.env.VITE_SERVER_URL}/rpc`,
  fetch(url, options) {
    return fetch(url, {
      ...options,
      credentials: 'include',
    })
  },
})

export const client: JsonifiedClient<ContractRouterClient<typeof contract>> =
  createORPCClient(link)

export const orpc = createORPCReactQueryUtils(client)

export const ORPCContext = createContext<ORPCReactUtils | undefined>(undefined)

export function useORPC(): ORPCReactUtils {
  const orpc = use(ORPCContext)
  if (!orpc) {
    throw new Error('ORPCContext is not set up properly')
  }
  return orpc
}
