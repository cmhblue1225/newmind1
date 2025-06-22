// 통합 에러 핸들링 유틸리티

export const showError = (message, duration = 3000) => {
  // 기존 에러 메시지 제거
  const existingError = document.querySelector('.error-toast');
  if (existingError) {
    existingError.remove();
  }

  // 에러 토스트 생성
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error-toast';
  errorDiv.textContent = message;
  errorDiv.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #ff6b6b;
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 10000;
    font-family: 'Gowun Dodum', sans-serif;
    max-width: 300px;
    animation: slideIn 0.3s ease-out;
  `;

  // 애니메이션 스타일 추가
  if (!document.querySelector('#error-styles')) {
    const style = document.createElement('style');
    style.id = 'error-styles';
    style.textContent = `
      @keyframes slideIn {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }
      @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }

  document.body.appendChild(errorDiv);

  // 자동 제거
  setTimeout(() => {
    errorDiv.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => errorDiv.remove(), 300);
  }, duration);
};

export const showSuccess = (message, duration = 3000) => {
  // 기존 성공 메시지 제거
  const existingSuccess = document.querySelector('.success-toast');
  if (existingSuccess) {
    existingSuccess.remove();
  }

  // 성공 토스트 생성
  const successDiv = document.createElement('div');
  successDiv.className = 'success-toast';
  successDiv.textContent = message;
  successDiv.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: #51cf66;
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    z-index: 10000;
    font-family: 'Gowun Dodum', sans-serif;
    max-width: 300px;
    animation: slideIn 0.3s ease-out;
  `;

  document.body.appendChild(successDiv);

  // 자동 제거
  setTimeout(() => {
    successDiv.style.animation = 'slideOut 0.3s ease-out';
    setTimeout(() => successDiv.remove(), 300);
  }, duration);
};

export const handleApiError = (error, context = '') => {
  console.error(`API 오류 (${context}):`, error);
  
  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    showError('네트워크 연결을 확인해주세요.');
    return;
  }
  
  if (error.status === 401) {
    showError('로그인이 필요합니다.');
    setTimeout(() => {
      window.location.href = '/login.html';
    }, 1500);
    return;
  }
  
  if (error.status === 403) {
    showError('권한이 없습니다.');
    return;
  }
  
  if (error.status === 429) {
    showError('요청이 너무 많습니다. 잠시 후 다시 시도해주세요.');
    return;
  }
  
  if (error.status >= 500) {
    showError('서버에 일시적인 문제가 발생했습니다. 잠시 후 다시 시도해주세요.');
    return;
  }
  
  // 기본 에러 메시지
  const message = error.message || '알 수 없는 오류가 발생했습니다.';
  showError(message);
};

export const safeApiCall = async (apiCall, context = '') => {
  try {
    const response = await apiCall();
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: '서버 오류' }));
      const error = new Error(errorData.error || `HTTP ${response.status}`);
      error.status = response.status;
      throw error;
    }
    
    return await response.json();
  } catch (error) {
    handleApiError(error, context);
    throw error;
  }
};

export const withLoadingState = (element, asyncFn) => {
  return async (...args) => {
    const originalText = element.textContent;
    const originalDisabled = element.disabled;
    
    element.textContent = '처리 중...';
    element.disabled = true;
    
    try {
      return await asyncFn(...args);
    } finally {
      element.textContent = originalText;
      element.disabled = originalDisabled;
    }
  };
};