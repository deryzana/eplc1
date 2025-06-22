import './MainPage.css';
import { useState } from 'react';
import SidebarStudent from './student/SidebarStudent';
import SidebarTutor from './tutor/SidebarTutor';
import SidebarProgram from './program/SidebarProgram';
import SidebarClass from './class/SidebarClass';
import SidebarPeriod from './period/SidebarPeriod';
const menuList = [
  'Home',
  'Student',
  'Tutor',
  'Program',
  'Class',
  'Period',
  'Profile'
];

const showSidebarFor = ['Student', 'Tutor', 'Program', 'Class', 'Period'];

function MainPage() {
  const [active, setActive] = useState('Home');
  const [openDropdown, setOpenDropdown] = useState(null);

  return (
    <div className="mainpage-bg">
      <div className="bg-overlay-mainpage" />
      <nav className="mainpage-navbar-fixed">
        <div className="mainpage-navbar-inner">
          {menuList.map((menu) => (
            <button
              key={menu}
              className={`mainpage-menu-btn${active === menu ? ' active' : ''}`}
              onClick={() => { setActive(menu); setOpenDropdown(null); }}
            >
              {menu}
            </button>
          ))}
        </div>
      </nav>
      {active === 'Student' && (
        <SidebarStudent openDropdown={openDropdown} setOpenDropdown={setOpenDropdown} />
      )}
      {active === 'Tutor' && (
        <SidebarTutor openDropdown={openDropdown} setOpenDropdown={setOpenDropdown} />
      )}
      {active === 'Program' && (
        <SidebarProgram openDropdown={openDropdown} setOpenDropdown={setOpenDropdown} />
      )}
      {active === 'Class' && (
        <SidebarClass openDropdown={openDropdown} setOpenDropdown={setOpenDropdown} />
      )}
      {active === 'Period' && (
        <SidebarPeriod openDropdown={openDropdown} setOpenDropdown={setOpenDropdown} />
      )}
      {/* Konten untuk menu {active} akan ditampilkan di bawah ini dalam <div> */}
      {/* <div className="mainpage-content-fixed">
        <div className="erp-section">
          <div className="erp-title"></div>
          <div></div>
        </div>
      </div> */}
    </div>
  );
}

export default MainPage;
