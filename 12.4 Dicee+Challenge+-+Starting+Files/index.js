randomNumber1 = Math.floor(Math.random() * 6) + 1; //1-6
randomNumber2 = Math.floor(Math.random() * 6) + 1; //1-6

document.querySelector("button").addEventListener("click", function(){
    rollDice();
});

function rollDice(){
    var file_dir = "images/";
    var img1_file = "dice" + randomNumber1 + ".png";
    var img2_file = "dice" + randomNumber2 + ".png";
    
    // Change the image source
    var img1 = document.querySelectorAll("img")[0];
    img1.setAttribute("src", file_dir + img1_file);
    var img2 = document.querySelectorAll("img")[1];
    img2.setAttribute("src", file_dir + img2_file);

    // Change the h1 text to show the winner
    if (randomNumber1 > randomNumber2) {
        document.querySelector("h1").innerHTML = "🚩 Player 1 Wins!";
    } else if(randomNumber1 < randomNumber2) {
        document.querySelector("h1").innerHTML = "Player 2 Wins! 🚩";
    } else {    // Draw
        document.querySelector("h1").innerHTML = "😊 Draw!";
    }
}
