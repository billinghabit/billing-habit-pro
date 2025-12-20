import React from 'react';
import { User, MapPin, Phone } from 'lucide-react';

const AdminCustomerList = ({ customers }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {customers.map(c => (
            <div key={c._id} className="bg-white p-5 rounded-4xl border border-slate-100 flex items-start gap-4">
                <div className="bg-blue-50 p-3 rounded-full text-blue-600 shrink-0"><User size={20}/></div>
                <div>
                    <p className="font-bold text-lg text-slate-900">{c.name}</p>
                    <p className="flex items-center gap-2 text-sm text-slate-500 mt-1"><Phone size={14}/> {c.number}</p>
                    <p className="flex items-center gap-2 text-sm text-slate-500"><MapPin size={14}/> {c.address}</p>
                </div>
            </div>
        ))}
    </div>
);
export default AdminCustomerList;