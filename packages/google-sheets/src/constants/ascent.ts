import { z } from 'zod'

export const HOLDS_FROM_GS = [
  'Positive',
  'Jug',
  'Sloper',
  'Pocket',
  'Pinch',
  'Crimp',
  'Volume',
  'Crack',
  'Bi',
  'Mono',
  'Various',
  'Undercling',
] as const

export const holdsFomGSSchema = z.enum(HOLDS_FROM_GS)
