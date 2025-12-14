import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Download as DownloadIcon,
  CheckCircle2,
  Store,
  Zap,
  ShieldCheck,
} from 'lucide-react';
import { useAppContext } from '../context/AppContext.jsx';

const isPWA = () =>
  window.matchMedia('(display-mode: standalone)').matches ||
  window.navigator.standalone === true;

const LandingPage = () => {
  const { user } = useAppContext();
  const navigate = useNavigate();

  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isReadyForInstall, setIsReadyForInstall] = useState(false);
  const [installStatus, setInstallStatus] = useState('idle');
  const [progress, setProgress] = useState(0);


  /* ------------------- Install Prompt Listener ------------------- */
  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsReadyForInstall(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () =>
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt
      );
  }, []);

  /* ------------------- Fake Install Progress ------------------- */
  const startFakeInstall = () => {
    setInstallStatus('downloading');
    let currentProgress = 0;

    const interval = setInterval(() => {
      currentProgress += Math.floor(Math.random() * 10) + 5;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
        setInstallStatus('installed');

        setTimeout(() => {
          navigate(user ? '/home' : '/login', { replace: true });
        }, 1500);
      }
      setProgress(currentProgress);
    }, 200);
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

  /* ------------------- UI ------------------- */
  return (
    <div className="min-h-screen bg-white flex flex-col items-center p-4 pt-16 font-sans">
      <div className="w-full max-w-sm text-center">
        {/* Logo / Header */}
        <div className="mb-8 flex flex-col items-center">
          <div className="w-24 h-24 bg-linear-to-br from-primaryColor to-green-800 rounded-3xl flex items-center justify-center shadow-lg shadow-green-500/30">
            <Store size={40} className="text-white" />
          </div>
          <h1 className="text-4xl font-black text-gray-900 mt-4">
            Billing Habit
          </h1>
          <p className="text-sm font-medium text-gray-400 mt-1 uppercase tracking-wider">
            Your Digital Shop Manager
          </p>
        </div>

        {/* Idle State */}
        {installStatus === 'idle' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <p className="text-gray-600 text-base leading-relaxed">
              Manage inventory, generate instant quotes, and track profit margins
              with our dedicated app experience.
            </p>

            {/* Buttons */}
            <div className="space-y-3">
              {isReadyForInstall && (
                <button
                  onClick={handleInstallClick}
                  className="w-full py-4 bg-primaryColor text-white font-bold rounded-xl shadow-lg shadow-green-600/20 active:scale-95 transition-all flex items-center justify-center gap-2 hover:bg-green-700"
                >
                  <DownloadIcon size={20} />
                  Install App & Go Offline
                </button>
              )}

              <button
                onClick={() => navigate('/login')}
                className={`w-full py-4 font-bold rounded-xl active:scale-95 transition-all flex items-center justify-center gap-2 ${
                  isReadyForInstall
                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    : 'bg-primaryColor text-white shadow-lg shadow-green-600/20 hover:bg-green-700'
                }`}
              >
                <Zap size={20} />
                Continue to Web App
              </button>

              {!isReadyForInstall && (
                <p className="text-xs text-gray-400 pt-2">
                  *If install button doesn&apos;t appear, use your browser menu →
                  “Add to Home Screen”.
                </p>
              )}
            </div>

            <div className="flex items-center justify-center gap-4 text-xs font-medium text-gray-500 pt-4">
              <span className="flex items-center gap-1">
                <ShieldCheck size={14} /> Secure
              </span>
              <span className="w-1 h-1 bg-gray-400 rounded-full" />
              <span className="flex items-center gap-1">
                <Store size={14} /> Retail Focused
              </span>
            </div>
          </div>
        )}

        {/* Downloading */}
        {installStatus === 'downloading' && (
          <div className="mt-8 animate-in fade-in duration-300">
            <div className="flex justify-between text-xs font-bold text-gray-500 mb-2">
              <span>Installing PWA...</span>
              <span>{progress}%</span>
            </div>
            <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-200 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Installed */}
        {installStatus === 'installed' && (
          <div className="mt-4 animate-in zoom-in duration-300">
            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={32} />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Installed!</h2>
            <p className="text-gray-500 text-sm mt-1">
              Launching application...
            </p>
          </div>
        )}
      </div>
      {/* Alert Modal for No Install Support */}
      {installStatus === 'alert-no-support' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xs p-6 text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 text-yellow-600">
              <Zap size={28} />
            </div>
            <h3 className="text-lg font-bold mb-2">Browser Restriction</h3>
            <p className="text-sm text-gray-500 mb-6">
              Please use your browser's menu (usually 3 dots) to select "Add to Home Screen" or "Install App".
            </p>
            <button 
                onClick={() => setInstallStatus('idle')} 
                className="w-full py-2.5 bg-primaryColor rounded-xl font-bold text-white hover:bg-green-700"
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
