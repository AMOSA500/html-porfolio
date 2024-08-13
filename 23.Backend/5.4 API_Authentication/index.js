import express from "express";
import axios from "axios";

const app = express();
const port = 3000;
const API_URL = "https://secrets-api.appbrewery.com";
//TODO 1: Fill in your values for the 3 types of auth.
const yourUsername = "naf.amosa";
const yourPassword = "PASSWORD";
const yourAPIKey = await generateApiKey();
const yourBearerToken = "173f24b0-9aa4-4f4f-aa37-3d8c7ec2d49d";

// API Key generator;
async function generateApiKey() {
      try {
      const response = await axios.get(API_URL + "/generate-api-key");
      return response.data.apiKey;
    } catch (error) {
      console.error(error);
    }
  
}


app.get("/", (req, res) => {
  res.render("index.ejs", { content: "API Response." });
});

app.get("/noAuth", async(req, res) => {
  try {
        //TODO 2: Use axios to hit up the /random endpoint
      const response = await axios.get(API_URL + "/random");
      //The data you get back should be sent to the ejs file as "content"
      const result = response.data;
      //Hint: make sure you use JSON.stringify to turn the JS object from axios into a string.
      res.render("index.ejs", {content: JSON.stringify(result, undefined, 2)});
  } catch (error) {
    res.render("index.ejs", {content: error.message + " - "+ "Too many requests, please try again later."});
  }
  
});

app.get("/basicAuth", async(req, res) => {
  //TODO 3: Write your code here to hit up the /all endpoint
  try {
      const response = await axios.get(API_URL + "/all?page=2",{
      auth:{
        username: yourUsername,
        password: yourPassword
      }
      });
      const result = response.data;
      //Hint: make sure you use JSON.stringify to turn the JS object from axios into a string.
      res.render("index.ejs", {content: JSON.stringify(result, undefined, 2)});
  } catch (error) {
    res.render("index.ejs", {content: error.message + " - "+ "Too many requests, please try again later."});
  }
 
});

app.get("/apiKey", async(req, res) => {
  try {
    const response = await axios.get(API_URL + "/filter",{
     params:{
      score: 5,
      apiKey: yourAPIKey
     },
    });
    const result = response.data;
    res.render("index.ejs", {content: JSON.stringify(result, undefined, 2)});

  } catch (error) {
    res.render("index.ejs", {content: error.message});
    
  }
});

app.get("/bearerToken", async(req, res) => {
  //TODO 5: Write your code here to hit up the /secrets/{id} endpoint
  
  try {
    
      const response = await axios.get(API_URL + "/secrets/2",{
      headers: {
        "Authorization": `Bearer ${yourBearerToken}`
      }
    });
    const result = response.data;
    //Hint: make sure you use JSON.stringify to turn the JS object from axios into a string.
    res.render("index.ejs", {content: JSON.stringify(result, undefined, 2)});
  } catch (error) {
    res.render("index.ejs", {content: error.message + " - "+ "Too many requests, please try again later."});
  }

});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
