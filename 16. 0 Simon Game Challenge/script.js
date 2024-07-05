$(document).ready(function(){
    var gamePattern = [];
    var btnColor = ["red", "blue", "green", "yellow"];
    var randNum = Math.floor(Math.random() * 4); // 
    function nextSequence(i){
        if (i == undefined) {
            i = randNum;
        }
        var randSelectedColor = btnColor[i];
        $("#"+randSelectedColor).fadeOut(100).fadeIn(100);
        playSound(randSelectedColor);
    }

    function playSound(color){
        var audio = new Audio("sounds/"+color+".mp3");
        audio.play();
    }

    $(".box").click(function(){
        var userChosenColor = this.id;
        gamePattern.push(userChosenColor);
        var colorIndex = btnColor.indexOf(userChosenColor);
        nextSequence(colorIndex);
    })
    nextSequence();
});

