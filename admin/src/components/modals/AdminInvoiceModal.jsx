import React from 'react';
import { X, FileText, User, MapPin, Calendar, Truck, Percent } from 'lucide-react';

const AdminInvoiceModal = ({ isOpen, onClose, quote }) => {
    if (!isOpen || !quote) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-lg rounded-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                
                {/* Header */}
                <div className="bg-slate-900 p-6 text-white flex justify-between items-start">
                    <div>
                        <h2 className="text-xl font-black flex items-center gap-2">
                            <FileText size={20} className="text-blue-400"/> Invoice Details
                        </h2>
                        <p className="text-slate-400 text-xs mt-1">ID: {quote._id.slice(-6).toUpperCase()}</p>
                    </div>
                    <button onClick={onClose} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Body - Scrollable */}
                <div className="p-6 overflow-y-auto">
                    {/* Customer Info */}
                    <div className="bg-slate-50 p-4 rounded-2xl mb-6 border border-slate-100">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="bg-blue-100 p-2 rounded-full text-blue-700"><User size={16}/></div>
                            <span className="font-bold text-slate-800">{quote.customer?.name}</span>
                        </div>
                        <div className="pl-11 text-xs text-slate-500 space-y-1">
                            {quote.customer?.number && <p>+91 {quote.customer?.number}</p>}
                            {quote.customer?.address && <p className="flex items-start gap-1"><MapPin size={12} className="mt-0.5"/> {quote.customer?.address}</p>}
                        </div>
                    </div>

                    {/* Items Table */}
                    <div className="space-y-3">
                        <h3 className="text-xs font-black uppercase text-slate-400 tracking-wider">Billed Items</h3>
                        {quote.items.map((item, i) => (
                            <div key={i} className="flex justify-between items-center py-3 border-b border-slate-50 last:border-0">
                                <div>
                                    <p className="font-bold text-slate-900">{item.productLabel}</p>
                                    <p className="text-xs text-slate-400">
                                        ₹{item.sellingPrice} × {item.quantity} {item.unit}
                                    </p>
                                </div>
                                <p className="font-black text-slate-800">₹{item.sellingPrice * item.quantity}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer - Totals */}
                <div className="bg-slate-50 p-6 border-t border-slate-100 space-y-2">
                    {quote.extraFare > 0 && (
                        <div className="flex justify-between text-sm text-blue-600">
                            <span className="flex items-center gap-1"><Truck size={14}/> Extra Charges</span>
                            <span className="font-bold">+ ₹{quote.extraFare}</span>
                        </div>
                    )}
                    {quote.discount > 0 && (
                        <div className="flex justify-between text-sm text-red-500">
                            <span className="flex items-center gap-1"><Percent size={14}/> Discount</span>
                            <span className="font-bold">- ₹{quote.discount}</span>
                        </div>
                    )}
                    <div className="flex justify-between items-end pt-2 border-t border-slate-200 mt-2">
                        <span className="text-sm font-bold text-slate-500">Grand Total</span>
                        <span className="text-3xl font-black text-slate-900">₹{quote.totalAmount}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminInvoiceModal;