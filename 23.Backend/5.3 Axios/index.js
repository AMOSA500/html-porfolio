import express from "express";
import bodyParser from "body-parser";
import axios from "axios";
import https from "https";


const app = express();
const port = 3000;

app.use(express.static("public")); // to serve static files
app.use(bodyParser.urlencoded({ extended: true })); // to support URL-encoded bodies

// Step 1: Create an async function called APICallback that takes in two parameters:
async function APICallback(type=null,participants=null)  {
  if(type != null || participants != null) {
    try {
      const response = await axios.get(`https://bored-api.appbrewery.com/filter?type=${type}&participants=${participants}`);
      let pos = Math.floor(Math.random() * response.data.length);
      const result = response.data[pos];
      return result;
    }catch(error){
      console.log(error.data);
      return {error: "Activities not found for the given filter."};
    }
  }else{
    try {
      const response = await axios.get("https://bored-api.appbrewery.com/random");
      const result = response.data;
      return result;
    } catch (error) {
      return {error: "No activities that match your criteria."};
  }
  }
  
}

app.get("/", async(req, res) => {
  const result = await APICallback(); // Call the API 
  res.render("index.ejs", {data: result});
});

app.post("/", async (req, res) => {
  const type = req.body.type;
  const participants = req.body.participants;
  res.render("index.ejs", {data: await APICallback(type,participants)});
});

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
