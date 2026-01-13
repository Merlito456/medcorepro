import React, { useState } from 'react';
import { 
  Users, CalendarCheck, TrendingUp, Activity, ArrowUpRight, ArrowDownRight, Plus, UserPlus
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useClinic } from '../ClinicContext';
import Modal from '../components/Modal';

const DashboardView: React.FC = () => {
  const { doctor, patients, appointments, invoices, addPatient } = useClinic();
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [newPatient, setNewPatient] = useState({ name: '', age: '', gender: 'Male' });

  const totalRevenue = invoices.reduce((sum, inv) => sum + (inv.status === 'Paid' ? inv.net : 0), 0);
  const data = [
    { name: 'Mon', revenue: 15000 },
    { name: 'Tue', revenue: 12000 },
    { name: 'Wed', revenue: 22000 },
    { name: 'Thu', revenue: 18000 },
    { name: 'Fri', revenue: 25000 },
    { name: 'Sat', revenue: 14000 },
    { name: 'Sun', revenue: 8000 },
  ];

  const handleQuickRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `PID-${Math.floor(1000 + Math.random() * 9000)}`;
    addPatient({
      id, name: newPatient.name, age: parseInt(newPatient.age), gender: newPatient.gender as any,
      bloodGroup: 'Unknown', lastVisit: new Date().toISOString().split('T')[0],
      history: [], allergies: [], isSeniorCitizen: parseInt(newPatient.age) >= 60,
      isPWD: false, address: { barangay: '', city: '', province: '' }
    });
    setNewPatient({ name: '', age: '', gender: 'Male' });
    setIsRegisterModalOpen(false);
  };

  return (
    <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-serif">Mabuhay, {doctor?.full_name}!</h1>
          <p className="text-slate-500">Overview for {doctor?.clinic_name || 'your clinic'}.</p>
        </div>
        <button onClick={() => setIsRegisterModalOpen(true)} className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-medium transition-all shadow-md flex items-center gap-2"><Plus className="w-4 h-4" /> Walk-in Patient</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"><p className="text-slate-500 text-sm">Total Patients</p><p className="text-2xl font-bold text-slate-900">{patients.length}</p></div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"><p className="text-slate-500 text-sm">Appointments</p><p className="text-2xl font-bold text-slate-900">{appointments.length}</p></div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"><p className="text-slate-500 text-sm">Revenue</p><p className="text-2xl font-bold text-slate-900">₱{totalRevenue.toLocaleString()}</p></div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"><p className="text-slate-500 text-sm">Avg. Consultation</p><p className="text-2xl font-bold text-slate-900">18m</p></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm h-[400px]">
          <h2 className="text-lg font-bold mb-8">Revenue Analysis</h2>
          <ResponsiveContainer width="100%" height="80%">
            <AreaChart data={data}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="name" /><YAxis /><Tooltip /><Area type="monotone" dataKey="revenue" stroke="#2563eb" fill="#2563eb" fillOpacity={0.1} /></AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm overflow-y-auto"><h2 className="text-lg font-bold mb-6">Today's Queue</h2>{appointments.map(a => <div key={a.id} className="py-2 border-b last:border-0"><p className="font-bold">{a.patientName}</p><p className="text-xs text-slate-500">{a.time} - {a.type}</p></div>)}</div>
      </div>

      <Modal isOpen={isRegisterModalOpen} onClose={() => setIsRegisterModalOpen(false)} title="Quick Registration">
        <form onSubmit={handleQuickRegister} className="space-y-4">
          <input required type="text" placeholder="Full Name" className="w-full p-3 bg-slate-50 border rounded-xl" value={newPatient.name} onChange={e => setNewPatient({...newPatient, name: e.target.value})} />
          <input required type="number" placeholder="Age" className="w-full p-3 bg-slate-50 border rounded-xl" value={newPatient.age} onChange={e => setNewPatient({...newPatient, age: e.target.value})} />
          <button type="submit" className="w-full py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg">Add to Directory</button>
        </form>
      </Modal>
    </div>
  );
};

export default DashboardView;
