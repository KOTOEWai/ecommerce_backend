import express, { Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// အခြေခံ Route (TypeScript မှာ Type တွေ သတ်မှတ်ပေးထားတာ သတိပြုပါ)
app.get('/', (req: Request, res: Response) => {
  res.json({ message: "Welcome to E-commerce TypeScript Backend API!" });
});

app.listen(PORT, () => {
  console.log(`🚀 TS Server is running on http://localhost:${PORT}`);
});