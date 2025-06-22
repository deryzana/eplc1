import './SimulateProgram.css';
import './SimulateProgram.js';
import './SidebarStudent.jsx';
import { useState, useEffect, useRef } from 'react';

const programOptions = ['English Basic', 'English Intermediate', 'English Advanced'];
const classOptions = ['Class 1', 'Class 2', 'Class 3'];
const branchOptions = ['Jakarta', 'Bandung', 'Surabaya'];
const paymentOptions = ['Cash', 'Transfer', 'Credit Card'];
const tutorOptions = ['Mr. John', 'Ms. Lisa', 'Mr. Alex'];
const scheduleOptions = ['Monday 10:00', 'Wednesday 14:00', 'Friday 16:00'];
const periodOptions = ['2025-Q1', '2025-Q2', '2025-Q3'];

export default function SimulateProgram({ studentName }) {
  const [showMenu, setShowMenu] = useState(false);
  const [form, setForm] = useState({
    program: '',
    classNumber: '',
    branch: '',
    payment: '',
    tutor: '',
    schedule: '',
    period: '',
  });

  const handleChange = (field, value) => {
    setForm(f => ({ ...f, [field]: value }));
  };

  return (
    <div>
      {/* key={menu}
              className={`mainpage-menu-btn${active === menu ? ' active' : ''}`}
              onClick={() => { setActive(menu); setOpenDropdown(null); }} */}
      <button className="simulate-program-btn" onClick={() => setShowMenu(s => !s)}>
        Simulate Program
      </button>
      {showMenu && (
        <div className="simulate-program-panel">
          <div className="simulate-program-title">
            Program Simulation for Student
            {/* Program Simulation for {studentName ? studentName : 'Student'} */}
          </div>
          <form className="simulate-program-form">
            <div className="simulate-program-grid">
              <div className="simulate-program-field">
                <label>Program Name</label>
                <select className="simulate-program-input" value={form.program} onChange={e => handleChange('program', e.target.value)}>
                  <option value="">Select Program</option>
                  {programOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div className="simulate-program-field">
                <label>Class Number</label>
                <select className="simulate-program-input" value={form.classNumber} onChange={e => handleChange('classNumber', e.target.value)}>
                  <option value="">Select Class</option>
                  {classOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div className="simulate-program-field">
                <label>School Branch</label>
                <select className="simulate-program-input" value={form.branch} onChange={e => handleChange('branch', e.target.value)}>
                  <option value="">Select Branch</option>
                  {branchOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div className="simulate-program-field">
                <label>Payment Type</label>
                <select className="simulate-program-input" value={form.payment} onChange={e => handleChange('payment', e.target.value)}>
                  <option value="">Select Payment</option>
                  {paymentOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div className="simulate-program-field">
                <label>Tutor</label>
                <select className="simulate-program-input" value={form.tutor} onChange={e => handleChange('tutor', e.target.value)}>
                  <option value="">Select Tutor</option>
                  {tutorOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div className="simulate-program-field">
                <label>Schedule</label>
                <select className="simulate-program-input" value={form.schedule} onChange={e => handleChange('schedule', e.target.value)}>
                  <option value="">Select Schedule</option>
                  {scheduleOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div className="simulate-program-field">
                <label>Period</label>
                <select className="simulate-program-input" value={form.period} onChange={e => handleChange('period', e.target.value)}>
                  <option value="">Select Period</option>
                  {periodOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

