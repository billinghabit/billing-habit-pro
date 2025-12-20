// import React, { useState, useEffect, useMemo } from 'react';
// import { useAppContext } from '../../context/AppContext.jsx';
// import toast from 'react-hot-toast';
// import { Loader2, Search, Edit2, Trash2, X, ChevronRight, Package, AlertTriangle } from 'lucide-react';
// import Header from '../../components/layout/Header.jsx';
// import Footer from '../../components/layout/Footer.jsx';

// const ManageProducts = () => {
//     const { axios } = useAppContext();
//     const [products, setProducts] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [selectedCategory, setSelectedCategory] = useState('All');
//     const [selectedSubCat, setSelectedSubCat] = useState('All');
    
//     // State for Modals
//     const [editingProduct, setEditingProduct] = useState(null);
//     const [deletingId, setDeletingId] = useState(null); 
//     const [isSaving, setIsSaving] = useState(false);

//     // --- Theme Accents ---
//     const primaryAccentBg = 'bg-slate-900';
//     const primaryAccentRing = 'focus:ring-slate-900/30';
//     const blueAccentText = 'text-blue-700';

//     useEffect(() => {
//         const fetch = async () => {
//             try {
//                 const res = await axios.get('/product/my-products');
//                 if (res.data.success) setProducts(res.data.products);
//             } catch (error) { toast.error("Failed to load products"); } 
//             finally { setLoading(false); }
//         };
//         fetch();
//     }, [axios]);

//     const categories = useMemo(() => {
//         const unique = new Map();
//         products.forEach(p => { if (p.subCategory?.category?._id) unique.set(p.subCategory.category._id, p.subCategory.category); });
//         return Array.from(unique.values());
//     }, [products]);

//     const subCategories = useMemo(() => {
//         if (selectedCategory === 'All') return [];
//         const unique = new Map();
//         products.forEach(p => { if (p.subCategory?.category?._id === selectedCategory) unique.set(p.subCategory._id, p.subCategory); });
//         return Array.from(unique.values());
//     }, [products, selectedCategory]);

//     const filtered = products.filter(p => {
//         const matchSearch = p.label.toLowerCase().includes(searchTerm.toLowerCase());
//         const matchCat = selectedCategory === 'All' || p.subCategory?.category?._id === selectedCategory;
//         const matchSub = selectedSubCat === 'All' || p.subCategory?._id === selectedSubCat;
//         return matchSearch && matchCat && matchSub;
//     });

//     const handleCategoryChange = (catId) => {
//         setSelectedCategory(catId);
//         setSelectedSubCat('All');
//     };

//     const handleUpdate = async (e) => {
//         e.preventDefault();
//         setIsSaving(true);
//         try {
//             const updatePayload = {
//                 label: editingProduct.label,
//                 sellingPrice: editingProduct.sellingPrice,
//                 unit: editingProduct.unit,
//                 costPrice: editingProduct.costPrice,       
//                 wholesalePrice: editingProduct.wholesalePrice, 
//             };

//             const res = await axios.put(`/product/update/${editingProduct._id}`, updatePayload);
//             if (res.data.success) {
//                 toast.success("Updated Successfully");
//                 setProducts(prev => prev.map(p => p._id === editingProduct._id ? { ...p, ...res.data.product } : p));
//                 setEditingProduct(null);
//             }
//         } catch (error) { 
//             console.error(error);
//             toast.error("Update failed"); 
//         } finally { setIsSaving(false); }
//     };

//     const handleConfirmDelete = async () => {
//         if(!deletingId) return;
//         setIsSaving(true);
//         try {
//             const res = await axios.delete(`/product/delete/${deletingId}`);
//             if(res.data.success) { 
//                 toast.success("Product Deleted"); 
//                 setProducts(prev => prev.filter(p => p._id !== deletingId)); 
//                 setDeletingId(null);
//             }
//         } catch(e) { 
//             toast.error("Delete failed"); 
//         } finally { setIsSaving(false); }
//     };

//     const ProductSkeleton = () => (
//         <div className="space-y-3 animate-pulse">
//             {[1, 2, 3, 4, 5].map((i) => (
//                 <div key={i} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
//                     <div>
//                         <div className="h-5 bg-gray-200 rounded w-40 mb-2"></div>
//                         <div className="h-3 bg-gray-100 rounded w-20"></div>
//                     </div>
//                     <div className="h-8 bg-gray-200 rounded w-16"></div>
//                 </div>
//             ))}
//         </div>
//     );

//     return (
//         <div className="pb-24 bg-gray-50 min-h-screen">
//             <Header />
            
//             {/* STICKY CONTAINER FOR SEARCH & FILTERS */}
//             <div className="sticky top-[72px] z-10 bg-white shadow-md border-b border-gray-100 pb-3">
                
//                 {/* 1. SEARCH BAR (Updated to match Home Page UI) */}
//                 <div className="px-5 pb-2 pt-4 transition-all"> 
//                     <div className="relative">
//                         <input 
//                             type="text" 
//                             placeholder="Search product name..." 
//                             value={searchTerm} 
//                             onChange={(e) => setSearchTerm(e.target.value)} 
//                             className="w-full p-3.5 pl-12 rounded-2xl border border-gray-200 shadow-lg focus:ring-4 focus:ring-slate-900/30 text-gray-800 font-medium placeholder-gray-400 outline-none transition-all" 
//                         />
//                         <Search className="absolute left-4 top-3.5 text-gray-400" size={22} />
//                     </div>
//                 </div>
                
//                 {/* 2. Category Filters */}
//                 <div className="px-4 flex gap-2 overflow-x-auto no-scrollbar mt-1">
//                     <button onClick={() => handleCategoryChange('All')} className={`px-3 py-1.5 rounded-full text-xs font-bold border whitespace-nowrap transition-colors ${selectedCategory === 'All' ? `${primaryAccentBg} text-white` : 'bg-white text-gray-600 border-gray-200'}`}>All Categories</button>
//                     {categories.map(c => <button key={c._id} onClick={() => handleCategoryChange(c._id)} className={`px-3 py-1.5 rounded-full text-xs font-bold border whitespace-nowrap transition-colors ${selectedCategory === c._id ? `${primaryAccentBg} text-white` : 'bg-white text-gray-600 border-gray-200'}`}>{c.name}</button>)}
//                 </div>
                
//                 {/* 3. Sub-Category Filters */}
//                 {selectedCategory !== 'All' && subCategories.length > 0 && 
//                     <div className="px-4 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 mt-3">
//                         <ChevronRight size={18} className="text-gray-400 shrink-0"/>
//                         <button onClick={() => setSelectedSubCat('All')} className={`px-3 py-1 rounded-md text-[11px] font-bold border whitespace-nowrap transition-colors ${selectedSubCat === 'All' ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-white text-gray-600 border-gray-200'}`}>All Items</button>
//                         {subCategories.map(s => <button key={s._id} onClick={() => setSelectedSubCat(s._id)} className={`px-3 py-1 rounded-md text-[11px] font-bold border whitespace-nowrap transition-colors ${selectedSubCat === s._id ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-white text-gray-600 border-gray-200'}`}>{s.name}</button>)}
//                     </div>
//                 }
//             </div>

//             {/* Main Content Area */}
//             <div className="px-4 py-4 space-y-3">
//                 {loading ? (
//                     <ProductSkeleton />
//                 ) : filtered.length === 0 ? (
//                     <div className="flex flex-col items-center mt-12 text-gray-400 bg-white p-12 rounded-2xl shadow-sm border border-gray-100">
//                         <Package size={48} className="opacity-30 mb-2"/>
//                         <p className="text-base font-medium">No products found.</p>
//                     </div>
//                 ) : (
//                     filtered.map(p => (
//                         <div key={p._id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between active:scale-[0.99] transition-transform">
                            
//                             {/* Left: Simple Product Info */}
//                             <div className="flex-1 pr-4">
//                                 <h3 className="font-bold text-gray-900 leading-tight text-base truncate">{p.label}</h3>
//                                 <div className="flex items-center gap-2 mt-1">
//                                     <span className="text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full border border-gray-200">₹{p.sellingPrice}</span>
//                                     <span className="text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full border border-gray-200">Per {p.unit || 'pcs'}</span>
                                    
//                                 </div>
//                             </div>
                            
//                             {/* Right: Price & Actions */}
//                             <div className="flex items-center gap-3 shrink-0">
//                                 <div className='flex gap-2'>
//                                     <button onClick={() => setEditingProduct({...p, unit: p.unit || 'pcs'})} className="p-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors shadow-sm"><Edit2 size={16}/></button>
//                                     <button onClick={() => setDeletingId(p._id)} className="p-2 bg-red-50 text-red-600 rounded-full hover:bg-red-100 transition-colors shadow-sm"><Trash2 size={16}/></button>
//                                 </div>
//                             </div>
//                         </div>
//                     ))
//                 )}
//             </div>

//             {/* Edit Modal (Includes All 4 Price Fields) */}
//             {editingProduct && (
//                 <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-in fade-in duration-200">
//                     <div className="bg-white w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl">
//                         <div className="px-5 py-4 border-b flex justify-between items-center bg-gray-50">
//                             <h3 className="font-bold text-xl text-gray-800">Edit Product</h3>
//                             <button onClick={() => setEditingProduct(null)} className="p-1 text-gray-500 hover:bg-gray-200 rounded-full"><X size={22}/></button>
//                         </div>
//                         <form onSubmit={handleUpdate} className="p-5 space-y-4">
//                             <div>
//                                 <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Name</label>
//                                 <input required className={`w-full p-3 border border-gray-300 rounded-xl outline-none focus:ring-2 ${primaryAccentRing}`} value={editingProduct.label} onChange={e => setEditingProduct({...editingProduct, label: e.target.value})} />
//                             </div>
                            
//                             <div className="grid grid-cols-2 gap-4">
//                                 <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Retail (₹)</label><input required type="number" className="w-full p-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/50" value={editingProduct.sellingPrice} onChange={e => setEditingProduct({...editingProduct, sellingPrice: e.target.value})} /></div>
//                                 <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Cost (₹)</label><input required type="number" className="w-full p-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/50" value={editingProduct.costPrice} onChange={e => setEditingProduct({...editingProduct, costPrice: e.target.value})} /></div>
//                             </div>

//                             <div className="grid grid-cols-2 gap-4">
//                                 <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Wholesale (₹)</label><input type="number" className="w-full p-3 border border-purple-200 bg-purple-50 rounded-xl outline-none focus:ring-2 focus:ring-purple-500/50" value={editingProduct.wholesalePrice} onChange={e => setEditingProduct({...editingProduct, wholesalePrice: e.target.value})} /></div>
//                                 <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Unit</label><input className="w-full p-3 border border-gray-300 rounded-xl outline-none bg-gray-50" value={editingProduct.unit} onChange={e => setEditingProduct({...editingProduct, unit: e.target.value})} /></div>
//                             </div>
                            
//                             <button disabled={isSaving} className={`w-full py-3.5 ${primaryAccentBg} text-white font-bold rounded-xl flex justify-center items-center gap-2 hover:bg-slate-800`}>
//                                 {isSaving ? <Loader2 className="animate-spin" size={20}/> : "Update Product"}
//                             </button>
//                         </form>
//                     </div>
//                 </div>
//             )}

//             {/* 1. Delete Confirmation Modal */}
//             {deletingId && (
//                 <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-in fade-in duration-200">
//                     <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xs p-6 text-center">
//                         <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600 ring-4 ring-red-50/50">
//                             <AlertTriangle size={32}/>
//                         </div>
//                         <h3 className="text-xl font-bold mb-2 text-gray-900">Delete Product?</h3>
//                         <p className="text-sm text-gray-500 mb-6">This action cannot be undone.</p>
//                         <div className="flex gap-3">
//                             <button onClick={() => setDeletingId(null)} className="flex-1 py-3 bg-gray-100 rounded-xl font-bold text-gray-700 hover:bg-gray-200 transition-colors" disabled={isSaving}>Cancel</button>
//                             <button onClick={handleConfirmDelete} disabled={isSaving} className="flex-1 py-3 bg-red-600 rounded-xl font-bold text-white flex justify-center items-center gap-2 hover:bg-red-700 shadow-md shadow-red-500/30">
//                                 {isSaving ? <Loader2 className="animate-spin" size={18}/> : "Delete"}
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             <Footer/>
//         </div>
//     );
// };

// export default ManageProducts;

import React, { useState, useEffect, useMemo } from 'react';
import { useAppContext } from '../../context/AppContext.jsx';
import toast from 'react-hot-toast';
import { Loader2, Search, Edit2, Trash2, X, ChevronRight, Package, AlertTriangle, ArrowDownCircle } from 'lucide-react';
import Header from '../../components/layout/Header.jsx';
import Footer from '../../components/layout/Footer.jsx';

const ManageProducts = () => {
    const { axios } = useAppContext();
    
    // --- Data States ---
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    
    // --- Filter Data (Buttons) ---
    const [allCategories, setAllCategories] = useState([]);
    const [allSubCategories, setAllSubCategories] = useState([]);

    // --- Filter & Search States ---
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [selectedSubCat, setSelectedSubCat] = useState('All');

    // --- Modal States ---
    const [editingProduct, setEditingProduct] = useState(null);
    const [deletingId, setDeletingId] = useState(null); 
    const [isSaving, setIsSaving] = useState(false);

    const primaryAccentBg = 'bg-slate-900';
    const primaryAccentRing = 'focus:ring-slate-900/30';

    // --- 1. Fetch Filter Data (Categories) on Mount ---
    useEffect(() => {
        const fetchFilters = async () => {
            try {
                // This calls the new endpoint we just made
                const res = await axios.get('/product/filter-data'); 
                if (res.data.success) {
                    setAllCategories(res.data.categories);
                    setAllSubCategories(res.data.subCategories);
                }
            } catch (error) {
                console.error("Failed to load filters");
            } finally {
                setInitialLoading(false);
            }
        };
        fetchFilters();
    }, [axios]);

    // --- 2. Fetch Products Function ---
    const fetchProducts = async (currentPage, search, catId, subCatId, reset = false) => {
        if (!reset) setLoading(true);
        
        try {
            // Construct Query
            let query = `/product/my-products?page=${currentPage}&limit=20&search=${search}`;
            
            // Append Filters
            if (subCatId !== 'All') {
                query += `&subCategoryId=${subCatId}`;
            } else if (catId !== 'All') {
                // Only send categoryId if no specific subCategory is selected
                query += `&categoryId=${catId}`;
            }

            const { data } = await axios.get(query);

            if (data.success) {
                if (reset) {
                    setProducts(data.products);
                } else {
                    setProducts(prev => [...prev, ...data.products]);
                }
                
                // If we got fewer items than limit, no more pages exist
                setHasMore(data.products.length >= 20);
            }
        } catch (error) {
            toast.error("Failed to load products");
        } finally {
            setLoading(false);
        }
    };

    // --- 3. Handle Search & Filter Changes ---
    useEffect(() => {
        // Debounce logic
        const timer = setTimeout(() => {
            setPage(1); // Always reset to page 1 on filter change
            setHasMore(true);
            
            // Reset = true (overwrite list)
            fetchProducts(1, searchTerm, selectedCategory, selectedSubCat, true);
        }, 500);

        return () => clearTimeout(timer);
        
    }, [searchTerm, selectedCategory, selectedSubCat]); 
    // ^ Triggers whenever these change. 
    // If searchTerm becomes "", it triggers this, sending "" to backend, effectively resetting the list.

    // --- 4. Handle Load More ---
    const handleLoadMore = () => {
        const nextPage = page + 1;
        setPage(nextPage);
        fetchProducts(nextPage, searchTerm, selectedCategory, selectedSubCat, false);
    };

    // --- 5. UI Helpers ---
    // Filter SubCategory buttons based on selected Category
    const filteredSubCats = useMemo(() => {
        if (selectedCategory === 'All') return [];
        return allSubCategories.filter(sub => sub.category && sub.category._id === selectedCategory);
    }, [selectedCategory, allSubCategories]);

    // --- Update Handler ---
    const handleUpdate = async (e) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const res = await axios.put(`/product/update/${editingProduct._id}`, editingProduct);
            if (res.data.success) {
                toast.success("Updated");
                setProducts(prev => prev.map(p => p._id === editingProduct._id ? { ...p, ...res.data.product } : p));
                setEditingProduct(null);
            }
        } catch (error) { toast.error("Update failed"); } finally { setIsSaving(false); }
    };

    // --- Delete Handler ---
    const handleConfirmDelete = async () => {
        if(!deletingId) return;
        setIsSaving(true);
        try {
            const res = await axios.delete(`/product/delete/${deletingId}`);
            if(res.data.success) { 
                toast.success("Deleted"); 
                setProducts(prev => prev.filter(p => p._id !== deletingId)); 
                setDeletingId(null);
            }
        } catch(e) { toast.error("Delete failed"); } finally { setIsSaving(false); }
    };

    // Reset SubCat when Category changes
    const handleCategoryClick = (id) => {
        setSelectedCategory(id);
        setSelectedSubCat('All');
    };

    return (
        <div className="pb-24 bg-gray-50 min-h-screen">
            <Header />
            
            <div className="sticky top-[72px] z-10 bg-white shadow-md border-b border-gray-100 pb-3">
                {/* Search */}
                <div className="px-5 pb-2 pt-4 transition-all"> 
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="Search product name..." 
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)} 
                            className="w-full p-3.5 pl-12 rounded-2xl border border-gray-200 shadow-lg focus:ring-4 focus:ring-slate-900/30 text-gray-800 font-medium placeholder-gray-400 outline-none transition-all" 
                        />
                        <Search className="absolute left-4 top-3.5 text-gray-400" size={22} />
                        {searchTerm && (
                            <button onClick={() => setSearchTerm('')} className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        )}
                    </div>
                </div>
                
                {/* Category Filters (Now loaded from backend API) */}
                <div className="px-4 flex gap-2 overflow-x-auto no-scrollbar mt-1">
                    <button onClick={() => handleCategoryClick('All')} className={`px-3 py-1.5 rounded-full text-xs font-bold border whitespace-nowrap transition-colors ${selectedCategory === 'All' ? `${primaryAccentBg} text-white` : 'bg-white text-gray-600 border-gray-200'}`}>All Categories</button>
                    {allCategories.map(c => (
                        <button key={c._id} onClick={() => handleCategoryClick(c._id)} className={`px-3 py-1.5 rounded-full text-xs font-bold border whitespace-nowrap transition-colors ${selectedCategory === c._id ? `${primaryAccentBg} text-white` : 'bg-white text-gray-600 border-gray-200'}`}>
                            {c.name}
                        </button>
                    ))}
                </div>
                
                {/* Sub-Category Filters */}
                {selectedCategory !== 'All' && filteredSubCats.length > 0 && 
                    <div className="px-4 flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 mt-3">
                        <ChevronRight size={18} className="text-gray-400 shrink-0"/>
                        <button onClick={() => setSelectedSubCat('All')} className={`px-3 py-1 rounded-md text-[11px] font-bold border whitespace-nowrap transition-colors ${selectedSubCat === 'All' ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-white text-gray-600 border-gray-200'}`}>All Items</button>
                        {filteredSubCats.map(s => (
                            <button key={s._id} onClick={() => setSelectedSubCat(s._id)} className={`px-3 py-1 rounded-md text-[11px] font-bold border whitespace-nowrap transition-colors ${selectedSubCat === s._id ? 'bg-blue-100 text-blue-700 border-blue-200' : 'bg-white text-gray-600 border-gray-200'}`}>
                                {s.name}
                            </button>
                        ))}
                    </div>
                }
            </div>

            {/* Product List */}
            <div className="px-4 py-4 space-y-3">
                {products.length === 0 && !loading && !initialLoading ? (
                    <div className="flex flex-col items-center mt-12 text-gray-400 bg-white p-12 rounded-2xl shadow-sm border border-gray-100">
                        <Package size={48} className="opacity-30 mb-2"/>
                        <p className="text-base font-medium">No products found.</p>
                    </div>
                ) : (
                    <>
                        {products.map(p => (
                            <div key={p._id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between active:scale-[0.99] transition-transform">
                                <div className="flex-1 pr-4">
                                    <h3 className="font-bold text-gray-900 leading-tight text-base truncate">{p.label}</h3>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full border border-gray-200">₹{p.sellingPrice}</span>
                                        <span className="text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full border border-gray-200">Per {p.unit || 'pcs'}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                    <div className='flex gap-2'>
                                        <button onClick={() => setEditingProduct(p)} className="p-2 bg-gray-100 text-gray-600 rounded-full hover:bg-gray-200 transition-colors shadow-sm"><Edit2 size={16}/></button>
                                        <button onClick={() => setDeletingId(p._id)} className="p-2 bg-red-50 text-red-600 rounded-full hover:bg-red-100 transition-colors shadow-sm"><Trash2 size={16}/></button>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Loading / Load More */}
                        {(loading || initialLoading) && (
                            <div className="py-4 flex justify-center text-gray-400">
                                <Loader2 className="animate-spin" size={24} />
                            </div>
                        )}

                        {!loading && hasMore && products.length > 0 && (
                            <button 
                                onClick={handleLoadMore} 
                                className="w-full py-3 mt-4 bg-white border border-gray-200 text-gray-600 font-bold rounded-xl shadow-sm hover:bg-gray-50 flex justify-center items-center gap-2"
                            >
                                <span>Load More</span>
                                <ArrowDownCircle size={18} />
                            </button>
                        )}
                        
                        {!hasMore && products.length > 0 && (
                            <p className="text-center text-xs text-gray-400 mt-4 uppercase font-bold tracking-wider">All Products Loaded</p>
                        )}
                    </>
                )}
            </div>

            {/* --- Modals (Edit/Delete) --- */}
            {/* These remain exactly the same as your code */}
            
            {editingProduct && (
                 <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-in fade-in duration-200">
                    <div className="bg-white w-full max-w-sm rounded-2xl overflow-hidden shadow-2xl">
                        <div className="px-5 py-4 border-b flex justify-between items-center bg-gray-50">
                            <h3 className="font-bold text-xl text-gray-800">Edit Product</h3>
                            <button onClick={() => setEditingProduct(null)} className="p-1 text-gray-500 hover:bg-gray-200 rounded-full"><X size={22}/></button>
                        </div>
                        <form onSubmit={handleUpdate} className="p-5 space-y-4">
                            <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Name</label>
                                <input required className={`w-full p-3 border border-gray-300 rounded-xl outline-none focus:ring-2 ${primaryAccentRing}`} value={editingProduct.label} onChange={e => setEditingProduct({...editingProduct, label: e.target.value})} />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Retail (₹)</label><input required type="number" className="w-full p-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/50" value={editingProduct.sellingPrice} onChange={e => setEditingProduct({...editingProduct, sellingPrice: e.target.value})} /></div>
                                <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Cost (₹)</label><input required type="number" className="w-full p-3 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-blue-500/50" value={editingProduct.costPrice} onChange={e => setEditingProduct({...editingProduct, costPrice: e.target.value})} /></div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Wholesale (₹)</label><input type="number" className="w-full p-3 border border-purple-200 bg-purple-50 rounded-xl outline-none focus:ring-2 focus:ring-purple-500/50" value={editingProduct.wholesalePrice} onChange={e => setEditingProduct({...editingProduct, wholesalePrice: e.target.value})} /></div>
                                <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Unit</label><input className="w-full p-3 border border-gray-300 rounded-xl outline-none bg-gray-50" value={editingProduct.unit} onChange={e => setEditingProduct({...editingProduct, unit: e.target.value})} /></div>
                            </div>
                            
                            <button disabled={isSaving} className={`w-full py-3.5 ${primaryAccentBg} text-white font-bold rounded-xl flex justify-center items-center gap-2 hover:bg-slate-800`}>
                                {isSaving ? <Loader2 className="animate-spin" size={20}/> : "Update Product"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {deletingId && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xs p-6 text-center">
                        <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600 ring-4 ring-red-50/50">
                            <AlertTriangle size={32}/>
                        </div>
                        <h3 className="text-xl font-bold mb-2 text-gray-900">Delete Product?</h3>
                        <p className="text-sm text-gray-500 mb-6">This action cannot be undone.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setDeletingId(null)} className="flex-1 py-3 bg-gray-100 rounded-xl font-bold text-gray-700 hover:bg-gray-200 transition-colors" disabled={isSaving}>Cancel</button>
                            <button onClick={handleConfirmDelete} disabled={isSaving} className="flex-1 py-3 bg-red-600 rounded-xl font-bold text-white flex justify-center items-center gap-2 hover:bg-red-700 shadow-md shadow-red-500/30">
                                {isSaving ? <Loader2 className="animate-spin" size={18}/> : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <Footer/>
        </div>
    );
};

export default ManageProducts;