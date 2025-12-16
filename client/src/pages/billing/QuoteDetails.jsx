import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { User, MapPin, Phone, Loader2, EyeOff, Download, Briefcase, ChevronDown, Save, FileText } from 'lucide-react';
import { useAppContext } from '../../context/AppContext.jsx';
import toast from 'react-hot-toast';

// Layout & Common Components
import Navbar from '../../components/layout/Navbar.jsx'; // Replaced Header
import ProfitModal from '../../components/modals/ProfitModal.jsx';
import CustomerInfo from "../../components/common/CustomerInfo.jsx";

// Quote Specific Components
import QuoteItemRow from '../../components/quote/QuoteItemRow.jsx'; 
import QuoteSummary from '../../components/quote/QuoteSummary.jsx';

// Utilities & Config
import { generatePDF } from '../../utils/generatePDF.js'; 
import { STATUS_COLORS } from '../../config/constants.js';

const QuoteDetails = () => {
    const { quoteId } = useParams();
    const { navigate, axios } = useAppContext();

    // --- State Management ---
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    
    const [quote, setQuote] = useState(null); 
    const [quoteItems, setQuoteItems] = useState([]); 
    const [total, setTotal] = useState(0); 
    const [extraFare, setExtraFare] = useState('');
    const [discount, setDiscount] = useState('');
    const [status, setStatus] = useState('Pending');
    const [isWholesale, setIsWholesale] = useState(false); // Added State

    const [editingId, setEditingId] = useState(null);
    const [isProfitModalOpen, setIsProfitModalOpen] = useState(false);

    // --- Theme Accents ---
    const primaryAccentBg = 'bg-slate-900';

    // --- 1. Data Fetching ---
    useEffect(() => {
        if (!quoteId) { toast.error("Invalid Quote ID"); navigate('/history'); return; }

        const fetchData = async () => {
            setLoading(true);
            try {
                // Fetch saved Quote details
                const resQuote = await axios.get(`/quote/${quoteId}`);
                if (!resQuote.data.success) throw new Error("Quote not found");
                const savedQuote = resQuote.data.quote;

                setQuote(savedQuote);
                setExtraFare(savedQuote.extraFare || '');
                setDiscount(savedQuote.discount || '');
                setStatus(savedQuote.status || 'Pending');
                setIsWholesale(savedQuote.quoteType === 'Wholesale'); // Initialize Mode

                // Load Master Data
                const productIds = savedQuote.items.map(i => i.product);
                const resProducts = await axios.post('/product/get-details-for-list', { productIds });
                
                const masterData = {}; 
                if (resProducts.data.success) {
                    resProducts.data.products.forEach(p => {
                        masterData[p._id] = {
                            retail: Number(p.sellingPrice),
                            wholesale: Number(p.wholesalePrice) > 0 ? Number(p.wholesalePrice) : Number(p.sellingPrice),
                            unit: p.unit
                        };
                    });
                }

                // Merge saved item data with master reference data
                const mergedItems = savedQuote.items.map(item => {
                    const productId = item.product;
                    const masterInfo = masterData[productId] || {};
                    return {
                        _id: productId,
                        label: item.productLabel,
                        quantity: item.quantity,
                        sellingPrice: item.sellingPrice,
                        unit: item.unit || masterInfo.unit || 'pcs',
                        
                        masterRetail: masterInfo.retail,
                        masterWholesale: masterInfo.wholesale,
                        
                        total: item.quantity * item.sellingPrice
                    };
                });

                setQuoteItems(mergedItems);
                setTotal(savedQuote.totalAmount); 

            } catch (error) {
                console.error(error);
                toast.error("Failed to load details");
                navigate(-1);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [quoteId, navigate, axios]);

    // --- 2. Logic Helpers ---
    const recalculateTotal = (items, fare, disc) => {
        const itemsTotal = items.reduce((sum, item) => sum + item.total, 0);
        return itemsTotal;
    };

    // --- 3. Handlers ---
    
    // Toggle Wholesale Mode (Updates Prices & State)
    const toggleWholesaleMode = () => {
        const newMode = !isWholesale;
        setIsWholesale(newMode);
        
        setQuoteItems((prev) => {
            const updated = prev.map((item) => {
                // Switch between Master Wholesale and Master Retail
                const newPrice = newMode ? item.masterWholesale : item.masterRetail;
                return { ...item, sellingPrice: newPrice, total: newPrice * item.quantity };
            });
            setTotal(recalculateTotal(updated, extraFare, discount));
            return updated;
        });
        toast.success(newMode ? "Wholesale Prices Applied" : "Retail Prices Applied");
    };

    const handleUpdateItem = (id, field, value) => {
        const numValue = parseFloat(value) || 0;
        setQuoteItems(prev => {
            const updated = prev.map(item => {
                if (item._id === id) {
                    const newItem = { ...item, [field]: numValue };
                    newItem.total = newItem.sellingPrice * newItem.quantity;
                    return newItem;
                }
                return item;
            });
            setTotal(recalculateTotal(updated, extraFare, discount));
            return updated;
        });
    };

    const handleStatusChange = async (e) => {
        const newStatus = e.target.value;
        setStatus(newStatus); 
        try {
            await axios.put(`/quote/status/${quoteId}`, { status: newStatus });
            toast.success(`Marked as ${newStatus}`);
        } catch (error) { toast.error("Status update failed"); }
    };

    const handleUpdateQuote = async () => {
        setEditingId(null);
        setIsSaving(true);
        try {
            const itemsList = {};
            quoteItems.forEach(item => { 
                itemsList[item._id] = { qty: item.quantity, price: item.sellingPrice }; 
            });

            await axios.put(`/quote/update/${quoteId}`, {
                itemsList,
                extraFare: parseFloat(extraFare) || 0,
                discount: parseFloat(discount) || 0,
                quoteType: isWholesale ? "Wholesale" : "Retail" // Save the mode
            });

            toast.success("Changes Saved!");
            setTotal(recalculateTotal(quoteItems, extraFare, discount));
        } catch (error) {
            toast.error("Error updating quote");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDownload = () => {
        const fileName = quote.customer?.name ? `Quote_${quote.customer.name}` : `Quote_${quote._id.slice(-6)}`;
        generatePDF('invoice-content', fileName);
    };

    // Skeleton Loader
    const InvoiceSkeleton = () => (
        <div className="mx-3 my-2 bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
            <div className="p-4 border-b border-gray-100 flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-xl"></div>
                <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                    <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                </div>
            </div>
            <div className="h-8 bg-gray-50 w-full mb-1"></div>
            <div className="p-4 space-y-4">
                {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="flex justify-between items-center">
                        <div className="space-y-2 w-1/2">
                            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            <div className="h-3 bg-gray-100 rounded w-1/4"></div>
                        </div>
                        <div className="h-5 bg-gray-200 rounded w-16"></div>
                    </div>
                ))}
            </div>
        </div>
    );

    if (loading || !quote) return (
        <div className="bg-gray-100 min-h-screen">
            <Navbar title="Loading..." />
            <div className="pt-2"><InvoiceSkeleton /></div>
        </div>
    );

    const currentStatusColor = STATUS_COLORS[status] || STATUS_COLORS.Default;

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            {/* Replaced Header with Navbar */}
            <Navbar title={`Quote #${quote._id.substring(quote._id.length - 6)}`} />

            {/* 1. Sticky Toolbar (Actions) */}
            <div className="sticky top-14 z-20 bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between shadow-sm no-print">
                 
                 {/* Left: Wholesale Toggle (Replaces Quote ID) */}
                 <label className="inline-flex items-center cursor-pointer group">
                    <input type="checkbox" checked={isWholesale} onChange={toggleWholesaleMode} className="sr-only peer" />
                    <div className={`relative w-9 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all ${isWholesale ? 'peer-checked:bg-slate-900' : ''}`}></div>
                    <span className={`ml-2 text-xs font-bold transition-colors flex items-center gap-1 ${isWholesale ? 'text-slate-900' : 'text-gray-500'}`}>
                      <Briefcase size={14} /> Wholesale
                    </span>
                 </label>

                 {/* Right Actions */}
                 <div className="flex gap-2">
                    <button onClick={() => setIsProfitModalOpen(true)} className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                        <EyeOff size={14} /> Profit
                    </button>
                    <button onClick={handleDownload} className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-blue-900 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                        <Download size={14} /> PDF
                    </button>
                 </div>
            </div>

            {/* Main Scrollable Content */}
            <div className="flex-1 pb-24 overflow-y-auto">
                <div id="invoice-content" className="min-h-[500px] mx-auto max-w-3xl shadow-sm my-2 bg-white rounded-xl overflow-hidden border border-gray-100">
                    
                    {/* Customer Header Container with Status Overlay */}
                    <div className="relative">
                        {/* Status Dropdown (Top Right Absolute) */}
                        <div className="absolute top-3 right-3 z-20 no-print">
                            <div className={`relative flex items-center px-2 py-1 rounded-lg border shadow-sm transition-all hover:shadow-md bg-white ${currentStatusColor}`}>
                                <select value={status} onChange={handleStatusChange} className="appearance-none bg-transparent font-bold text-[10px] uppercase tracking-wider pr-4 focus:outline-none cursor-pointer">
                                    <option value="Pending">Pending</option>
                                    <option value="Delivered">Delivered</option>
                                    <option value="Cancelled">Cancelled</option>
                                </select>
                                <ChevronDown size={12} className="absolute right-1 pointer-events-none opacity-50"/>
                            </div>
                        </div>

                        {/* Status Display (Print Only) */}
                        <div className={`hidden print:block absolute top-3 right-3 text-[10px] font-bold border px-2 py-1 rounded uppercase tracking-wider ${currentStatusColor}`}>
                            {status}
                        </div>

                        {/* Reusing CustomerInfo Component */}
                        <CustomerInfo selectedCustomer={quote.customer || {}} />
                    </div>

                    {/* Table Headers */}
                    <div className="border-y border-gray-200 text-[10px] font-bold text-white uppercase tracking-widest grid grid-cols-15 gap-1 px-3 py-2 bg-slate-800">
                        <div className="col-span-6 pl-1">Item Details</div>
                        <div className="col-span-2 text-center">Qty</div>
                        <div className="col-span-3 text-right">Rate</div>
                        <div className="col-span-4 text-right pr-1">Amount</div>
                    </div>

                    {/* Items List */}
                    <div className="bg-white divide-y divide-gray-50">
                        {quoteItems.length === 0 ? (
                            <div className="py-10 text-center text-gray-400 flex flex-col items-center">
                                <FileText size={32} className="opacity-20 mb-2"/>
                                <span className="text-sm">No items in this quote</span>
                            </div>
                        ) : (
                            quoteItems.map((item) => (
                                <QuoteItemRow
                                    key={item._id}
                                    item={{ 
                                        ...item, 
                                        retailPrice: item.masterRetail,
                                        wholesalePrice: item.masterWholesale
                                    }}
                                    isEditing={editingId === item._id}
                                    onEditClick={setEditingId}
                                    onUpdate={handleUpdateItem}
                                    isWholesaleMode={isWholesale} 
                                />
                            ))
                        )}
                    </div>

                    {/* Summary */}
                    <QuoteSummary 
                        total={recalculateTotal(quoteItems, extraFare, discount)} 
                        extraFare={extraFare}
                        discount={discount}
                        onFareChange={(val) => { setExtraFare(val); setTotal(recalculateTotal(quoteItems, val, discount)); }}
                        onDiscountChange={(val) => { setDiscount(val); setTotal(recalculateTotal(quoteItems, extraFare, val)); }}
                    />
                </div>
            </div>

            {/* Sticky Bottom Save Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.08)] border-t border-gray-100 z-30 px-5 pb-6 pt-4 rounded-t-3xl safe-area-pb">
                <div className="max-w-md mx-auto">
                    <button 
                        onClick={handleUpdateQuote} 
                        disabled={isSaving} 
                        className={`no-print w-full py-3.5 rounded-xl text-white font-bold text-lg flex items-center justify-center gap-2 ${primaryAccentBg} shadow-lg shadow-slate-900/20 hover:bg-slate-800 disabled:bg-gray-300 disabled:shadow-none transition-all active:scale-[0.98]`}
                    >
                        {isSaving ? (
                            <div className="animate-spin"><Loader2 size={24} /></div>
                        ) : (
                            <>
                                <Save size={20} /> Save Changes
                            </>
                        )}
                    </button>
                </div>
            </div>

            <ProfitModal isOpen={isProfitModalOpen} onClose={() => setIsProfitModalOpen(false)} items={quoteItems} extraFare={extraFare} discount={discount} />
        </div>
    );
};

export default QuoteDetails;