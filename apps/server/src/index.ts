import 'dotenv/config'
import { OpenAPIHandler } from '@orpc/openapi/fetch'
import { OpenAPIReferencePlugin } from '@orpc/openapi/plugins'
import { BatchHandlerPlugin, CORSPlugin } from '@orpc/server/plugins'
import { ZodSmartCoercionPlugin, ZodToJsonSchemaConverter } from '@orpc/zod'
import { Hono } from 'hono'
import { compress } from 'hono/compress'
import { cors } from 'hono/cors'
import { csrf } from 'hono/csrf'
import { etag } from 'hono/etag'
import { logger } from 'hono/logger'
import { timing } from 'hono/timing'
import { trimTrailingSlash } from 'hono/trailing-slash'
import { auth } from './lib/auth'
import { createContext } from './lib/context'
import { router } from './routers/index'

const ENV = process.env.NODE_ENV || 'production'

const app = new Hono()

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

const handler = new OpenAPIHandler(router, {
  plugins: [
    new CORSPlugin({ exposeHeaders: ['Content-Disposition'] }),
    new ZodSmartCoercionPlugin(),
    new OpenAPIReferencePlugin({
      schemaConverters: [new ZodToJsonSchemaConverter()],
      specGenerateOptions: {
        info: {
          title: 'Climbing API',
          version: '0.1.0',
        },
      },
    }),
    new BatchHandlerPlugin(),
  ],
})
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
  // .get('/', c => {
  //   return c.text('OK')
  // })
  .notFound(c => {
    const notFoundMessage = 'Route Not Found'
    globalThis.console.log(notFoundMessage, c.req.url)
    return c.json({ message: notFoundMessage }, 404)
  })

if (ENV === 'production') app.use(etag({ weak: true }), csrf(), compress())
if (ENV === 'dev') app.use(timing(), logger())

export default app
