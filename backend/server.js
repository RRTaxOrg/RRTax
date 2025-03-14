const express = require("express")
const cors = require("cors")
const port = 3001
const database = require("better-sqlite3");

const app = express()
app.use(cors())
app.use(express.json())

const {
    insertInto,
    getTable,
    getRow,
    updateRow,
    deleteRow
} = require("./sql.js");

const {
    createSession,
    authSession,
    removeSession,
} = require("./authentication/auth.js");

// Gets salt for a user password based off of an email
// Return codes: 0 - salt retrieved successfully (returns salt under "salt" aswell), 1 - email not found, 3 - Info missing
app.get("/salt/", async function(req, res){
    var payload = req.query;

    if (!payload.email) {
        res.send(JSON.stringify({code: "3"}))
    }

    var user = getRow("./databases/main.db", "users", {email: payload.email});

    if (!user) {
        res.send(JSON.stringify({code: "1"}));
    }
    else {
        res.send(JSON.stringify({code: "0", salt: user.salt}))
    }
})

// Authenticates a user based off of email, and password fields
// Return codes: 0 - user logged in successfully (returns token under "token" aswell), 1 - email not found, 2 - incorrect password, 3 - Info missing
app.get("/signin/", async function(req, res){
    var payload = req.query;

    if (!(payload.email && payload.password)) {
        res.send(JSON.stringify({code: "3"}))
    }
    
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
// Return codes: 0 - user created successfully (returns token under "token" aswell), 1 - email already in use, 2 - username already in use, 3 - Info missing
app.get("/signup/", async function(req, res){
    res.set("Content-Type", "application/json");

    var payload = req.query;

    if (!(payload.email && payload.username && payload.password && payload.salt && payload.data)) {
        res.send(JSON.stringify({code: "3"}))
    }
    
    var result = insertInto("./databases/main.db", "users", { email: payload.email, username: payload.username, password: payload.password, salt: payload.salt, data: payload.data});
    if (result.message == "UNIQUE constraint failed: users.email") {
        console.log("Email already in use");
        res.send(JSON.stringify({code: "1"}))
    }
    else if (result.message == "UNIQUE constraint failed: users.username") {
        console.log("Username already in use");
        res.send(JSON.stringify({code: "2"}))
    }
    else {
        console.log("User created successfully");
        var user = getRow("./databases/main.db", "users", {email: payload.email});
        var token = await createSession(user.uid);
        res.send(JSON.stringify({"code": "0", "token": token}))
    }
})

// Log user out based off of token field
// Return codes: 0 success, 3 - Info missing
app.get("/logout/", async function(req, res){
    var payload = req.query;
    
    if (!payload.token) {
        res.send(JSON.stringify({code: "3"}))
    }

    console.log(payload.token);
    await removeSession(payload.token);
    res.send(JSON.stringify({code: "0"}));
})

// Creates a new appointment using token, and time
// Return codes: 0 - appointment created successfully, 3 - Info missing
app.post("/appointment/create", async function(req, res){
    var payload = req.body;
    console.log("Received appointment creation request:", payload);

    if (!payload) {
        console.log("Missing payload");
        return res.status(400).send(JSON.stringify({code: "3", message: "No payload received"}));
    }

    if (!(payload.user_id && payload.time && payload.token)) {
        console.log("Missing appointment data");
        return res.status(400).send(JSON.stringify({code: "3", message: "Missing required appointment data"}));
    }


    const userToken = payload.token;

    var userId = authSession(userToken);

    if (!userId) {
        console.log("Invalid Session");
        return res.status(400).send(JSON.stringify({code: "2", message: "Invalid session"}));
    }

    try {
        // Open database connection
        const db = new database("./databases/main.db");
        
        // Check the existing columns in the appointments table
        const columns = db.prepare("PRAGMA table_info(appointments)").all();
        console.log("Existing columns:", columns.map(col => col.name));
        
        // Check the data types to ensure we're inserting the right types
        columns.forEach(col => {
            console.log(`Column ${col.name}: ${col.type}`);
        });
        
        // Convert user_id to INTEGER type
        userId = parseInt(userId);
        
        if (isNaN(userId)) {
            console.error("Invalid user_id format:", payload.user_id);
            db.close();
            return res.status(400).send(JSON.stringify({code: "3", message: "Invalid user ID format"}));
        }
        
        // Convert appointment_id to INTEGER if needed
        let appointmentId = payload.appId;
        if (columns.find(col => col.name === 'appointment_id')?.type === 'INTEGER') {
            // If appointment_id is INTEGER type, try to parse it (or generate a numeric ID)
            appointmentId = Date.now(); // Simple numeric ID based on timestamp
        }
        
        // Format time based on column type
        let timeValue = payload.time;
        if (columns.find(col => col.name === 'time')?.type === 'TEXT') {
            // If time column is TEXT, convert it to string
            timeValue = String(payload.time);
        }
        
        console.log("Prepared values:", {
            appointment_id: appointmentId,
            user_id: userId,
            time: timeValue,
            file_id: null
        });
        
        // Construct the query based on the actual table structure
        const stmt = db.prepare("INSERT INTO appointments (appointment_id, user_id, time, file_id) VALUES (?, ?, ?, ?)");
        
        // Execute the query with correct data types
        stmt.run(
            appointmentId, // appointment_id
            userId,        // user_id
            timeValue,     // time (as string if column is TEXT)
            null           // file_id (null since we don't have it)
        );
        
        db.close();
        console.log("Appointment created successfully");
        res.send(JSON.stringify({code: "0"}));
    } catch (error) {
        console.error("Error creating appointment:", error);
        res.status(500).send(JSON.stringify({code: "1", error: error.message || "Unknown error"}));
    }
});

// Deletes an appointment by appointment_id and token
// Return codes: 0 - appointment deleted successfully, 1 - appointment not found, 3 - Info missing
app.delete("/appointment/delete", async function(req, res) {
    var payload = req.body;
    console.log("Received appointment deletion request:", payload);

    if (!(payload.user_id && payload.appointment_id)) {
        console.log("Missing user_id or appointment_id");
        return res.status(400).send(JSON.stringify({code: "3", message: "Missing user_id or appointment_id"}));
    }

    try {
        const db = new database("./databases/main.db");

        // Convert user_id and appointment_id to INTEGER to avoid datatype mismatch
        const userIdInt = parseInt(payload.user_id);
        const appointmentIdInt = parseInt(payload.appointment_id);

        if (isNaN(userIdInt) || isNaN(appointmentIdInt)) {
            console.error("Invalid user_id or appointment_id format:", payload);
            db.close();
            return res.status(400).send(JSON.stringify({code: "3", message: "Invalid user_id or appointment_id format"}));
        }

        // Check if the appointment exists for the user
        const appointment = db.prepare("SELECT * FROM appointments WHERE user_id = ? AND appointment_id = ?").get(userIdInt, appointmentIdInt);

        if (!appointment) {
            console.log("Appointment not found for user_id:", userIdInt, "appointment_id:", appointmentIdInt);
            db.close();
            return res.status(404).send(JSON.stringify({code: "1", message: "Appointment not found"}));
        }

        // Delete the appointment
        db.prepare("DELETE FROM appointments WHERE user_id = ? AND appointment_id = ?").run(userIdInt, appointmentIdInt);

        db.close();
        console.log("Appointment deleted successfully for user_id:", userIdInt, "appointment_id:", appointmentIdInt);
        res.send(JSON.stringify({code: "0", message: "Appointment deleted successfully"}));
    } catch (error) {
        console.error("Error deleting appointment:", error);
        res.status(500).send(JSON.stringify({code: "1", error: error.message || "Unknown error"}));
    }
});

// Gets all appointments for a user by user_id
// Return codes: 0 - appointments retrieved successfully, 2 - Invalid Session, 3 - Info missing
app.get("/appointments/", async function(req, res){
    var payload = req.query;
    const userToken = payload.token;
    
    console.log("Fetching appointments for user:", userToken);

    if (!userToken) {
        console.log("Missing token");
        return res.status(400).send(JSON.stringify({code: "3", message: "Missing user token"}));
    }

    var userId = authSession(userToken);

    if (!userId) {
        console.log("Invalid Session");
        return res.status(400).send(JSON.stringify({code: "2", message: "Invalid session"}));
    }

    try {
        const db = new database("./databases/main.db");
        
        // Convert user_id to INTEGER to avoid datatype mismatch
        const userIdInt = parseInt(userId);
        
        if (isNaN(userIdInt)) {
            console.error("Invalid user ID format:", userId);
            db.close();
            return res.status(400).send(JSON.stringify({code: "3", message: "Invalid user ID format"}));
        }
        
        // Get appointments for this user, using the correct column structure
        const appointments = db.prepare("SELECT * FROM appointments WHERE user_id = ?").all(userIdInt);
        
        db.close();
        console.log(`Found ${appointments.length} appointments for user ID ${userId}`);
        res.send(JSON.stringify({code: "0", appointments: appointments}));
    } catch (error) {
        console.error("Error fetching appointments:", error);
        res.status(500).send(JSON.stringify({code: "1", error: error.message || "Unknown error"}));
    }
});

// Gets user data by email
// Return codes: 0 - user data retrieved successfully, 1 - user not found, 3 - Info missing
app.get("/getUserByEmail", async function(req, res){
    var payload = req.query;
    console.log("Received user data request for email:", payload.email);

    if (!payload.email) {
        console.log("Missing email for user data fetch");
        return res.send(JSON.stringify({code: "3", message: "Missing email"}));
    }

    try {
        // Get user with rowid as uid
        const db = new database("./databases/main.db");
        const user = db.prepare("SELECT rowid as uid, * FROM users WHERE email = ?").get(payload.email);
        db.close();
        
        if (user) {
            console.log("User found with UID:", user.uid);
            res.send(JSON.stringify({code: "0", user: user}));
        } else {
            console.log("User not found for email:", payload.email);
            res.send(JSON.stringify({code: "1", message: "User not found"}));
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
        res.send(JSON.stringify({code: "1", error: error.message || "Unknown error"}));
    }
});

app.post('/user/update', async (req, res) => {
  const { user_id, ...userData } = req.body;

  try {
    const db = new database('./databases/main.db');

    // Convert userData to JSON string
    const userDataJson = JSON.stringify(userData);

    // Update the user's data in the database
    db.prepare('UPDATE users SET data = ? WHERE uid = ?').run(userDataJson, user_id);

    db.close();
    res.send(JSON.stringify({ code: '0', message: 'User data updated successfully' }));
  } catch (error) {
    console.error('Error updating user data:', error);
    res.status(500).send(JSON.stringify({ code: '1', message: 'Error updating user data' }));
  }
});

if (require.main === module) {
    app.listen(port, function(){
        console.log("Listening to port " + port + "!");
    });
}

module.exports = app;

