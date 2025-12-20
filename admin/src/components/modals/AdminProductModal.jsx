import React, { useState } from 'react';
import { X, Loader2, Package } from 'lucide-react';

const AdminProductModal = ({ isOpen, onClose, onSubmit, loading }) => {
    const [form, setForm] = useState({ label: '', costPrice: '', sellingPrice: '', wholesalePrice: '', unit: 'pcs' });

    if (!isOpen) return null;

    const handleSubmit = () => {
        onSubmit(form);
        setForm({ label: '', costPrice: '', sellingPrice: '', wholesalePrice: '', unit: 'pcs' }); // Reset
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-sm rounded-4xl p-6 shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-black flex items-center gap-2">
                        <Package className="text-slate-900"/> Add Product
                    </h2>
                    <button onClick={onClose} className="p-2 bg-slate-50 rounded-full"><X size={20}/></button>
                </div>

                <div className="space-y-4">
                    <input autoFocus type="text" placeholder="Product Name" className="w-full p-3 bg-slate-50 rounded-xl font-bold outline-none border focus:border-slate-900" value={form.label} onChange={e => setForm({...form, label: e.target.value})} />
                    
                    <div className="grid grid-cols-2 gap-3">
                         {/* Selling Price */}
                         <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase">Selling Price</label>
                            <input type="number" placeholder="0" className="w-full p-3 bg-slate-50 rounded-xl font-bold outline-none" value={form.sellingPrice} onChange={e => setForm({...form, sellingPrice: e.target.value})} />
                        </div>
                        {/* Cost Price */}
                        <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase">Cost Price</label>
                            <input type="number" placeholder="0" className="w-full p-3 bg-slate-50 rounded-xl font-bold outline-none" value={form.costPrice} onChange={e => setForm({...form, costPrice: e.target.value})} />
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                        {/* Wholesale Price */}
                        <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase">Wholesale</label>
                            <input type="number" placeholder="0" className="w-full p-3 bg-slate-50 rounded-xl font-bold outline-none" value={form.wholesalePrice} onChange={e => setForm({...form, wholesalePrice: e.target.value})} />
                        </div>
                         {/* Unit */}
                         <div>
                            <label className="text-[10px] font-bold text-slate-400 uppercase">Unit</label>
                            <input type="text" placeholder="pcs" className="w-full p-3 bg-slate-50 rounded-xl font-bold outline-none" value={form.unit} onChange={e => setForm({...form, unit: e.target.value})} />
                        </div>
                    </div>

                    <button disabled={loading} onClick={handleSubmit} className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl mt-4 flex justify-center">
                        {loading ? <Loader2 className="animate-spin"/> : "Create Product"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminProductModal;