import React, { useEffect, useState } from 'react';
import adminAxios from '../../api/adminAxios';
import { X, TrendingUp } from 'lucide-react';

const AdminProfitModal = ({ isOpen, onClose, quoteId }) => {
    const [data, setData] = useState(null);

    useEffect(() => {
        if (isOpen && quoteId) {
            adminAxios.get(`/quote-analytics/${quoteId}`).then(res => setData(res.data));
        } else setData(null);
    }, [isOpen, quoteId]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-md rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-black flex items-center gap-2">
                        <TrendingUp className="text-green-600"/> Profit Report
                    </h2>
                    <button onClick={onClose} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200"><X size={20}/></button>
                </div>

                {!data ? <p className="text-center py-10 font-bold text-slate-400">Analyzing...</p> : (
                    <div className="space-y-4">
                        <div className="max-h-60 overflow-y-auto space-y-3 pr-2 scrollbar-hide">
                            {data.profitDetails.map((item, i) => (
                                <div key={i} className="flex justify-between text-sm border-b border-slate-50 pb-2">
                                    <span className="font-bold text-slate-700">{item.label}</span>
                                    <span className="font-black text-green-600">+₹{item.profit}</span>
                                </div>
                            ))}
                        </div>
                        <div>
                            <hr className="border-slate-100 my-2"/>
                        </div>
                        <div className="flex justify-between text-sm px-2">
                            <span className="font-bold text-red-500">Discount</span>
                            <span className="font-black text-red-500">- ₹{data.quote.discount}</span>
                        </div>
                        <div className="bg-slate-900 text-white p-6 rounded-3xl flex justify-between items-center shadow-xl shadow-slate-900/20">
                            <span className="text-slate-400 font-bold uppercase text-xs tracking-wider">Total Profit</span>
                            <span className="text-3xl font-black">₹{data.profitDetails.reduce((a,b)=>a+b.profit,0)- data.quote.discount}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
export default AdminProfitModal;