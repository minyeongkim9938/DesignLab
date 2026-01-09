// 네비게이션 메뉴 공통 컴포넌트

// 메뉴 구조 정의
const menuData = {
    logo: {
        icon: '🖼️',
        text: 'DesignLab',
        href: 'index.html'
    },
    items: [
        {
            type: 'link',
            text: '홈',
            href: 'index.html'
        },
        {
            type: 'dropdown',
            text: '이미지 편집',
            items: [
                { text: '이미지 크기 조정', href: 'image-resize.html' },
                { text: '이미지 변환기', href: 'jpg-converter.html' },
                { text: 'SVG 편집', href: 'svg-customizer.html' }
            ]
        },
        {
            type: 'link',
            text: '색상 팔레트',
            href: 'color-palette.html'
        },
        {
            type: 'dropdown',
            text: '레이아웃',
            items: [
                { text: 'Flex/Grid 도구', href: 'flex-grid-visualizer.html' },
                { text: '그리드 계산기', href: 'grid-layout-calculator.html' },
                { text: '반응형 미리보기', href: 'responsive-preview.html' }
            ]
        },
        {
            type: 'dropdown',
            text: '개발도구',
            items: [
                { text: 'CSS 효과', href: 'shadow-gradient-generator.html' },
                { text: '애니메이션', href: 'animation-transition-calculator.html' },
                { text: 'CSS Minifier', href: 'css-minifier.html' },
                { text: '코드 검증기', href: 'code-validator.html' }
            ]
        },
        {
            type: 'dropdown',
            text: '특수문자',
            items: [
                { text: '인스타폰트', href: 'instagram-font.html' },
                { text: '이모지', href: 'emoji.html' },
                { text: '카와이 이모티콘', href: 'kawaii-emoji.html' },
                { text: '도트아트', href: 'dot-art.html' }
            ]
        }
    ]
};

// 현재 페이지 파일명 가져오기
function getCurrentPage() {
    const path = window.location.pathname;
    const page = path.substring(path.lastIndexOf('/') + 1) || 'index.html';
    return page;
}

// 네비게이션 HTML 생성
function generateNavHTML() {
    const currentPage = getCurrentPage();
    
    let menuItemsHTML = '';
    
    menuData.items.forEach(item => {
        if (item.type === 'link') {
            const isActive = item.href === currentPage;
            menuItemsHTML += `
                <li class="nav-item">
                    <a href="${item.href}" class="nav-link${isActive ? ' active' : ''}">${item.text}</a>
                </li>`;
        } else if (item.type === 'dropdown') {
            // 드롭다운 내 활성 아이템 체크
            let hasActiveChild = false;
            let dropdownItemsHTML = '';
            
            item.items.forEach(subItem => {
                const isSubActive = subItem.href === currentPage;
                if (isSubActive) hasActiveChild = true;
                dropdownItemsHTML += `
                        <li><a href="${subItem.href}" class="dropdown-item${isSubActive ? ' active' : ''}">${subItem.text}</a></li>`;
            });
            
            menuItemsHTML += `
                <li class="nav-item dropdown">
                    <a href="#" class="nav-link dropdown-toggle${hasActiveChild ? ' active' : ''}">${item.text}</a>
                    <ul class="dropdown-menu">${dropdownItemsHTML}
                    </ul>
                </li>`;
        }
    });
    
    return `
    <nav class="navbar">
        <div class="nav-container">
            <a href="${menuData.logo.href}" class="nav-logo">
                <span class="logo-icon">${menuData.logo.icon}</span>
                <span class="logo-text">${menuData.logo.text}</span>
            </a>
            <ul class="nav-menu" id="navMenu">${menuItemsHTML}
            </ul>
            <button class="nav-toggle" id="navToggle" aria-label="메뉴 열기/닫기">
                <!-- 햄버거 아이콘 (메뉴 닫힘) -->
                <svg class="menu-icon menu-open" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
                <!-- X 아이콘 (메뉴 열림) -->
                <svg class="menu-icon menu-close" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>
    </nav>`;
}

// 네비게이션 삽입
function insertNav() {
    const placeholder = document.getElementById('nav-placeholder');
    if (placeholder) {
        placeholder.outerHTML = generateNavHTML();
    }
}

function initNav() {
    // 반응형 네비게이션 메뉴 토글
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link:not(.dropdown-toggle)');
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');

    // 페이지 설명 토글 기능
    const toggleDescription = document.getElementById('toggleDescription');
    const descriptionContent = document.getElementById('descriptionContent');

    if (toggleDescription && descriptionContent) {
        // 초기 상태: 열림
        let isExpanded = true;
        
        toggleDescription.addEventListener('click', () => {
            isExpanded = !isExpanded;
            
            if (isExpanded) {
                descriptionContent.classList.remove('collapsed');
                toggleDescription.classList.remove('active');
            } else {
                descriptionContent.classList.add('collapsed');
                toggleDescription.classList.add('active');
            }
        });
    }

    // 드롭다운 메뉴 토글
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const dropdownItem = toggle.closest('.nav-item.dropdown');
            const isActive = dropdownItem.classList.contains('active');
            
            // 다른 드롭다운 닫기 (데스크톱만)
            if (window.innerWidth > 900) {
                document.querySelectorAll('.nav-item.dropdown').forEach(item => {
                    if (item !== dropdownItem) {
                        item.classList.remove('active');
                    }
                });
            }
            
            // 현재 드롭다운 토글
            dropdownItem.classList.toggle('active', !isActive);
        });
    });

    // 드롭다운 아이템 클릭 시 드롭다운 닫기 (이벤트 위임 - navMenu에 직접 적용)
    if (navMenu) {
        navMenu.addEventListener('click', (e) => {
            const dropdownItem = e.target.closest('.dropdown-item');
            if (dropdownItem) {
                const isMobile = window.innerWidth <= 900;
                
                // 데스크톱에서는 모든 드롭다운 닫기
                if (!isMobile) {
                    document.querySelectorAll('.nav-item.dropdown').forEach(dropdown => {
                        dropdown.classList.remove('active');
                    });
                }
                
                // 모바일 메뉴 닫기
                if (isMobile) {
                    navMenu.classList.remove('active');
                    if (navToggle) {
                        navToggle.classList.remove('active');
                    }
                }
                
                // 활성 링크 업데이트
                document.querySelectorAll('.nav-link, .dropdown-item').forEach(l => l.classList.remove('active'));
                dropdownItem.classList.add('active');
                
                // 상위 드롭다운 토글에도 active 클래스 추가
                const dropdownParent = dropdownItem.closest('.nav-item.dropdown');
                if (dropdownParent) {
                    const dropdownToggle = dropdownParent.querySelector('.dropdown-toggle');
                    if (dropdownToggle) {
                        dropdownToggle.classList.add('active');
                    }
                }
            }
        });
    }
    
    // 페이지 로드 시 현재 활성화된 드롭다운 아이템의 상위 토글에도 active 클래스 추가
    document.querySelectorAll('.dropdown-item.active').forEach(activeItem => {
        const dropdownParent = activeItem.closest('.nav-item.dropdown');
        if (dropdownParent) {
            const dropdownToggle = dropdownParent.querySelector('.dropdown-toggle');
            if (dropdownToggle) {
                dropdownToggle.classList.add('active');
            }
        }
    });

    // 외부 클릭 시 드롭다운 닫기 (데스크톱)
    document.addEventListener('click', (e) => {
        // 드롭다운 아이템 클릭은 위에서 처리되므로 여기서는 스킵
        if (e.target.closest('.dropdown-item')) {
            return;
        }
        
        // 외부 클릭 시 드롭다운 닫기 (데스크톱)
        if (!e.target.closest('.nav-item.dropdown')) {
            document.querySelectorAll('.nav-item.dropdown').forEach(item => {
                // 모바일에서는 유지
                if (window.innerWidth > 900) {
                    item.classList.remove('active');
                }
            });
        }
        
        // 모바일 메뉴 닫기
        if (navToggle && navMenu && !navToggle.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        }
    });

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        // 메뉴 링크 클릭 시 모바일 메뉴 닫기
        if (navLinks) {
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    navMenu.classList.remove('active');
                    navToggle.classList.remove('active');
                    
                    // 활성 링크 업데이트 (드롭다운 토글 포함)
                    document.querySelectorAll('.nav-link, .dropdown-item').forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                });
            });
        }
    }
}

// DOM 로드 완료 시 초기화
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        insertNav();
        initNav();
    });
} else {
    insertNav();
    initNav();
}
