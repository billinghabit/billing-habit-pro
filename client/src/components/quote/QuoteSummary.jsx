import React from 'react';
import { Calculator, IndianRupee, Truck, Percent } from 'lucide-react';

const QuoteSummary = ({ total, extraFare, discount, onFareChange, onDiscountChange }) => {
    const finalTotal = (total + (parseFloat(extraFare) || 0) - (parseFloat(discount) || 0));

    // --- Theme Accents ---
    const primaryText = 'text-slate-900';
    const primaryRing = 'focus:ring-slate-900/10';
    const primaryBorder = 'focus:border-slate-900';

    return (
        <div className="mt-4 px-4 space-y-2 pb-4 ">
            
            {/* Input Section Card */}
            <div className="no-print bg-white p-4 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                
                {/* Extra Charges Input */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-gray-700 text-sm font-medium">
                        <div className="bg-blue-50 p-2 rounded-lg text-blue-900">
                            <Truck size={16} strokeWidth={2.5} />
                        </div>
                        <span>Extra / Delivery</span>
                    </div>
                    <div className="relative">
                        <span className="absolute left-3 top-2 text-gray-400 text-xs font-bold">₹</span>
                        <input 
                            type="number" 
                            placeholder="0" 
                            value={extraFare} 
                            onChange={(e) => onFareChange(e.target.value)} 
                            className={`w-28 pl-6 pr-3 py-1.5 border border-gray-200 rounded-xl text-right text-sm font-bold text-gray-800 outline-none transition-all focus:ring-2 ${primaryRing} ${primaryBorder}`} 
                        />
                    </div>
                </div>

                <div className=" bg-gray-50 w-full"></div>

                {/* Discount Input */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-gray-700 text-sm font-medium">
                        <div className="bg-amber-50 p-2 rounded-lg text-amber-600">
                            <Percent size={16} strokeWidth={2.5} />
                        </div>
                        <span>Discount</span>
                    </div>
                    <div className="relative">
                        <span className="absolute left-3 top-2 text-red-400 text-xs font-bold">-₹</span>
                        <input 
                            type="number" 
                            placeholder="0" 
                            value={discount} 
                            onChange={(e) => onDiscountChange(e.target.value)} 
                            className={`w-28 pl-7 pr-3 py-1.5 border border-gray-200 rounded-xl text-right text-sm font-bold text-red-600 outline-none transition-all focus:ring-2 focus:ring-red-100 focus:border-red-400`} 
                        />
                    </div>
                </div>
            </div>

            {/* Summary Breakdown */}
            <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100 space-y-2 text-sm">
                
                {/* Subtotal */}
                <div className="flex justify-between items-center text-gray-500">
                    <span className="font-medium">Subtotal</span>
                    <span className="font-bold text-gray-700">₹{(total).toFixed(0)}</span>
                </div>
                
                {/* Extra Charges Line Item */}
                {parseFloat(extraFare) > 0 && (
                    <div className="flex justify-between items-center text-blue-900 animate-in fade-in slide-in-from-top-1">
                        <span className="flex items-center gap-1 text-xs font-medium"><Truck size={12}/> Extra Charges</span>
                        <span className="font-bold">+ ₹{extraFare}</span>
                    </div>
                )}
                
                {/* Discount Line Item */}
                {parseFloat(discount) > 0 && (
                    <div className="flex justify-between items-center text-red-500 animate-in fade-in slide-in-from-top-1">
                        <span className="flex items-center gap-1 text-xs font-medium"><Percent size={12}/> Discount</span>
                        <span className="font-bold">- ₹{discount}</span>
                    </div>
                )}
                
                {/* Divider */}
                <div className="border-t border-gray-200 my-2"></div>
                
                {/* Grand Total */}
                <div className="flex justify-between items-end">
                    <span className={`text-base font-bold ${primaryText}`}>Grand Total</span>
                    <span className={`text-2xl font-black ${primaryText} tracking-tight`}>
                        ₹{finalTotal.toFixed(0)}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default QuoteSummary;