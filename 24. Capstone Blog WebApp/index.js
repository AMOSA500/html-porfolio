import express from "express";
import bodyParser from 'body-parser';
import dateFormat from "dateformat";
import formatDistanceToNowStrict from "date-fns/formatDistanceToNowStrict";


const app = express();
const port = 3000;
var posts = [];


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

function formatDateDifference(uploadedDate) {
    const now = new Date();
    const difference = formatDistanceToNowStrict(new Date(uploadedDate), { addSuffix: true });
    return difference;
}

// Home Route
app.get("/", (req,res)=>{
    let str = "";
    if(posts.length != 0){
        const words = posts.content.split(" ");
        if(words.length <= 25){
            str = posts.content;
        }else{
            str = words.slice(0,25).join(" ")+"...";
        }
    }
    const formattedBlogs = posts.map(post => { 
        return {
            ...post,
            formattedContext: str,
            formattedDate: dateFormat(post.date, "mmmm d, yyyy"),
            diff: formatDateDifference(post.date)
        };
    })
    res.render("index.ejs",{posts: formattedBlogs});
});

// Create route
app.get("/create", (req,res)=>{
    let success = req.query.success;
    res.render("create.ejs", {success: success});
});
app.post("/submit", (req,res)=>{
    posts.push({
        title: req.body.title,
        content: req.body.content,
        image: req.body.image,
        date: new Date(), //dateFormat(new Date(), "mmmm d, yyyy"),
    });
    console.log(posts);
    res.redirect("/create?success=true");
});

// Edit route
app.get("/edit", (req,res)=>{
    res.render("edit.ejs");
});


app.listen(port, ()=>{
    console.log(`Server is running on port ${port}`);
});