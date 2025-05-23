const fs = require('fs');
const path = require('path');

// Mapping of Chinese terms to English translations based on user's provided table
const termMapping = {
    '邏輯學': 'Logic',
    '前提': 'Premise',
    '結論': 'Conclusion',
    '有效論證': 'Valid Argument',
    '無效論證': 'Invalid Argument',
    '論證': 'Argument',
    '推理': 'Inference',
    '命題': 'Proposition',
    '真值': 'Truth Value',
    '矛盾': 'Contradiction',
    '一致性': 'Consistency',
    '演繹法': 'Deduction',
    '歸納法': 'Induction',
    '形式邏輯': 'Formal Logic',
    '非形式邏輯': 'Informal Logic',
    '謬誤': 'Fallacy',
    '定義': 'Definition',
    '陳述句': 'Statement',
    '非陳述句': 'not a statement',
    '複合陳述句': 'Compound Statement',
    '連接詞': 'Connective',
    '否定': 'Negation',
    '連接': 'Conjunction',
    '選言': 'Disjunction',
    '蘊涵': 'Implication',
    '等值': 'Equivalence',
    '符號邏輯': 'Symbolic Logic',
    '條件句': 'Conditional Statement',
    '雙條件句': 'Biconditional Statement',
    '充分條件': 'Sufficient Condition',
    '必要條件': 'Necessary Condition',
    '充分必要條件': 'Necessary and Sufficient Condition',
    '實質蘊涵': 'Material Implication',
    '實質等值': 'Material Equivalence',
    '悖論': 'Paradox',
    '演繹推理': 'Deductive Reasoning',
    '歸納推理': 'Inductive Reasoning',
    '三段論': 'Syllogism',
    '範疇三段論': 'Categorical Syllogism',
    '假言三段論': 'Hypothetical Syllogism',
    '選言三段論': 'Disjunctive Syllogism',
    '兩難推理': 'Dilemma',
    '類比推理': 'Argument by Analogy',
    '因果關係': 'Causal Connection',
    '科學假設': 'Scientific Hypothesis',
    '邏輯謬誤': 'Logical Fallacy',
    '批判性思考': 'Critical Thinking',
    '相關性謬誤': 'Fallacies of Relevance',
    '模糊性謬誤': 'Fallacies of Ambiguity',
    '訴諸權威': 'Appeal to Authority',
    '訴諸情感': 'Appeal to Emotion',
    '人身攻擊': 'Ad Hominem',
    '稻草人謬誤': 'Straw Man Fallacy',
    '循環論證': 'Circular Reasoning',
    '訴諸無知': 'Appeal to Ignorance',
    '倉促概括': 'Hasty Generalization',
    '語言的用途': 'Uses of Language',
    '情緒性語言': 'Emotive Language',
    '中立性語言': 'Emotively Neutral Language',
    '定義的目的': 'Purposes of Definition',
    '定義的類型': 'Types of Definition',
    '範疇命題': 'Categorical Proposition',
    '對當方陣': 'Square of Opposition',
    '存在蘊涵': 'Existential Import',
    '概念的外延': 'Extension of a Concept',
    '概念的內涵': 'Intension of a Concept',
    '思維三律': 'Three "Laws of Thought"',
    '概率': 'Probability'
};

// List of HTML files to update
const filesToUpdate = [
    'day1.html', 'day2.html', 'day3.html', 'day4.html', 'day5.html',
    'day1_quiz.html', 'day2_quiz.html', 'day3_quiz.html', 'day4_quiz.html', 'day5_quiz.html',
    'day1_slides.html', 'day2_slides.html', 'day3_slides.html', 'day4_slides.html', 'day5_slides.html'
];

// Function to update terms in content
function updateTermsInContent(content) {
    let updatedContent = content;
    // Sort terms by length in descending order to handle longer phrases first
    const sortedTerms = Object.keys(termMapping).sort((a, b) => b.length - a.length);
    for (const chineseTerm of sortedTerms) {
        const englishTerm = termMapping[chineseTerm];
        // Use a less strict regex for "非陳述句" to ensure matching
        if (chineseTerm === '非陳述句') {
            const regex = new RegExp(`(${chineseTerm})(?!\\s*\\(${englishTerm}\\))`, 'g');
            updatedContent = updatedContent.replace(regex, `${chineseTerm} (${englishTerm})`);
        } else {
            // Create a regex to match the Chinese term exactly, avoiding already translated terms
            const regex = new RegExp(`\\b(${chineseTerm})\\b(?!\\s*\\(${englishTerm}\\))`, 'g');
            updatedContent = updatedContent.replace(regex, `${chineseTerm} (${englishTerm})`);
        }
    }
    return updatedContent;
}

// Process each file
filesToUpdate.forEach(file => {
    const filePath = path.join(__dirname, '..', file);
    try {
        let content = fs.readFileSync(filePath, 'utf8');
        const updatedContent = updateTermsInContent(content);
        if (updatedContent !== content) {
            fs.writeFileSync(filePath, updatedContent, 'utf8');
            console.log(`Updated file: ${file}`);
        } else {
            console.log(`No changes needed for file: ${file}`);
        }
    } catch (error) {
        console.error(`Error processing file ${file}:`, error.message);
    }
});

console.log('Term update process completed.');
