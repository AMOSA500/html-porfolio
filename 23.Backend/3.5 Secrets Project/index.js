import express from 'express';
import bodyParser from "body-parser";
import {dirname} from "path";
import { fileURLToPath } from 'url';

const app = express();
const port = 3000;
var authenticated = false;
const secrets = [
    "When making chocolate desserts, always add a little salt. It makes the chocolate flavour more intense.",
    "Whenever you travel abroad bring a new soundtrack for each place you visit, preferably one you have never heard before. In the future, every time you listen to each soundtrack again they will bring you vivid memories of the places you have visited.",
    "Do not try to be the person your parents would want you to be. Be the person you would like your child to be be It more clearly defines your own convictions, desires, goals, and motivates you to be your best.",
    "If a friend or a family member gets diagnosed with dementia or alzheimer, in the early stages try to find out what their favorite songs of all time are. In this way you would be able to create a playlist for them that could be of great benefit in the later stages of the disease.",
    "When a friend is upset, ask them one simple question before saying anything else: 'Do you want to talk about it or do you want to be distracted from it?'",
    "If you ever forget your WiFi password or you want to get your school WiFi password etc. Just type this command into the command line of a computer already connected to that WiFi: netsh wlan show profile WiFi-name key=clear",
]
const __dirName = dirname(fileURLToPath(import.meta.url));
app.use(bodyParser.urlencoded({extended: true}));

function passValidation(req, res, next){
    var password = req.body.password;
    if(password === "ILoveProgramming"){
        authenticated = true;
        next();
    }else{
        next();
    }
}
app.use(passValidation);


app.get("/", (req, res)=>{
    res.sendFile(`${__dirName}/public/index.html`);
});

app.post("/check", (req,res)=>{
        if(authenticated){
            authenticated = false;
            res.render("hiden/secrets.ejs", {message: secrets});
        }else{
            res.render("index.ejs", {error: "Incorrect Password"});
        }
        });

app.listen(port, (req, res)=>{
    console.log(`Server is running on: ${port}`);
});
