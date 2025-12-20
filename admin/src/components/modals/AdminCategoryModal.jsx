import React, { useState, useEffect } from 'react';
import { X, Loader2, Save } from 'lucide-react';

const AdminCategoryModal = ({ isOpen, onClose, onSubmit, initialData = null, type = 'Category' }) => {
    const [name, setName] = useState('');
    const [desc, setDesc] = useState('');

    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
            setDesc(initialData.desc || '');
        } else {
            setName('');
            setDesc('');
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = () => onSubmit({ name, desc });

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-sm rounded-4xl p-6 shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-lg font-black">{initialData ? 'Edit' : 'Add'} {type}</h2>
                    <button onClick={onClose} className="p-2 bg-slate-50 rounded-full"><X size={20}/></button>
                </div>
                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-slate-400 uppercase ml-1">Name</label>
                        <input autoFocus type="text" className="w-full p-3 bg-slate-50 rounded-xl font-bold outline-none border focus:border-slate-900" value={name} onChange={e => setName(e.target.value)} />
                    </div>
                    {type === 'Category' && (
                        <div>
                            <label className="text-xs font-bold text-slate-400 uppercase ml-1">Description (Optional)</label>
                            <input type="text" className="w-full p-3 bg-slate-50 rounded-xl font-medium outline-none border focus:border-slate-900" value={desc} onChange={e => setDesc(e.target.value)} />
                        </div>
                    )}
                    <button onClick={handleSubmit} className="w-full py-3.5 bg-slate-900 text-white font-bold rounded-xl mt-2 flex justify-center gap-2">
                        <Save size={18} /> Save
                    </button>
                </div>
            </div>
        </div>
    );
};
export default AdminCategoryModal;