import React, { useEffect, useState } from 'react';
import adminAxios from '../../api/adminAxios';
import { TrendingUp, FileText, Calendar, CalendarDays, CalendarRange, Clock, XCircle } from 'lucide-react';

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
        <div className="mb-10 space-y-6">
            
            {/* SECTION 1: REALIZED REVENUE (DELIVERED BILLS ONLY) */}
            <div>
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Realized Revenue (Delivered)</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StatGroup title="Today" icon={Calendar} data={stats.today} color="blue" />
                    <StatGroup title="This Month" icon={CalendarDays} data={stats.month} color="purple" />
                    <StatGroup title="This Year" icon={CalendarRange} data={stats.year} color="emerald" />
                </div>
            </div>

            {/* SECTION 2: PIPELINE OVERVIEW (PENDING & CANCELLED) */}
            <div>
                <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-3 ml-1">Pipeline Status</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Pending Card */}
                    <div className="bg-amber-50 p-5 rounded-4xl border border-amber-100 flex justify-between items-center relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-1 text-amber-700">
                                <Clock size={18} />
                                <span className="font-bold text-sm uppercase tracking-wider">Pending</span>
                            </div>
                            <p className="text-3xl font-black text-amber-900">₹{stats.pending.amount.toLocaleString()}</p>
                            <p className="text-xs font-bold text-amber-600 mt-1">{stats.pending.count} bills waiting</p>
                        </div>
                        {/* Decorative BG Icon */}
                        <Clock className="absolute -right-4 -bottom-4 text-amber-500/10" size={100} />
                    </div>

                    {/* Cancelled Card */}
                    <div className="bg-red-50 p-5 rounded-4xl border border-red-100 flex justify-between items-center relative overflow-hidden">
                        <div className="relative z-10">
                            <div className="flex items-center gap-2 mb-1 text-red-700">
                                <XCircle size={18} />
                                <span className="font-bold text-sm uppercase tracking-wider">Cancelled / Lost</span>
                            </div>
                            <p className="text-3xl font-black text-red-900">₹{stats.cancelled.amount.toLocaleString()}</p>
                            <p className="text-xs font-bold text-red-600 mt-1">{stats.cancelled.count} bills cancelled</p>
                        </div>
                         {/* Decorative BG Icon */}
                         <XCircle className="absolute -right-4 -bottom-4 text-red-500/10" size={100} />
                    </div>

                </div>
            </div>
        </div>
    );
};

// Helper Component for the Main Stats (Unchanged)
const StatGroup = ({ title, icon: Icon, data, color }) => {
    const colors = {
        blue: 'bg-blue-50 text-blue-700 border-blue-100',
        purple: 'bg-purple-50 text-purple-700 border-purple-100',
        emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    };

    return (
        <div className={`p-5 rounded-4xl border ${colors[color]} relative overflow-hidden`}>
            <div className="flex items-center gap-2 mb-3">
                <Icon size={18} className="opacity-70" />
                <span className="font-bold text-sm uppercase tracking-wider">{title}</span>
            </div>
            
            <div className="space-y-1 relative z-10">
                <div className="flex justify-between items-end">
                    <span className="text-xs font-bold opacity-60">Revenue</span>
                    <span className="text-xl font-black">₹{data.sales.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-end">
                    <span className="text-xs font-bold opacity-60">Net Profit</span>
                    <span className="text-xl font-black flex items-center gap-1">
                        <TrendingUp size={14}/> ₹{data.profit.toLocaleString()}
                    </span>
                </div>
                <div className="pt-2 mt-2 border-t border-black/5 flex justify-between items-center">
                    <span className="text-xs font-bold opacity-60">Delivered</span>
                    <div className="flex items-center gap-1 font-bold text-sm bg-white/50 px-2 py-0.5 rounded-lg">
                        <FileText size={12}/> {data.count}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminUserStats;