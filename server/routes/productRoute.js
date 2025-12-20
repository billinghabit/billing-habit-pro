import express from 'express';
import userAuth from '../middlewares/userAuth.js';
import { createProduct, deleteProduct, getFilterData, getMyProducts, getProductsForList, getProductsForSubCategory, getProfitDetailsForList, updateProduct } from '../controllers/productController.js';
import premiumAuth from '../middlewares/premiumAuth.js';

const productRouter = express.Router();

// All routes are protected
productRouter.use(userAuth);

// POST /api/product/create
productRouter.post('/create', premiumAuth, createProduct);

// GET /api/product/get-for-subcategory/:subCategoryId
productRouter.post('/get-for-subcategory/:subCategoryId', premiumAuth, getProductsForSubCategory);

//for view-quote
// POST /api/product/get-details-for-list
productRouter.post('/get-details-for-list', premiumAuth, getProductsForList); 

// virsion 2
// --- 2. ADD THE NEW PROFIT ROUTE ---
// POST /api/product/get-profit-details
productRouter.post('/get-profit-details', premiumAuth, getProfitDetailsForList);


// GET /api/product/my-products
productRouter.get('/my-products', getMyProducts);
productRouter.get('/filter-data', userAuth, getFilterData);

// PUT /api/product/update/:productId
productRouter.put('/update/:productId', updateProduct);

// DELETE /api/product/delete/:productId
productRouter.delete('/delete/:productId', deleteProduct);

export default productRouter;

