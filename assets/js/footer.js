// 푸터 공통 컴포넌트

// 푸터 데이터 정의
const footerData = {
    siteName: 'DesignLab',
    siteDescription: '웹 디자인과 개발을 위한 다양한 도구들을 한 곳에서 제공합니다',
    currentYear: new Date().getFullYear(),
    links: {
        about: 'about.html',
        services: 'services.html',
        privacy: 'privacy-policy.html',
        terms: 'terms-of-service.html',
        contact: 'contact.html'
    },
    contact: {
        email: 'lili9938@naver.com'
    },
    // 카테고리별 페이지 링크
    pageCategories: [
        {
            title: '이미지 편집',
            pages: [
                { text: '이미지 크기 조정', href: 'image-resize.html' },
                { text: '이미지 변환기', href: 'jpg-converter.html' },
                { text: 'SVG 편집', href: 'svg-customizer.html' }
            ]
        },
        {
            title: '색상 및 레이아웃',
            pages: [
                { text: '색상 팔레트', href: 'color-palette.html' },
                { text: 'Flex/Grid 도구', href: 'flex-grid-visualizer.html' },
                { text: '그리드 계산기', href: 'grid-layout-calculator.html' },
                { text: '반응형 미리보기', href: 'responsive-preview.html' }
            ]
        },
        {
            title: '개발도구',
            pages: [
                { text: 'CSS 효과', href: 'shadow-gradient-generator.html' },
                { text: '애니메이션', href: 'animation-transition-calculator.html' },
                { text: 'CSS Minifier', href: 'css-minifier.html' },
                { text: '코드 검증기', href: 'code-validator.html' }
            ]
        },
        {
            title: '특수문자',
            pages: [
                { text: '인스타폰트', href: 'instagram-font.html' },
                { text: '이모지', href: 'emoji.html' },
                { text: '카와이 이모티콘', href: 'kawaii-emoji.html' },
                { text: '도트아트', href: 'dot-art.html' }
            ]
        }
    ]
};

// 푸터 HTML 생성
function generateFooterHTML() {
    return `
    <footer class="site-footer">
        <div class="footer-container">
            <!-- 메인 푸터 콘텐츠 -->
            <!-- 사이트 정보 영역 (한 줄) -->
            <div class="footer-brand-row">
                <div class="footer-brand">
                    <h3 class="footer-title">
                        <span class="footer-logo-icon">🖼️</span>
                        ${footerData.siteName}
                    </h3>
                    <p class="footer-description">${footerData.siteDescription}</p>
                </div>
                <div class="footer-contact-info">
                    <div class="contact-item">
                        <svg class="contact-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                        </svg>
                        <a href="mailto:${footerData.contact.email}">${footerData.contact.email}</a>
                    </div>
                </div>
            </div>

            <!-- 링크 그리드 영역 (사이트 정보 아래 한 줄) -->
            <div class="footer-links-row">
                ${footerData.pageCategories.map(category => `
                    <div class="footer-link-group">
                        <h4 class="footer-group-title">${category.title}</h4>
                        <ul class="footer-links">
                            ${category.pages.map(page => `<li><a href="${page.href}">${page.text}</a></li>`).join('')}
                        </ul>
                    </div>
                `).join('')}

                <!-- 회사 정보 -->
                <div class="footer-link-group">
                    <h4 class="footer-group-title">회사 정보</h4>
                    <ul class="footer-links">
                        <li><a href="${footerData.links.about}">소개</a></li>
                        <li><a href="${footerData.links.services}">서비스</a></li>
                        <li><a href="${footerData.links.contact}">문의하기</a></li>
                    </ul>
                </div>

                <!-- 법적정보 -->
                <div class="footer-link-group">
                    <h4 class="footer-group-title">법적정보</h4>
                    <ul class="footer-links">
                        <li><a href="${footerData.links.privacy}">개인정보처리방침</a></li>
                        <li><a href="${footerData.links.terms}">이용약관</a></li>
                    </ul>
                </div>
            </div>

            <!-- 저작권 정보 -->
            <div class="footer-bottom">
                <div class="footer-copyright">
                    <p class="copyright-text">&copy; ${footerData.currentYear} ${footerData.siteName}. All rights reserved.</p>
                    <p class="footer-disclaimer">본 사이트의 모든 도구는 무료로 제공되며, 상업적 목적으로 사용 가능합니다.</p>
                </div>
            </div>
        </div>
    </footer>`;
}

// 푸터 삽입
function insertFooter() {
    const placeholder = document.getElementById('footer-placeholder');
    if (placeholder) {
        placeholder.outerHTML = generateFooterHTML();
    }
}

// DOM 로드 완료 시 초기화
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        insertFooter();
    });
} else {
    insertFooter();
}

