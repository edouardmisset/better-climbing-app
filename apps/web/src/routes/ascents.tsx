import type { Ascent } from '@repo/db-schema/schema/ascent'

export function Ascents({ ascents }: { ascents: Ascent[] }) {
  return (
    <div>
      {ascents.map(ascent => (
        <span key={ascent.id}>{ascent.routeName}</span>
      ))}
    </div>
  )
}
