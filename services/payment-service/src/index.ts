import express, { Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? '4003';

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'payment-service' });
});

app.listen(PORT, () => {
  console.log(`Payment service listening on http://localhost:${PORT}`);
});
