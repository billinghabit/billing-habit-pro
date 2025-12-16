import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useAppContext } from '../../context/AppContext.jsx';
import toast from 'react-hot-toast';
import { SquarePlus, X, Loader2, CircleCheckBig, Search, Settings, Edit2, Trash2, Box, AlertTriangle, ChevronRight, Circle } from 'lucide-react';
import Header from '../../components/layout/Header.jsx'; // Replaced Navbar with Header
import BottomNav from '../../components/layout/BottomNav.jsx';
import Navbar from '../../components/layout/Navbar.jsx';

const SubCategory = () => {
    const { categoryId } = useParams();
    const { navigate, axios, list } = useAppContext();

    const [categoryName, setCategoryName] = useState(''); 
    const [subCategories, setSubCategories] = useState([]); 
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true); // Default true for initial load
    const [isManageMode, setIsManageMode] = useState(false);
    
    // Modals
    const [isModalOpen, setIsModalOpen] = useState(false); 
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false); 
    
    const [editingSub, setEditingSub] = useState(null); 
    const [deleteId, setDeleteId] = useState(null); 
    const [newSubCategoryName, setNewSubCategoryName] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    // --- Theme Accents ---
    const primaryAccentBg = 'bg-slate-900';
    const primaryAccentRing = 'focus:ring-slate-900/30';
    const primaryAccentBgLight = 'bg-slate-100';

    useEffect(() => {
        const fetchData = async () => {
            // Note: Keep loading true initially
            try {
                const catRes = await axios.get(`/category/get/${categoryId}`);
                if (catRes.data.success) setCategoryName(catRes.data.category.name);
                const subRes = await axios.get(`/subcategory/get-for-category/${categoryId}`);
                if (subRes.data.success) setSubCategories(subRes.data.subCategories);
            } catch (error) { toast.error("Failed to fetch data"); } 
            finally { setLoading(false); }
        };
        if (categoryId) fetchData();
    }, [categoryId, axios]);

    const filledSubCategoryIds = useMemo(() => new Set(Object.values(list).map(item => item.subCategory)), [list]); 
    const filteredSubCategories = useMemo(() => !searchTerm ? subCategories : subCategories.filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase())), [subCategories, searchTerm]); 

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newSubCategoryName.trim()) return toast.error("Name is required.");
        setIsCreating(true);
        try {
            if (editingSub) {
                const res = await axios.put(`/subcategory/update/${editingSub._id}`, { name: newSubCategoryName });
                if (res.data.success) {
                    toast.success("Updated!");
                    setSubCategories(prev => prev.map(item => item._id === editingSub._id ? { ...item, name: newSubCategoryName } : item));
                }
            } else {
                const res = await axios.post(`/subcategory/create`, { name: newSubCategoryName, category: categoryId });
                if (res.data.success) {
                    toast.success("Created!");
                    setSubCategories([...subCategories, res.data.subCategory]);
                }
            }
            setIsModalOpen(false);
        } catch (error) { toast.error("Operation failed"); } 
        finally { setIsCreating(false); }
    };

    const confirmDelete = async () => {
        if (!deleteId) return;
        setIsCreating(true); 
        try {
            const res = await axios.delete(`/subcategory/delete/${deleteId}`);
            if(res.data.success) {
                toast.success("Deleted");
                setSubCategories(prev => prev.filter(item => item._id !== deleteId));
                setIsDeleteModalOpen(false);
            }
        } catch (error) { toast.error("Delete failed"); } 
        finally { setIsCreating(false); setDeleteId(null); }
    };

    // --- Skeleton Loader ---
    const SubCategorySkeleton = () => (
        <div className='grid grid-cols-2 gap-3 px-4 py-2 animate-pulse'>
            {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 h-36">
                    <div className="bg-gray-200 p-2.5 rounded-full mb-3 w-10 h-10"></div>
                    <div className="bg-gray-200 h-4 w-3/4 rounded mb-2"></div>
                    <div className="bg-gray-100 h-4 w-1/2 rounded"></div>
                </div>
            ))}
        </div>
    );

    return (
        <div className='pb-24 bg-gray-50 min-h-screen'>
            <Navbar title={categoryName || "Loading..."} />
            
            {/* Sticky Filter Bar */}
            <div className="sticky top-[72px] z-10 px-4 pt-1 mb-6 pb-3 bg-gray-50/95 backdrop-blur-sm ">
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <input 
                            type="text" 
                            placeholder="Search sub-categories..." 
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)} 
                            className="w-full p-3 pl-12 rounded-2xl border border-gray-200 shadow-lg focus:ring-4 focus:ring-slate-900/30 text-gray-800 font-medium placeholder-gray-400 outline-none transition-all" 
                        />
                        <Search className="absolute left-3 top-3.5 text-gray-400" size={20} />
                    </div>
                    <button 
                        onClick={() => setIsManageMode(!isManageMode)} 
                        className={`p-3 rounded-xl border transition-all active:scale-95 ${isManageMode ? `${primaryAccentBg} text-white shadow-lg` : 'bg-white text-gray-500 border-gray-300 hover:bg-gray-100'}`}
                    >
                        <Settings size={22} />
                    </button>
                </div>
            </div>
            
            {/* Main Content Area */}
            {loading ? (
                <SubCategorySkeleton />
            ) : (
                <div className='grid grid-cols-2 gap-3 px-4 py-2'>
                    {filteredSubCategories.map((row) => {
                        const isFilled = filledSubCategoryIds.has(row._id);
                        return (
                            <div 
                                key={row._id} 
                                onClick={() => !isManageMode && navigate(`/products/${row._id}`)} 
                                className={`bg-white p-4 rounded-2xl shadow-md border transition-all duration-200 flex flex-col justify-between h-36 relative overflow-hidden group ${isManageMode ? 'ring-2 ring-slate-300' : 'border-gray-100 active:scale-[0.97] cursor-pointer hover:shadow-lg'}`}
                            >
                                {/* Decorative Glow */}
                                <div className={`absolute -right-6 -top-6 w-20 h-20 ${primaryAccentBgLight} rounded-full group-hover:scale-150 transition-transform duration-500 ease-out`}></div>
                                
                                <div className="relative z-10 flex-1 flex flex-col items-start justify-center">
                                    <div className={`p-2.5 rounded-full mb-3 shadow-inner ${isFilled ? 'bg-blue-100 text-blue-900' : 'bg-blue-50 text-blue-00'}`}>
                                        {isFilled ? <CircleCheckBig size={20} /> : <Circle size={20} />}
                                    </div>
                                    <h3 className="font-bold text-gray-800 leading-snug line-clamp-2 text-[14px]">{row.name}</h3>
                                </div>
                                
                                <div className="relative z-10 flex justify-between items-end mt-2 w-full">
                                    {isManageMode ? (
                                        <div className="flex gap-2 w-full animate-in fade-in zoom-in duration-200">
                                            <button onClick={(e) => { e.stopPropagation(); setEditingSub(row); setNewSubCategoryName(row.name); setIsModalOpen(true); }} className="flex-1 bg-blue-50 text-blue-600 p-1.5 rounded-lg flex justify-center hover:bg-blue-100 transition-colors"><Edit2 size={16}/></button>
                                            <button onClick={(e) => { e.stopPropagation(); setDeleteId(row._id); setIsDeleteModalOpen(true); }} className="flex-1 bg-red-50 text-red-600 p-1.5 rounded-lg flex justify-center hover:bg-red-100 transition-colors"><Trash2 size={16}/></button>
                                        </div>
                                    ) : ( 
                                        <>
                                            <span className="text-[10px] text-gray-400 font-bold uppercase">Select</span>
                                            <div className={`bg-gray-50 p-1 rounded-full text-gray-400 group-hover:${primaryAccentBg} group-hover:text-white transition-colors`}>
                                                <ChevronRight size={14} strokeWidth={3}/>
                                            </div>
                                        </> 
                                    )}
                                </div>
                            </div>
                        );
                    })}
                    
                    {/* Add New Button */}
                    <button 
                        onClick={() => { setEditingSub(null); setNewSubCategoryName(''); setIsModalOpen(true); }} 
                        className='bg-white border-2 border-dashed border-gray-300 p-4 rounded-2xl active:scale-[0.97] transition-all flex flex-col justify-center items-center h-36 hover:border-slate-400 hover:shadow-md group'
                    >
                        <div className="bg-gray-50 p-3 rounded-full shadow-sm mb-2 group-hover:bg-slate-100 transition-colors">
                            <SquarePlus size={24} className="text-gray-400 group-hover:text-slate-700" />
                        </div>
                        <span className="text-sm font-bold text-gray-500">Add New</span>
                    </button>
                </div>
            )}

            {/* Create/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden">
                        <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
                            <h2 className="text-lg font-bold text-gray-800">{editingSub ? 'Edit Name' : 'New Sub-Category'}</h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-gray-200 rounded-full"><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <input 
                                autoFocus 
                                type="text" 
                                value={newSubCategoryName} 
                                onChange={(e) => setNewSubCategoryName(e.target.value)} 
                                className={`w-full px-3 py-3 border border-gray-300 rounded-xl outline-none focus:ring-2 ${primaryAccentRing}`} 
                                placeholder="Sub-Category Name" 
                            />
                            <button 
                                type="submit" 
                                disabled={isCreating} 
                                className={`w-full py-3.5 ${primaryAccentBg} text-white font-bold rounded-xl flex justify-center gap-2 hover:bg-slate-800 transition-colors`}
                            >
                                {isCreating ? <Loader2 className="animate-spin" size={20} /> : (editingSub ? "Update" : "Create")}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xs p-6 text-center">
                        <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600 ring-4 ring-red-50/50">
                            <AlertTriangle size={32} />
                        </div>
                        <h3 className="text-lg font-bold mb-2 text-gray-900">Delete Sub-Category?</h3>
                        <p className="text-sm text-gray-500 mb-6">This will delete all products inside.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-3 bg-gray-100 rounded-xl font-bold text-gray-700 hover:bg-gray-200 transition-colors">Cancel</button>
                            <button onClick={confirmDelete} disabled={isCreating} className="flex-1 py-3 bg-red-600 rounded-xl font-bold text-white flex justify-center items-center gap-2 hover:bg-red-700 shadow-md shadow-red-500/30">
                                {isCreating ? <Loader2 className="animate-spin" size={18}/> : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <BottomNav />
        </div>
    );
};

export default SubCategory;