import type { Ascent } from '../schema/ascent'

export const _GRADES = [
  '1a',
  '1a+',
  '1b',
  '1b+',
  '1c',
  '1c+',

  '2a',
  '2a+',
  '2b',
  '2b+',
  '2c',
  '2c+',

  '3a',
  '3a+',
  '3b',
  '3b+',
  '3c',
  '3c+',

  '4a',
  '4a+',
  '4b',
  '4b+',
  '4c',
  '4c+',

  '5a',
  '5a+',
  '5b',
  '5b+',
  '5c',
  '5c+',

  '6a',
  '6a+',
  '6b',
  '6b+',
  '6c',
  '6c+',

  '7a',
  '7a+',
  '7b',
  '7b+',
  '7c',
  '7c+',

  '8a',
  '8a+',
  '8b',
  '8b+',
  '8c',
  '8c+',

  '9a',
  '9a+',
  '9b',
  '9b+',
  '9c',
  '9c+',
] as const

export type Grade = (typeof _GRADES)[number]

export const GRADE_TO_NUMBER = {
  '1a': 1,
  '1a+': 2,
  '1b': 3,
  '1b+': 4,
  '1c': 5,
  '1c+': 6,

  '2a': 7,
  '2a+': 8,
  '2b': 9,
  '2b+': 10,
  '2c': 11,
  '2c+': 12,

  '3a': 13,
  '3a+': 14,
  '3b': 15,
  '3b+': 16,
  '3c': 17,
  '3c+': 18,

  '4a': 19,
  '4a+': 20,
  '4b': 21,
  '4b+': 22,
  '4c': 23,
  '4c+': 24,

  '5a': 25,
  '5a+': 26,
  '5b': 27,
  '5b+': 28,
  '5c': 29,
  '5c+': 30,

  '6a': 31,
  '6a+': 32,
  '6b': 33,
  '6b+': 34,
  '6c': 35,
  '6c+': 36,

  '7a': 37,
  '7a+': 38,
  '7b': 39,
  '7b+': 40,
  '7c': 41,
  '7c+': 42,

  '8a': 43,
  '8a+': 44,
  '8b': 45,
  '8b+': 46,
  '8c': 47,
  '8c+': 48,

  '9a': 49,
  '9a+': 50,
  '9b': 51,
  '9b+': 52,
  '9c': 53,
  '9c+': 54,
} as const satisfies Record<Grade, number>

export const GRADE_TO_POINTS = {
  '5a': 100,
  '5a+': 150,
  '5b': 200,
  '5b+': 250,
  '5c': 300,
  '5c+': 350,

  '6a': 400,
  '6a+': 450,
  '6b': 500,
  '6b+': 550,
  '6c': 600,
  '6c+': 650,

  '7a': 700,
  '7a+': 750,
  '7b': 800,
  '7b+': 850,
  '7c': 900,
  '7c+': 950,

  '8a': 1000,
  '8a+': 1050,
  '8b': 1100,
  '8b+': 1150,
  '8c': 1200,
  '8c+': 1250,

  '9a': 1300,
  '9a+': 1350,
  '9b': 1400,
  '9b+': 1450,
  '9c': 1500,
  '9c+': 1550,
} as const satisfies Partial<Record<Grade, number>>

export const STYLE_TO_POINTS = {
  Redpoint: 0,
  Flash: 50,
  Onsight: 150,
} as const satisfies Record<(typeof ASCENT_STYLE)[number], number>

export const BOULDERING_BONUS_POINTS = 100 as const

export const HOLDS = [
  'Crimp',
  'Jug',
  'Pocket',
  'Sloper',
  'Pinch',
  'Crack',
  'Undercling',
] as const
export const PROFILES = [
  'Vertical',
  'Overhang',
  'Slab',
  'Roof',
  'Arête',
  'Dihedral',
  'Traverse',
] as const
export const DISCIPLINE = ['Route', 'Boulder', 'Multi-Pitch'] as const
export const ASCENT_STYLE = ['Onsight', 'Flash', 'Redpoint'] as const

const UNAVAILABLE_CLIMBING_DISCIPLINE: Set<Ascent['discipline']> = new Set([
  'Multi-Pitch',
])
export const AVAILABLE_CLIMBING_DISCIPLINE = DISCIPLINE.filter(
  d => !UNAVAILABLE_CLIMBING_DISCIPLINE.has(d),
)
