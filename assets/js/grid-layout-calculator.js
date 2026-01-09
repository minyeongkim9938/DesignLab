// 그리드/레이아웃 가이드 계산기

function init() {
    // DOM 요소 가져오기
    const containerWidthInput = document.getElementById('containerWidth');
    const columnCountInput = document.getElementById('columnCount');
    const gutterInput = document.getElementById('gutter');
    const marginInput = document.getElementById('margin');
    
    const columnWidthEl = document.getElementById('columnWidth');
    const availableWidthEl = document.getElementById('availableWidth');
    const totalGutterWidthEl = document.getElementById('totalGutterWidth');
    const totalMarginWidthEl = document.getElementById('totalMarginWidth');
    
    const guideList = document.getElementById('guideList');
    const gridVisualizer = document.getElementById('gridVisualizer');
    const cssCode = document.getElementById('cssCode');
    
    const copyGuideBtn = document.getElementById('copyGuideBtn');
    const copyCSSCodeBtn = document.getElementById('copyCSSCodeBtn');

    // 계산 함수
    function calculateGrid() {
        const containerWidth = parseFloat(containerWidthInput.value) || 0;
        const columnCount = parseInt(columnCountInput.value) || 0;
        const gutter = parseFloat(gutterInput.value) || 0;
        const margin = parseFloat(marginInput.value) || 0;

        // 유효성 검사
        if (containerWidth <= 0 || columnCount <= 0 || gutter < 0 || margin < 0) {
            return;
        }

        // 계산 (functions.min.js의 공식 참고: Math.floor((maxWidth-((columns-1)*gutter+2*margin))/columns))
        const totalMarginWidth = margin * 2;
        const availableWidth = containerWidth - totalMarginWidth;
        const totalGutterWidth = gutter * (columnCount - 1);
        const columnWidth = Math.floor((containerWidth - ((columnCount - 1) * gutter + 2 * margin)) / columnCount);

        // 실제 계산된 페이지 너비 (functions.min.js의 calculatePagewidth 공식)
        const calculatedPageWidth = columnWidth * columnCount + (columnCount - 1) * gutter + 2 * margin;
        const isSpotOn = calculatedPageWidth === containerWidth;

        // 결과 업데이트
        columnWidthEl.textContent = columnWidth.toFixed(2);
        availableWidthEl.textContent = availableWidth.toFixed(0);
        totalGutterWidthEl.textContent = totalGutterWidth.toFixed(0);
        totalMarginWidthEl.textContent = totalMarginWidth.toFixed(0);

        // 경고 메시지 표시/숨김
        const warningMessage = document.getElementById('warningMessage');
        const resultSection = document.getElementById('resultSection');
        
        if (!isSpotOn && containerWidth > 0 && columnCount > 0) {
            // 경고 메시지 생성 또는 업데이트
            let warning = document.getElementById('warningMessage');
            if (!warning) {
                warning = document.createElement('div');
                warning.id = 'warningMessage';
                warning.className = 'warning-message';
                resultSection.insertBefore(warning, resultSection.querySelector('.result-grid'));
            }
            const difference = containerWidth - calculatedPageWidth;
            warning.textContent = `⚠️ 경고: 계산된 너비(${calculatedPageWidth}px)가 컨테이너 너비(${containerWidth}px)와 일치하지 않습니다. 차이: ${difference}px`;
            warning.style.display = 'block';
            
            // 결과 값들을 빨간색으로 표시
            columnWidthEl.classList.add('warning');
            availableWidthEl.classList.add('warning');
            totalGutterWidthEl.classList.add('warning');
            totalMarginWidthEl.classList.add('warning');
        } else {
            // 경고 메시지 숨김
            const warning = document.getElementById('warningMessage');
            if (warning) {
                warning.style.display = 'none';
            }
            
            // 결과 값들의 빨간색 제거
            columnWidthEl.classList.remove('warning');
            availableWidthEl.classList.remove('warning');
            totalGutterWidthEl.classList.remove('warning');
            totalMarginWidthEl.classList.remove('warning');
        }

        // 가이드라인 생성
        generateGuides(margin, columnWidth, gutter, columnCount);
        
        // 시각화 업데이트
        updateVisualization(containerWidth, margin, columnWidth, gutter, columnCount);
        
        // CSS 코드 생성
        generateCSSCode(containerWidth, columnCount, columnWidth, gutter, margin);
    }

    // 가이드라인 생성
    function generateGuides(margin, columnWidth, gutter, columnCount) {
        guideList.innerHTML = '';
        
        const guides = [];
        let currentPosition = margin;
        
        guides.push({
            position: margin,
            label: '시작 (왼쪽 마진)'
        });
        
        for (let i = 0; i < columnCount; i++) {
            // 컬럼 시작 위치
            guides.push({
                position: currentPosition,
                label: `컬럼 ${i + 1} 시작`
            });
            
            currentPosition += columnWidth;
            
            // 컬럼 끝 위치
            guides.push({
                position: currentPosition,
                label: `컬럼 ${i + 1} 끝`
            });
            
            if (i < columnCount - 1) {
                currentPosition += gutter;
            }
        }
        
        guides.push({
            position: currentPosition,
            label: '끝 (오른쪽 마진)'
        });

        // 가이드라인 리스트 렌더링
        guides.forEach((guide, index) => {
            const guideItem = document.createElement('div');
            guideItem.className = 'guide-item';
            guideItem.innerHTML = `
                <span class="guide-position">${guide.position.toFixed(2)}px</span>
                <span class="guide-label">${guide.label}</span>
                <button class="btn-copy-guide" data-position="${guide.position.toFixed(2)}" title="복사">📋</button>
            `;
            guideList.appendChild(guideItem);
        });

        // 개별 복사 버튼 이벤트
        guideList.querySelectorAll('.btn-copy-guide').forEach(btn => {
            btn.addEventListener('click', () => {
                const position = btn.getAttribute('data-position');
                navigator.clipboard.writeText(position).then(() => {
                    showToast(`${position}px 복사됨`);
                });
            });
        });
    }

    // 시각화 업데이트
    function updateVisualization(containerWidth, margin, columnWidth, gutter, columnCount) {
        gridVisualizer.innerHTML = '';
        
        // 실제 사용 가능 너비 계산 (functions.min.js 방식)
        const availableWidth = containerWidth - (margin * 2);
        
        // 표시를 위한 스케일 계산 (최대 1200px)
        const maxDisplayWidth = 1200;
        const scale = containerWidth > maxDisplayWidth ? maxDisplayWidth / containerWidth : 1;
        
        // 스케일된 값들
        const displayWidth = containerWidth * scale;
        const displayMargin = margin * scale;
        const displayColumnWidth = columnWidth * scale;
        const displayGutter = gutter * scale;
        const displayAvailableWidth = availableWidth * scale;
        
        // 최상위 래퍼
        const wrapper = document.createElement('div');
        wrapper.className = 'grid-visualizer-wrapper';
        wrapper.style.width = '100%';
        wrapper.style.maxWidth = `${displayWidth}px`;
        wrapper.style.margin = '0 auto';
        wrapper.style.position = 'relative';
        
        // 컨테이너 레이블
        const label = document.createElement('div');
        label.className = 'visualizer-label-top';
        label.textContent = `컨테이너 너비: ${containerWidth}px${scale < 1 ? ` (${(scale * 100).toFixed(0)}% 크기)` : ''}`;
        wrapper.appendChild(label);
        
        // 전체 컨테이너 (마진 포함)
        const container = document.createElement('div');
        container.style.width = `${displayWidth}px`;
        container.style.height = '180px';
        container.style.border = '3px solid #333';
        container.style.borderRadius = '8px';
        container.style.background = '#fff';
        container.style.position = 'relative';
        container.style.overflow = 'hidden';
        container.style.display = 'flex';
        
        // 왼쪽 마진
        const leftMarginEl = document.createElement('div');
        leftMarginEl.className = 'visualizer-margin';
        leftMarginEl.style.width = `${displayMargin}px`;
        leftMarginEl.style.height = '100%';
        leftMarginEl.style.background = '#ffe0e0';
        leftMarginEl.style.borderRight = '2px dashed #ff6b6b';
        leftMarginEl.style.display = 'flex';
        leftMarginEl.style.alignItems = 'center';
        leftMarginEl.style.justifyContent = 'center';
        leftMarginEl.style.flexDirection = 'column';
        leftMarginEl.style.color = '#c92a2a';
        leftMarginEl.style.fontWeight = '600';
        leftMarginEl.style.fontSize = '0.85rem';
        leftMarginEl.style.flexShrink = '0';
        leftMarginEl.innerHTML = `<div style="text-align: center;">마진<br>${margin}px</div>`;
        container.appendChild(leftMarginEl);
        
        // 그리드 영역 (컬럼 + 간격)
        const gridArea = document.createElement('div');
        gridArea.className = 'grid-container-visual';
        gridArea.style.width = `${displayAvailableWidth}px`;
        gridArea.style.height = '100%';
        gridArea.style.background = '#f8f9fa';
        gridArea.style.display = 'grid';
        gridArea.style.flexShrink = '0';
        
        // 그리드 템플릿 생성: 컬럼1, 간격1, 컬럼2, 간격2, ..., 컬럼N
        const gridCols = [];
        for (let i = 0; i < columnCount; i++) {
            gridCols.push(`${displayColumnWidth}px`);
            if (i < columnCount - 1) {
                gridCols.push(`${displayGutter}px`);
            }
        }
        gridArea.style.gridTemplateColumns = gridCols.join(' ');
        
        // 컬럼 요소들 생성
        for (let i = 0; i < columnCount; i++) {
            const col = document.createElement('div');
            col.className = 'grid-column-visual';
            col.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            col.style.borderRadius = '6px';
            col.style.display = 'flex';
            col.style.alignItems = 'center';
            col.style.justifyContent = 'center';
            col.style.flexDirection = 'column';
            col.style.color = 'white';
            col.style.fontWeight = '600';
            col.style.fontSize = '0.9rem';
            col.style.minHeight = '150px';
            col.innerHTML = `
                <div style="font-size: 1.3rem; margin-bottom: 5px;">${i + 1}</div>
                <div style="font-size: 0.75rem; opacity: 0.95;">${Math.round(columnWidth)}px</div>
            `;
            col.title = `컬럼 ${i + 1}: ${columnWidth.toFixed(2)}px`;
            gridArea.appendChild(col);
            
            // 간격 요소 (마지막 제외)
            if (i < columnCount - 1) {
                const gap = document.createElement('div');
                gap.className = 'visualizer-gutter';
                gap.style.background = '#fff3cd';
                gap.style.border = '2px dashed #ffc107';
                gap.style.borderRadius = '4px';
                gap.style.display = 'flex';
                gap.style.alignItems = 'center';
                gap.style.justifyContent = 'center';
                gap.style.color = '#856404';
                gap.style.fontWeight = '600';
                gap.style.fontSize = '0.7rem';
                gap.style.minHeight = '150px';
                gap.innerHTML = `<div style="transform: rotate(-90deg); white-space: nowrap;">${gutter}px</div>`;
                gap.title = `간격: ${gutter}px`;
                gridArea.appendChild(gap);
            }
        }
        
        container.appendChild(gridArea);
        
        // 오른쪽 마진
        const rightMarginEl = document.createElement('div');
        rightMarginEl.className = 'visualizer-margin';
        rightMarginEl.style.width = `${displayMargin}px`;
        rightMarginEl.style.height = '100%';
        rightMarginEl.style.background = '#ffe0e0';
        rightMarginEl.style.borderLeft = '2px dashed #ff6b6b';
        rightMarginEl.style.display = 'flex';
        rightMarginEl.style.alignItems = 'center';
        rightMarginEl.style.justifyContent = 'center';
        rightMarginEl.style.flexDirection = 'column';
        rightMarginEl.style.color = '#c92a2a';
        rightMarginEl.style.fontWeight = '600';
        rightMarginEl.style.fontSize = '0.85rem';
        rightMarginEl.style.flexShrink = '0';
        rightMarginEl.innerHTML = `<div style="text-align: center;">마진<br>${margin}px</div>`;
        container.appendChild(rightMarginEl);
        
        wrapper.appendChild(container);
        gridVisualizer.appendChild(wrapper);
    }

    // CSS 코드 생성
    function generateCSSCode(containerWidth, columnCount, columnWidth, gutter, margin) {
        const css = `/* 그리드 시스템 CSS */
.container {
    max-width: ${containerWidth}px;
    margin: 0 auto;
    padding: 0 ${margin}px;
}

.grid {
    display: grid;
    grid-template-columns: repeat(${columnCount}, 1fr);
    gap: ${gutter}px;
}

/* 또는 각 컬럼 너비 명시 */
.grid-explicit {
    display: grid;
    grid-template-columns: repeat(${columnCount}, ${columnWidth.toFixed(2)}px);
    gap: ${gutter}px;
}

/* 컬럼 너비 유틸리티 클래스 */
.col-1 { grid-column: span 1; }
.col-2 { grid-column: span 2; }
.col-3 { grid-column: span 3; }
.col-4 { grid-column: span 4; }
.col-5 { grid-column: span 5; }
.col-6 { grid-column: span 6; }
.col-7 { grid-column: span 7; }
.col-8 { grid-column: span 8; }
.col-9 { grid-column: span 9; }
.col-10 { grid-column: span 10; }
.col-11 { grid-column: span 11; }
.col-12 { grid-column: span ${columnCount}; }

/* 피그마 값 참고 */
/* 컨테이너 너비: ${containerWidth}px */
/* 컬럼 수: ${columnCount} */
/* 컬럼 너비: ${columnWidth.toFixed(2)}px */
/* 간격 (Gutter): ${gutter}px */
/* 마진: ${margin}px (좌우 각각) */`;

        cssCode.textContent = css;
    }

    // 토스트 메시지 표시
    function showToast(message) {
        // 기존 토스트 제거
        const existingToast = document.querySelector('.copy-toast');
        if (existingToast) {
            existingToast.remove();
        }

        const toast = document.createElement('div');
        toast.className = 'copy-toast';
        toast.textContent = message;
        document.body.appendChild(toast);

        // 애니메이션을 위해 약간의 지연
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);

        // 3초 후 제거
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, 3000);
    }

    // 이벤트 리스너
    containerWidthInput.addEventListener('input', calculateGrid);
    columnCountInput.addEventListener('input', calculateGrid);
    gutterInput.addEventListener('input', calculateGrid);
    marginInput.addEventListener('input', calculateGrid);

    // 가이드라인 전체 복사
    copyGuideBtn.addEventListener('click', () => {
        const guideItems = guideList.querySelectorAll('.guide-item');
        const guides = Array.from(guideItems).map(item => {
            const position = item.querySelector('.guide-position').textContent;
            const label = item.querySelector('.guide-label').textContent;
            return `${label}: ${position}`;
        });
        
        navigator.clipboard.writeText(guides.join('\n')).then(() => {
            showToast('가이드라인이 복사되었습니다');
        });
    });

    // CSS 코드 복사
    copyCSSCodeBtn.addEventListener('click', () => {
        navigator.clipboard.writeText(cssCode.textContent).then(() => {
            showToast('CSS 코드가 복사되었습니다');
        });
    });

    // 초기 계산 실행
    calculateGrid();
}

// DOM 로드 완료 시 초기화
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

