import './SidebarStudent.css';
import './Controller.css';
import './sidebarStudentData.js';
import { useState, useEffect, useRef } from 'react';
import SimulateProgram from './SimulateProgram.jsx';

// Field titles global agar semua komponen sinkron
const fieldTitles = [
    'Full Name',
    'Email',
    'Phone Number',
    'Gender',
    'Address',
    'City',
    'Program', //pindahkan ini ke kanan field
    'Period',
    'Pre-Test Score', //pindahkan ini ke kanan field
    'Place of Birth',
    'Date of Birth',
];

const sidebarMenus = [
	{
		title: 'New Student',
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

function parseTanggalIndonesia(input) {
    // Ambil bagian tanggal dari string (setelah koma jika ada)
    let str = input.trim();
    if (str.includes(",")) str = str.split(",").pop().trim();
    // Map bulan Indonesia ke angka
    const bulanMap = {
        januari: "01", jan: "01", january: "01",
        februari: "02", feb: "02", february: "02",
        maret: "03", mar: "03", march: "03",
        april: "04", apr: "04", aprl: "04",
        mei: "05", may: "05",
        juni: "06", jun: "06", june: "06",
        juli: "07", jul: "07", july: "07",
        agustus: "08", agu: "08", aug: "08", august: "08",
        september: "09", sep: "09", sept: "09",
        oktober: "10", okt: "10", oct: "10", october: "10",
        nofember: "11", nov: "11", novmbr: "11", november: "11",
        desember: "12", des: "12", dec: "12", december: "12"
    };
    // 1. Format: 25 Januari 1994 atau 25 Jan 94
    let m = str.match(/(\d{1,2})\s*([A-Za-z]+)\s*(\d{2,4})/i);
    if (m) {
        let [_, d, b, y] = m;
        b = bulanMap[b.toLowerCase()] || "";
        if (b && d.length === 1) d = "0" + d;
        if (y.length === 2) y = (+y < 30 ? "20" : "19") + y; // 2 digit tahun
        if (b) return `${d}-${b}-${y}`;
    }
    // 2. Format: 250194 atau 25011994
    m = str.match(/(\d{2})(\d{2})(\d{2,4})$/);
    if (m) {
        let [_, d, b, y] = m;
        if (y.length === 2) y = (+y < 30 ? "20" : "19") + y;
        return `${d}-${b}-${y}`;
    }
	// 3. Format: 25-01-1994 atau 25-01-94
	m = str.match(/(\d{2})-(\d{2})-(\d{2,4})/);
	// m = str.match(/(\d{2})\/(\d{2})\/(\d{2,4})$/);
    if (m) {
        let [_, d, b, y] = m;
        if (y.length === 2) y = (+y < 30 ? "20" : "19") + y;
        return `${d}-${b}-${y}`;
    }
	// 4. Format: 25/01/1994 atau 25/01/94
	m = str.match(/(\d{2})\/(\d{2})\/(\d{2,4})$/);
    if (m) {
        let [_, d, b, y] = m;
        if (y.length === 2) y = (+y < 30 ? "20" : "19") + y;
        return `${d}-${b}-${y}`;
    }
    return null;
}

function parseTempatTanggal(input) {
    // Contoh: "Bandung, 25 Januari 1994" atau "Bandung, 250194"
    let tempat = '', tanggal = '';
    if (input.includes(",")) {
        const [t, ...rest] = input.split(",");
        tempat = t.trim();
        tanggal = rest.join(",").trim();
    } else {
        // Jika tidak ada koma, asumsikan hanya tanggal
        tanggal = input.trim();
    }
    return { tempat, tanggal };
}

function RegisterForm({ onSubmit, generatedData }) {
    const [form, setForm] = useState(generatedData || Array(fieldTitles.length).fill(''));
    const [dobError, setDobError] = useState('');
    const [error, setError] = useState('');
    const [errorField, setErrorField] = useState(Array(fieldTitles.length).fill(''));
    const [success, setSuccess] = useState(false);
    // Sinkronisasi field tanggal & tempat otomatis
    useEffect(() => {
        const idxPlace = fieldTitles.indexOf('Place of Birth');
        const idxDate = fieldTitles.indexOf('Date of Birth');
        if (form[idxPlace] && form[idxPlace].includes(",")) {
            const { tempat, tanggal } = parseTempatTanggal(form[idxPlace]);
            const parsed = parseTanggalIndonesia(tanggal);
            if (tempat && form[idxPlace] !== tempat) {
                setForm(f => {
                    const updated = [...f];
                    updated[idxPlace] = tempat;
                    if (parsed) updated[idxDate] = parsed;
                    return updated;
                });
            } else if (parsed && form[idxDate] !== parsed) {
                setForm(f => {
                    const updated = [...f];
                    updated[idxDate] = parsed;
                    return updated;
                });
            }
        } else if (form[idxDate]) {
            const parsed = parseTanggalIndonesia(form[idxDate]);
            if (parsed && form[idxDate] !== parsed) {
                setForm(f => {
                    const updated = [...f];
                    updated[idxDate] = parsed;
                    return updated;
                });
            }
        }
    }, [form, fieldTitles]);
    useEffect(() => {
        if (generatedData && Array.isArray(generatedData) && generatedData.length === fieldTitles.length) {
            setForm(generatedData);
        }
    }, [generatedData, fieldTitles.length]);
    const handleChange = (idx, e) => {
        const updated = [...form];
        let value = e.target.value;
        // Phone Number hanya angka dan auto 628
        if (fieldTitles[idx] === 'Phone Number') {
            value = value.replace(/\D/g, "");
            if (value.startsWith("08")) {
                value = "628" + value.slice(2);
            }
        }
        updated[idx] = value;
        setForm(updated);
        setError('');
        setErrorField(Array(fieldTitles.length).fill(''));
    };
    const validateForm = () => {
        let valid = true;
        const newErrorField = Array(fieldTitles.length).fill('');
        for (let i = 0; i < fieldTitles.length; i++) {
            if (!form[i] || form[i].trim() === '') {
                newErrorField[i] = `${fieldTitles[i]} should not be empty`;
                valid = false;
            }
        }
        setErrorField(newErrorField);
        // Validasi tanggal
        const idxDate = fieldTitles.indexOf('Date of Birth');
        if (valid && !/^\d{2}-\d{2}-\d{4}$/.test(form[idxDate])) {
            setError('data is not valid');
            return false;
        }
        setError('');
        return valid;
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        // Kirim ke backend
        try {
            const { submitStudentRegister } = await import('./sidebarStudentData.js');
            const result = await submitStudentRegister(form);
            if (result.success) {
                setSuccess(true);
            } else {
                setError(result.error || 'Gagal menyimpan data');
            }
        } catch (err) {
            setError('Terjadi kesalahan: ' + err.message);
        }
    };
    return (
        <div className="student-register-form">
            <form onSubmit={handleSubmit}>
                <div className="student-register-grid">
                    {fieldTitles.map((title, i) => (
                        <div className="student-register-field" key={i}>
                            <label htmlFor={`student-field-${i}`}>{title}</label>
                            {title === 'Gender' ? (
                                <select
                                    id={`student-field-${i}`}
                                    className="student-register-input"
                                    value={form[i]}
                                    onChange={e => handleChange(i, e)}
                                >
                                    <option value="">Select Gender</option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            ) : title === 'Date of Birth' ? (
                                <>
                                    <input
                                        id={`student-field-${i}`}
                                        type="text"
                                        className="student-register-input"
                                        placeholder={errorField[i] ? errorField[i] : 'DD-MM-YYYY'}
                                        value={form[i]}
                                        onChange={e => handleChange(i, e)}
                                        autoComplete="off"
                                    />
                                    <input
                                        type="date"
                                        className="student-register-date"
                                        value={(() => {
                                            const v = form[i];
                                            if (/^\d{2}-\d{2}-\d{4}$/.test(v)) {
                                                const [d, m, y] = v.split('-');
                                                return `${y}-${m}-${d}`;
                                            }
                                            return '';
                                        })()}
                                        onChange={e => {
                                            const v = e.target.value;
                                            if (/^\d{4}-\d{2}-\d{2}$/.test(v)) {
                                                const [y, m, d] = v.split('-');
                                                handleChange(i, { target: { value: `${d}-${m}-${y}` } });
                                            }
                                        }}
                                    />
                                    {dobError && <div className="student-register-error">{dobError}</div>}
                                </>
                            ) : (
                                <input
                                    id={`student-field-${i}`}
                                    type="text"
                                    className="student-register-input"
                                    placeholder={errorField[i] ? errorField[i] : title}
                                    value={form[i]}
                                    onChange={e => handleChange(i, e)}
                                />
                            )}
                        </div>
                    ))}
                </div>
                {error && <div className="student-register-error" style={{marginBottom:'1rem'}}>{error}</div>}
                <button className="student-register-submit" type="submit">
                    Submit
                </button>
            </form>
            {success && (
                <div className="student-register-success-popup">
                    <div>Successful</div>
                    <button className="student-register-viewnow-btn" onClick={()=>setSuccess(false)}>
                        OK
                    </button>
                </div>
            )}
        </div>
    );
}

function GenerateDataFromText({ onGenerate }) {
	const [showField, setShowField] = useState(false);
	const [text, setText] = useState('');
	const [error, setError] = useState('');
	const wrapperRef = useRef(null);

	useEffect(() => {
		if (!showField) return;
		function handleClickOutside(event) {
			if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
				setShowField(false);
				setError('');
			}
		}
		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, [showField]);

	const handleConfirm = () => {
        // Mapping label ke nama field
        const labelMap = {
            'Nama Lengkap:': 'Full Name',
            'Email:': 'Email',
            'Nomor Telepon:': 'Phone Number',
            'Gender:': 'Gender',
            'Alamat:': 'Address',
            'Kota Domisili:': 'City',
            'Program:': 'Program',
            'Period:': 'Period',
            'Pre-Test Score:': 'Pre-Test Score',
            'Place of Birth:': 'Place of Birth',
            'Date of Birth:': 'Date of Birth',
            'Tempat & Tanggal lahir:': 'Tempat & Tanggal lahir',
        };
        const arr = Array(fieldTitles.length).fill(''); // gunakan panjang fieldTitles
        let matched = false;
        text.split(/\n|\r/).forEach((line) => {
            const trimmed = line.trim();
            for (const label in labelMap) {
                if (trimmed.startsWith(label)) {
                    const field = labelMap[label];
                    let val = trimmed.replace(label, '').trim();
                    if (field === 'Tempat & Tanggal lahir') {
                        const idxPlace = fieldTitles.indexOf('Place of Birth');
                        const idxDate = fieldTitles.indexOf('Date of Birth');
                        const { tempat, tanggal } = parseTempatTanggal(val);
                        arr[idxPlace] = tempat;
                        arr[idxDate] = parseTanggalIndonesia(tanggal) || tanggal;
                    } else {
                        const idx = fieldTitles.indexOf(field);
                        if (idx !== -1) arr[idx] = val;
                    }
                    matched = true;
                    return;
                }
            }
        });
        if (!matched) {
            setError('data is not valid');
            return;
        }
        setError('');
        setShowField(false);
        setText('');
        onGenerate(arr);
    };

	const handleReset = () => {
		onGenerate(Array(fieldTitles.length).fill(''));
		setError('');
	};
	
	return (
		<div className="generate-data-from-text" ref={wrapperRef}>
			<div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
				<button
					className="getdata-from-text"
					type="button"
					onClick={() => {
						setShowField((s) => !s);
						setError('');
					}}
				>
					Generate
				</button>
				<button
					className="getdata-from-text-reset"
					type="button"
					onClick={handleReset}
				>
					Reset
				</button>
			</div>
			{showField && (
				<div className="generate-text-field">
					<textarea
						className="generate-textarea"
						placeholder="Paste or type data here. eg: Nama Lengkap: Muhammad Ali Email:"
						value={text}
						onChange={(e) => setText(e.target.value)}
						rows={4}
						onKeyDown={(e) => {
							if (e.ctrlKey && e.key === 'Enter') {
								e.preventDefault();
								handleConfirm();
							}
						}}
					/>
					{error && <div className="generate-error-msg">{error}</div>}
					{text.trim().length > 0 && (
							<button
								className="getdata-from-text-submit"
								type="button"
								onClick={handleConfirm}
							>
								Confirm
							</button>
						)}
					</div>
				)}
				</div>
			);
}

export default function SidebarStudent() {
	const [openDropdowns, setOpenDropdowns] = useState([
		false,
		false,
		false,
		false,
		false,
	]);
	const [activeSub, setActiveSub] = useState({ dropdown: null, sub: null });
	const [showRegister, setShowRegister] = useState(false);
	const [generatedData, setGeneratedData] = useState(null);

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
		// Simpan ke backend di sidebarStudentData.js
		setGeneratedData(formData); // agar RegisterForm terisi otomatis
	};
    const panelRef = useRef(null); 
    const handleScroll = (e) => {
    const el = e.target;
    const inner = panelRef.current;
    // ketika scroll mentok atas
    // if (el.scrollTop <= 0) {
    //     inner.style.transform = 'translateY(10px)';
    //     setTimeout(() => {
    //     inner.style.transform = 'translateY(0)';
    //     }, 150);
    // }
    
    // ketika scroll mentok bawah

    if (el.scrollTop + el.clientHeight >= el.scrollHeight) {
        inner.style.transform = 'translateY(-10px)';
        setTimeout(() => {
        inner.style.transform = 'translateY(0)';
        }, 150);
    }
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
				<div className="student-register-area">
                    <div className="student-register-control">
                        {(e) => handleScroll(e)}
                        <div className="student-register-panel" ref={panelRef}>
                        <RegisterForm
                            onSubmit={handleRegisterSubmit}
                            generatedData={generatedData}
                        />
                        <GenerateDataFromText onGenerate={setGeneratedData} />
                        {/* Integrasi SimulateProgram */}
                        <SimulateProgram studentName={generatedData && generatedData[0] ? generatedData[0] : ''} />
                        </div>
                    </div>
                 </div>
			)}
            
		</>
	);
}
