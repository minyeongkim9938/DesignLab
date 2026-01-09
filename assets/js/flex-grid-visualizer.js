// Flex/Grid 시각화 도구 기능

let currentLayoutType = 'flexbox';
let itemCount = 6;

// DOM 요소
let layoutTypeButtons, visualizerBox, cssCodeSection, cssCode;
let flexControls, gridControls;
let flexDirection, justifyContent, alignItems, flexWrap, flexGap;
let gridColumns, gridRows, gridJustifyItems, gridAlignItems, gridGap;
let itemCountInput, updateItemsBtn, copyCodeBtn;

// 초기화 함수
function init() {
    // DOM 요소 가져오기
    layoutTypeButtons = document.querySelectorAll('.layout-type-btn');
    visualizerBox = document.getElementById('visualizerBox');
    cssCodeSection = document.getElementById('cssCodeSection');
    cssCode = document.getElementById('cssCode');
    flexControls = document.getElementById('flexControls');
    gridControls = document.getElementById('gridControls');
    
    flexDirection = document.getElementById('flexDirection');
    justifyContent = document.getElementById('justifyContent');
    alignItems = document.getElementById('alignItems');
    flexWrap = document.getElementById('flexWrap');
    flexGap = document.getElementById('flexGap');
    
    gridColumns = document.getElementById('gridColumns');
    gridRows = document.getElementById('gridRows');
    gridJustifyItems = document.getElementById('gridJustifyItems');
    gridAlignItems = document.getElementById('gridAlignItems');
    gridGap = document.getElementById('gridGap');
    
    itemCountInput = document.getElementById('itemCount');
    updateItemsBtn = document.getElementById('updateItemsBtn');
    copyCodeBtn = document.getElementById('copyCodeBtn');

    // DOM 요소 존재 확인
    if (!visualizerBox || !cssCode) {
        console.error('필수 DOM 요소를 찾을 수 없습니다.');
        return;
    }

    // 레이아웃 타입 버튼
    layoutTypeButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            layoutTypeButtons.forEach(b => {
                b.classList.remove('active');
                if (b.classList.contains('btn-primary')) {
                    b.classList.remove('btn-primary');
                    b.classList.add('btn-secondary');
                } else {
                    b.classList.remove('btn-secondary');
                    b.classList.add('btn-primary');
                }
            });
            btn.classList.add('active');
            btn.classList.remove('btn-secondary');
            btn.classList.add('btn-primary');
            currentLayoutType = btn.dataset.type;
            switchLayoutType(currentLayoutType);
        });
    });

    // Flexbox 컨트롤 이벤트
    if (flexDirection) flexDirection.addEventListener('change', updateVisualization);
    if (justifyContent) justifyContent.addEventListener('change', updateVisualization);
    if (alignItems) alignItems.addEventListener('change', updateVisualization);
    if (flexWrap) flexWrap.addEventListener('change', updateVisualization);
    if (flexGap) flexGap.addEventListener('input', updateVisualization);

    // Grid 컨트롤 이벤트
    if (gridColumns) gridColumns.addEventListener('input', updateVisualization);
    if (gridRows) gridRows.addEventListener('input', updateVisualization);
    if (gridJustifyItems) gridJustifyItems.addEventListener('change', updateVisualization);
    if (gridAlignItems) gridAlignItems.addEventListener('change', updateVisualization);
    if (gridGap) gridGap.addEventListener('input', updateVisualization);

    // 아이템 업데이트 버튼 (Flexbox)
    if (updateItemsBtn) {
        updateItemsBtn.addEventListener('click', () => {
            itemCount = parseInt(itemCountInput.value) || 6;
            if (itemCount < 1) itemCount = 1;
            if (itemCount > 20) itemCount = 20;
            itemCountInput.value = itemCount;
            createItems();
            updateVisualization();
        });
    }

    // 아이템 업데이트 버튼 (Grid)
    const updateItemsBtnGrid = document.getElementById('updateItemsBtnGrid');
    if (updateItemsBtnGrid) {
        updateItemsBtnGrid.addEventListener('click', () => {
            const itemCountGridInput = document.getElementById('itemCountGrid');
            if (itemCountGridInput) {
                itemCount = parseInt(itemCountGridInput.value) || 6;
                if (itemCount < 1) itemCount = 1;
                if (itemCount > 20) itemCount = 20;
                itemCountGridInput.value = itemCount;
                if (itemCountInput) itemCountInput.value = itemCount; // 동기화
                createItems();
                updateVisualization();
            }
        });
    }

    // CSS 코드 복사 버튼
    if (copyCodeBtn) {
        copyCodeBtn.addEventListener('click', copyCSSCode);
    }

    // 초기화
    createItems();
    updateVisualization();
}

// 레이아웃 타입 전환
function switchLayoutType(type) {
    const gridUpdateSection = document.getElementById('gridUpdateSection');
    const flexUpdateSection = document.getElementById('flexUpdateSection');
    
    if (type === 'flexbox') {
        if (flexControls) flexControls.style.display = 'block';
        if (gridControls) gridControls.style.display = 'none';
        if (gridUpdateSection) gridUpdateSection.style.display = 'none';
        if (flexUpdateSection) flexUpdateSection.style.display = 'block';
        visualizerBox.className = 'visualizer-box flex-container';
    } else {
        if (flexControls) flexControls.style.display = 'none';
        if (gridControls) gridControls.style.display = 'block';
        if (gridUpdateSection) gridUpdateSection.style.display = 'block';
        if (flexUpdateSection) flexUpdateSection.style.display = 'none';
        visualizerBox.className = 'visualizer-box grid-container';
        // Grid 아이템 개수 동기화
        const itemCountGridInput = document.getElementById('itemCountGrid');
        if (itemCountGridInput) {
            itemCountGridInput.value = itemCount;
        }
    }
    createItems();
    updateVisualization();
}

// 아이템 생성
function createItems() {
    visualizerBox.innerHTML = '';
    for (let i = 0; i < itemCount; i++) {
        const item = document.createElement('div');
        item.className = 'visualizer-item';
        item.textContent = i + 1;
        visualizerBox.appendChild(item);
    }
}

// 시각화 업데이트
function updateVisualization() {
    if (currentLayoutType === 'flexbox') {
        updateFlexboxVisualization();
    } else {
        updateGridVisualization();
    }
    updateCSSCode();
}

// Flexbox 시각화 업데이트
function updateFlexboxVisualization() {
    if (!visualizerBox) return;

    const direction = flexDirection ? flexDirection.value : 'row';
    const justify = justifyContent ? justifyContent.value : 'center';
    const align = alignItems ? alignItems.value : 'center';
    const wrap = flexWrap ? flexWrap.value : 'nowrap';
    const gap = flexGap ? flexGap.value + 'px' : '10px';

    visualizerBox.style.display = 'flex';
    visualizerBox.style.flexDirection = direction;
    visualizerBox.style.justifyContent = justify;
    visualizerBox.style.alignItems = align;
    visualizerBox.style.flexWrap = wrap;
    visualizerBox.style.gap = gap;
}

// Grid 시각화 업데이트
function updateGridVisualization() {
    if (!visualizerBox) return;

    const columns = gridColumns ? gridColumns.value : '1fr 1fr 1fr';
    const rows = gridRows ? gridRows.value : '1fr 1fr';
    const justifyItems = gridJustifyItems ? gridJustifyItems.value : 'center';
    const alignItems = gridAlignItems ? gridAlignItems.value : 'center';
    const gap = gridGap ? gridGap.value + 'px' : '10px';

    visualizerBox.style.display = 'grid';
    visualizerBox.style.gridTemplateColumns = columns;
    visualizerBox.style.gridTemplateRows = rows;
    visualizerBox.style.justifyItems = justifyItems;
    visualizerBox.style.alignItems = alignItems;
    visualizerBox.style.gap = gap;
}

// CSS 코드 업데이트
function updateCSSCode() {
    if (!cssCode) return;

    let code = '';
    if (currentLayoutType === 'flexbox') {
        code = `.container {\n`;
        code += `  display: flex;\n`;
        code += `  flex-direction: ${flexDirection ? flexDirection.value : 'row'};\n`;
        code += `  justify-content: ${justifyContent ? justifyContent.value : 'center'};\n`;
        code += `  align-items: ${alignItems ? alignItems.value : 'center'};\n`;
        code += `  flex-wrap: ${flexWrap ? flexWrap.value : 'nowrap'};\n`;
        code += `  gap: ${flexGap ? flexGap.value : '10'}px;\n`;
        code += `}`;
    } else {
        code = `.container {\n`;
        code += `  display: grid;\n`;
        code += `  grid-template-columns: ${gridColumns ? gridColumns.value : '1fr 1fr 1fr'};\n`;
        code += `  grid-template-rows: ${gridRows ? gridRows.value : '1fr 1fr'};\n`;
        code += `  justify-items: ${gridJustifyItems ? gridJustifyItems.value : 'center'};\n`;
        code += `  align-items: ${gridAlignItems ? gridAlignItems.value : 'center'};\n`;
        code += `  gap: ${gridGap ? gridGap.value : '10'}px;\n`;
        code += `}`;
    }

    cssCode.textContent = code;
}

// CSS 코드 복사
function copyCSSCode() {
    const code = cssCode.textContent;
    navigator.clipboard.writeText(code).then(() => {
        // 피드백
        const toast = document.createElement('div');
        toast.className = 'copy-toast';
        toast.textContent = 'CSS 코드가 복사되었습니다!';
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                if (document.body.contains(toast)) {
                    document.body.removeChild(toast);
                }
            }, 300);
        }, 2000);
    }).catch(err => {
        console.error('복사 실패:', err);
        alert('CSS 코드 복사 실패');
    });
}

// DOM 로드 완료 시 초기화
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

