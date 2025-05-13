'use client'

import * as LabelPrimitive from '@radix-ui/react-label'
import type * as React from 'react'

function Label({
  className,
  ...props
}: React.ComponentProps<typeof LabelPrimitive.Root>) {
  return (
    <LabelPrimitive.Root data-slot="label" className={className} {...props} />
  )
}

export { Label }
