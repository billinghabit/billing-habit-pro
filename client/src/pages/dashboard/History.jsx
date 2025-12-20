// import React, { useState, useEffect } from 'react';
// import { useAppContext } from '../../context/AppContext.jsx';
// import { Search, Calendar, Filter } from 'lucide-react';
// import Header from '../../components/layout/Header.jsx';
// import Footer from '../../components/layout/Footer.jsx';
// import { STATUS_COLORS } from '../../config/constants.js';

// const History = () => {
//     const { navigate, setList, setSelectedCustomer, axios } = useAppContext();
//     const [quotes, setQuotes] = useState([]); 
//     const [filteredQuotes, setFilteredQuotes] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [statusFilter, setStatusFilter] = useState('All');
//     const [typeFilter, setTypeFilter] = useState('All'); 

//     // --- Color Accent: Dark Slate ---
//     const primaryAccentBg = 'bg-slate-900';
//     const primaryAccentRing = 'focus:ring-slate-900/30';

//     useEffect(() => {
//         setList({}); setSelectedCustomer(null);
//         const fetch = async () => {
//             // Note: We don't set loading(true) here if we want to background refresh, 
//             // but on mount it defaults to true.
//             try {
//                 const res = await axios.get('/quote/all');
//                 if (res.data.success) { setQuotes(res.data.quotes || []); setFilteredQuotes(res.data.quotes || []); }
//             } catch (error) { console.error(error); } finally { setLoading(false); }
//         };
//         fetch();
//     }, [setList, setSelectedCustomer, axios]);

//     useEffect(() => {
//         if (!quotes) return;
//         const results = quotes.filter(quote => {
//             const matchSearch = (quote.customer?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || quote._id.includes(searchTerm);
//             const matchStatus = statusFilter === 'All' || quote.status === statusFilter;
//             const matchType = typeFilter === 'All' || (quote.quoteType || 'Retail') === typeFilter;
//             return matchSearch && matchStatus && matchType;
//         });
//         setFilteredQuotes(results);
//     }, [searchTerm, statusFilter, typeFilter, quotes]);

//     // --- Skeleton Loader Component ---
//     const HistorySkeleton = () => (
//         <div className="space-y-3 animate-pulse">
//             {[1, 2, 3, 4, 5].map((i) => (
//                 <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col gap-3">
//                     <div className="flex justify-between items-center">
//                         <div className="h-4 bg-gray-200 rounded w-1/3"></div>
//                         <div className="h-4 bg-gray-200 rounded w-1/4"></div>
//                     </div>
//                     <div className="flex justify-between items-center">
//                         <div className="h-3 bg-gray-100 rounded w-1/4"></div>
//                         <div className="h-6 bg-gray-100 rounded-full w-16"></div>
//                     </div>
//                 </div>
//             ))}
//         </div>
//     );

//     return (
//         <div className="pb-24 bg-gray-50 min-h-screen">
//             <Header />
            
//             {/* Sticky Filter Bar - Always Visible */}
//             <div className="sticky top-[72px] z-10 bg-white pt-4 pb-3 shadow-md border-b border-gray-100">
//                 <div className="px-4 mb-3 relative">
//                     <input 
//                         type="text" 
//                         placeholder="Search Customer or Quote ID..." 
//                         value={searchTerm} 
//                         onChange={(e) => setSearchTerm(e.target.value)} 
//                         className={`w-full p-3 pl-10 border border-gray-300 rounded-xl shadow-sm outline-none focus:ring-2 ${primaryAccentRing}`} 
//                     />
//                     <Search className="absolute left-7 top-3.5 text-gray-400" size={20} />
//                 </div>
                
//                 <div className="flex flex-col gap-3 px-4">
//                     {/* Type Filter */}
//                     <div className="flex gap-2">
//                         {['All', 'Retail', 'Wholesale'].map((type) => (
//                             <button 
//                                 key={type} 
//                                 onClick={() => setTypeFilter(type)} 
//                                 className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${typeFilter === type ? `${primaryAccentBg} text-white shadow-md shadow-slate-900/30` : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
//                             >
//                                 {type}
//                             </button>
//                         ))}
//                     </div>
                    
//                     {/* Status Filter */}
//                     <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
//                         {['All', 'Pending', 'Delivered', 'Cancelled'].map((status) => (
//                             <button 
//                                 key={status} 
//                                 onClick={() => setStatusFilter(status)} 
//                                 className={`px-4 py-1.5 rounded-full text-xs font-bold border whitespace-nowrap transition-colors ${statusFilter === status ? `bg-blue-600 text-white shadow-md shadow-blue-500/30` : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
//                             >
//                                 {status}
//                             </button>
//                         ))}
//                     </div>
//                 </div>
//             </div>
            
//             {/* List Area */}
//             <div className="px-4 mt-4 space-y-3">
//                 {loading ? (
//                     // Show Skeleton instead of Spinner
//                     <HistorySkeleton />
//                 ) : filteredQuotes.length === 0 ? (
//                     <div className="flex flex-col items-center mt-12 text-gray-400 bg-white p-12 rounded-2xl shadow-sm border border-gray-100">
//                         <Filter size={48} className="opacity-30 mb-2"/>
//                         <p className="text-base font-medium">No quotes found.</p>
//                     </div>
//                 ) : (
//                     filteredQuotes.map(quote => (
//                         <div 
//                             key={quote._id} 
//                             onClick={() => navigate(`/quote-details/${quote._id}`)} 
//                             className="bg-white rounded-xl shadow-md p-4 border border-gray-100 relative overflow-hidden active:scale-[0.98] transition-transform hover:shadow-lg"
//                         >
                            
//                             <div >
//                                 {/* Top Row: Name & Amount */}
//                                 <div className="flex justify-between items-start mb-1">
//                                     <h3 className="font-bold text-gray-900 text-lg leading-tight">{quote.customer?.name}</h3>
//                                     <span className="font-black text-slate-900 text-xl tracking-tight">₹{quote.totalAmount?.toFixed(0)}</span>
//                                 </div>
                                
//                                 {/* Bottom Row: Info & Status */}
//                                 <div className="flex justify-between items-center mt-2">
//                                     <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
//                                         <Calendar size={14} className="text-gray-300"/>
//                                         <span>{new Date(quote.createdAt).toLocaleDateString('en-GB')}</span>
//                                         {quote.quoteType === 'Wholesale' && (
//                                             <>
//                                                 <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
//                                                 <span className="text-purple-600 font-bold">Wholesale</span>
//                                             </>
//                                         )}
//                                     </div>

//                                     <div className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${STATUS_COLORS[quote.status] || STATUS_COLORS.DEFAULT}`}>
//                                         {quote.status}
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     ))
//                 )}
//             </div>
//             <Footer />
//         </div>
//     );
// };

// export default History;

import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext.jsx';
import { Search, Calendar, Filter } from 'lucide-react';
import Header from '../../components/layout/Header.jsx';
import Footer from '../../components/layout/Footer.jsx';
import { STATUS_COLORS } from '../../config/constants.js';

const History = () => {
    const { navigate, setList, setSelectedCustomer, axios } = useAppContext();
    const [quotes, setQuotes] = useState([]); 
    const [filteredQuotes, setFilteredQuotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');
    const [typeFilter, setTypeFilter] = useState('All'); 

    // --- Color Accent: Dark Slate ---
    const primaryAccentBg = 'bg-slate-900';

    useEffect(() => {
        setList({}); setSelectedCustomer(null);
        const fetch = async () => {
            // Note: We don't set loading(true) here if we want to background refresh, 
            // but on mount it defaults to true.
            try {
                const res = await axios.get('/quote/all');
                if (res.data.success) { setQuotes(res.data.quotes || []); setFilteredQuotes(res.data.quotes || []); }
            } catch (error) { console.error(error); } finally { setLoading(false); }
        };
        fetch();
    }, [setList, setSelectedCustomer, axios]);

    useEffect(() => {
        if (!quotes) return;
        const results = quotes.filter(quote => {
            const matchSearch = (quote.customer?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) || quote._id.includes(searchTerm);
            const matchStatus = statusFilter === 'All' || quote.status === statusFilter;
            const matchType = typeFilter === 'All' || (quote.quoteType || 'Retail') === typeFilter;
            return matchSearch && matchStatus && matchType;
        });
        setFilteredQuotes(results);
    }, [searchTerm, statusFilter, typeFilter, quotes]);

    // --- Skeleton Loader Component ---
    const HistorySkeleton = () => (
        <div className="space-y-3 animate-pulse">
            {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    </div>
                    <div className="flex justify-between items-center">
                        <div className="h-3 bg-gray-100 rounded w-1/4"></div>
                        <div className="h-6 bg-gray-100 rounded-full w-16"></div>
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="pb-24 bg-gray-50 min-h-screen">
            <Header />
            
            {/* Sticky Filter Bar - Always Visible */}
            <div className="sticky top-[72px] z-10 bg-white pt-2 pb-3 shadow-md border-b border-gray-100">
                
                {/* 1. Updated Search UI (Match Home Page) */}
                <div className="px-5 pb-2 pt-2 transition-all"> 
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="Search Customer or Quote ID..." 
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)} 
                            className="w-full p-3.5 pl-12 rounded-2xl border border-gray-200 shadow-lg focus:ring-4 focus:ring-slate-900/30 text-gray-800 font-medium placeholder-gray-400 outline-none transition-all" 
                        />
                        <Search className="absolute left-4 top-3.5 text-gray-400" size={22} />
                    </div>
                </div>
                
                <div className="flex flex-col gap-3 px-4 mt-1">
                    {/* Type Filter */}
                    <div className="flex gap-2">
                        {['All', 'Retail', 'Wholesale'].map((type) => (
                            <button 
                                key={type} 
                                onClick={() => setTypeFilter(type)} 
                                className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all ${typeFilter === type ? `${primaryAccentBg} text-white shadow-md shadow-slate-900/30` : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
                            >
                                {type}
                            </button>
                        ))}
                    </div>
                    
                    {/* Status Filter */}
                    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                        {['All', 'Pending', 'Delivered', 'Cancelled'].map((status) => (
                            <button 
                                key={status} 
                                onClick={() => setStatusFilter(status)} 
                                className={`px-4 py-1.5 rounded-full text-xs font-bold border whitespace-nowrap transition-colors ${statusFilter === status ? `bg-blue-600 text-white shadow-md shadow-blue-500/30` : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
            
            {/* List Area */}
            <div className="px-4 mt-4 space-y-3">
                {loading ? (
                    // Show Skeleton instead of Spinner
                    <HistorySkeleton />
                ) : filteredQuotes.length === 0 ? (
                    <div className="flex flex-col items-center mt-12 text-gray-400 bg-white p-12 rounded-2xl shadow-sm border border-gray-100">
                        <Filter size={48} className="opacity-30 mb-2"/>
                        <p className="text-base font-medium">No quotes found.</p>
                    </div>
                ) : (
                    filteredQuotes.map(quote => (
                        <div 
                            key={quote._id} 
                            onClick={() => navigate(`/quote-details/${quote._id}`)} 
                            className="bg-white rounded-xl shadow-md p-4 border border-gray-100 relative overflow-hidden active:scale-[0.98] transition-transform hover:shadow-lg"
                        >
                            
                            {/* Content Container (Padding left to clear status bar) */}
                            <div>
                                {/* Top Row: Name & Amount */}
                                <div className="flex justify-between items-start mb-1">
                                    <h3 className="font-bold text-gray-900 text-lg leading-tight">{quote.customer?.name}</h3>
                                    <span className="font-black text-slate-900 text-xl tracking-tight">₹{quote.totalAmount?.toFixed(0)}</span>
                                </div>
                                
                                {/* Bottom Row: Info & Status */}
                                <div className="flex justify-between items-center mt-2">
                                    <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
                                        <Calendar size={14} className="text-gray-300"/>
                                        <span>{new Date(quote.createdAt).toLocaleDateString('en-GB')}</span>
                                        {quote.quoteType === 'Wholesale' && (
                                            <>
                                                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                                <span className="text-purple-600 font-bold">Wholesale</span>
                                            </>
                                        )}
                                    </div>

                                    <div className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${STATUS_COLORS[quote.status] || STATUS_COLORS.DEFAULT}`}>
                                        {quote.status}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
            <Footer />
        </div>
    );
};

export default History;