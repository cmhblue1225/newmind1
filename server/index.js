import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import analyzeRouter from './routes/analyze.js';
import feedbackRouter from './routes/feedback.js';
import chatRouter from './routes/chat.js';
app.use('/api/chat', chatRouter);

app.use('/api/feedback', feedbackRouter);

// import musicRouter from './routes/music.js'; // 향후 추가 가능
// import chatRouter from './routes/chat.js';   // 향후 추가 가능

dotenv.config(); // .env 파일 로딩

const app = express();
const PORT = process.env.PORT || 3000;

// 미들웨어
app.use(cors());
app.use(express.json());

// 기본 라우트
app.get('/', (req, res) => {
  res.send('🎉 newEmotionProject 백엔드 서버가 정상 작동 중입니다!');
});

// GPT 감정 분석 라우트
app.use('/api/analyze-emotion', analyzeRouter);

// 향후 추가할 라우트 예시
// app.use('/api/music', musicRouter);
// app.use('/api/chat', chatRouter);

// 서버 시작
app.listen(PORT, () => {
  console.log(`✅ 서버가 포트 ${PORT}에서 실행 중입니다.`);
});
