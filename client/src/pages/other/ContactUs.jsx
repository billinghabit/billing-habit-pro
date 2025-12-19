import React from 'react';
import { Mail, Phone, MapPin, Headphones, ChevronRight, Clock, MessageCircle } from 'lucide-react';
import Navbar from '../../components/layout/Navbar.jsx';

const ContactUs = () => {
    return (
        <div className="bg-gray-50 min-h-screen pb-4">
            <Navbar title={"Contact Us"} />
            
            <div className="max-w-md mx-auto px-6 pt-10 space-y-8">
                
                {/* Visual Header */}
                <div className="text-center space-y-4">
                    <div className="w-20 h-20 bg-white rounded-3xl shadow-xl shadow-slate-100 mx-auto flex items-center justify-center border border-gray-50">
                        <Headphones size={36} className="text-slate-900" strokeWidth={1.5} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-slate-900 tracking-tight">Customer Support</h2>
                        <p className="text-gray-500 text-sm mt-2 max-w-[260px] mx-auto leading-relaxed">
                            Have questions or facing issues? We are here to help you grow.
                        </p>
                    </div>
                </div>

                {/* Contact Actions Grid */}
                <div className="space-y-4">
                    
                    {/* WhatsApp Card (New) */}
                    <a 
                        href="https://wa.me/919685208320"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group flex items-center gap-4 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-green-200 transition-all active:scale-[0.98]"
                    >
                        <div className="w-12 h-12 rounded-full bg-green-50 text-green-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                            <MessageCircle size={22} strokeWidth={2}/>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-slate-900 text-sm">Chat on WhatsApp</h3>
                            <p className="text-xs text-gray-500 mt-0.5">+91 968520 8320</p>
                        </div>
                        <ChevronRight size={18} className="text-gray-300 group-hover:text-slate-900 transition-colors" />
                    </a>

                    {/* Email Card */}
                    <a 
                        href="mailto:support@billinghabit.com"
                        className="group flex items-center gap-4 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all active:scale-[0.98]"
                    >
                        <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                            <Mail size={22} strokeWidth={2}/>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-slate-900 text-sm">Email Support</h3>
                            <p className="text-xs text-gray-500 mt-0.5 truncate">billinghabit@gmail.com</p>
                        </div>
                        <ChevronRight size={18} className="text-gray-300 group-hover:text-slate-900 transition-colors" />
                    </a>

                    {/* Phone Card */}
                    <a 
                        href="tel:+919685208320"
                        className="group flex items-center gap-4 p-5 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all active:scale-[0.98]"
                    >
                        <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                            <Phone size={22} strokeWidth={2}/>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-slate-900 text-sm">Call Us</h3>
                            <p className="text-xs text-gray-500 mt-0.5">+91 968520 8320</p>
                        </div>
                        <ChevronRight size={18} className="text-gray-300 group-hover:text-slate-900 transition-colors" />
                    </a>
                </div>

                {/* Additional Info / Office */}
                <div className="bg-white/60 p-5 rounded-2xl border border-gray-100/50 backdrop-blur-sm space-y-4">
                    <div className="flex items-start gap-3">
                        <MapPin size={16} className="text-gray-400 mt-0.5 shrink-0" />
                        <div>
                            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Office Location</h4>
                            <p className="text-xs text-gray-500 leading-relaxed">
                                Jabalpur, MP India - 482001
                            </p>
                        </div>
                    </div>
                    <div className="h-px bg-gray-100 w-full"></div>
                    <div className="flex items-start gap-3">
                        <Clock size={16} className="text-gray-400 mt-0.5 shrink-0" />
                        <div>
                            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">Working Hours</h4>
                            <p className="text-xs text-gray-500">
                                Mon - Sat: 10:00 AM - 7:00 PM
                            </p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ContactUs;