import './SidebarProgram.css';
import './sidebarProgramData.js';
import { useState } from 'react';

const sidebarMenus = [
	{
		title: 'New Program',
		subs: ['Register', 'Submenu 1.2', 'Submenu 1.3'],
	},
	{
		title: 'Dropdown 2',
		subs: ['Submenu 2.1', 'Submenu 2.2', 'Submenu 2.3'],
	},
	{
		title: 'Dropdown 3',
		subs: ['Submenu 3.1', 'Submenu 3.2', 'Submenu 3.3'],
	},
	{
		title: 'Dropdown 4',
		subs: ['Submenu 4.1', 'Submenu 4.2', 'Submenu 4.3'],
	},
	{
		title: 'Dropdown 5',
		subs: ['Submenu 5.1', 'Submenu 5.2', 'Submenu 5.3'],
	},
];

function RegisterForm({ onSubmit }) {
	const fieldTitles = [
		'Program Name',
		'Email',
		'Phone',
		'Birth Date',
		'Address',
		'City',
		'Province',
		'Postal Code',
		'Parent Name',
		'Parent Phone',
		'School',
		'Grade',
		'Referral',
		'Notes',
	];
	const [form, setForm] = useState(Array(14).fill(''));
	const handleChange = (idx, e) => {
		const updated = [...form];
		updated[idx] = e.target.value;
		setForm(updated);
	};
	return (
		<div className="program-register-form">
			<form
				onSubmit={(e) => {
					e.preventDefault();
					onSubmit(form);
				}}
			>
				<div className="program-register-grid">
					{fieldTitles.map((title, i) => (
						<div className="program-register-field" key={i}>
							<label htmlFor={`program-field-${i}`}>{title}</label>
							<input
								id={`program-field-${i}`}
								type="text"
								className="program-register-input"
								placeholder={title}
								value={form[i]}
								onChange={(e) => handleChange(i, e)}
							/>
						</div>
					))}
				</div>
				<button className="program-register-submit" type="submit">
					Submit
				</button>
			</form>
		</div>
	);
}

export default function SidebarProgram() {
	const [openDropdowns, setOpenDropdowns] = useState([
		false,
		false,
		false,
		false,
		false,
	]);
	const [activeSub, setActiveSub] = useState({ dropdown: null, sub: null });
	const [showRegister, setShowRegister] = useState(false);

	const handleDropdownClick = (idx) => {
		setOpenDropdowns((prev) => {
			const updated = [...prev];
			updated[idx] = !updated[idx];
			return updated;
		});
	};

	const handleSubClick = (idx, subIdx, sub) => {
		setActiveSub({ dropdown: idx, sub: subIdx });
		if (idx === 0 && sub === 'Register') setShowRegister(true);
		else setShowRegister(false);
	};

	const handleRegisterSubmit = (formData) => {
		// Simpan ke backend di sidebarprogramData.js
		// window.alert(JSON.stringify(formData));
		// Anda bisa ganti dengan notifikasi modern
		// Lakukan fetch/axios ke backend di sini jika sudah ada endpoint
	};

	return (
		<>
			<aside className="mainpage-sidebar-submenu">
				{sidebarMenus.map((dropdown, idx) => (
					<div
						className={`sidebar-dropdown${
							openDropdowns[idx] ? ' open' : ''
						}`}
						key={dropdown.title}
					>
						<button
							className={`sidebar-dropdown-title${
								openDropdowns[idx] ? ' active' : ''
							}`}
							onClick={() => handleDropdownClick(idx)}
						>
							{dropdown.title}
							<span>{openDropdowns[idx] ? '▲' : '▼'}</span>
						</button>
						<div className="sidebar-dropdown-content">
							{dropdown.subs.map((sub, subIdx) => (
								<button
									className={`sidebar-submenu-btn${
										activeSub.dropdown === idx &&
										activeSub.sub === subIdx
											? ' active'
											: ''
									}`}
									key={sub}
									onClick={() => handleSubClick(idx, subIdx, sub)}
								>
									{sub}
								</button>
							))}
						</div>
					</div>
				))}
			</aside>
			{showRegister && (
				<div className="program-register-panel">
					<RegisterForm onSubmit={handleRegisterSubmit} />
				</div>
			)}
		</>
	);
}
