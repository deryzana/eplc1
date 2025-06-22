export const sidebarMenus = [
  {
    title: 'Registered Student',
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

// Simulasi logika backend untuk register student
export async function submitStudentRegister(formData) {
  // Kirim data ke backend
  const response = await fetch('http://localhost:5137/api/student/add-temp-student', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName: formData[0],
      email: formData[1],
      phoneNumber: formData[2],
      gender: formData[3],
      address: formData[4],
      city: formData[5],
      program: formData[6],
      period: formData[7],
      pretestScore: formData[8],
      placeofBirth: formData[9],
      dateOfBirth: formData[10],
    })
  });
  const result = await response.json();
  return result;
}
