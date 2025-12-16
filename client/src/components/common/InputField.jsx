import React from 'react';

const InputField = ({ 
    icon: Icon, 
    label, 
    type = "text", 
    value, 
    onChange, 
    name, 
    disabled = false, 
    placeholder,
    maxLength
}) => {
    return (
        <div className={`relative transition-opacity ${disabled ? 'opacity-70 cursor-not-allowed' : 'opacity-100'}`}>
            {label && (
                <label className="text-[10px] font-bold text-gray-500 uppercase absolute left-10 top-2 z-10 tracking-wider pointer-events-none">
                    {label}
                </label>
            )}
            <div className={`
                flex items-end pb-2.5 pt-6 px-3 border rounded-xl transition-all duration-200
                ${disabled 
                    ? 'bg-gray-50 border-gray-100' 
                    : 'bg-white border-gray-200 focus-within:border-slate-900 focus-within:ring-4 focus-within:ring-slate-900/10 shadow-sm hover:border-gray-300'
                }
            `}>
                {Icon && (
                    <Icon 
                        size={18} 
                        className={`mr-3 mb-0.5 transition-colors ${disabled ? 'text-gray-300' : 'text-slate-500'}`} 
                    />
                )}
                <input 
                    type={type}
                    name={name}
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    maxLength={maxLength}
                    placeholder={placeholder || (disabled ? "Not set" : `Enter ${label}`)}
                    className={`w-full text-sm font-semibold outline-none bg-transparent placeholder:font-normal placeholder:text-gray-400 ${disabled ? 'text-gray-500 cursor-not-allowed' : 'text-slate-900'}`}
                />
            </div>
        </div>
    );
};

export default InputField;