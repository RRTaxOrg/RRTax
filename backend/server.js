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

const {
    createSession,
    authSession,
    removeSession,
} = require("./authentication/auth.js");

// Gets salt for a user password based off of an email
// Return codes: 0 - salt retrieved successfully (returns salt under "salt" aswell), 1 - email not found
app.get("/salt/", async function(req, res){
    var payload = req.body;

    var user = getRow("./databases/main.db", "users", {email: payload.email});

    if (!user) {
        res.send(JSON.stringify({code: "1"}));
    }
    else {
        res.send(JSON.stringify({code: "0", salt: user.salt}))
    }
})

// Authenticates a user based off of email, and password fields
// Return codes: 0 - user logged in successfully (returns token under "token" aswell), 1 - email not found, 2 - incorrect password
app.get("/signin/", async function(req, res){
    var payload = req.body;
    
    var user = getRow("./databases/main.db", "users", {email: payload.email});

    if (!user) {
        res.send(JSON.stringify({code: "1"}));
    }
    else {
        if (user.password == payload.password) {
            var token = await createSession(user.uid);
            res.send(JSON.stringify({code: "0", token: token}));
        }
        else {
            res.send(JSON.stringify({code: "2"}));
        }
    }
})

// Creates a new user based on email, username, password, salt, and data fields
// Return codes: 0 - user created successfully (returns token under "token" aswell), 1 - email already in use, 2 - username already in use
app.get("/signup/", async function(req, res){
    res.set("Content-Type", "application/json");

    var payload = req.body;
    
    var result = insertInto("./databases/main.db", "users", { email: payload.email, username: payload.username, password: payload.password, salt: payload.salt, data: payload.data});
    if (result.message == "UNIQUE constraint failed: users.email") {
        res.send(JSON.stringify({code: "1"}))
    }
    else if (result.message == "UNIQUE constraint failed: users.username") {
        res.send(JSON.stringify({code: "2"}))
    }
    else {
        var user = getRow("./databases/main.db", "users", {email: payload.email});
        var token = await createSession(user.uid);
        res.send(JSON.stringify({"code": "0", "token": token}))
    }
})

// Log user out based off of token field
// Return codes: 0
app.get("/logout/", async function(req, res){
    var payload = req.body;
    console.log(payload.token);
    await removeSession(payload.token);
    res.send(JSON.stringify({code: "0"}));
})

app.listen(port, function(){
    console.log("Listening to port " + port + "!");
})

