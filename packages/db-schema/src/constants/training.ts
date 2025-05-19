export const SESSION_TYPES = [
  'Out',

  'En',
  'PE',
  'SE',

  'MS',
  'Po',
  'CS',

  'Ta',
  'St',
  'Sk',

  'Ro',
  'Sg',
  'Co',
  'FB',
] as const

export const SESSION_TYPES_TO_TEXT = {
  Out: 'Outdoor',

  En: 'Endurance',
  PE: 'Power Endurance',
  SE: 'Strength Endurance',

  MS: 'Max Strength',
  Po: 'Power',
  CS: 'Contact Strength',

  Ta: 'Tapper',
  St: 'Stamina',
  Sk: 'Skill',

  Ro: 'Routine',
  Sg: 'Stretching',
  Co: 'Core',
  FB: 'Finger Boarding',
} as const satisfies Record<(typeof SESSION_TYPES)[number], string>

export const ANATOMICAL_REGIONS = ['Ar', 'Fi', 'Ge'] as const

export const ANATOMICAL_REGIONS_TO_TEXT = {
  Ar: 'Arms',
  Fi: 'Fingers',
  Ge: 'General',
} as const satisfies Record<(typeof ANATOMICAL_REGIONS)[number], string>
