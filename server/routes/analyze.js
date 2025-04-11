// server/routes/analyze.js
import express from 'express';
import OpenAI from 'openai';

const router = express.Router();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post('/', async (req, res) => {
  const { content } = req.body;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            '사용자의 일기 내용을 읽고 감정을 분석해 주세요. happy, sad, angry, anxious, neutral 중 하나로만 응답하세요.',
        },
        { role: 'user', content },
      ],
    });

    const emotion = completion.choices[0].message.content.trim().toLowerCase();
    res.json({ emotion });
  } catch (err) {
    res.status(500).json({ error: 'GPT 분석 실패', detail: err.message });
  }
});

export default router;
