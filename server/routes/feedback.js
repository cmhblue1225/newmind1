import express from 'express';
import { Configuration, OpenAIApi } from 'openai';

const router = express.Router();

// OpenAI 설정
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// 피드백 요청 API
router.post('/', async (req, res) => {
  const { diaryContent, selectedEmotion } = req.body;

  try {
    const prompt = `
다음 일기 내용과 감정에 맞게 감성 피드백을 작성해주고, 추천 음악 제목, 가수, 추천 이유, 유튜브 링크를 제공해줘.
항상 아래 형식으로 답변해:

---
✨ 감성 피드백: (간결한 피드백)

🎵 추천곡 제목: (음악 제목)
🎤 가수: (가수 이름)
📝 추천 이유: (추천 이유)
▶️ 유튜브 링크: (유튜브 링크)
---

일기 내용: ${diaryContent}
감정: ${selectedEmotion}
    `;

    const completion = await openai.createChatCompletion({
      model: "gpt-4o", // 또는 gpt-4, gpt-3.5-turbo
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 500,
    });

    const feedbackText = completion.data.choices[0].message.content;

    res.json({ feedback: feedbackText });
  } catch (error) {
    console.error('GPT feedback error:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: '피드백 생성 실패' });
  }
});

export default router;