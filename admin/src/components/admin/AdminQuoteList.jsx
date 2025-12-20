import React, { useState } from 'react';
import { FileText, Calendar, CheckCircle, TrendingUp } from 'lucide-react';
import AdminInvoiceModal from '../modals/AdminInvoiceModal';
import AdminProfitModal from '../modals/AdminProfitModal';

const AdminQuoteList = ({ quotes }) => {
    const [invoiceQuote, setInvoiceQuote] = useState(null); // For Invoice View
    const [profitQuoteId, setProfitQuoteId] = useState(null); // For Profit View

    return (
        <>
            <div className="space-y-3">
                {quotes.map(q => (
                    <div key={q._id} className="bg-white p-5 rounded-2xl border border-slate-100 flex justify-between items-center hover:border-slate-300 transition-all">
                        
                        {/* Left Side: Click to view INVOICE */}
                        <div className="flex items-center gap-4 cursor-pointer flex-1" onClick={() => setInvoiceQuote(q)}>
                            <div className={`p-3 rounded-xl ${q.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-amber-50 text-amber-600'}`}>
                                {q.status === 'Delivered' ? <CheckCircle size={20}/> : <FileText size={20}/>}
                            </div>
                            <div>
                                <p className="font-bold text-lg text-slate-900 hover:text-blue-600 transition-colors">{q.customer?.name || "Unknown"}</p>
                                <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                                    <Calendar size={12}/> {new Date(q.createdAt).toLocaleDateString()}
                                    <span className="bg-slate-100 px-2 py-0.5 rounded-full text-slate-600">{q.status}</span>
                                    <span className="bg-amber-200 px-2 py-0.5 rounded-full text-slate-600">{q.quoteType}</span>
                                </div>
                            </div>
                        </div>

                        {/* Right Side: Actions */}
                        <div className="text-right flex items-center gap-4">
                            <div>
                                <p className="font-black text-xl">₹{q.totalAmount}</p>
                                <p className="text-xs text-slate-400">Total Bill</p>
                            </div>
                            
                            {/* Profit Button */}
                            <button 
                                onClick={() => setProfitQuoteId(q._id)} 
                                className="p-3 bg-green-50 text-green-600 rounded-xl hover:bg-green-100 transition-colors"
                                title="View Profit"
                            >
                                <TrendingUp size={20} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Modals */}
            <AdminInvoiceModal isOpen={!!invoiceQuote} onClose={() => setInvoiceQuote(null)} quote={invoiceQuote} />
            <AdminProfitModal isOpen={!!profitQuoteId} onClose={() => setProfitQuoteId(null)} quoteId={profitQuoteId} />
        </>
    );
};
export default AdminQuoteList;