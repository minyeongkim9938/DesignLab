// 반응형 미리보기 기능

document.addEventListener('DOMContentLoaded', function() {
    const urlInput = document.getElementById('urlInput');
    const loadUrlBtn = document.getElementById('loadUrlBtn');
    const previewFrame = document.getElementById('previewFrame');
    const previewContainer = document.getElementById('previewContainer');
    const deviceButtons = document.querySelectorAll('.device-btn');
    const customWidth = document.getElementById('customWidth');
    const customHeight = document.getElementById('customHeight');
    const applyCustomSize = document.getElementById('applyCustomSize');
    const refreshBtn = document.getElementById('refreshBtn');
    const fullscreenBtn = document.getElementById('fullscreenBtn');
    const deviceName = document.getElementById('deviceName');
    
    let currentWidth = 1280;
    let currentHeight = 720;
    let currentUrl = '';

    // URL 로드 함수
    function loadUrl() {
        let url = urlInput.value.trim();
        
        if (!url) {
            alert('URL을 입력해주세요.');
            return;
        }

        // URL에 프로토콜이 없으면 추가
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            url = 'https://' + url;
            urlInput.value = url;
        }

        currentUrl = url;
        
        try {
            previewFrame.src = url;
        } catch (error) {
            console.error('URL 로드 오류:', error);
            alert('URL을 로드할 수 없습니다. 올바른 URL인지 확인해주세요.');
        }
    }

    // 디바이스 크기 변경 함수
    function changeDeviceSize(width, height, name) {
        currentWidth = width;
        currentHeight = height;
        
        previewContainer.style.width = width + 'px';
        previewContainer.style.height = height + 'px';
        previewFrame.style.width = width + 'px';
        previewFrame.style.height = height + 'px';
        
        deviceName.textContent = `${name} - ${width}×${height}`;
        
        // 커스텀 크기 입력 필드 업데이트
        customWidth.value = width;
        customHeight.value = height;
    }

    // URL 로드 버튼 클릭
    loadUrlBtn.addEventListener('click', loadUrl);

    // Enter 키로 URL 로드
    urlInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            loadUrl();
        }
    });

    // 디바이스 버튼 클릭
    deviceButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // 모든 버튼에서 active 제거
            deviceButtons.forEach(b => b.classList.remove('active'));
            // 클릭한 버튼에 active 추가
            this.classList.add('active');
            
            const width = parseInt(this.dataset.width);
            const height = parseInt(this.dataset.height);
            const name = this.dataset.name;
            
            changeDeviceSize(width, height, name);
        });
    });

    // 커스텀 크기 적용
    applyCustomSize.addEventListener('click', function() {
        const width = parseInt(customWidth.value);
        const height = parseInt(customHeight.value);
        
        if (width < 320 || width > 3840 || height < 240 || height > 2160) {
            alert('너비는 320-3840px, 높이는 240-2160px 범위 내에서 입력해주세요.');
            return;
        }
        
        // 모든 디바이스 버튼에서 active 제거
        deviceButtons.forEach(b => b.classList.remove('active'));
        
        changeDeviceSize(width, height, '커스텀');
    });

    // 새로고침 버튼
    refreshBtn.addEventListener('click', function() {
        if (currentUrl) {
            previewFrame.src = currentUrl;
        } else {
            alert('먼저 URL을 로드해주세요.');
        }
    });

    // 전체화면 버튼
    fullscreenBtn.addEventListener('click', function() {
        const previewWrapper = document.getElementById('previewWrapper');
        
        if (!document.fullscreenElement) {
            previewWrapper.requestFullscreen().catch(err => {
                alert('전체화면 모드를 사용할 수 없습니다.');
            });
            fullscreenBtn.textContent = '전체화면 종료';
        } else {
            document.exitFullscreen();
            fullscreenBtn.textContent = '전체화면';
        }
    });

    // 전체화면 변경 감지
    document.addEventListener('fullscreenchange', function() {
        if (!document.fullscreenElement) {
            fullscreenBtn.textContent = '전체화면';
        }
    });

    // 초기 디바이스 크기 설정 (Desktop)
    changeDeviceSize(1280, 720, 'Desktop');
});

