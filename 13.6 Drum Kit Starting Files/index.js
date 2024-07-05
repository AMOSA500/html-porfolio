var numDrums = document.querySelectorAll(".drum").length; // 7

// Detecting Clicks
for (let i = 0; i < numDrums; i++) {
    document.querySelectorAll(".drum")[i].addEventListener("click", function(){
        playSound(i);
    });    
    
}

// Detecting Keyboard Press
document.addEventListener("keydown", function(event){
    var key = event.key;
    var keyIndex = getKey(key);
    if(keyIndex != -1){
        animateDrum(key);
        playSound(keyIndex);
    }
});

// Play the sound
function playSound(key) {
    var audio = new Audio("sounds/default.mp3");
    switch (key) {
        case 0:
            audio = new Audio("sounds/crash.mp3");
            break;
        case 1:
            audio = new Audio("sounds/kick-bass.mp3");
            break;
        case 2:
            audio = new Audio("sounds/snare.mp3");
            break;
        case 3:
            audio = new Audio("sounds/tom-1.mp3");
            break;
        case 4:
            audio = new Audio("sounds/tom-2.mp3");
            break;
        case 5:
            audio = new Audio("sounds/tom-3.mp3");
            break;
        case 6:
            audio = new Audio("sounds/tom-4.mp3");
            break;
    
        default:
            break;
    }
    audio.play();
}

// Get the key that was pressed
function getKey(key){
    key = key.toLowerCase();
    switch (key) {
        case "a":
            return 0;
        case "s":
            return 1;
        case "d":
            return 2;
        case "f":
            return 3;
        case "j":
            return 4;
        case "k":
            return 5;
        case "l":
            return 6;   
        default:
            return -1;
    }
}

// Animation
function animateDrum(key){
    var keyElement = document.querySelector("."+key);
    keyElement.classList.add("pressed");

    setTimeout(function(){
        keyElement.classList.remove("pressed");
    }, 100);
}