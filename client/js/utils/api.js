// API 호출을 위한 유틸리티 함수들
import { safeApiCall } from './errorHandler.js';

// Base API URL (개발환경과 프로덕션환경 구분)
const API_BASE = window.location.hostname === 'localhost' 
  ? 'http://localhost:3000/api' 
  : 'https://emotion-gpt-api.onrender.com/api';

// 공통 fetch 옵션
const getDefaultOptions = () => ({
  headers: {
    'Content-Type': 'application/json',
  },
});

// GET 요청
export const apiGet = (endpoint) => {
  return safeApiCall(
    () => fetch(`${API_BASE}${endpoint}`, {
      ...getDefaultOptions(),
      method: 'GET',
    }),
    `GET ${endpoint}`
  );
};

// POST 요청
export const apiPost = (endpoint, data) => {
  return safeApiCall(
    () => fetch(`${API_BASE}${endpoint}`, {
      ...getDefaultOptions(),
      method: 'POST',
      body: JSON.stringify(data),
    }),
    `POST ${endpoint}`
  );
};

// PUT 요청
export const apiPut = (endpoint, data) => {
  return safeApiCall(
    () => fetch(`${API_BASE}${endpoint}`, {
      ...getDefaultOptions(),
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    `PUT ${endpoint}`
  );
};

// DELETE 요청
export const apiDelete = (endpoint) => {
  return safeApiCall(
    () => fetch(`${API_BASE}${endpoint}`, {
      ...getDefaultOptions(),
      method: 'DELETE',
    }),
    `DELETE ${endpoint}`
  );
};

// 감정 분석 API
export const analyzeEmotion = (content) => {
  return apiPost('/analyze-emotion', { content });
};

// 피드백 및 음악 추천 API
export const getFeedback = (diaryContent, selectedEmotion) => {
  return apiPost('/feedback', { diaryContent, selectedEmotion });
};

// 채팅 API
export const sendChatMessage = (messages) => {
  return apiPost('/chat', { messages });
};

// 감정 요약 API
export const getEmotionSummary = (emotions) => {
  return apiPost('/emotion-summary', { emotions });
};

// Spotify 검색 API
export const searchSpotify = (artist, track) => {
  return apiGet(`/spotify/search?artist=${encodeURIComponent(artist)}&track=${encodeURIComponent(track)}`);
};

// Spotify 추천 API
export const getSpotifyRecommendations = (emotion) => {
  return apiGet(`/spotify/recommendations?emotion=${emotion}`);
};

// 알림 생성 API
export const createNotification = (data) => {
  return apiPost('/notifications/create', data);
};

// 좋아요 알림 API
export const sendLikeNotification = (diary_owner_id, liker_id, diary_id) => {
  return apiPost('/notifications/like', { diary_owner_id, liker_id, diary_id });
};

// 팔로우 알림 API
export const sendFollowNotification = (following_id, follower_id) => {
  return apiPost('/notifications/follow', { following_id, follower_id });
};

// 일기 공유 알림 API
export const sendShareNotification = (user_id, diary_id, diary_title) => {
  return apiPost('/notifications/share-diary', { user_id, diary_id, diary_title });
};