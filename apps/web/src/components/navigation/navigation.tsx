import { Menu } from '@base-ui-components/react/menu'
import { MenuIcon } from 'lucide-react'
import { NavLink } from 'react-router'
import { Arrow } from '../svg/arrow/arrow'
import styles from './navigation.module.css'

export function Navigation(): React.JSX.Element {
  return (
    <nav className={styles.nav}>
      {/* Desktop full menu - visible by CSS when viewport is wide */}
      <ul className={styles.navList}>
        <li>
          <NavLink end to={'/'}>
            🏠 Home
          </NavLink>
        </li>
        <hr className={styles.Break} />
        <li>
          <NavLink end to="/log-ascent">
            📋 Log Ascent
          </NavLink>
        </li>
        <li>
          <NavLink end to="/log-training-session">
            📋 Log Training
          </NavLink>
        </li>
        <hr className={styles.Break} />
        <li>
          <NavLink end to="/visualization">
            🖼️ Visualization
          </NavLink>
        </li>
        <li>
          <NavLink end to="/ascents">
            📇 Ascents List
          </NavLink>
        </li>
        <li>
          <NavLink end to="/ascents/top-ten">
            🔟 Top Ten
          </NavLink>
        </li>
        <li>
          <NavLink end to="/ascents/dashboard">
            📊 Dashboard
          </NavLink>
        </li>
        <hr className={styles.Break} />
        <li>
          <NavLink end to="/training-sessions">
            📇 Training List
          </NavLink>
        </li>
      </ul>

      {/* Mobile hamburger menu */}
      <div className={styles.mobileMenu}>
        <Menu.Root openOnHover={true}>
          <Menu.Trigger
            className={styles.Button}
            aria-label="navigation"
            tabIndex={0}
          >
            <MenuIcon />
          </Menu.Trigger>
          <Menu.Portal>
            <Menu.Positioner className={styles.Positioner} sideOffset={8}>
              <Menu.Popup className={styles.Popup}>
                <Menu.Arrow className={styles.Arrow}>
                  <Arrow />
                </Menu.Arrow>
                <Menu.Item className={styles.Item}>
                  <NavLink end to="/">
                    🏠 Home
                  </NavLink>
                </Menu.Item>
                <Menu.Item className={styles.Item}>
                  <NavLink end to="/log-ascent">
                    📋 Log Ascent
                  </NavLink>
                </Menu.Item>
                <Menu.Item className={styles.Item}>
                  <NavLink end to="/log-training-session">
                    📋 Log Training
                  </NavLink>
                </Menu.Item>
                <Menu.Item className={styles.Item}>
                  <NavLink end to="/visualization">
                    🖼️ Visualization
                  </NavLink>
                </Menu.Item>
                <Menu.Separator className={styles.Separator} />
                <Menu.Group>
                  <Menu.GroupLabel className={styles.GroupLabel}>
                    🧗 Ascents 🧗
                  </Menu.GroupLabel>
                  <Menu.Item className={styles.Item}>
                    <NavLink end to="/ascents">
                      📇 List
                    </NavLink>
                  </Menu.Item>
                  <Menu.Item className={styles.Item}>
                    <NavLink end to="/ascents/top-ten">
                      🔟 Top Ten
                    </NavLink>
                  </Menu.Item>
                  <Menu.Item className={styles.Item}>
                    <NavLink end to="/ascents/dashboard">
                      📊 Dashboard
                    </NavLink>
                  </Menu.Item>
                </Menu.Group>
                <Menu.Separator className={styles.Separator} />
                <Menu.Group>
                  <Menu.GroupLabel className={styles.GroupLabel}>
                    💪 Training 💪
                  </Menu.GroupLabel>
                  <Menu.Item className={styles.Item}>
                    <NavLink end to="/training-sessions">
                      📇 List
                    </NavLink>
                  </Menu.Item>
                </Menu.Group>
              </Menu.Popup>
            </Menu.Positioner>
          </Menu.Portal>
        </Menu.Root>
      </div>
    </nav>
  )
}
