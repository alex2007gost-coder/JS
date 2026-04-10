// parser.js - Преобразование Markdown в HTML

// Экранирование спецсимволов HTML
function escapeHtml(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}

// Основная функция парсинга Markdown
export function parseMarkdown(md) {
    let html = md;
    
    // 1. Блоки кода (обрабатываем первыми!)
    html = html.replace(/```(\w*)\n([\s\S]*?)```/g, function(match, lang, code) {
        const cls = lang ? `class="language-${lang}"` : '';
        return `<pre><code ${cls}>${escapeHtml(code.trim())}</code></pre>`;
    });
    
    // 2. Горизонтальная линия
    html = html.replace(/^---$/gm, '<hr>');
    
    // 3. Заголовки (от h1 до h3)
    html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');
    
    // 4. Жирный текст
    html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');
    
    // 5. Курсив
    html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
    html = html.replace(/_(.+?)_/g, '<em>$1</em>');
    
    // 6. Инлайн-код
    html = html.replace(/`([^`]+)`/g, function(match, code) {
        return `<code>${escapeHtml(code)}</code>`;
    });
    
    // 7. Ссылки [текст](url)
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, function(match, text, url) {
        return `<a href="${url}" target="_blank" rel="noopener noreferrer">${text}</a>`;
    });
    
    // 8. Ненумерованные списки
    html = html.replace(/^\- (.+)$/gm, '<li>$1</li>');
    html = html.replace(/((?:<li>.*<\/li>\n?)+)/g, '<ul>$1</ul>');
    
    // 9. Нумерованные списки
    html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>');
    html = html.replace(/((?:<li>.*<\/li>\n?)+)(?=<ul>|$)/g, function(match) {
        if (!match.includes('<ul>')) {
            return `<ol>${match}</ol>`;
        }
        return match;
    });
    
    // 10. Цитаты
    html = html.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>');
    
    // 11. Параграфы (обрабатываем то, что ещё не обёрнуто)
    const lines = html.split('\n');
    let result = [];
    let inParagraph = false;
    let paragraphContent = [];
    
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();
        
        // Пропускаем пустые строки
        if (line === '') {
            if (inParagraph) {
                result.push(`<p>${paragraphContent.join(' ')}</p>`);
                inParagraph = false;
                paragraphContent = [];
            }
            continue;
        }
        
        // Пропускаем уже обёрнутые теги
        const wrappedTags = ['<h', '<p>', '<ul', '<ol', '<li', '<pre', '<blockquote', '<hr'];
        let isWrapped = false;
        for (const tag of wrappedTags) {
            if (line.startsWith(tag)) {
                isWrapped = true;
                break;
            }
        }
        
        if (isWrapped) {
            if (inParagraph) {
                result.push(`<p>${paragraphContent.join(' ')}</p>`);
                inParagraph = false;
                paragraphContent = [];
            }
            result.push(line);
        } else {
            inParagraph = true;
            paragraphContent.push(line);
        }
    }
    
    if (inParagraph && paragraphContent.length > 0) {
        result.push(`<p>${paragraphContent.join(' ')}</p>`);
    }
    
    html = result.join('\n');
    
    return html;
}

// Генерация оглавления из заголовков h2
export function generateTOC(html) {
    const headingRegex = /<h2>(.*?)<\/h2>/g;
    const headings = [];
    let match;
    
    while ((match = headingRegex.exec(html)) !== null) {
        headings.push({
            text: match[1],
            id: `section-${headings.length}`
        });
    }
    
    if (headings.length === 0) return '';
    
    // Добавляем id к заголовкам в HTML
    let modifiedHtml = html;
    headings.forEach((heading, index) => {
        const oldHeading = `<h2>${heading.text}</h2>`;
        const newHeading = `<h2 id="${heading.id}">${heading.text}</h2>`;
        modifiedHtml = modifiedHtml.replace(oldHeading, newHeading);
    });
    
    // Создаём HTML оглавления
    const tocItems = headings.map(h => 
        `<li><a href="#${h.id}">${h.text}</a></li>`
    ).join('');
    
    const tocHtml = `
        <div class="toc">
            <h4>📑 Содержание</h4>
            <ul>${tocItems}</ul>
        </div>
    `;
    
    return { toc: tocHtml, html: modifiedHtml };
}

// Подсчёт времени чтения
export function calculateReadingTime(text) {
    const wordsPerMinute = 200;
    const words = text.trim().split(/\s+/).length;
    const minutes = Math.ceil(words / wordsPerMinute);
    return minutes === 1 ? '1 минута' : `${minutes} минут`;
}