import { displayGrade } from '@/helpers/display-grade'
import type { Ascent } from '@repo/db-schema/schema/ascent'
import { AscentCard } from '../ascent-card/ascent-card'
import AscentDialog from './_components/ascent-dialog'
import styles from './ascent-component.module.css'

export function AscentComponent({
  ascent,
  showGrade = false,
}: { ascent: Ascent; showGrade?: boolean }) {
  const { topoGrade, discipline, routeName } = ascent
  return (
    <AscentDialog
      triggerText={`${routeName} ${showGrade ? `(${displayGrade({ grade: topoGrade, discipline })})` : ''}`}
      triggerClassName={styles.trigger}
      content={<AscentCard ascent={ascent} />}
    />
  )
}
