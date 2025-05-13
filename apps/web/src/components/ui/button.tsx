import { Slot } from '@radix-ui/react-slot'
import type * as React from 'react'

function Button({
  className,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> & {
  asChild?: boolean
}) {
  const Comp = asChild ? Slot : 'button'

  return <Comp data-slot="button" {...props} />
}

export { Button }
