import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext.jsx';
import toast from 'react-hot-toast';
import { Loader2, X, Lock, TrendingUp, TrendingDown, ShieldCheck } from 'lucide-react';

const ProfitModal = ({ isOpen, onClose, items, extraFare, discount }) => {
    const { axios } = useAppContext();
    const [step, setStep] = useState('pin'); 
    const [pin, setPin] = useState('');
    const [verifying, setVerifying] = useState(false);
    const [loadingData, setLoadingData] = useState(false);
    const [profitItems, setProfitItems] = useState([]);
    const [totalProfit, setTotalProfit] = useState(0);
    const [grossProfit, setGrossProfit] = useState(0);

    // --- Theme Accents ---
    const primaryAccentBg = 'bg-slate-900';
    const primaryAccentText = 'text-slate-900';

    useEffect(() => {
        if (isOpen) { 
            setStep('pin'); 
            setPin(''); 
            setProfitItems([]); 
            setGrossProfit(0);
            setTotalProfit(0);
        }
    }, [isOpen]);

    const handleVerifyPin = async (e) => {
        e.preventDefault();
        if (pin.length !== 4) return toast.error("Enter 4-digit PIN");
        setVerifying(true);
        try {
            const res = await axios.post('/user/verify-pin', { pin });
            if (res.data.success) { 
                setStep('view'); 
                fetchProfitData(); 
            }
        } catch (error) { 
            toast.error("Invalid PIN"); 
            setPin(''); 
        } finally { 
            setVerifying(false); 
        }
    };

    const fetchProfitData = async () => {
        setLoadingData(true);
        try {
            const productIds = items.map(i => i._id || i.product);
            const res = await axios.post('/product/get-profit-details', { productIds });
            const dbProducts = res.data.products;
            const costMap = {};
            dbProducts.forEach(p => costMap[p._id] = p.costPrice);

            let calcTotal = 0;
            const computedItems = items.map(item => {
                const id = item._id || item.product;
                const sellingPrice = item.sellingPrice;
                const costPrice = costMap[id] || 0;
                const qty = item.quantity;
                const profitPerPcs = (sellingPrice - costPrice);
                const totalItemProfit = profitPerPcs * qty;
                calcTotal += totalItemProfit;
                return { id, label: item.label || item.productLabel, qty, profitPerPcs, totalItemProfit };
            });

            setGrossProfit(calcTotal);
            setTotalProfit(calcTotal - (parseFloat(discount) || 0));
            setProfitItems(computedItems);
        } catch (error) { 
            toast.error("Failed to calculate profit"); 
            onClose(); 
        } finally { 
            setLoadingData(false); 
        }
    };

    if (!isOpen) return null;

    const isLoss = totalProfit < 0;
    const ThemeIcon = isLoss ? TrendingDown : TrendingUp;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
                
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        {step === 'pin' ? (
                            <div className="bg-slate-100 p-1.5 rounded-full text-slate-700"><Lock size={18}/></div>
                        ) : (
                            <div className={`p-1.5 rounded-full ${isLoss ? "bg-red-100 text-red-600" : "bg-green-100 text-green-600"}`}>
                                <ThemeIcon size={18}/>
                            </div>
                        )}
                        {step === 'pin' ? 'Security Check' : 'Profit Analysis'}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X size={20} className="text-gray-400" /></button>
                </div>

                <div className="p-6 overflow-y-auto">
                    {/* PIN ENTRY STEP */}
                    {step === 'pin' && (
                        <div className="py-6 flex flex-col items-center">
                            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 text-slate-400 shadow-inner">
                                <ShieldCheck size={32} />
                            </div>
                            <p className="text-gray-500 mb-8 text-center text-sm font-medium">Enter your 4-digit PIN to unlock<br/>sensitive business data.</p>
                            
                            <form onSubmit={handleVerifyPin} className="w-full max-w-[220px]">
                                <input 
                                    autoFocus 
                                    type="password" 
                                    inputMode="numeric" 
                                    maxLength={4} 
                                    value={pin} 
                                    onChange={(e) => setPin(e.target.value)} 
                                    className={`w-full text-center text-4xl tracking-[0.5em] font-bold border-b-2 border-gray-200 focus:border-slate-900 outline-none py-3 mb-8 bg-transparent transition-colors ${primaryAccentText}`} 
                                    placeholder="••••" 
                                />
                                <button 
                                    disabled={verifying} 
                                    className={`w-full ${primaryAccentBg} text-white py-3.5 rounded-xl font-bold shadow-lg shadow-slate-900/20 hover:bg-slate-800 flex justify-center transition-all active:scale-[0.98]`}
                                >
                                    {verifying ? <Loader2 className="animate-spin" size={20}/> : "Unlock Data"}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* PROFIT VIEW STEP */}
                    {step === 'view' && (
                        <>
                            {loadingData ? (
                                <div className="py-20 flex flex-col items-center gap-3 text-gray-400">
                                    <Loader2 className={`animate-spin ${primaryAccentText}`} size={32}/>
                                    <span className="text-xs font-bold uppercase tracking-wider">Calculating...</span>
                                </div>
                            ) : (
                                <div className="space-y-5">
                                    {/* Item Table */}
                                    <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                                        <div className="bg-gray-50 px-4 py-2.5 grid grid-cols-12 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                                            <div className="col-span-5">Item</div>
                                            <div className="col-span-2 text-center">Profit</div>
                                            <div className="col-span-2 text-center">Qty</div>
                                            <div className="col-span-3 text-right">Total</div>
                                        </div>
                                        <div className="divide-y divide-gray-50 max-h-[35vh] overflow-auto">
                                            {profitItems.map(item => (
                                                <div key={item.id} className="px-4 py-3 grid grid-cols-12 text-sm items-center hover:bg-gray-50/50 transition-colors">
                                                    <div className="col-span-5 font-semibold text-gray-700 truncate pr-2">{item.label}</div>
                                                     <div className={`col-span-2 text-center font-bold text-xs ${item.profitPerPcs < 0 ? 'text-red-500' : 'text-green-600'}`}>
                                                        {item.profitPerPcs}
                                                    </div>
                                                    <div className="col-span-2 text-center text-gray-500 font-medium bg-gray-50 rounded-md py-0.5 mx-1">{item.qty}</div>
                                                   
                                                    <div className={`col-span-3 text-right font-bold ${item.totalItemProfit < 0 ? 'text-red-500' : 'text-green-700'}`}>
                                                        {item.totalItemProfit < 0 ? '-' : ''}₹{Math.abs(item.totalItemProfit).toFixed(0)}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Summary Section */}
                                    <div className="space-y-2">
                                        {/* Gross Profit */}
                                        <div className="px-2 flex justify-between items-center text-sm">
                                            <span className="text-gray-500 font-medium">Gross Profit</span>
                                            <span className="text-gray-800 font-bold">₹{grossProfit.toFixed(0)}</span>
                                        </div>

                                        {/* Discount */}
                                        {parseFloat(discount) > 0 && (
                                            <div className="px-2 flex justify-between items-center text-sm">
                                                <span className="text-amber-600 font-medium">Less: Discount</span>
                                                <span className="text-amber-700 font-bold">- ₹{discount}</span>
                                            </div>
                                        )}

                                        {/* Divider */}
                                        <div className="border-t border-gray-100 my-2"></div>

                                        {/* Net Profit Card */}
                                        <div className={`p-5 rounded-2xl border flex justify-between items-center shadow-sm ${isLoss ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'}`}>
                                            <div>
                                                <p className={`text-xs font-bold uppercase tracking-wider mb-1 ${isLoss ? 'text-red-600' : 'text-green-600'}`}>
                                                    {isLoss ? 'Net Loss' : 'Net Profit'}
                                                </p>
                                                <p className="text-[10px] text-gray-500 font-medium">After deductions</p>
                                            </div>
                                            <div className={`text-4xl font-black tracking-tight ${isLoss ? 'text-red-700' : 'text-green-700'}`}>
                                                ₹{totalProfit.toFixed(0)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfitModal;