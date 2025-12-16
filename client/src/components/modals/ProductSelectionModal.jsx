import React, { useState, useEffect } from 'react';
import { Search, X, Folder, Loader2, Minus, Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAppContext } from '../../context/AppContext.jsx';

const ProductSelectionModal = ({ isOpen, onClose, onProductSelect }) => {
    const { axios } = useAppContext();
    
    // --- State Management ---
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState(null); // null means 'All'

    // Data stores
    const [allProducts, setAllProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    
    // Quantity Picker State
    const [quantity, setQuantity] = useState(1);
    const [selectedProductForQty, setSelectedProductForQty] = useState(null);
    const [error, setError] = useState(null); // State for error messages


    // --- 1. Data Fetching ---
    useEffect(() => {
        if (!isOpen) return;

        const fetchSelectionData = async () => {
            setLoading(true);
            setError(null);
            try {
                // Fetching the consolidated data from the new backend endpoint
                const res = await axios.get('/product/all-for-selection-data'); 
                
                if (res.data.success) {
                    setAllProducts(res.data.products || []);
                    setCategories(res.data.categories || []);
                } else {
                    throw new Error(res.data.message || "API returned failure.");
                }
            } catch (error) {
                console.error("Fetch Error:", error);
                setError("Failed to load inventory selection data.");
                toast.error("Failed to load inventory.");
            } finally {
                setLoading(false);
            }
        };
        fetchSelectionData();
    }, [isOpen, axios]);


    // --- 2. Filtering Logic ---
    const filteredProducts = allProducts.filter(p => {
        // Safe check for null categories (should not happen if backend is correct)
        const categoryId = p.categoryId;

        const matchesSearch = p.label.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === null || categoryId === selectedCategory;
        
        return matchesSearch && matchesCategory;
    });


    // --- 3. Handlers ---
    const handleInitialSelect = (product) => {
        // Open the quantity picker
        setSelectedProductForQty(product);
        setQuantity(1); // Default quantity
    };

    const handleConfirmAddition = () => {
        if (quantity <= 0 || !selectedProductForQty) {
            return toast.error("Quantity must be greater than zero.");
        }

        // Pass the complete item data back to the parent component (FinalQuotation)
        onProductSelect({
            product: selectedProductForQty._id,
            productLabel: selectedProductForQty.label,
            // Pass both prices so FinalQuotation can handle Wholesale Toggle correctly
            retailPrice: selectedProductForQty.sellingPrice, 
            wholesalePrice: selectedProductForQty.wholesalePrice,
            unit: selectedProductForQty.unit,
            quantity: quantity,
        });

        // Reset state for next item selection
        setSelectedProductForQty(null); // Close the quantity picker
        setQuantity(1);
        toast.success(`Added ${quantity} x ${selectedProductForQty.label}`);
    };

    const handleClose = () => {
        // Clean up all modal state upon closing
        setSelectedProductForQty(null); 
        setSearchTerm('');
        setSelectedCategory(null);
        setAllProducts([]);
        setCategories([]);
        setQuantity(1);
        setError(null);
        onClose();
    };


    // --- UI Render ---
    if (!isOpen) return null;

    const ModalHeader = (
        <div className="px-5 pt-5 pb-3 border-b border-gray-100 bg-white sticky top-0 z-10">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-slate-900">Select Inventory Items</h2>
                <button onClick={handleClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500"><X size={22} /></button>
            </div>
            
            {/* Search Bar */}
            <div className="relative mb-3">
                <input 
                    type="text" 
                    placeholder="Search across all products..." 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                    className="w-full p-3 pl-10 border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-slate-900/30 text-gray-800" 
                />
                <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
            </div>

            {/* Category Filter Tabs */}
            <div className="flex overflow-x-auto gap-2 pb-2">
                <button 
                    onClick={() => setSelectedCategory(null)} 
                    className={`text-xs font-bold px-3 py-1.5 rounded-full whitespace-nowrap transition-colors ${selectedCategory === null ? 'bg-slate-900 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                    <span className="flex items-center gap-1"><Folder size={12}/> All ({allProducts.length})</span>
                </button>
                {categories.map(cat => (
                    <button 
                        key={cat._id}
                        onClick={() => setSelectedCategory(cat._id)} 
                        className={`text-xs font-bold px-3 py-1.5 rounded-full whitespace-nowrap transition-colors ${selectedCategory === cat._id ? 'bg-slate-900 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                    >
                        {cat.label}
                    </button>
                ))}
            </div>
        </div>
    );


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg h-[90vh] flex flex-col overflow-hidden">
                {ModalHeader}
                
                {loading ? (
                    <div className="flex flex-1 items-center justify-center"><Loader2 className="animate-spin text-slate-900" size={30} /></div>
                ) : error ? (
                    <div className="flex flex-1 items-center justify-center text-red-500 font-medium">{error}</div>
                ) : (
                    <div className="flex-1 overflow-y-auto px-5 divide-y divide-gray-100">
                        {filteredProducts.length === 0 ? (
                             <div className="text-center py-10 text-gray-400">No products found matching your search.</div>
                        ) : filteredProducts.map(product => (
                            <div key={product._id} className="flex items-center justify-between py-3">
                                <div className="flex flex-col">
                                    <span className="font-semibold text-gray-800">{product.label}</span>
                                    <span className="text-xs text-gray-500 mt-0.5">
                                        {product.categoryLabel} / Price: ₹{product.sellingPrice} per {product.unit}
                                    </span>
                                </div>
                                <button 
                                    onClick={() => handleInitialSelect(product)}
                                    className="bg-green-600 text-white text-sm px-3 py-1.5 rounded-lg font-bold hover:bg-green-700 active:scale-95 transition-all"
                                >
                                    + Add
                                </button>
                            </div>
                        ))}
                    </div>
                )}
                
                {/* --- Quantity Picker Overlay --- */}
                {selectedProductForQty && (
                    <div className="absolute inset-0 bg-white/95 backdrop-blur-sm flex items-center justify-center p-4">
                        <div className="bg-white p-6 rounded-2xl shadow-xl border border-gray-100 w-full max-w-sm">
                            <h3 className="text-lg font-bold text-slate-900 mb-2 truncate">Quantify: {selectedProductForQty.label}</h3>
                            <p className="text-sm text-gray-600 mb-4">
                                Price: ₹{selectedProductForQty.sellingPrice} per {selectedProductForQty.unit}
                            </p>

                            {/* Quantity Control */}
                            <div className="flex items-center justify-center gap-3 mb-6">
                                <button 
                                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                    className="p-3 bg-gray-100 rounded-lg text-gray-700 hover:bg-gray-200 transition-colors"
                                    disabled={quantity <= 1}
                                >
                                    <Minus size={20} />
                                </button>
                                <input
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => setQuantity(Number(e.target.value) || 0)}
                                    className="w-24 text-center text-2xl font-extrabold p-3 border-2 border-slate-900 rounded-xl outline-none"
                                    min="1"
                                    autoFocus
                                />
                                <button 
                                    onClick={() => setQuantity(q => q + 1)}
                                    className="p-3 bg-gray-100 rounded-lg text-gray-700 hover:bg-gray-200 transition-colors"
                                >
                                    <Plus size={20} />
                                </button>
                            </div>

                            <div className="flex gap-3">
                                <button onClick={() => setSelectedProductForQty(null)} className="flex-1 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold">Cancel</button>
                                <button onClick={handleConfirmAddition} className="flex-1 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800">
                                    Add ({quantity})
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductSelectionModal;