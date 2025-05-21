// 主要JavaScript功能
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
        const response = await fetch(`/locales/${lang}.json`);
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
    
    // 更新導航欄
    updateNavigation();
    
    // 根據頁面類型更新內容
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
            // 其他頁面
            break;
    }
    
    // 更新頁腳
    updateFooter();
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
            // 獲取當前是第幾天
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
                title = `${t(`footer.day${dayNum}`)} ${t('quiz.submit')} - ${t('home.title')}`;
            } else {
                title = `${t('quiz.submit')} - ${t('home.title')}`;
            }
            break;
        case 'slides':
            const slidesDayMatch = window.location.pathname.match(/day(\d+)/);
            if (slidesDayMatch && slidesDayMatch[1]) {
                const dayNum = slidesDayMatch[1];
                title = `${t(`footer.day${dayNum}`)} ${t('slides.next')} - ${t('home.title')}`;
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

// 更新導航欄
function updateNavigation() {
    // 更新Logo
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.textContent = t('home.title');
    }
    
    // 更新導航鏈接
    const navLinks = document.querySelectorAll('.nav-links a');
    if (navLinks.length > 0) {
        const navItems = ['home', 'courses', 'terminology', 'about'];
        navLinks.forEach((link, index) => {
            if (index < navItems.length) {
                link.textContent = t(`nav.${navItems[index]}`);
                // 更新鏈接以包含語言參數
                const href = link.getAttribute('href');
                link.setAttribute('href', updateUrlWithLanguage(href));
            }
        });
    }
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
    if (heroButton) {
        heroButton.textContent = t('home.startLearning');
        heroButton.setAttribute('href', updateUrlWithLanguage(heroButton.getAttribute('href')));
    }
    
    // 更新特色區塊
    const featuresTitle = document.querySelector('.features .section-title');
    if (featuresTitle) featuresTitle.textContent = t('home.features.title');
    
    const featureItems = document.querySelectorAll('.feature-item');
    if (featureItems.length >= 4) {
        // 標題
        const titles = featureItems[0].querySelector('h3');
        const titles2 = featureItems[1].querySelector('h3');
        const titles3 = featureItems[2].querySelector('h3');
        const titles4 = featureItems[3].querySelector('h3');
        
        if (titles) titles.textContent = t('home.features.item1.title');
        if (titles2) titles2.textContent = t('home.features.item2.title');
        if (titles3) titles3.textContent = t('home.features.item3.title');
        if (titles4) titles4.textContent = t('home.features.item4.title');
        
        // 描述
        const desc1 = featureItems[0].querySelector('p');
        const desc2 = featureItems[1].querySelector('p');
        const desc3 = featureItems[2].querySelector('p');
        const desc4 = featureItems[3].querySelector('p');
        
        if (desc1) desc1.textContent = t('home.features.item1.description');
        if (desc2) desc2.textContent = t('home.features.item2.description');
        if (desc3) desc3.textContent = t('home.features.item3.description');
        if (desc4) desc4.textContent = t('home.features.item4.description');
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
            if (link) {
                link.textContent = t(`home.courseOverview.day${i+1}.link`);
                link.setAttribute('href', updateUrlWithLanguage(link.getAttribute('href')));
            }
        }
    }
    
    // 更新CTA區塊
    const ctaTitle = document.querySelector('.cta-content h2');
    const ctaDesc = document.querySelector('.cta-content p');
    const ctaButton = document.querySelector('.cta-content .btn');
    
    if (ctaTitle) ctaTitle.textContent = t('home.cta.title');
    if (ctaDesc) ctaDesc.textContent = t('home.cta.description');
    if (ctaButton) {
        ctaButton.textContent = t('home.cta.button');
        ctaButton.setAttribute('href', updateUrlWithLanguage(ctaButton.getAttribute('href')));
    }
}

// 更新課程頁面內容
function updateCoursesPage() {
    // 更新頁面標題
    const pageTitle = document.querySelector('.section-title');
    if (pageTitle) pageTitle.textContent = t('courses.title');
    
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
                
                // 更新鏈接
                buttons.forEach(btn => {
                    btn.setAttribute('href', updateUrlWithLanguage(btn.getAttribute('href')));
                });
            }
        }
    }
    
    // 更新課程概述
    const overviewTitle = document.querySelector('.course-overview .section-title');
    if (overviewTitle) overviewTitle.textContent = t('courses.overview');
    
    const overviewDesc = document.querySelector('.course-overview-content p');
    if (overviewDesc) overviewDesc.textContent = t('courses.overviewDescription');
    
    // 更新課程目標
    const objectivesTitle = document.querySelector('.course-overview-content h3:nth-of-type(1)');
    if (objectivesTitle) objectivesTitle.textContent = t('courses.objectives');
    
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
    const featuresTitle = document.querySelector('.course-overview-content h3:nth-of-type(2)');
    if (featuresTitle) featuresTitle.textContent = t('courses.features');
    
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
    // 實現術語表頁面的翻譯
    const searchButton = document.querySelector('.term-search button');
    const searchInput = document.querySelector('.term-search input');
    
    if (searchButton) searchButton.textContent = t('terminology.search');
    if (searchInput) searchInput.placeholder = t('terminology.searchPlaceholder');
}

// 更新關於頁面內容
function updateAboutPage() {
    // 實現關於頁面的翻譯
}

// 更新課程日頁面內容
function updateDayPage() {
    // 獲取當前是第幾天
    const dayMatch = window.location.pathname.match(/day(\d+)/);
    if (!dayMatch || !dayMatch[1]) return;
    
    const dayNum = dayMatch[1];
    
    // 更新頁面標題
    const pageTitle = document.querySelector('.course-header h1');
    const pageDesc = document.querySelector('.course-header p');
    
    if (pageTitle) pageTitle.textContent = t(`day${dayNum}.title`);
    if (pageDesc) pageDesc.textContent = t(`day${dayNum}.description`);
    
    // 更新側邊欄
    const sidebarTitle = document.querySelector('.sidebar-title');
    if (sidebarTitle) sidebarTitle.textContent = t(`day${dayNum}.navigation`);
    
    const sidebarLinks = document.querySelectorAll('.sidebar-links a');
    const sectionKeys = Object.keys(translations[`day${dayNum}`]?.sections || {});
    
    sidebarLinks.forEach((link, index) => {
        if (index < sectionKeys.length) {
            const key = sectionKeys[index];
            link.textContent = t(`day${dayNum}.sections.${key}`);
        }
        
        // 更新鏈接以包含語言參數
        if (link.getAttribute('href').includes('.html')) {
            link.setAttribute('href', updateUrlWithLanguage(link.getAttribute('href')));
        }
    });
    
    // 更新各部分內容
    // 這裡需要根據實際頁面結構進行更詳細的實現
    
    // 更新底部按鈕
    const slideBtn = document.querySelector('.course-links a[href*="slides"]');
    const quizBtn = document.querySelector('.course-links a[href*="quiz"]');
    
    if (slideBtn) {
        slideBtn.textContent = t(`day${dayNum}.summary.slides`);
        slideBtn.setAttribute('href', updateUrlWithLanguage(slideBtn.getAttribute('href')));
    }
    
    if (quizBtn) {
        quizBtn.textContent = t(`day${dayNum}.summary.quiz`);
        quizBtn.setAttribute('href', updateUrlWithLanguage(quizBtn.getAttribute('href')));
    }
}

// 更新測驗頁面內容
function updateQuizPage() {
    // 更新提交按鈕
    const submitBtn = document.querySelector('.quiz-submit');
    if (submitBtn) submitBtn.textContent = t('quiz.submit');
    
    // 更新結果文本
    const scoreLabel = document.querySelector('.quiz-results .quiz-score');
    if (scoreLabel && scoreLabel.textContent) {
        const scoreValue = scoreLabel.textContent.match(/\d+/)[0];
        scoreLabel.textContent = `${scoreValue}/100 ${t('quiz.score')}`;
    }
}

// 更新投影片頁面內容
function updateSlidesPage() {
    // 更新上一張/下一張按鈕
    const prevBtn = document.querySelector('.slide-prev');
    const nextBtn = document.querySelector('.slide-next');
    
    if (prevBtn) prevBtn.textContent = t('slides.prev');
    if (nextBtn) nextBtn.textContent = t('slides.next');
}

// 更新頁腳
function updateFooter() {
    // 更新頁腳描述
    const footerDesc = document.querySelector('.footer-column p');
    if (footerDesc) footerDesc.textContent = t('footer.description');
    
    // 更新頁腳標題
    const footerTitles = document.querySelectorAll('.footer-column h3');
    if (footerTitles.length >= 3) {
        footerTitles[0].textContent = t('home.title');
        footerTitles[1].textContent = t('footer.quickLinks');
        footerTitles[2].textContent = t('footer.courseResources');
    }
    
    // 更新快速連結
    const quickLinks = document.querySelectorAll('.footer-column:nth-child(2) .footer-links a');
    if (quickLinks.length >= 4) {
        const navItems = ['home', 'courses', 'terminology', 'about'];
        quickLinks.forEach((link, index) => {
            if (index < navItems.length) {
                link.textContent = t(`nav.${navItems[index]}`);
                link.setAttribute('href', updateUrlWithLanguage(link.getAttribute('href')));
            }
        });
    }
    
    // 更新課程資源連結
    const courseLinks = document.querySelectorAll('.footer-column:nth-child(3) .footer-links a');
    if (courseLinks.length >= 5) {
        for (let i = 0; i < 5; i++) {
            courseLinks[i].textContent = t(`footer.day${i+1}`);
            courseLinks[i].setAttribute('href', updateUrlWithLanguage(courseLinks[i].getAttribute('href')));
        }
    }
    
    // 更新版權信息
    const copyright = document.querySelector('.footer-bottom p');
    if (copyright) copyright.textContent = t('footer.copyright');
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
    
    // 添加標籤
    const label = document.createElement('label');
    label.htmlFor = 'language-select';
    label.textContent = t('languageSelector.label') + ': ';
    
    // 將元素添加到容器
    languageSelector.appendChild(label);
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
        
        .language-selector label {
            margin-right: 5px;
            color: var(--text-color);
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
        // 如果URL不完整，添加基本URL
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
                        selectedOption.style.backgroundColor = '#2ecc71'; // 正確答案顯示綠色
                    } else {
                        selectedOption.style.backgroundColor = '#e74c3c'; // 錯誤答案顯示紅色
                        
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
