// 아이콘 & SVG 커스터마이저

function init() {
    // DOM 요소 가져오기
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const pasteSVGBtn = document.getElementById('pasteSVGBtn');
    const svgCodeSection = document.getElementById('svgCodeSection');
    const svgCodeInput = document.getElementById('svgCodeInput');
    const applySVGBtn = document.getElementById('applySVGBtn');
    const editControls = document.getElementById('editControls');
    const previewSection = document.getElementById('previewSection');
    const downloadSection = document.getElementById('downloadSection');
    const previewSvgWrapper = document.getElementById('previewSvgWrapper');
    const svgColor = document.getElementById('svgColor');
    const svgColorHex = document.getElementById('svgColorHex');
    const resetColorBtn = document.getElementById('resetColorBtn');
    const svgWidth = document.getElementById('svgWidth');
    const svgHeight = document.getElementById('svgHeight');
    const svgRotation = document.getElementById('svgRotation');
    const svgRotationValue = document.getElementById('svgRotationValue');
    const keepAspectRatio = document.getElementById('keepAspectRatio');
    const svgOutput = document.getElementById('svgOutput');
    const downloadSVGBtn = document.getElementById('downloadSVGBtn');
    const svgIconsGrid = document.getElementById('svgIconsGrid');

    let originalSvg = null;
    let originalSvgContent = '';
    let originalWidth = 200;
    let originalHeight = 200;
    let originalAspectRatio = 1;
    let originalViewBox = null;

    // SVG 파일 다운로드 함수
    function downloadSVGFile(svgContent, filename = 'icon') {
        const blob = new Blob([svgContent], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}.svg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // 프리셋 SVG 아이콘 데이터
    const presetIcons = [
        { name: '하트', icon: '❤️', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>' },
        { name: '별', icon: '⭐', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>' },
        { name: '홈', icon: '🏠', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>' },
        { name: '검색', icon: '🔍', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>' },
        { name: '사용자', icon: '👤', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>' },
        { name: '설정', icon: '⚙️', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M19.14,12.94c0.04-0.3,0.06-0.61,0.06-0.94c0-0.32-0.02-0.64-0.07-0.94l2.03-1.58c0.18-0.14,0.23-0.41,0.12-0.61 l-1.92-3.32c-0.12-0.22-0.37-0.29-0.59-0.22l-2.39,0.96c-0.5-0.38-1.03-0.7-1.62-0.94L14.4,2.81c-0.04-0.24-0.24-0.41-0.48-0.41 h-3.84c-0.24,0-0.43,0.17-0.47,0.41L9.25,5.35C8.66,5.59,8.12,5.92,7.63,6.29L5.24,5.33c-0.22-0.08-0.47,0-0.59,0.22L2.74,8.87 C2.62,9.08,2.66,9.34,2.86,9.48l2.03,1.58C4.84,11.36,4.8,11.69,4.8,12s0.02,0.64,0.07,0.94l-2.03,1.58 c-0.18,0.14-0.23,0.41-0.12,0.61l1.92,3.32c0.12,0.22,0.37,0.29,0.59,0.22l2.39-0.96c0.5,0.38,1.03,0.7,1.62,0.94l0.36,2.54 c0.05,0.24,0.24,0.41,0.48,0.41h3.84c0.24,0,0.44-0.17,0.47-0.41l0.36-2.54c0.59-0.24,1.13-0.56,1.62-0.94l2.39,0.96 c0.22,0.08,0.47,0,0.59-0.22l1.92-3.32c0.12-0.22,0.07-0.47-0.12-0.61L19.14,12.94z M12,15.6c-1.98,0-3.6-1.62-3.6-3.6 s1.62-3.6,3.6-3.6s3.6,1.62,3.6,3.6S13.98,15.6,12,15.6z"/></svg>' },
        { name: '좋아요', icon: '👍', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/></svg>' },
        { name: '다운로드', icon: '📥', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>' },
        { name: '업로드', icon: '📤', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"/></svg>' },
        { name: '삭제', icon: '🗑️', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>' },
        { name: '편집', icon: '✏️', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>' },
        { name: '체크', icon: '✅', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>' },
        { name: '닫기', icon: '❌', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>' },
        { name: '플러스', icon: '➕', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>' },
        { name: '마이너스', icon: '➖', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M19 13H5v-2h14v2z"/></svg>' },
        { name: '화살표-위', icon: '⬆️', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/></svg>' },
        { name: '화살표-아래', icon: '⬇️', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/></svg>' },
        { name: '화살표-왼쪽', icon: '⬅️', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>' },
        { name: '화살표-오른쪽', icon: '➡️', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/></svg>' },
        { name: '메뉴', icon: '☰', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/></svg>' },
        { name: '정보', icon: 'ℹ️', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>' },
        { name: '경고', icon: '⚠️', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>' },
        { name: '사랑', icon: '💕', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>' },
        { name: '책갈피', icon: '🔖', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/></svg>' },
        { name: '음악', icon: '🎵', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>' },
        { name: '카메라', icon: '📷', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12m-3.2 0a3.2 3.2 0 1 1 6.4 0a3.2 3.2 0 1 1-6.4 0"/><path d="M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/></svg>' },
        { name: '뉴스', icon: '📰', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z"/></svg>' },
        { name: '달력', icon: '📅', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"/></svg>' },
        { name: '시간', icon: '⏰', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>' },
        { name: '위치', icon: '📍', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>' },
        { name: '이메일', icon: '✉️', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>' },
        { name: '전화', icon: '📞', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>' },
        { name: '알림', icon: '🔔', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>' },
        { name: '공유', icon: '🔗', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg>' },
        { name: '인쇄', icon: '🖨️', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"/></svg>' },
        { name: '저장', icon: '💾', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/></svg>' },
        { name: '폴더', icon: '📁', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M10 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2h-8l-2-2z"/></svg>' },
        { name: '파일', icon: '📄', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>' },
        { name: '필터', icon: '🔍', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"/></svg>' },
        { name: '새로고침', icon: '🔄', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/></svg>' },
        { name: '차단', icon: '🚫', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8 0-1.85.63-3.55 1.69-4.9L16.9 18.31C15.55 19.37 13.85 20 12 20zm6.31-3.1L7.1 5.69C8.45 4.63 10.15 4 12 4c4.42 0 8 3.58 8 8 0 1.85-.63 3.55-1.69 4.9z"/></svg>' },
        { name: '잠금', icon: '🔒', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>' },
        { name: '잠금해제', icon: '🔓', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 17c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6-9h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zM8.9 6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2H8.9V6z"/></svg>' },
        { name: '좋아요취소', icon: '👍', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"/></svg>' },
        { name: '댓글', icon: '💬', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H6l-2 2V4h16v12z"/></svg>' },
        { name: '공지', icon: '📢', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>' },
        { name: '빈하트', icon: '🤍', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>' },
        { name: '다이어그램', icon: '📊', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect x="3" y="13" width="4" height="5" fill="#667eea"/><rect x="9" y="10" width="4" height="8" fill="#48bb78"/><rect x="15" y="6" width="4" height="12" fill="#ed8936"/><rect x="3" y="3" width="18" height="10" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>' },
        { name: '차트', icon: '📈', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><polyline points="3 16 7 12 11 16 21 6" fill="none" stroke="#667eea" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><line x1="21" y1="6" x2="21" y2="20" fill="none" stroke="#9e9e9e" stroke-width="2" stroke-linecap="round"/><line x1="3" y1="20" x2="21" y2="20" fill="none" stroke="#9e9e9e" stroke-width="2" stroke-linecap="round"/></svg>' },
        { name: '원형차트', icon: '🫥', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#667eea" opacity="0.2"/><path d="M12 2 A10 10 0 0 1 22 12 L12 12 Z" fill="#667eea"/><path d="M12 2 A10 10 0 0 0 2 12 L12 12 Z" fill="#48bb78"/><circle cx="12" cy="12" r="5" fill="white"/></svg>' },
        { name: '깃발', icon: '🚩', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect x="3" y="2" width="12" height="8" fill="#ef4444"/><polygon points="3,2 15,6 3,10" fill="#1f2937"/><line x1="3" y1="2" x2="3" y2="22" stroke="#92400e" stroke-width="2.5" stroke-linecap="round"/></svg>' },
        { name: '배지', icon: '🎖️', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#fbbf24" stroke="#f59e0b" stroke-width="1.5"/><circle cx="12" cy="12" r="7" fill="#fef3c7"/><path d="M12 5 L13.5 9 L17.5 9 L14 12 L15.5 16 L12 13.5 L8.5 16 L10 12 L6.5 9 L10.5 9 Z" fill="#f59e0b"/></svg>' },
        { name: '방패', icon: '🛡️', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2 L4 5 L4 11 C4 16 8 20 12 22 C16 20 20 16 20 11 L20 5 Z" fill="#3b82f6" stroke="#1e40af" stroke-width="1.5"/><circle cx="12" cy="11" r="4" fill="#ffffff" opacity="0.3"/></svg>' },
        { name: '별배지', icon: '⭐', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#fbbf24"/><path d="M12 4 L14.5 9.5 L19.5 9.5 L15.5 13 L17 18.5 L12 14.5 L7 18.5 L8.5 13 L4.5 9.5 L9.5 9.5 Z" fill="#ffffff"/><path d="M12 6 L13.5 9.5 L17 9.5 L14.5 12.5 L15.5 16 L12 13.5 L8.5 16 L9.5 12.5 L7 9.5 L10.5 9.5 Z" fill="#f59e0b"/></svg>' },
        { name: '다이아몬드', icon: '💎', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 2 L18 8 L12 22 L6 8 Z" fill="#60a5fa"/><path d="M12 2 L18 8 L12 10 Z" fill="#3b82f6"/><path d="M6 8 L12 22 L12 10 Z" fill="#1e40af"/><path d="M18 8 L12 22 L12 10 Z" fill="#93c5fd"/><path d="M12 2 L6 8 L12 10 Z" fill="#1e40af"/></svg>' },
        { name: '불꽃', icon: '🔥', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 22 C8 22 5 19 5 15 C5 12 7 10 9 8 C9 6 10 4 12 2 C14 4 15 6 15 8 C17 10 19 12 19 15 C19 19 16 22 12 22 Z" fill="#f97316"/><path d="M12 22 C10 22 8 20 8 18 C8 16 9 15 10 14 C10 13 11 12 12 10 C13 12 14 13 14 14 C15 15 16 16 16 18 C16 20 14 22 12 22 Z" fill="#fb923c"/><ellipse cx="12" cy="16" rx="2" ry="2" fill="#fbbf24"/></svg>' },
        { name: '무지개', icon: '🌈', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M2 16 Q12 4 22 16" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round"/><path d="M3 17 Q12 6 21 17" fill="none" stroke="#f97316" stroke-width="2" stroke-linecap="round"/><path d="M4 18 Q12 8 20 18" fill="none" stroke="#fbbf24" stroke-width="2" stroke-linecap="round"/><path d="M5 19 Q12 10 19 19" fill="none" stroke="#22c55e" stroke-width="2" stroke-linecap="round"/><path d="M6 20 Q12 12 18 20" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round"/><path d="M7 21 Q12 14 17 21" fill="none" stroke="#8b5cf6" stroke-width="2" stroke-linecap="round"/></svg>' },
        { name: '태양', icon: '☀️', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5" fill="#fbbf24"/><circle cx="12" cy="12" r="3" fill="#fef3c7"/><line x1="12" y1="2" x2="12" y2="4" stroke="#f59e0b" stroke-width="2" stroke-linecap="round"/><line x1="12" y1="20" x2="12" y2="22" stroke="#f59e0b" stroke-width="2" stroke-linecap="round"/><line x1="2" y1="12" x2="4" y2="12" stroke="#f59e0b" stroke-width="2" stroke-linecap="round"/><line x1="20" y1="12" x2="22" y2="12" stroke="#f59e0b" stroke-width="2" stroke-linecap="round"/><line x1="5.64" y1="5.64" x2="7.05" y2="7.05" stroke="#f59e0b" stroke-width="2" stroke-linecap="round"/><line x1="16.95" y1="16.95" x2="18.36" y2="18.36" stroke="#f59e0b" stroke-width="2" stroke-linecap="round"/><line x1="18.36" y1="5.64" x2="16.95" y2="7.05" stroke="#f59e0b" stroke-width="2" stroke-linecap="round"/><line x1="7.05" y1="16.95" x2="5.64" y2="18.36" stroke="#f59e0b" stroke-width="2" stroke-linecap="round"/></svg>' },
        { name: '구름', icon: '☁️', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" fill="#e5e7eb" stroke="#9ca3af" stroke-width="1"/></svg>' },
        { name: '집', icon: '🏘️', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect x="3" y="12" width="6" height="10" fill="#8b5cf6"/><rect x="11" y="8" width="6" height="14" fill="#ec4899"/><rect x="19" y="14" width="4" height="8" fill="#3b82f6"/><polygon points="3,12 6,9 9,12" fill="#1f2937"/><polygon points="11,8 14,5 17,8" fill="#1f2937"/><polygon points="19,14 21,12 23,14" fill="#1f2937"/></svg>' },
        { name: '트리', icon: '🌲', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><rect x="11" y="18" width="2" height="4" fill="#92400e"/><polygon points="12,2 8,10 12,8 16,10" fill="#22c55e"/><polygon points="12,6 8,14 12,12 16,14" fill="#16a34a"/><polygon points="12,10 8,18 12,16 16,18" fill="#15803d"/></svg>' },
        { name: '꽃', icon: '🌺', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="4" fill="#ec4899"/><circle cx="12" cy="8" r="2.5" fill="#f472b6"/><circle cx="16" cy="12" r="2.5" fill="#f472b6"/><circle cx="12" cy="16" r="2.5" fill="#f472b6"/><circle cx="8" cy="12" r="2.5" fill="#f472b6"/><circle cx="12" cy="12" r="1.5" fill="#fbbf24"/></svg>' },
        { name: '나비', icon: '🦋', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><polygon points="12,12 8,8 6,10 12,12 18,10 16,8" fill="#3b82f6"/><polygon points="12,12 8,16 6,14 12,12 18,14 16,16" fill="#8b5cf6"/><circle cx="10" cy="10" r="1.5" fill="#1f2937"/><circle cx="14" cy="10" r="1.5" fill="#1f2937"/><circle cx="10" cy="14" r="1.5" fill="#1f2937"/><circle cx="14" cy="14" r="1.5" fill="#1f2937"/><line x1="12" y1="2" x2="12" y2="22" stroke="#9ca3af" stroke-width="1.5" stroke-linecap="round"/></svg>' },
        { name: '고양이', icon: '🐱', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="13" r="8" fill="#fbbf24"/><circle cx="9" cy="11" r="1.5" fill="#1f2937"/><circle cx="15" cy="11" r="1.5" fill="#1f2937"/><path d="M10 15 Q12 17 14 15" fill="none" stroke="#1f2937" stroke-width="2" stroke-linecap="round"/><path d="M8 8 L10 6 M16 8 L14 6" fill="none" stroke="#1f2937" stroke-width="2" stroke-linecap="round"/><path d="M4 20 Q8 18 12 20 Q16 18 20 20" fill="none" stroke="#1f2937" stroke-width="2" stroke-linecap="round"/></svg>' },
        { name: '펭귄', icon: '🐧', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><ellipse cx="12" cy="16" rx="6" ry="6" fill="#1f2937"/><ellipse cx="12" cy="12" rx="5" ry="6" fill="#ffffff"/><ellipse cx="12" cy="10" rx="4" ry="5" fill="#1f2937"/><circle cx="10" cy="9" r="1" fill="#ffffff"/><circle cx="14" cy="9" r="1" fill="#ffffff"/><ellipse cx="12" cy="12" rx="0.5" ry="3" fill="#fbbf24"/><line x1="8" y1="20" x2="10" y2="22" stroke="#1f2937" stroke-width="2" stroke-linecap="round"/><line x1="16" y1="20" x2="14" y2="22" stroke="#1f2937" stroke-width="2" stroke-linecap="round"/></svg>' },
        { name: '로켓', icon: '🚀', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><polygon points="12,2 8,10 12,8 16,10" fill="#9ca3af"/><rect x="10" y="8" width="4" height="12" fill="#3b82f6"/><circle cx="12" cy="14" r="2" fill="#1e40af"/><polygon points="8,20 12,18 16,20" fill="#ef4444"/><polygon points="10,20 12,19 14,20" fill="#fbbf24"/></svg>' },
        { name: '지구', icon: '🌍', svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#3b82f6"/><ellipse cx="12" cy="12" rx="10" ry="5" fill="#22c55e"/><path d="M12 2 A10 10 0 0 1 12 22" fill="none" stroke="#1e40af" stroke-width="1.5"/><path d="M4 6 Q8 8 12 6 Q16 8 20 6" fill="none" stroke="#15803d" stroke-width="1.5" stroke-linecap="round"/><path d="M4 18 Q8 16 12 18 Q16 16 20 18" fill="none" stroke="#15803d" stroke-width="1.5" stroke-linecap="round"/></svg>' }
    ];

    // 프리셋 아이콘 그리드 생성
    function createPresetIcons() {
        svgIconsGrid.innerHTML = '';
        
        // 기존 더보기 버튼 제거
        const parentSection = svgIconsGrid.parentElement;
        const existingBtn = parentSection.querySelector('.show-more-icons-btn');
        if (existingBtn) {
            existingBtn.remove();
        }
        
        // 초기 표시 개수 (4줄 기준)
        const itemsPerRow = Math.floor((window.innerWidth - 80) / 170);
        const initialCount = Math.max(12, itemsPerRow * 4);
        
        presetIcons.forEach((icon, index) => {
            const iconItem = document.createElement('div');
            iconItem.className = 'svg-icon-item';
            if (index >= initialCount) {
                iconItem.style.display = 'none';
                iconItem.classList.add('svg-icon-item-hidden');
            }
            
            const previewDiv = document.createElement('div');
            previewDiv.className = 'svg-icon-preview';
            previewDiv.innerHTML = icon.svg.replace('currentColor', '#667eea');
            
            const nameDiv = document.createElement('div');
            nameDiv.className = 'svg-icon-name';
            nameDiv.textContent = icon.name;
            
            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'svg-icon-actions';
            
            const useBtn = document.createElement('button');
            useBtn.className = 'btn btn-primary btn-small use-icon-btn';
            useBtn.textContent = '사용';
            useBtn.dataset.index = index;
            
            const downloadBtn = document.createElement('button');
            downloadBtn.className = 'btn btn-secondary btn-small download-icon-btn';
            downloadBtn.textContent = '다운로드';
            downloadBtn.dataset.index = index;
            
            actionsDiv.appendChild(useBtn);
            actionsDiv.appendChild(downloadBtn);
            
            iconItem.appendChild(previewDiv);
            iconItem.appendChild(nameDiv);
            iconItem.appendChild(actionsDiv);
            
            svgIconsGrid.appendChild(iconItem);
        });

        // 더보기 버튼 생성 (초기 개수보다 많을 때만)
        if (presetIcons.length > initialCount) {
            const showMoreBtn = document.createElement('button');
            showMoreBtn.className = 'btn btn-primary show-more-icons-btn';
            showMoreBtn.textContent = '더보기';
            showMoreBtn.style.marginTop = '20px';
            showMoreBtn.style.width = '100%';
            showMoreBtn.style.maxWidth = '300px';
            showMoreBtn.style.marginLeft = 'auto';
            showMoreBtn.style.marginRight = 'auto';
            showMoreBtn.style.display = 'block';
            
            let isExpanded = false;
            showMoreBtn.addEventListener('click', () => {
                if (isExpanded) {
                    svgIconsGrid.querySelectorAll('.svg-icon-item-hidden').forEach(item => {
                        item.style.display = 'none';
                    });
                    showMoreBtn.textContent = '더보기';
                    isExpanded = false;
                } else {
                    svgIconsGrid.querySelectorAll('.svg-icon-item-hidden').forEach(item => {
                        item.style.display = 'flex';
                    });
                    showMoreBtn.textContent = '접기';
                    isExpanded = true;
                }
            });
            
            if (parentSection) {
                parentSection.appendChild(showMoreBtn);
            }
        }

        // 사용 버튼 이벤트
        svgIconsGrid.querySelectorAll('.use-icon-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const index = parseInt(btn.dataset.index);
                const icon = presetIcons[index];
                loadSVG(icon.svg);
                document.getElementById('editControls').scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        });

        // 다운로드 버튼 이벤트
        svgIconsGrid.querySelectorAll('.download-icon-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const index = parseInt(btn.dataset.index);
                const icon = presetIcons[index];
                downloadSVGFile(icon.svg, icon.name);
            });
        });
    }

    // SVG 파일 다운로드
    function downloadSVGFile(svgContent, filename = 'icon') {
        const blob = new Blob([svgContent], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}.svg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // SVG 로드
    function loadSVG(svgString) {
        try {
            // SVG 파싱
            const parser = new DOMParser();
            const svgDoc = parser.parseFromString(svgString, 'image/svg+xml');
            const svgElement = svgDoc.querySelector('svg');
            
            if (!svgElement) {
                alert('올바른 SVG 형식이 아닙니다.');
                return;
            }

            originalSvg = svgElement.cloneNode(true);
            originalSvgContent = svgString;

            // 원본 크기 및 viewBox 가져오기
            const viewBox = svgElement.getAttribute('viewBox');
            const width = svgElement.getAttribute('width');
            const height = svgElement.getAttribute('height');

            // viewBox 저장
            originalViewBox = viewBox || null;

            if (viewBox) {
                const values = viewBox.split(' ');
                if (values.length >= 4) {
                    originalWidth = parseFloat(values[2]) || 200;
                    originalHeight = parseFloat(values[3]) || 200;
                }
            } else if (width && height) {
                originalWidth = parseFloat(width) || 200;
                originalHeight = parseFloat(height) || 200;
            } else {
                // width/height와 viewBox가 모두 없으면 기본값 사용
                originalWidth = 200;
                originalHeight = 200;
            }

            originalAspectRatio = originalHeight / originalWidth;

            // 입력 필드 업데이트
            svgWidth.value = Math.round(originalWidth);
            svgHeight.value = Math.round(originalHeight);
            svgCodeInput.value = new XMLSerializer().serializeToString(svgElement);

            // 편집 컨트롤 및 미리보기 표시
            editControls.style.display = 'block';
            previewSection.style.display = 'block';
            downloadSection.style.display = 'block';
            svgCodeSection.style.display = 'block';

            // SVG 업데이트
            updateSVG();
        } catch (error) {
            console.error('SVG 로드 오류:', error);
            alert('SVG를 로드하는 중 오류가 발생했습니다.');
        }
    }

    // SVG 업데이트
    function updateSVG() {
        if (!originalSvg) return;

        const svg = originalSvg.cloneNode(true);
        const color = svgColor.value;
        const width = parseFloat(svgWidth.value) || 200;
        const height = parseFloat(svgHeight.value) || 200;
        const rotation = parseFloat(svgRotation.value) || 0;

        // 크기 설정 - width/height만 변경하고 viewBox는 원본 유지
        svg.setAttribute('width', width);
        svg.setAttribute('height', height);
        // viewBox는 원본을 유지
        if (originalViewBox) {
            svg.setAttribute('viewBox', originalViewBox);
        } else if (!svg.getAttribute('viewBox')) {
            // viewBox가 원래 없었으면 새로 생성하지 않음
            svg.removeAttribute('viewBox');
        }

        // 색상 변경
        const allElements = svg.querySelectorAll('*');
        allElements.forEach(element => {
            if (element.hasAttribute('fill') && element.getAttribute('fill') !== 'none') {
                element.setAttribute('fill', color);
            }
            if (element.hasAttribute('stroke') && element.getAttribute('stroke') !== 'none') {
                element.setAttribute('stroke', color);
            }
        });
        // SVG 자체의 fill/stroke도 변경
        if (svg.hasAttribute('fill') && svg.getAttribute('fill') !== 'none') {
            svg.setAttribute('fill', color);
        }
        if (svg.hasAttribute('stroke') && svg.getAttribute('stroke') !== 'none') {
            svg.setAttribute('stroke', color);
        }

        // 회전 적용
        if (rotation !== 0) {
            svg.setAttribute('transform', `rotate(${rotation} ${width / 2} ${height / 2})`);
        } else {
            svg.removeAttribute('transform');
        }

        // 미리보기 업데이트
        previewSvgWrapper.innerHTML = '';
        previewSvgWrapper.appendChild(svg);

        // 출력 SVG 업데이트
        const serializer = new XMLSerializer();
        svgOutput.textContent = serializer.serializeToString(svg);
    }

    // 이벤트 리스너

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
        if (file && file.type === 'image/svg+xml') {
            const reader = new FileReader();
            reader.onload = (e) => {
                loadSVG(e.target.result);
            };
            reader.readAsText(file);
        } else {
            alert('SVG 파일만 업로드할 수 있습니다.');
        }
    });

    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                loadSVG(e.target.result);
            };
            reader.readAsText(file);
        }
    });

    // SVG 코드 붙여넣기
    pasteSVGBtn.addEventListener('click', () => {
        svgCodeSection.style.display = 'block';
        svgCodeInput.focus();
    });

    // SVG 코드 적용
    applySVGBtn.addEventListener('click', () => {
        const svgCode = svgCodeInput.value.trim();
        if (svgCode) {
            loadSVG(svgCode);
        } else {
            alert('SVG 코드를 입력하세요.');
        }
    });

    // 색상 변경
    svgColor.addEventListener('input', () => {
        svgColorHex.value = svgColor.value;
        updateSVG();
    });

    svgColorHex.addEventListener('input', () => {
        const hex = svgColorHex.value;
        if (/^#[0-9A-Fa-f]{6}$/.test(hex)) {
            svgColor.value = hex;
            updateSVG();
        }
    });

    resetColorBtn.addEventListener('click', () => {
        svgColor.value = '#667eea';
        svgColorHex.value = '#667eea';
        updateSVG();
    });

    // 크기 변경
    svgWidth.addEventListener('input', () => {
        if (keepAspectRatio.checked) {
            const newWidth = parseFloat(svgWidth.value) || 200;
            svgHeight.value = Math.round(newWidth * originalAspectRatio);
        }
        updateSVG();
    });

    svgHeight.addEventListener('input', () => {
        if (keepAspectRatio.checked) {
            const newHeight = parseFloat(svgHeight.value) || 200;
            svgWidth.value = Math.round(newHeight / originalAspectRatio);
        }
        updateSVG();
    });

    // 회전 변경
    svgRotation.addEventListener('input', () => {
        svgRotationValue.textContent = `${svgRotation.value}°`;
        updateSVG();
    });

    // 비율 유지
    keepAspectRatio.addEventListener('change', () => {
        if (keepAspectRatio.checked) {
            const newWidth = parseFloat(svgWidth.value) || 200;
            svgHeight.value = Math.round(newWidth * originalAspectRatio);
            updateSVG();
        }
    });

    // SVG 다운로드
    downloadSVGBtn.addEventListener('click', () => {
        const svgContent = svgOutput.textContent;
        downloadSVGFile(svgContent, 'customized-icon');
    });

    // 초기화 - 프리셋 아이콘 생성
    createPresetIcons();
}

// DOM 로드 완료 시 초기화
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

