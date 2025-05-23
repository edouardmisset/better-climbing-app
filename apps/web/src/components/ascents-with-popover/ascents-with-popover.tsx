import { displayGrade } from '@/helpers/display-grade'
import { writeAscentsDisciplineText } from '@/helpers/write-ascents-discipline-text'
import { capitalize, wrapInParentheses } from '@edouardmisset/text'
import type { Ascent } from '@repo/db-schema/schema/ascent'
import { Popover } from '../popover/popover'
import styles from './ascents-with-popover.module.css'

export function AscentsWithPopover({
  ascents,
}: { ascents: Ascent[] }): React.JSX.Element {
  const ascentsDisciplineText = writeAscentsDisciplineText(ascents)
  return (
    <Popover
      popoverDescription={
        <div className={styles.popoverContainer}>
          {ascents.map(({ id, routeName, topoGrade, discipline }) => (
            <span
              key={id}
            >{`${routeName} ${wrapInParentheses(displayGrade({ grade: topoGrade, discipline }))}`}</span>
          ))}
        </div>
      }
      popoverTitle={capitalize(ascentsDisciplineText)}
      triggerContent={
        <span>
          <strong>{ascents.length}</strong> {ascentsDisciplineText}
        </span>
      }
      triggerClassName={styles.popover}
    />
  )
}
