import {
  BOULDERING_BONUS_POINTS,
  GRADE_TO_POINTS,
  STYLE_TO_POINTS,
} from '@repo/db-schema/constants/ascent'
import type { Ascent } from '@repo/db-schema/schema/ascent'
import { assert, describe, it } from 'poku'
import { fromAscentToPoints, fromPointToGrade } from './ascent-converter'

const DEFAULT_GRADE = '1a'

const onsight7a = {
  area: 'Wig Wam',
  discipline: 'Route',
  comments: 'À la fois superbe grimpe et passage terrifiant. ',
  crag: 'Ewige Jagdgründe',
  date: '2024-10-27T12:00:00.000Z',
  height: 25,
  holds: 'Crimp',
  personalGrade: '6c+',
  profile: 'Arête',
  rating: 4,
  routeName: 'Black Knight',
  style: 'Onsight',
  topoGrade: '7a',
  tries: 1,
  region: 'Hautes-Alpes',
  points: 850,
  id: 1,
} satisfies Ascent

const redpoint7b = {
  area: 'Envers du canyon',
  discipline: 'Route',
  comments: 'Dur :(',
  crag: 'Rue des masques',
  date: '2023-08-01T12:00:00.000Z',
  height: 25,
  holds: 'Pocket',
  personalGrade: '7b+',
  profile: 'Overhang',
  rating: 3,
  region: 'Hautes-Alpes',
  routeName: 'Flash dans ta gueule',
  style: 'Redpoint',
  topoGrade: '7b',
  points: 800,
  tries: 2,
  id: 2,
} satisfies Ascent
const flash7aBoulder = {
  area: 'Franchard Hautes Plaines',
  discipline: 'Boulder',
  crag: 'Fontainebleau',
  date: '2023-07-01T12:00:00.000Z',
  holds: 'Sloper',
  personalGrade: '7a',
  profile: 'Arête',
  rating: 4,
  region: 'Seine-et-Marne',
  routeName: 'Bossanova',
  style: 'Flash',
  topoGrade: '7a',
  comments: 'Pas si facile que ça !',
  height: 4,
  points: 800,
  tries: 1,
  id: 25,
} satisfies Ascent

describe('fromAscentToPoints', () => {
  it('should return the sum of grade and style points when both keys exist', () => {
    if (!onsight7a || !redpoint7b || !flash7aBoulder) {
      throw new Error('Ascent not found')
    }

    const result = fromAscentToPoints(onsight7a)
    assert.equal(result, 850)

    const result2 = fromAscentToPoints(redpoint7b)
    assert.equal(result2, 800)

    const result3 = fromAscentToPoints(flash7aBoulder)
    assert.equal(result3, 850)
  })
})

describe('fromPointToGrade', () => {
  it('should convert valid points to the correct grade with default parameters', () => {
    assert.equal(fromPointToGrade(700), '7a')
    assert.equal(fromPointToGrade(800), '7b')
    assert.equal(fromPointToGrade(1000), '8a')
  })

  it('should handle edge cases with minimum and maximum point values', () => {
    const minPoints = Math.min(...Object.values(GRADE_TO_POINTS))
    const minGrade = Object.entries(GRADE_TO_POINTS).find(
      ([_, points]) => points === minPoints,
    )?.[0]
    assert.equal(fromPointToGrade(minPoints), minGrade)

    const maxPoints = Math.max(...Object.values(GRADE_TO_POINTS))
    const maxGrade = Object.entries(GRADE_TO_POINTS).find(
      ([_, points]) => points === maxPoints,
    )?.[0]
    assert.equal(fromPointToGrade(maxPoints), maxGrade)
  })

  it('should adjust points correctly for different climbing disciplines', () => {
    const pointsFor7a = GRADE_TO_POINTS['7a']

    const pointsWith7aBoulderBonus = pointsFor7a + BOULDERING_BONUS_POINTS
    assert.equal(
      fromPointToGrade(pointsWith7aBoulderBonus, {
        discipline: 'Boulder',
      }),
      '7a',
    )
  })

  it('should adjust points correctly for different climbing styles', () => {
    const pointsFor7a = GRADE_TO_POINTS['7a']

    const flashPoints = STYLE_TO_POINTS.Flash
    const pointsWith7aFlash = pointsFor7a + flashPoints
    assert.equal(fromPointToGrade(pointsWith7aFlash, { style: 'Flash' }), '7a')

    const onsightPoints = STYLE_TO_POINTS.Onsight
    const pointsWith7aOnsight = pointsFor7a + onsightPoints
    assert.equal(
      fromPointToGrade(pointsWith7aOnsight, { style: 'Onsight' }),
      '7a',
    )
  })

  it('should combine discipline and style adjustments correctly', () => {
    const pointsFor7a = GRADE_TO_POINTS['7a']
    const flashPoints = STYLE_TO_POINTS.Flash

    const combinedPoints = pointsFor7a + flashPoints + BOULDERING_BONUS_POINTS
    assert.equal(
      fromPointToGrade(combinedPoints, {
        discipline: 'Boulder',
        style: 'Flash',
      }),
      '7a',
    )
  })

  it('should return DEFAULT_GRADE when points do not match any grade', () => {
    const invalidPoints = 123
    assert.equal(fromPointToGrade(invalidPoints), DEFAULT_GRADE)

    assert.equal(fromPointToGrade(-100), DEFAULT_GRADE)

    const veryLargePoints = 10_000
    assert.equal(fromPointToGrade(veryLargePoints), DEFAULT_GRADE)
  })

  it('should handle conversion from real ascent examples', () => {
    const testAscents = [onsight7a, redpoint7b, flash7aBoulder]

    for (const ascent of testAscents) {
      if (ascent) {
        const points = fromAscentToPoints(ascent)
        const convertedGrade = fromPointToGrade(points, {
          discipline: ascent.discipline,
          style: ascent.style,
        })
        assert.equal(convertedGrade, ascent.topoGrade)
      }
    }
  })
})
