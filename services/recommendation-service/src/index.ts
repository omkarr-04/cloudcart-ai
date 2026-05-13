import express, { Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? '4005';

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'recommendation-service' });
});

app.listen(PORT, () => {
  console.log(`Recommendation service listening on http://localhost:${PORT}`);
});
