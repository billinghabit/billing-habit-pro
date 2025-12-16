import React from "react";
import { Share2, Copy, Gift, Users } from "lucide-react";
import toast from "react-hot-toast";
import Navbar from "../../components/layout/Navbar.jsx";

const InviteFriend = () => {
  const referralLink = "https://billinghabit.vercel.app"; 

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    toast.success("Link copied to clipboard!");
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join Billing Habit",
          text: "Manage your shop inventory and billing easily with Billing Habit!",
          url: referralLink,
        });
      } catch (error) {
        console.log("Error sharing", error);
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar title={"Invite Friends"} />
      <div className="max-w-md mx-auto px-6 py-10 text-center">
        {/* Visual Icon */}
        <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner relative">
          <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-20"></div>
          <Gift
            size={40}
            className="text-blue-600 relative z-10"
            strokeWidth={1.5}
          />
        </div>

        <h2 className="text-2xl font-black text-slate-900 mb-3">
          Invite Friends &<br />
          Grow Together
        </h2>
        <p className="text-gray-500 mb-8 text-sm leading-relaxed">
          Help your friends manage their business better. Share the app with
          other shop owners and build your network.
        </p>

        {/* Copy Link Section */}
        <div className="bg-white p-2 rounded-xl border border-gray-200 flex items-center justify-between shadow-sm mb-6 pl-4">
          <span className="text-xs font-bold text-gray-500 truncate max-w-[150px]">
            {referralLink}
          </span>
          <button
            onClick={handleCopy}
            className="p-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
          >
            <Copy size={18} />
          </button>
        </div>

        {/* Main Share Button */}
        <button
          onClick={handleShare}
          className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl shadow-xl shadow-slate-900/20 hover:bg-slate-800 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          <Share2 size={20} /> Share App Link
        </button>

        <div className="mt-12 pt-8 border-t border-gray-200">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
            Why invite?
          </p>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
              <Users size={24} className="text-green-500 mx-auto mb-2" />
              <p className="text-xs font-bold text-gray-700">Community</p>
            </div>
            <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
              <Gift size={24} className="text-purple-500 mx-auto mb-2" />
              <p className="text-xs font-bold text-gray-700">Rewards</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InviteFriend;
