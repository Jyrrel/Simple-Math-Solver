let playerName = "", score = 0, questionIndex = 0, timeLeft = 15, timer, currentDifficulty = "";
let playerScores = { easy: [], medium: [], hard: [] }, questionsAnswered = [];

// Load and save scores to local storage
const loadScores = () => {
    const storedScores = localStorage.getItem("playerScores");
    if (storedScores) playerScores = JSON.parse(storedScores);
};

const saveScores = () => {
    localStorage.setItem("playerScores", JSON.stringify(playerScores));
};

// Load scores on page load
loadScores();

// Handle name submission
const handleNameSubmit = () => {
    playerName = document.getElementById("playerName").value.trim();
    if (!playerName) return alert("Please enter your name first.");
    document.getElementById("nameInputSection").style.display = "none";
    document.getElementById("difficultySelection").style.display = "block";
};

// Handle difficulty selection
const handleDifficultySelection = (difficulty) => {
    currentDifficulty = difficulty;
    startGame();
};

// Event listeners
document.getElementById("nameSubmit").addEventListener("click", handleNameSubmit);
document.getElementById("playerName").addEventListener("keydown", (e) => e.key === "Enter" && handleNameSubmit());
document.querySelectorAll(".difficulty-btn").forEach(btn => {
    btn.addEventListener("click", () => handleDifficultySelection(btn.getAttribute("data-mode")));
});

// Start the game
const startGame = () => {
    document.getElementById("difficultySelection").style.display = "none";
    document.getElementById("gameSection").style.display = "block";
    score = questionIndex = 0;
    questionsAnswered = [];
    generateQuestion();
};

// Generate a question
const generateQuestion = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const operations = {
        easy: { answer: num1 + num2, text: `${num1} + ${num2} = ?` },
        medium: { answer: num1 * num2, text: `${num1} × ${num2} = ?` },
        hard: { answer: Math.pow(num1, 2) - num2, text: `${num1}² - ${num2} = ?` }
    };
    const { answer, text } = operations[currentDifficulty];
    document.getElementById("questionText").innerText = text;
    document.getElementById("questionTracker").innerText = `Question ${questionIndex + 1}/10`;

    const choices = [answer, answer + 1, answer - 1, answer + 2].sort(() => Math.random() - 0.5);
    const answerContainer = document.getElementById("answerChoices");
    answerContainer.innerHTML = "";

    choices.forEach(choice => {
        const btn = document.createElement("button");
        btn.innerText = choice;
        btn.className = "answer-btn";
        btn.onclick = () => checkAnswer(btn, answer);
        answerContainer.appendChild(btn);
    });

    resetTimer(answer);
};

// Check the answer
const checkAnswer = (selectedBtn, correctAnswer) => {
    if (parseInt(selectedBtn.innerText) === correctAnswer) score++;
    questionsAnswered.push({ question: document.getElementById("questionText").innerText, correctAnswer, selectedAnswer: selectedBtn.innerText });
    questionIndex++;
    questionIndex < 10 ? generateQuestion() : endGame();
};

// Reset timer
const resetTimer = (correctAnswer) => {
    clearInterval(timer);
    timeLeft = 15;
    document.getElementById("timeLeft").innerText = timeLeft;

    timer = setInterval(() => {
        if (--timeLeft <= 0) {
            clearInterval(timer);
            questionsAnswered.push({ question: document.getElementById("questionText").innerText, correctAnswer, selectedAnswer: "No Answer" });
            questionIndex++;
            questionIndex < 10 ? generateQuestion() : endGame();
        }
        document.getElementById("timeLeft").innerText = timeLeft;
    }, 1000);
};

// End game
const endGame = () => {
    clearInterval(timer);
    document.getElementById("gameSection").style.display = "none";
    document.getElementById("highScores").style.display = "block";
    document.querySelectorAll(".answer-btn").forEach(btn => btn.disabled = true);
    addPlayerScore(playerName, score, currentDifficulty);
    displayFinalScore();

    if (score === 10) {
        document.getElementById("congratulations").style.display = "block";
        document.getElementById("congratulationsName").innerText = playerName; // Display player name in congratulations
    } else {
        document.getElementById("niceTry").style.display = "block";
        document.getElementById("userScore").innerText = score;
        document.getElementById("playerNameDisplay").innerText = playerName; // Display player name in nice try
    }
};

// Add player score
const addPlayerScore = (name, score, difficulty) => {
    playerScores[difficulty].push({ name, score });
    saveScores();
    updateRankings();
};

// Update rankings
const updateRankings = () => {
    for (let difficulty in playerScores) {
        playerScores[difficulty].sort((a, b) => b.score - a.score);
    }
    displayRankings();
};

// Display rankings
const displayRankings = () => {
    ["easy", "medium", "hard"].forEach(difficulty => {
        const tableBody = document.getElementById(`${difficulty}Scores`);
        tableBody.innerHTML = "";
        playerScores[difficulty].forEach((player, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `<td>${index + 1}</td><td>${player.name}</td><td>${player.score}</td>`;
            tableBody.appendChild(row);
        });
    });
};

// Show/hide answers
document.getElementById("showAnswersHighScores").addEventListener("click", () => {
    const resultContainer = document.getElementById("answersContainerHighScores");
    if (resultContainer.style.display === "none" || resultContainer.style.maxHeight === "0px") {
        resultContainer.style.display = "block";
        resultContainer.style.maxHeight = "500px"; // Set a max height for the animation
        resultContainer.innerHTML = "<h3>Your Answers</h3>"; // Clear previous content
        questionsAnswered.forEach((q, index) => {
            resultContainer.innerHTML += `<strong>Q${index + 1}:</strong> ${q.question} <br>
                Your Answer: <span style="color: ${q.selectedAnswer === "No Answer" ? 'gray' : (q.selectedAnswer == q.correctAnswer ? 'green' : 'red')}">${q.selectedAnswer}</span> 
                <br> Correct Answer: <span style="font-weight: bold; color: green">${q.correctAnswer}</span><br>`;
        });
    } else {
        resultContainer.style.maxHeight = "0"; // Collapse the section
        setTimeout(() => {
            resultContainer.style.display = "none"; // Hide after animation
        }, 500); // Match this duration with the CSS transition duration
    }
});

// Display final score
const displayFinalScore = () => {
    const finalScoreElement = document.getElementById("finalScore");
    finalScoreElement.innerText = `You've scored ${score} out of 10`;
    finalScoreElement.style.display = "block";

    const answerCircles = document.getElementById("answerCircles");
    answerCircles.innerHTML = "";
    questionsAnswered.forEach(q => {
        const circle = document.createElement("div");
        circle.className = "circle";
        circle.style.backgroundColor = q.selectedAnswer == q.correctAnswer ? "#28a745" : (q.selectedAnswer === "No Answer" ? "gray" : "#dc3545");
        answerCircles.appendChild(circle);
    });
    answerCircles.style.display = "block";
};

// Overall Rankings Button
document.getElementById("overallButton").addEventListener("click", () => {
    const overallScoresSection = document.getElementById("overallScores");
    if (overallScoresSection.style.display === "none") {
        overallScoresSection.style.display = "block";
        overallScoresSection.style.maxHeight = "500px"; // Set a max height for the animation
    } else {
        overallScoresSection.style.maxHeight = "0"; // Collapse the section
        setTimeout(() => {
            overallScoresSection.style.display = "none"; // Hide after animation
        }, 500); // Match this duration with the CSS transition duration
    }

    const overallScoresTable = document.getElementById("overallScoresTable");
    overallScoresTable.innerHTML = "";
    const overallScores = [];

    // Combine scores from all difficulties
    for (let difficulty in playerScores) {
        playerScores[difficulty].forEach(player => {
            const existingPlayer = overallScores.find(p => p.name === player.name);
            if (existingPlayer) {
                existingPlayer.score += player.score; // Combine scores
            } else {
                overallScores.push({ name: player.name, score: player.score });
            }
        });
    }

    // Sort overall scores
    overallScores.sort((a, b) => b.score - a.score);
    overallScores.forEach((player, index) => {
        overallScoresTable.innerHTML += `<tr><td>${index + 1}</td><td>${player.name}</td><td>${player.score}</td></tr>`;
    });
});

// Back Button
document.getElementById("backButton").addEventListener("click", () => {
    document.getElementById("gameSection").style.display = "none";
    document.getElementById("difficultySelection").style.display = "block";
});

// Retry Button
document.getElementById("retry").addEventListener("click", () => {
    document.getElementById("highScores").style.display = "none";
    document.getElementById("difficultySelection").style.display = "block";
    document.getElementById("motivationalVideo").style.display = "none";
    document.getElementById("congratulations").style.display = "none";
    document.getElementById("niceTry").style.display = "none";
});

// Quit Button
document.getElementById("quit").addEventListener("click", () => {
    document.getElementById("highScores").style.display = "none";
    document.getElementById("nameInputSection").style.display = "block";
    document.getElementById("motivationalVideo").style.display = "none";
    document.getElementById("congratulations").style.display = "none";
    document.getElementById("niceTry").style.display = "none";
});

// Watch Video Button
document.getElementById("watchVideo").addEventListener("click", () => {
    const video = document.getElementById("motivationalVideo");
    if (video.style.display === "none") {
        video.style.display = "block";
        video.play();
    } else {
        video.style.display = "none";
        video.pause();
    }
});
