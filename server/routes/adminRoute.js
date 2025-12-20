import express from "express";
import { adminLogin, getAdminDashboard, getUserFullDetails, adminUpdateProduct, getAdminProfile, adminManageCategory, adminGetQuoteAnalytics, adminCreateProduct, adminDeleteProduct, getUserAnalytics, adminManageSubCategory } from "../controllers/adminController.js";
import adminAuth from "../middlewares/adminAuth.js"; 

const adminRouter = express.Router();

adminRouter.post("/login", adminLogin);
adminRouter.get("/dashboard", adminAuth, getAdminDashboard);
adminRouter.get("/user-details/:userId", adminAuth, getUserFullDetails);
adminRouter.put("/update-product/:productId", adminAuth, adminUpdateProduct);
adminRouter.get("/verify", adminAuth, getAdminProfile);

//temporary
// adminRouter.post("/register", registerAdmin); // Use this once, then delete or comment out

adminRouter.get("/quote-analytics/:quoteId", adminAuth, adminGetQuoteAnalytics);

adminRouter.post("/create-product", adminAuth, adminCreateProduct);
adminRouter.delete("/delete-product/:productId", adminAuth, adminDeleteProduct);

adminRouter.get("/user-analytics/:targetUserId", adminAuth, getUserAnalytics);
adminRouter.post("/manage-category-crud", adminAuth, adminManageCategory);
adminRouter.post("/manage-subcategory-crud", adminAuth, adminManageSubCategory);


export default adminRouter;