export const errorHandler = (err, req, res, next) => {
  console.error('오류 발생:', err);

  // OpenAI API 에러
  if (err.type === 'openai_error') {
    return res.status(503).json({ 
      error: 'AI 서비스에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.' 
    });
  }

  // Supabase 에러
  if (err.type === 'supabase_error') {
    return res.status(500).json({ 
      error: '데이터베이스 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' 
    });
  }

  // 네트워크 에러
  if (err.code === 'NETWORK_ERROR') {
    return res.status(503).json({ 
      error: '네트워크 연결에 문제가 있습니다. 잠시 후 다시 시도해주세요.' 
    });
  }

  // 기본 서버 에러
  res.status(500).json({ 
    error: '서버에 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
    ...(process.env.NODE_ENV === 'development' && { details: err.message })
  });
};

export const notFoundHandler = (req, res) => {
  res.status(404).json({ 
    error: '요청하신 API 엔드포인트를 찾을 수 없습니다.',
    path: req.path 
  });
};