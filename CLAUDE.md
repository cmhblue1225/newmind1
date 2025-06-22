# 감정 일기 및 AI 상담 서비스 - 프로젝트 현황

## 📋 프로젝트 개요
**한 숨의 위로: 감정 일기** - 사용자가 일기를 작성하고 OpenAI ChatGPT API를 통해 감정 분석 및 상담을 제공하는 웹 서비스

## 🏗️ 아키텍처
- **프론트엔드**: Vanilla JavaScript + HTML/CSS (Netlify 배포)
- **백엔드**: Node.js/Express (Render 배포)
- **데이터베이스**: Supabase (PostgreSQL)
- **AI**: OpenAI GPT-3.5-turbo, GPT-4o
- **음악**: Spotify Web API 통합

## 🔗 배포 정보
- **프론트엔드**: https://beamish-dragon-f15ff7.netlify.app
- **백엔드**: https://emotion-gpt-api.onrender.com
- **GitHub**: https://github.com/cmhblue1225/newmind1.git
- **데이터베이스**: Supabase (vzmvgyxsscfyflgxcpnq.supabase.co)

## 🗄️ 데이터베이스 스키마
### 주요 테이블:
1. **diaries**: 개인 일기 저장 (id, user_id, content, emotion, created_at)
2. **shared_diaries**: 공유된 일기 (id, user_id, diary_id, content, emotion, feedback, music, likes, created_at)
3. **chat_history**: 채팅 기록 (id, user_id, diary_id, role, content, created_at)
4. **notifications**: 알림 (id, user_id, from_user_id, diary_id, message, read, created_at)
5. **subscriptions**: 팔로우 관계 (id, follower_id, following_id, created_at)

## 🔑 환경변수 (Render 설정)
```bash
BASE_URL=https://emotion-gpt-api.onrender.com
NODE_ENV=production
OPENAI_API_KEY=[OpenAI API Key 설정됨]
SPOTIFY_CLIENT_ID=[Spotify Client ID 설정됨]
SPOTIFY_CLIENT_SECRET=[Spotify Client Secret 설정됨]
SUPABASE_SERVICE_KEY=[Supabase Service Role Key 설정됨]
SUPABASE_URL=https://vzmvgyxsscfyflgxcpnq.supabase.co
```

**참고**: 실제 API 키들은 Render Dashboard의 Environment Variables에 안전하게 저장되어 있습니다.

## ✅ 완성된 주요 기능

### 🎵 음악 추천 시스템 (완전 개선됨)
- **Spotify API 통합**: 실제 음악 검색 및 스트리밍 링크 제공
- **감정별 장르 매핑**: 5가지 감정(happy, sad, angry, anxious, neutral)에 맞는 장르 자동 선택
- **듀얼 링크**: YouTube + Spotify 링크 동시 제공
- **GPT-4o 활용**: 더 정확하고 다양한 음악 추천 및 상세한 피드백

### 📊 통계 및 분석 시스템 (완성)
- **감정 차트**: 파이차트, 라인차트, 바차트로 다각도 분석
- **GPT 주간 분석**: AI 기반 개인 맞춤 감정 상담 및 조언
- **시간 패턴 분석**: 날짜별, 요일별, 시간대별 감정 변화 추적

### 🔔 알림 시스템 (신규 구현)
- **API 엔드포인트**: `/api/notifications/*` (create, like, follow, share-diary)
- **실시간 알림**: 좋아요, 팔로우, 일기 공유 시 자동 알림 생성
- **읽음 처리**: 알림 확인 시 자동으로 읽음 상태 변경

### 🌐 커뮤니티 기능 (완성)
- **일기 공유**: shared_diaries 테이블을 통한 공개 일기 관리
- **팔로우 시스템**: subscriptions 테이블 기반 사용자 간 구독
- **좋아요 기능**: 실시간 좋아요 수 업데이트
- **검색 및 필터**: 감정별, 키워드별 일기 검색

### 🛡️ 시스템 품질 개선
- **미들웨어 시스템**: 인증, 검증, 에러 핸들링
- **통합 에러 처리**: 클라이언트/서버 체계적 오류 관리
- **API 유틸리티**: 재사용 가능한 fetch 함수들
- **환경 분리**: 개발/프로덕션 환경 완전 분리

## 🚀 API 엔드포인트

### 인증 및 사용자
- Supabase Auth 사용 (클라이언트 사이드)

### 감정 분석 및 피드백
- `POST /api/analyze-emotion` - 일기 내용 감정 분석
- `POST /api/feedback` - 개인화된 피드백 및 음악 추천
- `POST /api/emotion-summary` - 주간 감정 패턴 분석

### 채팅
- `POST /api/chat` - AI와의 일반 대화

### 음악 (Spotify)
- `GET /api/spotify/search` - 특정 곡 검색
- `GET /api/spotify/recommendations` - 감정 기반 음악 추천

### 알림
- `POST /api/notifications/create` - 일반 알림 생성
- `POST /api/notifications/like` - 좋아요 알림
- `POST /api/notifications/follow` - 팔로우 알림
- `POST /api/notifications/share-diary` - 일기 공유 알림

### 기타
- `POST /api/delete-user` - 사용자 계정 삭제

## 📁 프로젝트 구조
```
newEmotionProject/
├── client/                 # 프론트엔드 (Netlify)
│   ├── js/
│   │   ├── utils/          # API 및 에러 핸들링 유틸리티
│   │   ├── components/     # 재사용 컴포넌트 (nav.js)
│   │   └── *.js           # 페이지별 JavaScript
│   ├── *.html             # 페이지 파일들
│   └── style.css          # 스타일시트
└── server/                # 백엔드 (Render)
    ├── middleware/        # 인증, 검증, 에러 핸들링
    ├── routes/           # API 라우트들
    ├── package.json      # 의존성 관리
    └── index.js         # 서버 엔트리포인트
```

## 🔧 주요 완료 작업 (2024-06-22~23)

### 1단계: 즉시 수정
- ✅ 외부 API URL을 로컬 API로 통일
- ✅ 환경변수 참조 오류 수정 (SUPABASE_SERVICE_KEY)

### 2단계: 음악 추천 시스템 대폭 개선
- ✅ Spotify Web API 완전 통합
- ✅ 감정별 장르 매핑 시스템 구축
- ✅ GPT 프롬프트 고도화 (더 다양하고 정확한 추천)
- ✅ 프론트엔드 UI 개선 (장르 정보 표시, 듀얼 링크)

### 3단계: 기능 완성도 검증
- ✅ 커뮤니티 기능: 이미 완전 구현 확인
- ✅ 일기 상세보기: 실제 DB 연동 확인
- ✅ 통계 페이지: 완전 구현 확인

### 4단계: 알림 시스템 구현
- ✅ 백엔드 알림 API 구축
- ✅ 프론트엔드 알림 표시 기능 활용
- ✅ 다양한 알림 타입 지원 (좋아요, 팔로우, 공유)

### 5단계: 코드 품질 대폭 개선
- ✅ 미들웨어 시스템 구축 (auth, validation, errorHandler)
- ✅ 통합 에러 핸들링 (서버/클라이언트)
- ✅ API 유틸리티 함수 라이브러리
- ✅ 환경변수 템플릿 및 설정 가이드

### 6단계: UI/UX 최적화
- ✅ GPT 응답 길이 최적화 (120 토큰 제한)
- ✅ 텍스트 표시 영역 스크롤 처리
- ✅ 디버깅 요소 정리
- ✅ 일관된 스타일링 적용

## 🐛 해결된 주요 이슈
1. **404 오류**: API 라우트 등록 문제 → 미들웨어 import 오류 해결
2. **Response stream error**: 중복 응답 읽기 → 단일 읽기로 수정
3. **CORS 문제**: 상대경로 API 호출 → 절대 URL로 변경
4. **긴 텍스트 UI 깨짐**: 고정 높이 + 스크롤 처리
5. **환경변수 불일치**: 서버/클라이언트 변수명 통일

## 🎯 현재 상태
- **완전히 작동하는 프로덕션 서비스**
- **모든 핵심 기능 구현 완료**
- **안정적인 에러 핸들링**
- **최적화된 사용자 경험**

## 📝 다음 세션에서 가능한 개선사항
1. **성능 최적화**: 이미지 최적화, 캐싱 전략
2. **보안 강화**: API 레이트 리미팅, 입력 검증 강화
3. **새로운 기능**: 일기 태그 시스템, 친구 추천 알고리즘
4. **모바일 앱**: React Native 또는 Flutter 모바일 앱 개발
5. **데이터 분석**: 사용자 행동 분석, A/B 테스트

---

**💡 Claude Code 재시작 시:**
1. 이 디렉토리로 이동: `cd /Users/minhyuk/Desktop/dev/newproject/newEmotionProject`
2. Git 상태 확인: `git status && git log --oneline -5`
3. 서버 테스트: `https://emotion-gpt-api.onrender.com/` 접속 확인
4. 프론트엔드 테스트: `https://beamish-dragon-f15ff7.netlify.app` 접속 확인

**마지막 업데이트**: 2024-06-23 02:40 KST
**커밋 상태**: 모든 변경사항 저장 완료 (b82b875)