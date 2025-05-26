import type { ALL_VALUE } from '@/constants/generic'

export type OrAll<T extends string | number> = T | typeof ALL_VALUE

export type StringDate = { date: string }

export type Object_<T = unknown> = Record<string, T>
