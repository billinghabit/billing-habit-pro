import React from 'react';
import { Pencil, Check } from 'lucide-react';

const QuoteItemRow = ({ item, isEditing, onEditClick, onUpdate, isWholesaleMode }) => {
    
    // Check Modified Status against ACTIVE mode price
    const referencePrice = isWholesaleMode ? item.wholesalePrice : item.retailPrice;
    const isModified = item.sellingPrice !== referencePrice;

    // --- Theme Accents ---
    const activeEditBg = 'bg-slate-50';
    const primaryFocusRing = 'focus:ring-slate-900/20';
    const primaryBorder = 'focus:border-slate-900';

    return (
        <div className={`grid grid-cols-15 gap-1 items-center px-3 py-2.5 border-b border-gray-50 transition-colors ${isEditing ? activeEditBg : 'bg-white hover:bg-gray-50/50'}`}>
            
            {/* 1. Name Section (col-span-4 to save space for numbers) */}
            <div className="col-span-6 flex flex-col justify-center min-w-0 pr-1">
                <span className={`text-sm font-semibold leading-snug truncate ${isEditing ? 'text-slate-900' : 'text-gray-700'}`}>
                    {item.label}
                </span>
                {isModified && !isEditing && (
                    <div className="no-print leading-3.5">
                        <span className="text-[9px] font-bold text-slate-900 bg-blue-50 px-1 py-0.5 rounded border border-gray-100 tracking-wide uppercase">
                            Price Modified
                        </span>
                    </div>
                )}
            </div>

            {/* 2. Quantity (col-span-2) */}
            <div className="col-span-2 flex justify-center items-center">
                {isEditing ? (
                    // EDIT MODE: Input takes full width, NO UNIT shown
                    <input 
                        type="number" 
                        inputMode="numeric"
                        className={`w-full min-w-10 border border-gray-300 rounded-lg px-1 py-0.5 text-center text-sm font-bold text-gray-800 focus:outline-none focus:ring-2 ${primaryFocusRing} ${primaryBorder} transition-all`} 
                        value={item.quantity} 
                        onChange={(e) => onUpdate(item._id, 'quantity', e.target.value)} 
                    />
                ) : (
                    // VIEW MODE: Show Qty + Unit
                    <div className="flex w-full items-baseline gap-0.5 bg-gray-100 px-1 py-0.5 rounded-md max-w-full justify-center">
                        <span className="text-sm font-bold text-gray-700 truncate ">{item.quantity}</span>
                        <span className="text-[10px] text-gray-400 font-medium truncate">{item.unit}</span>
                    </div>
                )}
            </div>

            {/* 3. Price Section (col-span-3 for bigger numbers) */}
            <div className="col-span-3 flex justify-end">
                {isEditing ? (
                    <input 
                        type="number" 
                        inputMode="numeric"
                        className={`w-full min-w-[50px] border border-gray-300 rounded-lg px-1 py-0.5 text-right text-sm font-bold text-gray-800 focus:outline-none focus:ring-2 ${primaryFocusRing} ${primaryBorder} transition-all`} 
                        value={item.sellingPrice} 
                        onChange={(e) => onUpdate(item._id, 'sellingPrice', e.target.value)} 
                    />
                ) : (
                    <span className={`text-sm font-medium truncate ${isModified ? 'text-blue-900' : 'text-gray-600'}`}>
                        ₹{item.sellingPrice}
                    </span>
                )}
            </div>

            {/* 4. Total & Action Section (col-span-3) */}
            <div className="col-span-4 text-right flex items-center justify-end gap-2 whitespace-nowrap pl-1">
                <span className="text-sm font-black text-slate-900 truncate">
                    ₹{item.total.toFixed(0)}
                </span>
                
                <button 
                    onClick={() => onEditClick(isEditing ? null : item._id)} 
                    className={`p-1.5 rounded-full no-print transition-all active:scale-90 shadow-sm shrink-0
                        ${isEditing 
                            ? 'bg-slate-900 text-slate-100 hover:bg-slate-200' 
                            : 'bg-white border border-gray-100 text-gray-400 hover:border-slate-300 hover:text-slate-700'
                        }`}
                >
                    {isEditing ? <Check size={14} strokeWidth={3} /> : <Pencil size={12} strokeWidth={2.5}/>}
                </button>
            </div>
        </div>
    );
};

export default QuoteItemRow;