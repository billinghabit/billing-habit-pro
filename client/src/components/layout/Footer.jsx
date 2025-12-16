import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext.jsx'; 
import { Home, FileText, Package } from 'lucide-react';

const Footer = () => {
    const { navigate } = useAppContext();
    const location = useLocation();
    const currentPath = location.pathname;

    const navLinks = [
        { name: 'Home', icon: Home, path: '/home' }, 
        { name: 'Product', icon: Package, path: '/manage-products' },
        { name: 'History', icon: FileText, path: '/history' },
    ];

    // --- Styling Variables ---
    const activeColor = 'text-slate-900'; 
    const inactiveColor = 'text-gray-400';
    const activeBg = 'bg-slate-100'; 

    return (
        <footer className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 shadow-[0_-5px_15px_rgba(0,0,0,0.05)] safe-area-pb">
            <div className="grid grid-cols-3 h-16">
                {navLinks.map((link) => {
                    const isHome = link.path === '/home';
                    const isActive = isHome 
                        ? (currentPath === '/home' || currentPath.startsWith('/sub-category') || currentPath.startsWith('/products') || currentPath.startsWith('/customer') || currentPath.startsWith('/view-quote'))
                        : currentPath.startsWith(link.path);
                    
                    return (
                        <button
                            key={link.name}
                            onClick={() => navigate(link.path)}
                            className={`relative flex flex-col items-center justify-center gap-1 transition-all duration-200 active:scale-95 group 
                                ${isActive ? activeColor : inactiveColor}`}
                        >
                            {/* Pill Background Highlight */}
                            <div className={`absolute top-2 bottom-2 w-16 rounded-xl transition-all duration-300 
                                ${isActive ? activeBg : 'bg-transparent group-hover:bg-gray-50'}`} 
                            />
                            
                            {/* Icon */}
                            <link.icon 
                                size={24} 
                                strokeWidth={isActive ? 2.5 : 2} 
                                className="relative z-10 transition-transform duration-200" 
                            />
                            
                            {/* Label */}
                            <span className={`text-[10px] font-bold relative z-10 transition-opacity ${isActive ? 'opacity-100' : 'opacity-80'}`}>
                                {link.name}
                            </span>
                        </button>
                    );
                })}
            </div>
        </footer>
    );
};

export default Footer;