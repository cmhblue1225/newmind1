import express from 'express';
import OpenAI from 'openai';

const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// 테스트 엔드포인트
router.get('/test', (req, res) => {
  res.json({ 
    message: 'Emotion Summary API is working',
    hasOpenAIKey: !!process.env.OPENAI_API_KEY 
  });
});

router.post('/', async (req, res) => {
  console.log('POST /api/emotion-summary called');
  
  try {
    const { emotions } = req.body;
    console.log('Received emotion data:', emotions);

    // 기본 검증
    if (!emotions || !Array.isArray(emotions)) {
      return res.status(400).json({ error: '감정 데이터가 필요합니다.' });
    }

    if (emotions.length === 0) {
      return res.status(400).json({ error: '분석할 감정 데이터가 없습니다.' });
    }

    // 유효한 감정 데이터만 필터링
    const validEmotions = emotions.filter(e => 
      e.date && 
      e.score !== null && 
      e.score !== undefined && 
      !isNaN(e.score)
    );

    if (validEmotions.length === 0) {
      return res.status(400).json({ error: '유효한 감정 데이터가 없습니다.' });
    }

    const summaryText = validEmotions.map(e => `${e.date}: 감정 점수 ${e.score}`).join('\n');

    const prompt = `
다음은 사용자의 최근 감정 흐름입니다:

${summaryText}

감정 점수는 -2(매우 부정적)부터 +2(매우 긍정적) 범위입니다.
감정 상담사로서 사용자에게 위로와 용기, 희망을 주는 따뜻한 메시지를 2-3문장으로 작성해주세요.
- 긍정적인 흐름이면 격려해주세요
- 부정적인 흐름이면 위로하고 조언해주세요  
- 기복이 심하다면 감정의 변화가 자연스럽다고 안심시켜주세요
`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: '당신은 전문적이고 따뜻한 감정 심리 상담사입니다.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 200
    });

    const reply = completion.choices[0].message.content.trim();
    console.log('GPT summary generated:', reply);
    res.json({ summary: reply });
    
  } catch (err) {
    console.error('GPT 피드백 오류:', err);
    res.status(500).json({ 
      error: 'GPT 분석 중 오류가 발생했습니다.', 
      detail: process.env.NODE_ENV === 'development' ? err.message : undefined 
    });
  }
});

export default router;
