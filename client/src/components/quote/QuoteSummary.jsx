import React from 'react';
import { Calculator, IndianRupee } from 'lucide-react';

const QuoteSummary = ({ total, extraFare, discount, onFareChange, onDiscountChange }) => {
    const finalTotal = (total + (parseFloat(extraFare) || 0) - (parseFloat(discount) || 0));

    return (
        <div className="mt-4 px-4 space-y-3 pb-8">
            <div className="no-print bg-white p-3 rounded-lg border border-gray-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-600 text-sm"><div className="bg-blue-50 p-1 rounded text-blue-600"><Calculator size={14} /></div><span>Extra Charges</span></div>
                    <input type="number" placeholder="0" value={extraFare} onChange={(e) => onFareChange(e.target.value)} className="w-28 pl-3 pr-2 py-1 border border-gray-200 rounded-lg text-right text-sm outline-none" />
                </div>
                <div className="h-px bg-gray-100 w-full"></div>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-600 text-sm"><div className="bg-red-50 p-1 rounded text-red-500"><IndianRupee size={16} /></div><span>Discount</span></div>
                    <input type="number" placeholder="0" value={discount} onChange={(e) => onDiscountChange(e.target.value)} className="w-28 pl-3 pr-2 py-1 border border-red-200 rounded-lg text-right text-sm text-red-600 outline-none" />
                </div>
            </div>

            <div className="space-y-1 text-sm text-gray-800 px-2 pt-2 border-t border-gray-200">
                <div className="flex justify-between"><span>Subtotal</span><span className="font-medium">₹{(total).toFixed(0)}</span></div>
                {parseFloat(extraFare) > 0 && <div className="flex justify-between text-blue-700"><span>Extra Charges</span><span>+ ₹{extraFare}</span></div>}
                {parseFloat(discount) > 0 && <div className="flex justify-between text-red-600"><span>Discount Applied</span><span>- ₹{discount}</span></div>}
                <div className="flex justify-between text-lg font-bold border-t border-gray-300 pt-2 mt-2"><span>Grand Total</span><span>₹{finalTotal.toFixed(2)}</span></div>
            </div>
        </div>
    );
};

export default QuoteSummary;