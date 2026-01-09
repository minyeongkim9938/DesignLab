// 문의하기 폼 처리

document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contactForm');
    const contactMessage = document.getElementById('contactMessage');
    const charCount = document.getElementById('charCount');
    const formMessage = document.getElementById('formMessage');
    const footerData = {
        contact: {
            email: 'lili9938@naver.com'
        }
    };

    // 글자 수 카운트
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

    // 폼 제출 처리
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const name = document.getElementById('contactName').value.trim();
            const email = document.getElementById('contactEmail').value.trim();
            const subject = document.getElementById('contactSubject').value.trim();
            const message = document.getElementById('contactMessage').value.trim();

            // 유효성 검사
            if (!name || !email || !subject || !message) {
                showMessage('모든 필수 항목을 입력해주세요.', 'error');
                return;
            }

            if (!isValidEmail(email)) {
                showMessage('올바른 이메일 주소를 입력해주세요.', 'error');
                return;
            }

            if (message.length < 10) {
                showMessage('문의 내용은 최소 10자 이상 입력해주세요.', 'error');
                return;
            }

            // 메일 링크 생성 (실제 서버가 없는 경우)
            const mailtoLink = `mailto:${footerData.contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`이름: ${name}\n이메일: ${email}\n\n${message}`)}`;
            
            // 메일 클라이언트 열기
            window.location.href = mailtoLink;
            
            // 성공 메시지 표시
            showMessage('문의사항이 전송되었습니다. 메일 클라이언트에서 이메일을 확인해주세요.', 'success');
            
            // 폼 초기화 (약간의 지연 후)
            setTimeout(() => {
                contactForm.reset();
                if (charCount) charCount.textContent = '0';
            }, 2000);
        });
    }

    // 이메일 유효성 검사
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // 메시지 표시
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

