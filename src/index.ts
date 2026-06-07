import express, { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 5000;

app.use(express.json());

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

app.get('/', (req: Request, res: Response) => {
  res.json({ message: "Hello! Prisma 7 with Express is finally running!" });
});

app.get('/users', async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Database ချိတ်ဆက်မှု အဆင်မပြေပါ" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 TS Server is running on http://localhost:${PORT}`);
});