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

// 디버깅용 라우트 목록
app.get('/debug/routes', (req, res) => {
  const routes = [];
  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      routes.push({
        path: middleware.route.path,
        methods: Object.keys(middleware.route.methods)
      });
    } else if (middleware.name === 'router') {
      middleware.handle.stack.forEach((handler) => {
        if (handler.route) {
          routes.push({
            path: handler.route.path,
            methods: Object.keys(handler.route.methods)
          });
        }
      });
    }
  });
  res.json({ routes, timestamp: new Date().toISOString() });
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