import { NavLink } from 'react-router'

import { ModeToggle } from './mode-toggle'
import UserMenu from './user-menu'

export default function Header() {
  const links = [
    { to: '/', label: 'Home' },
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/todos', label: 'Todos' },
    { to: '/ai', label: 'AI Chat' },
  ]

  return (
    <div>
      <div>
        <nav>
          {links.map(({ to, label }) => {
            return (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) => (isActive ? 'font-bold' : '')}
                end
              >
                {label}
              </NavLink>
            )
          })}
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
