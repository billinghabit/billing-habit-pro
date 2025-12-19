import React from 'react';
import { ArrowLeft, ChevronLeft } from 'lucide-react';
import { useAppContext } from '../../context/AppContext.jsx';

const Navbar = ({ title }) => {
    const { navigate } = useAppContext();
    const displayTitle = title || "Loading...";

    return (
        <div className='bg-linear-to-br from-blue-800 to-slate-900 shadow-md sticky top-0 z-50'>
            <div className="relative flex items-center justify-center h-14 px-4">
                <button 
                    onClick={() => navigate(-1)} 
                    className="absolute left-2 p-2 rounded-full hover:bg-white/10 active:scale-90 transition-all text-white"
                >
                    <ChevronLeft size={22} strokeWidth={2.5} />
                </button>
                <h1 className="text-lg font-bold text-white tracking-wide select-none truncate max-w-[70%]">
                    {displayTitle}
                </h1>
            </div>
        </div>
    );
};

export default Navbar;