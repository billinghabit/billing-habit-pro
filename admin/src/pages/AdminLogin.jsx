import React, { useState } from 'react';
import adminAxios from '../api/adminAxios';
import toast from 'react-hot-toast';
import { ShieldCheck, Loader2 } from 'lucide-react';

const AdminLogin = ({ setAuth }) => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await adminAxios.post('/login', formData);
            if (res.data.success) {
                setAuth(true);
                toast.success("Welcome Admin");
            } else toast.error(res.data.message);
        } catch { toast.error("Server Error"); }
        setLoading(false);
    };

    return (
        <div className="h-screen flex items-center justify-center bg-slate-900 p-4">
            <div className="bg-white w-full max-w-md p-10 rounded-[2.5rem]">
                <div className="flex justify-center mb-6 text-blue-600"><ShieldCheck size={50} /></div>
                <h1 className="text-3xl font-black text-center mb-8">Admin Portal</h1>
                <form onSubmit={handleLogin} className="space-y-4">
                    <input type="email" placeholder="Email" className="w-full p-4 bg-slate-50 rounded-xl outline-none font-bold" value={formData.email} onChange={e=>setFormData({...formData, email:e.target.value})} required />
                    <input type="password" placeholder="Password" className="w-full p-4 bg-slate-50 rounded-xl outline-none font-bold" value={formData.password} onChange={e=>setFormData({...formData, password:e.target.value})} required />
                    <button disabled={loading} className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl flex justify-center">
                        {loading ? <Loader2 className="animate-spin" /> : "Access Dashboard"}
                    </button>
                </form>
            </div>
        </div>
    );
};
export default AdminLogin;