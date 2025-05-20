const fs = require('fs');
const path = require('path');

// List of HTML files to update
const filesToUpdate = [
    'day1.html', 'day2.html', 'day3.html', 'day4.html', 'day5.html',
    'day1_quiz.html', 'day2_quiz.html', 'day3_quiz.html', 'day4_quiz.html', 'day5_quiz.html',
    'day1_slides.html', 'day2_slides.html', 'day3_slides.html', 'day4_slides.html', 'day5_slides.html'
];

// Function to clean up incorrect translations
function cleanupTermsInContent(content) {
    let updatedContent = content;
    // Remove incorrect translation for "非陳述句 (Statement)"
    const regex = new RegExp(`非陳述句 \\(Statement\\)`, 'g');
    updatedContent = updatedContent.replace(regex, '非陳述句');
    return updatedContent;
}

// Process each file
filesToUpdate.forEach(file => {
    const filePath = path.join(__dirname, '..', file);
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        const updatedContent = cleanupTermsInContent(content);
        if (updatedContent !== content) {
            fs.writeFileSync(filePath, updatedContent, 'utf8');
            console.log(`Cleaned up file: ${file}`);
        } else {
            console.log(`No cleanup needed for file: ${file}`);
        }
    } catch (error) {
        console.error(`Error processing file ${file}:`, error.message);
    }
});

console.log('Cleanup process completed.');
