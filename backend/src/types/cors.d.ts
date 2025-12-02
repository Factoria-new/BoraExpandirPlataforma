declare module 'cors' {
  import { IncomingMessage, ServerResponse } from 'http'
  import { RequestHandler } from 'express'

  interface CorsOptions {
    origin?: boolean | string | RegExp | (string | RegExp)[] | ((origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => void)
    methods?: string | string[]
    allowedHeaders?: string | string[]
    exposedHeaders?: string | string[]
    credentials?: boolean
    maxAge?: number
    preflightContinue?: boolean
    optionsSuccessStatus?: number
  }

  interface Cors {
    (options?: CorsOptions): RequestHandler
    (request: IncomingMessage, response: ServerResponse, callback: (err: Error | null, options?: CorsOptions) => void): void
  }

  const cors: Cors
  export = cors
}
