import OpenAI from 'openai';
import express from 'express';
import axios from 'axios';
import { validateDiaryContent } from '../middleware/validation.js';

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

router.post('/', validateDiaryContent, async (req, res) => {
  const { diaryContent, selectedEmotion } = req.body;

  try {
    const emotionMusicGenres = {
      happy: ['팝', 'K-팝', '댄스', '펑크', '라틴', '디스코'],
      sad: ['발라드', '인디', '어쿠스틱', '블루스', 'R&B', '포크'],
      angry: ['록', '메탈', '랩', '힙합', '펑크 록', '얼터너티브'],
      anxious: ['앰비언트', '클래식', '재즈', '로파이', '인스트루멘탈', '뉴에이지'],
      neutral: ['팝', '인디 팝', '소울', '재즈', '보사노바', '칠아웃']
    };

    const genres = emotionMusicGenres[selectedEmotion] || emotionMusicGenres.neutral;
    const randomGenres = genres.sort(() => 0.5 - Math.random()).slice(0, 2).join(', ');

    const prompt = `
일기 내용: ${diaryContent}
감정: ${selectedEmotion}

위의 일기와 감정에 기반하여 다음을 제공해주세요:

1. 공감적이고 따뜻한 감성 피드백 (2-3문장)
2. 현재 감정에 맞는 음악 추천 (${randomGenres} 장르 위주로)
3. 다양한 시대의 곡 중에서 선택 (2010년 이후부터 최신곡까지)
4. 한국 가수, 해외 가수 모두 고려
5. 실제 존재하는 곡으로만 추천

응답 형식:
---
✨ 감성 피드백: (공감적인 피드백)

🎵 추천곡 제목: (실제 곡 제목)
🎤 가수: (실제 가수명)
📝 추천 이유: (감정과 곡의 연관성 설명)
🎼 장르: (음악 장르)
▶️ 유튜브 링크: https://www.youtube.com/results?search_query=(가수명)+(곡제목)
---
    `;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
      max_tokens: 500,
    });

    const feedbackText = completion.choices[0].message.content;

    // Spotify 정보 추가 시도
    try {
      const songMatch = feedbackText.match(/🎵 추천곡 제목:\s*(.*)/);
      const artistMatch = feedbackText.match(/🎤 가수:\s*(.*)/);
      
      if (songMatch && artistMatch) {
        const song = songMatch[1].trim();
        const artist = artistMatch[1].trim();
        
        const spotifyResponse = await axios.get(`${process.env.BASE_URL || 'http://localhost:3000'}/api/spotify/search`, {
          params: { artist, track: song }
        });
        
        if (spotifyResponse.data.spotify_url) {
          const enhancedFeedback = feedbackText.replace(
            /▶️ 유튜브 링크: (.*)/,
            `▶️ 유튜브 링크: $1\n🎵 Spotify 링크: ${spotifyResponse.data.spotify_url}`
          );
          return res.json({ 
            feedback: enhancedFeedback,
            spotify_data: spotifyResponse.data
          });
        }
      }
    } catch (spotifyError) {
      console.log('Spotify 연동 실패, 기본 응답 반환:', spotifyError.message);
    }

    res.json({ feedback: feedbackText });
  } catch (error) {
    console.error('GPT feedback error:', error);
    res.status(500).json({ error: '피드백 생성 실패' });
  }
});

export default router;