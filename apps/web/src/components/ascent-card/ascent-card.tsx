import { displayGrade } from '@/helpers/display-grade'
import {
  formatComments,
  formatCragAndArea,
  formatHeight,
  formatHolds,
  formatProfile,
  formatRating,
  formatStyleAndTriers,
  fromClimbingDisciplineToEmoji,
  prettyLongDate,
} from '@/helpers/formatters'
import { wrapInParentheses } from '@edouardmisset/text'
import type { Ascent } from '@repo/db-schema/schema/ascent'
import { type CSSProperties, useMemo } from 'react'
import styles from './ascent-card.module.css'

export function AscentCard({ ascent }: { ascent: Ascent }) {
  const {
    area,
    discipline,
    comments,
    crag,
    date,
    height,
    holds,
    profile,
    rating,
    routeName,
    style,
    topoGrade,
    tries,
  } = ascent

  const stylesDependingOnComments: CSSProperties = useMemo(
    () =>
      comments && comments.length > 120
        ? ({ '--direction': 'row' } as CSSProperties)
        : ({ '--direction': 'column' } as CSSProperties),
    [comments],
  )

  const formattedGrade = displayGrade({
    grade: topoGrade,
    discipline,
  })
  return (
    <div className={styles.card}>
      <h2
        className={`${styles.header} text-no-wrap`}
        title={`${routeName} ${formattedGrade}`}
      >{`${fromClimbingDisciplineToEmoji(discipline)} ${routeName} ${wrapInParentheses(formattedGrade)}`}</h2>
      <div className={styles.content}>
        <div className={styles.placeAndTime}>
          <time>{prettyLongDate(date)}</time>
          <span>{formatCragAndArea(crag, area, { showDetails: true })}</span>
        </div>
        <div className={styles.details} style={stylesDependingOnComments}>
          {[
            formatStyleAndTriers({
              style,
              tries,
              options: { showDetails: true },
            }),
            formatHeight(height),
            formatProfile(profile),
            formatHolds(holds),
            formatRating(rating),
          ]
            .filter(Boolean)
            .map(formattedContent => (
              <span className="text-no-wrap" key={formattedContent}>
                {formattedContent}
              </span>
            ))}
        </div>
        <p>{formatComments(comments)}</p>
      </div>
    </div>
  )
}
