var gamePattern = [];
var userClickedPattern = [];
var displayText = "Simon Game Level "
var btnColor = ["red", "blue", "green", "yellow"];
var started = false;
var counter = 0;
$(document).keydown(function(e){
    if (started == false){
        $("#level-title").text(displayText+counter);
        started = true;
    }
});

function nextSequence(i){
    var randNum = Math.floor(Math.random() * 4); // 
    var randSelectedColor = btnColor[randNum];
    gamePattern.push(randSelectedColor);
    $("#"+randSelectedColor).fadeOut(100).fadeIn(100);
    if(started == true){
        $("#level-title").text(displayText+(++counter));
    }

    playSound(randSelectedColor);
}

function playSound(color){
    var audio = new Audio("sounds/"+color+".mp3");
    //audio.play();
}

$(".box").click(function(){
    if (started == true){
        var userChosenColor = this.id;
        userClickedPattern.push(userChosenColor);
        playSound(userChosenColor);

        // animatePress
        animatePress(userChosenColor);
        console.log(userClickedPattern);
        console.log(gamePattern);

        // Check answer
        if (userClickedPattern.length == gamePattern.length){
            checkAnswer();
        }
    }else{
        alert("Press any key to start the game");
    }
});

function checkAnswer(){
    if(userClickedPattern.toString() == gamePattern.toString()){
        $("body").addClass("correct");
       // Call next color
        setTimeout(function(){
            $("body").removeClass("correct");
            nextSequence();
            userClickedPattern = [];
        },1000);
    }else{
        gameOver();
        setTimeout(function(){ 
            // Reset the game
            location.reload();

        }, 2000);
        
    }
}

// Game over
function gameOver(){
    $("#score").text(counter);
    var failedSound = new Audio("sounds/wrong.mp3");
    failedSound.play();
    $("body").addClass("game-over");
    $("#level-title").text("Game Over, Restart in 2 seconds").css("color","black");
    $(".score").css("color","black");
}

function animatePress(currentColor){
    $("#"+currentColor).addClass("pressed");
    setTimeout(function(){
        $("#"+currentColor).removeClass("pressed");
    },100);
}
nextSequence();


