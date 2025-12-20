import React, { useState } from 'react';
import { X, Loader2 } from 'lucide-react';

const AddProductModal = ({ isOpen, onClose, onSubmit, isCreating }) => {
    const [formData, setFormData] = useState({ label: '', sellingPrice: '', wholesalePrice: '', costPrice: '', unit: 'pcs' });

    // --- Theme Accents ---
    const primaryAccentBg = 'bg-slate-900';
    const primaryAccentRing = 'focus:ring-slate-900/30';

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        // Reset form after submission if needed, though usually handled by parent closing/resetting
        setFormData({ label: '', sellingPrice: '', wholesalePrice: '', costPrice: '', unit: 'pcs' });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="px-5 py-4 border-b flex justify-between items-center bg-gray-50">
                    <h3 className="font-bold text-lg text-gray-800">Add New Product</h3>
                    <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full transition-colors"><X size={20} className="text-gray-500" /></button>
                </div>
                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Product Name</label>
                        <input 
                            required 
                            type="text" 
                            placeholder="e.g. 10mm Wire" 
                            className={`w-full p-3 border border-gray-300 rounded-xl outline-none focus:ring-2 ${primaryAccentRing}`} 
                            value={formData.label} 
                            onChange={e => setFormData({...formData, label: e.target.value})} 
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Cost Price (₹)</label>
                            <input 
                                required 
                                type="number" 
                                placeholder="0" 
                                className={`w-full p-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/50`} 
                                value={formData.costPrice} 
                                onChange={e => setFormData({...formData, costPrice: e.target.value})} 
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Retail Price (₹)</label>
                            <input 
                                required 
                                type="number" 
                                placeholder="0" 
                                className={`w-full p-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/50`} 
                                value={formData.sellingPrice} 
                                onChange={e => setFormData({...formData, sellingPrice: e.target.value})} 
                            />
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-purple-600 uppercase mb-1 ml-1">Wholesale (Opt)</label>
                            <input 
                                type="number" 
                                placeholder="0" 
                                className="w-full p-3 border border-purple-200 bg-purple-50 rounded-xl outline-none focus:ring-2 focus:ring-purple-500/50" 
                                value={formData.wholesalePrice} 
                                onChange={e => setFormData({...formData, wholesalePrice: e.target.value})} 
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Unit</label>
                            <input 
                                type="text" 
                                placeholder="pcs, kg" 
                                className="w-full p-3 border border-gray-300 bg-gray-50 rounded-xl outline-none" 
                                value={formData.unit} 
                                onChange={e => setFormData({...formData, unit: e.target.value})} 
                            />
                        </div>
                    </div>
                    
                    <button 
                        type="submit" 
                        disabled={isCreating} 
                        className={`w-full py-3.5 ${primaryAccentBg} text-white font-bold rounded-xl mt-2 flex justify-center items-center gap-2 hover:bg-slate-800 active:scale-[0.98] transition-all`}
                    >
                        {isCreating ? <Loader2 className="animate-spin" size={20}/> : "Save Product"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddProductModal;