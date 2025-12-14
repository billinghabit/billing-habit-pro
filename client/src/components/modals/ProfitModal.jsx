import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext.jsx';
import toast from 'react-hot-toast';
import { Loader2, X, KeyRound, TrendingUp, TrendingDown } from 'lucide-react';

const ProfitModal = ({ isOpen, onClose, items, extraFare, discount }) => {
    const { axios } = useAppContext();
    const [step, setStep] = useState('pin'); 
    const [pin, setPin] = useState('');
    const [verifying, setVerifying] = useState(false);
    const [loadingData, setLoadingData] = useState(false);
    const [profitItems, setProfitItems] = useState([]);
    const [totalProfit, setTotalProfit] = useState(0);

    useEffect(() => {
        if (isOpen) { setStep('pin'); setPin(''); setProfitItems([]); }
    }, [isOpen]);

    const handleVerifyPin = async (e) => {
        e.preventDefault();
        if (pin.length !== 4) return toast.error("Enter 4-digit PIN");
        setVerifying(true);
        try {
            const res = await axios.post('/user/verify-pin', { pin });
            if (res.data.success) { setStep('view'); fetchProfitData(); }
        } catch (error) { toast.error("Invalid PIN"); setPin(''); } finally { setVerifying(false); }
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

            setTotalProfit(calcTotal - (parseFloat(discount) || 0));
            setProfitItems(computedItems);
        } catch (error) { toast.error("Failed to calculate profit"); onClose(); } finally { setLoadingData(false); }
    };

    if (!isOpen) return null;
    const isLoss = totalProfit < 0;
    const ThemeIcon = isLoss ? TrendingDown : TrendingUp;

    return (
        <div className="fixed inset-0 z-90 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
                <div className="p-4 border-b flex justify-between items-center bg-gray-50">
                    <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">{step === 'pin' ? <KeyRound size={20}/> : <ThemeIcon size={20} className={isLoss ? "text-red-600" : "text-green-600"}/>}{step === 'pin' ? 'Security Check' : 'Profit Analysis'}</h2>
                    <button onClick={onClose} className="p-1 hover:bg-gray-200 rounded-full"><X size={24} className="text-gray-500" /></button>
                </div>
                <div className="p-4 overflow-y-auto">
                    {step === 'pin' && (
                        <div className="py-8 flex flex-col items-center">
                            <p className="text-gray-600 mb-6 text-center">Enter your 4-digit PIN to unlock<br/>sensitive profit data.</p>
                            <form onSubmit={handleVerifyPin} className="w-full max-w-[200px]">
                                <input autoFocus type="password" inputMode="numeric" maxLength={4} value={pin} onChange={(e) => setPin(e.target.value)} className="w-full text-center text-4xl tracking-[0.5em] font-bold border-b-2 border-gray-300 focus:border-primaryColor outline-none py-2 mb-8 bg-transparent" placeholder="••••" />
                                <button disabled={verifying} className="w-full bg-primaryColor text-white py-3 rounded-lg font-semibold hover:bg-green-700 flex justify-center">{verifying ? <Loader2 className="animate-spin"/> : "Access"}</button>
                            </form>
                        </div>
                    )}
                    {step === 'view' && (
                        <>
                            {loadingData ? <div className="py-12 flex justify-center"><Loader2 className="animate-spin text-primaryColor" size={40}/></div> : (
                                <div className="space-y-4">
                                    <div className="border rounded-lg overflow-hidden">
                                        <div className="bg-gray-100 px-3 py-2 grid grid-cols-15 text-xs font-semibold text-gray-600"><div className="col-span-6">Item</div><div className="col-span-2 text-center">Qty</div><div className="col-span-3 text-center">Profit</div><div className="col-span-4 text-right">Total</div></div>
                                        <div className="divide-y max-h-[40vh] overflow-auto">
                                            {profitItems.map(item => (<div key={item.id} className="px-3 py-2 grid grid-cols-15 text-sm items-center"><div className="col-span-6 font-medium truncate">{item.label}</div><div className="col-span-2 text-center text-gray-500">{item.qty}</div><div className="col-span-3 text-center text-gray-500">{item.profitPerPcs}</div><div className={`col-span-4 text-right font-bold ${item.totalItemProfit < 0 ? 'text-red-500' : 'text-green-600'}`}>{item.totalItemProfit < 0 ? '-' : ''}₹{Math.abs(item.totalItemProfit).toFixed(0)}</div></div>))}
                                        </div>
                                    </div>
                                    {discount>0 && (
                                    <div className="px-5 flex justify-between items-center ">
                                        <div><p className="text-xs font-bold uppercase text-yellow-700">Discount</p></div>
                                        <div className="text-xs font-black text-yellow-700">- ₹{discount}</div>
                                    </div>
                                    )}
                                    <div className={`p-4 rounded-xl border flex justify-between items-center ${isLoss ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'}`}>
                                        <div><p className={`text-xs font-bold uppercase ${isLoss ? 'text-red-600' : 'text-green-600'}`}>{isLoss ? 'Net Loss' : 'Net Profit'}</p></div>
                                        <div className={`text-3xl font-black ${isLoss ? 'text-red-700' : 'text-green-700'}`}>₹{totalProfit.toFixed(0)}</div>
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