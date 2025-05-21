(function() {
    const translations = {
        en: {
            nav_home: 'Home',
            nav_courses: 'Courses',
            nav_terms: 'Terminology',
            nav_about: 'About',
            switch_lang: '中文',
            footer_quick: 'Quick Links',
            footer_resources: 'Resources',
            footer_rights: 'All rights reserved.',
            index: {
                hero_title: 'Introduction to Logic',
                hero_subtitle: 'A 5-Day Logic Course for Middle School Students',
                hero_desc: "Based on Irving M. Copi's <em>Introduction to Logic</em>, this course will help you develop critical thinking skills.",
                hero_btn: 'Start Learning',
                features_title: 'Course Features',
                feature1_title: 'Accessible',
                feature1_desc: 'Content designed for middle school learners makes abstract logic concepts easy to grasp.',
                feature2_title: 'Step by Step',
                feature2_desc: 'Five short daily lessons gradually build your understanding of logic.',
                feature3_title: 'Visual Learning',
                feature3_desc: 'Mind maps and other visuals help explain and remember abstract ideas.',
                feature4_title: 'Interactive Practice',
                feature4_desc: 'Targeted exercises each day reinforce new concepts.',
                overview_title: 'Course Overview',
                cta_title: 'Ready to Dive into Logic?',
                cta_desc: "Logic is a way of thinking that helps you make sound decisions.",
                cta_btn: 'Get Started'
            },
            day1: {
                page_title: 'Day 1: Logic Basics and Language',
                slides_title: 'Day 1: Logic Basics and Language',
                quiz_title: 'Day 1 Quiz'
            }
        },
        zh: {
            nav_home: '首頁',
            nav_courses: '課程內容',
            nav_terms: '術語表',
            nav_about: '關於課程',
            switch_lang: 'English',
            footer_quick: '快速連結',
            footer_resources: '課程資源',
            footer_rights: '張渝江，保留所有權利。',
            index: {
                hero_title: '邏輯學入門',
                hero_subtitle: '為國中生設計的五天邏輯學課程',
                hero_desc: '基於Irving M. Copi的《邏輯學入門》(Introduction to Logic)，本課程將幫助你培養批判性思考能力和邏輯推理技巧。',
                hero_btn: '開始學習',
                features_title: '課程特色',
                feature1_title: '深入淺出',
                feature1_desc: '根據國中生認知水平設計的教材，使抽象的邏輯概念變得易於理解。',
                feature2_title: '循序漸進',
                feature2_desc: '五天課程由淺入深，每天半小時，輕鬆掌握邏輯學基礎。',
                feature3_title: '視覺化學習',
                feature3_desc: '豐富的心智圖和視覺輔助，幫助理解和記憶抽象概念。',
                feature4_title: '互動練習',
                feature4_desc: '每天課程後都有針對性的練習題，幫助鞏固所學知識。',
                overview_title: '課程概覽',
                cta_title: '準備好開始學習邏輯學了嗎？',
                cta_desc: '邏輯學不僅是一門學科，更是一種思維方式。它能幫助你在學習和生活中做出更合理的判斷和決策。',
                cta_btn: '立即開始'
            },
            day1: {
                page_title: '第一天：邏輯學基礎與語言',
                slides_title: '第一天：邏輯學基礎與語言',
                quiz_title: '第一天測驗：邏輯學基礎與語言'
            }
        }
    };

    function applyTranslations(pageKey, lang) {
        const dict = translations[lang] || translations.zh;
        // nav and footer
        const mappings = {
            '.nav-home': 'nav_home',
            '.nav-courses': 'nav_courses',
            '.nav-terms': 'nav_terms',
            '.nav-about': 'nav_about',
            '.lang-switch': 'switch_lang',
            '.footer-quick': 'footer_quick',
            '.footer-resources': 'footer_resources',
            '.footer-rights': 'footer_rights'
        };
        Object.keys(mappings).forEach(selector => {
            const el = document.querySelector(selector);
            if (el && dict[mappings[selector]]) {
                el.textContent = dict[mappings[selector]];
            }
        });

        // page specific
        const pageDict = dict[pageKey];
        if (pageDict) {
            document.querySelectorAll('[data-i18n]').forEach(el => {
                const key = el.getAttribute('data-i18n');
                if (pageDict[key]) {
                    el.innerHTML = pageDict[key];
                }
            });
        }
        document.documentElement.lang = lang === 'en' ? 'en' : 'zh-Hant';
    }

    window.initI18n = function(pageKey) {
        let lang = new URLSearchParams(window.location.search).get('lang') || localStorage.getItem('lang') || 'zh';
        applyTranslations(pageKey, lang);
        const switcher = document.querySelector('.lang-switch');
        if (switcher) {
            switcher.addEventListener('click', function(e) {
                e.preventDefault();
                lang = lang === 'en' ? 'zh' : 'en';
                localStorage.setItem('lang', lang);
                const url = new URL(window.location.href);
                url.searchParams.set('lang', lang);
                window.location.href = url.toString();
            });
        }
    };
})();
