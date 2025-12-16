// import React, { useState, useEffect } from "react";
// import { useAppContext } from "../../context/AppContext.jsx"; 
// import toast from "react-hot-toast";
// import { Loader2, User, Phone, MapPin, EyeOff, Download, Briefcase, Save, FileText } from "lucide-react";
// import ProfitModal from "../../components/modals/ProfitModal.jsx";
// import QuoteItemRow from "../../components/quote/QuoteItemRow.jsx"; 
// import QuoteSummary from "../../components/quote/QuoteSummary.jsx"; 
// import { generatePDF } from "../../utils/generatePDF.js";
// import Navbar from "../../components/layout/Navbar.jsx";
// import CustomerInfo from "../../components/common/CustomerInfo.jsx";

// const FinalQuotation = () => {
//   const { list, selectedCustomer, navigate, axios } = useAppContext();

//   // --- State ---
//   const [quoteItems, setQuoteItems] = useState([]);
//   const [total, setTotal] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [isCreating, setIsCreating] = useState(false);

//   // Bill Settings
//   const [extraFare, setExtraFare] = useState("");
//   const [discount, setDiscount] = useState("");
//   const [isWholesale, setIsWholesale] = useState(false);

//   // UI State
//   const [editingId, setEditingId] = useState(null);
//   const [isProfitModalOpen, setIsProfitModalOpen] = useState(false);

//   // --- Theme Accents ---
//   const primaryAccentBg = 'bg-slate-900';

//   // --- Data Loading ---
//   useEffect(() => {
//     if (isCreating) return;
//     if (!selectedCustomer) { toast.error("No customer selected."); navigate("/customer"); return; }
//     if (Object.keys(list).length === 0) { toast.error("List empty."); navigate("/"); return; }

//     const fetchQuoteDetails = async () => {
//       setLoading(true);
//       try {
//         const productIds = Object.keys(list);
//         const res = await axios.post("/product/get-details-for-list", { productIds });
//         if (!res.data.success) throw new Error("API Error");

//         let calculatedTotal = 0;
//         const items = res.data.products.map((product) => {
//             const listItem = list[product._id];
//             if (!listItem) return null;

//             const quantity = Number(listItem.qty);
//             const retailPrice = Number(product.sellingPrice) || 0;
//             const wsPrice = Number(product.wholesalePrice) || 0;
//             const wholesalePrice = wsPrice > 0 ? wsPrice : retailPrice;

//             const activePrice = retailPrice; 
//             calculatedTotal += activePrice * quantity;

//             return {
//               _id: product._id,
//               label: product.label,
//               unit: product.unit || "pcs",
//               retailPrice,
//               wholesalePrice,
//               sellingPrice: activePrice,
//               quantity,
//               total: activePrice * quantity,
//             };
//           }).filter(Boolean);

//         setQuoteItems(items);
//         setTotal(calculatedTotal);
//       } catch (error) {
//         toast.error("Failed to load items");
//         navigate(-1);
//       } finally { setLoading(false); }
//     };
//     fetchQuoteDetails();
//   }, [list, selectedCustomer, navigate, isCreating, axios]);

//   // --- Logic Helpers ---
//   const recalculateTotal = (items) => {
//       return items.reduce((sum, item) => sum + item.total, 0);
//   };

//   // --- Handlers ---
//   const toggleWholesaleMode = () => {
//     const newMode = !isWholesale;
//     setIsWholesale(newMode);
//     setQuoteItems((prev) => {
//         const updated = prev.map((item) => {
//             const newPrice = newMode ? item.wholesalePrice : item.retailPrice;
//             return { ...item, sellingPrice: newPrice, total: newPrice * item.quantity };
//         });
//         setTotal(recalculateTotal(updated));
//         return updated;
//     });
//     toast.success(newMode ? "Wholesale Prices Applied" : "Retail Prices Applied");
//   };

//   const handleUpdateItem = (id, field, value) => {
//     const numValue = parseFloat(value) || 0;
//     setQuoteItems((prev) => {
//       const updated = prev.map((item) => {
//         if (item._id === id) {
//           const newItem = { ...item, [field]: numValue };
//           newItem.total = newItem.sellingPrice * newItem.quantity;
//           return newItem;
//         }
//         return item;
//       });
//       setTotal(recalculateTotal(updated));
//       return updated;
//     });
//   };

//   const handleSaveQuote = async () => {
//     setEditingId(null);
//     setIsCreating(true);
//     try {
//       const itemsList = {};
//       quoteItems.forEach(item => {
//         itemsList[item._id] = { qty: item.quantity, price: item.sellingPrice, unit: item.unit };
//       });

//       const res = await axios.post("/quote/create", {
//         customerId: selectedCustomer._id,
//         itemsList,
//         extraFare: parseFloat(extraFare) || 0,
//         discount: parseFloat(discount) || 0,
//         quoteType: isWholesale ? "Wholesale" : "Retail",
//       });

//       if (res.data.success) {
//         toast.success("Saved Successfully!");
//         navigate("/history");
//       }
//     } catch (error) { toast.error("Failed to save quote"); } 
//     finally { setIsCreating(false); }
//   };

//   // Skeleton Loader
//   const InvoiceSkeleton = () => (
//     <div className="bg-white p-4 space-y-6 animate-pulse">
//         <div className="flex gap-4 items-center border-b pb-4">
//             <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
//             <div className="flex-1 space-y-2">
//                 <div className="h-4 bg-gray-200 rounded w-1/2"></div>
//                 <div className="h-3 bg-gray-100 rounded w-3/4"></div>
//             </div>
//         </div>
//         <div className="space-y-3">
//             {[1, 2, 3, 4].map(i => (
//                 <div key={i} className="h-12 bg-gray-50 rounded w-full"></div>
//             ))}
//         </div>
//     </div>
//   );


//   if (loading) return (
//       <div className="bg-gray-50 min-h-screen">
//           <Navbar title={"loading..."} />
//           <div className="pt-20"><InvoiceSkeleton /></div>
//       </div>
//   );

//   return (
//     <div className="min-h-screen flex flex-col bg-gray-100">
//       <Navbar title={"Review Quotation"} />

//       {/* 1. Sticky Toolbar (Actions) */}
//       <div className="sticky top-14 z-20 bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between shadow-sm no-print">
         
//          {/* Wholesale Toggle */}
//          <label className="inline-flex items-center cursor-pointer group">
//             <input type="checkbox" checked={isWholesale} onChange={toggleWholesaleMode} className="sr-only peer" />
//             <div className={`relative w-9 h-5 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all ${isWholesale ? 'peer-checked:bg-slate-900' : ''}`}></div>
//             <span className={`ml-2 text-xs font-bold transition-colors flex items-center gap-1 ${isWholesale ? 'text-purple-900' : 'text-gray-500'}`}>
//               <Briefcase size={14} /> Wholesale
//             </span>
//          </label>

//          {/* Right Actions */}
//          <div className="flex gap-2">
//             <button onClick={() => setIsProfitModalOpen(true)} className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
//                 <EyeOff size={14} /> Profit
//             </button>
//             <button onClick={() => { setEditingId(null); generatePDF("invoice-content", `Quote_${selectedCustomer.name}`); }} className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-blue-900 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
//                 <Download size={14} /> PDF
//             </button>
//          </div>
//       </div>

//       {/* Main Scrollable Content */}
//       <div className="flex-1 pb-24 overflow-y-auto">
//         <div id="invoice-content" className=" min-h-[500px] mx-auto max-w-3xl shadow-sm my-2 bg-white rounded-xl overflow-hidden border border-gray-100">
            
//             <CustomerInfo selectedCustomer={selectedCustomer} />

//             {/* Table Headers - MATCHING QuoteItemRow Grid (4-2-3-3) */}
//             <div className=" border-y border-gray-200 text-[10px] font-bold text-white uppercase tracking-widest grid grid-cols-15 gap-1 px-3 py-2 bg-slate-800">
//                 <div className="col-span-6 pl-1">Item Details</div>
//                 <div className="col-span-2 text-center">Qty</div>
//                 <div className="col-span-3 text-right">Rate</div>
//                 <div className="col-span-4 text-right pr-1">Amount</div>
//             </div>

//             {/* Items List */}
//             <div className="bg-white divide-y divide-gray-50">
//                 {quoteItems.length === 0 ? (
//                     <div className="py-10 text-center text-gray-400 flex flex-col items-center">
//                         <FileText size={32} className="opacity-20 mb-2"/>
//                         <span className="text-sm">No items added</span>
//                     </div>
//                 ) : (
//                     quoteItems.map((item) => (
//                         <QuoteItemRow
//                             key={item._id}
//                             item={item}
//                             isEditing={editingId === item._id}
//                             onEditClick={setEditingId}
//                             onUpdate={handleUpdateItem}
//                             isWholesaleMode={isWholesale}
//                         />
//                     ))
//                 )}
//             </div>

//             {/* Summary */}
//             <QuoteSummary 
//                 total={total}
//                 extraFare={extraFare}
//                 discount={discount}
//                 onFareChange={setExtraFare}
//                 onDiscountChange={setDiscount}
//             />
//         </div>
//       </div>

//       {/* Sticky Bottom Save Bar */}
//       <div className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.08)] border-t border-gray-100 z-30 px-5 pb-6 pt-4 rounded-t-3xl safe-area-pb">
//         <div className="max-w-md mx-auto">
//           <button 
//             onClick={handleSaveQuote} 
//             disabled={isCreating} 
//             className={`no-print w-full py-3.5 rounded-xl text-white font-bold text-lg flex items-center justify-center gap-2 ${primaryAccentBg} shadow-lg shadow-slate-900/20 hover:bg-slate-800 disabled:bg-gray-300 disabled:shadow-none transition-all active:scale-[0.98]`}
//           >
//             {isCreating ? <Loader2 className="animate-spin" size={24} /> : (
//                 <>
//                     <Save size={20} /> Finalize Quote
//                 </>
//             )}
//           </button>
//         </div>
//       </div>

//       <ProfitModal 
//         isOpen={isProfitModalOpen} 
//         onClose={() => setIsProfitModalOpen(false)} 
//         items={quoteItems} 
//         extraFare={extraFare} 
//         discount={discount} 
//       />
//     </div>
//   );
// };

// export default FinalQuotation;
import React, { useState, useEffect } from "react";
import { useAppContext } from "../../context/AppContext.jsx"; 
import toast from "react-hot-toast";
import { Loader2, EyeOff, Download, Briefcase, Save, FileText } from "lucide-react";
import ProfitModal from "../../components/modals/ProfitModal.jsx";
import QuoteItemRow from "../../components/quote/QuoteItemRow.jsx"; 
import QuoteSummary from "../../components/quote/QuoteSummary.jsx"; 
import { generatePDF } from "../../utils/generatePDF.js";
import Navbar from "../../components/layout/Navbar.jsx";
import CustomerInfo from "../../components/common/CustomerInfo.jsx";

const FinalQuotation = () => {
  const { list, selectedCustomer, navigate, axios } = useAppContext();

  // --- State ---
  const [quoteItems, setQuoteItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);

  // Bill Settings
  const [extraFare, setExtraFare] = useState("");
  const [discount, setDiscount] = useState("");
  const [isWholesale, setIsWholesale] = useState(false);

  // UI State
  const [editingId, setEditingId] = useState(null);
  const [isProfitModalOpen, setIsProfitModalOpen] = useState(false);

  // --- Theme Accents ---
  const primaryAccentBg = 'bg-slate-900';

  // --- Data Loading ---
  useEffect(() => {
    if (isCreating) return;
    if (!selectedCustomer) { toast.error("No customer selected."); navigate("/customer"); return; }
    if (Object.keys(list).length === 0) { toast.error("List empty."); navigate("/"); return; }

    const fetchQuoteDetails = async () => {
      setLoading(true);
      try {
        const productIds = Object.keys(list);
        const res = await axios.post("/product/get-details-for-list", { productIds });
        if (!res.data.success) throw new Error("API Error");

        let calculatedTotal = 0;
        const items = res.data.products.map((product) => {
            const listItem = list[product._id];
            if (!listItem) return null;

            const quantity = Number(listItem.qty);
            const retailPrice = Number(product.sellingPrice) || 0;
            const wsPrice = Number(product.wholesalePrice) || 0;
            const wholesalePrice = wsPrice > 0 ? wsPrice : retailPrice;

            const activePrice = retailPrice; 
            calculatedTotal += activePrice * quantity;

            return {
              _id: product._id,
              label: product.label,
              unit: product.unit || "pcs",
              retailPrice,
              wholesalePrice,
              sellingPrice: activePrice,
              quantity,
              total: activePrice * quantity,
            };
          }).filter(Boolean);

        setQuoteItems(items);
        setTotal(calculatedTotal);
      } catch (error) {
        toast.error("Failed to load items");
        navigate(-1);
      } finally { setLoading(false); }
    };
    fetchQuoteDetails();
  }, [list, selectedCustomer, navigate, isCreating, axios]);

  // --- Logic Helpers ---
  const recalculateTotal = (items) => {
      return items.reduce((sum, item) => sum + item.total, 0);
  };

  // --- Handlers ---
  const toggleWholesaleMode = () => {
    const newMode = !isWholesale;
    setIsWholesale(newMode);
    setQuoteItems((prev) => {
        const updated = prev.map((item) => {
            const newPrice = newMode ? item.wholesalePrice : item.retailPrice;
            return { ...item, sellingPrice: newPrice, total: newPrice * item.quantity };
        });
        setTotal(recalculateTotal(updated));
        return updated;
    });
    toast.success(newMode ? "Wholesale Prices Applied" : "Retail Prices Applied");
  };

  const handleUpdateItem = (id, field, value) => {
    const numValue = parseFloat(value) || 0;
    setQuoteItems((prev) => {
      const updated = prev.map((item) => {
        if (item._id === id) {
          const newItem = { ...item, [field]: numValue };
          newItem.total = newItem.sellingPrice * newItem.quantity;
          return newItem;
        }
        return item;
      });
      setTotal(recalculateTotal(updated));
      return updated;
    });
  };

  const handleSaveQuote = async () => {
    setEditingId(null);
    setIsCreating(true);
    try {
      const itemsList = {};
      quoteItems.forEach(item => {
        itemsList[item._id] = { qty: item.quantity, price: item.sellingPrice, unit: item.unit };
      });

      const res = await axios.post("/quote/create", {
        customerId: selectedCustomer._id,
        itemsList,
        extraFare: parseFloat(extraFare) || 0,
        discount: parseFloat(discount) || 0,
        quoteType: isWholesale ? "Wholesale" : "Retail",
      });

      if (res.data.success) {
        toast.success("Saved Successfully!");
        navigate("/history");
      }
    } catch (error) { toast.error("Failed to save quote"); } 
    finally { setIsCreating(false); }
  };

  // --- Updated Skeleton Loader ---
  const InvoiceSkeleton = () => (
    <div className="mx-3 my-2 bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 animate-pulse">
        {/* Customer Header Skeleton */}
        <div className="p-4 border-b border-gray-100 flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-200 rounded-xl"></div>
            <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-gray-100 rounded w-1/2"></div>
            </div>
        </div>

        {/* Toolbar Skeleton */}
        <div className="h-8 bg-gray-50 w-full mb-1"></div>

        {/* List Items Skeleton */}
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

        {/* Summary Skeleton */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 mt-2 space-y-3">
            <div className="flex justify-between"><div className="h-3 bg-gray-200 w-20"></div><div className="h-3 bg-gray-200 w-16"></div></div>
            <div className="flex justify-between"><div className="h-3 bg-gray-200 w-24"></div><div className="h-3 bg-gray-200 w-16"></div></div>
            <div className="h-px bg-gray-200 my-2"></div>
            <div className="flex justify-between items-end">
                <div className="h-4 bg-gray-300 w-24"></div>
                <div className="h-6 bg-gray-300 w-32 rounded"></div>
            </div>
        </div>
    </div>
  );


  if (loading) return (
      <div className="bg-gray-100 min-h-screen">
          <Navbar title={"Loading..."} />
          <div className="pt-2"><InvoiceSkeleton /></div>
      </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar title={"Review Quotation"} />

      {/* 1. Sticky Toolbar (Actions) */}
      <div className="sticky top-14 z-20 bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between shadow-sm no-print">
         
         {/* Wholesale Toggle */}
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
            <button onClick={() => { setEditingId(null); generatePDF("invoice-content", `Quote_${selectedCustomer.name}`); }} className="flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-blue-900 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                <Download size={14} /> PDF
            </button>
         </div>
      </div>

      {/* Main Scrollable Content */}
      <div className="flex-1 pb-24 overflow-y-auto">
        <div id="invoice-content" className=" min-h-[500px] mx-auto max-w-3xl shadow-sm my-2 bg-white rounded-xl overflow-hidden border border-gray-100">
            
            <CustomerInfo selectedCustomer={selectedCustomer} />

            {/* Table Headers - MATCHING QuoteItemRow Grid (4-2-3-3) */}
            <div className=" border-y border-gray-200 text-[10px] font-bold text-white uppercase tracking-widest grid grid-cols-15 gap-1 px-3 py-2 bg-slate-800">
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
                        <span className="text-sm">No items added</span>
                    </div>
                ) : (
                    quoteItems.map((item) => (
                        <QuoteItemRow
                            key={item._id}
                            item={item}
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
                total={total}
                extraFare={extraFare}
                discount={discount}
                onFareChange={setExtraFare}
                onDiscountChange={setDiscount}
            />
        </div>
      </div>

      {/* Sticky Bottom Save Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-4px_20px_rgba(0,0,0,0.08)] border-t border-gray-100 z-30 px-5 pb-6 pt-4 rounded-t-3xl safe-area-pb">
        <div className="max-w-md mx-auto">
          <button 
            onClick={handleSaveQuote} 
            disabled={isCreating} 
            className={`no-print w-full py-3.5 rounded-xl text-white font-bold text-lg flex items-center justify-center gap-2 ${primaryAccentBg} shadow-lg shadow-slate-900/20 hover:bg-slate-800 disabled:bg-gray-300 disabled:shadow-none transition-all active:scale-[0.98]`}
          >
            {isCreating ? <Loader2 className="animate-spin" size={24} /> : (
                <>
                    <Save size={20} /> Finalize Quote
                </>
            )}
          </button>
        </div>
      </div>

      <ProfitModal 
        isOpen={isProfitModalOpen} 
        onClose={() => setIsProfitModalOpen(false)} 
        items={quoteItems} 
        extraFare={extraFare} 
        discount={discount} 
      />
    </div>
  );
};

export default FinalQuotation;