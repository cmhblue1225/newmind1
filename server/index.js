import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// 기본 테스트 라우트
app.get('/', (req, res) => {
  res.send('🎉 newEmotionProject 백엔드 서버 작동 중입니다!');
});

// 라우트 등록
import analyzeRouter from './routes/analyze.js';
import feedbackRouter from './routes/feedback.js';
import chatRouter from './routes/chat.js';
import emotionSummaryRouter from './routes/emotionSummary.js';

app.use('/api/analyze-emotion', analyzeRouter);
app.use('/api/feedback', feedbackRouter);
app.use('/api/chat', chatRouter);
app.use('/api/emotion-summary', emotionSummaryRouter);

// 서버 실행
app.listen(PORT, () => {
  console.log(`✅ 서버가 포트 ${PORT}에서 실행 중입니다.`);
});
