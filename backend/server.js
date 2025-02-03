const express = require("express")
const cors = require("cors")
const port = 3000

const app = express()
app.use(cors())
app.use(express.json())

const {
    insertInto,
    getTable,
    getRow,
    updateRow,
    deleteRow,
} = require("./sql.js");

app.get("/signin/", function(req, res){
    var payload = req.query;
    
})

// Creates a new user based on email, username, password, and any other additional information
// Return codes: 0 - user created successfully (returns token under "token" aswell), 1 - user already exists
app.get("/signup/", function(req, res){
    res.set("Content-Type", "application/json");

    var payload = req.query;
    
    var user = getRow("./databases/main.db", "users", {"email": payload.email});

    if (!user) {
        
    }
    else {
        res.send(JSON.stringify({"code": "1"}))
    }
})

app.get("/logout/", function(req, res){
    var payload = req.query;
    
})

app.listen(port, function(){
    console.log("Listening to port " + port + "!");
})

