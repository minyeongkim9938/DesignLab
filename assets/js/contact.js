// 문의하기 폼 처리

document.addEventListener('DOMContentLoaded', function() {
    // Netlify가 폼을 자동으로 처리하므로 JavaScript는 폼 제출을 방해하지 않음
    // 오직 UI 기능(글자 수 카운트, 성공 메시지)만 처리
    
    const contactMessage = document.getElementById('contactMessage');
    const charCount = document.getElementById('charCount');
    const formMessage = document.getElementById('formMessage');

    // 글자 수 카운트 기능만 유지
    if (contactMessage && charCount) {
        contactMessage.addEventListener('input', function() {
            const currentLength = this.value.length;
            charCount.textContent = currentLength;
            
            if (currentLength > 2000) {
                charCount.style.color = '#dc3545';
                this.value = this.value.substring(0, 2000);
                charCount.textContent = '2000';
            } else if (currentLength > 1800) {
                charCount.style.color = '#ff9800';
            } else {
                charCount.style.color = '#59484F';
            }
        });
    }

    // URL 파라미터로 성공/실패 메시지 확인 (Netlify가 리다이렉트 후 표시)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
        showMessage('문의사항이 성공적으로 전송되었습니다. 빠른 시일 내에 답변 드리겠습니다.', 'success');
        // URL 정리
        window.history.replaceState({}, document.title, window.location.pathname);
    } else if (urlParams.get('success') === 'false') {
        showMessage('문의사항 전송 중 오류가 발생했습니다. 다시 시도해주세요.', 'error');
        window.history.replaceState({}, document.title, window.location.pathname);
    }

    // 메시지 표시 함수
    function showMessage(message, type) {
        if (!formMessage) return;
        
        formMessage.textContent = message;
        formMessage.className = `form-message ${type}`;
        formMessage.style.display = 'block';
        
        // 스크롤하여 메시지 위치로 이동
        formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        // 5초 후 자동 숨김
        setTimeout(() => {
            formMessage.style.display = 'none';
        }, 5000);
    }
});

