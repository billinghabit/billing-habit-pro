import React, { useState, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext.jsx';
import toast from 'react-hot-toast';
import { User, Store, MapPin, Phone, Mail, Lock, Save, ChevronLeft, Edit2, ShieldCheck, ChevronRight, Loader2 } from 'lucide-react'; // Added Loader2 manually


const Profile = () => {
    const { user, setUser, axios, navigate } = useAppContext();
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({ name: '', email: '', shopName: '', number: '', address: '', pin: '' });

    // --- Color Accent: Dark Slate ---
    const primaryAccent = 'text-slate-900';
    const primaryAccentBg = 'bg-slate-900';
    const highlightBg = 'bg-slate-50'; 
    const bgGradient = 'bg-linear-to-br from-blue-800 to-slate-900';

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '', email: user.email || '',
                shopName: user.shopName || '', number: user.number || '',
                address: user.address || '', pin: '' 
            });
        }
    }, [user]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = { ...formData };
            if (!payload.pin) delete payload.pin; 
            const res = await axios.post('/user/update-details', payload);
            if (res.data.success) {
                toast.success("Profile Updated!");
                setUser(res.data.user);
                setIsEditing(false);
            } else { toast.error(res.data.message || "Update Failed"); }
        } catch (error) { toast.error("Failed to update profile"); } 
        finally { setLoading(false); }
    };

    return (
        <div className="bg-gray-50 min-h-screen pb-28">
            {/* Header (WhatsApp Style: Solid Dark Bar) */}
            <div className={`sticky top-0 z-30 ${bgGradient} px-4 h-16 flex items-center gap-3 shadow-md`}>
                <button onClick={() => navigate('/')} className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors text-white"><ChevronLeft size={24} strokeWidth={2.5} /></button>
                <h1 className="font-bold text-xl text-white">My Profile</h1>
                {!isEditing && <button onClick={() => setIsEditing(true)} className="ml-auto text-sm font-semibold bg-white/10 text-white px-3 py-1.5 rounded-xl transition-colors active:scale-95 flex items-center gap-1"><Edit2 size={14}/> Edit</button>}
            </div>

            <form onSubmit={handleSave}>
                <div className="max-w-lg mx-auto">
                    
                    {/* Profile Picture Section */}
                    <div className="py-3 bg-white border-b border-gray-100 mb-4 shadow-sm">
                        <div className="relative w-24 h-24 mx-auto">
                            <img 
                                src={user?.photo || `https://ui-avatars.com/api/?name=${formData.name || 'User'}&background=0F172A&color=fff&size=128`} 
                                alt="Profile" 
                                className="w-full h-full rounded-full border-4 border-gray-50 shadow-lg object-cover bg-white"
                            />
                            {isEditing && (
                                <div className={`absolute bottom-0 right-0 ${primaryAccentBg} text-white p-2 rounded-full border-2 border-white shadow-md active:scale-95 cursor-pointer`}>
                                    <Edit2 size={16} />
                                </div>
                            )}
                        </div>
                        
                        <div className="text-center mt-4">
                            <h2 className="text-xl font-bold text-gray-900">{formData.name || 'User'}</h2>
                            <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold border border-amber-100"><ShieldCheck size={12}/> {user?.isPremium ? 'Premium Account' : 'Free Account'}</div>
                        </div>
                    </div>

                    {/* --- DETAILS SECTION (WhatsApp List Style) --- */}
                    <div className="bg-white divide-y divide-gray-100 shadow-sm border border-gray-100">
                        
                        <ListHeading title="Personal Details" />
                        
                        {/* 💥 FIX: Passing isEditing prop */}
                        <ProfileListRow icon={User} label="Name" name="name" value={formData.name} onChange={handleChange} disabled={!isEditing} isEditing={isEditing} />
                        <ProfileListRow icon={Mail} label="Email" name="email" value={formData.email} onChange={handleChange} disabled={true} isEditing={isEditing} />
                        <ProfileListRow icon={Phone} label="Mobile" name="number" value={formData.number} onChange={handleChange} disabled={!isEditing} isEditing={isEditing} />
                        
                        <ListHeading title="Shop Details" />
                        
                        {/* 💥 FIX: Passing isEditing prop */}
                        <ProfileListRow icon={Store} label="Shop Name" name="shopName" value={formData.shopName} onChange={handleChange} disabled={!isEditing} isEditing={isEditing} />
                        <ProfileListRow icon={MapPin} label="Address" name="address" value={formData.address} onChange={handleChange} disabled={!isEditing} multiline={true} isEditing={isEditing} />

                        {/* Security Update Section */}
                        {isEditing && (
                            <>
                                <ListHeading title="Security" />
                                <div className="p-4 bg-red-50 border-y border-red-100">
                                    <div className="flex items-center gap-3 mb-3 text-red-700 font-bold">
                                        <Lock size={18}/> New 4-Digit PIN
                                    </div>
                                    <input 
                                        type="text" 
                                        name="pin" 
                                        maxLength={4} 
                                        inputMode="numeric" 
                                        placeholder="Leave blank to keep current PIN" 
                                        value={formData.pin} 
                                        onChange={handleChange} 
                                        className="w-full p-2.5 text-base outline-none font-bold text-center tracking-widest placeholder:tracking-normal placeholder:font-normal placeholder:text-gray-400 border border-red-300 rounded-xl focus:ring-2 focus:ring-red-500/50 transition-colors"
                                    />
                                </div>
                            </>
                        )}

                    </div>
                </div>

                {/* Fixed Bottom Save/Cancel Bar - MODIFIED HERE */}
                {isEditing && (
                    <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 flex gap-3 z-20 shadow-[0_-8px_30px_rgba(0,0,0,0.1)]">
                        <button type="button" onClick={() => { setIsEditing(false); setFormData(prev => ({...prev, pin: ''})); }} className="flex-1 py-3.5 bg-gray-100 text-gray-700 rounded-xl font-bold text-base hover:bg-gray-200 transition-colors shadow-sm">Cancel</button>
                        
                        {/* Primary Button FIX: Use a fixed width container for the icon/spinner */}
                        <button type="submit" disabled={loading} className={`flex-2 py-3.5 ${primaryAccentBg} text-white rounded-xl font-bold text-base flex justify-center items-center gap-2 shadow-lg shadow-slate-900/30 hover:bg-slate-800 transition-colors active:scale-[0.98]`}>
                            {/* Fixed Container for Icon/Spinner */}
                            <span className="w-5 h-5 flex items-center justify-center">
                                {loading ? <Loader2 className="animate-spin" size={20}/> : <Save size={18}/>}
                            </span>
                            Save Changes
                        </button>
                    </div>
                )}
            </form>
        </div>
    );
};

// --- Custom Components for WhatsApp List Style ---

const ListHeading = ({ title }) => (
    <div className="px-4 py-2 bg-gray-50">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">{title}</h3>
    </div>
);

// 💥 FIX: isEditing is now accepted as a prop
const ProfileListRow = ({ icon: Icon, label, name, value, onChange, disabled, multiline = false, isEditing }) => (
    <div className={`flex items-start px-4 py-3 gap-4 transition-colors ${disabled ? 'opacity-90' : 'hover:bg-gray-50/50'}`}>
        {/* Icon Area */}
        <div className={`w-6 h-6 mt-1 rounded-full flex items-center justify-center text-slate-700 shrink-0`}>
            <Icon size={20} />
        </div>

        {/* Content Area */}
        <div className="flex-1 min-w-0">
            <label className="text-xs text-gray-500 font-medium block leading-none">{label}</label>
            
            {disabled || !isEditing ? (
                // Display Mode
                <p className={`text-base font-medium text-gray-800 leading-snug ${multiline ? 'whitespace-normal' : 'truncate'}`}>
                    {value || (disabled ? "Not Set / Managed by System" : "Tap to Add")}
                </p>
            ) : (
                // Edit Mode (Input)
                <input 
                    type={name === 'number' ? 'tel' : 'text'}
                    name={name} 
                    value={value} 
                    onChange={onChange} 
                    className="w-full text-base text-gray-800 font-medium outline-none bg-transparent border-b border-gray-300 focus:border-slate-900 transition-colors py-0.5" 
                    placeholder={`Enter ${label}`}
                />
            )}
        </div>

        {/* Edit Icon/Chevron (Only visible in edit mode and enabled fields) */}
        {!disabled && isEditing && (
             <div className="p-1 mt-1 text-gray-400 shrink-0">
                <ChevronRight size={18} />
             </div>
        )}
    </div>
);

export default Profile;