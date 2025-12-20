import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext.jsx';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Loader2, Layers, ChevronRight, Plus, X, Edit2, Trash2, Settings, AlertTriangle } from 'lucide-react';

const Category = ({ searchTerm }) => {
    const { axios, setList } = useAppContext();
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isManageMode, setIsManageMode] = useState(false);
    
    // Modals
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    
    const [formData, setFormData] = useState({ name: '', desc: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // --- Color Accent: Dark Slate ---
    const primaryAccentBg = 'bg-slate-900';
    const primaryAccentBgLight = 'bg-slate-100';
    const primaryAccentRing = 'focus:ring-slate-900/30';
    const primaryAccentText = 'text-slate-900';


    useEffect(() => {
        setList({});
        const fetchCategories = async () => {
            try {
                const { data } = await axios.get('/category/get-all');
                if (data.success) setCategories(data.categories);
            } catch (error) { toast.error("Failed to load categories"); } 
            finally { setLoading(false); }
        };
        fetchCategories();
    }, [axios, setList]);

    const handleOpenModal = (cat = null) => {
        setEditingCategory(cat ? cat._id : null);
        setFormData(cat ? { name: cat.name, desc: cat.desc || '' } : { name: '', desc: '' });
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name) return toast.error("Name is required");
        setIsSubmitting(true);
        try {
            if (editingCategory) {
                const res = await axios.put(`/category/update/${editingCategory}`, formData);
                if (res.data.success) {
                    toast.success("Updated!");
                    setCategories(prev => prev.map(c => c._id === editingCategory ? { ...c, ...formData } : c));
                }
            } else {
                const res = await axios.post('/category/create', formData);
                if (res.data.success) {
                    toast.success("Created!");
                    setCategories([...categories, res.data.category]);
                }
            }
            setIsModalOpen(false);
        } catch (error) { toast.error("Operation failed"); } 
        finally { setIsSubmitting(false); }
    };

    const handleDelete = async () => {
        if (!deleteId) return;
        setIsSubmitting(true);
        try {
            const res = await axios.delete(`/category/delete/${deleteId}`);
            if (res.data.success) {
                toast.success("Deleted");
                setCategories(prev => prev.filter(c => c._id !== deleteId));
                setIsDeleteModalOpen(false);
            }
        } catch (error) { toast.error("Delete failed"); } 
        finally { setIsSubmitting(false); }
    };

    const filtered = categories.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));

    // --- Custom Category Skeleton Loader ---
    const CategorySkeleton = () => (
        <div className="grid grid-cols-2 gap-3 pb-4 animate-pulse">
            {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-white p-4 rounded-2xl shadow-md border border-gray-100 h-36">
                    <div className="bg-gray-200 p-2.5 rounded-full mb-3 w-10 h-10"></div>
                    <div className="bg-gray-200 h-4 w-4/5 rounded mb-2"></div>
                    <div className="bg-gray-100 h-4 w-1/2 rounded"></div>
                </div>
            ))}
        </div>
    );
    // ----------------------------------------

    return (
        <div className="px-4">
            {/* Header and Manage Toggle (Always visible) */}
            <div className="flex justify-between items-center mb-4 px-1 pt-4">
                <div className="flex items-center gap-2">
                    <h2 className="font-bold text-gray-800 text-lg">Categories</h2>
                    <span className="text-[10px] font-bold text-gray-500 bg-white px-2 py-1 rounded-full border border-gray-200 shadow-sm">{categories.length}</span>
                </div>
                <button onClick={() => setIsManageMode(!isManageMode)} className={`p-2 rounded-xl transition-all active:scale-[0.95] ${isManageMode ? `${primaryAccentBg} text-white shadow-lg shadow-slate-900/30` : 'bg-white text-gray-500 border border-gray-200 shadow-md hover:bg-gray-50'}`}><Settings size={18} /></button>
            </div>
            
            {/* Conditionally render Skeleton or Content */}
            {loading ? (
                <CategorySkeleton />
            ) : (
                <div className="grid grid-cols-2 gap-3 pb-4">
                    {/* Display filtered categories or message if none found */}
                    {filtered.length === 0 ? (
                        <div className="col-span-2 text-center py-12 text-gray-500">
                             <Layers size={32} className="opacity-30 mx-auto mb-2"/>
                             <p className="font-medium">No categories found matching "{searchTerm}".</p>
                        </div>
                    ) : (
                        filtered.map((cat) => (
                            <div key={cat._id} onClick={() => !isManageMode && navigate(`/sub-category/${cat._id}`)} className={`bg-white p-4 rounded-2xl shadow-md border transition-all duration-200 flex flex-col justify-between h-36 relative overflow-hidden group ${isManageMode ? 'ring-2 ring-slate-300' : 'border-gray-100 active:scale-[0.97] cursor-pointer hover:shadow-lg'}`}>
                                {/* Subtle Accent Glow */}
                                <div className={`absolute -right-6 -top-6 w-20 h-20 ${primaryAccentBgLight} rounded-full group-hover:scale-150 transition-transform duration-500 ease-out`}></div>
                                
                                <div className="relative z-10 flex-1 flex flex-col items-start justify-center">
                                    {/* Icon - Layers icon for categories, using a light accent BG */}
                                    <div className={`bg-blue-100 p-2.5 rounded-full mb-3 text-blue-800 shadow-inner`}><Layers size={20} /></div>
                                    <h3 className="font-bold text-gray-800 leading-snug line-clamp-2 text-[15px]">{cat.name}</h3>
                                </div>
                                <div className="relative z-10 flex justify-between items-end mt-2 w-full">
                                    {isManageMode ? (
                                        <div className="flex gap-2 w-full animate-in fade-in zoom-in duration-200">
                                            <button onClick={(e) => { e.stopPropagation(); handleOpenModal(cat); }} className="flex-1 bg-blue-50 text-blue-900 p-2 rounded-lg flex justify-center hover:bg-blue-100 transition-colors shadow-sm"><Edit2 size={16}/></button>
                                            <button onClick={(e) => { e.stopPropagation(); setDeleteId(cat._id); setIsDeleteModalOpen(true); }} className="flex-1 bg-red-50 text-red-600 p-2 rounded-lg flex justify-center hover:bg-red-100 transition-colors shadow-sm"><Trash2 size={16}/></button>
                                        </div>
                                    ) : (
                                        <><span className="text-[10px] text-gray-400 font-bold uppercase">Select</span><div className={`bg-gray-50 p-1.5 rounded-full text-gray-400 group-hover:${primaryAccentBg} group-hover:text-white transition-colors`}><ChevronRight size={14} strokeWidth={3}/></div></>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                    
                    {/* Add Category Button (Always visible if not loading) */}
                    {!loading && filtered.length > 0 && (
                        <button onClick={() => handleOpenModal()} className={`bg-white border-2 border-dashed border-gray-300 p-4 rounded-2xl active:scale-[0.97] transition-all h-36 flex flex-col justify-center items-center group hover:border-slate-400 hover:shadow-md`}>
                            <div className="bg-gray-50 p-3 rounded-full shadow-sm mb-2 group-hover:bg-slate-100"><Plus size={24} className="text-gray-400 group-hover:text-slate-700"/></div>
                            <span className="text-sm font-bold text-gray-500">Add Category</span>
                        </button>
                    )}
                </div>
            )}
            
            {/* Modals remain below */}

            {/* Create/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden">
                        <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50"><h3 className="font-bold text-xl text-gray-800">{editingCategory ? 'Edit Category' : 'New Category'}</h3><button onClick={() => setIsModalOpen(false)} className="p-1 text-gray-500 hover:bg-gray-200 rounded-full"><X size={22} /></button></div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <input autoFocus type="text" placeholder="Name" className={`w-full p-3 border border-gray-300 rounded-xl outline-none focus:ring-2 ${primaryAccentRing}`} value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                            <input type="text" placeholder="Description (Optional)" className={`w-full p-3 border border-gray-300 rounded-xl outline-none focus:ring-2 ${primaryAccentRing}`} value={formData.desc} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                            <button type="submit" disabled={isSubmitting} className={`w-full py-3.5 ${primaryAccentBg} text-white font-bold rounded-xl shadow-lg shadow-slate-900/30 hover:bg-slate-800 transition-all flex justify-center items-center gap-2`}>
                                {isSubmitting ? <Loader2 className="animate-spin" size={20}/> : "Save"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xs p-6 text-center">
                        <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600 ring-4 ring-red-50/50"><AlertTriangle size={32}/></div>
                        <h3 className="text-xl font-bold mb-2 text-gray-900">Delete Category?</h3>
                        <p className="text-sm text-gray-500 mb-6">This will delete ALL products inside.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setIsDeleteModalOpen(false)} className="flex-1 py-3 bg-gray-100 rounded-xl font-bold text-gray-700 hover:bg-gray-200 transition-colors">Cancel</button>
                            <button onClick={handleDelete} disabled={isSubmitting} className="flex-1 py-3 bg-red-600 rounded-xl font-bold text-white flex justify-center items-center gap-2 hover:bg-red-700 shadow-md shadow-red-500/30">
                                {isSubmitting ? <Loader2 className="animate-spin" size={18}/> : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Category;