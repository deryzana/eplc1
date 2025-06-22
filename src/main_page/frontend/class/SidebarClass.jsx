import './SidebarClass.css';
import './sidebarClassData.js';
import { useState } from 'react';

const sidebarMenus = [
  {
    title: 'New Class',
    subs: ['Submenu 1.1', 'Submenu 1.2', 'Submenu 1.3']
  },
  {
    title: 'Dropdown 2',
    subs: ['Submenu 2.1', 'Submenu 2.2', 'Submenu 2.3']
  },
  {
    title: 'Dropdown 3',
    subs: ['Submenu 3.1', 'Submenu 3.2', 'Submenu 3.3']
  },
  {
    title: 'Dropdown 4',
    subs: ['Submenu 4.1', 'Submenu 4.2', 'Submenu 4.3']
  },
  {
    title: 'Dropdown 5',
    subs: ['Submenu 5.1', 'Submenu 5.2', 'Submenu 5.3']
  }
];

export default function SidebarClass() {
  const [openDropdowns, setOpenDropdowns] = useState([false, false, false, false, false]);
  const [activeSub, setActiveSub] = useState({ dropdown: null, sub: null });

  const handleDropdownClick = (idx) => {
    setOpenDropdowns((prev) => {
      const updated = [...prev];
      updated[idx] = !updated[idx];
      return updated;
    });
  };

  return (
    <aside className="mainpage-sidebar-submenu">
      {sidebarMenus.map((dropdown, idx) => (
        <div
          className={`sidebar-dropdown${openDropdowns[idx] ? ' open' : ''}`}
          key={dropdown.title}
        >
          <button
            className={`sidebar-dropdown-title${openDropdowns[idx] ? ' active' : ''}`}
            onClick={() => handleDropdownClick(idx)}
          >
            {dropdown.title}
            <span>{openDropdowns[idx] ? '▲' : '▼'}</span>
          </button>
          <div className="sidebar-dropdown-content">
            {dropdown.subs.map((sub, subIdx) => (
              <button
                className={`sidebar-submenu-btn${activeSub.dropdown === idx && activeSub.sub === subIdx ? ' active' : ''}`}
                key={sub}
                onClick={() => setActiveSub({ dropdown: idx, sub: subIdx })}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>
      ))}
    </aside>
  );
}
