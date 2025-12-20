import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import connectDB from './configs/mongoDB.js';
import userRouter from './routes/userRoute.js';
import categoryRouter from './routes/categoryRoute.js';
import subCategoryRouter from './routes/subCategoryRoute.js';
import productRouter from './routes/productRoute.js';
import customerRouter from './routes/customerRoute.js';
import quoteRouter from './routes/quoteRoute.js';
import paymentRouter from './routes/paymentRoute.js';
import adminRouter from './routes/adminRoute.js';


const app = express();

const PORT = process.env.PORT || 8080;
await connectDB();

const allowedOrigins = [process.env.FRONTEND_URL, process.env.ADMIN_URL, 'http://localhost:5173', 'http://localhost:5174'];
app.use(cors({ origin: allowedOrigins, credentials: true }));

app.use(express.json());
app.use(cookieParser());
app.use(cors({origin: allowedOrigins, credentials: true}));

app.get ('/', (req, res) => {
    res.send('Billing Habit Server is Running...');
})

//API Routes
app.use('/api/user', userRouter)
app.use('/api/category', categoryRouter);
app.use('/api/subcategory', subCategoryRouter); 
app.use('/api/product', productRouter);  
app.use('/api/customer',  customerRouter); 
app.use('/api/quote', quoteRouter);  
app.use('/api/payment', paymentRouter);
app.use('/api/admin', adminRouter);





app.listen(PORT, () => {
    console.log(`Your server is running on http://localhost:${PORT}`);
})
export default app;


