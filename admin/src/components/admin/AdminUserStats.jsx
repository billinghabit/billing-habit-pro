import React, { useEffect, useState } from 'react';
import adminAxios from '../../api/adminAxios';
import { TrendingUp, FileText, Calendar, CalendarDays, CalendarRange, Clock, XCircle, ShoppingBag, Truck } from 'lucide-react';

const AdminUserStats = ({ userId }) => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        adminAxios.get(`/user-analytics/${userId}`).then(res => {
            if (res.data.success) setStats(res.data.stats);
            setLoading(false);
        });
    }, [userId]);

    if (loading) return <div className="h-40 bg-slate-100 rounded-3xl animate-pulse mb-6"></div>;
    if (!stats) return null;

    return (
        <div className="mb-10 space-y-8">
            
            {/* 1. REALIZED REVENUE (Time Based) */}
            <div>
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Performance Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <StatGroup title="Today" icon={Calendar} data={stats.today} color="emerald" />
                    <StatGroup title="This Month" icon={CalendarDays} data={stats.month} color="purple" />
                    <StatGroup title="This Year" icon={CalendarRange} data={stats.year} color="blue" />
                    <StatGroup title="All Time" icon={CalendarRange} data={stats.allTime} color="yellow" />
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* 2. BUSINESS TYPE SPLIT (Retail vs Wholesale) */}
                <div>
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Business Split (All Time)</h3>
                    <div className="bg-white p-1 rounded-[2.5rem] border border-slate-100 shadow-sm grid grid-cols-2">
                        
                        {/* Retail Card */}
                        <div className="p-5 rounded-4xl hover:bg-slate-50 transition-colors">
                            <div className="flex items-center gap-2 mb-2 text-indigo-600">
                                <ShoppingBag size={18} />
                                <span className="font-bold text-xs uppercase tracking-wider">Retail</span>
                            </div>
                            <p className="text-2xl font-black text-slate-900">₹{stats.retail.sales.toLocaleString()}</p>
                            <div className="flex items-center gap-2 mt-1 text-xs font-bold text-green-600">
                                <TrendingUp size={12}/> Profit: ₹{stats.retail.profit.toLocaleString()}
                            </div>
                            <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase">{stats.retail.count} orders</p>
                        </div>

                        {/* Wholesale Card */}
                        <div className="p-5 rounded-4xl hover:bg-slate-50 transition-colors border-l border-slate-50">
                            <div className="flex items-center gap-2 mb-2 text-rose-600">
                                <Truck size={18} />
                                <span className="font-bold text-xs uppercase tracking-wider">Wholesale</span>
                            </div>
                            <p className="text-2xl font-black text-slate-900">₹{stats.wholesale.sales.toLocaleString()}</p>
                            <div className="flex items-center gap-2 mt-1 text-xs font-bold text-green-600">
                                <TrendingUp size={12}/> Profit: ₹{stats.wholesale.profit.toLocaleString()}
                            </div>
                            <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase">{stats.wholesale.count} orders</p>
                        </div>

                    </div>
                </div>

                {/* 3. PIPELINE (Pending vs Cancelled) */}
                <div>
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Pipeline Health</h3>
                    <div className="grid grid-cols-2 gap-4">
                         {/* Pending Card */}
                        <div className="bg-amber-50 p-5 rounded-4xl border border-amber-100 flex flex-col justify-center relative overflow-hidden">
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-2 text-amber-700">
                                    <Clock size={16} />
                                    <span className="font-bold text-xs uppercase tracking-wider">Pending</span>
                                </div>
                                <p className="text-2xl font-black text-amber-900">₹{stats.pending.amount.toLocaleString()}</p>
                                <p className="text-[10px] font-bold text-amber-600/70 mt-1">{stats.pending.count} bills</p>
                            </div>
                            <Clock className="absolute -right-3 -bottom-3 text-amber-500/10" size={80} />
                        </div>

                        {/* Cancelled Card */}
                        <div className="bg-red-50 p-5 rounded-4xl border border-red-100 flex flex-col justify-center relative overflow-hidden">
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-2 text-red-700">
                                    <XCircle size={16} />
                                    <span className="font-bold text-xs uppercase tracking-wider">Lost</span>
                                </div>
                                <p className="text-2xl font-black text-red-900">₹{stats.cancelled.amount.toLocaleString()}</p>
                                <p className="text-[10px] font-bold text-red-600/70 mt-1">{stats.cancelled.count} bills</p>
                            </div>
                            <XCircle className="absolute -right-3 -bottom-3 text-red-500/10" size={80} />
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

// Helper for the Main Stats (Top Row)
const StatGroup = ({ title, icon: Icon, data, color }) => {
    const colors = {
        blue: 'bg-blue-50 text-blue-700 border-blue-100',
        purple: 'bg-purple-50 text-purple-700 border-purple-100',
        emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100',
        yellow: 'bg-gray-500 text-white border-gray-100',
    };

    return (
        <div className={`p-5 rounded-4xl border ${colors[color]} relative overflow-hidden`}>
            <div className="flex items-center gap-2 mb-3">
                <Icon size={18} className="opacity-70" />
                <span className="font-bold text-sm uppercase tracking-wider">{title}</span>
            </div>
            
            <div className="space-y-1 relative z-10">
                <div className="flex justify-between items-end">
                    <span className="text-xs font-bold opacity-60">Sales</span>
                    <span className="text-xl font-black">₹{data.sales.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-end">
                    <span className="text-xs font-bold opacity-60">Profit</span>
                    <span className="text-xl font-black flex items-center gap-1">
                        <TrendingUp size={14}/> ₹{data.profit.toLocaleString()}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default AdminUserStats;