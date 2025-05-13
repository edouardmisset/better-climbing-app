import { NavLink } from 'react-router'

import { ModeToggle } from './mode-toggle'
import UserMenu from './user-menu'

export default function Header() {
  const links = [
    { to: '/', label: 'Home' },
    { to: '/ascents', label: 'Ascents' },
    { to: '/dashboard', label: 'Dashboard' },
  ]

  return (
    <div>
      <div>
        <nav>
          {links.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => (isActive ? 'font-bold' : '')}
              end
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <div>
          <ModeToggle />
          <UserMenu />
        </div>
      </div>
      <hr />
    </div>
  )
}
