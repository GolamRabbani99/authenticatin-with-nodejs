
//secret file configaration
require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const encrypt = require('mongoose-encryption');
const ejs =require('ejs')
const app = express()
const mongoose = require('mongoose');
mongoose.connect("mongodb://localhost:27017/userDB", {
    useNewUrlParser: true, useUnifiedTopology: true
})
    .then(() =>
        console.log("successfull"))
    .then((err) =>
        console.log(err)
    )


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));



app.get("/", (req, res) => {
    res.render("home")
})

app.get("/register", (req, res) => {
    res.render("register")
})


app.get("/login", (req, res) => {
    res.render("login")
})



//creating schema for users

const usersSchema = new mongoose.Schema({
    Email: String,
    Password:String
})
const secret = process.env.SECRET
usersSchema.plugin(encrypt, { secret: secret, encryptedFields: ['Password']});
const User = mongoose.model('User',usersSchema)


app.post("/register", (req, res) => {
    
    const newUser = new User({
        Email: req.body.username,
        Password: req.body.password
    })

    newUser.save((err) => {
        if (err) {
            console.log("not found")
        } else {
            res.render("secrets")
        }
    })
});


app.post("/login", (req, res) => {
    const userName = req.body.username
    const password = req.body.password
    User.findOne({ Email: userName }, (err, foundMatch) => {
        if (err) {
            console.log("not match with username and passwor")
        } else {
            console.log(foundMatch)
            if (foundMatch) {
                if (foundMatch.Email === userName && foundMatch.Password === password) {
                    res.render("secrets")
                }
            }
        }
    })
});
const port = 3000
app.listen(port, (req, res) => {
    console.log("this server is running on port 3000")
})