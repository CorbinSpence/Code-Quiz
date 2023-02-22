

var time = 100
var questionCount = 0
var currentIndex = 0
var currentQuestion
var quizIsOver = false
const container = $('.container')
const resultsKey = 'results'
var quizResults
if(JSON.parse(localStorage.getItem(resultsKey))==null){
    let emptyArr = []
    localStorage.setItem(resultsKey, emptyArr)
    quizResults = emptyArr
}else{
    quizResults = JSON.parse(localStorage.getItem(resultsKey))
}

var countdown = -1

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

container.append('<div class="start-container"></div>')
var startContainer = $('.start-container')
startContainer.append('<h2> Coding Quiz Challenge </h2>')
startContainer.append('<p> Try to answer the folowing code related questions within the time limit. Keep in mind that incorrect answers will penalize your score/time by ten seconds! </p>')
startContainer.append('<input type="button" class="start-button" value="Begin Quiz">')
var startButton = $('.start-button')
startButton.on('click', function(event){
    event.preventDefault
    $('.start-container').remove()
    initializeQuiz()
    setUpNextQuestion()
})
container.append('<div class="highScores"> View high scores </div>')
var highScores = $('.highScores')

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
    countdown = setInterval(function(){
        if(time<=0 || quizIsOver){
            clearInterval(countdown)
            console.log('The quiz is over')
            quizIsOver = true
            removeQuiz()
            setUpSubmissionPage()
        }else{
            time--
            timerBox.text('Time: '+time)
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
            }
        }else{
            console.log("wrong answer")
            time = time<10? 0:time-10
            timerBox.text('Time: '+time)
            if(currentIndex<questionCount-1){
                currentIndex++
                setUpNextQuestion()
            }else{
                quizIsOver = true
            }
        }
    })
    setUpNextQuestion()
}


highScores.on('click', function(){
    let startContainer = $('.start-container')
    let highScores = $('.highScores')
    let questionBox = $('.questionBox')
    let answerRadioButtons = $('.answerRadioButtons')
    let timer = $('.timer')
    let highscoreRequest = $('.highscore-request')
    highScores.remove()
    startContainer.remove()
    questionBox.remove()
    answerRadioButtons.remove()
    timer.remove()
    highscoreRequest.remove()
    if(countdown!=-1){
        clearInterval(countdown)
    }
    setUpHSBoard()
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
    let radioButtons = $('.answerRadioButtons')

    form.children('.answerButton').remove()
    form.remove()
    radioButtons.remove()
    questionBox.remove()
    timerBox.remove()
}
function setUpSubmissionPage(){
    container.append('<div class="highscore-request"></div>')
    var highscoreRequest = $('.highscore-request')
    highscoreRequest.append('<h2>All done!</h2>')
    highscoreRequest.append('<h3> Your score is '+time+'. </h3>')
    highscoreRequest.append('<form class="submission-form"></form>')
    var form = $('.submission-form')
    form.append('<label for="player-username"> Enter name -\t </label>')
    form.append('<input type="text" placeholder="abc" id="player-username">')
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
            //quizResults.push({name:typedName.val(), score:time})
            addResult(quizResults, {name:typedName.val(), score:time})
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
    let highScores = $('.highScores')
    requestDiv.remove()
    highScores.remove()
}
function setUpHSBoard(){
    console.log('setUpHSBoard')
    container.append('<div class="scoreboard-view"></div>')
    let scoreboard = $('.scoreboard-view')
    scoreboard.append('<h2> High Scores </h2>')
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
        container.append('<div class="start-container"></div>')
        let startContainer = $('.start-container')
        startContainer.append('<h2> Coding Quiz Challenge </h2>')
        startContainer.append('<p> Try to answer the folowing code related questions within the time limit. Keep in mind that incorrect answers will penalize your score/time by ten seconds! </p>')
        startContainer.append('<input type="button" class="start-button" value="Begin Quiz">')
        container.append('<div class="highScores"> View high scores </div>')
        time = 100
        currentIndex = 0
        quizIsOver = false
        let startButton = $('.start-button')
        startButton.on('click', function(event){
            event.preventDefault
            $('.start-container').remove()
            initializeQuiz()
            setUpNextQuestion()
        })
        let highScores = $('.highScores')
        highScores.on('click', function(){
            let startContainer = $('.start-container')
            let highScores = $('.highScores')
            let questionBox = $('.questionBox')
            let answerRadioButtons = $('.answerRadioButtons')
            let timer = $('.timer')
            let highscoreRequest = $('.highscore-request')
            highScores.remove()
            startContainer.remove()
            questionBox.remove()
            answerRadioButtons.remove()
            timer.remove()
            highscoreRequest.remove()
            if(countdown!=-1){
                clearInterval(countdown)
            }
            setUpHSBoard()
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
function addResult(arr, val){
    let len = arr.length
    console.log('This is '+len)
    if(len==0){
        arr.push(val)
    }else{
        for(let i=0; i<len; i++){
            console.log(arr[i].score)
            console.log(val.score)
            if(arr[i].score<=val.score){
                console.log('value spliced')
                arr.splice(i, 0, val)
                break
            }else if(i===len-1){
                console.log('value pushed')
                arr.push(val)
            }
        }
    }
    console.log(arr)
}
// This is just for testing purposes
function printPlayerScores(){
    let results = JSON.parse(localStorage.getItem(resultsKey))
    for(s in results){
        console.log(results[s].name)
        console.log(results[s].score)
    }
    
}


