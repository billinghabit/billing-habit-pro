import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import adminAxios from './api/adminAxios';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import UserDetails from './pages/UserDetails';
import { Loader2 } from 'lucide-react';

const App = () => {
    const [isAuth, setIsAuth] = useState(null);

    useEffect(() => {
        const verify = async () => {
            try {
                const res = await adminAxios.get('/verify');
                setIsAuth(res.data.success);
            } catch { setIsAuth(false); }
        };
        verify();
    }, []);

    if (isAuth === null) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin"/></div>;

    const Protected = ({ children }) => isAuth ? children : <Navigate to="/" replace />;

    return (
        <>
            <Toaster position="top-center" />
            <Routes>
                <Route path="/" element={isAuth ? <Navigate to="/dashboard" replace /> : <AdminLogin setAuth={setIsAuth} />} />
                <Route path="/dashboard" element={<Protected><AdminDashboard setAuth={setIsAuth} /> </Protected>} />
                <Route path="/user/:userId" element={<Protected><UserDetails /></Protected>} />
            </Routes>
        </>
    );
};

export default App;