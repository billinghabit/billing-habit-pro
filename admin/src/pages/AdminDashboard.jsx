import React, { useEffect, useState } from 'react';
import adminAxios from '../api/adminAxios';
import { Users, Package, FileText, Search, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const [stats, setStats] = useState({});
    const [users, setUsers] = useState([]);
    const [search, setSearch] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        adminAxios.get('/dashboard').then(res => {
            if(res.data.success) {
                setStats(res.data.stats);
                setUsers(res.data.recentUsers);
            }
        });
    }, []);

    const filtered = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.shopName?.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="max-w-6xl mx-auto p-8 space-y-8">
            <h1 className="text-4xl font-black text-slate-900">System Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard icon={Users} label="Total Users" value={stats.userCount} color="bg-blue-600" />
                <StatCard icon={Package} label="Total Products" value={stats.totalProducts} color="bg-emerald-600" />
                <StatCard icon={FileText} label="Total Quotes" value={stats.totalQuotes} color="bg-amber-500" />
            </div>

            <div className="card">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold">Registered Merchants</h2>
                    <div className="bg-slate-50 px-4 py-2 rounded-xl flex items-center gap-2 border">
                        <Search size={18} className="text-slate-400"/>
                        <input type="text" placeholder="Search..." className="bg-transparent outline-none font-medium" value={search} onChange={e=>setSearch(e.target.value)} />
                    </div>
                </div>
                <div className="space-y-2">
                    {filtered.map(user => (
                        <div key={user._id} onClick={() => navigate(`/user/${user._id}`)} className="p-4 hover:bg-slate-50 rounded-xl flex justify-between items-center cursor-pointer transition-colors border border-transparent hover:border-slate-100 group">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black shadow-lg shadow-slate-900/20">{user.name[0]}</div>
                                <div>
                                    <p className="font-bold text-slate-900">{user.shopName || user.name}</p>
                                    <div className='flex items-center justify-center gap-3'>
                                        <p className="text-xs text-slate-400 font-medium">{user.email}</p>
                                        <p className="text-xs text-slate-400 font-medium">{user.number}</p>
                                        <p className="text-xs text-slate-400 font-medium">{user.address}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={`px-2 py-1 rounded text-[10px] font-black uppercase ${user.isPremium ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500'}`}>{user.planType}</span>
                                <ChevronRight size={18} className="text-slate-300 group-hover:text-slate-900 transition-colors"/>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const StatCard = ({icon: Icon, label, value, color}) => (
    <div className="card flex items-center gap-4 border-l-4 border-l-slate-900">
        <div className={`p-4 ${color} text-white rounded-2xl shadow-lg shadow-current/30`}><Icon size={24}/></div>
        <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</p>
            <p className="text-3xl font-black text-slate-900">{value || 0}</p>
        </div>
    </div>
);
export default AdminDashboard;