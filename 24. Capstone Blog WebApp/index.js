import express from "express";
import bodyParser from 'body-parser';
import dateFormat from "dateformat";
import formatDistanceToNowStrict from "date-fns/formatDistanceToNowStrict";
import CryptoJS from "crypto-js";

// Encryption and Decryption secretKey
const secretKey = "123456789";

// Express app
const app = express();
const port = 3000;

// Array and variables
var posts = [
    {
        id: 1,
        title: "Ten Hag has confidence in Rashford",
        content: "Rashford scored 30 goals in the 2022-23 season but then backed that up with just eight in all competitions last term, which ultimately cost his spot in Gareth Southgate's England squad for Euro 2024.",    
        image: "https://via.placeholder.com/150",   
        date: new Date()
    }
];
var counter = posts.length; // counter for id

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Encryption and Decryption functions
function encryptId(data) {
  return CryptoJS.AES.encrypt(data.toString(), secretKey).toString();
}

function decryptId(encryptedId) {
    const bytes = CryptoJS.AES.decrypt(encryptedId, secretKey);
    return bytes.toString(CryptoJS.enc.Utf8);
}

// Helper function to format date
function formatDateDifference(uploadedDate) {
    const difference = formatDistanceToNowStrict(new Date(uploadedDate), { addSuffix: true });
    return difference;
}

// Split words
function truncateWords(content){
    let words = content.split(" ");
    if(words.length <= 25){
        return content;
    }else{
        return words.slice(0,25).join(" ")+"...";
    }
}


// Home Route
app.get("/", (req,res)=>{
    // Format the date and content
    const formattedBlogs = posts.map(post => { 
        let encryptedId = encryptId(post.id); // encrypt id
        let str = truncateWords(post.content); // truncate content
        return {
            ...post,
            encryptedId: encryptedId,
            formattedContext: str,
            formattedDate: dateFormat(post.date, "mmmm d, yyyy"),
            diff: formatDateDifference(post.date)
        };
    })
    // Last Post
    const lastestPost = posts[posts.length-1];
    if(posts.length === 0){
        res.render("index.ejs",{posts: [], lastestPost: {}
        });
        return
    }
    const formattedLastestPost = {
        ...lastestPost,
        formattedContext: truncateWords(lastestPost["content"]),
        formattedDate: dateFormat(lastestPost.date, "mmmm d, yyyy"),
        diff: formatDateDifference(lastestPost.date)
    }
    res.render("index.ejs",{posts: formattedBlogs, lastestPost: formattedLastestPost});
});

// Create route
app.get("/create", (req,res)=>{
    let success = req.query.success;
    res.render("create.ejs", {success: success});
});

// Submit route
app.post("/submit", (req,res)=>{
    posts.push({
        id: ++counter,
        title: req.body.title,
        content: req.body.content,
        image: req.body.image,
        date: new Date(), 
    });
    res.redirect("/create?success=true");
});

// Edit route
app.get("/edit", (req,res)=>{  
    const id = decryptId(req.query.id);
    const post = posts.find(post => post.id == parseInt(id));
    if(!post){
        res.send("Post not found");
        return;
    }
    const formattedPost = {
        ...post,
        enId: encryptId(post.id),
    }
    
    res.render("edit.ejs", {post: formattedPost});
});

// update or delete
app.post("/update", (req, res)=>{
    let action = req.body.action;
    let id = decryptId(req.body.id);
    let post = posts.find(post => post.id == parseInt(id));
    if(!post){
        res.send("Post not found");
        return;
    }else{
        if(action === "update"){
            post.title = req.body.title;
            post.content = req.body.content;
            post.image = req.body.image
            res.redirect("/");
        }else if(action === "delete"){
            posts = posts.filter(post => post.id !== parseInt(id));
            res.redirect("/");
        }
    }
});


app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
});