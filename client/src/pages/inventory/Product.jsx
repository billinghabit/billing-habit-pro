import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext.jsx';
import toast from 'react-hot-toast';
import { Loader2, Plus, Save, Search, Package } from 'lucide-react';
import Navbar from '../../components/layout/Navbar.jsx'; 
import AddProductModal from '../../components/modals/AddProductModal.jsx';

const Product = () => {
    const { subCategoryId } = useParams();
    const { navigate, list, setList, axios } = useAppContext();

    const [subCategoryName, setSubCategoryName] = useState('');
    const [products, setProducts] = useState([]);
    const [quantities, setQuantities] = useState({});
    const [searchTerm, setSearchTerm] = useState('');
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [loading, setLoading] = useState(true);

    // --- Theme Accents ---
    const primaryAccentBg = 'bg-slate-900';
    const primaryAccentText = 'text-slate-900';
    const primaryAccentRing = 'focus:ring-slate-900/30';

    const fetchData = async () => {
        try {
            const subRes = await axios.get(`/subcategory/get/${subCategoryId}`);
            setSubCategoryName(subRes.data.subCategory.name);
            const prodRes = await axios.post(`/product/get-for-subcategory/${subCategoryId}`);
            setProducts(prodRes.data.products);

            const initialQuantities = {};
            prodRes.data.products.forEach(p => {
                if (list[p._id]) initialQuantities[p._id] = list[p._id].qty;
            });
            setQuantities(initialQuantities);
        } catch (error) { toast.error("Failed to fetch data"); } 
        finally { setLoading(false); }
    };

    useEffect(() => {
        if (subCategoryId) fetchData();
    }, [subCategoryId]);

    const handleCreateProduct = async (data) => {
        setIsCreating(true);
        try {
            const res = await axios.post(`/product/create`, { ...data, subCategory: subCategoryId });
            if (res.data.success) {
                toast.success("Product Created!");
                setProducts([...products, res.data.product]);
                setIsProductModalOpen(false);
            }
        } catch (error) { toast.error("Failed to create product"); } 
        finally { setIsCreating(false); }
    };

    const handleSave = () => {
        setList(prev => {
            const updated = { ...prev };
            products.forEach(p => {
                const qty = quantities[p._id] || 0;
                if (qty > 0) updated[p._id] = { qty, subCategory: subCategoryId };
                else delete updated[p._id];
            });
            return updated;
        });
        toast.success("Cart Updated");
        navigate(-1);
    };

    const filtered = useMemo(() => !searchTerm ? products : products.filter(p => p.label.toLowerCase().includes(searchTerm.toLowerCase())), [products, searchTerm]);
    const total = useMemo(() => products.reduce((acc, p) => acc + (p.sellingPrice * (quantities[p._id] || 0)), 0), [products, quantities]);

    // --- Skeleton Loader ---
    const ProductListSkeleton = () => (
        <div className="bg-white">
             {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="grid grid-cols-12 gap-2 items-center px-4 py-4 border-b border-gray-50 animate-pulse">
                    <div className="col-span-6 h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="col-span-2 h-4 bg-gray-200 rounded mx-auto w-10"></div>
                    <div className="col-span-2 h-8 bg-gray-100 rounded w-12 mx-auto"></div>
                    <div className="col-span-2 h-4 bg-gray-200 rounded ml-auto w-8"></div>
                </div>
             ))}
        </div>
    );

    return (
        <div className='pb-48 bg-gray-50 min-h-screen'>
            {/* Using Navbar as requested */}
            <Navbar title={subCategoryName || "Loading..."} />
            
            {/* Sticky Search & Info Bar */}
            <div className="sticky top-14 z-20 bg-white shadow-sm border-b border-gray-100">
                <div className="px-4 py-3 bg-gray-50/50 backdrop-blur-md border-b border-gray-200/50">
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="Search products..." 
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)} 
                            className={`w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 ${primaryAccentRing} transition-all`} 
                        />
                        <Search className="absolute left-3.5 top-3 text-gray-400" size={18} />
                    </div>
                </div>

                {/* Table Header */}
                <div className="grid grid-cols-12 gap-2 px-4 py-2 bg-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    <div className="col-span-6 pl-1">Item Details</div>
                    <div className="col-span-2 text-center">Rate</div>
                    <div className="col-span-2 text-center">Qty</div>
                    <div className="col-span-2 text-right pr-1">Amt</div>
                </div>
            </div>

            {/* Product List Content */}
            {loading ? (
                <ProductListSkeleton />
            ) : (
                <div className="bg-white min-h-[300px]">
                    {filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                            <Package size={48} className="opacity-20 mb-2"/>
                            <p className="text-sm font-medium">No products found here.</p>
                        </div>
                    ) : (
                        filtered.map(p => {
                            const qty = quantities[p._id] || 0;
                            const isSelected = qty > 0;
                            return (
                                <div key={p._id} className={`grid grid-cols-12 gap-2 items-center px-4 py-3.5 border-b border-gray-50 transition-colors ${isSelected ? 'bg-blue-50/30' : 'hover:bg-gray-50'}`}>
                                    {/* Name */}
                                    <div className="col-span-6">
                                        <div className={`text-sm font-bold leading-snug ${isSelected ? 'text-gray-900' : 'text-gray-700'}`}>{p.label}</div>
                                        <div className="text-[10px] text-gray-400 mt-0.5">Per {p.unit || 'pcs'}</div>
                                    </div>
                                    
                                    {/* Rate */}
                                    <div className="col-span-2 text-center text-sm font-medium text-gray-500">
                                        ₹{p.sellingPrice}
                                    </div>
                                    
                                    {/* Qty Input */}
                                    <div className="col-span-2 flex justify-center">
                                        <input 
                                            type="number" 
                                            inputMode="numeric"
                                            value={qty === 0 ? '' : qty} 
                                            onChange={(e) => setQuantities(prev => ({ ...prev, [p._id]: Math.max(0, Number(e.target.value)) }))} 
                                            className={`w-12 py-1.5 border rounded-lg text-center text-sm font-bold outline-none transition-all focus:ring-2 ${primaryAccentRing} 
                                                ${isSelected ? 'border-slate-300 bg-white text-slate-900 shadow-sm' : 'border-gray-200 bg-gray-50 text-gray-600'}`} 
                                            placeholder="0" 
                                        />
                                    </div>
                                    
                                    {/* Total Amount */}
                                    <div className={`col-span-2 text-sm text-right font-black ${isSelected ? 'text-slate-900' : 'text-gray-200'}`}>
                                        ₹{(p.sellingPrice * qty).toFixed(0)}
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            )}

            {/* Floating Action Button (Add Product) */}
            <button 
                onClick={() => setIsProductModalOpen(true)} 
                className={`fixed bottom-40 right-5 z-30 p-4 ${primaryAccentBg} text-white rounded-full shadow-xl shadow-slate-900/30 hover:scale-110 transition-transform active:scale-95`}
            >
                <Plus size={26} strokeWidth={2.5} />
            </button>

            {/* Bottom Total & Save Bar */}
            <div className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-8px_30px_rgba(0,0,0,0.1)] border-t border-gray-100 z-30 px-5 pb-6 pt-4 rounded-t-3xl">
                <div className="flex justify-between items-end mb-4 px-1">
                    <span className="text-sm font-bold text-gray-500 mb-1">Total Amount</span>
                    <span className={`text-3xl font-black ${primaryAccentText} tracking-tight`}>₹{total.toLocaleString('en-IN')}</span>
                </div>
                <button 
                    onClick={handleSave} 
                    className={`w-full py-4 rounded-xl text-white font-bold text-lg flex items-center justify-center gap-2 ${primaryAccentBg} shadow-lg shadow-slate-900/20 hover:bg-slate-800 active:scale-[0.98] transition-all`}
                >
                    <Save size={20} /> Save Changes
                </button>
            </div>

            {/* Add Product Modal */}
            <AddProductModal 
                isOpen={isProductModalOpen} 
                onClose={() => setIsProductModalOpen(false)} 
                onSubmit={handleCreateProduct} 
                isCreating={isCreating} 
            />
        </div>
    );
};

export default Product;