var gamePattern = [];
var userClickedPattern = [];
var displayText = "Simon Game Level "
var btnColor = ["red", "blue", "green", "yellow"];
var started = false;
var counter = 0;
$(document).keydown(function(e){
    if (started == false){
        $("body").removeClass("game-over");
        $("#level-title").css("color", "#FEF2BF");
        $(".score").css("color","#FEF2BF");
        $("#level-title").text(displayText+counter);
        if(gamePattern.length == 0){
            nextSequence();
        }
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
        $(".timer-box").text(gamePattern.length);

       // Call next color
        setTimeout(function(){
            $("body").removeClass("correct");
            nextSequence();
            userClickedPattern = [];
        },1000);
    }else{
        gameOver();
        
    }
}

// Game over
function gameOver(){
    $("#score").text(counter);
    var failedSound = new Audio("sounds/wrong.mp3");
    failedSound.play();
    $("body").addClass("game-over");
    $("#level-title").text("Game Over, Press Any Key to Restart").css("color","black");
    $(".score").css("color","black");
    started = false;
    startOver();
}

// Start OVer
function startOver(){
    //press any key to startover
    counter = 0;
    gamePattern = [];
    userClickedPattern = [];
    $(".timer-box").text("0");
}

function animatePress(currentColor){
    $("#"+currentColor).addClass("pressed");
    setTimeout(function(){
        $("#"+currentColor).removeClass("pressed");
    },100);
}
nextSequence();


