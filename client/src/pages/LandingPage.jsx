import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Download as DownloadIcon,
  CheckCircle2,
  Store,
  Zap,
  ShieldCheck,
  Loader2,
  ArrowRight,
  PieChart,
  ExternalLink
} from 'lucide-react';
import { useAppContext } from '../context/AppContext.jsx';

const LandingPage = () => {
  const { user } = useAppContext();
  const navigate = useNavigate();

  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isReadyForInstall, setIsReadyForInstall] = useState(false);
  const [installStatus, setInstallStatus] = useState('idle'); // idle | downloading | installed | alert-no-support
  const [progress, setProgress] = useState(0);

  /* ------------------- Install Prompt Listener ------------------- */
  useEffect(() => {
    // 1. If already in App Mode, redirect immediately
    if (window.matchMedia('(display-mode: standalone)').matches) {
       navigate(user ? '/home' : '/login', { replace: true });
       return;
    }

    // 2. Listen for installation availability
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsReadyForInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, [user, navigate]);

  /* ------------------- Fake Install Progress ------------------- */
  const startFakeInstall = () => {
    setInstallStatus('downloading');
    let currentProgress = 0;

    const interval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 10) + 5;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        
        // STOP: Do not navigate. Show "Installed" success screen instead.
        setInstallStatus('installed');
      }
      setProgress(currentProgress);
    }, 150);
  };

  /* ------------------- Install Button Click ------------------- */
  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      setInstallStatus('alert-no-support'); 
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      startFakeInstall();
    }
  };

  return (
    <div className='min-h-dvh w-full bg-white flex flex-col font-sans overflow-hidden'>
      
      {/* --- TOP HEADER (Brand Identity) --- */}
      <div className="relative w-full h-[45vh] transition-all duration-700 ease-out shrink-0">
        {/* Premium Gradient Background */}
        <div className="absolute inset-0 bg-linear-to-b from-blue-900 via-indigo-900 to-slate-900"></div>
        
        {/* Ambient Glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_top,var(--tw-gradient-stops))] from-blue-500/20 via-transparent to-transparent"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl mix-blend-screen"></div>

        {/* Content */}
        <div className="relative z-10 h-full flex flex-col items-center justify-center text-center p-6 pb-12">
            {/* New Logo Container */}
            <div className="w-20 h-20 bg-linear-to-br from-blue-800 to-slate-900 rounded-4xl flex items-center justify-center border border-white/10 shadow-2xl shadow-blue-900/50 mb-6 ring-4 ring-white/5 animate-in zoom-in duration-700">
                <Store className="text-white w-10 h-10 drop-shadow-md" />
            </div>
            
            <h1 className="text-4xl font-black text-white tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-700">
                Billing Habit
            </h1>
            <p className="text-blue-200/80 font-medium text-sm mt-2 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                Your Digital Retail Manager
            </p>
        </div>
      </div>

      {/* --- BOTTOM SHEET (Interactive Area) --- */}
      <div className="flex-1 bg-white relative z-20 -mt-10 rounded-t-[2.5rem] shadow-[0_-10px_40px_rgba(0,0,0,0.1)] flex flex-col overflow-hidden">
        <div className="h-full flex flex-col p-8 pt-10">
            
            {/* 1. IDLE STATE: Value Props + Install */}
            {installStatus === 'idle' && (
                <div className="flex-1 flex flex-col justify-between animate-in slide-in-from-bottom-8 duration-700">
                    <div className="space-y-6 pl-2">
                        {/* Smooth Vertical Value Props */}
                        <div className="flex gap-5 group">
                            <div className="relative pt-1">
                                <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-900 flex items-center justify-center shadow-sm">
                                    <Zap size={20} fill="currentColor" className="text-blue-600/20" />
                                    <Zap size={20} className="absolute" />
                                </div>
                                <div className="absolute top-10 left-1/2 w-0.5 h-full bg-gray-100 -ml-px"></div>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 text-lg">Instant Invoicing</h3>
                                <p className="text-gray-500 text-sm mt-1 leading-relaxed">Create professional bills in seconds.</p>
                            </div>
                        </div>

                        <div className="flex gap-5 group">
                            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-sm z-10 relative mt-1">
                                <PieChart size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 text-lg">Profit Tracking</h3>
                                <p className="text-gray-500 text-sm mt-1 leading-relaxed">Track daily earnings & expenses.</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 space-y-3">
                            <button 
                                onClick={handleInstallClick} 
                                className="w-full h-16 bg-slate-900 text-white rounded-2xl font-bold text-lg shadow-xl shadow-slate-900/20 active:scale-[0.98] transition-all flex items-center justify-between px-6 hover:bg-slate-800"
                            >
                                <div className="flex items-center gap-4">
                                    <DownloadIcon size={22} className="text-blue-400" />
                                    <span>Install App</span>
                                </div>
                                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                                    <ArrowRight size={16} />
                                </div>
                            </button>
                        <button 
                            onClick={() => navigate('/login')}
                            className="w-full h-14 bg-white text-slate-500 border border-slate-200 rounded-2xl font-bold text-sm active:scale-[0.98] transition-all flex items-center justify-center gap-2 hover:bg-slate-50"
                        >
                            <ExternalLink size={16} /> Open in Browser
                        </button>
                    </div>
                </div>
            )}

            {/* 2. DOWNLOADING STATE */}
            {installStatus === 'downloading' && (
                <div className="flex-1 flex flex-col items-center justify-center animate-in fade-in zoom-in duration-300">
                    <Loader2 className="w-12 h-12 text-blue-900 animate-spin mb-4" />
                    <h3 className="text-xl font-bold text-slate-900">Installing...</h3>
                    <p className="text-slate-500 text-sm mt-2 mb-6">Adding to your home screen</p>
                    
                    <div className="w-full max-w-[200px] h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-900 transition-all duration-200 ease-out" style={{ width: `${progress}%` }}></div>
                    </div>
                </div>
            )}

            {/* 3. INSTALLED / SUCCESS STATE (Fixes the redirection issue) */}
            {installStatus === 'installed' && (
                <div className="flex-1 flex flex-col items-center justify-center text-center animate-in zoom-in duration-500">
                    <div className="w-20 h-20 bg-blue-100 text-blue-900 rounded-full flex items-center justify-center mb-6 shadow-lg shadow-green-100/50">
                        <CheckCircle2 size={40} />
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 mb-2">Congratulations 🎉</h2>
                    <p className="text-slate-500 font-medium text-base leading-relaxed px-4">
                        App installed successfully. <br/>
                        <span className="text-slate-900 font-bold block mt-2">Close this browser and open the app from your home screen.</span>
                    </p>
                    <button 
                        onClick={() => navigate('/login')} 
                        className="mt-8 w-full h-16 bg-blue-900 text-white rounded-2xl font-bold text-lg shadow-xl shadow-blue-600/30 active:scale-[0.98] transition-all"
                    >
                        Continue to Login
                    </button>
                </div>
            )}
        </div>
      </div>

      {/* --- ALERT MODAL (Manual Install) --- */}
      {installStatus === 'alert-no-support' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-4xl shadow-2xl w-full max-w-xs p-8 text-center">
            <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-5 text-amber-600 rotate-3 shadow-sm">
              <Zap size={32} className="relative z-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Install Manually</h3>
            <p className="text-sm text-slate-500 mb-8 leading-relaxed">
              Tap the browser menu <span className="font-bold text-slate-800">(⋮)</span> and select <br/>
              <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">Add to Home Screen</span>
            </p>
            <button 
                onClick={() => setInstallStatus('idle')} 
                className="w-full py-4 bg-slate-900 rounded-2xl font-bold text-white shadow-lg hover:bg-slate-800 active:scale-95 transition-all"
            >
                Understood
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;