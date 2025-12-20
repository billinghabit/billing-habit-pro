import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext.jsx';
import { Trash2, FileText, AlertTriangle } from 'lucide-react'; // Added AlertTriangle
import toast from 'react-hot-toast';

const BottomNav = () => {
    const { list, setList, navigate } = useAppContext();
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // State for Custom Confirmation Modal
    const [showClearModal, setShowClearModal] = useState(false);

    // Check if there are items in the list
    const hasItems = list && Object.keys(list).length > 0;
    
    // Optional: Calculate total quantity for a badge (visual feedback)
    const totalItems = hasItems ? Object.values(list).reduce((a, b) => Number(a) + Number(b), 0) : 0;

    const handleClearClick = () => {
        if (!hasItems) return;
        setShowClearModal(true); // Open Modal instead of alert
    };

    const confirmClear = () => {
        setList({});
        toast.success("List cleared!");
        setShowClearModal(false);
    };

    const handleGetQuote = async () => {
        if (!hasItems) {
            toast.error("Please add items first");
            return; 
        }
        setIsSubmitting(true);
        navigate('/customer');
        setIsSubmitting(false);
    };

    return (
        <>
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 pb-6 z-20 shadow-[0_-5px_20px_rgba(0,0,0,0.05)]">
                <div className="flex items-center gap-3 max-w-lg mx-auto">
                    
                    {/* Clear Button (Secondary) */}
                    <button 
                        type="button" 
                        onClick={handleClearClick} 
                        disabled={!hasItems || isSubmitting}
                        className={`flex-1 py-3.5 px-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all active:scale-[0.98]
                            ${hasItems 
                                ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                                : 'bg-gray-50 text-gray-300 cursor-not-allowed'}`}
                    >
                        <Trash2 size={20} /> Clear
                    </button>

                    {/* Get Quote Button (Primary - Dark Slate) */}
                    <button 
                        type="button" 
                        onClick={handleGetQuote} 
                        disabled={!hasItems || isSubmitting}
                        className={`flex-1 py-3.5 px-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg
                            ${hasItems 
                                ? 'bg-slate-900 text-white shadow-slate-900/20 hover:bg-slate-800' 
                                : 'bg-gray-200 text-gray-400 shadow-none cursor-not-allowed'}`}
                    >
                        <FileText size={20} /> 
                        <span>Get Quote</span>
                        
                    </button>
                </div>
            </div>

            {/* Custom Clear Confirmation Modal */}
            {showClearModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-in fade-in duration-200 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xs p-6 text-center transform scale-100 animate-in zoom-in duration-200">
                        <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600 ring-4 ring-red-50/50">
                            <AlertTriangle size={32}/>
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-gray-900">Clear List?</h3>
                        <p className="text-sm text-gray-500 mb-6">Are you sure you want to remove all items from your quotation list?</p>
                        <div className="flex gap-3">
                            <button 
                                onClick={() => setShowClearModal(false)} 
                                className="flex-1 py-3 bg-gray-100 rounded-xl font-bold text-gray-700 hover:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={confirmClear} 
                                className="flex-1 py-3 bg-red-600 rounded-xl font-bold text-white shadow-lg shadow-red-500/30 hover:bg-red-700 transition-colors"
                            >
                                Yes, Clear
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default BottomNav;