import type { Ascent } from '@repo/db-schema/ascent'

export function Ascents({ ascents }: { ascents: Ascent[] }): React.JSX.Element {
  return (
    <div>
      {ascents.map(ascent => (
        <span key={ascent.id}>{ascent.routeName}</span>
      ))}
    </div>
  )
}
