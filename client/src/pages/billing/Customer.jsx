import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext.jsx';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Loader2, X, Plus, User, Search, MapPin, Phone, Users } from 'lucide-react';
import Navbar from '../../components/layout/Navbar.jsx';

const Customer = () => {
    const { navigate, setSelectedCustomer } = useAppContext();
    const [customers, setCustomers] = useState([]); 
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [formData, setFormData] = useState({ name: '', address: '', number: '' });

    // --- Theme Accents ---
    const primaryAccentBg = 'bg-slate-900';
    const primaryAccentRing = 'focus:ring-slate-900/30';

    useEffect(() => {
        const fetch = async () => {
            try {
                const res = await axios.get('/customer/all');
                setCustomers(res.data.customers);
                setFilteredCustomers(res.data.customers);
            } catch (e) { toast.error("Failed to load customers"); } 
            finally { setLoading(false); }
        };
        fetch();
    }, [axios]);

    useEffect(() => {
        const term = searchTerm.toLowerCase();
        setFilteredCustomers(customers.filter(c => c.name.toLowerCase().includes(term) || c.number.includes(term)));
    }, [searchTerm, customers]);

    const handleSelect = (cust) => { setSelectedCustomer(cust); navigate('/view-quote'); };

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!formData.name) return toast.error("Name required");
        setIsCreating(true);
        try {
            // Using placeholder fields for focus ring color
            const res = await axios.post('/customer/add', formData);
            if (res.data.success) {
                toast.success("Created!");
                handleSelect(res.data.customer);
                setFormData({ name: '', address: '', number: '' });
                setIsModalOpen(false); // Close on success
            }
        } catch (e) { toast.error("Failed to create"); } 
        finally { setIsCreating(false); }
    };

    // --- Customer List Skeleton ---
    const CustomerSkeleton = () => (
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-pulse">
            {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-gray-200 shrink-0"></div>
                    <div className="flex-1 min-w-0 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                    </div>
                </div>
            ))}
        </div>
    );

    if (loading) return (
        <div className="bg-gray-50 min-h-screen">
            <Navbar title="Loading..." />
            <CustomerSkeleton />
        </div>
    );

    return (
        <div className="pb-24 bg-gray-50 min-h-screen">
            <Navbar title="Select Customer" />
            
            {/* Sticky Search Bar (Matching Home UI) */}
            <div className="sticky top-14 z-10 px-5 pb-2 pt-4 bg-gray-50/95 backdrop-blur-sm border-b border-gray-100 shadow-md">
                <div className="relative max-w-2xl mx-auto">
                    <input 
                        type="text" 
                        placeholder="Search customer name or number..." 
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)} 
                        className={`w-full p-3.5 pl-12 rounded-2xl border border-gray-200 shadow-lg ${primaryAccentRing} text-gray-800 font-medium placeholder-gray-400 outline-none transition-all`} 
                    />
                    <Search className="absolute left-4 top-3.5 text-gray-400" size={22} />
                </div>
            </div>

            {/* Customer List */}
            <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCustomers.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center mt-16 text-gray-400 bg-white p-12 rounded-2xl shadow-sm border border-gray-100">
                        <Users size={40} className="opacity-30 mb-2"/>
                        <p className="text-base font-medium">No customers found.</p>
                    </div>
                ) : filteredCustomers.map(c => (
                    <div 
                        key={c._id} 
                        onClick={() => handleSelect(c)} 
                        className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4 active:scale-[0.98] cursor-pointer hover:shadow-md transition-all"
                    >
                        <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 shrink-0 text-slate-700">
                            <User size={24} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="text-base font-bold text-gray-800 truncate">{c.name}</h3>
                            <div className="flex flex-col gap-0.5 mt-1">
                                {c.number && (
                                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                        <Phone size={12} className='text-gray-400'/>
                                        {c.number}
                                    </div>
                                )}
                                {c.address && (
                                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                                        <MapPin size={12} className='text-gray-400'/>
                                        <span className="truncate">{c.address}</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Floating Action Button (Add Customer) */}
            <button 
                onClick={() => setIsModalOpen(true)} 
                className={`fixed bottom-8 right-6 z-20 p-4 ${primaryAccentBg} text-white rounded-full shadow-xl shadow-slate-900/30 hover:bg-slate-800 active:scale-90 transition-all`}
            >
                <Plus size={28} strokeWidth={2.5} />
            </button>
            
            {/* Add Customer Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
                            <h2 className="text-lg font-bold text-gray-800">Add Customer</h2>
                            <button onClick={() => setIsModalOpen(false)} className="p-1 hover:bg-gray-200 rounded-full"><X size={22} /></button>
                        </div>
                        <form onSubmit={handleCreate} className="p-6 space-y-4">
                            <input autoFocus type="text" placeholder="Name *" className={`w-full p-3 border border-gray-300 rounded-xl outline-none focus:ring-2 ${primaryAccentRing}`} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                            <input type="tel" placeholder="Number" className={`w-full p-3 border border-gray-300 rounded-xl outline-none focus:ring-2 ${primaryAccentRing}`} value={formData.number} onChange={e => setFormData({...formData, number: e.target.value})} />
                            <textarea placeholder="Address" className={`w-full p-3 border border-gray-300 rounded-xl outline-none resize-none focus:ring-2 ${primaryAccentRing}`} rows="2" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
                            <button disabled={isCreating} className={`w-full py-3.5 ${primaryAccentBg} text-white font-bold rounded-xl flex justify-center items-center gap-2 hover:bg-slate-800 transition-colors`}>
                                {isCreating ? <Loader2 className="animate-spin" size={20}/> : "Create & Continue"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Customer;