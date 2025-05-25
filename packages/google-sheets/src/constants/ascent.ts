import { z } from 'zod/v4'

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

export const holdsFromGSSchema = z.enum(HOLDS_FROM_GS)
