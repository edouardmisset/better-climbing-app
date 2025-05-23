import type { Ascent } from '@repo/db-schema/schema/ascent'
import { assert, describe, it } from 'poku'
import { displayGrade } from './display-grade'

describe('displayGrade', () => {
  it('should return uppercase grade for Bouldering (e.g., 7a -> 7A)', () => {
    const ascentDetails = {
      topoGrade: '7a',
      discipline: 'Boulder',
    } as const satisfies Pick<Ascent, 'topoGrade' | 'discipline'>
    assert.strictEqual(
      displayGrade({
        grade: ascentDetails.topoGrade,
        discipline: ascentDetails.discipline,
      }),
      '7A',
    )
  })

  it('should return uppercase grade for Bouldering (e.g., 5c -> 5C)', () => {
    const ascentDetails = {
      topoGrade: '5c',
      discipline: 'Boulder',
    } as const satisfies Pick<Ascent, 'topoGrade' | 'discipline'>
    assert.strictEqual(
      displayGrade({
        grade: ascentDetails.topoGrade,
        discipline: ascentDetails.discipline,
      }),
      '5C',
    )
  })

  it('should return grade as is for Route (e.g., 7a -> 7a)', () => {
    const ascentDetails = {
      topoGrade: '7a',
      discipline: 'Route',
    } as const satisfies Pick<Ascent, 'topoGrade' | 'discipline'>
    assert.strictEqual(
      displayGrade({
        grade: ascentDetails.topoGrade,
        discipline: ascentDetails.discipline,
      }),
      '7a',
    )
  })

  it('should return grade as is for Route (e.g., 6b+ -> 6b+)', () => {
    const ascentDetails = {
      topoGrade: '6b+',
      discipline: 'Route',
    } as const satisfies Pick<Ascent, 'topoGrade' | 'discipline'>
    assert.strictEqual(
      displayGrade({
        grade: ascentDetails.topoGrade,
        discipline: ascentDetails.discipline,
      }),
      '6b+',
    )
  })

  it('should return grade as is for Multi-Pitch (e.g., 8a -> 8a)', () => {
    const ascentDetails = {
      topoGrade: '8a',
      discipline: 'Multi-Pitch',
    } as const satisfies Pick<Ascent, 'topoGrade' | 'discipline'>
    assert.strictEqual(
      displayGrade({
        grade: ascentDetails.topoGrade,
        discipline: ascentDetails.discipline,
      }),
      '8a',
    )
  })
})
