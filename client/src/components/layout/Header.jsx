import React, { useState } from 'react';
import { Menu, Crown, AlertCircle } from 'lucide-react'; 
import { useAppContext } from '../../context/AppContext.jsx';
import Sidebar from './Sidebar.jsx';

const Header = () => {
    const { user, navigate } = useAppContext();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const isPremium = user?.isPremium;
    const isTrial = user?.planType === 'trial';
    const formattedExpiry = user?.expiryDate 
        ? new Date(user.expiryDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })
        : null;

    const primaryBg = 'bg-linear-to-br from-blue-800 to-slate-900'; 
    const secondaryAccent = 'text-blue-400'; 

    return (
        <>
            {/* Header with Dark Gradient Background */}
            <div className={`${primaryBg} shadow-xl p-4 sticky top-0 z-30`}>
                <div className="mx-auto flex items-center justify-between">
                    
                    {/* --- LEFT: MENU TRIGGER & SHOP INFO --- */}
                    <div className='flex items-center gap-3 cursor-pointer' >  
                        
                        {/* 1. Menu Trigger (White for contrast) */}
                        <div onClick={() => setIsSidebarOpen(true)} className="p-1 rounded-full hover:bg-white/10 transition-colors active:scale-95">
                            <Menu className='text-white h-7 w-7' strokeWidth={2.5}/>
                        </div>

                        {/* 2. Shop Name/Address (White text for contrast) */}
                        <div onClick={() => navigate('/')}>
                            <h1 className="text-lg text-white font-extrabold leading-tight truncate max-w-[180px]">
                                {user?.shopName || 'Billing Habit'}
                            </h1>
                            <p className={`text-[10px] ${secondaryAccent} font-medium truncate max-w-[140px]`}>
                                {user?.address || 'Tap to start new bill'}
                            </p>
                        </div>
                    </div>

                    {/* --- RIGHT: SUBSCRIPTION BADGE --- */}
                    <div onClick={() => navigate('/pro')} className='cursor-pointer flex flex-col items-end'>
                        {isPremium ? (
                            <>
                                {/* Premium/Trial Badges (Amber/Blue accents) */}
                                <div className={`rounded-full px-3 py-1 flex items-center gap-1.5 border border-white/30 ${isTrial ? 'bg-blue-100 text-blue-900' : 'bg-amber-400 text-amber-950 shadow-md shadow-amber-300/50'}`}>
                                    <Crown size={14} className={isTrial ? "fill-blue-900" : "fill-amber-950"} />
                                    <span className='text-xs font-bold'>{isTrial ? 'Trial' : 'Pro'}</span>
                                </div>
                                <p className="text-[9px] text-gray-300 mt-1 font-medium tracking-wide mr-0.5">
                                    Exp: {formattedExpiry}
                                </p>
                            </>
                        ) : (
                            // Free Plan Badge (High contrast white/red)
                            <div className='bg-white/90 border border-white/50 rounded-full px-3 py-1 flex items-center gap-1.5 text-red-600 shadow-sm'>
                                <AlertCircle size={14} />
                                <span className='text-xs font-bold'>Free Plan</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
        </>
    );
};

export default Header;