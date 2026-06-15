import express, { NextFunction, Request, Response } from 'express';
import userRoutes from './routes/userRoute';
import authRoutes from './routes/authRoute';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler';

dotenv.config();

const app = express();
const PORT = 5000;

app.use(express.json());
app.use(morgan("dev"));
const responseHandler = (req: Request, res: Response, next: NextFunction) => {
    res.success = function (data, message = "Success", statusCode = 200) {
        return res.status(statusCode).json({
            success: true,
            message: message,
            data: data
        });
    };
    
    next();
};
app.use(responseHandler);
app.get('/', (req: Request, res: Response) => {
  res.json({ message: "Express server is running!" });
});

app.use("/api/auth", authRoutes );
app.use("/api/users", userRoutes );

app.get('/api/test', (req, res) => {
    console.log(req.headers); // 👈 Terminal တွင် Object အကြီးကြီး ထွက်လာမည်
    res.send("စစ်ဆေးပြီးပါပြီ");
});



app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Global error handler (must be after all routes)
app.use(errorHandler);


