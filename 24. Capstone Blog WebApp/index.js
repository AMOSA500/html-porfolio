import express from "express";
import bodyParser from 'body-parser';
import dateFormat from "dateformat";
import formatDistanceToNowStrict from "date-fns/formatDistanceToNowStrict";


const app = express();
const port = 3000;
var posts = [];


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Helper function to format date
function formatDateDifference(uploadedDate) {
    const now = new Date();
    const difference = formatDistanceToNowStrict(new Date(uploadedDate), { addSuffix: true });
    return difference;
}

// Split words
function splitWords(content){
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
        let str = splitWords(post.content);
        return {
            ...post,
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
        formattedContext: splitWords(lastestPost["content"]),
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
        title: req.body.title,
        content: req.body.content,
        image: req.body.image,
        date: new Date(), //dateFormat(new Date(), "mmmm d, yyyy"),
    });
    res.redirect("/create?success=true");
});

// Edit route
app.get("/edit", (req,res)=>{
    res.render("edit.ejs");
});


app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
});