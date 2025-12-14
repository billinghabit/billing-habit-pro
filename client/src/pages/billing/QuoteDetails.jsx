import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { User, MapPin, Phone, EyeOff, Download, Briefcase, ChevronDown, Save } from 'lucide-react';
import { useAppContext } from '../../context/AppContext.jsx';
import toast from 'react-hot-toast';

// Layout & Common Components
import Navbar from '../../components/layout/Navbar.jsx';
import ProfitModal from '../../components/modals/ProfitModal.jsx';
import LoadingSpinner from '../../components/common/LoadingSpinner.jsx';

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
    const [total, setTotal] = useState(0); // This is the Grand Total (after fare/discount)
    const [extraFare, setExtraFare] = useState('');
    const [discount, setDiscount] = useState('');
    const [status, setStatus] = useState('Pending');

    const [editingId, setEditingId] = useState(null);
    const [isProfitModalOpen, setIsProfitModalOpen] = useState(false);

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

                // Load Master Data (for "Modified" check and Unit fallback)
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
                        // Unit Priority: Saved > Master > Default
                        unit: item.unit || masterInfo.unit || 'pcs',
                        
                        masterRetail: masterInfo.retail,
                        masterWholesale: masterInfo.wholesale,
                        
                        total: item.quantity * item.sellingPrice
                    };
                });

                setQuoteItems(mergedItems);
                setTotal(savedQuote.totalAmount); // Use the saved final total

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
            // Recalculate Grand Total based on new item data
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
                discount: parseFloat(discount) || 0
            });

            toast.success("Changes Saved!");
            // Re-sync local total after saving
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

    if (loading || !quote) return <><Navbar title="Loading..." /><LoadingSpinner /></>;

    // Use quote's saved type to control "Modified" tag logic
    const isQuoteWholesale = quote.quoteType === 'Wholesale';
    const currentStatusColor = STATUS_COLORS[status] || STATUS_COLORS.Default;

    return (
        <div className="pb-64 bg-gray-50 min-h-screen">
            <Navbar title={`Quote #${quote._id.substring(quote._id.length - 6)}`} />

            {/* Fixed Action Buttons */}
            <div className="absolute top-0 right-0 z-60 h-14 flex items-center pr-2 gap-1 no-print">
                <button onClick={() => setIsProfitModalOpen(true)} className="p-2 text-white/90 hover:bg-white/10 rounded-full"><EyeOff size={22} /></button>
                <button onClick={handleDownload} className="p-2 text-white/90 hover:bg-white/10 rounded-full"><Download size={22} /></button>
            </div>

            <div id="invoice-content" className="bg-white min-h-screen">
                
                {/* Header & Status */}
                <div className="bg-white border-b border-gray-200 p-4 shadow-sm mb-2 relative">
                    {/* Status Dropdown (No Print) */}
                    <div className="absolute top-4 right-4 z-10 no-print">
                        <div className={`relative flex items-center px-2 py-1 rounded-md border ${currentStatusColor}`}>
                            <select value={status} onChange={handleStatusChange} className="appearance-none bg-transparent font-bold text-xs pr-4 focus:outline-none cursor-pointer">
                                <option value="Pending">Pending</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                            </select>
                            <ChevronDown size={14} className="absolute right-1 pointer-events-none"/>
                        </div>
                    </div>
                    {/* Status Display (Print Only) */}
                    <div className={`hidden print:block absolute top-4 right-4 text-xs font-bold border px-2 py-1 rounded ${currentStatusColor}`}>{status}</div>

                    <div className="flex items-start gap-3">
                        <div className="h-10 w-10 mt-1 rounded-full bg-green-50 flex items-center justify-center border border-green-100 shrink-0"><User className="text-primaryColor" size={20} /></div>
                        <div className="flex-1 min-w-0 pr-20">
                            <div className="flex items-center gap-2">
                                <h3 className="text-lg font-bold text-gray-800 leading-tight">{quote.customer?.name}</h3>
                                {isQuoteWholesale && <span className="bg-purple-100 text-purple-700 text-[9px] font-bold px-1.5 py-0.5 rounded border border-purple-200 flex items-center gap-0.5"><Briefcase size={8} /> Wholesale</span>}
                            </div>
                            <div className="flex flex-col gap-1 mt-1 text-sm text-gray-600">
                                {quote.customer?.number && <span className="flex items-center gap-1.5"><Phone size={14}/> {quote.customer.number}</span>}
                                {quote.customer?.address && <span className="flex items-start gap-1.5 leading-snug"><MapPin size={14} className="mt-0.5"/> <span>{quote.customer.address}</span></span>}
                            </div>
                        </div>
                    </div>
                </div>

                {/* List Header */}
                <div className="bg-gray-100 border-y border-gray-200 text-xs font-bold text-gray-600 uppercase tracking-wider grid grid-cols-12 gap-2 px-3 py-2 shadow-sm">
                    <div className="col-span-5">Item</div>
                    <div className="col-span-2 text-center">Qty</div>
                    <div className="col-span-2 text-right">Price</div>
                    <div className="col-span-3 text-right">Total</div>
                </div>

                {/* Items List */}
                <div className="bg-white divide-y divide-gray-100">
                    {quoteItems.map((item) => (
                        <QuoteItemRow
                            key={item._id}
                            item={{ 
                                // Map master prices to use in the QuoteItemRow component
                                ...item, 
                                retailPrice: item.masterRetail,
                                wholesalePrice: item.masterWholesale
                            }}
                            isEditing={editingId === item._id}
                            onEditClick={setEditingId}
                            onUpdate={handleUpdateItem}
                            isWholesaleMode={isQuoteWholesale} 
                        />
                    ))}
                </div>

                {/* Summary */}
                <QuoteSummary 
                    total={recalculateTotal(quoteItems, extraFare, discount)} // Pass subtotal before charges
                    extraFare={extraFare}
                    discount={discount}
                    // Handlers update state and recalculate the grand total
                    onFareChange={(val) => { setExtraFare(val); setTotal(recalculateTotal(quoteItems, val, discount)); }}
                    onDiscountChange={(val) => { setDiscount(val); setTotal(recalculateTotal(quoteItems, extraFare, val)); }}
                />
            </div>

            {/* Footer - Save Changes */}
            <div className="fixed bottom-0 left-0 right-0 bg-white shadow-inner border-t-2 z-10 p-4 safe-area-pb">
                <div className="max-w-md mx-auto">
                    <button onClick={handleUpdateQuote} disabled={isSaving} className="no-print w-full py-3.5 rounded-xl text-white font-bold text-lg flex items-center justify-center gap-2 bg-primaryColor hover:bg-green-700 disabled:bg-gray-300">
                        {isSaving ? <LoadingSpinner size={22} color="text-white" /> : <Save size={20} />}
                        Save Changes
                    </button>
                </div>
            </div>

            <ProfitModal isOpen={isProfitModalOpen} onClose={() => setIsProfitModalOpen(false)} items={quoteItems} extraFare={extraFare} discount={discount} />
        </div>
    );
};

export default QuoteDetails;