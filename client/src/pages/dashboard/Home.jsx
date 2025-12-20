import React, { useState } from 'react';
import { Search } from 'lucide-react';
import Header from '../../components/layout/Header.jsx';
import Category from '../../pages/inventory/Category.jsx';
import Footer from '../../components/layout/Footer.jsx';

const Home = () => {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <div className="bg-gray-50 min-h-screen pb-20"> 
            <Header />
            <div> 
            
                {/* Search Bar Section */}
                <div className="px-5 pb-2 pt-4 transition-all"> 
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="Search category..." 
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)} 
                            className="w-full p-3.5 pl-12 rounded-2xl border border-gray-200 shadow-lg focus:ring-4 focus:ring-slate-900/30 text-gray-800 font-medium placeholder-gray-400 outline-none transition-all" 
                        />
                        <Search className="absolute left-4 top-3.5 text-gray-400" size={22} />
                    </div>
                </div>
                
                {/* Category List */}
                <Category searchTerm={searchTerm} />

            </div>

            <Footer />
        </div>
    );
};

export default Home;