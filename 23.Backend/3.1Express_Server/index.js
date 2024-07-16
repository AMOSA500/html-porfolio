import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";
import {dirname} from "path";
import { fileURLToPath } from "url";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({extended: true})); // for parsing application/x-www-form-urlencoded
app.use(bodyParser.json()); // for parsing application/json
app.use(morgan("tiny")); // for logging the requests

const __dirname = dirname(fileURLToPath(import.meta.url)); // get the current directory

app.get("/", (req, res)=>{
    res.sendFile(__dirname + "/index.js");
});

app.post("/submit", (req, res) =>{
    console.log(req.body); // req.body will contain the data sent by the client
}); // post request

app.get("/about", (req, res) => {
    res.send("<h1>About Us</h1><p> We are a team of developers</p>");
});

app.post("/post", (req, res) => {
    res.sendStatus(200);
});

app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
});

