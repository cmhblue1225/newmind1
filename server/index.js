import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

dotenv.config();
import analyzeRouter from './routes/analyze.js';
import feedbackRouter from './routes/feedback.js';
import chatRouter from './routes/chat.js';
import emotionSummaryRouter from './routes/emotionSummary.js';
import deleteUserRouter from './routes/deleteUser.js';
import spotifyRouter from './routes/spotify.js';
import notificationsRouter from './routes/notifications.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// 기본 테스트 라우트
app.get('/', (req, res) => {
  res.send('🎉 newEmotionProject 백엔드 서버 작동 중입니다!');
});

// 라우트 등록
app.use('/api/analyze-emotion', analyzeRouter);
app.use('/api/feedback', feedbackRouter);
app.use('/api/chat', chatRouter);
app.use('/api/emotion-summary', emotionSummaryRouter);
app.use('/api/delete-user', deleteUserRouter);
app.use('/api/spotify', spotifyRouter);
app.use('/api/notifications', notificationsRouter);

// 404 핸들러
app.use(notFoundHandler);

// 에러 핸들러
app.use(errorHandler);

// 서버 실행
app.listen(PORT, () => {
  console.log(`✅ 서버가 포트 ${PORT}에서 실행 중입니다.`);
  console.log(`📍 환경: ${process.env.NODE_ENV || 'development'}`);
});