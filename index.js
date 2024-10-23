const express = require('express');
const app = express();
const  jwt = require('jsonwebtoken');

const JWT_SECRET = "haha";
app.use(express.json());

const users = [];

app.post("/signup", function(req, res){
    const username = req.body.username;
    const password = req.body.password;

    users.push({
        username: username,
        password: password
    })
    res.json({
        message: "Signed up!"
    })
});
app.post("/signin", function(req, res){

    const username = req.body.username;
    const password = req.body.password;

    let founduser = null;

    for(i=0; i < users.length; i++){
        if(users[i].username == username && users[i].password == password){
            founduser = users[i];
        }
    }
    if(!founduser){
        res.json({
            message: "couldn't find account"
        })
        return;
    }
    else{
        const token = jwt.sign({
            username
        }, JWT_SECRET);
        res.header("jwt", token);

        res.json({
            token: token,
        })
    }
});

function auth(req, res, next){
    const token = req.headers.token;

    const decodedData = jwt.verify(token, JWT_SECRET);
    if (decodedData.username) {
        req.username = decodedData.username;
        next();
    }
    else{
        res.json({
            message: "not a user",
        })
    }
}

app.get("/me", auth, function(req, res){
    
    const currentUser = req.username;




    for (let i = 0; i < users.length; i++){
        if(users[i].username === currentUser) {
            founduser = users[i]
        }
    }

    res.json({
        user: founduser.username,
        password: founduser.password
    })
})


app.listen(3000);
