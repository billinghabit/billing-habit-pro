import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import adminAxios from '../api/adminAxios';
import { ArrowLeft, LayoutGrid, FileText, Users, Loader2 } from 'lucide-react';
import AdminInventoryView from '../components/admin/AdminInvetoryView';
import AdminQuoteList from '../components/admin/AdminQuoteList';
import AdminCustomerList from '../components/admin/AdminCustomerList';
import AdminUserStats from '../components/admin/AdminUserStats';

const UserDetails = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('inventory');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await adminAxios.get(`/user-details/${userId}`);
                if (res.data.success) setData(res.data.data);
            } catch (error) { console.error(error); }
            setLoading(false);
        };
        fetchData();
    }, [userId]);

    if (loading) return <div className="h-screen flex justify-center items-center"><Loader2 className="animate-spin"/></div>;

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Header */}
            <div className="bg-slate-900 text-white p-6 sticky top-0 z-50 shadow-xl">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 font-bold mb-4 hover:text-white transition-colors">
                    <ArrowLeft size={20} /> Back to Dashboard
                </button>
                <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
                    <h1 className="text-3xl font-black">Merchant Control</h1>
                    <div className="flex bg-white/10 p-1 rounded-xl self-start">
                        <TabButton active={activeTab === 'inventory'} onClick={() => setActiveTab('inventory')} icon={LayoutGrid} label="Inventory" />
                        <TabButton active={activeTab === 'quotes'} onClick={() => setActiveTab('quotes')} icon={FileText} label="Quotes" />
                        <TabButton active={activeTab === 'customers'} onClick={() => setActiveTab('customers')} icon={Users} label="Customers" />
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto p-6">
                <AdminUserStats userId={userId} /> 
                {activeTab === 'inventory' && <AdminInventoryView data={data} />}
                {activeTab === 'quotes' && <AdminQuoteList quotes={data.quotes} />}
                {activeTab === 'customers' && <AdminCustomerList customers={data.customers} />}
            </div>
        </div>
    );
};

const TabButton = ({ active, onClick, icon: Icon, label }) => (
    <button onClick={onClick} className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-bold text-sm transition-all ${active ? 'bg-white text-slate-900 shadow-lg' : 'text-slate-400 hover:text-white'}`}>
        <Icon size={16} /> {label}
    </button>
);

export default UserDetails;