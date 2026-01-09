// 전역 변수
let originalImage = null;
let currentImage = null;
let originalWidth = 0;
let originalHeight = 0;
let trueOriginalWidth = 0;  // 실제 원본 크기 (초기화용)
let trueOriginalHeight = 0; // 실제 원본 크기 (초기화용)
let originalImageDataUrl = null; // 원본 이미지 데이터 URL (초기화용)
let maintainRatio = true;
let isPercentMode = { width: false, height: false };
let rotationAngle = 0;
let isFlipped = false;
let isGrayscale = false;
let isPixelated = false;
let pixelateSize = 10;
let isCropMode = false;
let cropStartX = 0;
let cropStartY = 0;
let cropEndX = 0;
let cropEndY = 0;
let isCropping = false;
let cropSelection = null;

// DOM 요소 변수 선언
let uploadArea, fileInput, uploadSection, editSection, previewCanvas, ctx;
let widthInput, heightInput, maintainRatioCheckbox, qualitySlider, qualityValue;
let downloadBtn, resetBtn, originalSizeSpan, currentSizeSpan, fileSizeSpan;
let widthPercentBtn, heightPercentBtn, cropBtn, flipBtn, rotateBtn;
let pixelateBtn, grayscaleBtn, cropControls, cropApplyBtn, cropCancelBtn;
let pixelateControls, pixelateSlider, pixelateValue, previewWrapper, cropCanvas;

let lastChangedField = null; // 마지막으로 변경된 필드 추적

// 초기화 함수
function init() {
    // DOM 요소 가져오기
    uploadArea = document.getElementById('uploadArea');
    fileInput = document.getElementById('fileInput');
    uploadSection = document.getElementById('uploadSection');
    editSection = document.getElementById('editSection');
    previewCanvas = document.getElementById('previewCanvas');
    widthInput = document.getElementById('widthInput');
    heightInput = document.getElementById('heightInput');
    maintainRatioCheckbox = document.getElementById('maintainRatio');
    qualitySlider = document.getElementById('qualitySlider');
    qualityValue = document.getElementById('qualityValue');
    downloadBtn = document.getElementById('downloadBtn');
    resetBtn = document.getElementById('resetBtn');
    originalSizeSpan = document.getElementById('originalSize');
    currentSizeSpan = document.getElementById('currentSize');
    fileSizeSpan = document.getElementById('fileSize');
    widthPercentBtn = document.getElementById('widthPercentBtn');
    heightPercentBtn = document.getElementById('heightPercentBtn');
    cropBtn = document.getElementById('cropBtn');
    flipBtn = document.getElementById('flipBtn');
    rotateBtn = document.getElementById('rotateBtn');
    pixelateBtn = document.getElementById('pixelateBtn');
    grayscaleBtn = document.getElementById('grayscaleBtn');
    cropControls = document.getElementById('cropControls');
    cropApplyBtn = document.getElementById('cropApplyBtn');
    cropCancelBtn = document.getElementById('cropCancelBtn');
    pixelateControls = document.getElementById('pixelateControls');
    pixelateSlider = document.getElementById('pixelateSlider');
    pixelateValue = document.getElementById('pixelateValue');
    previewWrapper = document.getElementById('previewWrapper');
    cropCanvas = document.getElementById('cropCanvas');

    // 필수 DOM 요소 확인
    if (!previewCanvas) {
        console.error('previewCanvas 요소를 찾을 수 없습니다.');
        return;
    }
    ctx = previewCanvas.getContext('2d');

    if (!uploadArea || !fileInput || !uploadSection || !editSection) {
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
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    });

    // 입력 이벤트
    if (widthInput) {
        widthInput.addEventListener('input', () => {
            resizeImage('width');
        });
        widthInput.addEventListener('focus', () => {
            lastChangedField = 'width';
        });
    }

    if (heightInput) {
        heightInput.addEventListener('input', () => {
            resizeImage('height');
        });
        heightInput.addEventListener('focus', () => {
            lastChangedField = 'height';
        });
    }

    if (maintainRatioCheckbox) {
        maintainRatioCheckbox.addEventListener('change', (e) => {
            maintainRatio = e.target.checked;
        });
    }

    // 퍼센트 모드 토글
    if (widthPercentBtn) {
        widthPercentBtn.addEventListener('click', () => {
            isPercentMode.width = !isPercentMode.width;
            widthPercentBtn.textContent = isPercentMode.width ? 'px' : '%';
            widthPercentBtn.style.background = isPercentMode.width ? '#764ba2' : '#667eea';
            if (widthInput && widthInput.value) {
                if (isPercentMode.width) {
                    widthInput.value = Math.round((parseInt(widthInput.value) / originalWidth) * 100);
                } else {
                    widthInput.value = Math.round(originalWidth * (parseFloat(widthInput.value) / 100));
                }
                resizeImage();
            }
        });
    }

    if (heightPercentBtn) {
        heightPercentBtn.addEventListener('click', () => {
            isPercentMode.height = !isPercentMode.height;
            heightPercentBtn.textContent = isPercentMode.height ? 'px' : '%';
            heightPercentBtn.style.background = isPercentMode.height ? '#764ba2' : '#667eea';
            if (heightInput && heightInput.value) {
                if (isPercentMode.height) {
                    heightInput.value = Math.round((parseInt(heightInput.value) / originalHeight) * 100);
                } else {
                    heightInput.value = Math.round(originalHeight * (parseFloat(heightInput.value) / 100));
                }
                resizeImage();
            }
        });
    }

    // 품질 슬라이더
    if (qualitySlider && qualityValue) {
        qualitySlider.addEventListener('input', (e) => {
            qualityValue.textContent = e.target.value;
        });
    }

    // 프리셋 버튼
    document.querySelectorAll('.btn-preset').forEach(btn => {
        btn.addEventListener('click', () => {
            let width = parseInt(btn.dataset.width);
            let height = parseInt(btn.dataset.height);
            
            // 비율 유지가 켜져 있으면 원본 비율에 맞게 조절
            if (maintainRatio && originalImage) {
                const aspectRatio = originalWidth / originalHeight;
                const presetAspectRatio = width / height;
                
                // 프리셋 비율과 원본 비율이 다르면 원본 비율에 맞게 조절
                if (Math.abs(aspectRatio - presetAspectRatio) > 0.01) {
                    // 프리셋의 더 긴 쪽을 기준으로 비율에 맞게 조절
                    if (width >= height) {
                        height = Math.round(width / aspectRatio);
                    } else {
                        width = Math.round(height * aspectRatio);
                    }
                }
            }
            
            if (widthInput) widthInput.value = width;
            if (heightInput) heightInput.value = height;
            isPercentMode.width = false;
            isPercentMode.height = false;
            if (widthPercentBtn) {
                widthPercentBtn.textContent = '%';
                widthPercentBtn.style.background = '#667eea';
            }
            if (heightPercentBtn) {
                heightPercentBtn.textContent = '%';
                heightPercentBtn.style.background = '#667eea';
            }
            lastChangedField = null; // 프리셋은 둘 다 설정하므로 null로
            
            resizeImage();
        });
    });

    // 다운로드
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            if (!currentImage || !previewCanvas) return;
            
            const quality = qualitySlider ? qualitySlider.value / 100 : 0.9;
            const dataURL = previewCanvas.toDataURL('image/jpeg', quality);
            
            // 파일명 생성
            const timestamp = new Date().getTime();
            const filename = `resized-image-${timestamp}.jpg`;
            
            // 다운로드 링크 생성
            const link = document.createElement('a');
            link.download = filename;
            link.href = dataURL;
            link.click();
        });
    }

    // 좌우 반전
    if (flipBtn) {
        flipBtn.addEventListener('click', () => {
            if (!currentImage) return;
            isFlipped = !isFlipped;
            flipBtn.classList.toggle('active', isFlipped);
            drawImage();
        });
    }

    // 회전
    if (rotateBtn) {
        rotateBtn.addEventListener('click', () => {
            if (!currentImage) return;
            rotationAngle = (rotationAngle + 90) % 360;
            drawImage();
        });
    }

    // 흑백
    if (grayscaleBtn) {
        grayscaleBtn.addEventListener('click', () => {
            if (!currentImage) return;
            isGrayscale = !isGrayscale;
            grayscaleBtn.classList.toggle('active', isGrayscale);
            drawImage();
        });
    }

    // 픽셀화
    if (pixelateBtn && pixelateControls) {
        pixelateBtn.addEventListener('click', () => {
            if (!currentImage) return;
            isPixelated = !isPixelated;
            pixelateBtn.classList.toggle('active', isPixelated);
            pixelateControls.style.display = isPixelated ? 'block' : 'none';
            drawImage();
        });
    }

    if (pixelateSlider && pixelateValue) {
        pixelateSlider.addEventListener('input', (e) => {
            pixelateSize = parseInt(e.target.value);
            pixelateValue.textContent = pixelateSize;
            if (isPixelated && currentImage) {
                drawImage();
            }
        });
    }

    // 자르기 모드
    if (cropBtn && cropControls) {
        cropBtn.addEventListener('click', () => {
            if (!currentImage) return;
            isCropMode = !isCropMode;
            cropBtn.classList.toggle('active', isCropMode);
            cropControls.style.display = isCropMode ? 'block' : 'none';
            
            if (isCropMode) {
                initCropMode();
            } else {
                exitCropMode();
            }
        });
    }

    // 자르기 적용
    if (cropApplyBtn) {
        cropApplyBtn.addEventListener('click', () => {
            if (!currentImage || !cropSelection || !previewCanvas) return;
            
            const rect = previewCanvas.getBoundingClientRect();
            const selectionRect = cropSelection.getBoundingClientRect();
            const wrapperRect = previewWrapper ? previewWrapper.getBoundingClientRect() : { left: 0, top: 0 };
            
            // 캔버스 좌표로 변환
            const scaleX = previewCanvas.width / rect.width;
            const scaleY = previewCanvas.height / rect.height;
            
            const x = (selectionRect.left - wrapperRect.left - (rect.left - wrapperRect.left)) * scaleX;
            const y = (selectionRect.top - wrapperRect.top - (rect.top - wrapperRect.top)) * scaleY;
            const w = selectionRect.width * scaleX;
            const h = selectionRect.height * scaleY;
            
            // 유효한 범위 확인 및 조정
            const finalX = Math.max(0, Math.min(x, previewCanvas.width));
            const finalY = Math.max(0, Math.min(y, previewCanvas.height));
            const finalW = Math.max(1, Math.min(w, previewCanvas.width - finalX));
            const finalH = Math.max(1, Math.min(h, previewCanvas.height - finalY));
            
            if (finalW > 0 && finalH > 0) {
                // 자르기 실행
                const croppedCanvas = document.createElement('canvas');
                croppedCanvas.width = finalW;
                croppedCanvas.height = finalH;
                const croppedCtx = croppedCanvas.getContext('2d');
                
                croppedCtx.drawImage(
                    previewCanvas,
                    finalX, finalY, finalW, finalH,
                    0, 0, finalW, finalH
                );
                
                const croppedImg = new Image();
                croppedImg.onload = () => {
                    currentImage = croppedImg;
                    originalWidth = croppedImg.width;
                    originalHeight = croppedImg.height;
                    if (widthInput) widthInput.value = originalWidth;
                    if (heightInput) heightInput.value = originalHeight;
                    
                    // 자르기 모드 종료
                    isCropMode = false;
                    if (cropBtn) cropBtn.classList.remove('active');
                    if (cropControls) cropControls.style.display = 'none';
                    exitCropMode();
                    
                    // 상태 초기화
                    rotationAngle = 0;
                    isFlipped = false;
                    isGrayscale = false;
                    isPixelated = false;
                    if (flipBtn) flipBtn.classList.remove('active');
                    if (grayscaleBtn) grayscaleBtn.classList.remove('active');
                    if (pixelateBtn) pixelateBtn.classList.remove('active');
                    if (pixelateControls) pixelateControls.style.display = 'none';
                    
                    drawImage();
                };
                croppedImg.src = croppedCanvas.toDataURL();
            } else {
                alert('유효한 영역을 선택해주세요.');
            }
        });
    }

    // 자르기 취소
    if (cropCancelBtn) {
        cropCancelBtn.addEventListener('click', () => {
            isCropMode = false;
            if (cropBtn) cropBtn.classList.remove('active');
            if (cropControls) cropControls.style.display = 'none';
            exitCropMode();
        });
    }

    // 초기화
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            if (!originalImage) return;
            
            // 원본 이미지로 완전히 복원
            originalWidth = trueOriginalWidth;
            originalHeight = trueOriginalHeight;
            
            // 원본 이미지 객체를 새로 생성하여 완전히 복원
            const restoredImg = new Image();
            restoredImg.onload = () => {
                currentImage = restoredImg;
                originalImage = restoredImg;
                
                // 입력 필드 복원
                if (widthInput) widthInput.value = originalWidth;
                if (heightInput) heightInput.value = originalHeight;
                
                // 설정 초기화
                maintainRatio = true;
                if (maintainRatioCheckbox) maintainRatioCheckbox.checked = true;
                isPercentMode.width = false;
                isPercentMode.height = false;
                if (widthPercentBtn) {
                    widthPercentBtn.textContent = '%';
                    widthPercentBtn.style.background = '#667eea';
                }
                if (heightPercentBtn) {
                    heightPercentBtn.textContent = '%';
                    heightPercentBtn.style.background = '#667eea';
                }
                if (qualitySlider) qualitySlider.value = 90;
                if (qualityValue) qualityValue.textContent = '90';
                pixelateSize = 10;
                if (pixelateSlider) pixelateSlider.value = 10;
                if (pixelateValue) pixelateValue.textContent = '10';
                lastChangedField = null;
                
                // 편집 상태 초기화
                rotationAngle = 0;
                isFlipped = false;
                isGrayscale = false;
                isPixelated = false;
                isCropMode = false;
                
                // UI 상태 초기화
                if (flipBtn) flipBtn.classList.remove('active');
                if (grayscaleBtn) grayscaleBtn.classList.remove('active');
                if (pixelateBtn) pixelateBtn.classList.remove('active');
                if (cropBtn) cropBtn.classList.remove('active');
                if (cropControls) cropControls.style.display = 'none';
                if (pixelateControls) pixelateControls.style.display = 'none';
                exitCropMode();
                
                // 원본 크기 정보 업데이트
                if (originalSizeSpan) originalSizeSpan.textContent = `${originalWidth} x ${originalHeight} px`;
                
                // 이미지 다시 그리기
                drawImage();
            };
            
            // 원본 이미지 데이터 URL 사용
            if (originalImageDataUrl) {
                restoredImg.src = originalImageDataUrl;
            } else if (originalImage && originalImage.src) {
                restoredImg.src = originalImage.src;
            }
        });
    }

    // 초기 로드 시 캔버스 설정
    if (previewCanvas) {
        previewCanvas.width = 1;
        previewCanvas.height = 1;
    }
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

// 파일 선택 처리
function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        handleFile(file);
    }
}

// 파일 처리
function handleFile(file) {
    if (!isImageFile(file)) {
        alert('이미지 파일만 업로드 가능합니다.');
        return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
            originalImage = img;
            currentImage = img;
            originalWidth = img.width;
            originalHeight = img.height;
            trueOriginalWidth = img.width;
            trueOriginalHeight = img.height;
            originalImageDataUrl = e.target.result;
            
            // UI 업데이트
            if (uploadSection) uploadSection.style.display = 'none';
            if (editSection) editSection.style.display = 'grid';
            
            // 입력 필드 초기화
            if (widthInput) widthInput.value = originalWidth;
            if (heightInput) heightInput.value = originalHeight;
            maintainRatio = true;
            if (maintainRatioCheckbox) maintainRatioCheckbox.checked = true;
            
            // 파일 크기 표시
            const fileSizeKB = (file.size / 1024).toFixed(2);
            if (fileSizeSpan) fileSizeSpan.textContent = `${fileSizeKB} KB`;
            if (originalSizeSpan) originalSizeSpan.textContent = `${originalWidth} x ${originalHeight} px`;
            
            // 이미지 그리기
            drawImage();
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
}

// 이미지 그리기
function drawImage() {
    if (!currentImage || !previewCanvas || !ctx) return;
    
    const img = currentImage;
    let displayWidth = img.width;
    let displayHeight = img.height;
    
    // 회전에 따른 크기 조정
    if (rotationAngle === 90 || rotationAngle === 270) {
        displayWidth = img.height;
        displayHeight = img.width;
    }
    
    // 캔버스 크기 설정
    previewCanvas.width = displayWidth;
    previewCanvas.height = displayHeight;
    
    ctx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);
    ctx.save();
    
    // 캔버스 중앙으로 이동
    ctx.translate(displayWidth / 2, displayHeight / 2);
    
    // 회전 적용
    if (rotationAngle !== 0) {
        ctx.rotate((rotationAngle * Math.PI) / 180);
    }
    
    // 좌우 반전 적용
    if (isFlipped) {
        ctx.scale(-1, 1);
    }
    
    // 이미지 그리기 (중앙 기준)
    const drawWidth = rotationAngle === 90 || rotationAngle === 270 ? img.height : img.width;
    const drawHeight = rotationAngle === 90 || rotationAngle === 270 ? img.width : img.height;
    ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
    
    ctx.restore();
    
    // 필터 적용
    if (isGrayscale) {
        applyGrayscale();
    }
    
    if (isPixelated) {
        applyPixelate();
    }
    
    // 현재 크기 업데이트
    if (currentSizeSpan) currentSizeSpan.textContent = `${displayWidth} x ${displayHeight} px`;
}

// 흑백 필터
function applyGrayscale() {
    if (!previewCanvas || !ctx) return;
    const imageData = ctx.getImageData(0, 0, previewCanvas.width, previewCanvas.height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
        const gray = data[i] * 0.299 + data[i + 1] * 0.587 + data[i + 2] * 0.114;
        data[i] = gray;
        data[i + 1] = gray;
        data[i + 2] = gray;
    }
    
    ctx.putImageData(imageData, 0, 0);
}

// 픽셀화 필터
function applyPixelate() {
    if (!previewCanvas || !ctx) return;
    const imageData = ctx.getImageData(0, 0, previewCanvas.width, previewCanvas.height);
    const data = imageData.data;
    const size = pixelateSize;
    
    for (let y = 0; y < previewCanvas.height; y += size) {
        for (let x = 0; x < previewCanvas.width; x += size) {
            const index = (y * previewCanvas.width + x) * 4;
            const r = data[index];
            const g = data[index + 1];
            const b = data[index + 2];
            
            for (let dy = 0; dy < size && y + dy < previewCanvas.height; dy++) {
                for (let dx = 0; dx < size && x + dx < previewCanvas.width; dx++) {
                    const pixelIndex = ((y + dy) * previewCanvas.width + (x + dx)) * 4;
                    data[pixelIndex] = r;
                    data[pixelIndex + 1] = g;
                    data[pixelIndex + 2] = b;
                }
            }
        }
    }
    
    ctx.putImageData(imageData, 0, 0);
}

// 크기 조절
function resizeImage(sourceField = null) {
    if (!originalImage || !widthInput || !heightInput) return;
    
    // 어떤 필드가 변경되었는지 추적
    if (sourceField) {
        lastChangedField = sourceField;
    }
    
    let newWidth = parseInt(widthInput.value) || originalWidth;
    let newHeight = parseInt(heightInput.value) || originalHeight;
    
    // 퍼센트 모드 처리
    if (isPercentMode.width && widthInput.value) {
        newWidth = Math.round(originalWidth * (parseFloat(widthInput.value) / 100));
    }
    if (isPercentMode.height && heightInput.value) {
        newHeight = Math.round(originalHeight * (parseFloat(heightInput.value) / 100));
    }
    
    // 비율 유지 - 더 스마트한 처리
    if (maintainRatio) {
        const aspectRatio = originalWidth / originalHeight;
        
        // 마지막으로 변경된 필드에 따라 비율 조절
        if (lastChangedField === 'width' && widthInput.value) {
            // 너비가 변경되었으면 높이를 비율에 맞게 조절
            newHeight = Math.round(newWidth / aspectRatio);
            if (!isPercentMode.height) {
                heightInput.value = newHeight;
            } else {
                heightInput.value = Math.round((newHeight / originalHeight) * 100);
            }
        } else if (lastChangedField === 'height' && heightInput.value) {
            // 높이가 변경되었으면 너비를 비율에 맞게 조절
            newWidth = Math.round(newHeight * aspectRatio);
            if (!isPercentMode.width) {
                widthInput.value = newWidth;
            } else {
                widthInput.value = Math.round((newWidth / originalWidth) * 100);
            }
        } else if (widthInput.value && heightInput.value) {
            // 둘 다 입력되어 있으면 마지막 변경 필드 기준으로 조절
            const widthChange = Math.abs(newWidth - originalWidth) / originalWidth;
            const heightChange = Math.abs(newHeight - originalHeight) / originalHeight;
            
            if (widthChange > heightChange) {
                newHeight = Math.round(newWidth / aspectRatio);
                if (!isPercentMode.height) {
                    heightInput.value = newHeight;
                } else {
                    heightInput.value = Math.round((newHeight / originalHeight) * 100);
                }
            } else {
                newWidth = Math.round(newHeight * aspectRatio);
                if (!isPercentMode.width) {
                    widthInput.value = newWidth;
                } else {
                    widthInput.value = Math.round((newWidth / originalWidth) * 100);
                }
            }
        }
    }
    
    // 최소 크기 제한
    newWidth = Math.max(1, newWidth);
    newHeight = Math.max(1, newHeight);
    
    // 새 이미지 생성
    const canvas = document.createElement('canvas');
    canvas.width = newWidth;
    canvas.height = newHeight;
    const canvasCtx = canvas.getContext('2d');
    
    // 고품질 리사이징
    canvasCtx.imageSmoothingEnabled = true;
    canvasCtx.imageSmoothingQuality = 'high';
    canvasCtx.drawImage(originalImage, 0, 0, newWidth, newHeight);
    
    // 새 이미지 객체 생성
    const resizedImg = new Image();
    resizedImg.onload = () => {
        currentImage = resizedImg;
        drawImage();
    };
    resizedImg.src = canvas.toDataURL();
}

function initCropMode() {
    if (!previewCanvas) return;
    previewCanvas.style.cursor = 'crosshair';
    previewCanvas.addEventListener('mousedown', startCrop);
    previewCanvas.addEventListener('mousemove', updateCrop);
    previewCanvas.addEventListener('mouseup', endCrop);
}

function exitCropMode() {
    if (!previewCanvas) return;
    previewCanvas.style.cursor = 'default';
    previewCanvas.removeEventListener('mousedown', startCrop);
    previewCanvas.removeEventListener('mousemove', updateCrop);
    previewCanvas.removeEventListener('mouseup', endCrop);
    if (cropSelection) {
        cropSelection.remove();
        cropSelection = null;
    }
}

function startCrop(e) {
    if (!isCropMode || !previewCanvas || !previewWrapper) return;
    isCropping = true;
    const rect = previewCanvas.getBoundingClientRect();
    cropStartX = e.clientX - rect.left;
    cropStartY = e.clientY - rect.top;
    
    // 선택 영역 표시 요소 생성
    if (cropSelection) {
        cropSelection.remove();
    }
    cropSelection = document.createElement('div');
    cropSelection.className = 'crop-selection';
    previewWrapper.appendChild(cropSelection);
    
    updateCropSelection(cropStartX, cropStartY, cropStartX, cropStartY);
}

function updateCrop(e) {
    if (!isCropping || !cropSelection || !previewCanvas) return;
    const rect = previewCanvas.getBoundingClientRect();
    cropEndX = e.clientX - rect.left;
    cropEndY = e.clientY - rect.top;
    
    updateCropSelection(cropStartX, cropStartY, cropEndX, cropEndY);
}

function updateCropSelection(x1, y1, x2, y2) {
    if (!cropSelection || !previewCanvas || !previewWrapper) return;
    
    const rect = previewCanvas.getBoundingClientRect();
    const wrapperRect = previewWrapper.getBoundingClientRect();
    
    const left = Math.min(x1, x2);
    const top = Math.min(y1, y2);
    const width = Math.abs(x2 - x1);
    const height = Math.abs(y2 - y1);
    
    cropSelection.style.left = (rect.left - wrapperRect.left + left) + 'px';
    cropSelection.style.top = (rect.top - wrapperRect.top + top) + 'px';
    cropSelection.style.width = width + 'px';
    cropSelection.style.height = height + 'px';
}

function endCrop(e) {
    if (!isCropping || !previewCanvas) return;
    isCropping = false;
    const rect = previewCanvas.getBoundingClientRect();
    cropEndX = e.clientX - rect.left;
    cropEndY = e.clientY - rect.top;
}

// DOM 로드 완료 시 초기화
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
