import 'dotenv/config'
import { writeFileSync } from 'node:fs'
import { OpenAPIGenerator } from '@orpc/openapi'
import { OpenAPIHandler } from '@orpc/openapi/fetch'
import { OpenAPIReferencePlugin } from '@orpc/openapi/plugins'
import { onError } from '@orpc/server'
import { BatchHandlerPlugin, CORSPlugin } from '@orpc/server/plugins'
import { ZodSmartCoercionPlugin, ZodToJsonSchemaConverter } from '@orpc/zod'
import { auth } from '@repo/db-schema/auth'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { csrf } from 'hono/csrf'
import { etag } from 'hono/etag'
import { logger } from 'hono/logger'
import { timing } from 'hono/timing'
import { trimTrailingSlash } from 'hono/trailing-slash'
import { createContext } from './lib/context'
import { router } from './routers/index'

const ENV = process.env.ENV || 'production'

const app = new Hono()

const specInfo = {
  title: 'Climbing API',
  version: '0.1.0',
}

const handler = new OpenAPIHandler(router, {
  plugins: [
    new CORSPlugin({ exposeHeaders: ['Content-Disposition'] }),
    new ZodSmartCoercionPlugin(),
    new OpenAPIReferencePlugin({
      schemaConverters: [new ZodToJsonSchemaConverter()],
      specGenerateOptions: {
        info: specInfo,
      },
    }),
    new BatchHandlerPlugin(),
  ],
  interceptors: [onError(error => globalThis.console.error(error))],
})

app.use(
  '/*',
  cors({
    origin: process.env.CORS_ORIGIN || '',
    allowMethods: ['GET', 'POST', 'OPTIONS'],
    allowHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }),
  trimTrailingSlash(),
)

app.on(['POST', 'GET'], '/api/auth/**', c => auth.handler(c.req.raw))

app
  .use('/rpc/*', async (c, next) => {
    const context = await createContext({ context: c })
    const { matched, response } = await handler.handle(c.req.raw, {
      prefix: '/rpc',
      context,
    })

    if (matched) return c.newResponse(response.body, response)

    await next()
  })
  .notFound(c => {
    const notFoundMessage = 'Route Not Found'
    globalThis.console.log(notFoundMessage, c.req.url)
    return c.json({ message: notFoundMessage }, 404)
  })

if (ENV === 'production') app.use(etag({ weak: true }), csrf())
if (ENV === 'development') app.use(timing(), logger())

const generator = new OpenAPIGenerator({
  schemaConverters: [new ZodToJsonSchemaConverter()],
})

const spec = await generator.generate(router, {
  info: specInfo,
})

writeFileSync('../openapi.json', JSON.stringify(spec, null, 2))

export default app
