import userModel from "../models/userModel.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { inventoryTemplates } from "../utils/inventoryTemplates.js";
import categoryModel from "../models/categoryModel.js";
import subCategoryModel from "../models/subCategoryModel.js";
import productModel from "../models/productModel.js";

// --- CONFIG: Cookie Settings ---
const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 10 * 365 * 24 * 60 * 60 * 1000 // 10 years
};

// --- 1. GOOGLE LOGIN ---
export const googleLogin = async (req, res) => {
    try {
        const { email, name, photo } = req.body;
        let user = await userModel.findOne({ email });

        if (!user) {
            // --- NEW CUSTOMER LOGIC: 3 Months Free ---
            
            // FIX: Parse env variable to INT to prevent string concatenation bug
            // Default to 90 if env is missing
            const trialDays = parseInt(process.env.TRIAL_DAYS) || 90; 

            const threeMonthsFromNow = new Date();
            threeMonthsFromNow.setDate(threeMonthsFromNow.getDate() + trialDays);

            user = new userModel({ 
                email, 
                name, 
                photo,
                isPremium: true,       
                planType: 'trial',     
                expiryDate: threeMonthsFromNow
            });
            await user.save();
        } 

        const isProfileIncomplete = (!user.number || !user.shopName || !user.address || !user.pin);

        // --- CHECK EXPIRY ON LOGIN ---
        if (user.isPremium && user.expiryDate && new Date() > new Date(user.expiryDate)) {
            user.isPremium = false;
            user.planType = 'free'; 
            await user.save();
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '3650d' });

        res.cookie('token', token, cookieOptions);
        
        res.status(200).json({
            success: true,
            message: 'Login successful.',
            user,
            requiresPhone: isProfileIncomplete
        });

    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// --- 2. UPDATE USER DETAILS & SEED DATA ---
export const updateUserDetails = async (req, res) => {
    const { name, email, shopName, number, address, pin, businessType, userId: bodyUserId } = req.body;
    
    // Support both Auth Middleware (req.userId) and Direct ID (req.body.userId)
    const userId = req.userId || bodyUserId; 

    if (!userId) {
        return res.status(400).json({ success: false, message: "User ID is required" });
    }

    try {
        const user = await userModel.findById(userId);
        if (!user) return res.status(404).json({ success: false, message: "User not found." });

        // Update Fields
        if (name) user.name = name;
        if (email) user.email = email;
        if (shopName) user.shopName = shopName;
        if (number) user.number = number;
        if (address) user.address = address;
        
        if (pin) {
            if (pin.length !== 4) return res.status(400).json({ success: false, message: "PIN must be 4 digits." });
            user.pin = pin; 
        }

        await user.save();

        // --- SEEDING LOGIC ---
    // Ensure businessType is always an array, even if frontend sends a single string
    let typesToSeed = [];
    if (Array.isArray(businessType)) {
        typesToSeed = businessType;
    } else if (businessType) {
        typesToSeed = [businessType];
    }

    if (typesToSeed.length > 0) {
        console.log(`Seeding data for: ${typesToSeed.join(', ')}`);

        // Loop through EACH selected business type
        for (const type of typesToSeed) {
            const template = inventoryTemplates[type];
            if (!template) continue; // Skip if invalid type

            for (const catData of template) {
                // 1. Create Category
                const newCat = await categoryModel.create({
                    user: user._id,
                    name: catData.category,
                    desc: "Auto-generated"
                });

                for (const subData of catData.subCategories) {
                    // 2. Create SubCategory
                    const newSub = await subCategoryModel.create({
                        user: user._id,
                        category: newCat._id, 
                        name: subData.name
                    });

                    // 3. Prepare Products
                    const productsToInsert = subData.products.map(p => ({
                        user: user._id,
                        subCategory: newSub._id,
                        label: p.label,
                        unit: p.unit,
                        sellingPrice: p.sellingPrice,
                        costPrice: p.costPrice,
                        wholesalePrice: p.wholesalePrice,
                        type: 'number'
                    }));

                    // 4. Bulk Insert
                    if (productsToInsert.length > 0) {
                        await productModel.insertMany(productsToInsert);
                    }
                }
            }
        }
    }

    res.status(200).json({ success: true, message: "Setup Complete!", user });

    } catch (error) {
        console.error("Update Error Details:", error);
        res.status(500).json({ success: false, message: `Server error: ${error.message}` });
    }
};

// --- 3. GET USER PROFILE ---
export const getUserProfile = async (req, res) => {
    try {
        const user = await userModel.findById(req.userId);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });
        res.status(200).json({ success: true, user });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching profile" });
    }
};

// --- 4. VERIFY PIN ---
export const verifyPin = async (req, res) => {
    const { pin } = req.body;
    const userId = req.userId; 

    try {
        const user = await userModel.findById(userId);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        // If user has NO PIN set, fail securely
        if (!user.pin) return res.status(400).json({ success: false, message: "PIN not set" });

        const isMatch = await bcrypt.compare(pin, user.pin);
        if (isMatch) {
            res.status(200).json({ success: true, message: "Verified" });
        } else {
            res.status(401).json({ success: false, message: "Wrong PIN" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};

// --- 5. LOGOUT ---
export const logoutUser = async (req, res) => {
    try {
        res.clearCookie('token', cookieOptions);
        res.status(200).json({ success: true, message: "Logged out." });
    } catch (error) {
        res.status(500).json({ success: false, message: "Logout failed." });
    }
};