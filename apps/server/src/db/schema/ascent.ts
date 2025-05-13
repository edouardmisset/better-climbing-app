import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const ascent = sqliteTable('ascent', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  area: text('area'),
  discipline: text('discipline', {
    enum: ['bouldering', 'sport', 'multi-pitch', 'DWS'],
  }).notNull(),
  crag: text('crag').notNull(),
  date: integer({ mode: 'timestamp' }).notNull(), // Date
  comments: text('comments'),
  region: text('region'),
  height: integer('height'),
  topoGrade: text('topoGrade').notNull(),
  personalGrade: text('personalGrade'),
  rating: integer('rating'),
  routeName: text('route_name').notNull(),
  style: text('style', {
    enum: ['onsight', 'flash', 'redpoint'],
  }).notNull(),
  tries: integer('tries').notNull(),
})
