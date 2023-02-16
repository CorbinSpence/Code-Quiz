const devMode = true
var time = 100
var container = $('.container')
container.append('<div class="questionBox"> This is a question kahbdihbhdab sxhkkgevfjgdavhdjgvdvdDgvjsgdvf </div>')
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
form.on('click', '.answerButton', function(event){
    event.preventDefault
    // if right answer is clicked
    if($(event.target).val()==='1'){
        console.log("right answer")
    }else{
        console.log("wrong answer")
        time-=10
        timerBox.text('Time: '+time)
    }
})
var countdown = setInterval(function(){
    time--
    timerBox.text('Time: '+time)
    if(time<=0){
        clearInterval(countdown)
        console.log('The quiz is over')
    }
},1000)
