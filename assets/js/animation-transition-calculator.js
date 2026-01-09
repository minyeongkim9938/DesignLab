// 애니메이션 속도/트랜지션 계산기

function init() {
    // DOM 요소 가져오기
    const animationTypeButtons = document.querySelectorAll('.animation-type-btn');
    const transitionControls = document.getElementById('transitionControls');
    const animationControls = document.getElementById('animationControls');
    const previewBoxAnimation = document.getElementById('previewBoxAnimation');
    const previewElement = document.getElementById('previewElement');
    const previewHint = document.getElementById('previewHint');
    const cssCode = document.getElementById('cssCode');
    const copyCSSBtn = document.getElementById('copyCSSBtn');
    const playAnimationBtn = document.getElementById('playAnimationBtn');

    // 트랜지션 요소
    const transitionProperty = document.getElementById('transitionProperty');
    const transitionDuration = document.getElementById('transitionDuration');
    const transitionTiming = document.getElementById('transitionTiming');
    const transitionDelay = document.getElementById('transitionDelay');

    // 애니메이션 요소
    const animationName = document.getElementById('animationName');
    const animationDuration = document.getElementById('animationDuration');
    const animationTiming = document.getElementById('animationTiming');
    const animationDelay = document.getElementById('animationDelay');
    const animationIteration = document.getElementById('animationIteration');
    const animationDirection = document.getElementById('animationDirection');

    let currentType = 'transition';
    let isHovered = false;

    // 타입 변경
    function switchType(type) {
        currentType = type;
        
        // 버튼 활성화 상태 변경
        animationTypeButtons.forEach(btn => {
            if (btn.dataset.type === type) {
                btn.classList.add('active');
                btn.classList.remove('btn-secondary');
                btn.classList.add('btn-primary');
            } else {
                btn.classList.remove('active');
                btn.classList.remove('btn-primary');
                btn.classList.add('btn-secondary');
            }
        });

        // 컨트롤 표시/숨김
        if (type === 'transition') {
            transitionControls.style.display = 'block';
            animationControls.style.display = 'none';
            previewHint.textContent = '마우스를 올려보세요 (트랜지션)';
            previewElement.textContent = 'Hover Me';
            // 애니메이션 제거
            previewElement.style.animation = 'none';
            playAnimationBtn.style.display = 'none';
            updateTransition();
        } else {
            transitionControls.style.display = 'none';
            animationControls.style.display = 'block';
            previewHint.textContent = '애니메이션이 자동으로 재생됩니다';
            previewElement.textContent = 'Animation';
            // 트랜지션 제거
            previewElement.style.transition = 'none';
            playAnimationBtn.style.display = 'block';
            updateAnimation(true);
        }

        updateCSSCode();
    }

    // 트랜지션 업데이트
    function updateTransition() {
        const property = transitionProperty.value;
        const duration = transitionDuration.value;
        const timing = transitionTiming.value;
        const delay = transitionDelay.value;

        const transitionValue = `${property} ${duration}s ${timing} ${delay}s`;
        previewElement.style.transition = transitionValue;
    }

    // 애니메이션 업데이트
    function updateAnimation(restart = false) {
        const name = animationName.value || 'myAnimation';
        const duration = animationDuration.value;
        const timing = animationTiming.value;
        const delay = animationDelay.value;
        const iteration = animationIteration.value;
        const direction = animationDirection.value;

        // 키프레임 정의 (간단한 예제)
        const keyframes = `
            @keyframes ${name} {
                0% { transform: translateX(0) scale(1); background: #667eea; }
                50% { transform: translateX(100px) scale(1.1); background: #764ba2; }
                100% { transform: translateX(0) scale(1); background: #667eea; }
            }
        `;

        // 기존 키프레임 제거 및 추가
        let styleSheet = document.getElementById('dynamic-keyframes');
        if (!styleSheet) {
            styleSheet = document.createElement('style');
            styleSheet.id = 'dynamic-keyframes';
            document.head.appendChild(styleSheet);
        }
        styleSheet.textContent = keyframes;

        // 애니메이션 재시작을 위해 먼저 제거했다가 다시 적용
        if (restart) {
            previewElement.style.animation = 'none';
            // 강제로 리플로우 발생
            void previewElement.offsetWidth;
        }

        const animationValue = `${name} ${duration}s ${timing} ${delay}s ${iteration} ${direction}`;
        previewElement.style.animation = animationValue;
    }

    // CSS 코드 생성
    function updateCSSCode() {
        let code = '';
        
        if (currentType === 'transition') {
            const property = transitionProperty.value;
            const duration = transitionDuration.value;
            const timing = transitionTiming.value;
            const delay = transitionDelay.value;
            
            code = `.element {\n    transition: ${property} ${duration}s ${timing} ${delay}s;\n}`;
            
            if (property === 'all') {
                code += `\n\n/* 또는 개별 속성 */\n.element {\n    transition-property: ${property};\n    transition-duration: ${duration}s;\n    transition-timing-function: ${timing};\n    transition-delay: ${delay}s;\n}`;
            }
        } else {
            const name = animationName.value || 'myAnimation';
            const duration = animationDuration.value;
            const timing = animationTiming.value;
            const delay = animationDelay.value;
            const iteration = animationIteration.value;
            const direction = animationDirection.value;
            
            code = `@keyframes ${name} {\n    0% { transform: translateX(0) scale(1); background: #667eea; }\n    50% { transform: translateX(100px) scale(1.1); background: #764ba2; }\n    100% { transform: translateX(0) scale(1); background: #667eea; }\n}\n\n.element {\n    animation: ${name} ${duration}s ${timing} ${delay}s ${iteration} ${direction};\n}`;
            
            code += `\n\n/* 또는 개별 속성 */\n.element {\n    animation-name: ${name};\n    animation-duration: ${duration}s;\n    animation-timing-function: ${timing};\n    animation-delay: ${delay}s;\n    animation-iteration-count: ${iteration};\n    animation-direction: ${direction};\n}`;
        }
        
        cssCode.textContent = code;
    }

    // 토스트 메시지 표시
    function showToast(message) {
        const existingToast = document.querySelector('.copy-toast');
        if (existingToast) {
            existingToast.remove();
        }

        const toast = document.createElement('div');
        toast.className = 'copy-toast';
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('show');
        }, 10);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }

    // 이벤트 리스너

    // 타입 버튼
    animationTypeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            switchType(btn.dataset.type);
        });
    });

    // 트랜지션 이벤트
    transitionProperty.addEventListener('change', () => {
        updateTransition();
        updateCSSCode();
    });

    transitionDuration.addEventListener('input', () => {
        updateTransition();
        updateCSSCode();
    });

    transitionTiming.addEventListener('change', () => {
        updateTransition();
        updateCSSCode();
    });

    transitionDelay.addEventListener('input', () => {
        updateTransition();
        updateCSSCode();
    });

    // 애니메이션 이벤트
    animationName.addEventListener('input', () => {
        updateAnimation(true);
        updateCSSCode();
    });

    animationDuration.addEventListener('input', () => {
        updateAnimation(true);
        updateCSSCode();
    });

    animationTiming.addEventListener('change', () => {
        updateAnimation(true);
        updateCSSCode();
    });

    animationDelay.addEventListener('input', () => {
        updateAnimation(true);
        updateCSSCode();
    });

    animationIteration.addEventListener('input', () => {
        updateAnimation(true);
        updateCSSCode();
    });

    animationDirection.addEventListener('change', () => {
        updateAnimation(true);
        updateCSSCode();
    });

    // 애니메이션 재생 버튼
    playAnimationBtn.addEventListener('click', () => {
        updateAnimation(true);
    });

    // 호버 효과 (트랜지션용)
    previewBoxAnimation.addEventListener('mouseenter', () => {
        if (currentType === 'transition') {
            isHovered = true;
            previewElement.style.transform = 'translateX(100px) scale(1.1)';
            previewElement.style.background = '#764ba2';
        }
    });

    previewBoxAnimation.addEventListener('mouseleave', () => {
        if (currentType === 'transition') {
            isHovered = false;
            previewElement.style.transform = 'translateX(0) scale(1)';
            previewElement.style.background = '#667eea';
        }
    });

    // CSS 복사 버튼
    copyCSSBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(cssCode.textContent).then(() => {
            showToast('CSS 코드가 복사되었습니다');
        });
    });

    // 초기화
    updateTransition();
    updateCSSCode();
}

// DOM 로드 완료 시 초기화
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

