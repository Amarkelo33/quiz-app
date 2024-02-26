const apiUrl = 'https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple';

const quizQuestion = document.querySelector('.quiz-main-question'),
      quizAnswer = document.querySelector('.quiz-main-answers'),
      quizNext = document.querySelector('.quiz-main-next');

async function createQuestions() {

    const response = await fetch(apiUrl);
    var data = await response.json();

    const questions = [];

    data.results.forEach((result) => {
        let question = {
            question: result.question,
            answers: shuffle([result.incorrect_answers[0], result.incorrect_answers[1], result.incorrect_answers[2], result.correct_answer]),
            correctAnswer: result.correct_answer
        }

        questions.push(question);

    });

    let currentQuestionIndex = 0;
    let score = 0;

    startQuiz();

    function showQuestion() {

        resetState();
        
        let currentQuestion = questions[currentQuestionIndex];
        let questionNo = currentQuestionIndex + 1;
        quizQuestion.innerHTML = questionNo + ". " + currentQuestion.question;
    
        currentQuestion.answers.forEach(answer => {
            const button = document.createElement("button");
            button.innerHTML = answer;
            button.classList.add("btn");
            quizAnswer.appendChild(button); 
            if(answer === currentQuestion.correctAnswer) {
                const correctAnswer = 'true';
                button.dataset.correct = correctAnswer;
            } 
            button.addEventListener("click", selectAnswer);
        })
    
    };
    
    function startQuiz() {
    
        currentQuestionIndex = 0;
        score = 0;

        quizNext.innerHtml = "Next";
        showQuestion();
    
    }
    
    function resetState() {
        quizNext.style.display = 'none';
        while(quizAnswer.firstChild) {
            quizAnswer.removeChild(quizAnswer.firstChild);
        }
    }
    
    function selectAnswer(e) {
        const selectedBtn = e.target;
        const isCorrect = selectedBtn.dataset.correct === 'true';
        if(isCorrect) {
            selectedBtn.classList.add('correct');
            score++;
        }
        else {
            selectedBtn.classList.add('incorrect');
        }
    
        Array.from(quizAnswer.children).forEach(button => {
            if(button.dataset.correct === 'true') {
                button.classList.add('correct');
            }
            button.disabled = true;
        });
        quizNext.style.display = "block";
    }
    
    function showScore() {
        resetState();
        quizQuestion.innerHTML = `You scored ${score} out of 10!`;
        quizNext.innerHTML = "Play Again";
        quizNext.style.display = 'block';
    }
    
    function handleNextButton() {
        currentQuestionIndex++;
        if(currentQuestionIndex < questions.length) {
            showQuestion();
        } else {
            showScore();
        }
    }
    
    quizNext.addEventListener("click", () => {
        if(currentQuestionIndex < questions.length) {
            handleNextButton();
        } else {
            location.reload();
            startQuiz();
        }
    })

    function shuffle(array) {
        let currentIndex = array.length,  randomIndex;
      
        // While there remain elements to shuffle.
        while (currentIndex > 0) {
      
          // Pick a remaining element.
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex--;
      
          // And swap it with the current element.
          [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
        }
      
        return array;
    }

}

createQuestions();