// 主要JavaScript功能
document.addEventListener('DOMContentLoaded', function() {
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
            scoreElement.textContent = `${score}/100 分`;
            
            // 根據分數給予反饋
            if (score >= 90) {
                feedbackElement.textContent = '太棒了！你對這個主題有很好的理解！';
            } else if (score >= 70) {
                feedbackElement.textContent = '做得好！你掌握了大部分概念。';
            } else if (score >= 50) {
                feedbackElement.textContent = '不錯的嘗試！請複習一下錯誤的題目。';
            } else {
                feedbackElement.textContent = '需要更多練習。建議重新閱讀課程材料。';
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
