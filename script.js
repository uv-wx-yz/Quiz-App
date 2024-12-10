// DOM Selection
const progressBar = document.querySelector(".progress-bar"),
  progressText = document.querySelector(".progress-text");

// Progress Bar Logic (Percentage Calculation)
const progress = (value) => {
  const percentage = (value / time) * 100; // Math calculation
  progressBar.style.width = `${percentage}%`; // Dynamic DOM Update
  progressText.innerHTML = `${value}`; // Update inner text
};

// DOM Selection for UI Elements
const startBtn = document.querySelector(".start"),
  numQuestions = document.querySelector("#num-questions"),
  category = document.querySelector("#category"),
  difficulty = document.querySelector("#difficulty"),
  timePerQuestion = document.querySelector("#time"),
  quiz = document.querySelector(".quiz"),
  startScreen = document.querySelector(".start-screen");

// Variables (Basic Memory Management)
let questions = [], // Array (Dynamic data storage)
  time = 30, // Simple variable
  score = 0, // Simple variable
  currentQuestion, // Index tracking (Pointer)
  timer; // Timer logic

// Start Quiz Function (API Fetch)
const startQuiz = () => {
  const num = numQuestions.value, // Input value extraction
    cat = category.value,
    diff = difficulty.value;

  loadingAnimation(); // Function Call

  // API Fetch (Network Operation)
  const url = `https://opentdb.com/api.php?amount=${num}&category=${cat}&difficulty=${diff}&type=multiple`;
  fetch(url) // Asynchronous fetch
    .then((res) => res.json()) // JSON Parsing
    .then((data) => {
      questions = data.results; // Assigning API response to array
      setTimeout(() => {
        startScreen.classList.add("hide"); // Dynamic class manipulation
        quiz.classList.remove("hide"); // Show Quiz
        currentQuestion = 1; // Index reset
        showQuestion(questions[0]); // Array access (Index 0)
      }, 1000); // Timeout for effect
    });
};

// Add Event Listener (DOM Manipulation)
startBtn.addEventListener("click", startQuiz);

// Display Question (Dynamic Rendering)
const showQuestion = (question) => {
  const questionText = document.querySelector(".question"),
    answersWrapper = document.querySelector(".answer-wrapper");
  questionNumber = document.querySelector(".number");

  questionText.innerHTML = question.question; // Direct DOM Manipulation

  // Combine and Shuffle Answers (Array Operations)
  const answers = [
    ...question.incorrect_answers,
    question.correct_answer.toString(),
  ];
  answersWrapper.innerHTML = ""; // Reset wrapper content
  answers.sort(() => Math.random() - 0.5); // Random Shuffling (Sort Logic)

  // Render Answers (Loop)
  answers.forEach((answer) => {
    answersWrapper.innerHTML += `
                  <div class="answer">
            <span class="text">${answer}</span>
            <span class="checkbox">
              <i class="fas fa-check"></i>
            </span>
          </div>
        `;
  });

  // Update Question Number (Index Tracking)
  questionNumber.innerHTML = ` Question <span class="current">${
    questions.indexOf(question) + 1
  }</span>
            <span class="total">/${questions.length}</span>`;

  // Add Event Listeners to Answers (Iteration + Event Binding)
  const answersDiv = document.querySelectorAll(".answer");
  answersDiv.forEach((answer) => {
    answer.addEventListener("click", () => {
      if (!answer.classList.contains("checked")) {
        answersDiv.forEach((answer) => {
          answer.classList.remove("selected");
        });
        answer.classList.add("selected");
        submitBtn.disabled = false;
      }
    });
  });

  // Timer Logic
  time = timePerQuestion.value; // Input Read
  startTimer(time); // Timer Start
};

// Timer (Decrement and Interval Logic)
const startTimer = (time) => {
  timer = setInterval(() => {
    if (time === 3) {
      playAdudio("countdown.mp3"); // Audio Play
    }
    if (time >= 0) {
      progress(time); // Update Progress
      time--;
    } else {
      checkAnswer(); // Timeout Handler
    }
  }, 1000); // Interval of 1 second
};

// Loading Animation (Dynamic Text Update)
const loadingAnimation = () => {
  startBtn.innerHTML = "Loading";
  const loadingInterval = setInterval(() => {
    if (startBtn.innerHTML.length === 10) {
      startBtn.innerHTML = "Loading";
    } else {
      startBtn.innerHTML += ".";
    }
  }, 500);
};

// Credit Display (Basic DOM Creation)
function defineProperty() {
  var osccred = document.createElement("div"); // Element Creation
  osccred.style.position = "absolute"; // Styling (Inline)
  osccred.style.bottom = "0";
  osccred.style.right = "0";
  osccred.style.fontSize = "10px";
  osccred.style.color = "#ccc";
  osccred.style.fontFamily = "sans-serif";
  osccred.style.padding = "5px";
  osccred.style.background = "#fff";
  osccred.style.borderTopLeftRadius = "5px";
  osccred.style.borderBottomRightRadius = "5px";
  osccred.style.boxShadow = "0 0 5px #ccc";
  document.body.appendChild(osccred); // Append to DOM
}

defineProperty();

// Submit Button (Event Listener)
const submitBtn = document.querySelector(".submit"),
  nextBtn = document.querySelector(".next");

submitBtn.addEventListener("click", () => {
  checkAnswer(); // Function Call
});

// Next Question Button Logic
nextBtn.addEventListener("click", () => {
  nextQuestion();
  submitBtn.style.display = "block";
  nextBtn.style.display = "none";
});

// Answer Check Logic
const checkAnswer = () => {
  clearInterval(timer); // Timer Stop
  const selectedAnswer = document.querySelector(".answer.selected");
  if (selectedAnswer) {
    const answer = selectedAnswer.querySelector(".text").innerHTML;
    if (answer === questions[currentQuestion - 1].correct_answer) {
      score++; // Increment Score
      selectedAnswer.classList.add("correct");
    } else {
      selectedAnswer.classList.add("wrong");
      document.querySelectorAll(".answer").forEach((answer) => {
        if (
          answer.querySelector(".text").innerHTML ===
          questions[currentQuestion - 1].correct_answer
        ) {
          answer.classList.add("correct");
        }
      });
    }
  }
  // Mark all answers as checked
  document.querySelectorAll(".answer").forEach((answer) => {
    answer.classList.add("checked");
  });

  // Button Display Toggle
  submitBtn.style.display = "none";
  nextBtn.style.display = "block";
};

// Question Navigation Logic
const nextQuestion = () => {
  if (currentQuestion < questions.length) {
    currentQuestion++; // Increment Index
    showQuestion(questions[currentQuestion - 1]); // Next Question
  } else {
    showScore(); // End Quiz
  }
};

// Final Score Display
const endScreen = document.querySelector(".end-screen"),
  finalScore = document.querySelector(".final-score"),
  totalScore = document.querySelector(".total-score");

const showScore = () => {
  endScreen.classList.remove("hide"); // Toggle Visibility
  quiz.classList.add("hide");
  finalScore.innerHTML = score; // Score Render
  totalScore.innerHTML = `/ ${questions.length}`;
};

// Restart Quiz
const restartBtn = document.querySelector(".restart");
restartBtn.addEventListener("click", () => {
  window.location.reload(); // Page Reload
});

// Audio Play Logic
const playAdudio = (src) => {
  const audio = new Audio(src); // Audio Object
  audio.play();
};
