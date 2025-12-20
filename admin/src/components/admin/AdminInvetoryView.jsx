import React, { useState } from 'react';
import { Folder, ChevronRight, Package, ArrowLeft, Layers, Plus, Trash2, Edit2, Box } from 'lucide-react';
import adminAxios from '../../api/adminAxios';
import toast from 'react-hot-toast';

// --- IMPORTS: Modals ---
import AdminProductModal from '../modals/AdminProductModal';
import AdminCategoryModal from '../modals/AdminCategoryModal';

const AdminInventoryView = ({ data, userId }) => { 
    // --- State Initialization ---
    const [categories, setCategories] = useState(data?.categories || []);
    const [subCategories, setSubCategories] = useState(data?.subCategories || []);
    const [products, setProducts] = useState(data?.products || []);
    
    // --- Navigation State ---
    const [view, setView] = useState('categories'); 
    const [selectedCat, setSelectedCat] = useState(null);
    const [selectedSub, setSelectedSub] = useState(null);

    // --- Modal States ---
    const [isProdModalOpen, setIsProdModalOpen] = useState(false);
    const [catModal, setCatModal] = useState({ open: false, type: 'Category', data: null });

    // --- Filter Logic ---
    const currentSubCats = subCategories.filter(s => s.category === selectedCat?._id);
    const currentProducts = products.filter(p => p.subCategory === selectedSub?._id);

    // =========================================================
    //                    CATEGORY ACTIONS
    // =========================================================

    const handleSaveCategory = async (formData) => {
        try {
            const payload = {
                action: catModal.data ? 'update' : 'create',
                id: catModal.data?._id,
                targetUserId: userId, 
                ...formData
            };
            
            const res = await adminAxios.post('/manage-category-crud', payload);

            if (res.data.success) {
                const returnedItem = res.data.category; 
                
                if (catModal.data) {
                    // Update Local State
                    setCategories(prev => prev.map(c => c._id === returnedItem._id ? returnedItem : c));
                    toast.success("Category Updated");
                } else {
                    // Add to Local State
                    setCategories(prev => [...prev, returnedItem]);
                    toast.success("Category Created");
                }
                setCatModal({ ...catModal, open: false });
            }
        } catch (error) {
            toast.error("Operation Failed");
        }
    };

    const handleDeleteCategory = async (e, id) => {
        e.stopPropagation();
        if(!window.confirm("Delete Category? This will delete ALL SubCategories and Products inside it.")) return;
        
        try {
            const res = await adminAxios.post('/manage-category-crud', { action: 'delete', id });
            if(res.data.success) {
                setCategories(prev => prev.filter(c => c._id !== id));
                toast.success("Category Deleted");
            }
        } catch { toast.error("Delete Failed"); }
    };

    // =========================================================
    //                  SUBCATEGORY ACTIONS
    // =========================================================

    const handleSaveSubCategory = async (formData) => {
        try {
            const payload = {
                action: catModal.data ? 'update' : 'create',
                id: catModal.data?._id,
                targetUserId: userId,
                categoryId: selectedCat._id, 
                ...formData
            };

            const res = await adminAxios.post('/manage-subcategory-crud', payload);

            if (res.data.success) {
                const returnedItem = res.data.subCategory;

                if (catModal.data) {
                    setSubCategories(prev => prev.map(s => s._id === returnedItem._id ? returnedItem : s));
                    toast.success("SubCategory Updated");
                } else {
                    setSubCategories(prev => [...prev, returnedItem]);
                    toast.success("SubCategory Created");
                }
                setCatModal({ ...catModal, open: false });
            }
        } catch (error) {
            toast.error("Operation Failed");
        }
    };

    const handleDeleteSubCategory = async (e, id) => {
        e.stopPropagation();
        if(!window.confirm("Delete SubCategory? Products inside will be lost.")) return;

        try {
            const res = await adminAxios.post('/manage-subcategory-crud', { action: 'delete', id });
            if(res.data.success) {
                setSubCategories(prev => prev.filter(s => s._id !== id));
                toast.success("SubCategory Deleted");
            }
        } catch { toast.error("Delete Failed"); }
    };

    // =========================================================
    //                    PRODUCT ACTIONS
    // =========================================================

    const handleAddProduct = async (formData) => {
        try {
            const payload = {
                ...formData,
                targetUserId: userId,
                subCategoryId: selectedSub._id
            };
            const res = await adminAxios.post('/create-product', payload);
            if(res.data.success) {
                setProducts(prev => [...prev, res.data.product]);
                toast.success("Product Created");
                setIsProdModalOpen(false);
            }
        } catch { toast.error("Failed to create product"); }
    };

    const handleDeleteProduct = async (prodId) => {
        if(!window.confirm("Delete this product permanently?")) return;
        try {
            await adminAxios.delete(`/delete-product/${prodId}`);
            setProducts(prev => prev.filter(p => p._id !== prodId));
            toast.success("Product Deleted");
        } catch { toast.error("Delete failed"); }
    };

    const handleUpdatePrice = async (prodId, field, val) => {
        try {
            await adminAxios.put(`/update-product/${prodId}`, { [field]: val });
            toast.success("Price Saved");
        } catch { toast.error("Update Failed"); }
    };

    // =========================================================
    //                       UI RENDER
    // =========================================================

    return (
        <div>
            {/* Header Navigation */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    {view !== 'categories' && (
                        <button 
                            onClick={() => setView(view === 'products' ? 'subcategories' : 'categories')} 
                            className="flex items-center gap-1 font-bold text-slate-500 hover:text-slate-900 transition-colors"
                        >
                            <ArrowLeft size={18}/> Back
                        </button>
                    )}
                    {view === 'categories' && <h2 className="text-xl font-black text-slate-900">Categories</h2>}
                    {view === 'subcategories' && <h2 className="text-xl font-black text-slate-900">Inside: {selectedCat?.name}</h2>}
                    {view === 'products' && <h2 className="text-xl font-black text-slate-900">{selectedSub?.name} / Products</h2>}
                </div>

                {/* --- DYNAMIC ADD BUTTON --- */}
                {view === 'categories' && (
                    <button 
                        onClick={() => setCatModal({ open: true, type: 'Category', data: null })} 
                        className="bg-slate-900 text-white px-4 py-2 rounded-xl font-bold flex gap-2 text-sm shadow-lg hover:bg-slate-800"
                    >
                        <Plus size={18} /> New Category
                    </button>
                )}
                {view === 'subcategories' && (
                    <button 
                        onClick={() => setCatModal({ open: true, type: 'SubCategory', data: null })} 
                        className="bg-slate-900 text-white px-4 py-2 rounded-xl font-bold flex gap-2 text-sm shadow-lg hover:bg-slate-800"
                    >
                        <Plus size={18} /> New SubCategory
                    </button>
                )}
                {view === 'products' && (
                    <button 
                        onClick={() => setIsProdModalOpen(true)} 
                        className="bg-slate-900 text-white px-4 py-2 rounded-xl font-bold flex gap-2 text-sm shadow-lg hover:bg-slate-800"
                    >
                        <Plus size={18} /> Add Product
                    </button>
                )}
            </div>

            {/* --- VIEW 1: CATEGORIES --- */}
            {view === 'categories' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {categories.map(cat => (
                        <div key={cat._id} onClick={() => { setSelectedCat(cat); setView('subcategories'); }} className="bg-white p-6 rounded-4xl border border-slate-100 flex justify-between items-center cursor-pointer hover:shadow-lg hover:border-blue-100 transition-all group">
                            <div className="flex items-center gap-4">
                                <div className="bg-blue-50 p-3.5 rounded-2xl text-blue-600"><Layers size={24}/></div>
                                <div>
                                    <span className="font-bold text-lg text-slate-800 block">{cat.name}</span>
                                    {cat.desc && <span className="text-xs text-slate-400 font-medium">{cat.desc}</span>}
                                </div>
                            </div>
                            <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                <button onClick={(e) => { e.stopPropagation(); setCatModal({ open: true, type: 'Category', data: cat }); }} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-blue-600"><Edit2 size={16}/></button>
                                <button onClick={(e) => handleDeleteCategory(e, cat._id)} className="p-2 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-600"><Trash2 size={16}/></button>
                                <ChevronRight className="text-slate-300 ml-1"/>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* --- VIEW 2: SUBCATEGORIES --- */}
            {view === 'subcategories' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentSubCats.map(sub => (
                        <div key={sub._id} onClick={() => { setSelectedSub(sub); setView('products'); }} className="bg-white p-6 rounded-4xl border border-slate-100 flex justify-between items-center cursor-pointer hover:shadow-lg hover:border-purple-100 transition-all group">
                            <div className="flex items-center gap-4">
                                <div className="bg-purple-50 p-3.5 rounded-2xl text-purple-600"><Folder size={24}/></div>
                                <span className="font-bold text-lg text-slate-800">{sub.name}</span>
                            </div>
                            <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                <button onClick={(e) => { e.stopPropagation(); setCatModal({ open: true, type: 'SubCategory', data: sub }); }} className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-blue-600"><Edit2 size={16}/></button>
                                <button onClick={(e) => handleDeleteSubCategory(e, sub._id)} className="p-2 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-600"><Trash2 size={16}/></button>
                                <ChevronRight className="text-slate-300 ml-1"/>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* --- VIEW 3: PRODUCTS --- */}
            {view === 'products' && (
                <div className="space-y-3">
                    {currentProducts.map(prod => (
                        <div key={prod._id} className="bg-white p-5 rounded-3xl border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4 group">
                            <div className="flex items-center gap-4 w-full md:w-auto">
                                <div className="bg-emerald-50 p-3 rounded-xl text-emerald-600"><Package size={20}/></div>
                                <div>
                                    <p className="font-bold text-lg text-slate-900">{prod.label}</p>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 inline-block px-2 py-0.5 rounded-md mt-1">{prod.unit}</p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                                <div className="flex gap-2">
                                    <PriceInput label="Cost" val={prod.costPrice} onSave={(v)=>handleUpdatePrice(prod._id, 'costPrice', v)} />
                                    <PriceInput label="Retail" val={prod.sellingPrice} onSave={(v)=>handleUpdatePrice(prod._id, 'sellingPrice', v)} />
                                    <PriceInput label="Whole" val={prod.wholesalePrice} onSave={(v)=>handleUpdatePrice(prod._id, 'wholesalePrice', v)} />
                                </div>
                                <button onClick={() => handleDeleteProduct(prod._id)} className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors"><Trash2 size={18} /></button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* --- MODALS --- */}
            <AdminCategoryModal 
                isOpen={catModal.open} 
                onClose={() => setCatModal({ ...catModal, open: false })} 
                onSubmit={catModal.type === 'Category' ? handleSaveCategory : handleSaveSubCategory}
                initialData={catModal.data}
                type={catModal.type} 
            />

            <AdminProductModal 
                isOpen={isProdModalOpen} 
                onClose={() => setIsProdModalOpen(false)}
                onSubmit={handleAddProduct}
                loading={false}
            />
        </div>
    );
};

const PriceInput = ({ label, val, onSave }) => (
    <div className="bg-slate-50 p-2 rounded-xl border border-slate-100 text-center min-w-17.5">
        <p className="text-[9px] font-black uppercase text-slate-400 mb-1">{label}</p>
        <div className="flex justify-center items-center">
            <span className="text-xs text-slate-400 font-medium mr-0.5">₹</span>
            <input 
                className="w-12 bg-transparent text-center font-bold text-slate-900 outline-none"
                defaultValue={val}
                onBlur={(e) => onSave(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && e.target.blur()} 
            />
        </div>
    </div>
);

export default AdminInventoryView;