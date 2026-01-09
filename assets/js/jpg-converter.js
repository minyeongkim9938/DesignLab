// 이미지 변환기 기능

// 전역 변수
let files = [];
let convertedFiles = [];
let outputFormat = 'jpg'; // 기본 출력 포맷

// DOM 요소 변수 선언
let uploadArea, fileInput, filesSection, filesList, fileCount;
let outputFormatSelect, qualitySlider, qualityValue, qualityControl;
let convertAllBtn, downloadAllBtn, clearAllBtn;

// 초기화 함수
function init() {
    // DOM 요소 가져오기
    uploadArea = document.getElementById('uploadArea');
    fileInput = document.getElementById('fileInput');
    filesSection = document.getElementById('filesSection');
    filesList = document.getElementById('filesList');
    fileCount = document.getElementById('fileCount');
    outputFormatSelect = document.getElementById('outputFormat');
    qualitySlider = document.getElementById('qualitySlider');
    qualityValue = document.getElementById('qualityValue');
    qualityControl = document.getElementById('qualityControl');
    convertAllBtn = document.getElementById('convertAllBtn');
    downloadAllBtn = document.getElementById('downloadAllBtn');
    clearAllBtn = document.getElementById('clearAllBtn');

    // DOM 요소 존재 확인
    if (!uploadArea || !fileInput || !filesSection || !filesList || !fileCount ||
        !outputFormatSelect || !qualitySlider || !qualityValue || !qualityControl ||
        !convertAllBtn || !downloadAllBtn || !clearAllBtn) {
        console.error('필수 DOM 요소를 찾을 수 없습니다.');
        return;
    }

    // 파일 업로드 이벤트
    fileInput.addEventListener('change', handleFileSelect);
    uploadArea.addEventListener('click', () => fileInput.click());

    // 드래그 앤 드롭
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('drag-over');
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('drag-over');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('drag-over');
        const droppedFiles = Array.from(e.dataTransfer.files);
        handleFiles(droppedFiles);
    });

    // 모두 변환 버튼
    convertAllBtn.addEventListener('click', convertAll);

    // 모두 다운로드 버튼
    downloadAllBtn.addEventListener('click', downloadAll);

    // 전체 삭제 버튼
    clearAllBtn.addEventListener('click', clearAll);

    // 출력 포맷 변경
    outputFormatSelect.addEventListener('change', handleFormatChange);

    // 품질 슬라이더
    qualitySlider.addEventListener('input', handleQualityChange);

    // 초기 품질 설정 표시
    if (outputFormat === 'jpg' || outputFormat === 'webp') {
        qualityControl.style.display = 'block';
    } else {
        qualityControl.style.display = 'none';
    }
}

// 파일 선택 처리
function handleFileSelect(e) {
    const selectedFiles = Array.from(e.target.files);
    handleFiles(selectedFiles);
}

// 이미지 파일인지 확인하는 함수
function isImageFile(file) {
    // MIME 타입으로 확인
    if (file.type && file.type.startsWith('image/')) {
        return true;
    }
    
    // 파일 확장자로 확인 (MIME 타입이 없는 경우 대비)
    const fileName = file.name.toLowerCase();
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.bmp', '.svg', '.ico', '.tiff', '.tif', '.heic', '.heif', '.avif'];
    return imageExtensions.some(ext => fileName.endsWith(ext));
}

// 파일의 포맷 감지
function getFileFormat(file) {
    // MIME 타입으로 확인
    if (file.type) {
        const type = file.type.toLowerCase();
        if (type.includes('jpeg') || type.includes('jpg')) return 'jpg';
        if (type.includes('png')) return 'png';
        if (type.includes('webp')) return 'webp';
        if (type.includes('gif')) return 'gif';
        if (type.includes('bmp')) return 'bmp';
    }
    
    // 파일 확장자로 확인
    const fileName = file.name.toLowerCase();
    if (fileName.endsWith('.jpg') || fileName.endsWith('.jpeg')) return 'jpg';
    if (fileName.endsWith('.png')) return 'png';
    if (fileName.endsWith('.webp')) return 'webp';
    if (fileName.endsWith('.gif')) return 'gif';
    if (fileName.endsWith('.bmp')) return 'bmp';
    
    return null;
}

// 자동으로 다른 출력 포맷 선택
function autoSelectOutputFormat(fileFormat) {
    const formats = ['jpg', 'png', 'webp', 'gif', 'bmp'];
    
    // 현재 파일 포맷과 다른 포맷 선택
    for (const format of formats) {
        if (format !== fileFormat) {
            outputFormat = format;
            if (outputFormatSelect) {
                outputFormatSelect.value = format;
            }
            
            // 품질 설정 표시/숨김 업데이트
            if (qualityControl) {
                if (format === 'jpg' || format === 'webp') {
                    qualityControl.style.display = 'block';
                } else {
                    qualityControl.style.display = 'none';
                }
            }
            return;
        }
    }
}

// 파일 처리
function handleFiles(newFiles) {
    const imageFiles = newFiles.filter(file => isImageFile(file));
    
    if (imageFiles.length === 0) {
        alert('이미지 파일만 업로드 가능합니다.');
        return;
    }

    // 첫 번째 파일의 포맷 확인
    const firstFileFormat = getFileFormat(imageFiles[0]);
    
    // 현재 출력 포맷과 같으면 자동으로 다른 포맷 선택
    if (firstFileFormat && firstFileFormat === outputFormat) {
        autoSelectOutputFormat(firstFileFormat);
    }

    // 파일 추가 (모든 이미지 파일 추가)
    imageFiles.forEach(file => {
        // 같은 파일인지 확인 (이름과 크기로 비교)
        if (!files.find(f => f.file.name === file.name && f.file.size === file.size)) {
            files.push({
                id: Date.now() + Math.random(),
                file: file,
                status: 'pending',
                convertedBlob: null,
                preview: null
            });
        }
    });

    updateFileList();
}

// 파일 목록 업데이트
function updateFileList() {
    if (!filesSection || !filesList || !fileCount) return;
    
    if (files.length === 0) {
        filesSection.style.display = 'none';
        return;
    }

    filesSection.style.display = 'block';
    fileCount.textContent = files.length;
    filesList.innerHTML = '';

    files.forEach(fileData => {
        const fileItem = createFileItem(fileData);
        filesList.appendChild(fileItem);
    });

    updateBatchButtons();
}

// 파일 아이템 생성
function createFileItem(fileData) {
    const item = document.createElement('div');
    item.className = `file-item ${fileData.status}`;
    item.id = `file-${fileData.id}`;

    const fileSize = (fileData.file.size / 1024).toFixed(2);
    // 파일 타입 가져오기 (file.type이 없으면 확장자 사용)
    let fileType = 'IMAGE';
    if (fileData.file.type) {
        const parts = fileData.file.type.split('/');
        if (parts.length > 1) {
            fileType = parts[1].toUpperCase();
        }
    } else {
        // 파일 확장자에서 타입 추출
        const fileName = fileData.file.name.toLowerCase();
        const extension = fileName.substring(fileName.lastIndexOf('.') + 1);
        fileType = extension.toUpperCase();
    }

    // 미리보기 이미지 소스 - 이미 로드된 경우 사용, 아니면 플레이스홀더
    const previewSrc = fileData.preview || 'data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'80\' height=\'80\'%3E%3Crect fill=\'%23f8f9fa\' width=\'80\' height=\'80\'/%3E%3Ctext x=\'50%25\' y=\'50%25\' text-anchor=\'middle\' dy=\'.3em\' fill=\'%23999\' font-size=\'12\'%3E로딩중%3C/text%3E%3C/svg%3E';

    item.innerHTML = `
        <img src="${previewSrc}" alt="미리보기" class="file-preview" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'80\' height=\'80\'%3E%3Crect fill=\'%23f8f9fa\' width=\'80\' height=\'80\'/%3E%3Ctext x=\'50%25\' y=\'50%25\' text-anchor=\'middle\' dy=\'.3em\' fill=\'%23999\' font-size=\'12\'%3E${fileType}%3C/text%3E%3C/svg%3E'">
        <div class="file-info">
            <div class="file-name" title="${fileData.file.name}">${escapeHtml(fileData.file.name)}</div>
            <div class="file-details">
                <span class="file-type">${fileType}</span>
                <span class="file-size">${fileSize} KB</span>
            </div>
        </div>
        <div class="file-status">
            <span class="status-badge ${fileData.status}">${getStatusText(fileData.status)}</span>
            <div class="progress-bar ${fileData.status === 'converting' ? 'active' : ''}">
                <div class="progress-fill"></div>
            </div>
        </div>
        <div class="file-actions">
            ${fileData.status === 'success' 
                ? `<button class="btn btn-primary btn-icon" onclick="downloadFile('${fileData.id}')">다운로드</button>
                   <button class="btn btn-secondary btn-icon" onclick="removeFile('${fileData.id}')">삭제</button>`
                : fileData.status === 'pending'
                ? `<button class="btn btn-primary btn-icon" onclick="convertFile('${fileData.id}')">변환</button>
                   <button class="btn btn-secondary btn-icon" onclick="removeFile('${fileData.id}')">삭제</button>`
                : `<button class="btn btn-secondary btn-icon" onclick="removeFile('${fileData.id}')">삭제</button>`
            }
        </div>
    `;

    // 미리보기가 없으면 비동기로 로드
    if (!fileData.preview) {
        const reader = new FileReader();
        reader.onload = (e) => {
            fileData.preview = e.target.result;
            const img = item.querySelector('.file-preview');
            if (img) img.src = e.target.result;
        };
        reader.readAsDataURL(fileData.file);
    }

    return item;
}

// HTML 이스케이프 헬퍼 함수
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// 상태 텍스트
function getStatusText(status) {
    const statusMap = {
        'pending': '대기중',
        'converting': '변환중...',
        'success': '완료',
        'error': '오류'
    };
    return statusMap[status] || status;
}

// 파일 변환
function convertFile(fileId) {
    const fileData = files.find(f => f.id === fileId);
    if (!fileData || fileData.status !== 'pending') return;

    fileData.status = 'converting';
    updateFileItem(fileData);

    const img = new Image();

    img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        
        // 투명 배경 처리 (PNG만 지원)
        if (outputFormat === 'png') {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        } else {
            // JPG, WEBP는 흰색 배경
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
        }
        
        ctx.drawImage(img, 0, 0);

        // 포맷에 따른 MIME 타입 설정
        // 참고: 브라우저는 BMP와 GIF를 직접 지원하지 않으므로 PNG로 변환
        let mimeType = 'image/png';
        let actualFormat = outputFormat;
        
        if (outputFormat === 'jpg' || outputFormat === 'jpeg') {
            mimeType = 'image/jpeg';
            actualFormat = 'jpg';
        } else if (outputFormat === 'webp') {
            mimeType = 'image/webp';
        } else if (outputFormat === 'png') {
            mimeType = 'image/png';
        } else if (outputFormat === 'bmp' || outputFormat === 'gif') {
            // BMP와 GIF는 브라우저에서 직접 지원하지 않으므로 PNG로 변환
            mimeType = 'image/png';
            actualFormat = 'png';
        }
        
        const quality = (actualFormat === 'jpg' || actualFormat === 'webp') ? qualitySlider.value / 100 : undefined;

        canvas.toBlob((blob) => {
            if (blob) {
                fileData.convertedBlob = blob;
                fileData.status = 'success';
                fileData.actualFormat = actualFormat; // 실제 변환된 포맷 저장
                convertedFiles.push(fileData);
            } else {
                fileData.status = 'error';
            }
            updateFileItem(fileData);
            updateBatchButtons();
        }, mimeType, quality);
    };

    img.onerror = () => {
        fileData.status = 'error';
        updateFileItem(fileData);
        updateBatchButtons();
    };

    const reader = new FileReader();
    reader.onload = (e) => {
        img.src = e.target.result;
    };
    reader.readAsDataURL(fileData.file);
}

// 파일 아이템 업데이트
function updateFileItem(fileData) {
    const item = document.getElementById(`file-${fileData.id}`);
    if (!item) return;

    item.className = `file-item ${fileData.status}`;
    
    // 상태 배지와 진행 바, 액션 버튼만 업데이트 (미리보기는 다시 로드하지 않음)
    const statusBadge = item.querySelector('.status-badge');
    const progressBar = item.querySelector('.progress-bar');
    const fileActions = item.querySelector('.file-actions');
    
    if (statusBadge) {
        statusBadge.className = `status-badge ${fileData.status}`;
        statusBadge.textContent = getStatusText(fileData.status);
    }
    
    if (progressBar) {
        progressBar.className = `progress-bar ${fileData.status === 'converting' ? 'active' : ''}`;
    }
    
    if (fileActions) {
        fileActions.innerHTML = fileData.status === 'success' 
            ? `<button class="btn btn-primary btn-icon" onclick="downloadFile('${fileData.id}')">다운로드</button>
               <button class="btn btn-secondary btn-icon" onclick="removeFile('${fileData.id}')">삭제</button>`
            : fileData.status === 'pending'
            ? `<button class="btn btn-primary btn-icon" onclick="convertFile('${fileData.id}')">변환</button>
               <button class="btn btn-secondary btn-icon" onclick="removeFile('${fileData.id}')">삭제</button>`
            : `<button class="btn btn-secondary btn-icon" onclick="removeFile('${fileData.id}')">삭제</button>`;
    }
}

// 파일 다운로드
function downloadFile(fileId) {
    const fileData = files.find(f => f.id === fileId);
    if (!fileData || !fileData.convertedBlob) return;

    const url = URL.createObjectURL(fileData.convertedBlob);
    const link = document.createElement('a');
    link.href = url;
    
    // 파일명에서 확장자 제거 후 새 확장자 추가
    const fileName = fileData.file.name.replace(/\.[^/.]+$/, '');
    // 실제 변환된 포맷 사용 (BMP/GIF는 PNG로 변환되므로)
    const downloadFormat = fileData.actualFormat || outputFormat;
    link.download = fileName + '.' + downloadFormat;
    link.click();
    URL.revokeObjectURL(url);
}

// 파일 삭제
function removeFile(fileId) {
    files = files.filter(f => f.id !== fileId);
    convertedFiles = convertedFiles.filter(f => f.id !== fileId);
    updateFileList();
}

// 모두 변환
function convertAll() {
    const pendingFiles = files.filter(f => f.status === 'pending');
    if (pendingFiles.length === 0) {
        alert('변환할 파일이 없습니다.');
        return;
    }

    pendingFiles.forEach(fileData => {
        convertFile(fileData.id);
    });
}

// 모두 다운로드
function downloadAll() {
    const successFiles = files.filter(f => f.status === 'success');
    if (successFiles.length === 0) {
        alert('다운로드할 파일이 없습니다.');
        return;
    }

    successFiles.forEach((fileData, index) => {
        setTimeout(() => {
            downloadFile(fileData.id);
        }, index * 200); // 순차적으로 다운로드
    });
}

// 전체 삭제
function clearAll() {
    if (files.length === 0) return;
    
    if (confirm('모든 파일을 삭제하시겠습니까?')) {
        files = [];
        convertedFiles = [];
        updateFileList();
    }
}

// 출력 포맷 변경
function handleFormatChange(e) {
    outputFormat = e.target.value;
    
    // BMP/GIF는 PNG로 변환됨을 알림
    if (outputFormat === 'bmp' || outputFormat === 'gif') {
        const formatName = outputFormat.toUpperCase();
        alert(`${formatName} 포맷은 브라우저에서 직접 지원되지 않아 PNG 포맷으로 변환됩니다.`);
    }
    
    // 품질 설정 표시/숨김 (JPG, WEBP만 품질 조절 가능)
    if (outputFormat === 'jpg' || outputFormat === 'webp') {
        qualityControl.style.display = 'block';
    } else {
        qualityControl.style.display = 'none';
    }
    
    // 기존 파일 목록 초기화 (새 포맷으로 변환해야 하므로)
    if (files.length > 0) {
        if (confirm('출력 포맷이 변경되었습니다. 기존 파일 목록을 초기화하시겠습니까?')) {
            files = [];
            convertedFiles = [];
            updateFileList();
        }
    }
}

// 품질 슬라이더 변경
function handleQualityChange(e) {
    qualityValue.textContent = e.target.value;
}

// 배치 버튼 업데이트
function updateBatchButtons() {
    if (!convertAllBtn || !downloadAllBtn) return;
    
    const pendingCount = files.filter(f => f.status === 'pending').length;
    const successCount = files.filter(f => f.status === 'success').length;

    convertAllBtn.textContent = pendingCount > 0 
        ? `모두 변환 (${pendingCount}개)` 
        : '모두 변환';
    convertAllBtn.disabled = pendingCount === 0;

    downloadAllBtn.style.display = successCount > 0 ? 'block' : 'none';
    downloadAllBtn.textContent = successCount > 0 
        ? `모두 다운로드 (${successCount}개)` 
        : '모두 다운로드';
}

// 전역 함수로 내보내기
window.convertFile = convertFile;
window.downloadFile = downloadFile;
window.removeFile = removeFile;

// DOM 로드 완료 시 초기화
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

