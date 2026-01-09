// 코드 검증기 기능

document.addEventListener('DOMContentLoaded', function() {
    const codeTypeButtons = document.querySelectorAll('.code-type-btn');
    const codeInput = document.getElementById('codeInput');
    const validateBtn = document.getElementById('validateBtn');
    const formatBtn = document.getElementById('formatBtn');
    const clearBtn = document.getElementById('clearBtn');
    const resultSection = document.getElementById('resultSection');
    const formatSection = document.getElementById('formatSection');
    const validationResult = document.getElementById('validationResult');
    const formattedCode = document.getElementById('formattedCode');
    const codeTypeTitle = document.getElementById('codeTypeTitle');
    const copyResultBtn = document.getElementById('copyResultBtn');
    const copyFormatBtn = document.getElementById('copyFormatBtn');
    
    let currentType = 'html';

    // 코드 타입 변경
    codeTypeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            codeTypeButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentType = this.dataset.type;
            
            // 제목 변경
            const titles = {
                'html': 'HTML 코드',
                'css': 'CSS 코드',
                'ts': 'TypeScript 코드'
            };
            codeTypeTitle.textContent = titles[currentType];
            
            // placeholder 변경
            const placeholders = {
                'html': '<!DOCTYPE html>\n<html>\n  <head>...</head>\n  <body>...</body>\n</html>',
                'css': 'body {\n  margin: 0;\n  padding: 0;\n}',
                'ts': 'function example(): void {\n  console.log("Hello");\n}'
            };
            codeInput.placeholder = placeholders[currentType];
            
            // 입력 필드 초기화
            codeInput.value = '';
            
            // 결과 영역 숨기기
            resultSection.style.display = 'none';
            formatSection.style.display = 'none';
        });
    });

    // HTML 검증
    function validateHTML(code) {
        const errors = [];
        const warnings = [];
        
        // 기본 검증
        if (!code.trim()) {
            errors.push({ type: 'error', message: '코드가 비어있습니다.' });
            return { errors, warnings, isValid: false };
        }
        
        // DOCTYPE 검증
        if (!code.includes('<!DOCTYPE') && !code.includes('<html')) {
            const htmlIndex = code.indexOf('<html');
            const doctypeIndex = code.indexOf('<!DOCTYPE');
            const line = htmlIndex !== -1 ? getLineNumber(code, htmlIndex) : (doctypeIndex !== -1 ? getLineNumber(code, doctypeIndex) : 1);
            warnings.push({ type: 'warning', message: 'DOCTYPE 선언이 없습니다.', line: line });
        }
        
        // h1 태그 중복 검사 (한 페이지에 하나만 허용)
        const h1Matches = code.match(/<h1[^>]*>/gi) || [];
        if (h1Matches.length > 1) {
            const h1Regex = /<h1[^>]*>/gi;
            const h1Lines = [];
            let h1Match;
            while ((h1Match = h1Regex.exec(code)) !== null) {
                h1Lines.push(getLineNumber(code, h1Match.index));
            }
            errors.push({ 
                type: 'error', 
                message: `h1 태그가 ${h1Matches.length}개 발견되었습니다. 한 페이지에는 h1 태그가 하나만 있어야 합니다. (라인: ${h1Lines.join(', ')})`,
                line: h1Lines[0]
            });
        }
        
        // 중복된 id 속성 검사
        const idRegex = /\bid\s*=\s*["']([^"']+)["']/gi;
        const ids = [];
        let idMatch;
        while ((idMatch = idRegex.exec(code)) !== null) {
            const idValue = idMatch[1];
            if (ids.includes(idValue)) {
                errors.push({ 
                    type: 'error', 
                    message: `중복된 id 속성: "${idValue}". id는 고유해야 합니다.`,
                    line: getLineNumber(code, idMatch.index)
                });
            } else {
                ids.push(idValue);
            }
        }
        
        // 주석, 스크립트, 스타일 태그 내용 제외
        let codeToParse = code;
        // HTML 주석 제거
        codeToParse = codeToParse.replace(/<!--[\s\S]*?-->/g, '');
        // script 태그 전체를 단일 태그로 대체 (내부 내용 무시)
        codeToParse = codeToParse.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '<script></script>');
        // style 태그 전체를 단일 태그로 대체 (내부 내용 무시)
        codeToParse = codeToParse.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '<style></style>');
        
        // 태그 파싱 및 구조 검증
        const tagStack = [];
        const tagRegex = /<\/?([a-zA-Z][a-zA-Z0-9]*)[^>]*>/g;
        let match;
        const tagInfo = [];
        
        // 모든 태그를 순차적으로 파싱
        while ((match = tagRegex.exec(codeToParse)) !== null) {
            const fullTag = match[0];
            const tagName = match[1].toLowerCase();
            const isClosing = fullTag.startsWith('</');
            // 자가 닫힘 태그 확인 (닫는 태그가 아니고, />로 끝나거나 자가 닫힘 태그 목록에 있는 경우)
            const isSelfClosing = !isClosing && (fullTag.trim().endsWith('/>') || isSelfClosingTag(tagName));
            const position = match.index;
            const line = getLineNumber(code, position);
            
            tagInfo.push({ 
                tagName, 
                isClosing, 
                isSelfClosing, 
                position, 
                line,
                fullTag 
            });
        }
        
        // 태그 스택을 사용한 중첩 구조 검증
        const invalidNestingRules = {
            'p': ['div', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'section', 'article', 'header', 'footer', 'nav', 'main', 'aside'],
            'span': ['div', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'section', 'article', 'header', 'footer', 'nav', 'main', 'aside'],
            'a': ['a'],
            'button': ['button', 'a'],
            'h1': ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
            'h2': ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
            'h3': ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
            'h4': ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
            'h5': ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
            'h6': ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']
        };
        
        // 태그 스택을 사용하여 실제 중첩 구조 검증
        tagInfo.forEach((tag, index) => {
            if (tag.isClosing) {
                // 닫는 태그 처리
                if (tagStack.length === 0) {
                    errors.push({
                        type: 'error',
                        message: `예상치 못한 닫는 태그 </${tag.tagName}>`,
                        line: tag.line
                    });
                    return;
                }
                
                // 스택의 마지막 태그 확인 (LIFO 방식)
                const lastTag = tagStack[tagStack.length - 1];
                
                if (lastTag && lastTag.tagName === tag.tagName) {
                    // 올바른 닫는 태그 - 스택에서 제거
                    tagStack.pop();
                } else {
                    // 잘못된 닫는 태그
                    if (tagStack.length === 0) {
                        errors.push({
                            type: 'error',
                            message: `예상치 못한 닫는 태그 </${tag.tagName}>`,
                            line: tag.line
                        });
                    } else {
                        // 스택에 다른 태그가 있음
                        errors.push({
                            type: 'error',
                            message: `닫는 태그 </${tag.tagName}>가 잘못되었습니다. 예상된 닫는 태그: </${lastTag.tagName}>`,
                            line: tag.line
                        });
                    }
                }
            } else if (!tag.isSelfClosing) {
                // 여는 태그 처리
                tagStack.push({
                    tagName: tag.tagName,
                    line: tag.line,
                    position: tag.position
                });
            }
        });
        
        
        // 닫히지 않은 태그 확인
        if (tagStack.length > 0) {
            const unclosedTags = tagStack.map(t => `${t.tagName} (라인 ${t.line})`).join(', ');
            errors.push({
                type: 'error',
                message: `닫히지 않은 태그: ${tagStack.map(t => t.tagName).join(', ')}`,
                line: tagStack[0].line
            });
        }
        
        // 필수 속성 검사
        const imgRegex = /<img[^>]*>/gi;
        let imgMatch;
        while ((imgMatch = imgRegex.exec(code)) !== null) {
            const imgTag = imgMatch[0];
            if (!imgTag.includes('alt=') && !imgTag.includes('alt =')) {
                warnings.push({ 
                    type: 'warning', 
                    message: `img 태그에 alt 속성이 없습니다. 접근성을 위해 alt 속성을 추가하세요.`,
                    line: getLineNumber(code, imgMatch.index)
                });
            }
        }
        
        const aRegex = /<a[^>]*>/gi;
        let aMatch;
        while ((aMatch = aRegex.exec(code)) !== null) {
            const aTag = aMatch[0];
            if (!aTag.includes('href=') && !aTag.includes('href =')) {
                warnings.push({ 
                    type: 'warning', 
                    message: `a 태그에 href 속성이 없습니다.`,
                    line: getLineNumber(code, aMatch.index)
                });
            }
        }
        
        return {
            errors,
            warnings,
            isValid: errors.length === 0
        };
    }

    // CSS 검증
    function validateCSS(code) {
        const errors = [];
        const warnings = [];
        
        if (!code.trim()) {
            errors.push({ type: 'error', message: '코드가 비어있습니다.' });
            return { errors, warnings, isValid: false };
        }
        
        // 주석 제거 (검증을 위해)
        let codeToParse = code;
        // 블록 주석 제거
        codeToParse = codeToParse.replace(/\/\*[\s\S]*?\*\//g, '');
        // 라인 주석 제거 (CSS는 라인 주석을 지원하지 않지만 혹시 모르니)
        codeToParse = codeToParse.replace(/\/\/.*$/gm, '');
        
        // 중괄호 검증 (스택 기반으로 정확하게)
        const braceStack = [];
        let inString = false;
        let stringChar = '';
        
        for (let i = 0; i < codeToParse.length; i++) {
            const char = codeToParse[i];
            const prevChar = i > 0 ? codeToParse[i - 1] : '';
            
            // 문자열 내부인지 확인
            if ((char === '"' || char === "'") && prevChar !== '\\') {
                if (!inString) {
                    inString = true;
                    stringChar = char;
                } else if (char === stringChar) {
                    inString = false;
                    stringChar = '';
                }
            }
            
            // 문자열 내부가 아닐 때만 중괄호 검사
            if (!inString) {
                if (char === '{') {
                    braceStack.push({ char: '{', position: i, line: getLineNumber(code, i) });
                } else if (char === '}') {
                    if (braceStack.length === 0) {
                        errors.push({
                            type: 'error',
                            message: '예상치 못한 닫는 중괄호 }',
                            line: getLineNumber(code, i)
                        });
                    } else {
                        braceStack.pop();
                    }
                }
            }
        }
        
        // 닫히지 않은 중괄호 확인
        if (braceStack.length > 0) {
            braceStack.forEach(brace => {
                errors.push({
                    type: 'error',
                    message: '닫히지 않은 여는 중괄호 {',
                    line: brace.line
                });
            });
        }
        
        // 괄호 검증 (함수 호출, calc() 등)
        const parenStack = [];
        inString = false;
        stringChar = '';
        
        for (let i = 0; i < codeToParse.length; i++) {
            const char = codeToParse[i];
            const prevChar = i > 0 ? codeToParse[i - 1] : '';
            
            if ((char === '"' || char === "'") && prevChar !== '\\') {
                if (!inString) {
                    inString = true;
                    stringChar = char;
                } else if (char === stringChar) {
                    inString = false;
                    stringChar = '';
                }
            }
            
            if (!inString) {
                if (char === '(') {
                    parenStack.push({ char: '(', position: i, line: getLineNumber(code, i) });
                } else if (char === ')') {
                    if (parenStack.length === 0) {
                        errors.push({
                            type: 'error',
                            message: '예상치 못한 닫는 괄호 )',
                            line: getLineNumber(code, i)
                        });
                    } else {
                        parenStack.pop();
                    }
                }
            }
        }
        
        if (parenStack.length > 0) {
            parenStack.forEach(paren => {
                errors.push({
                    type: 'error',
                    message: '닫히지 않은 여는 괄호 (',
                    line: paren.line
                });
            });
        }
        
        // 대괄호 검증 (속성 선택자 등)
        const bracketStack = [];
        inString = false;
        stringChar = '';
        
        for (let i = 0; i < codeToParse.length; i++) {
            const char = codeToParse[i];
            const prevChar = i > 0 ? codeToParse[i - 1] : '';
            
            if ((char === '"' || char === "'") && prevChar !== '\\') {
                if (!inString) {
                    inString = true;
                    stringChar = char;
                } else if (char === stringChar) {
                    inString = false;
                    stringChar = '';
                }
            }
            
            if (!inString) {
                if (char === '[') {
                    bracketStack.push({ char: '[', position: i, line: getLineNumber(code, i) });
                } else if (char === ']') {
                    if (bracketStack.length === 0) {
                        errors.push({
                            type: 'error',
                            message: '예상치 못한 닫는 대괄호 ]',
                            line: getLineNumber(code, i)
                        });
                    } else {
                        bracketStack.pop();
                    }
                }
            }
        }
        
        if (bracketStack.length > 0) {
            bracketStack.forEach(bracket => {
                errors.push({
                    type: 'error',
                    message: '닫히지 않은 여는 대괄호 [',
                    line: bracket.line
                });
            });
        }
        
        // CSS 단위 검증 (잘못된 단위 감지)
        const validUnits = ['px', 'em', 'rem', '%', 'vh', 'vw', 'vmin', 'vmax', 'ch', 'ex', 'cm', 'mm', 'in', 'pt', 'pc', 'deg', 'rad', 'grad', 'turn', 's', 'ms', 'hz', 'khz', 'dpi', 'dpcm', 'dppx', 'fr'];
        
        // 잘못된 단위 패턴 (명확한 오타) - 더 정확한 패턴
        const invalidUnitPatterns = [
            { pattern: /(\d+(?:\.\d+)?)\s*rm\b/gi, correct: 'rem', message: '잘못된 단위: "rm". "rem"을 사용하세요.' },
            { pattern: /(\d+(?:\.\d+)?)\s*pxx\b/gi, correct: 'px', message: '잘못된 단위: "pxx". "px"를 사용하세요.' },
            { pattern: /(\d+(?:\.\d+)?)\s*emm\b/gi, correct: 'em', message: '잘못된 단위: "emm". "em"을 사용하세요.' },
            { pattern: /(\d+(?:\.\d+)?)\s*pxm\b/gi, correct: 'px', message: '잘못된 단위: "pxm". "px"를 사용하세요.' },
            { pattern: /(\d+(?:\.\d+)?)\s*remm\b/gi, correct: 'rem', message: '잘못된 단위: "remm". "rem"을 사용하세요.' },
            { pattern: /(\d+(?:\.\d+)?)\s*emx\b/gi, correct: 'em', message: '잘못된 단위: "emx". "em"을 사용하세요.' },
            { pattern: /(\d+(?:\.\d+)?)\s*remx\b/gi, correct: 'rem', message: '잘못된 단위: "remx". "rem"을 사용하세요.' }
        ];
        
        // 문자열 내부인지 확인하는 함수
        function isInsideString(text, position) {
            let inString = false;
            let stringChar = '';
            for (let i = 0; i < position; i++) {
                const char = text[i];
                const prevChar = i > 0 ? text[i - 1] : '';
                if ((char === '"' || char === "'") && prevChar !== '\\') {
                    if (!inString) {
                        inString = true;
                        stringChar = char;
                    } else if (char === stringChar) {
                        inString = false;
                        stringChar = '';
                    }
                }
            }
            return inString;
        }
        
        // 주석 내부인지 확인하는 함수
        function isInsideComment(text, position) {
            const beforePos = text.substring(0, position);
            const commentStart = beforePos.lastIndexOf('/*');
            if (commentStart === -1) return false;
            const commentEnd = text.indexOf('*/', commentStart);
            return commentEnd === -1 || commentEnd > position;
        }
        
        // 색상 코드 내부인지 확인하는 함수
        function isInsideColorCode(text, position) {
            const beforePos = text.substring(0, position);
            const afterPos = text.substring(position);
            
            // 16진수 색상 코드 (#ffffff, #fff 등)
            const hexMatch = beforePos.match(/#[0-9a-f]*$/i);
            if (hexMatch) {
                const hexStart = beforePos.lastIndexOf('#');
                const hexContent = text.substring(hexStart + 1, position);
                const hexAfter = afterPos.match(/^[0-9a-f]*/i);
                const totalHex = hexContent + (hexAfter ? hexAfter[0] : '');
                // # 뒤에 3자리 또는 6자리 16진수가 오는 경우
                if (totalHex.length <= 6 && /^[0-9a-f]*$/i.test(totalHex)) {
                    return true;
                }
            }
            
            // rgb/rgba/hsl/hsla 함수 내부
            const colorFunctions = ['rgb', 'rgba', 'hsl', 'hsla'];
            for (const func of colorFunctions) {
                const funcIndex = beforePos.toLowerCase().lastIndexOf(func + '(');
                if (funcIndex !== -1) {
                    const afterFunc = text.substring(funcIndex);
                    const openParen = afterFunc.indexOf('(');
                    const closeParen = afterFunc.indexOf(')', openParen);
                    if (closeParen === -1 || position < funcIndex + closeParen) {
                        return true; // 함수 내부
                    }
                }
            }
            
            return false;
        }
        
        // CSS 색상 이름 목록 (일부 주요 색상)
        const cssColorNames = ['transparent', 'currentcolor', 'aliceblue', 'antiquewhite', 'aqua', 'aquamarine', 'azure', 'beige', 'bisque', 'black', 'blanchedalmond', 'blue', 'blueviolet', 'brown', 'burlywood', 'cadetblue', 'chartreuse', 'chocolate', 'coral', 'cornflowerblue', 'cornsilk', 'crimson', 'cyan', 'darkblue', 'darkcyan', 'darkgoldenrod', 'darkgray', 'darkgreen', 'darkgrey', 'darkkhaki', 'darkmagenta', 'darkolivegreen', 'darkorange', 'darkorchid', 'darkred', 'darksalmon', 'darkseagreen', 'darkslateblue', 'darkslategray', 'darkslategrey', 'darkturquoise', 'darkviolet', 'deeppink', 'deepskyblue', 'dimgray', 'dimgrey', 'dodgerblue', 'firebrick', 'floralwhite', 'forestgreen', 'fuchsia', 'gainsboro', 'ghostwhite', 'gold', 'goldenrod', 'gray', 'green', 'greenyellow', 'grey', 'honeydew', 'hotpink', 'indianred', 'indigo', 'ivory', 'khaki', 'lavender', 'lavenderblush', 'lawngreen', 'lemonchiffon', 'lightblue', 'lightcoral', 'lightcyan', 'lightgoldenrodyellow', 'lightgray', 'lightgreen', 'lightgrey', 'lightpink', 'lightsalmon', 'lightseagreen', 'lightskyblue', 'lightslategray', 'lightslategrey', 'lightsteelblue', 'lightyellow', 'lime', 'limegreen', 'linen', 'magenta', 'maroon', 'mediumaquamarine', 'mediumblue', 'mediumorchid', 'mediumpurple', 'mediumseagreen', 'mediumslateblue', 'mediumspringgreen', 'mediumturquoise', 'mediumvioletred', 'midnightblue', 'mintcream', 'mistyrose', 'moccasin', 'navajowhite', 'navy', 'oldlace', 'olive', 'olivedrab', 'orange', 'orangered', 'orchid', 'palegoldenrod', 'palegreen', 'paleturquoise', 'palevioletred', 'papayawhip', 'peachpuff', 'peru', 'pink', 'plum', 'powderblue', 'purple', 'rebeccapurple', 'red', 'rosybrown', 'royalblue', 'saddlebrown', 'salmon', 'sandybrown', 'seagreen', 'seashell', 'sienna', 'silver', 'skyblue', 'slateblue', 'slategray', 'slategrey', 'snow', 'springgreen', 'steelblue', 'tan', 'teal', 'thistle', 'tomato', 'turquoise', 'violet', 'wheat', 'white', 'whitesmoke', 'yellow', 'yellowgreen'];
        
        // 전체 코드에서 속성: 값 쌍 추출 및 검증
        const lines = code.split('\n');
        lines.forEach((line, lineIndex) => {
            // 주석 제거된 라인
            let lineToCheck = line;
            lineToCheck = lineToCheck.replace(/\/\*[\s\S]*?\*\//g, '');
            
            // 속성: 값 형식 찾기
            const colonIndex = lineToCheck.indexOf(':');
            if (colonIndex === -1) return;
            
            const valuePart = lineToCheck.substring(colonIndex + 1).trim();
            if (!valuePart || valuePart.startsWith('//')) return;
            
            // 세미콜론이나 중괄호 전까지가 값
            const valueEnd = Math.min(
                valuePart.indexOf(';') !== -1 ? valuePart.indexOf(';') : valuePart.length,
                valuePart.indexOf('}') !== -1 ? valuePart.indexOf('}') : valuePart.length
            );
            const cleanValue = valuePart.substring(0, valueEnd).trim();
            
            if (!cleanValue) return;
            
            // 색상 값인지 확인 (16진수, rgb 함수, 색상 이름)
            const isColorValue = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(cleanValue) || 
                                 /^(rgb|rgba|hsl|hsla)\s*\(/i.test(cleanValue) ||
                                 cssColorNames.includes(cleanValue.toLowerCase().trim());
            
            // 색상 값이면 단위 검증 스킵
            if (isColorValue) return;
            
            // 잘못된 단위 패턴 검사
            invalidUnitPatterns.forEach(({ pattern, message }) => {
                let match;
                // 정규식의 lastIndex 초기화
                pattern.lastIndex = 0;
                while ((match = pattern.exec(cleanValue)) !== null) {
                    const matchPosition = colonIndex + 1 + lineToCheck.substring(colonIndex + 1).indexOf(match[0]);
                    const absolutePosition = code.split('\n').slice(0, lineIndex).join('\n').length + (lineIndex > 0 ? 1 : 0) + matchPosition;
                    
                    // 문자열, 주석, 색상 코드 내부가 아닌지 확인
                    if (!isInsideString(code, absolutePosition) && 
                        !isInsideComment(code, absolutePosition) && 
                        !isInsideColorCode(code, absolutePosition)) {
                        errors.push({
                            type: 'error',
                            message: message,
                            line: lineIndex + 1
                        });
                    }
                }
            });
            
            // 일반적인 잘못된 단위 검사 (숫자 뒤에 알파벳이 오는 경우)
            const unitPattern = /(\d+(?:\.\d+)?)\s*([a-z]{2,4})\b/gi;
            let unitMatch;
            unitPattern.lastIndex = 0;
            while ((unitMatch = unitPattern.exec(cleanValue)) !== null) {
                const unit = unitMatch[2].toLowerCase();
                
                // 유효한 단위인지 확인
                const isValidUnit = validUnits.includes(unit);
                
                // CSS 키워드나 함수는 제외
                const cssKeywords = ['auto', 'none', 'inherit', 'initial', 'unset', 'revert', 'calc', 'var', 'url', 'rgb', 'rgba', 'hsl', 'hsla', 'linear', 'radial', 'repeat', 'no-repeat', 'center', 'left', 'right', 'top', 'bottom', 'middle', 'baseline', 'flex', 'grid', 'block', 'inline', 'table', 'absolute', 'relative', 'fixed', 'static', 'sticky', 'solid', 'dashed', 'dotted', 'double', 'groove', 'ridge', 'inset', 'outset', 'normal', 'bold', 'italic', 'oblique', 'underline', 'overline', 'line-through'];
                const isKeyword = cssKeywords.some(keyword => cleanValue.toLowerCase().includes(keyword));
                
                // 함수 호출인지 확인 (calc(), var() 등)
                const isFunction = /[a-z]+\s*\(/i.test(cleanValue.substring(Math.max(0, unitMatch.index - 10), unitMatch.index + unitMatch[0].length + 10));
                
                const matchPosition = colonIndex + 1 + lineToCheck.substring(colonIndex + 1).indexOf(unitMatch[0]);
                const absolutePosition = code.split('\n').slice(0, lineIndex).join('\n').length + (lineIndex > 0 ? 1 : 0) + matchPosition;
                
                // 문자열, 주석, 색상 코드 내부가 아닌지 확인
                if (!isInsideString(code, absolutePosition) && 
                    !isInsideComment(code, absolutePosition) && 
                    !isInsideColorCode(code, absolutePosition)) {
                    if (!isValidUnit && !isKeyword && !isFunction && unit.length >= 2) {
                        // 이미 처리된 오타 패턴은 제외
                        const commonTypos = ['rm', 'pxx', 'emm', 'pxm', 'remm', 'emx', 'remx'];
                        if (!commonTypos.includes(unit)) {
                            // 알려지지 않은 단위는 오류로 처리
                            errors.push({
                                type: 'error',
                                message: `잘못된 CSS 단위: "${unit}". 올바른 단위를 사용하세요 (예: px, em, rem, %, vh, vw 등).`,
                                line: lineIndex + 1
                            });
                        }
                    }
                }
            }
        });
        
        return {
            errors,
            warnings,
            isValid: errors.length === 0
        };
    }

    // TypeScript 검증
    function validateTS(code) {
        const errors = [];
        const warnings = [];
        
        if (!code.trim()) {
            errors.push({ type: 'error', message: '코드가 비어있습니다.' });
            return { errors, warnings, isValid: false };
        }
        
        // 문자열/주석/템플릿/정규식 리터럴을 고려한 스택 기반 검증
        const braceStack = [];
        const parenStack = [];
        const bracketStack = [];
        
        let inString = false;
        let stringChar = '';
        let inBlockComment = false;
        let inLineComment = false;
        let inRegex = false;
        let inTemplate = false;
        let templateExprDepth = 0;
        
        const isEscaped = (text, index) => {
            let count = 0;
            for (let i = index - 1; i >= 0 && text[i] === '\\'; i--) count++;
            return count % 2 === 1;
        };
        
        const prevSignificantChar = (text, index) => {
            for (let i = index - 1; i >= 0; i--) {
                if (!/\s/.test(text[i])) return text[i];
            }
            return '';
        };
        
        for (let i = 0; i < code.length; i++) {
            const char = code[i];
            const nextChar = i + 1 < code.length ? code[i + 1] : '';
            const prevChar = i > 0 ? code[i - 1] : '';
            
            // 라인 주석 종료
            if (inLineComment) {
                if (char === '\n') inLineComment = false;
                continue;
            }
            
            // 블록 주석 종료
            if (inBlockComment) {
                if (char === '*' && nextChar === '/') {
                    inBlockComment = false;
                    i++; // skip '/'
                }
                continue;
            }
            
            // 문자열 종료
            if (inString) {
                if (char === stringChar && !isEscaped(code, i)) {
                    inString = false;
                    stringChar = '';
                }
                continue;
            }
            
            // 정규식 리터럴 종료
            if (inRegex) {
                if (char === '/' && !isEscaped(code, i)) {
                    inRegex = false;
                }
                continue;
            }
            
            // 템플릿 리터럴 처리
            if (inTemplate) {
                // 템플릿 내 표현식 시작 ${ ... }
                if (char === '$' && nextChar === '{') {
                    templateExprDepth++;
                    i++; // skip '{'
                    continue;
                }
                // 템플릿 내 표현식일 때는 일반 코드로 처리
                if (templateExprDepth > 0) {
                    if (char === '{') templateExprDepth++;
                    if (char === '}') templateExprDepth--;
                    // 표현식 내부의 괄호/중괄호/대괄호만 스택 처리
                    if (templateExprDepth > 0) {
                        if (char === '{') braceStack.push({ line: getLineNumber(code, i) });
                        else if (char === '}') {
                            if (braceStack.length === 0) {
                                errors.push({ type: 'error', message: '예상치 못한 닫는 중괄호 }', line: getLineNumber(code, i) });
                            } else {
                                braceStack.pop();
                            }
                        } else if (char === '(') parenStack.push({ line: getLineNumber(code, i) });
                        else if (char === ')') {
                            if (parenStack.length === 0) errors.push({ type: 'error', message: '예상치 못한 닫는 괄호 )', line: getLineNumber(code, i) });
                            else parenStack.pop();
                        } else if (char === '[') bracketStack.push({ line: getLineNumber(code, i) });
                        else if (char === ']') {
                            if (bracketStack.length === 0) errors.push({ type: 'error', message: '예상치 못한 닫는 대괄호 ]', line: getLineNumber(code, i) });
                            else bracketStack.pop();
                        }
                    }
                    continue;
                }
                
                // 템플릿 종료
                if (char === '`') {
                    inTemplate = false;
                }
                continue;
            }
            
            // 주석 시작
            if (char === '/' && nextChar === '/') {
                inLineComment = true;
                continue;
            }
            if (char === '/' && nextChar === '*') {
                inBlockComment = true;
                i++; // skip '*'
                continue;
            }
            
            // 문자열 시작
            if (char === '"' || char === "'") {
                inString = true;
                stringChar = char;
                continue;
            }
            
            // 템플릿 시작
            if (char === '`') {
                inTemplate = true;
                templateExprDepth = 0;
                continue;
            }
            
            // 정규식 리터럴 시작 (단순 판별: 이전 의미 있는 문자가 없거나 여는 기호인 경우)
            if (char === '/' && !isEscaped(code, i)) {
                const prevSig = prevSignificantChar(code, i);
                if (!prevSig || /[=({[,!?:;]/.test(prevSig)) {
                    inRegex = true;
                    continue;
                }
            }
            
            // 스택 처리 (문자열/주석/템플릿/정규식이 아닌 경우)
            if (char === '{') {
                braceStack.push({ line: getLineNumber(code, i) });
            } else if (char === '}') {
                if (braceStack.length === 0) {
                    errors.push({ type: 'error', message: '예상치 못한 닫는 중괄호 }', line: getLineNumber(code, i) });
                } else {
                    braceStack.pop();
                }
            } else if (char === '(') {
                parenStack.push({ line: getLineNumber(code, i) });
            } else if (char === ')') {
                if (parenStack.length === 0) {
                    errors.push({ type: 'error', message: '예상치 못한 닫는 괄호 )', line: getLineNumber(code, i) });
                } else {
                    parenStack.pop();
                }
            } else if (char === '[') {
                bracketStack.push({ line: getLineNumber(code, i) });
            } else if (char === ']') {
                if (bracketStack.length === 0) {
                    errors.push({ type: 'error', message: '예상치 못한 닫는 대괄호 ]', line: getLineNumber(code, i) });
                } else {
                    bracketStack.pop();
                }
            }
        }
        
        // 미닫힘 괄호 체크
        braceStack.forEach(b => errors.push({ type: 'error', message: '닫히지 않은 여는 중괄호 {', line: b.line }));
        parenStack.forEach(p => errors.push({ type: 'error', message: '닫히지 않은 여는 괄호 (', line: p.line }));
        bracketStack.forEach(b => errors.push({ type: 'error', message: '닫히지 않은 여는 대괄호 [', line: b.line }));
        
        // try-catch 문법 검증 (간단한 개수 비교)
        const tryCount = (code.match(/\btry\s*{/g) || []).length;
        const catchCount = (code.match(/\bcatch\s*\(/g) || []).length;
        
        if (tryCount !== catchCount) {
            warnings.push({
                type: 'warning',
                message: `try 문과 catch 문의 개수가 일치하지 않습니다.`
            });
        }
        
        // TypeScript 특유의 검증
        // 1. 타입 선언 검증 (interface, type, enum 등)
        const interfaceCount = (code.match(/\binterface\s+\w+/g) || []).length;
        const typeAliasCount = (code.match(/\btype\s+\w+\s*=/g) || []).length;
        const enumCount = (code.match(/\benum\s+\w+/g) || []).length;
        
        // 2. 타입 어노테이션 검증 (기본적인 패턴만)
        // 함수 매개변수에 타입이 없는 경우 경고 (선택사항)
        const functionParams = code.match(/\bfunction\s+\w+\s*\([^)]*\)/g) || [];
        functionParams.forEach(func => {
            // 타입 어노테이션이 없는 매개변수 확인
            const params = func.match(/\(([^)]*)\)/)?.[1] || '';
            if (params && !params.includes(':')) {
                // 매개변수가 있지만 타입이 없는 경우 (선택사항이므로 경고만)
                // 경고는 생략 (TypeScript에서 선택사항일 수 있음)
            }
        });
        
        // 3. 제네릭 검증 (<> 괄호 일치)
        const genericOpen = (code.match(/<[^>]*>/g) || []).length;
        // 제네릭의 중첩을 고려한 검증은 복잡하므로 기본 검증만 수행
        
        // 4. 접근 제한자 검증 (public, private, protected)
        const accessModifiers = ['public', 'private', 'protected', 'readonly'];
        const lines = code.split('\n');
        lines.forEach((line, index) => {
            // 접근 제한자가 잘못 사용된 경우 확인
            accessModifiers.forEach(modifier => {
                if (line.includes(modifier) && !line.match(new RegExp(`\\b${modifier}\\s+(readonly\\s+)?(static\\s+)?(async\\s+)?(function|const|let|var|class|interface|enum|type)`))) {
                    // 접근 제한자가 올바른 위치에 있는지 확인 (간단한 검증)
                }
            });
        });
        
        // 5. as 키워드 사용 검증 (타입 단언)
        // as 키워드 뒤에 타입이 있는지 확인
        const asPattern = /\bas\s+([a-zA-Z_$][a-zA-Z0-9_$<>[\],\s|&]*?)(?=\s|;|,|\)|$)/g;
        let asMatch;
        const codeWithoutComments = code.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
        while ((asMatch = asPattern.exec(codeWithoutComments)) !== null) {
            const typeAfterAs = asMatch[1].trim();
            if (!typeAfterAs || typeAfterAs.length === 0) {
                const matchIndex = codeWithoutComments.indexOf(asMatch[0], asMatch.index);
                errors.push({
                    type: 'error',
                    message: 'as 키워드 뒤에 타입이 없습니다.',
                    line: getLineNumber(code, matchIndex)
                });
            }
        }
        
        // 6. 타입 가드 검증 (is 키워드)
        const isTypeGuard = code.match(/\bis\s+[a-zA-Z_$]/g) || [];
        
        // 7. namespace 검증
        const namespaceCount = (code.match(/\bnamespace\s+\w+/g) || []).length;
        
        // 8. declare 키워드 검증
        const declareCount = (code.match(/\bdeclare\s+/g) || []).length;
        
        return {
            errors,
            warnings,
            isValid: errors.length === 0
        };
    }

    // 자가 닫힘 태그 확인
    function isSelfClosingTag(tagName) {
        const selfClosingTags = ['img', 'br', 'hr', 'input', 'meta', 'link', 'area', 'base', 'col', 'embed', 'source', 'track', 'wbr'];
        return selfClosingTags.includes(tagName.toLowerCase());
    }

    // 라인 번호 가져오기
    function getLineNumber(code, index) {
        return code.substring(0, index).split('\n').length;
    }

    // 코드 포맷팅
    function formatCode(code, type) {
        if (!code.trim()) return '';
        
        if (type === 'html') {
            return formatHTML(code);
        } else if (type === 'css') {
            return formatCSS(code);
        } else if (type === 'ts') {
            return formatTS(code);
        }
        return code;
    }

    // HTML 포맷팅
    function formatHTML(code) {
        let formatted = code;
        let indent = 0;
        const indentSize = 2;
        
        formatted = formatted
            .replace(/>\s*</g, '>\n<')
            .split('\n')
            .map(line => {
                line = line.trim();
                if (!line) return '';
                
                if (line.startsWith('</')) {
                    indent--;
                }
                
                const indented = ' '.repeat(Math.max(0, indent * indentSize)) + line;
                
                if (line.startsWith('<') && !line.startsWith('</') && 
                    !line.endsWith('/>') && !isSelfClosingTag(line.match(/<(\w+)/)?.[1])) {
                    indent++;
                }
                
                return indented;
            })
            .filter(line => line.trim())
            .join('\n');
        
        return formatted;
    }

    // CSS 포맷팅
    function formatCSS(code) {
        let formatted = code;
        let indent = 0;
        const indentSize = 2;
        
        formatted = formatted
            .replace(/\s*{\s*/g, ' {\n')
            .replace(/\s*}\s*/g, '\n}\n')
            .replace(/\s*;\s*/g, ';\n')
            .split('\n')
            .map(line => {
                line = line.trim();
                if (!line) return '';
                
                if (line.endsWith('}')) {
                    indent--;
                }
                
                const indented = ' '.repeat(Math.max(0, indent * indentSize)) + line;
                
                if (line.endsWith('{')) {
                    indent++;
                }
                
                return indented;
            })
            .filter(line => line.trim())
            .join('\n');
        
        return formatted;
    }

    // TypeScript 포맷팅
    function formatTS(code) {
        let formatted = code;
        let indent = 0;
        const indentSize = 2;
        
        formatted = formatted
            .replace(/\s*{\s*/g, ' {\n')
            .replace(/\s*}\s*/g, '\n}\n')
            .replace(/\s*;\s*/g, ';\n')
            .split('\n')
            .map(line => {
                line = line.trim();
                if (!line) return '';
                
                if (line.endsWith('}') || line.endsWith(']') || line.endsWith(')')) {
                    indent--;
                }
                
                const indented = ' '.repeat(Math.max(0, indent * indentSize)) + line;
                
                if (line.endsWith('{') || line.endsWith('[') || line.endsWith('(')) {
                    indent++;
                }
                
                return indented;
            })
            .filter(line => line.trim())
            .join('\n');
        
        return formatted;
    }

    // 검증 결과 표시
    function displayResult(result) {
        validationResult.innerHTML = '';
        
        if (result.isValid && result.warnings.length === 0) {
            validationResult.innerHTML = '<div class="result-success">✅ 코드가 유효합니다!</div>';
        } else {
            if (result.errors.length > 0) {
                result.errors.forEach(error => {
                    const errorDiv = document.createElement('div');
                    errorDiv.className = 'result-error';
                    errorDiv.innerHTML = `❌ <strong>오류:</strong> ${error.message}${error.line ? ` (라인 ${error.line})` : ''}`;
                    validationResult.appendChild(errorDiv);
                });
            }
            
            if (result.warnings.length > 0) {
                result.warnings.forEach(warning => {
                    const warningDiv = document.createElement('div');
                    warningDiv.className = 'result-warning';
                    warningDiv.innerHTML = `⚠️ <strong>경고:</strong> ${warning.message}${warning.line ? ` (라인 ${warning.line})` : ''}`;
                    validationResult.appendChild(warningDiv);
                });
            }
        }
        
        resultSection.style.display = 'block';
    }

    // 검증 버튼 클릭
    validateBtn.addEventListener('click', function() {
        const code = codeInput.value;
        let result;
        
        if (currentType === 'html') {
            result = validateHTML(code);
        } else if (currentType === 'css') {
            result = validateCSS(code);
        } else if (currentType === 'ts') {
            result = validateTS(code);
        }
        
        displayResult(result);
    });

    // 포맷팅 버튼 클릭
    formatBtn.addEventListener('click', function() {
        const code = codeInput.value;
        const formatted = formatCode(code, currentType);
        
        if (formatted) {
            formattedCode.textContent = formatted;
            formatSection.style.display = 'block';
        }
    });

    // 지우기 버튼 클릭
    clearBtn.addEventListener('click', function() {
        codeInput.value = '';
        resultSection.style.display = 'none';
        formatSection.style.display = 'none';
    });

    // 결과 복사
    copyResultBtn.addEventListener('click', function() {
        const text = validationResult.innerText;
        navigator.clipboard.writeText(text).then(() => {
            showToast('검증 결과가 복사되었습니다.');
        });
    });

    // 포맷팅 코드 복사
    copyFormatBtn.addEventListener('click', function() {
        const text = formattedCode.textContent;
        navigator.clipboard.writeText(text).then(() => {
            showToast('포맷팅된 코드가 복사되었습니다.');
        });
    });

    // 토스트 메시지 표시
    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'copy-toast';
        toast.textContent = message;
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
    }
});

