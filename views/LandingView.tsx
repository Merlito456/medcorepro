import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, Sparkles, Stethoscope, Activity, CreditCard, Lock, ArrowRight,
  User, Mail, Building, CheckCircle2, Cpu, Smartphone, Wifi, Globe, FileText, Pill
} from 'lucide-react';
import { supabase } from '../supabaseClient';
import { DoctorProfile } from '../ClinicContext';

interface LandingViewProps {
  onLoginSuccess: (userData: DoctorProfile) => void;
}

const LandingView: React.FC<LandingViewProps> = ({ onLoginSuccess }) => {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [isLoading, setIsLoading] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    license: '',
    email: '',
    password: ''
  });
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (scrollContainerRef.current) setScrolled(scrollContainerRef.current.scrollTop > 20);
    };
    const container = scrollContainerRef.current;
    if (container) container.addEventListener('scroll', handleScroll);
    return () => container?.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      if (authMode === 'register') {
        const { data, error: insertError } = await supabase
          .from('doctors')
          .insert([{
            id: formData.email,
            email: formData.email,
            full_name: formData.name,
            license_number: formData.license,
            specialty: 'Family Medicine'
          }])
          .select()
          .single();

        if (insertError) throw insertError;
        onLoginSuccess(data as DoctorProfile);
      } else {
        const { data, error: fetchError } = await supabase
          .from('doctors')
          .select('*')
          .eq('email', formData.email)
          .single();

        if (fetchError || !data) throw new Error("Account not found. Please register.");
        onLoginSuccess(data as DoctorProfile);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred during authentication.");
      setIsLoading(false);
    }
  };

  const FeatureCard = ({ icon: Icon, title, desc, color }: { icon: any, title: string, desc: string, color: string }) => (
    <div className="p-8 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
      <div className={`w-14 h-14 rounded-2xl ${color} bg-opacity-10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
        <Icon className={`w-7 h-7 ${color.replace('bg-', 'text-')}`} />
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
      <p className="text-slate-500 leading-relaxed text-sm">{desc}</p>
    </div>
  );

  return (
    <div ref={scrollContainerRef} className="h-screen overflow-y-auto bg-slate-50 flex flex-col font-sans scroll-smooth">
      <nav className={`h-20 flex items-center justify-between px-8 lg:px-20 fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 backdrop-blur-xl border-b border-slate-100 shadow-sm' : 'bg-transparent'}`}>
        <div className="flex items-center gap-2 cursor-pointer">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-200">M</div>
          <span className="font-bold text-2xl tracking-tight text-slate-900">MedCore<span className="text-blue-600">PH</span></span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm font-semibold text-slate-600 hover:text-blue-600">Features</a>
          <button onClick={() => setAuthMode('login')} className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold shadow-md active:scale-95">Physician Login</button>
        </div>
      </nav>

      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden shrink-0">
        <div className="max-w-7xl mx-auto px-8 lg:px-20 flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          <div className="flex-1 space-y-8 animate-in slide-in-from-left duration-700">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wider border border-blue-100">
              <Sparkles className="w-4 h-4" /> The New Standard in Digital Healthcare
            </div>
            <h1 className="text-5xl lg:text-7xl font-black text-slate-900 leading-[1.05] tracking-tight">Clinical precision meets Intelligence.</h1>
            <p className="text-xl text-slate-600 max-w-xl leading-relaxed">DOH-compliant EMR, PhilHealth e-Claims, PNDF Pharmacy, and Gemini 3.0 Pro clinical support.</p>
          </div>

          <div className="w-full lg:w-[480px] shrink-0 animate-in zoom-in fade-in duration-1000">
            <div className="bg-white p-10 rounded-[40px] shadow-2xl shadow-blue-900/10 border border-slate-100 relative overflow-hidden backdrop-blur-xl">
              <div className="mb-10">
                <h2 className="text-3xl font-bold text-slate-900 tracking-tight">{authMode === 'login' ? 'Physician Portal' : 'Clinic Onboarding'}</h2>
                <p className="text-slate-500 mt-2 text-sm font-medium">{authMode === 'login' ? 'Secure access to your medical dashboard' : 'Configure your practice credentials'}</p>
              </div>

              {error && <div className="mb-6 p-4 bg-rose-50 border border-rose-100 text-rose-600 rounded-xl text-xs font-bold flex items-center gap-2"><Lock className="w-4 h-4" /> {error}</div>}

              <form onSubmit={handleSubmit} className="space-y-5">
                {authMode === 'register' && (
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Professional Name</label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600" />
                      <input required type="text" placeholder="Dr. Juan Dela Cruz, FPCP" className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-sm font-medium" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                    </div>
                  </div>
                )}
                
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">PRC License Number</label>
                  <div className="relative group">
                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600" />
                    <input required type="text" placeholder="7-digit License No." className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-sm font-medium font-mono" value={formData.license} onChange={(e) => setFormData({ ...formData, license: e.target.value })} />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600" />
                    <input required type="email" placeholder="physician@medcore.ph" className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-sm font-medium" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600" />
                    <input required type="password" placeholder="••••••••" className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white text-sm font-medium" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                  </div>
                </div>

                <button type="submit" disabled={isLoading} className="w-full py-4 bg-blue-600 text-white font-bold rounded-2xl shadow-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-3 mt-6 group disabled:opacity-70 active:scale-95">
                  {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <>{authMode === 'login' ? 'Authorize Access' : 'Register Clinic'} <ArrowRight className="w-5 h-5 group-hover:translate-x-1" /></>}
                </button>
              </form>

              <div className="mt-8 pt-8 border-t border-slate-50 text-center">
                <p className="text-sm text-slate-500 font-medium">
                  {authMode === 'login' ? "Need to digitize your practice?" : "Already part of the network?"}{' '}
                  <button onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')} className="font-bold text-blue-600 hover:underline">{authMode === 'login' ? 'Sign Up' : 'Login'}</button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="py-24 lg:py-32 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-8 lg:px-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard icon={Stethoscope} title="Smart EMR & SOAP" desc="Voice-to-clinical note conversion." color="bg-blue-600" />
            <FeatureCard icon={CreditCard} title="e-Claims Integration" desc="Direct link to PhilHealth e-Claims." color="bg-emerald-600" />
            <FeatureCard icon={Pill} title="PNDF Pharmacy" desc="Manage stocks compliant with RA 6675." color="bg-indigo-600" />
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingView;
