import { User, Phone, MapPin } from "lucide-react";

const CustomerInfo = ({ selectedCustomer }) => {
  return (
    <div>
      {/* Compact Premium Customer Header */}
      <div className="px-4 py-3 bg-white border-b border-gray-100 flex items-center gap-3 relative overflow-hidden">
        {/* Subtle Decor (Optional) */}
        <div className="absolute top-0 right-0 w-16 h-16 bg-linear-to-bl from-gray-100 to-transparent rounded-bl-full -mr-4 -mt-4 opacity-50"></div>

        {/* Compact Avatar */}
        <div className="h-10 w-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-lg shadow-slate-900/20 shrink-0 z-10">
          <span className="font-bold text-sm">
            {selectedCustomer.name ? (
              selectedCustomer.name.charAt(0).toUpperCase()
            ) : (
              <User size={18} />
            )}
          </span>
        </div>

        {/* Text Details */}
        <div className="flex-1 min-w-0 z-10">
          <div className="flex justify-between items-baseline mb-0.5">
            <h3 className="text-base font-bold text-slate-900 truncate pr-2">
              {selectedCustomer.name || "Unknown Customer"}
            </h3>
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider shrink-0">
              Bill To
            </span>
          </div>

          {/* Inline Contact Details */}
          <div className="flex items-center gap-3 text-xs text-gray-500 font-medium truncate">
            {selectedCustomer.number && (
              <div className="flex items-center gap-1 shrink-0">
                <Phone size={11} className="text-slate-900" strokeWidth={2.5} />
                <span>{selectedCustomer.number}</span>
              </div>
            )}

            {selectedCustomer.number && selectedCustomer.address && (
              <span className="text-gray-300">•</span>
            )}

            {selectedCustomer.address && (
              <div className="flex items-center gap-1 truncate">
                <MapPin
                  size={11}
                  className="text-slate-900 shrink-0"
                  strokeWidth={2.5}
                />
                <span className="truncate">{selectedCustomer.address}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerInfo;
