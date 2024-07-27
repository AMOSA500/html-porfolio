import express from "express";
import bodyParser from 'body-parser';
import dateFormat from "dateformat";
import formatDistanceToNowStrict from "date-fns/formatDistanceToNowStrict";
import CryptoJS from "crypto-js";

// Encryption and Decryption key
const key = CryptoJS.enc.Utf8.parse("123456789");

// Express app
const app = express();
const port = 3000;

// Array and variables
var posts = [];
var counter = 0;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Encryption and Decryption functions
function encryptId(data) {
  return CryptoJS.AES.encrypt(data.toString(), key).toString();
}

function decryptId(data) {
    return CryptoJS.AES.decrypt(data, key).toString(CryptoJS.enc.Utf8);
}

// Helper function to format date
function formatDateDifference(uploadedDate) {
    const now = new Date();
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
        // encrypt id
        let encryptedId = encryptId(post.id);
        let str = truncateWords(post.content);
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
        date: new Date(), //dateFormat(new Date(), "mmmm d, yyyy"),
    });
    res.redirect("/create?success=true");
});

// Edit route
app.get("/edit", (req,res)=>{
    const id = decryptId(req.query.id);
    const post = posts.find(post => post.id == parseInt(id));
    if(!post){
        res.status(404).render("Post not found");
        return;
    }
    res.render("edit.ejs", {post: post});
});


app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
});