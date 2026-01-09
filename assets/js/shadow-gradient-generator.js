// 그림자·그라디언트 CSS 제너레이터

function init() {
    // DOM 요소 가져오기
    const effectTypeButtons = document.querySelectorAll('.effect-type-btn');
    const boxShadowControls = document.getElementById('boxShadowControls');
    const textShadowControls = document.getElementById('textShadowControls');
    const gradientControls = document.getElementById('gradientControls');
    const previewBox = document.getElementById('previewBox');
    const previewText = document.getElementById('previewText');
    const cssCode = document.getElementById('cssCode');
    const copyCSSBtn = document.getElementById('copyCSSBtn');

    // 박스 그림자 요소
    const boxShadowX = document.getElementById('boxShadowX');
    const boxShadowY = document.getElementById('boxShadowY');
    const boxShadowBlur = document.getElementById('boxShadowBlur');
    const boxShadowSpread = document.getElementById('boxShadowSpread');
    const boxShadowColor = document.getElementById('boxShadowColor');
    const boxShadowColorHex = document.getElementById('boxShadowColorHex');
    const boxShadowOpacity = document.getElementById('boxShadowOpacity');
    const boxShadowXValue = document.getElementById('boxShadowXValue');
    const boxShadowYValue = document.getElementById('boxShadowYValue');
    const boxShadowBlurValue = document.getElementById('boxShadowBlurValue');
    const boxShadowSpreadValue = document.getElementById('boxShadowSpreadValue');
    const boxShadowOpacityValue = document.getElementById('boxShadowOpacityValue');

    // 텍스트 그림자 요소
    const textShadowX = document.getElementById('textShadowX');
    const textShadowY = document.getElementById('textShadowY');
    const textShadowBlur = document.getElementById('textShadowBlur');
    const textShadowColor = document.getElementById('textShadowColor');
    const textShadowColorHex = document.getElementById('textShadowColorHex');
    const textShadowOpacity = document.getElementById('textShadowOpacity');
    const textShadowXValue = document.getElementById('textShadowXValue');
    const textShadowYValue = document.getElementById('textShadowYValue');
    const textShadowBlurValue = document.getElementById('textShadowBlurValue');
    const textShadowOpacityValue = document.getElementById('textShadowOpacityValue');

    // 그라디언트 요소
    const gradientType = document.getElementById('gradientType');
    const gradientDirection = document.getElementById('gradientDirection');
    const gradientDirectionGroup = document.getElementById('gradientDirectionGroup');
    const gradientColor1 = document.getElementById('gradientColor1');
    const gradientColor1Hex = document.getElementById('gradientColor1Hex');
    const gradientColor2 = document.getElementById('gradientColor2');
    const gradientColor2Hex = document.getElementById('gradientColor2Hex');

    // 미리보기 텍스트 입력
    const previewTextInput = document.getElementById('previewTextInput');

    let currentEffectType = 'box-shadow';

    // HEX를 RGBA로 변환
    function hexToRgba(hex, opacity) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${opacity / 100})`;
    }

    // 효과 타입 변경
    function switchEffectType(type) {
        currentEffectType = type;
        
        // 버튼 활성화 상태 변경
        effectTypeButtons.forEach(btn => {
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
        if (type === 'box-shadow') {
            boxShadowControls.style.display = 'block';
            textShadowControls.style.display = 'none';
            gradientControls.style.display = 'none';
            previewBox.style.display = 'flex';
            previewBox.style.width = '200px';
            previewBox.style.height = '200px';
            previewBox.style.background = '#fff';
            previewBox.style.borderRadius = '12px';
            previewBox.style.boxShadow = '';
            previewText.style.display = 'none';
        } else if (type === 'text-shadow') {
            boxShadowControls.style.display = 'none';
            textShadowControls.style.display = 'block';
            gradientControls.style.display = 'none';
            previewBox.style.display = 'flex';
            previewBox.style.width = 'auto';
            previewBox.style.height = 'auto';
            previewBox.style.background = 'transparent';
            previewBox.style.borderRadius = '0';
            previewBox.style.boxShadow = 'none';
            previewText.style.display = 'block';
            // 미리보기 텍스트 업데이트
            if (previewTextInput) {
                previewText.textContent = previewTextInput.value || '미리보기';
            }
        } else if (type === 'gradient') {
            boxShadowControls.style.display = 'none';
            textShadowControls.style.display = 'none';
            gradientControls.style.display = 'block';
            previewBox.style.display = 'flex';
            previewBox.style.width = '200px';
            previewBox.style.height = '200px';
            previewBox.style.borderRadius = '12px';
            previewBox.style.boxShadow = 'none';
            previewText.style.display = 'none';
        }

        updatePreview();
        updateCSSCode();
    }

    // 미리보기 업데이트
    function updatePreview() {
        if (currentEffectType === 'box-shadow') {
            const x = boxShadowX.value;
            const y = boxShadowY.value;
            const blur = boxShadowBlur.value;
            const spread = boxShadowSpread.value;
            const color = boxShadowColor.value;
            const opacity = boxShadowOpacity.value / 100;
            
            const rgba = hexToRgba(color, opacity * 100);
            const shadow = `${x}px ${y}px ${blur}px ${spread}px ${rgba}`;
            previewBox.style.boxShadow = shadow;
            previewBox.style.background = '#fff';
        } else if (currentEffectType === 'text-shadow') {
            const x = textShadowX.value;
            const y = textShadowY.value;
            const blur = textShadowBlur.value;
            const color = textShadowColor.value;
            const opacity = textShadowOpacity.value / 100;
            
            const rgba = hexToRgba(color, opacity * 100);
            const shadow = `${x}px ${y}px ${blur}px ${rgba}`;
            previewText.style.textShadow = shadow;
            previewBox.style.background = 'transparent';
            previewBox.style.boxShadow = 'none';
            previewBox.style.width = 'auto';
            previewBox.style.height = 'auto';
            previewBox.style.borderRadius = '0';
            // 미리보기 텍스트 업데이트
            if (previewTextInput) {
                previewText.textContent = previewTextInput.value || '미리보기';
            }
        } else if (currentEffectType === 'gradient') {
            const type = gradientType.value;
            const direction = gradientDirection.value;
            const color1 = gradientColor1.value;
            const color2 = gradientColor2.value;
            
            if (type === 'linear') {
                previewBox.style.background = `linear-gradient(${direction}, ${color1}, ${color2})`;
            } else {
                previewBox.style.background = `radial-gradient(circle, ${color1}, ${color2})`;
            }
            previewBox.style.boxShadow = 'none';
        }
    }

    // CSS 코드 생성
    function updateCSSCode() {
        let code = '';
        
        if (currentEffectType === 'box-shadow') {
            const x = boxShadowX.value;
            const y = boxShadowY.value;
            const blur = boxShadowBlur.value;
            const spread = boxShadowSpread.value;
            const color = boxShadowColor.value;
            const opacity = boxShadowOpacity.value / 100;
            const rgba = hexToRgba(color, opacity * 100);
            
            code = `box-shadow: ${x}px ${y}px ${blur}px ${spread}px ${rgba};`;
        } else if (currentEffectType === 'text-shadow') {
            const x = textShadowX.value;
            const y = textShadowY.value;
            const blur = textShadowBlur.value;
            const color = textShadowColor.value;
            const opacity = textShadowOpacity.value / 100;
            const rgba = hexToRgba(color, opacity * 100);
            
            code = `text-shadow: ${x}px ${y}px ${blur}px ${rgba};`;
        } else if (currentEffectType === 'gradient') {
            const type = gradientType.value;
            const direction = gradientDirection.value;
            const color1 = gradientColor1.value;
            const color2 = gradientColor2.value;
            
            if (type === 'linear') {
                code = `background: linear-gradient(${direction}, ${color1}, ${color2});`;
            } else {
                code = `background: radial-gradient(circle, ${color1}, ${color2});`;
            }
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

    // 효과 타입 버튼
    effectTypeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            switchEffectType(btn.dataset.type);
        });
    });

    // 박스 그림자 이벤트
    boxShadowX.addEventListener('input', () => {
        boxShadowXValue.textContent = `${boxShadowX.value}px`;
        updatePreview();
        updateCSSCode();
    });

    boxShadowY.addEventListener('input', () => {
        boxShadowYValue.textContent = `${boxShadowY.value}px`;
        updatePreview();
        updateCSSCode();
    });

    boxShadowBlur.addEventListener('input', () => {
        boxShadowBlurValue.textContent = `${boxShadowBlur.value}px`;
        updatePreview();
        updateCSSCode();
    });

    boxShadowSpread.addEventListener('input', () => {
        boxShadowSpreadValue.textContent = `${boxShadowSpread.value}px`;
        updatePreview();
        updateCSSCode();
    });

    boxShadowColor.addEventListener('input', () => {
        boxShadowColorHex.value = boxShadowColor.value;
        updatePreview();
        updateCSSCode();
    });

    boxShadowColorHex.addEventListener('input', () => {
        const hex = boxShadowColorHex.value;
        if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
            boxShadowColor.value = hex;
            updatePreview();
            updateCSSCode();
        }
    });

    boxShadowOpacity.addEventListener('input', () => {
        boxShadowOpacityValue.textContent = `${boxShadowOpacity.value}%`;
        updatePreview();
        updateCSSCode();
    });

    // 텍스트 그림자 이벤트
    textShadowX.addEventListener('input', () => {
        textShadowXValue.textContent = `${textShadowX.value}px`;
        updatePreview();
        updateCSSCode();
    });

    textShadowY.addEventListener('input', () => {
        textShadowYValue.textContent = `${textShadowY.value}px`;
        updatePreview();
        updateCSSCode();
    });

    textShadowBlur.addEventListener('input', () => {
        textShadowBlurValue.textContent = `${textShadowBlur.value}px`;
        updatePreview();
        updateCSSCode();
    });

    textShadowColor.addEventListener('input', () => {
        textShadowColorHex.value = textShadowColor.value;
        updatePreview();
        updateCSSCode();
    });

    textShadowColorHex.addEventListener('input', () => {
        const hex = textShadowColorHex.value;
        if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
            textShadowColor.value = hex;
            updatePreview();
            updateCSSCode();
        }
    });

    textShadowOpacity.addEventListener('input', () => {
        textShadowOpacityValue.textContent = `${textShadowOpacity.value}%`;
        updatePreview();
        updateCSSCode();
    });

    // 미리보기 텍스트 입력 이벤트
    if (previewTextInput) {
        previewTextInput.addEventListener('input', () => {
            previewText.textContent = previewTextInput.value || '미리보기';
        });
    }

    // 그라디언트 이벤트
    gradientType.addEventListener('change', () => {
        if (gradientType.value === 'radial') {
            gradientDirectionGroup.style.display = 'none';
        } else {
            gradientDirectionGroup.style.display = 'flex';
        }
        updatePreview();
        updateCSSCode();
    });

    gradientDirection.addEventListener('change', () => {
        updatePreview();
        updateCSSCode();
    });

    gradientColor1.addEventListener('input', () => {
        gradientColor1Hex.value = gradientColor1.value;
        updatePreview();
        updateCSSCode();
    });

    gradientColor1Hex.addEventListener('input', () => {
        const hex = gradientColor1Hex.value;
        if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
            gradientColor1.value = hex;
            updatePreview();
            updateCSSCode();
        }
    });

    gradientColor2.addEventListener('input', () => {
        gradientColor2Hex.value = gradientColor2.value;
        updatePreview();
        updateCSSCode();
    });

    gradientColor2Hex.addEventListener('input', () => {
        const hex = gradientColor2Hex.value;
        if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
            gradientColor2.value = hex;
            updatePreview();
            updateCSSCode();
        }
    });

    // CSS 복사 버튼
    copyCSSBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(cssCode.textContent).then(() => {
            showToast('CSS 코드가 복사되었습니다');
        });
    });

    // 초기화
    if (previewTextInput && previewText) {
        previewText.textContent = previewTextInput.value || '미리보기';
    }
    updatePreview();
    updateCSSCode();
}

// DOM 로드 완료 시 초기화
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

