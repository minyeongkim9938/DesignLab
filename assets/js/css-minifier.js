// CSS Minifier

function init() {
    // DOM 요소 가져오기
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const cssInput = document.getElementById('cssInput');
    const minifyBtn = document.getElementById('minifyBtn');
    const clearBtn = document.getElementById('clearBtn');
    const resultSection = document.getElementById('resultSection');
    const cssOutput = document.getElementById('cssOutput');
    const copyBtn = document.getElementById('copyBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const originalSize = document.getElementById('originalSize');
    const minifiedSize = document.getElementById('minifiedSize');
    const compressionRatio = document.getElementById('compressionRatio');

    // CSS Minify 함수
    function minifyCSS(css) {
        return css
            // 주석 제거 (/* ... */)
            .replace(/\/\*[\s\S]*?\*\//g, '')
            // 줄바꿈, 탭, 여러 공백을 하나의 공백으로
            .replace(/\s+/g, ' ')
            // 선택자와 중괄호 사이의 공백 제거
            .replace(/\s*\{\s*/g, '{')
            .replace(/\s*\}\s*/g, '}')
            // 세미콜론 전후 공백 제거
            .replace(/\s*;\s*/g, ';')
            // 콜론 전후 공백 제거 (하지만 콜론 뒤는 공백 유지)
            .replace(/\s*:\s*/g, ':')
            // 중괄호 전후 공백 제거
            .replace(/\s*,\s*/g, ',')
            // 여는 중괄호 앞 공백 제거
            .replace(/\s*\{\s*/g, '{')
            .replace(/\s*\}\s*/g, '}')
            // 닫는 중괄호 뒤 공백 제거
            .replace(/\}\s+/g, '}')
            // 문자열 내부 공백 보존 (url, content 등)
            // 최종 정리
            .trim();
    }

    // 파일 업로드
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.background = '#f0f0f0';
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.background = '';
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.background = '';
        
        const file = e.dataTransfer.files[0];
        if (file && (file.type === 'text/css' || file.name.endsWith('.css'))) {
            const reader = new FileReader();
            reader.onload = (e) => {
                cssInput.value = e.target.result;
                // 자동으로 압축
                minifyCSSAndDisplay();
            };
            reader.readAsText(file);
        } else {
            alert('CSS 파일만 업로드할 수 있습니다.');
        }
    });

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                cssInput.value = e.target.result;
                // 자동으로 압축
                minifyCSSAndDisplay();
            };
            reader.readAsText(file);
        }
    });

    // 압축하기
    function minifyCSSAndDisplay() {
        const css = cssInput.value.trim();
        if (!css) {
            alert('CSS 코드를 입력하세요.');
            return;
        }

        const minified = minifyCSS(css);
        const originalBytes = new Blob([css]).size;
        const minifiedBytes = new Blob([minified]).size;
        const ratio = originalBytes > 0 ? ((1 - minifiedBytes / originalBytes) * 100).toFixed(1) : 0;

        cssOutput.textContent = minified;
        originalSize.textContent = originalBytes.toLocaleString();
        minifiedSize.textContent = minifiedBytes.toLocaleString();
        compressionRatio.textContent = `${ratio}%`;

        resultSection.style.display = 'block';
        resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    minifyBtn.addEventListener('click', minifyCSSAndDisplay);

    // 지우기
    clearBtn.addEventListener('click', () => {
        cssInput.value = '';
        resultSection.style.display = 'none';
        fileInput.value = '';
    });

    // 복사
    copyBtn.addEventListener('click', () => {
        const text = cssOutput.textContent;
        navigator.clipboard.writeText(text).then(() => {
            const originalText = copyBtn.textContent;
            copyBtn.textContent = '복사됨!';
            copyBtn.style.background = '#48bb78';
            setTimeout(() => {
                copyBtn.textContent = originalText;
                copyBtn.style.background = '';
            }, 2000);
        }).catch(err => {
            alert('복사에 실패했습니다.');
            console.error('복사 오류:', err);
        });
    });

    // 다운로드
    downloadBtn.addEventListener('click', () => {
        const minified = cssOutput.textContent;
        const blob = new Blob([minified], { type: 'text/css' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'style.min.css';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    // 설명 토글
    const toggleDescription = document.getElementById('toggleDescription');
    const descriptionContent = document.getElementById('descriptionContent');
    if (toggleDescription && descriptionContent) {
        toggleDescription.addEventListener('click', () => {
            const isHidden = descriptionContent.style.display === 'none';
            descriptionContent.style.display = isHidden ? 'block' : 'none';
            toggleDescription.querySelector('.toggle-icon').textContent = isHidden ? '▲' : '▼';
        });
    }
}

// DOM 로드 완료 시 초기화
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

