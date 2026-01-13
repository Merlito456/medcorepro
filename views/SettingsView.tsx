import React, { useState, useEffect } from 'react';
import { Building, Save, UserCheck, Loader2 } from 'lucide-react';
import { useClinic } from '../ClinicContext';
import { supabase } from '../supabaseClient';

const SettingsView: React.FC = () => {
  const { doctor, setDoctor, notify } = useClinic();
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState({
    full_name: doctor?.full_name || '',
    specialty: doctor?.specialty || '',
    license_number: doctor?.license_number || '',
    ptr_number: doctor?.ptr_number || '',
    s2_number: doctor?.s2_number || '',
    clinic_name: doctor?.clinic_name || '',
    clinic_address: doctor?.clinic_address || ''
  });

  const handleSave = async () => {
    if (!doctor) return;
    setIsSaving(true);
    try {
      const { data, error } = await supabase
        .from('doctors')
        .update(profile)
        .eq('id', doctor.id)
        .select()
        .single();

      if (error) throw error;
      setDoctor(data);
      notify('Clinic configuration and physician profile updated in the cloud.');
    } catch (err) {
      console.error(err);
      notify('Failed to save settings to cloud. Please check your connection.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 pb-20">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Clinic Settings</h1>
        <p className="text-slate-500">Manage your clinical identity and professional credentials.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-blue-600" /> Professional Credentials
            </h2>
            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2 space-y-2">
                <label className="text-sm font-bold text-slate-700">Full Name (for Prescriptions)</label>
                <input type="text" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" value={profile.full_name} onChange={e => setProfile({...profile, full_name: e.target.value})} />
              </div>
              <div className="space-y-2"><label className="text-sm font-bold text-slate-700">Specialty</label><input type="text" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" value={profile.specialty} onChange={e => setProfile({...profile, specialty: e.target.value})} /></div>
              <div className="space-y-2"><label className="text-sm font-bold text-slate-700">PRC License No.</label><input type="text" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" value={profile.license_number} onChange={e => setProfile({...profile, license_number: e.target.value})} /></div>
              <div className="space-y-2"><label className="text-sm font-bold text-slate-700">PTR No.</label><input type="text" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" value={profile.ptr_number} onChange={e => setProfile({...profile, ptr_number: e.target.value})} /></div>
              <div className="space-y-2"><label className="text-sm font-bold text-slate-700">S2 License</label><input type="text" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" value={profile.s2_number} onChange={e => setProfile({...profile, s2_number: e.target.value})} /></div>
            </div>
          </section>

          <section className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Building className="w-5 h-5 text-blue-600" /> Clinic Information
            </h2>
            <div className="space-y-4">
              <div className="space-y-2"><label className="text-sm font-bold text-slate-700">Clinic Display Name</label><input type="text" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" value={profile.clinic_name} onChange={e => setProfile({...profile, clinic_name: e.target.value})} /></div>
              <div className="space-y-2"><label className="text-sm font-bold text-slate-700">Address</label><textarea className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none" value={profile.clinic_address} onChange={e => setProfile({...profile, clinic_address: e.target.value})} /></div>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <div className="bg-blue-600 p-8 rounded-2xl text-white shadow-xl">
            <h3 className="font-bold text-lg mb-2">Save Configuration</h3>
            <p className="text-blue-100 text-sm mb-6">Updating your professional info will sync across all your devices.</p>
            <button onClick={handleSave} disabled={isSaving} className="w-full py-3 bg-white text-blue-600 font-bold rounded-xl hover:bg-blue-50 transition-all flex items-center justify-center gap-2">
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Updates
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
