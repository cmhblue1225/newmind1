import express from 'express';
import OpenAI from 'openai';

const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post('/', async (req, res) => {
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ error: '일기 내용이 누락되었습니다.' });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            '사용자의 일기 내용을 읽고 감정을 분석해 주세요. 결과는 happy, sad, angry, anxious, neutral 중 하나로만 응답하세요.',
        },
        { role: 'user', content }
      ]
    });

    const emotion = completion.choices[0].message.content.trim().toLowerCase();
    res.json({ emotion });
  } catch (error) {
    console.error('GPT 분석 오류:', error.message);
    res.status(500).json({ error: '감정 분석 중 오류 발생', detail: error.message });
  }
});

export default router;
