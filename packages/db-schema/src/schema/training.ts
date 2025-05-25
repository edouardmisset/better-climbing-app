import { sql } from 'drizzle-orm'
import { integer, sqliteTable as table, text } from 'drizzle-orm/sqlite-core'
import {
  type BuildRefine,
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod'
import { z } from 'zod/v4'
import { DISCIPLINE } from '../constants/ascent'
import {
  ANATOMICAL_REGIONS,
  ANATOMICAL_REGIONS_TO_TEXT,
  SESSION_TYPES,
  SESSION_TYPES_TO_TEXT,
} from '../constants/training'

export const percentSchema = z.number().int().min(0).max(100)

export function fromSessionTypeToLabel(
  sessionType: (typeof SESSION_TYPES)[number],
) {
  return SESSION_TYPES_TO_TEXT[sessionType]
}

export function fromAnatomicalRegionToLabel(
  anatomicalRegion: (typeof ANATOMICAL_REGIONS)[number],
) {
  return ANATOMICAL_REGIONS_TO_TEXT[anatomicalRegion]
}

export const ENERGY_SYSTEMS = ['AA', 'AL', 'AE'] as const

const ENERGY_SYSTEMS_TO_TEXT = {
  AA: 'Anaerobic Alactic',
  AL: 'Anaerobic Lactic',
  AE: 'Aerobic',
} as const satisfies Record<(typeof ENERGY_SYSTEMS)[number], string>

export function fromEnergySystemToLabel(
  energySystem: (typeof ENERGY_SYSTEMS)[number],
) {
  return ENERGY_SYSTEMS_TO_TEXT[energySystem]
}

export const LOAD_CATEGORIES = ['High', 'Medium', 'Low'] as const
export type LoadCategory = (typeof LOAD_CATEGORIES)[number]

const _sessionTypeSchema = z.enum(SESSION_TYPES)
const _energySystemSchema = z.enum(ENERGY_SYSTEMS)
const _anatomicalRegionSchema = z.enum(ANATOMICAL_REGIONS)

export const trainingSessionTable = table('training_session', {
  id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }).unique(),
  anatomicalRegion: text('anatomical_region', { enum: ANATOMICAL_REGIONS }),
  discipline: text('discipline', { enum: DISCIPLINE }),
  comments: text('comments'),
  date: text('date').notNull().default(sql`(CURRENT_DATE)`),
  energySystem: text('energy_system', { enum: ENERGY_SYSTEMS }),
  location: text('location'),
  intensity: integer('intensity'),
  load: integer('load'),
  type: text('type', { enum: SESSION_TYPES }),
  volume: integer('volume'),
})

const trainingSessionRefinements: BuildRefine<
  (typeof trainingSessionTable)['_']['columns'],
  undefined
> = {
  anatomicalRegion: schema => schema.optional(),
  discipline: schema => schema.optional(),
  comments: schema => schema.optional(),
  date: schema => schema.transform(date => new Date(date).toISOString()),
  energySystem: schema => schema.optional(),
  location: schema => schema.optional(),
  intensity: schema => schema.int().min(0).max(100).optional(),
  load: schema => schema.int().min(0).max(100).optional(),
  type: schema => schema.optional(),
  volume: schema => schema.int().min(0).max(100).optional(),
  id: schema => schema.int().min(0),
}

export const trainingSessionSelectSchema = createSelectSchema(
  trainingSessionTable,
  trainingSessionRefinements,
)

export type TrainingSession = z.infer<typeof trainingSessionSelectSchema>

export const trainingSessionInsertSchema = createInsertSchema(
  trainingSessionTable,
  trainingSessionRefinements,
)

export type TrainingSessionInsert = z.infer<typeof trainingSessionInsertSchema>

export const trainingSessionUpdateSchema = createUpdateSchema(
  trainingSessionTable,
  trainingSessionRefinements,
)

export type TrainingSessionUpdate = z.infer<typeof trainingSessionUpdateSchema>

export const optionalTrainingFilterSchema = trainingSessionSelectSchema
  .pick({
    type: true,
    discipline: true,

    location: true,

    anatomicalRegion: true,
    energySystem: true,

    load: true,
    intensity: true,
    volume: true,
  })
  .extend({
    year: z.number().int().optional(),
  })
  .partial()
  .optional()

export type OptionalTrainingFilter = z.infer<
  typeof optionalTrainingFilterSchema
>
