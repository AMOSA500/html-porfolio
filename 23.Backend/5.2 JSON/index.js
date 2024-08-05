import express from "express";
import bodyParser from "body-parser";
import fs from "fs"


const app = express();
const port = 3000;

//Step 1: Run the solution.js file without looking at the code.
//Step 2: You can go to the recipe.json file to see the full structure of the recipeJSON below.

const recipeJSON = fs.readFileSync("recipe.json");
const recipeObj = JSON.parse(recipeJSON);

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// Data Formatter Function 
function tacoTown(choice){
  let pos;
  switch (choice) {
    case "chicken":
      pos = 0
      break;

    case "beef":
      pos = 1
      break;

    case "fish":
        pos = 2
        break;
  
    default:
      break;
  }
  const data = recipeObj[pos];
  return {
    recipeName: data["name"],
    proteinName:  data["ingredients"]["protein"].name,
    preparation:  data["ingredients"]["protein"].preparation,
    salsaName: data["ingredients"].salsa.name,
    toppings: [data["ingredients"].toppings]

  }
}
console.log(tacoTown("fish").recipeName);
app.get("/", (req, res) => {
  res.render("index.ejs");
});

app.post("/recipe", (req, res) => {
  let choice = req.body.choice;
  const recipeData = tacoTown(choice);
  res.render("index.ejs", {recipeData: recipeData});

});

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
