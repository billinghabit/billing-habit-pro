import adminModel from "../models/adminModel.js";
import userModel from "../models/userModel.js";
import productModel from "../models/productModel.js";
import quoteModel from "../models/quoteModel.js";
import customerModel from "../models/customerModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import categoryModel from "../models/categoryModel.js";
import subCategoryModel from "../models/subCategoryModel.js";



// --- CONFIG: Cookie Settings ---
const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 10 * 365 * 24 * 60 * 60 * 1000 // 10 years
};


// // One-time use: Register Admin via Postman
// export const registerAdmin = async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         if (!email || !password) { 
//             return res.json({ success: false, message: "All fields are required" }); 
//         }

//         // Check if admin already exists
//         const existingAdmin = await adminModel.findOne({ email });
//         if (existingAdmin) {
//             return res.json({ success: false, message: "Admin already exists" });
//         }

//         // Create new admin (The pre-save hook in adminModel will hash the password)
//         const newAdmin = new adminModel({ email, password });
//         await newAdmin.save();

//         res.json({ success: true, message: "Admin Registered Successfully" });
//     } catch (error) {
//         res.json({ success: false, message: error.message });
//     }
// };

// Admin Login
export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.json({ success: false, message: "All fields are required" });
        }
        const admin = await adminModel.findOne({ email });
        if (!admin) return res.json({ success: false, message: "Invalid Admin Credentials" });

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return res.json({ success: false, message: "Invalid Admin Credentials" });

        const token = jwt.sign({ id: admin._id, role: 'admin' }, process.env.JWT_SECRET);
        res.cookie('adminToken', token, cookieOptions);
        res.json({ success: true, message: "Admin Logged In" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Get Dashboard Overview
export const getAdminDashboard = async (req, res) => {
    try {
        const userCount = await userModel.countDocuments();
        const totalProducts = await productModel.countDocuments();
        const totalQuotes = await quoteModel.countDocuments();
        
        const recentUsers = await userModel.find().sort({ createdAt: -1 }).limit(5);

        res.json({ success: true, stats: { userCount, totalProducts, totalQuotes }, recentUsers });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Get All Data for a Specific User
export const getUserFullDetails = async (req, res) => {
    try {
        const { userId } = req.params;
        
        // --- FIX: Fetch Categories and SubCategories too ---
        const categories = await categoryModel.find({ user: userId });
        const subCategories = await subCategoryModel.find({ user: userId });
        
        // Existing fetches
        const products = await productModel.find({ user: userId });
        const quotes = await quoteModel.find({ user: userId }).populate('customer');
        const customers = await customerModel.find({ user: userId });

        res.json({ 
            success: true, 
            data: { 
                categories,      
                subCategories,  
                products, 
                quotes, 
                customers 
            } 
        });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Verify if Admin is still logged in
export const getAdminProfile = async (req, res) => {
    try {
        // req.adminId is added by the adminAuth middleware
        const admin = await adminModel.findById(req.adminId).select("-password");
        if (!admin) return res.json({ success: false, message: "Admin not found" });

        res.json({ success: true, admin });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Update any Product (Admin Power)
export const adminUpdateProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        const updateData = req.body;
        await productModel.findByIdAndUpdate(productId, updateData);
        res.json({ success: true, message: "Product updated by Admin" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Admin power: Create data for a specific user
export const adminCreateCategory = async (req, res) => {
    try {
        const { userId, name, desc } = req.body;
        const newCategory = new categoryModel({ name, desc, user: userId });
        await newCategory.save();
        res.json({ success: true, message: "Category created for user" });
    } catch (error) { res.json({ success: false, message: error.message }); }
};

// Admin power: Delete any quote
export const adminDeleteQuote = async (req, res) => {
    try {
        await quoteModel.findByIdAndDelete(req.params.quoteId);
        res.json({ success: true, message: "Quote deleted by admin" });
    } catch (error) { res.json({ success: false, message: error.message }); }
};

// 2. Admin: Get Full Quote with Profit (No PIN required)
export const adminGetQuoteAnalytics = async (req, res) => {
    try {
        const { quoteId } = req.params;
        const quote = await quoteModel.findById(quoteId).populate('customer');
        
        // Admin View: Calculate profit on the fly including cost prices
        const productIds = quote.items.map(item => item.product);
        const products = await productModel.find({ _id: { $in: productIds } });
        
        const profitDetails = quote.items.map(item => {
            const originalProd = products.find(p => p._id.toString() === item.product.toString());
            const cost = originalProd ? originalProd.costPrice : 0;
            return {
                label: item.productLabel,
                profit: (item.sellingPrice - cost) * item.quantity
            };
        });

        res.json({ success: true, quote, profitDetails });
    } catch (error) { res.json({ success: false, message: error.message }); }
};

// --- 3. Admin: Add Product for User ---
export const adminCreateProduct = async (req, res) => {
    try {
        const { targetUserId, subCategoryId, label, costPrice, sellingPrice, wholesalePrice, unit } = req.body;
        
        const newProduct = new productModel({
            user: targetUserId,
            subCategory: subCategoryId,
            label,
            unit: unit || 'pcs',
            costPrice: costPrice || 0,
            sellingPrice: sellingPrice || 0,
            wholesalePrice: wholesalePrice || 0,
            type: 'number'
        });

        await newProduct.save();
        res.json({ success: true, message: "Product created by Admin", product: newProduct });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// --- 4. Admin: Delete Product ---
export const adminDeleteProduct = async (req, res) => {
    try {
        const { productId } = req.params;
        await productModel.findByIdAndDelete(productId);
        res.json({ success: true, message: "Product deleted by Admin" });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// CRUD: Manage Category (Create/Update/Delete)
export const adminManageCategory = async (req, res) => {
    const { action, id, targetUserId, name, desc } = req.body;
    try {
        if (action === 'create') {
            const newCat = new categoryModel({ name, desc, user: targetUserId });
            await newCat.save();
            // FIX: Return the new category
            return res.json({ success: true, message: "Category Created", category: newCat });

        } else if (action === 'update') {
            const updatedCat = await categoryModel.findByIdAndUpdate(id, { name, desc }, { new: true });
            // FIX: Return the updated category
            return res.json({ success: true, message: "Category Updated", category: updatedCat });

        } else if (action === 'delete') {
            await productModel.deleteMany({ categoryId: id });
            await subCategoryModel.deleteMany({ category: id });
            await categoryModel.findByIdAndDelete(id);
            return res.json({ success: true, message: "Category Deleted" });
        }
    } catch (error) { 
        res.json({ success: false, message: error.message }); 
    }
};

// CRUD: Manage SubCategory (Create/Update/Delete)
export const adminManageSubCategory = async (req, res) => {
    const { action, id, targetUserId, categoryId, name } = req.body;
    try {
        if (action === 'create') {
            const newSub = new subCategoryModel({ name, category: categoryId, user: targetUserId });
            await newSub.save();
            // FIX: Return the new subCategory
            return res.json({ success: true, message: "SubCategory Created", subCategory: newSub });

        } else if (action === 'update') {
            const updatedSub = await subCategoryModel.findByIdAndUpdate(id, { name }, { new: true });
            // FIX: Return the updated subCategory
            return res.json({ success: true, message: "SubCategory Updated", subCategory: updatedSub });

        } else if (action === 'delete') {
            await productModel.deleteMany({ subCategory: id });
            await subCategoryModel.findByIdAndDelete(id);
            return res.json({ success: true, message: "SubCategory Deleted" });
        }
    } catch (error) { 
        res.json({ success: false, message: error.message }); 
    }
};

// Analytics: Get Sales/Profit/Quotes (Classified by Status)
export const getUserAnalytics = async (req, res) => {
    try {
        const { targetUserId } = req.params;
        const now = new Date();
        
        // Fetch ALL quotes (we filter inside the loop)
        const quotes = await quoteModel.find({ user: targetUserId });
        
        // Fetch products for profit calculation
        const products = await productModel.find({ user: targetUserId });
        const productMap = new Map(products.map(p => [p._id.toString(), p.costPrice]));

        // Helper: Calculate Profit
        const calculateQuoteProfit = (quote) => {
            let cost = 0;
            quote.items.forEach(item => {
                const originalCost = productMap.get(item.product.toString()) || 0;
                cost += originalCost * item.quantity;
            });
            const sellingTotal = quote.items.reduce((sum, i) => sum + (i.sellingPrice * i.quantity), 0);
            return (sellingTotal - cost) + (quote.extraFare || 0) - (quote.discount || 0);
        };

        // Initialize Stats Structure
        const stats = {
            // REALIZED (Delivered Only)
            today: { sales: 0, profit: 0, count: 0 },
            month: { sales: 0, profit: 0, count: 0 },
            year:  { sales: 0, profit: 0, count: 0 },
            
            // PIPELINE (Status Totals)
            pending: { amount: 0, count: 0 },
            cancelled: { amount: 0, count: 0 }
        };

        quotes.forEach(q => {
            const qDate = new Date(q.createdAt);
            const isToday = qDate.toDateString() === now.toDateString();
            const isMonth = qDate.getMonth() === now.getMonth() && qDate.getFullYear() === now.getFullYear();
            const isYear = qDate.getFullYear() === now.getFullYear();

            // --- 1. HANDLE DELIVERED (Realized Revenue & Profit) ---
            if (q.status === 'Delivered') {
                const profit = calculateQuoteProfit(q);

                if (isToday) {
                    stats.today.sales += q.totalAmount;
                    stats.today.profit += profit;
                    stats.today.count += 1;
                }
                if (isMonth) {
                    stats.month.sales += q.totalAmount;
                    stats.month.profit += profit;
                    stats.month.count += 1;
                }
                if (isYear) {
                    stats.year.sales += q.totalAmount;
                    stats.year.profit += profit;
                    stats.year.count += 1;
                }
            }

            // --- 2. HANDLE PENDING (Potential Revenue) ---
            else if (q.status === 'Pending') {
                stats.pending.amount += q.totalAmount;
                stats.pending.count += 1;
            }

            // --- 3. HANDLE CANCELLED (Lost Revenue) ---
            else if (q.status === 'Cancelled') {
                stats.cancelled.amount += q.totalAmount;
                stats.cancelled.count += 1;
            }
        });

        res.json({ success: true, stats });

    } catch (error) { 
        res.json({ success: false, message: error.message }); 
    }
};