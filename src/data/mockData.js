export const initialPatients = [
  { id: 1, noRM: 'RM001', name: 'Budi Santoso', nik: '3201123456789012', gender: 'L', birthDate: '1990-05-15', phone: '081234567890', address: 'Jl. Merdeka No. 1' },
  { id: 2, noRM: 'RM002', name: 'Siti Aminah', nik: '3202123456789012', gender: 'P', birthDate: '1985-08-20', phone: '081345678901', address: 'Jl. Sudirman No. 2' },
  { id: 3, noRM: 'RM003', name: 'Ahmad Faiz', nik: '3203123456789012', gender: 'L', birthDate: '1992-12-10', phone: '085612345678', address: 'Jl. Diponegoro No. 3' },
  { id: 4, noRM: 'RM004', name: 'Rina Dewi', nik: '3204123456789012', gender: 'P', birthDate: '1995-03-25', phone: '087812345678', address: 'Jl. Pattimura No. 4' },
  { id: 5, noRM: 'RM005', name: 'Joko Widodo', nik: '3205123456789012', gender: 'L', birthDate: '1980-11-30', phone: '082112345678', address: 'Jl. Gatot Subroto No. 5' },
];

const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);
const twoDaysAgo = new Date(today);
twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

const formatDate = (date) => date.toISOString().split('T')[0];

export const initialVisits = [
  { id: 1, date: formatDate(today), patientId: 1, complaint: 'Demam', doctor: 'dr. Ana', status: 'Diproses' },
  { id: 2, date: formatDate(yesterday), patientId: 2, complaint: 'Batuk pilek', doctor: 'dr. Eko', status: 'Selesai' },
  { id: 3, date: formatDate(yesterday), patientId: 3, complaint: 'Pusing', doctor: 'dr. Ana', status: 'Selesai' },
  { id: 4, date: formatDate(twoDaysAgo), patientId: 4, complaint: 'Flu berat', doctor: 'dr. Eko', status: 'Menunggu' },
  { id: 5, date: formatDate(twoDaysAgo), patientId: 5, complaint: 'Sakit gigi', doctor: 'dr. Ana', status: 'Selesai' },
];
