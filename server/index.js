// server/index.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import analyzeRoute from './routes/analyze.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/analyze-emotion', analyzeRoute);

app.get('/', (req, res) => {
  res.send('Server is running');
});

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
