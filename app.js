import 'dotenv/config'
import express from 'express';
import bodyParser from "body-parser";
import mongoose from 'mongoose';
import encryption from "mongoose-encryption";

const app = express();
const port = 3000;
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

console.log(process.env.SECRET);

mongoose.connect('mongodb://127.0.0.1:27017/userDB');
const userSchema = new mongoose.Schema({
  email: String,
  password: String
});

userSchema.plugin(encryption, {secret: process.env.SECRET, encryptedFields: ['password']});
const User = mongoose.model("User", userSchema);

 

app.get("/", function (req, res) {
    res.render("home");
});

 
app.get("/login", function (req, res) {
    res.render("login");
});

app.get("/register", function (req, res) {
    res.render("register");
});
 
app.post("/register", async function (req, res) {
    const enteredEmail = req.body.username;
    const enteredPassword = req.body.password;

    try {
    const existingUser = await User.findOne({ email: enteredEmail });

    if (existingUser) {
        console.log("This email has already been registered");
    } else {
        const newUser = new User ({
            email: enteredEmail,
            password: enteredPassword
        });
        newUser.save();
        res.render("secrets");
    }
    }
    catch {
        console.error(error);
        res.status(500).json({ error: "Internal server error." });
    }   
});

app.post("/login", async function (req, res){
    const enteredEmail = req.body.username;
    const enteredPassword = req.body.password;
    
    try {
        const existingUser = await User.findOne({ email: enteredEmail });
    
        if (existingUser.password = enteredPassword) {
            res.render("secrets");
        } else {
            console.log("wrong email or password");
        }
        }
    catch {
        console.error(error);
        res.status(500).json({ error: "Internal server error." });
    }  

});
 
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});