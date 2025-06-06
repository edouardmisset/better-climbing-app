import { ALL_VALUE } from '@/constants/generic'
import { capitalize } from '@edouardmisset/text'
import type { ChangeEventHandler } from 'react'
import styles from './custom-select.module.css'

type CustomSelectProps = {
  handleChange: ChangeEventHandler<HTMLSelectElement>
  selectedOption: string
  options: string[] | number[] | readonly string[]
  name: string
  title?: string
}

export function CustomSelect(props: CustomSelectProps) {
  const {
    handleChange,
    selectedOption,
    options,
    name,
    title = capitalize(name),
  } = props

  return (
    <label className={styles.label} htmlFor={name} title={title}>
      {capitalize(name)}
      <select
        id={name}
        title={selectedOption === ALL_VALUE ? title : selectedOption}
        onChange={handleChange}
        value={selectedOption}
        className={styles.select}
      >
        <option value={ALL_VALUE}>{capitalize(ALL_VALUE)}</option>
        {options.map(option => (
          <option key={option} value={option} title={String(option)}>
            {option}
          </option>
        ))}
      </select>
    </label>
  )
}
