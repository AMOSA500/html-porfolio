import inquirer from "inquirer";
import qr from "qr-image";
import fs from "fs";

inquirer
    .prompt([
        {
            message: "Enter your URL",
            name: "url",
        },
    ])
    .then((answers) => {
        const url = answers.url;
        var qr_png = qr.image(url, {type: "png", size: 20});
        qr_png.pipe(fs.createWriteStream("qrcode.png"));
    })
    .catch((error) =>{
        if(error.isTtyError) {
            console.log("Prompt couldn't be rendered in the current environment");
        } else {
            console.log("Something went wrong"); 
        }
    })
// import generateName from "sillyname";
// import {randomSuperhero} from 'superheroes';


// var hero = randomSuperhero(); // randomSuperhero() returns a random superhero name
// console.log(hero);


// const  name = generateName();

// console.log(`Hello, my name is ${name} and I am ${hero} superhero!`);