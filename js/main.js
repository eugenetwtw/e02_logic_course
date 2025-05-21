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
        // Use a relative path instead of an absolute path
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
    // 更新頁面標題
    const pageTitle = document.querySelector('.course-header h1');
    if (pageTitle) pageTitle.textContent = t('about.title');
    
    // 更新課程簡介部分
    const sections = document.querySelectorAll('.course-section');
    if (sections.length >= 1) {
        const introTitle = sections[0].querySelector('h2');
        const introParagraphs = sections[0].querySelectorAll('p');
        
        if (introTitle) introTitle.textContent = t('about.introduction.title');
        if (introParagraphs.length >= 1) introParagraphs[0].textContent = t('about.introduction.paragraph1');
        if (introParagraphs.length >= 2) introParagraphs[1].textContent = t('about.introduction.paragraph2');
    }
    
    // 更新課程特色部分
    if (sections.length >= 2) {
        const featuresTitle = sections[1].querySelector('h2');
        const featureItems = sections[1].querySelectorAll('li');
        
        if (featuresTitle) featuresTitle.textContent = t('about.features.title');
        if (featureItems.length >= 1) featureItems[0].innerHTML = `<strong>${t('about.features.item1').split('：')[0]}</strong>：${t('about.features.item1').split('：')[1]}`;
        if (featureItems.length >= 2) featureItems[1].innerHTML = `<strong>${t('about.features.item2').split('：')[0]}</strong>：${t('about.features.item2').split('：')[1]}`;
        if (featureItems.length >= 3) featureItems[2].innerHTML = `<strong>${t('about.features.item3').split('：')[0]}</strong>：${t('about.features.item3').split('：')[1]}`;
        if (featureItems.length >= 4) featureItems[3].innerHTML = `<strong>${t('about.features.item4').split('：')[0]}</strong>：${t('about.features.item4').split('：')[1]}`;
        if (featureItems.length >= 5) featureItems[4].innerHTML = `<strong>${t('about.features.item5').split('：')[0]}</strong>：${t('about.features.item5').split('：')[1]}`;
    }
    
    // 更新課程結構部分
    if (sections.length >= 3) {
        const structureTitle = sections[2].querySelector('h2');
        const structureItems = sections[2].querySelectorAll('li');
        
        if (structureTitle) structureTitle.textContent = t('about.structure.title');
        if (structureItems.length >= 1) structureItems[0].innerHTML = `<strong>${t('about.structure.day1').split('：')[0]}</strong>：${t('about.structure.day1').split('：')[1]}`;
        if (structureItems.length >= 2) structureItems[1].innerHTML = `<strong>${t('about.structure.day2').split('：')[0]}</strong>：${t('about.structure.day2').split('：')[1]}`;
        if (structureItems.length >= 3) structureItems[2].innerHTML = `<strong>${t('about.structure.day3').split('：')[0]}</strong>：${t('about.structure.day3').split('：')[1]}`;
        if (structureItems.length >= 4) structureItems[3].innerHTML = `<strong>${t('about.structure.day4').split('：')[0]}</strong>：${t('about.structure.day4').split('：')[1]}`;
        if (structureItems.length >= 5) structureItems[4].innerHTML = `<strong>${t('about.structure.day5').split('：')[0]}</strong>：${t('about.structure.day5').split('：')[1]}`;
    }
    
    // 更新關於原著部分
    if (sections.length >= 4) {
        const originalWorkTitle = sections[3].querySelector('h2');
        const originalWorkParagraphs = sections[3].querySelectorAll('p');
        
        if (originalWorkTitle) originalWorkTitle.textContent = t('about.originalWork.title');
        if (originalWorkParagraphs.length >= 1) originalWorkParagraphs[0].textContent = t('about.originalWork.paragraph1');
        if (originalWorkParagraphs.length >= 2) originalWorkParagraphs[1].textContent = t('about.originalWork.paragraph2');
    }
    
    // 更新學習建議部分
    if (sections.length >= 5) {
        const learningTipsTitle = sections[4].querySelector('h2');
        const learningTipsItems = sections[4].querySelectorAll('li');
        
        if (learningTipsTitle) learningTipsTitle.textContent = t('about.learningTips.title');
        if (learningTipsItems.length >= 1) learningTipsItems[0].textContent = t('about.learningTips.tip1');
        if (learningTipsItems.length >= 2) learningTipsItems[1].textContent = t('about.learningTips.tip2');
        if (learningTipsItems.length >= 3) learningTipsItems[2].textContent = t('about.learningTips.tip3');
        if (learningTipsItems.length >= 4) learningTipsItems[3].textContent = t('about.learningTips.tip4');
        if (learningTipsItems.length >= 5) learningTipsItems[4].textContent = t('about.learningTips.tip5');
        if (learningTipsItems.length >= 6) learningTipsItems[5].textContent = t('about.learningTips.tip6');
        if (learningTipsItems.length >= 7) learningTipsItems[6].textContent = t('about.learningTips.tip7');
    }
    
    // 更新聯絡我們部分
    if (sections.length >= 6) {
        const contactTitle = sections[5].querySelector('h2');
        const contactParagraphs = sections[5].querySelectorAll('p');
        
        if (contactTitle) contactTitle.textContent = t('about.contact.title');
        if (contactParagraphs.length >= 1) contactParagraphs[0].textContent = t('about.contact.paragraph');
        if (contactParagraphs.length >= 2) contactParagraphs[1].textContent = t('about.contact.email');
        if (contactParagraphs.length >= 3) contactParagraphs[2].textContent = t('about.contact.phone');
    }
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
    // 更新課程目標部分
    const courseIntroSection = document.querySelector('#course-intro');
    if (courseIntroSection) {
        const title = courseIntroSection.querySelector('h2');
        const paragraphs = courseIntroSection.querySelectorAll('p');
        const list = courseIntroSection.querySelector('ul');
        const listItems = list ? list.querySelectorAll('li') : [];
        
        if (title) title.textContent = t(`day${dayNum}.courseGoals.title`);
        if (paragraphs.length >= 1) paragraphs[0].textContent = t(`day${dayNum}.courseGoals.description`);
        if (paragraphs.length >= 2) paragraphs[1].textContent = t(`day${dayNum}.courseGoals.afterCompletion`);
        
        const goals = t(`day${dayNum}.courseGoals.goals`);
        if (Array.isArray(goals)) {
            listItems.forEach((item, i) => {
                if (i < goals.length) {
                    item.textContent = goals[i];
                }
            });
        }
    }
    
    // 更新什麼是邏輯學部分
    const whatIsLogicSection = document.querySelector('#what-is-logic');
    if (whatIsLogicSection) {
        const title = whatIsLogicSection.querySelector('h2');
        const paragraphs = whatIsLogicSection.querySelectorAll('p');
        const list = whatIsLogicSection.querySelector('ul');
        const listItems = list ? list.querySelectorAll('li') : [];
        
        if (title) title.textContent = t(`day${dayNum}.whatIsLogic.title`);
        if (paragraphs.length >= 1) paragraphs[0].textContent = t(`day${dayNum}.whatIsLogic.description`);
        if (paragraphs.length >= 2) paragraphs[1].textContent = t(`day${dayNum}.whatIsLogic.coreQuestions`);
        if (paragraphs.length >= 3) paragraphs[2].textContent = t(`day${dayNum}.whatIsLogic.applications`);
        
        const questions = t(`day${dayNum}.whatIsLogic.questions`);
        if (Array.isArray(questions)) {
            listItems.forEach((item, i) => {
                if (i < questions.length) {
                    item.textContent = questions[i];
                }
            });
        }
    }
    
    // 更新陳述句部分
    const statementsSection = document.querySelector('#statements');
    if (statementsSection) {
        const title = statementsSection.querySelector('h2');
        const paragraphs = statementsSection.querySelectorAll('p');
        const subTitles = statementsSection.querySelectorAll('h3');
        const lists = statementsSection.querySelectorAll('ul');
        
        if (title) title.textContent = t(`day${dayNum}.statements.title`);
        if (paragraphs.length >= 1) paragraphs[0].textContent = t(`day${dayNum}.statements.description`);
        
        // 更新陳述句子部分
        if (subTitles.length >= 1) subTitles[0].textContent = t(`day${dayNum}.statements.statementsTitle`);
        if (paragraphs.length >= 2) paragraphs[1].textContent = t(`day${dayNum}.statements.statementsDescription`);
        if (paragraphs.length >= 3) paragraphs[2].textContent = t(`day${dayNum}.statements.statementsExamples`);
        
        if (lists.length >= 1) {
            const statementsExamples = t(`day${dayNum}.statements.statementsExamplesList`);
            const listItems = lists[0].querySelectorAll('li');
            if (Array.isArray(statementsExamples)) {
                listItems.forEach((item, i) => {
                    if (i < statementsExamples.length) {
                        item.textContent = statementsExamples[i];
                    }
                });
            }
        }
        
        // 更新非陳述句部分
        if (subTitles.length >= 2) subTitles[1].textContent = t(`day${dayNum}.statements.nonStatementsTitle`);
        if (paragraphs.length >= 4) paragraphs[3].textContent = t(`day${dayNum}.statements.nonStatementsDescription`);
        if (paragraphs.length >= 5) paragraphs[4].textContent = t(`day${dayNum}.statements.nonStatementsExamples`);
        
        if (lists.length >= 2) {
            const nonStatementsExamples = t(`day${dayNum}.statements.nonStatementsExamplesList`);
            const listItems = lists[1].querySelectorAll('li');
            if (Array.isArray(nonStatementsExamples)) {
                listItems.forEach((item, i) => {
                    if (i < nonStatementsExamples.length) {
                        item.textContent = nonStatementsExamples[i];
                    }
                });
            }
        }
        
        if (paragraphs.length >= 6) paragraphs[5].textContent = t(`day${dayNum}.statements.importance`);
    }
    
    // 更新論證結構部分
    const argumentsSection = document.querySelector('#arguments');
    if (argumentsSection) {
        const title = argumentsSection.querySelector('h2');
        const paragraphs = argumentsSection.querySelectorAll('p');
        const subTitles = argumentsSection.querySelectorAll('h3');
        const lists = argumentsSection.querySelectorAll('ul');
        const blockquote = argumentsSection.querySelector('blockquote');
        
        if (title) title.textContent = t(`day${dayNum}.arguments.title`);
        if (paragraphs.length >= 1) paragraphs[0].textContent = t(`day${dayNum}.arguments.description`);
        
        if (subTitles.length >= 1) subTitles[0].textContent = t(`day${dayNum}.arguments.premiseTitle`);
        if (paragraphs.length >= 2) paragraphs[1].textContent = t(`day${dayNum}.arguments.premiseDescription`);
        
        if (subTitles.length >= 2) subTitles[1].textContent = t(`day${dayNum}.arguments.conclusionTitle`);
        if (paragraphs.length >= 3) paragraphs[2].textContent = t(`day${dayNum}.arguments.conclusionDescription`);
        
        if (subTitles.length >= 3) subTitles[2].textContent = t(`day${dayNum}.arguments.exampleTitle`);
        if (paragraphs.length >= 4) paragraphs[3].textContent = t(`day${dayNum}.arguments.exampleDescription`);
        
        if (blockquote) blockquote.innerHTML = t(`day${dayNum}.arguments.example`).replace(/\n/g, '<br>');
        
        if (subTitles.length >= 4) subTitles[3].textContent = t(`day${dayNum}.arguments.conclusionIndicatorsTitle`);
        if (paragraphs.length >= 5) paragraphs[4].textContent = t(`day${dayNum}.arguments.conclusionIndicatorsDescription`);
        
        if (lists.length >= 1) {
            const conclusionIndicators = t(`day${dayNum}.arguments.conclusionIndicators`);
            const listItems = lists[0].querySelectorAll('li');
            if (Array.isArray(conclusionIndicators)) {
                listItems.forEach((item, i) => {
                    if (i < conclusionIndicators.length) {
                        item.textContent = conclusionIndicators[i];
                    }
                });
            }
        }
        
        if (subTitles.length >= 5) subTitles[4].textContent = t(`day${dayNum}.arguments.premiseIndicatorsTitle`);
        if (paragraphs.length >= 6) paragraphs[5].textContent = t(`day${dayNum}.arguments.premiseIndicatorsDescription`);
        
        if (lists.length >= 2) {
            const premiseIndicators = t(`day${dayNum}.arguments.premiseIndicators`);
            const listItems = lists[1].querySelectorAll('li');
            if (Array.isArray(premiseIndicators)) {
                listItems.forEach((item, i) => {
                    if (i < premiseIndicators.length) {
                        item.textContent = premiseIndicators[i];
                    }
                });
            }
        }
    }
    
    // 更新語言功能部分
    const languageFunctionsSection = document.querySelector('#language-functions');
    if (languageFunctionsSection) {
        const title = languageFunctionsSection.querySelector('h2');
        const paragraphs = languageFunctionsSection.querySelectorAll('p');
        const subTitles = languageFunctionsSection.querySelectorAll('h3');
        
        if (title) title.textContent = t(`day${dayNum}.languageFunctions.title`);
        if (paragraphs.length >= 1) paragraphs[0].textContent = t(`day${dayNum}.languageFunctions.description`);
        
        // 更新圖片說明
        const imageCaption = languageFunctionsSection.querySelector('.course-image');
        if (imageCaption) imageCaption.alt = t(`day${dayNum}.languageFunctions.title`);
        
        // 更新各功能部分
        if (subTitles.length >= 1) subTitles[0].textContent = t(`day${dayNum}.languageFunctions.informativeTitle`);
        if (paragraphs.length >= 2) paragraphs[1].textContent = t(`day${dayNum}.languageFunctions.informativeDescription`);
        if (paragraphs.length >= 3) paragraphs[2].textContent = t(`day${dayNum}.languageFunctions.informativeExamples`);
        
        if (subTitles.length >= 2) subTitles[1].textContent = t(`day${dayNum}.languageFunctions.directiveTitle`);
        if (paragraphs.length >= 4) paragraphs[3].textContent = t(`day${dayNum}.languageFunctions.directiveDescription`);
        if (paragraphs.length >= 5) paragraphs[4].textContent = t(`day${dayNum}.languageFunctions.directiveExamples`);
        
        if (subTitles.length >= 3) subTitles[2].textContent = t(`day${dayNum}.languageFunctions.expressiveTitle`);
        if (paragraphs.length >= 6) paragraphs[5].textContent = t(`day${dayNum}.languageFunctions.expressiveDescription`);
        if (paragraphs.length >= 7) paragraphs[6].textContent = t(`day${dayNum}.languageFunctions.expressiveExamples`);
        
        if (subTitles.length >= 4) subTitles[3].textContent = t(`day${dayNum}.languageFunctions.ceremonialTitle`);
        if (paragraphs.length >= 8) paragraphs[7].textContent = t(`day${dayNum}.languageFunctions.ceremonialDescription`);
        if (paragraphs.length >= 9) paragraphs[8].textContent = t(`day${dayNum}.languageFunctions.ceremonialExamples`);
        
        if (paragraphs.length >= 10) paragraphs[9].textContent = t(`day${dayNum}.languageFunctions.logicFocus`);
    }
    
    // 更新課程總結部分
    const summarySection = document.querySelector('#summary');
    if (summarySection) {
        const title = summarySection.querySelector('h2');
        const paragraphs = summarySection.querySelectorAll('p');
        const list = summarySection.querySelector('ul');
        const listItems = list ? list.querySelectorAll('li') : [];
        
        if (title) title.textContent = t(`day${dayNum}.summary.title`);
        if (paragraphs.length >= 1) paragraphs[0].textContent = t(`day${dayNum}.summary.description`);
        
        const points = t(`day${dayNum}.summary.points`);
        if (Array.isArray(points)) {
            listItems.forEach((item, i) => {
                if (i < points.length) {
                    item.textContent = points[i];
                }
            });
        }
        
        if (paragraphs.length >= 2) paragraphs[1].textContent = t(`day${dayNum}.summary.foundation`);
    }
    
    // 更新心智圖說明
    const mindmapCaption = document.querySelector('.mindmap-caption');
    if (mindmapCaption) {
        mindmapCaption.textContent = t(`day${dayNum}.title`) + " " + t('slides.day1.slide14.title');
    }

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
    // 獲取當前是第幾天
    const dayMatch = window.location.pathname.match(/day(\d+)/);
    if (!dayMatch || !dayMatch[1]) return;
    
    const dayNum = dayMatch[1];
    
    // 更新頁面標題
    const quizHeader = document.querySelector('.quiz-header h1');
    if (quizHeader) quizHeader.textContent = t(`quiz.day${dayNum}.title`);
    
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
    
    // 更新提交按鈕
    const submitBtn = document.querySelector('.quiz-submit');
    if (submitBtn) submitBtn.textContent = t('quiz.submit');
    
    // 更新結果文本
    const scoreLabel = document.querySelector('.quiz-results .quiz-score');
    if (scoreLabel && scoreLabel.textContent) {
        const scoreValue = scoreLabel.textContent.match(/\d+/)[0];
        scoreLabel.textContent = `${scoreValue}/100 ${t('quiz.score')}`;
    }
    
    // 更新反饋文本
    const feedbackElement = document.querySelector('.quiz-feedback');
    if (feedbackElement) {
        const feedbackText = feedbackElement.textContent.trim();
        
        if (feedbackText === t('quiz.feedback.excellent') || 
            feedbackText === '太棒了！你對這個主題有很好的理解！' || 
            feedbackText === 'Excellent! You have a great understanding of this topic!') {
            feedbackElement.textContent = t('quiz.feedback.excellent');
        } else if (feedbackText === t('quiz.feedback.good') || 
                   feedbackText === '做得好！你掌握了大部分概念。' || 
                   feedbackText === 'Well done! You\'ve mastered most of the concepts.') {
            feedbackElement.textContent = t('quiz.feedback.good');
        } else if (feedbackText === t('quiz.feedback.fair') || 
                   feedbackText === '不錯的嘗試！請複習一下錯誤的題目。' || 
                   feedbackText === 'Good try! Please review the questions you got wrong.') {
            feedbackElement.textContent = t('quiz.feedback.fair');
        } else if (feedbackText === t('quiz.feedback.needsWork') || 
                   feedbackText === '需要更多練習。建議重新閱讀課程材料。' || 
                   feedbackText === 'Needs more practice. It\'s recommended to re-read the course materials.') {
            feedbackElement.textContent = t('quiz.feedback.needsWork');
        }
    }
}

// 更新投影片頁面內容
function updateSlidesPage() {
    // 獲取當前是第幾天
    const dayMatch = window.location.pathname.match(/day(\d+)/);
    if (!dayMatch || !dayMatch[1]) return;
    
    const dayNum = dayMatch[1];
    
    // 更新頁面標題
    const slideTitle = document.querySelector('.slide-container h1');
    if (slideTitle) slideTitle.textContent = t(`slides.day${dayNum}.title`);
    
    // 更新上一張/下一張按鈕
    const prevBtn = document.querySelector('.slide-prev');
    const nextBtn = document.querySelector('.slide-next');
    
    if (prevBtn) prevBtn.textContent = t('slides.prev');
    if (nextBtn) nextBtn.textContent = t('slides.next');
    
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
