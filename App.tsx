import React, { useState, useRef, useEffect } from 'react';
import { 
  LayoutDashboard, Users, Calendar, Stethoscope, Pill, CreditCard, Sparkles, Settings,
  Bell, Search, LogOut, ChevronRight, ShieldCheck, CheckCircle2, AlertCircle, Info, Trash2, WifiOff
} from 'lucide-react';
import { Module } from './types';
import { ClinicProvider, useClinic, DoctorProfile } from './ClinicContext';
import DashboardView from './views/DashboardView';
import PatientsView from './views/PatientsView';
import AppointmentsView from './views/AppointmentsView';
import ConsultationView from './views/ConsultationView';
import PharmacyView from './views/PharmacyView';
import BillingView from './views/BillingView';
import AIClinicView from './views/AIClinicView';
import SettingsView from './views/SettingsView';
import LandingView from './views/LandingView';
import Modal from './components/Modal';

const NotificationOverlay: React.FC = () => {
  const { notifications } = useClinic();
  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3">
      {notifications.map(n => (
        <div key={n.id} className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border animate-in slide-in-from-right-4 duration-300 ${
          n.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-800' :
          n.type === 'error' ? 'bg-rose-50 border-rose-100 text-rose-800' : 'bg-blue-50 border-blue-100 text-blue-800'
        }`}>
          {n.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
          {n.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-500" />}
          {n.type === 'info' && <Info className="w-5 h-5 text-blue-500" />}
          <span className="font-medium text-sm">{n.message}</span>
        </div>
      ))}
    </div>
  );
};

const MainLayout: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const [activeModule, setActiveModule] = useState<Module>(Module.DASHBOARD);
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const { doctor, searchTerm, setSearchTerm, notify, isOffline, notificationHistory, clearNotifications, markNotificationsRead } = useClinic();
  const notificationRef = useRef<HTMLDivElement>(null);
  const unreadCount = notificationHistory.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(e.target as Node)) setIsNotificationOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navigation = [
    { id: Module.DASHBOARD, name: 'Dashboard', icon: LayoutDashboard },
    { id: Module.PATIENTS, name: 'Patient Directory', icon: Users },
    { id: Module.APPOINTMENTS, name: 'Schedule', icon: Calendar },
    { id: Module.CONSULTATION, name: 'EMR & Consultation', icon: Stethoscope },
    { id: Module.PHARMACY, name: 'Pharmacy (PNDF)', icon: Pill },
    { id: Module.BILLING, name: 'Billing & PhilHealth', icon: CreditCard },
    { id: Module.AI_CLINIC, name: 'Clinical AI Lab', icon: Sparkles },
    { id: Module.SETTINGS, name: 'Clinic Settings', icon: Settings },
  ];

  const renderContent = () => {
    switch (activeModule) {
      case Module.DASHBOARD: return <DashboardView />;
      case Module.PATIENTS: return <PatientsView />;
      case Module.APPOINTMENTS: return <AppointmentsView />;
      case Module.CONSULTATION: return <ConsultationView />;
      case Module.PHARMACY: return <PharmacyView />;
      case Module.BILLING: return <BillingView />;
      case Module.AI_CLINIC: return <AIClinicView />;
      case Module.SETTINGS: return <SettingsView />;
      default: return <DashboardView />;
    }
  };

  return (
    <div className="flex h-full w-full bg-slate-50 animate-in fade-in duration-700">
      <aside className={`${isSidebarCollapsed ? 'w-20' : 'w-72'} bg-slate-900 text-white transition-all flex flex-col h-full z-20`}>
        <div className="p-6 flex items-center justify-between border-b border-slate-800">
          {!isSidebarCollapsed && (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center font-bold">M</div>
              <span className="font-bold text-xl tracking-tight">MedCore<span className="text-blue-400">PH</span></span>
            </div>
          )}
          <button onClick={() => setSidebarCollapsed(!isSidebarCollapsed)} className="p-1.5 rounded-md hover:bg-slate-800 text-slate-400">
            <ChevronRight className={`w-5 h-5 transition-transform ${isSidebarCollapsed ? '' : 'rotate-180'}`} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
          {navigation.map((item) => (
            <button key={item.id} onClick={() => setActiveModule(item.id)} className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all ${activeModule === item.id ? 'bg-blue-600 text-white font-medium shadow-lg shadow-blue-900/20' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
              <item.icon className="w-5 h-5" />
              {!isSidebarCollapsed && <span className="truncate text-sm">{item.name}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button onClick={() => { notify('Logging out...', 'info'); onLogout(); }} className="w-full flex items-center gap-3 px-3 py-3 text-slate-400 hover:bg-rose-900/20 hover:text-rose-400 rounded-xl transition-all group">
            <LogOut className="w-5 h-5 group-hover:rotate-12" />
            {!isSidebarCollapsed && <span className="text-sm">Sign Out</span>}
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center flex-1 max-w-xl">
            <div className="relative w-full group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500" />
              <input type="text" placeholder="Search Patient Name, PhilHealth ID..." className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>
            {isOffline && <div className="ml-4 flex items-center gap-2 px-3 py-1.5 bg-rose-50 border border-rose-100 text-rose-600 rounded-full text-[10px] font-bold uppercase animate-pulse"><WifiOff className="w-3 h-3" /> Offline</div>}
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden lg:block mr-4 border-r border-slate-100 pr-4">
              <p className="text-[10px] font-bold text-slate-400 uppercase leading-none mb-1">License No.</p>
              <p className="text-xs font-medium text-slate-600">PRC: {doctor?.license_number || 'N/A'}</p>
            </div>
            <button onClick={() => setIsProfileModalOpen(true)} className="flex items-center gap-3 px-2 py-1 rounded-xl hover:bg-slate-50 transition-all cursor-pointer group border border-transparent hover:border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-slate-900 leading-none">{doctor?.full_name}</p>
                <p className="text-xs text-blue-600 mt-1 flex items-center gap-1 justify-end font-medium"><ShieldCheck className="w-3 h-3" /> PH-Licensed</p>
              </div>
              <img src={`https://ui-avatars.com/api/?name=${doctor?.full_name}&background=2563eb&color=fff`} alt="Profile" className="w-10 h-10 rounded-xl border border-slate-200 object-cover group-hover:scale-105" />
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">{renderContent()}</div>
      </main>

      <Modal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} title="Physician Profile">
        <div className="space-y-8">
          <div className="flex items-center gap-6 p-6 bg-slate-50 rounded-2xl border border-slate-100">
            <img src={`https://ui-avatars.com/api/?name=${doctor?.full_name}&size=80`} className="w-20 h-20 rounded-2xl border-4 border-white shadow-sm" alt="Doctor" />
            <div>
              <h3 className="text-2xl font-bold text-slate-900">{doctor?.full_name}</h3>
              <p className="text-blue-600 font-medium flex items-center gap-2 mt-1"><ShieldCheck className="w-4 h-4" /> Registered Medical Practitioner</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-white border border-slate-200 rounded-xl">
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">PRC License No.</p>
              <p className="font-mono text-lg font-bold text-slate-900">{doctor?.license_number}</p>
            </div>
            <div className="p-4 bg-white border border-slate-200 rounded-xl">
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">PTR Number</p>
              <p className="font-mono text-lg font-bold text-slate-900">{doctor?.ptr_number || 'Not Set'}</p>
            </div>
          </div>
          <button onClick={() => { setActiveModule(Module.SETTINGS); setIsProfileModalOpen(false); }} className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 flex items-center justify-center gap-2"><Settings className="w-5 h-5" /> Manage Clinic Settings</button>
        </div>
      </Modal>
      <NotificationOverlay />
    </div>
  );
};

const App: React.FC = () => {
  const [isAuth, setIsAuth] = useState(() => localStorage.getItem('mc_session') === 'active');

  return (
    <ClinicProvider>
      <AuthWrapper isAuth={isAuth} setIsAuth={setIsAuth} />
    </ClinicProvider>
  );
};

const AuthWrapper: React.FC<{isAuth: boolean, setIsAuth: (v: boolean) => void}> = ({isAuth, setIsAuth}) => {
  const { setDoctor } = useClinic();
  
  const handleLoginSuccess = (userData: DoctorProfile) => {
    localStorage.setItem('mc_session', 'active');
    setDoctor(userData);
    setIsAuth(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('mc_session');
    setDoctor(null);
    setIsAuth(false);
  };

  return isAuth ? <MainLayout onLogout={handleLogout} /> : <LandingView onLoginSuccess={handleLoginSuccess} />;
};

export default App;
