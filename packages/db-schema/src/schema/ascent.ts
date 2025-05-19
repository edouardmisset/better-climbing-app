import { sql } from 'drizzle-orm'
import { integer, sqliteTable as table, text } from 'drizzle-orm/sqlite-core'
import {
  type BuildRefine,
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema,
} from 'drizzle-zod'
import type { z } from 'zod'
import {
  ASCENT_STYLE,
  DISCIPLINE,
  HOLDS,
  PROFILES,
  _GRADES,
} from '../constants/ascent'

export const ascent = table('ascent', {
  id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }).unique(),
  area: text({ mode: 'text' }),
  comments: text({ mode: 'text' }),
  crag: text({ mode: 'text' }).notNull(),
  date: text('date').default(sql`(CURRENT_DATE)`).notNull(),
  discipline: text({ enum: DISCIPLINE }).notNull(),
  height: integer({ mode: 'number' }),
  holds: text({ enum: HOLDS }),
  personalGrade: text('personal_grade', { enum: _GRADES }),
  points: integer({ mode: 'number' }).notNull(),
  profile: text({ enum: PROFILES }),
  rating: integer({ mode: 'number' }),
  region: text({ mode: 'text' }),
  routeName: text('route_name', { mode: 'text' }).notNull(),
  style: text({ enum: ASCENT_STYLE }).notNull(),
  topoGrade: text('topo_grade', { enum: _GRADES }).notNull(),
  tries: integer({ mode: 'number' }).notNull(),
})

const ascentSchemaRefinements: BuildRefine<(typeof ascent)['_']['columns']> = {
  area: schema => schema.optional(),
  comments: schema => schema.optional(),
  crag: schema => schema.min(1),
  date: schema => schema.transform(date => new Date(date).toISOString()),
  height: schema => schema.int().min(0).optional(),
  holds: schema => schema.optional(),
  id: schema => schema.int().min(0),
  personalGrade: schema => schema,
  points: schema => schema.int().min(0),
  profile: schema => schema.optional(),
  rating: schema => schema.int().min(0).max(5).optional(),
  region: schema => schema.optional(),
  routeName: schema => schema.min(1),
  style: schema => schema,
  topoGrade: schema => schema,
  tries: schema => schema.int().min(1),
} as const

export const ascentSelectSchema = createSelectSchema(
  ascent,
  ascentSchemaRefinements,
)

export type Ascent = z.infer<typeof ascentSelectSchema>

export const ascentInsertSchema = createInsertSchema(
  ascent,
  ascentSchemaRefinements,
)

export type AscentInsert = z.infer<typeof ascentInsertSchema>

export const ascentUpdateSchema = createUpdateSchema(
  ascent,
  ascentSchemaRefinements,
)

export type AscentUpdate = z.infer<typeof ascentUpdateSchema>
