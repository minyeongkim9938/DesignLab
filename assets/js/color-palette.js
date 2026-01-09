// 색상 팔레트 추천기 기능

let currentPaletteType = 'complementary';

// DOM 요소
let colorPicker, colorHex, paletteGrid, colorPreview, colorHexDisplay, colorRgbDisplay;
let paletteTypeButtons, quickColorButtons;

// 초기화 함수
function init() {
    // DOM 요소 가져오기
    colorPicker = document.getElementById('colorPicker');
    colorHex = document.getElementById('colorHex');
    paletteGrid = document.getElementById('paletteGrid');
    colorPreview = document.getElementById('colorPreview');
    colorHexDisplay = document.getElementById('colorHexDisplay');
    colorRgbDisplay = document.getElementById('colorRgbDisplay');
    paletteTypeButtons = document.querySelectorAll('.palette-type-btn');
    quickColorButtons = document.querySelectorAll('.quick-color-btn');

    // DOM 요소 존재 확인
    if (!colorPicker || !colorHex || !paletteGrid || !colorPreview) {
        console.error('필수 DOM 요소를 찾을 수 없습니다.');
        return;
    }

    // 색상 피커 이벤트
    colorPicker.addEventListener('input', (e) => {
        const hex = e.target.value.toUpperCase();
        // HEX 입력 필드 업데이트 (# 제외)
        colorHex.value = hex.replace('#', '');
        updateColorDisplay(hex);
        generatePalette();
    });

    // HEX 입력 이벤트
    colorHex.addEventListener('input', (e) => {
        let hex = e.target.value.toUpperCase().replace(/[^0-9A-F]/g, '');
        if (hex.length > 6) hex = hex.substring(0, 6);
        e.target.value = hex;
        
        if (hex.length === 6) {
            const fullHex = '#' + hex;
            colorPicker.value = fullHex;
            updateColorDisplay(fullHex);
            generatePalette();
        }
    });

    // 빠른 색상 선택 버튼
    quickColorButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const color = btn.dataset.color.toUpperCase();
            colorPicker.value = color;
            colorHex.value = color.replace('#', '');
            updateColorDisplay(color);
            generatePalette();
        });
    });

    // 팔레트 타입 버튼
    paletteTypeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            paletteTypeButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentPaletteType = btn.dataset.type;
            generatePalette();
        });
    });

    // 초기 색상 표시 및 팔레트 생성
    updateColorDisplay(colorPicker.value.toUpperCase());
    generatePalette();
}

// 색상 미리보기 업데이트
function updateColorDisplay(hex) {
    const rgb = hexToRgb(hex);
    if (!rgb) return;

    // 미리보기 색상 업데이트
    if (colorPreview) {
        colorPreview.style.background = hex;
    }

    // HEX 입력 필드 업데이트 (# 제외)
    if (colorHex) {
        colorHex.value = hex.replace('#', '');
    }

    // HEX 표시 업데이트
    if (colorHexDisplay) {
        colorHexDisplay.textContent = hex;
    }

    // RGB 표시 업데이트
    if (colorRgbDisplay) {
        colorRgbDisplay.textContent = `RGB(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    }
}

// HEX를 RGB로 변환
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

// RGB를 HEX로 변환
function rgbToHex(r, g, b) {
    return "#" + [r, g, b].map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    }).join("").toUpperCase();
}

// RGB를 HSL로 변환
function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
            case g: h = ((b - r) / d + 2) / 6; break;
            case b: h = ((r - g) / d + 4) / 6; break;
        }
    }
    return { h: h * 360, s: s * 100, l: l * 100 };
}

// HSL을 RGB로 변환
function hslToRgb(h, s, l) {
    h /= 360;
    s /= 100;
    l /= 100;
    let r, g, b;

    if (s === 0) {
        r = g = b = l;
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1/6) return p + (q - p) * 6 * t;
            if (t < 1/2) return q;
            if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
            return p;
        };
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}

// 팔레트 생성
function generatePalette() {
    const baseColor = colorPicker.value.toUpperCase();
    if (!baseColor || baseColor.length !== 7) return;
    
    const rgb = hexToRgb(baseColor);
    if (!rgb) return;

    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    let colors = [];

    switch (currentPaletteType) {
        case 'complementary':
            colors = generateComplementary(hsl);
            break;
        case 'triadic':
            colors = generateTriadic(hsl);
            break;
        case 'analogous':
            colors = generateAnalogous(hsl);
            break;
        case 'monochromatic':
            colors = generateMonochromatic(hsl);
            break;
        case 'split':
            colors = generateSplitComplementary(hsl);
            break;
        default:
            colors = generateComplementary(hsl);
    }

    displayPalette(colors);
}

// 보색 팔레트 생성
function generateComplementary(hsl) {
    const colors = [];
    const compH = (hsl.h + 180) % 360;
    colors.push({ h: hsl.h, s: hsl.s, l: hsl.l });
    colors.push({ h: compH, s: hsl.s, l: hsl.l });
    return colors;
}

// 삼원색 팔레트 생성
function generateTriadic(hsl) {
    const colors = [];
    colors.push({ h: hsl.h, s: hsl.s, l: hsl.l });
    colors.push({ h: (hsl.h + 120) % 360, s: hsl.s, l: hsl.l });
    colors.push({ h: (hsl.h + 240) % 360, s: hsl.s, l: hsl.l });
    return colors;
}

// 유사색 팔레트 생성
function generateAnalogous(hsl) {
    const colors = [];
    colors.push({ h: (hsl.h + 330) % 360, s: hsl.s, l: hsl.l });
    colors.push({ h: (hsl.h + 30) % 360, s: hsl.s, l: hsl.l });
    colors.push({ h: hsl.h, s: hsl.s, l: hsl.l });
    colors.push({ h: (hsl.h + 30) % 360, s: hsl.s, l: hsl.l });
    colors.push({ h: (hsl.h + 60) % 360, s: hsl.s, l: hsl.l });
    return colors;
}

// 단색 팔레트 생성
function generateMonochromatic(hsl) {
    const colors = [];
    const variations = [0.2, 0.4, 0.6, 0.8, 1.0];
    variations.forEach(lightness => {
        colors.push({
            h: hsl.h,
            s: hsl.s,
            l: Math.min(100, hsl.l * lightness * 2)
        });
    });
    return colors;
}

// 분할 보색 팔레트 생성
function generateSplitComplementary(hsl) {
    const colors = [];
    colors.push({ h: hsl.h, s: hsl.s, l: hsl.l });
    colors.push({ h: (hsl.h + 150) % 360, s: hsl.s, l: hsl.l });
    colors.push({ h: (hsl.h + 210) % 360, s: hsl.s, l: hsl.l });
    return colors;
}

// 팔레트 표시
function displayPalette(colors) {
    paletteGrid.innerHTML = '';

    colors.forEach(color => {
        const rgb = hslToRgb(color.h, color.s, color.l);
        const hex = rgbToHex(rgb.r, rgb.g, rgb.b);

        const colorItem = document.createElement('div');
        colorItem.className = 'palette-item';
        colorItem.style.backgroundColor = hex;

        const colorInfo = document.createElement('div');
        colorInfo.className = 'palette-item-info';

        const hexCode = document.createElement('div');
        hexCode.className = 'color-code hex-code';
        hexCode.textContent = hex;
        hexCode.onclick = () => copyToClipboard(hex);

        const rgbCode = document.createElement('div');
        rgbCode.className = 'color-code rgb-code';
        rgbCode.textContent = `RGB(${rgb.r}, ${rgb.g}, ${rgb.b})`;
        rgbCode.onclick = () => copyToClipboard(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`);

        colorInfo.appendChild(hexCode);
        colorInfo.appendChild(rgbCode);
        colorItem.appendChild(colorInfo);
        paletteGrid.appendChild(colorItem);
    });
}

// 클립보드에 복사
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        // 간단한 피드백
        const toast = document.createElement('div');
        toast.className = 'copy-toast';
        toast.textContent = `복사됨: ${text}`;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 300);
        }, 2000);
    }).catch(err => {
        console.error('복사 실패:', err);
        alert(`복사 실패: ${text}`);
    });
}

// DOM 로드 완료 시 초기화
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

