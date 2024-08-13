import express from "express";
import axios from "axios";
import bodyParser from "body-parser"; 

const app = express();
const port = 3000;
const API_URL = "https://secrets-api.appbrewery.com";
const yourBearerToken = "173f24b0-9aa4-4f4f-aa37-3d8c7ec2d49d";
const config = {
  headers: {Authorization: `Bearer ${yourBearerToken}` },
};

app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res) => {
  res.render("index.ejs", { content: "Waiting for data..." });
});

app.post("/get-secret", async (req, res) => {
  const searchId = req.body.id;
  try {
    const result = await axios.get(API_URL + "/secrets/" + searchId, config);
    res.render("index.ejs", { content: JSON.stringify(result.data) });
  } catch (error) {
    res.render("index.ejs", { content: JSON.stringify(error.response.data) });
  }
});

app.post("/post-secret", async (req, res) => {
  const body = {
    secret: req.body.secret,
    score: req.body.score
  }
  try {
    const response = await axios.post(API_URL + "/secrets",body,config);
    res.render("index.ejs", {content: JSON.stringify(response.data)});
  } catch (error) {
    res.render("index.ejs", { content: JSON.stringify(error.response.data) });
  }
});

app.post("/put-secret", async (req, res) => {
 try {
  const searchId = req.body.id;
  const body = {
    secret: req.body.secret,
    score: req.body.score
  };
  const result = await axios.put(API_URL + "/secrets/" + searchId, body, config);
  res.render("index.ejs", {content: JSON.stringify(result.data)});
 } catch (error) {
  res.render("index.ejs", { content: JSON.stringify(error.message) });
 }
});

app.post("/patch-secret", async (req, res) => {
  try {
    const searchId = req.body.id;
    const result = await axios.patch(API_URL + "/secrets/" + searchId, req.body, config);
    res.render("index.ejs", {content: JSON.stringify(result.data)});
   } catch (error) {
    res.render("index.ejs", { content: JSON.stringify(error.message) });
   }
});

app.post("/delete-secret", async (req, res) => {
  const searchId = req.body.id;
  // TODO 5: Use axios to DELETE the item with searchId from the secrets api servers.
  try {
    const searchId = req.body.id;
    const result = await axios.delete(API_URL + "/secrets/" + searchId, config);
    res.render("index.ejs", {content: JSON.stringify(result.data)});
   } catch (error) {
    res.render("index.ejs", { content: JSON.stringify(error.message) });
   }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
