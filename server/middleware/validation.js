export const validateDiaryContent = (req, res, next) => {
  const { diaryContent, selectedEmotion } = req.body;
  
  if (!diaryContent || typeof diaryContent !== 'string' || diaryContent.trim().length === 0) {
    return res.status(400).json({ error: '일기 내용이 필요합니다.' });
  }
  
  if (diaryContent.length > 5000) {
    return res.status(400).json({ error: '일기 내용이 너무 깁니다. (최대 5000자)' });
  }
  
  const validEmotions = ['happy', 'sad', 'angry', 'anxious', 'neutral'];
  if (!selectedEmotion || !validEmotions.includes(selectedEmotion)) {
    return res.status(400).json({ error: '올바른 감정을 선택해주세요.' });
  }
  
  next();
};

export const validateChatMessage = (req, res, next) => {
  const { message } = req.body;
  
  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return res.status(400).json({ error: '메시지가 필요합니다.' });
  }
  
  if (message.length > 1000) {
    return res.status(400).json({ error: '메시지가 너무 깁니다. (최대 1000자)' });
  }
  
  next();
};

export const validateEmotionData = (req, res, next) => {
  const { emotions } = req.body;
  
  if (!emotions || !Array.isArray(emotions)) {
    return res.status(400).json({ error: '감정 데이터가 필요합니다.' });
  }
  
  if (emotions.length === 0) {
    return res.status(400).json({ error: '분석할 감정 데이터가 없습니다.' });
  }
  
  next();
};