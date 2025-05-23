// Enhanced main.js with proper i18n support for all pages
document.addEventListener('DOMContentLoaded', function() {
    // 初始化i18n
    initializeI18n();
    
    // 移動選單功能
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }
    
    // 測驗功能
    initializeQuiz();
    
    // 投影片功能
    initializeSlides();
    
    // 術語搜尋功能
    initializeTermSearch();
});

// i18n功能
let translations = {};
let currentLanguage = '';

// 初始化i18n
async function initializeI18n() {
    // 從URL獲取語言設置
    const urlParams = new URLSearchParams(window.location.search);
    let lang = urlParams.get('lang');
    
    // 如果URL中沒有語言參數，則從localStorage獲取或使用默認語言
    if (!lang) {
        lang = localStorage.getItem('language') || 'zh';
    }
    
    // 保存語言設置到localStorage
    localStorage.setItem('language', lang);
    
    // 載入翻譯文件
    await loadTranslations(lang);
    
    // 更新頁面內容
    updatePageContent();
    
    // 添加語言選擇器
    addLanguageSelector();
}

// 載入翻譯文件
async function loadTranslations(lang) {
    try {
        const response = await fetch(`locales/${lang}.json`);
        if (!response.ok) {
            throw new Error(`Failed to load translations for ${lang}`);
        }
        translations = await response.json();
        currentLanguage = lang;
        
        // 更新HTML的lang屬性
        document.documentElement.lang = lang === 'zh' ? 'zh-Hant' : 'en';
    } catch (error) {
        console.error('Error loading translations:', error);
        // 如果載入失敗，嘗試載入默認語言
        if (lang !== 'zh') {
            await loadTranslations('zh');
        }
    }
}

// 獲取翻譯
function t(key) {
    const keys = key.split('.');
    let value = translations;
    
    for (const k of keys) {
        if (value && value[k] !== undefined) {
            value = value[k];
        } else {
            console.warn(`Translation key not found: ${key}`);
            return key;
        }
    }
    
    return value;
}

// 更新頁面內容
function updatePageContent() {
    // 更新頁面標題
    document.title = getPageTitle();
    
    // 更新所有帶有 data-i18n 屬性的元素
    updateI18nElements();
    
    // 根據頁面類型更新特殊內容
    const currentPage = getCurrentPage();
    
    switch (currentPage) {
        case 'index':
            updateHomePage();
            break;
        case 'courses':
            updateCoursesPage();
            break;
        case 'terminology':
            updateTerminologyPage();
            break;
        case 'about':
            updateAboutPage();
            break;
        case 'day':
            updateDayPage();
            break;
        case 'quiz':
            updateQuizPage();
            break;
        case 'slides':
            updateSlidesPage();
            break;
        default:
            break;
    }
    
    // 更新所有鏈接的語言參數
    updateAllLinks();
}

// 更新所有帶有 data-i18n 屬性的元素
function updateI18nElements() {
    const elements = document.querySelectorAll('[data-i18n]');
    
    elements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        const translation = t(key);
        
        if (translation && translation !== key) {
            element.textContent = translation;
        }
    });
}

// 獲取當前頁面類型
function getCurrentPage() {
    const path = window.location.pathname;
    const filename = path.split('/').pop();
    
    if (filename === 'index.html' || path.endsWith('/')) {
        return 'index';
    } else if (filename === 'courses.html') {
        return 'courses';
    } else if (filename === 'terminology.html') {
        return 'terminology';
    } else if (filename === 'about.html') {
        return 'about';
    } else if (filename.includes('day') && filename.includes('quiz')) {
        return 'quiz';
    } else if (filename.includes('day') && filename.includes('slides')) {
        return 'slides';
    } else if (filename.includes('day') && !filename.includes('quiz') && !filename.includes('slides')) {
        return 'day';
    }
    
    return 'other';
}

// 獲取頁面標題
function getPageTitle() {
    const currentPage = getCurrentPage();
    let title = '';
    
    switch (currentPage) {
        case 'index':
            title = `${t('home.title')} - ${t('home.subtitle')}`;
            break;
        case 'courses':
            title = `${t('nav.courses')} - ${t('home.title')}`;
            break;
        case 'terminology':
            title = `${t('nav.terminology')} - ${t('home.title')}`;
            break;
        case 'about':
            title = `${t('nav.about')} - ${t('home.title')}`;
            break;
        case 'day':
            const dayMatch = window.location.pathname.match(/day(\d+)/);
            if (dayMatch && dayMatch[1]) {
                const dayNum = dayMatch[1];
                title = `${t(`footer.day${dayNum}`)} - ${t('home.title')}`;
            } else {
                title = t('home.title');
            }
            break;
        case 'quiz':
            const quizDayMatch = window.location.pathname.match(/day(\d+)/);
            if (quizDayMatch && quizDayMatch[1]) {
                const dayNum = quizDayMatch[1];
                title = `${t(`quiz.day${dayNum}.title`)} - ${t('home.title')}`;
            } else {
                title = `${t('quiz.submit')} - ${t('home.title')}`;
            }
            break;
        case 'slides':
            const slidesDayMatch = window.location.pathname.match(/day(\d+)/);
            if (slidesDayMatch && slidesDayMatch[1]) {
                const dayNum = slidesDayMatch[1];
                title = `${t(`slides.day${dayNum}.title`)} - ${t('home.title')}`;
            } else {
                title = `${t('slides.next')} - ${t('home.title')}`;
            }
            break;
        default:
            title = t('home.title');
            break;
    }
    
    return title;
}

// 更新首頁內容
function updateHomePage() {
    // 更新英雄區塊
    const heroTitle = document.querySelector('.hero-content h1');
    const heroSubtitle = document.querySelector('.hero-content h2');
    const heroDescription = document.querySelector('.hero-content p');
    const heroButton = document.querySelector('.hero-content .btn');
    
    if (heroTitle) heroTitle.textContent = t('home.title');
    if (heroSubtitle) heroSubtitle.textContent = t('home.subtitle');
    if (heroDescription) heroDescription.textContent = t('home.description');
    if (heroButton) heroButton.textContent = t('home.startLearning');
    
    // 更新特色區塊
    const featuresTitle = document.querySelector('.features .section-title');
    if (featuresTitle) featuresTitle.textContent = t('home.features.title');
    
    const featureItems = document.querySelectorAll('.feature-item');
    if (featureItems.length >= 4) {
        for (let i = 0; i < 4; i++) {
            const title = featureItems[i].querySelector('h3');
            const desc = featureItems[i].querySelector('p');
            
            if (title) title.textContent = t(`home.features.item${i+1}.title`);
            if (desc) desc.textContent = t(`home.features.item${i+1}.description`);
        }
    }
    
    // 更新課程概覽
    const overviewTitle = document.querySelector('.course-overview .section-title');
    if (overviewTitle) overviewTitle.textContent = t('home.courseOverview.title');
    
    const timelineItems = document.querySelectorAll('.timeline-item');
    if (timelineItems.length >= 5) {
        for (let i = 0; i < 5; i++) {
            const title = timelineItems[i].querySelector('h3');
            const desc = timelineItems[i].querySelector('p');
            const link = timelineItems[i].querySelector('.timeline-link');
            
            if (title) title.textContent = t(`home.courseOverview.day${i+1}.title`);
            if (desc) desc.textContent = t(`home.courseOverview.day${i+1}.description`);
            if (link) link.textContent = t(`home.courseOverview.day${i+1}.link`);
        }
    }
    
    // 更新CTA區塊
    const ctaTitle = document.querySelector('.cta-content h2');
    const ctaDesc = document.querySelector('.cta-content p');
    const ctaButton = document.querySelector('.cta-content .btn');
    
    if (ctaTitle) ctaTitle.textContent = t('home.cta.title');
    if (ctaDesc) ctaDesc.textContent = t('home.cta.description');
    if (ctaButton) ctaButton.textContent = t('home.cta.button');
}

// 更新課程頁面內容
function updateCoursesPage() {
    // 更新課程卡片
    const courseCards = document.querySelectorAll('.course-card');
    if (courseCards.length >= 5) {
        for (let i = 0; i < 5; i++) {
            const dayNum = i + 1;
            const title = courseCards[i].querySelector('.course-title');
            const desc = courseCards[i].querySelector('.course-desc');
            const img = courseCards[i].querySelector('.course-img');
            
            if (title) title.textContent = t(`courses.day${dayNum}.title`);
            if (desc) desc.textContent = t(`courses.day${dayNum}.description`);
            if (img) img.alt = t(`courses.day${dayNum}.title`);
            
            // 更新按鈕
            const buttons = courseCards[i].querySelectorAll('.course-btn');
            if (buttons.length >= 3) {
                buttons[0].textContent = t('courses.materials');
                buttons[1].textContent = t('courses.slides');
                buttons[2].textContent = t('courses.quiz');
            }
        }
    }
    
    // 更新課程概述
    const overviewDesc = document.querySelector('.course-overview-content p');
    if (overviewDesc) overviewDesc.textContent = t('courses.overviewDescription');
    
    // 更新課程目標
    const objectivesList = document.querySelector('.course-overview-content ul:nth-of-type(1)');
    if (objectivesList) {
        const items = objectivesList.querySelectorAll('li');
        const objectives = t('courses.objectivesList');
        
        items.forEach((item, index) => {
            if (index < objectives.length) {
                item.textContent = objectives[index];
            }
        });
    }
    
    // 更新課程特色
    const featuresList = document.querySelector('.course-overview-content ul:nth-of-type(2)');
    if (featuresList) {
        const items = featuresList.querySelectorAll('li');
        const features = t('courses.featuresList');
        
        items.forEach((item, index) => {
            if (index < features.length) {
                item.textContent = features[index];
            }
        });
    }
}

// 更新術語表頁面內容
function updateTerminologyPage() {
    const searchButton = document.querySelector('.term-search button');
    const searchInput = document.querySelector('.term-search input');
    
    if (searchButton) searchButton.textContent = t('terminology.search');
    if (searchInput) searchInput.placeholder = t('terminology.searchPlaceholder');
}

// 更新關於頁面內容
function updateAboutPage() {
    // Most content is handled by data-i18n attributes
    // Handle special formatting for features and structure sections
    const sections = document.querySelectorAll('.course-section');
    
    // Update features section with proper formatting
    if (sections.length >= 2) {
        const featureItems = sections[1].querySelectorAll('li');
        for (let i = 1; i <= 5; i++) {
            if (featureItems[i-1]) {
                const featureText = t(`about.features.item${i}`);
                const parts = featureText.split('：');
                if (parts.length === 2) {
                    featureItems[i-1].innerHTML = `<strong>${parts[0]}</strong>：${parts[1]}`;
                } else {
                    featureItems[i-1].textContent = featureText;
                }
            }
        }
    }
    
    // Update structure section with proper formatting
    if (sections.length >= 3) {
        const structureItems = sections[2].querySelectorAll('li');
        for (let i = 1; i <= 5; i++) {
            if (structureItems[i-1]) {
                const structureText = t(`about.structure.day${i}`);
                const parts = structureText.split(' - ');
                if (parts.length === 2) {
                    structureItems[i-1].innerHTML = `<strong>${parts[0]}</strong> - ${parts[1]}`;
                } else {
                    structureItems[i-1].textContent = structureText;
                }
            }
        }
    }
}

// 更新課程日頁面內容
function updateDayPage() {
    const dayMatch = window.location.pathname.match(/day(\d+)/);
    if (!dayMatch || !dayMatch[1]) return;
    
    const dayNum = dayMatch[1];
    
    // 更新列表內容
    updateDayPageLists(dayNum);
    
    // 更新論證示例
    const argumentExample = document.querySelector('.argument-example');
    if (argumentExample) {
        const example = t(`day${dayNum}.arguments.example`);
        argumentExample.innerHTML = example.replace(/\n/g, '<br>');
    }
    
    // 更新心智圖說明
    const mindmapCaption = document.querySelector('.mindmap-caption');
    if (mindmapCaption) {
        mindmapCaption.textContent = t(`day${dayNum}.title`);
    }
    
    // 更新圖片alt屬性
    const courseImage = document.querySelector('.course-image');
    if (courseImage) {
        courseImage.alt = t(`day${dayNum}.languageFunctions.title`);
    }
}

// 更新課程日頁面的列表內容
function updateDayPageLists(dayNum) {
    // 更新課程目標列表
    const goalsList = document.querySelector('.course-goals-list');
    if (goalsList) {
        const goals = t(`day${dayNum}.courseGoals.goals`);
        if (Array.isArray(goals)) {
            goalsList.innerHTML = '';
            goals.forEach(goal => {
                const li = document.createElement('li');
                li.textContent = goal;
                goalsList.appendChild(li);
            });
        }
    }
    
    // 更新核心問題列表
    const questionsList = document.querySelector('.core-questions-list');
    if (questionsList) {
        const questions = t(`day${dayNum}.whatIsLogic.questions`);
        if (Array.isArray(questions)) {
            questionsList.innerHTML = '';
            questions.forEach(question => {
                const li = document.createElement('li');
                li.textContent = question;
                questionsList.appendChild(li);
            });
        }
    }
    
    // 更新陳述句示例列表
    const statementsExamplesList = document.querySelector('.statements-examples-list');
    if (statementsExamplesList) {
        const examples = t(`day${dayNum}.statements.statementsExamplesList`);
        if (Array.isArray(examples)) {
            statementsExamplesList.innerHTML = '';
            examples.forEach(example => {
                const li = document.createElement('li');
                li.textContent = example;
                statementsExamplesList.appendChild(li);
            });
        }
    }
    
    // 更新非陳述句示例列表
    const nonStatementsExamplesList = document.querySelector('.non-statements-examples-list');
    if (nonStatementsExamplesList) {
        const examples = t(`day${dayNum}.statements.nonStatementsExamplesList`);
        if (Array.isArray(examples)) {
            nonStatementsExamplesList.innerHTML = '';
            examples.forEach(example => {
                const li = document.createElement('li');
                li.textContent = example;
                nonStatementsExamplesList.appendChild(li);
            });
        }
    }
    
    // 更新結論指示詞列表
    const conclusionIndicatorsList = document.querySelector('.conclusion-indicators-list');
    if (conclusionIndicatorsList) {
        const indicators = t(`day${dayNum}.arguments.conclusionIndicators`);
        if (Array.isArray(indicators)) {
            conclusionIndicatorsList.innerHTML = '';
            indicators.forEach(indicator => {
                const li = document.createElement('li');
                li.textContent = indicator;
                conclusionIndicatorsList.appendChild(li);
            });
        }
    }
    
    // 更新前提指示詞列表
    const premiseIndicatorsList = document.querySelector('.premise-indicators-list');
    if (premiseIndicatorsList) {
        const indicators = t(`day${dayNum}.arguments.premiseIndicators`);
        if (Array.isArray(indicators)) {
            premiseIndicatorsList.innerHTML = '';
            indicators.forEach(indicator => {
                const li = document.createElement('li');
                li.textContent = indicator;
                premiseIndicatorsList.appendChild(li);
            });
        }
    }
    
    // 更新總結要點列表
    const summaryPointsList = document.querySelector('.summary-points-list');
    if (summaryPointsList) {
        const points = t(`day${dayNum}.summary.points`);
        if (Array.isArray(points)) {
            summaryPointsList.innerHTML = '';
            points.forEach(point => {
                const li = document.createElement('li');
                li.textContent = point;
                summaryPointsList.appendChild(li);
            });
        }
    }
}

// 更新測驗頁面內容
function updateQuizPage() {
    const dayMatch = window.location.pathname.match(/day(\d+)/);
    if (!dayMatch || !dayMatch[1]) return;
    
    const dayNum = dayMatch[1];
    
    // 更新測驗說明
    const quizInstructions = document.querySelector('.quiz-instructions');
    if (quizInstructions && translations.quiz[`day${dayNum}`] && translations.quiz[`day${dayNum}`].instructions) {
        const instructions = t(`quiz.day${dayNum}.instructions`);
        const paragraphs = quizInstructions.querySelectorAll('p');
        
        instructions.forEach((text, i) => {
            if (i < paragraphs.length) {
                paragraphs[i].textContent = text;
            }
        });
    }
    
    // 更新問題和選項
    const questions = document.querySelectorAll('.quiz-question');
    if (questions.length > 0 && translations.quiz[`day${dayNum}`] && translations.quiz[`day${dayNum}`].questions) {
        questions.forEach((question, index) => {
            const questionNum = index + 1;
            const questionKey = `quiz.day${dayNum}.questions.q${questionNum}`;
            
            // 更新問題文本
            const questionText = question.querySelector('.question-text');
            if (questionText && translations.quiz[`day${dayNum}`].questions[`q${questionNum}`]) {
                questionText.textContent = t(`${questionKey}.text`);
            }
            
            // 更新選項
            const options = question.querySelectorAll('.quiz-option');
            if (options.length > 0 && translations.quiz[`day${dayNum}`].questions[`q${questionNum}`] && translations.quiz[`day${dayNum}`].questions[`q${questionNum}`].options) {
                const optionTexts = t(`${questionKey}.options`);
                
                options.forEach((option, i) => {
                    if (i < optionTexts.length) {
                        option.textContent = optionTexts[i];
                    }
                });
            }
        });
    }
    
    // 更新複習要點
    const reviewPoints = document.querySelector('.review-points ol');
    if (reviewPoints && translations.quiz[`day${dayNum}`] && translations.quiz[`day${dayNum}`].reviewPoints) {
        const points = t(`quiz.day${dayNum}.reviewPoints`);
        const listItems = reviewPoints.querySelectorAll('li');
        
        points.forEach((point, i) => {
            if (i < listItems.length) {
                listItems[i].textContent = point;
            }
        });
    }
}

// 更新投影片頁面內容
function updateSlidesPage() {
    const dayMatch = window.location.pathname.match(/day(\d+)/);
    if (!dayMatch || !dayMatch[1]) return;
    
    const dayNum = dayMatch[1];
    
    // 更新投影片內容
    const slides = document.querySelectorAll('.slide');
    slides.forEach((slide, index) => {
        const slideNum = index + 1;
        const slideKey = `slides.day${dayNum}.slide${slideNum}`;
        
        // 更新標題
        const slideHeading = slide.querySelector('h2');
        if (slideHeading && translations.slides[`day${dayNum}`] && translations.slides[`day${dayNum}`][`slide${slideNum}`]) {
            slideHeading.textContent = t(`${slideKey}.title`);
        }
        
        // 更新內容
        if (translations.slides[`day${dayNum}`] && translations.slides[`day${dayNum}`][`slide${slideNum}`]) {
            // 處理目標列表
            if (translations.slides[`day${dayNum}`][`slide${slideNum}`].goals) {
                const goalsList = slide.querySelector('ul');
                if (goalsList) {
                    const goals = t(`${slideKey}.goals`);
                    const listItems = goalsList.querySelectorAll('li');
                    
                    goals.forEach((goal, i) => {
                        if (i < listItems.length) {
                            listItems[i].textContent = goal;
                        }
                    });
                }
            }
            
            // 處理問題列表
            if (translations.slides[`day${dayNum}`][`slide${slideNum}`].questions) {
                const questionsList = slide.querySelector('ul');
                if (questionsList) {
                    const questions = t(`${slideKey}.questions`);
                    const listItems = questionsList.querySelectorAll('li');
                    
                    questions.forEach((question, i) => {
                        if (i < listItems.length) {
                            listItems[i].textContent = question;
                        }
                    });
                }
            }
            
            // 處理一般內容
            if (translations.slides[`day${dayNum}`][`slide${slideNum}`].content) {
                const content = t(`${slideKey}.content`);
                
                // 處理段落
                const paragraphs = slide.querySelectorAll('p');
                if (paragraphs.length > 0) {
                    content.forEach((text, i) => {
                        if (i < paragraphs.length) {
                            paragraphs[i].textContent = text;
                        }
                    });
                }
                
                // 處理列表項
                const listItems = slide.querySelectorAll('ul > li');
                if (listItems.length > 0 && content.length > paragraphs.length) {
                    for (let i = paragraphs.length; i < content.length; i++) {
                        const listIndex = i - paragraphs.length;
                        if (listIndex < listItems.length) {
                            listItems[listIndex].textContent = content[i];
                        }
                    }
                }
            }
        }
    });
}

// 更新所有鏈接的語言參數
function updateAllLinks() {
    const links = document.querySelectorAll('a[href]');
    links.forEach(link => {
        const href = link.getAttribute('href');
        if (href && !href.startsWith('#') && !href.startsWith('http') && !href.startsWith('mailto')) {
            link.setAttribute('href', updateUrlWithLanguage(href));
        }
    });
}

// 添加語言選擇器
function addLanguageSelector() {
    // 檢查是否已存在語言選擇器
    if (document.querySelector('.language-selector')) {
        return;
    }
    
    // 創建語言選擇器容器
    const languageSelector = document.createElement('div');
    languageSelector.className = 'language-selector';
    
    // 創建下拉選單
    const select = document.createElement('select');
    select.id = 'language-select';
    
    // 添加選項
    const languages = [
        { code: 'en', name: t('languageSelector.languages.en') },
        { code: 'zh', name: t('languageSelector.languages.zh') }
    ];
    
    languages.forEach(lang => {
        const option = document.createElement('option');
        option.value = lang.code;
        option.textContent = lang.name;
        option.selected = currentLanguage === lang.code;
        select.appendChild(option);
    });
    
    // 將元素添加到容器
    languageSelector.appendChild(select);
    
    // 將語言選擇器添加到導航欄
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        navbar.appendChild(languageSelector);
    }
    
    // 添加事件監聽器
    select.addEventListener('change', function() {
        const newLang = this.value;
        changeLanguage(newLang);
    });
    
    // 添加樣式
    const style = document.createElement('style');
    style.textContent = `
        .language-selector {
            margin-left: 20px;
            display: flex;
            align-items: center;
        }
        
        .language-selector select {
            padding: 5px;
            border-radius: var(--border-radius);
            border: 1px solid var(--light-gray);
            background-color: white;
            cursor: pointer;
        }
        
        @media (max-width: 768px) {
            .language-selector {
                position: absolute;
                top: 15px;
                right: 60px;
            }
        }
    `;
    
    document.head.appendChild(style);
}

// 切換語言
async function changeLanguage(lang) {
    // 保存語言設置
    localStorage.setItem('language', lang);
    
    // 更新URL
    const newUrl = updateUrlWithLanguage(window.location.href, lang);
    window.history.replaceState({}, '', newUrl);
    
    // 重新載入翻譯
    await loadTranslations(lang);
    
    // 更新頁面內容
    updatePageContent();
}

// 更新URL以包含語言參數
function updateUrlWithLanguage(url, lang) {
    lang = lang || currentLanguage;
    
    // 解析URL
    let urlObj;
    try {
        urlObj = new URL(url, window.location.origin);
    } catch (e) {
        urlObj = new URL(url, window.location.origin);
    }
    
    // 設置語言參數
    urlObj.searchParams.set('lang', lang);
    
    return urlObj.toString();
}

// 測驗功能
function initializeQuiz() {
    const quizContainer = document.querySelector('.quiz-container');
    if (!quizContainer) return;
    
    const quizOptions = document.querySelectorAll('.quiz-option');
    const submitBtn = document.querySelector('.quiz-submit');
    const resultsContainer = document.querySelector('.quiz-results');
    const scoreElement = document.querySelector('.quiz-score');
    const feedbackElement = document.querySelector('.quiz-feedback');
    
    // 選項選擇
    quizOptions.forEach(option => {
        option.addEventListener('click', function() {
            // 移除同一問題中其他選項的選中狀態
            const questionOptions = this.closest('.quiz-question').querySelectorAll('.quiz-option');
            questionOptions.forEach(opt => opt.classList.remove('selected'));
            
            // 選中當前選項
            this.classList.add('selected');
        });
    });
    
    // 提交測驗
    if (submitBtn) {
        submitBtn.addEventListener('click', function() {
            // 計算分數
            const questions = document.querySelectorAll('.quiz-question');
            let correctCount = 0;
            let answeredCount = 0;
            
            questions.forEach((question, index) => {
                const selectedOption = question.querySelector('.quiz-option.selected');
                if (selectedOption) {
                    answeredCount++;
                    const selectedAnswer = selectedOption.getAttribute('data-answer');
                    const correctAnswer = question.getAttribute('data-correct');
                    
                    if (selectedAnswer === correctAnswer) {
                        correctCount++;
                        selectedOption.style.backgroundColor = '#2ecc71';
                    } else {
                        selectedOption.style.backgroundColor = '#e74c3c';
                        
                        // 標示正確答案
                        const options = question.querySelectorAll('.quiz-option');
                        options.forEach(opt => {
                            if (opt.getAttribute('data-answer') === correctAnswer) {
                                opt.style.backgroundColor = '#2ecc71';
                            }
                        });
                    }
                }
            });
            
            // 計算得分（總分100分）
            const totalQuestions = questions.length;
            const score = Math.round((correctCount / totalQuestions) * 100);
            
            // 顯示結果
            scoreElement.textContent = `${score}/100 ${t('quiz.score')}`;
            
            // 根據分數給予反饋
            if (score >= 90) {
                feedbackElement.textContent = t('quiz.feedback.excellent');
            } else if (score >= 70) {
                feedbackElement.textContent = t('quiz.feedback.good');
            } else if (score >= 50) {
                feedbackElement.textContent = t('quiz.feedback.fair');
            } else {
                feedbackElement.textContent = t('quiz.feedback.needsWork');
            }
            
            // 顯示結果區域
            resultsContainer.style.display = 'block';
            
            // 禁用提交按鈕
            submitBtn.disabled = true;
            
            // 滾動到結果區域
            resultsContainer.scrollIntoView({ behavior: 'smooth' });
        });
    }
}

// 投影片功能
function initializeSlides() {
    const slideContainer = document.querySelector('.slide-container');
    if (!slideContainer) return;
    
    const slides = slideContainer.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.slide-prev');
    const nextBtn = document.querySelector('.slide-next');
    let currentSlide = 0;
    
    // 隱藏所有投影片，只顯示當前投影片
    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.style.display = i === index ? 'block' : 'none';
        });
        
        // 更新按鈕狀態
        prevBtn.disabled = index === 0;
        nextBtn.disabled = index === slides.length - 1;
    }
    
    // 初始顯示第一張投影片
    if (slides.length > 0) {
        showSlide(currentSlide);
        
        // 上一張按鈕
        if (prevBtn) {
            prevBtn.addEventListener('click', function() {
                if (currentSlide > 0) {
                    currentSlide--;
                    showSlide(currentSlide);
                }
            });
        }
        
        // 下一張按鈕
        if (nextBtn) {
            nextBtn.addEventListener('click', function() {
                if (currentSlide < slides.length - 1) {
                    currentSlide++;
                    showSlide(currentSlide);
                }
            });
        }
    }
}

// 術語搜尋功能
function initializeTermSearch() {
    const searchInput = document.querySelector('.term-search input');
    const searchBtn = document.querySelector('.term-search button');
    const termItems = document.querySelectorAll('.term-item');
    
    if (!searchInput || !searchBtn || !termItems.length) return;
    
    function performSearch() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        
        termItems.forEach(item => {
            const chineseTerm = item.querySelector('.term-chinese').textContent.toLowerCase();
            const englishTerm = item.querySelector('.term-english').textContent.toLowerCase();
            
            if (chineseTerm.includes(searchTerm) || englishTerm.includes(searchTerm)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    }
    
    // 搜尋按鈕點擊事件
    searchBtn.addEventListener('click', performSearch);
    
    // 輸入框按Enter鍵事件
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
}
