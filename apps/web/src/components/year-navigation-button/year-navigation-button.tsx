import { isValidNumber } from '@edouardmisset/math'
import { ArrowLeftCircleIcon, ArrowRightCircleIcon } from 'lucide-react'
import { Link } from 'react-router'
import styles from './year-navigation-button.module.css'

export function YearNavigationButton({
  selectedYear,
  nextOrPrevious,
  enabled,
  path = '',
}: {
  selectedYear: number
  nextOrPrevious: 'next' | 'previous'
  enabled: boolean
  path?: string
}) {
  if (!(enabled && isValidNumber(selectedYear))) return <span />

  const targetYear =
    nextOrPrevious === 'next' ? selectedYear + 1 : selectedYear - 1
  return (
    <Link
      className={styles.button}
      to={`.${path}/${targetYear}`}
      title={targetYear?.toString() ?? ''}
    >
      {nextOrPrevious === 'next' ? (
        <ArrowRightCircleIcon />
      ) : (
        <ArrowLeftCircleIcon />
      )}
    </Link>
  )
}
