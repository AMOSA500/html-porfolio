const fs = require("fs");

fs.writeFile("example.txt", "This is the second example of Node.js Native Modules", (err) =>{
    if(err) throw err;
    console.log("File is created successfully.");
});

setTimeout(function(){
    fs.readFile("example.txt", "utf8", (err, data) =>{
    if(err) throw err;
    console.log(data);
});
}, 2000);


