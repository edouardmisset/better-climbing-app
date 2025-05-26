import { ALL_VALUE } from '@/constants/generic'
import type { OrAll } from '@/types/generics'
import { isValidNumber } from '@edouardmisset/math'
import { type Ascent, ascentSelectSchema } from '@repo/db-schema/schema/ascent'
import { useQueryState } from 'nuqs'

type UseAscentsQueryStateReturn = {
  selectedYear: OrAll<string>
  selectedDiscipline: OrAll<Ascent['discipline']>
  selectedStyle: OrAll<Ascent['style']>
  selectedCrag: OrAll<Ascent['crag']>
  selectedGrade: OrAll<Ascent['topoGrade']>
  setYear: (year: OrAll<string>) => void
  setDiscipline: (discipline: OrAll<Ascent['discipline']>) => void
  setStyle: (style: OrAll<Ascent['style']>) => void
  setCrag: (crag: OrAll<Ascent['crag']>) => void
  setGrade: (grade: OrAll<Ascent['topoGrade']>) => void
}

export const useAscentsQueryState = (): UseAscentsQueryStateReturn => {
  const [selectedYear, setYear] = useQueryState<OrAll<string>>('year', {
    defaultValue: ALL_VALUE,
    parse: value => {
      if (value === ALL_VALUE) return ALL_VALUE
      if (isValidNumber(Number(value))) return value
      return null
    },
  })
  const [selectedDiscipline, setDiscipline] = useQueryState<
    OrAll<Ascent['discipline']>
  >('discipline', {
    defaultValue: ALL_VALUE,
    parse: value =>
      value === ALL_VALUE
        ? ALL_VALUE
        : ascentSelectSchema.def.shape.discipline.parse(value),
  })
  const [selectedStyle, setStyle] = useQueryState<OrAll<Ascent['style']>>(
    'style',
    {
      defaultValue: ALL_VALUE,
      parse: value =>
        value === ALL_VALUE
          ? ALL_VALUE
          : ascentSelectSchema.def.shape.style.parse(value),
    },
  )
  const [selectedCrag, setCrag] = useQueryState<OrAll<Ascent['crag']>>('crag', {
    defaultValue: ALL_VALUE,
    parse: value => (value === ALL_VALUE ? ALL_VALUE : value),
  })
  const [selectedGrade, setGrade] = useQueryState<OrAll<Ascent['topoGrade']>>(
    'grade',
    {
      defaultValue: ALL_VALUE,
      parse: value =>
        value === ALL_VALUE
          ? ALL_VALUE
          : ascentSelectSchema.def.shape.topoGrade.parse(value),
    },
  )

  return {
    selectedYear,
    selectedDiscipline,
    selectedStyle,
    selectedCrag,
    selectedGrade,
    setYear,
    setDiscipline,
    setStyle,
    setCrag,
    setGrade,
  }
}
