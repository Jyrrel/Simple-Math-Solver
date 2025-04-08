const questions = [
    {
        question: '5 + 5 = ?',
        answers: [
            {text: '15', correct: false},
            {text: '10', correct: true},
            {text: '25', correct: false},
            {text: '5', correct: false},
        ]
    },
    {
        question: '3 x 3 = ?',
        answers: [
            {text: '6', correct: false},
            {text: '12', correct: false},
            {text: '15', correct: false},
            {text: '9', correct: true},
        ]
    },
    {
        question: '2 x 4 = ?',
        answers: [
            {text: '8', correct: true},
            {text: '6', correct: false},
            {text: '16', correct: false},
            {text: '21', correct: false},
        ]
    },
    {
        question: '10 x 3 = ?',
        answers: [
            {text: '20', correct: false},
            {text: '13', correct: false},
            {text: '30', correct: true},
            {text: '15', correct: false},
        ]
    },
    {
        question: '20 - 7 = ?',
        answers: [
            {text: '13', correct: true},
            {text: '12', correct: false},
            {text: '18', correct: false},
            {text: '14', correct: false},
        ]
    }
];

const questionElement = document.getElementById('question'); 
const answerButtons = document.getElementById('answer-buttons');
const nextButton = document.getElementById('next-btn');
const homepage = document.getElementById('homepage');
const quizApp = document.querySelector('.app');
const startQuizBtn = document.getElementById('start-quiz-btn');

let currentQuestionIndex = 0;
let score = 0;

quizApp.style.display = 'none';

function startQuiz(){
    currentQuestionIndex = 0;
    score = 0;
    nextButton.innerHTML = 'Next';
    showQuestion();
}

function showQuestion(){
    resetState();
    let currentQuestion = questions[currentQuestionIndex];
    let questionNo = currentQuestionIndex + 1;
    questionElement.innerHTML = questionNo + '. ' + currentQuestion.question;

    currentQuestion.answers.forEach(answer => {
        const button = document.createElement('button');
        button.innerHTML = answer.text;
        button.classList.add('btn');
        answerButtons.appendChild(button);
        if(answer.correct){
            button.dataset.correct = answer.correct;
        }
        button.addEventListener('click', selectAnswer);
    });
}

startQuizBtn.addEventListener('click', () => {
    homepage.style.display = 'none';
    quizApp.style.display = 'block';
    document.getElementById('footer').style.display = 'none';
    startQuiz();
});

function resetState(){
    nextButton.style.display = 'none';
    while(answerButtons.firstChild){
        answerButtons.removeChild(answerButtons.firstChild);
    }
}   

function selectAnswer(e){
    const selectedBtn = e.target;
    const isCorrect = selectedBtn.dataset.correct === 'true';
    if(isCorrect){
        selectedBtn.classList.add('correct');
        score++;
    }else{
        selectedBtn.classList.add('incorrect');
    }

    Array.from(answerButtons.children).forEach(button => {
        if(button.dataset.correct === 'true'){
            button.classList.add('correct');
        }
        button.disabled = true;
    });

    // Show "Next" or "Show Score" depending on question index
    if (currentQuestionIndex < questions.length - 1) {
        nextButton.innerHTML = 'Next';
        nextButton.style.display = 'block';
    } else {
        nextButton.innerHTML = 'Show Score';
        nextButton.style.display = 'block';
    }
}

function showScore(){
    resetState();
    questionElement.innerHTML = `You Scored ${score} out of ${questions.length}!`;
    nextButton.innerHTML = 'Play Again';
    nextButton.style.display = 'block';
    currentQuestionIndex = -1; // Reset for play again
}

function handleNextButton(){
    currentQuestionIndex++;
    if(currentQuestionIndex < questions.length){
        showQuestion();
    }else{
        showScore();
    }
}

nextButton.addEventListener('click', () => {
    handleNextButton();
});

function toggleSection(id) {
    const section = document.getElementById(id);
    section.style.display = section.style.display === 'block' ? 'none' : 'block';
}

document.querySelectorAll('.footer-toggle').forEach(button => {
    button.addEventListener('click', () => {
        const sectionId = button.getAttribute('data-toggle');
        const section = document.getElementById(sectionId);
        if (section) {
            const isVisible = section.style.display === 'block';
            section.style.display = isVisible ? 'none' : 'block';
        }
    });
});

startQuiz();
