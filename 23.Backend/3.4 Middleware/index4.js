import express from "express";
import {dirname} from "path";
import { fileURLToPath } from "url";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

var bandName = "";
const __dirName = dirname(fileURLToPath(import.meta.url));

app.use(bodyParser.urlencoded({extended: true}));

function formMiddleware(req, res, next){
  var streetName = req.body.street;
  var petName = req.body.pet;
  bandName = streetName+ " " +petName;
  next();
}
app.use(formMiddleware);

app.get("/", (req, res) =>{
  res.sendFile(__dirName + "/public/index.html");
});

app.post("/submit", (req, res) =>{
  res.send("Request Method: "+req.method+"<br><h1><b>Your band name is: </b></h1><h2>"+bandName+"</2>");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
