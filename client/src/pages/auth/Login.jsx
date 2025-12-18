import React, { useState, useEffect } from 'react';
import { auth, provider } from '../../config/firebase';
import { signInWithPopup } from "firebase/auth";
import { FcGoogle } from 'react-icons/fc'; 
import { Store, MapPin, Phone, Lock, Zap, CheckCircle2, Check, Loader2, ArrowRight, ShieldCheck, PieChart } from 'lucide-react'; 
import { useAppContext } from '../../context/AppContext.jsx';
import toast from 'react-hot-toast';
import { businessOptions } from '../../utils/businessOptions.js';

const Login = ({ onLoginSuccess }) => {
  const { axios, user } = useAppContext();
  const [loading, setLoading] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [tempUserId, setTempUserId] = useState(null);
  
  const [formData, setFormData] = useState({ shopName: '', address: '', number: '', pin: '', businessTypes: [] });


  useEffect(() => {
      if (user && (!user.shopName || !user.pin || !user.number)) { setTempUserId(user._id); setShowOnboarding(true); }
  }, [user]);

  const toggleBusinessType = (id) => {
      setFormData(prev => {
          const current = prev.businessTypes;
          if (current.includes(id)) return { ...prev, businessTypes: current.filter(item => item !== id) };
          else return { ...prev, businessTypes: [...current, id] };
      });
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    signInWithPopup(auth, provider).then(async (result) => {
        const googleUser = result.user;
        try {
          const res = await axios.post('/user/google-login', { email: googleUser.email, name: googleUser.displayName, photo: googleUser.photoURL });
          if (res.data.success) {
             if (res.data.requiresPhone) { setTempUserId(res.data.user?._id); setShowOnboarding(true); setLoading(false); } 
             else { onLoginSuccess(res.data.user); toast.success("Welcome back!"); }
          } else { toast.error(res.data.message || "Login failed"); setLoading(false); }
        } catch (err) { toast.error("Server error"); setLoading(false); }
      }).catch(() => setLoading(false));
  };

  const handleCompleteSetup = async (e) => {
    e.preventDefault();
    if(!formData.shopName || !formData.address || !formData.number || !formData.pin) return toast.error("Please fill all fields");
    if(formData.businessTypes.length === 0) return toast.error("Select business type");
    if(formData.pin.length !== 4) return toast.error("PIN must be 4 digits");

    setLoading(true);
    try {
        const targetId = tempUserId || user?._id;
        if (!targetId) return toast.error("Session error.");
        const res = await axios.post('/user/update-details', { userId: targetId, ...formData, businessType: formData.businessTypes });
        if (res.data.success) { toast.success("Setup Complete!"); onLoginSuccess(res.data.user); } 
        else { toast.error(res.data.message); }
    } catch (err) { toast.error("Network error"); } finally { setLoading(false); }
  };

  return (
    <div className='min-h-dvh w-full bg-white flex flex-col font-sans overflow-hidden'>
      
      {/* --- TOP HEADER (Brand Identity) --- */}
      <div className={`relative w-full ${showOnboarding ? 'h-[20vh]' : 'h-[42vh]'} transition-all duration-700 ease-out shrink-0`}>
        {/* Deep Premium Gradient */}
        <div className="absolute inset-0 bg-linear-to-b from-blue-900 via-indigo-900 to-slate-900"></div>
        
        {/* Ambient Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_top,var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl mix-blend-screen"></div>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center p-6 pb-12">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 shadow-2xl mb-6 ring-4 ring-white/5">
                <Store className="text-white w-8 h-8" />
            </div>
            
            {!showOnboarding && (
                <h1 className="text-4xl font-black text-white tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-700">
                    Billing Habit
                </h1>
            )}
        </div>
      </div>

      {/* --- BOTTOM SHEET (Interactive Area) --- */}
      <div className="flex-1 bg-white relative z-20 -mt-8 rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] flex flex-col overflow-hidden">
        <div className="h-full flex flex-col p-8 pt-10">
            
            {!showOnboarding ? (
                // --- LOGIN VIEW ---
                <div className="flex-1 flex flex-col justify-between animate-in slide-in-from-bottom-8 duration-700">
                    
                    {/* CENTER UI: Smooth Vertical Value Props (No Cards) */}
                    <div className="space-y-8 pl-2">
                        <div className="flex gap-5 group">
                            <div className="relative">
                                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-900 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300">
                                    <Zap size={20} fill="currentColor" className="text-blue-600/20" />
                                    <Zap size={20} className="absolute" />
                                </div>
                                <div className="absolute top-10 left-1/2 w-0.5 h-full bg-gray-100 -ml-px"></div>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 text-lg">Instant Invoicing</h3>
                                <p className="text-gray-500 text-sm mt-1 leading-relaxed">Generate professional quotes in seconds.</p>
                            </div>
                        </div>

                        <div className="flex gap-5 group">
                            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-300 z-10 relative">
                                <PieChart size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 text-lg">Profit Tracking</h3>
                                <p className="text-gray-500 text-sm mt-1 leading-relaxed">Know your quotes earnings at a glance.</p>
                            </div>
                        </div>
                    </div>

                    {/* Bottom Action */}
                    <div className="mt-6">
                        <button 
                            onClick={handleGoogleLogin} 
                            disabled={loading} 
                            className="w-full h-16 bg-slate-900 text-white rounded-2xl font-bold text-lg shadow-xl shadow-slate-900/20 active:scale-[0.98] transition-all flex items-center justify-between px-6 hover:bg-slate-800"
                        >
                            <div className="flex items-center gap-4">
                                {loading ? <Loader2 className="animate-spin text-white/50"/> : <FcGoogle className="text-2xl" />}
                                <span>Get Started</span>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                                <ArrowRight size={16} />
                            </div>
                        </button>
                        
                        <p className="text-center text-xs text-gray-400 mt-6 font-medium">
                            Secure Cloud Sync • 100% Free to Start
                        </p>
                    </div>
                </div>
            ) : (
                // --- ONBOARDING VIEW ---
                <div className="flex-1 flex flex-col h-full animate-in zoom-in-95 duration-500">
                    <div className="mb-6">
                        <h2 className='text-2xl font-bold text-gray-900'>Setup Shop</h2>
                        <p className="text-sm text-gray-500 mt-1">Customize your business profile</p>
                    </div>

                    <form onSubmit={handleCompleteSetup} className="flex-1 flex flex-col gap-5 overflow-y-auto scrollbar-hide pb-4">
                        
                        {/* Chips */}
                        <div className="flex flex-wrap gap-2">
                            {businessOptions.map((opt) => {
                                const isActive = formData.businessTypes.includes(opt.id);
                                return (
                                    <button 
                                        key={opt.id} 
                                        type="button" 
                                        onClick={() => toggleBusinessType(opt.id)} 
                                        className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all border
                                            ${isActive 
                                                ? 'bg-blue-900 border-blue-900 text-white shadow-md shadow-blue-200' 
                                                : 'bg-white border-gray-200 text-gray-600'
                                            }`
                                        }
                                    >
                                        {opt.label}
                                    </button>
                                );
                            })}
                        </div>

                        {/* Floating Label Inputs */}
                        <div className="space-y-4">
                            <div className="relative">
                                <input 
                                    className="peer w-full h-14 bg-gray-50 border-0 rounded-2xl px-4 pt-4 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-semibold text-gray-800 placeholder-transparent" 
                                    placeholder="Name"
                                    id="shopName"
                                    value={formData.shopName} 
                                    onChange={e => setFormData({...formData, shopName: e.target.value})} 
                                />
                                <label htmlFor="shopName" className="absolute left-4 top-1 text-[10px] font-bold text-gray-400 uppercase transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:top-1 peer-focus:text-[10px] peer-focus:text-blue-900">Shop Name</label>
                            </div>

                            <div className="relative">
                                <input 
                                    className="peer w-full h-14 bg-gray-50 border-0 rounded-2xl px-4 pt-4 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-semibold text-gray-800 placeholder-transparent" 
                                    placeholder="Addr"
                                    id="address"
                                    value={formData.address} 
                                    onChange={e => setFormData({...formData, address: e.target.value})} 
                                />
                                <label htmlFor="address" className="absolute left-4 top-1 text-[10px] font-bold text-gray-400 uppercase transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:top-1 peer-focus:text-[10px] peer-focus:text-blue-900">Address</label>
                            </div>

                            <div className="flex gap-3">
                                <div className="relative flex-1">
                                    <input 
                                        type="tel"
                                        className="peer w-full h-14 bg-gray-50 border-0 rounded-2xl px-4 pt-4 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-semibold text-gray-800 placeholder-transparent" 
                                        placeholder="Mob"
                                        id="mobile"
                                        value={formData.number} 
                                        onChange={e => setFormData({...formData, number: e.target.value})} 
                                    />
                                    <label htmlFor="mobile" className="absolute left-4 top-1 text-[10px] font-bold text-gray-400 uppercase transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:top-1 peer-focus:text-[10px] peer-focus:text-blue-900">Mobile</label>
                                </div>
                                <div className="relative w-28">
                                    <input 
                                        type="tel"
                                        maxLength={4}
                                        className="peer w-full h-14 bg-gray-50 border-0 rounded-2xl px-4 pt-4 outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-bold text-gray-800 text-center tracking-widest placeholder-transparent" 
                                        placeholder="PIN"
                                        id="pin"
                                        value={formData.pin} 
                                        onChange={e => setFormData({...formData, pin: e.target.value})} 
                                    />
                                    <label htmlFor="pin" className="absolute left-0 right-0 text-center top-1 text-[10px] font-bold text-gray-400 uppercase transition-all peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm peer-placeholder-shown:text-gray-400 peer-focus:top-1 peer-focus:text-[10px] peer-focus:text-blue-900">PIN</label>
                                </div>
                            </div>
                        </div>

                        <button 
                            disabled={loading} 
                            className="mt-auto w-full h-14 bg-blue-900 text-white rounded-2xl font-bold text-lg shadow-lg shadow-blue-600/30 hover:shadow-blue-600/40 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                        >
                            {loading ? <Loader2 className="animate-spin"/> : "Launch Dashboard"}
                        </button>
                    </form>
                </div>
            )}
        </div>
      </div>
      <div className='bg-white z-20 flex gap-2 justify-center font-light text-gray-400 text-xs py-3'><a href="/legal">Privacy Policy</a> | <a href="/legal">Terms of Service</a> | <a href="/legal">Refund Policy</a></div>
    </div>
  );
};

export default Login;