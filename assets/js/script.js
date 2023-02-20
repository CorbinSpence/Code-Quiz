const devMode = true

var time = 100
var questionCount = 0
var currentIndex = 0
var currentQuestion
var quizIsOver = false
const container = $('.container')
var quizResults = []
const resultsKey = 'results'

var quiz = {
    question: '',
    correctAnswer: '',
    0: '',
    1: '',
    2: '',
    3: ''
}

quiz.question = 'Arrays in javascript can contain...'
quiz.correctAnswer = 'All of the above'
quiz[0] = 'numbers'
quiz[1] = 'boolean values'
quiz[2] = 'strings'
quiz[3] = quiz.correctAnswer
localStorage.setItem(questionCount, JSON.stringify(quiz))
questionCount++

quiz.question = 'How do you enclose an if statement?'
quiz.correctAnswer = 'With curley brackets'
quiz[0] = 'With parentheses'
quiz[1] = quiz.correctAnswer
quiz[2] = 'With square brackets'
quiz[3] = 'With quotes'
localStorage.setItem(questionCount, JSON.stringify(quiz))
questionCount++

quiz.question = 'String values must be enclosed in ____ when being assigned to variables.'
quiz.correctAnswer = 'quotes'
quiz[0] = 'commas'
quiz[1] = quiz.correctAnswer
quiz[2] = 'curly brackets'
quiz[3] = 'parentheses'
localStorage.setItem(questionCount, JSON.stringify(quiz))
questionCount++

quiz.question = 'A useful tool to use when printing to the debugger is'
quiz.correctAnswer = 'console.log()'
quiz[0] = quiz.correctAnswer
quiz[1] = 'for loops'
quiz[2] = 'JavaScript'
quiz[3] = 'alert()'
localStorage.setItem(questionCount, JSON.stringify(quiz))
questionCount++


function initializeQuiz(){
    container.append('<div class="questionBox">  </div>')
    container.append('<div class="answerRadioButtons">  </div>')
    var answers = $('.answerRadioButtons')
    answers.append('<form></form>')
    var form = $('form')
    for(let i=0; i<4; i++){
        form.append('<input type="button" name="answer" id="answer'+i+'" value="'+i+'" class="answerButton">')
        form.append('<br>')
    }
    container.append('<div class="timer">Time: '+time+'</div>')
    var timerBox = $('.timer')
    container.append('<div class="highScores"><a href="#"> View high scores </a></div>')
    var countdown = setInterval(function(){
        time--
        timerBox.text('Time: '+time)
        if(time<=0 || quizIsOver){
            clearInterval(countdown)
            console.log('The quiz is over')
            quizIsOver = true
        }
    },1000)
    currentQuestion = JSON.parse(localStorage.getItem(currentIndex))
    form.on('click', '.answerButton', function(event){
        event.preventDefault
        // if right answer is clicked
        if($(event.target).val()===currentQuestion.correctAnswer){
            //if there is a next question
            if(currentIndex<questionCount-1){
            console.log("right answer")
            currentIndex++
            console.log(currentIndex)
            setUpNextQuestion()
            }else{
                quizIsOver = true
                removeQuiz()
                setUpSubmissionPage()
            }
        }else{
            console.log("wrong answer")
            if(time<10){
                time = 0
            }else{
                time-=10
            }
            timerBox.text('Time: '+time)
        }
    })
    setUpNextQuestion()
}

var startButton = $('.start-button')
startButton.on('click', function(event){
    event.preventDefault
    $(event.target).remove()
    initializeQuiz()
    setUpNextQuestion()
})

function setUpNextQuestion(){
    currentQuestion = JSON.parse(localStorage.getItem(currentIndex))
    //sets up displayed question
    let questionBox = $('.questionBox')
    questionBox.text(currentQuestion.question)
    //sets up options
    for(let i=0; i<4; i++){
        let option = $('#answer'+i)
        option.val(currentQuestion[i])
    }
}

function removeQuiz(){
    let form = $('form')
    let timerBox = $('.timer')
    let questionBox = $('.questionBox')
    let highScores = $('.highScores')
    let radioButtons = $('.answerRadioButtons')

    form.children('.answerButton').remove()
    form.remove()
    radioButtons.remove()
    questionBox.remove()
    timerBox.remove()
    highScores.remove()
}
function setUpSubmissionPage(){
    container.append('<div class="highscore-request"></div>')
    var highscoreRequest = $('.highscore-request')
    highscoreRequest.append('<h2>Type your username</h2>')
    highscoreRequest.append('<form class="submission-form"></form>')
    var form = $('.submission-form')
    form.append('<input type="text" placeholder="abc" id="player-username">')
    form.append('<span> - Highscore: <b>'+time+'</b> </span>')
    form.append('<br>')
    form.append('<input type="button" value="Submit" id="submit-username">')
    highscoreRequest.append('<div class="username-error"> Type in a name </div>')
    let errorMessage = $('.username-error')
    errorMessage.hide()
    form.on('click', '#submit-username', function (event){
        event.preventDefault()
        let typedName = $('#player-username')
        if(typedName.val()!=''){
            console.log('submited '+typedName.val()+' - '+time)
            quizResults.push({name:typedName.val(), score:time})
            localStorage.setItem(resultsKey, JSON.stringify(quizResults))
            typedName.val('')
            errorMessage.hide()
            printPlayerScores()
            destroySubmissionPage()
            setUpHSBoard()
        }else{
            console.log('Type in a name')
            errorMessage.show()
        }
    })
}
function destroySubmissionPage(){
    console.log('destroySubmissionPage')
    var requestDiv = $('.highscore-request')
    requestDiv.remove()
}
function setUpHSBoard(){
    console.log('setUpHSBoard')
    container.append('<div class="scoreboard-view"></div>')
    let scoreboard = $('.scoreboard-view')
    scoreboard.append('<h2> Previous Scores </h2>')
    scoreboard.append('<ol class="score-list"></ol>')
    let scoreList = $('.score-list')
    let results = JSON.parse(localStorage.getItem(resultsKey))
    for(s in results){
        scoreList.append('<li>'+results[s].name+'-'+results[s].score+'</li>')
    }
    scoreboard.append('<form class="hs-form">  </form>')
    let form = $('.hs-form')
    form.append('<input type="button" value="Return" id="return-home">')
    form.append('<input type="button" value="Clear High Scores" id="clear-scores">')
    let returnButton = $('#return-home')
    returnButton.on('click', function(event){
        event.preventDefault()
        destroyHSPage()
        container.append('<input type="button" class="start-button" value="Begin Quiz">')
        time = 100
        currentIndex = 0
        quizIsOver = false
        let startButton = $('.start-button')
        startButton.on('click', function(event){
            event.preventDefault
            $(event.target).remove()
            initializeQuiz()
            setUpNextQuestion()
        })
    })
    let clearButton = $('#clear-scores')
    clearButton.on('click', function(event){
        event.preventDefault()
        quizResults = []
        localStorage.setItem(resultsKey, JSON.stringify(quizResults))
        $('li').remove()
    })
}
function destroyHSPage(){
    let hSBoard = $('.scoreboard-view') 
    hSBoard.remove()
}
// This is just for testing purposes
function printPlayerScores(){
    let results = JSON.parse(localStorage.getItem(resultsKey))
    for(s in results){
        console.log(results[s].name)
        console.log(results[s].score)
    }
    
}


