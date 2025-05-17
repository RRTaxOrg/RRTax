const express = require("express")
const cors = require("cors")
const port = 3001
const database = require("better-sqlite3");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

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

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save files in the "uploads" directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Unique filename
  },
});
const upload = multer({ storage, limits: { fileSize: 10000000 } }); // 10MB limit

// Create uploads directory if it doesn't exist
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// Create files table if it doesn't exist
const db = new database("./databases/main.db");
db.prepare(`
  CREATE TABLE IF NOT EXISTS files (
    file_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    filetype TEXT NOT NULL,
    name TEXT NOT NULL,
    path TEXT NOT NULL,
    time TEXT NOT NULL
  )
`).run();
db.close();

// Gets salt for a user password based off of an email
// Return codes: 0 - salt retrieved successfully (returns salt under "salt" aswell), 1 - email not found, 3 - Info missing
app.get("/salt/", async function(req, res){
    var payload = req.query;

    if (!payload.email) {
        res.send(JSON.stringify({code: "3"}))
    }

    var user = getRow("./databases/main.db", "users", {email: payload.email})[0];

    if (!user) {
        res.send(JSON.stringify({code: "1"}));
    }
    else {
        res.send(JSON.stringify({code: "0", salt: user.salt}))
    }
})

// Authenticates a user based off of email, and password fields
// Return codes: 0 - user logged in successfully (returns token under "token" aswell), 1 - email not found, 2 - incorrect password, 3 - Info missing
/* app.get("/signin/", async function(req, res){
    var payload = req.query;

    if (!(payload.email && payload.password)) {
        res.send(JSON.stringify({code: "3"}))
    }
    
    var user = getRow("./databases/main.db", "users", {email: payload.email})[0];

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
}) */

// Creates a new user based on email, username, password, salt, and data fields
// Return codes: 0 - user created successfully (returns token under "token" aswell), 1 - email already in use, 2 - username already in use, 3 - Info missing
/* app.get("/signup/", async function(req, res){
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
        var user = getRow("./databases/main.db", "users", {email: payload.email})[0];
        var token = await createSession(user.uid);
        res.send(JSON.stringify({"code": "0", "token": token}))
    }
}) */

// Log user out based off of token field
// Return codes: 0 success, 3 - Info missing
/* app.get("/logout/", async function(req, res){
    res.set("Content-Type", "application/json");
    var payload = req.query;
    
    if (!payload.token) {
        res.send(JSON.stringify({code: "3"}))
    }

    console.log(payload.token);
    await removeSession(payload.token);
    res.send(JSON.stringify({code: "0"}));
}) */

// Get user info based off of token field
// Return codes: 0 success, 1 - Failed to Fetch User, 2 - Invalid Session, 3 - Info missing
/* app.get("/user/", async function(req, res) {
    res.set("Content-Type", "application/json");
    var payload = req.query;
    
    if (!payload.token) {
        res.send(JSON.stringify({code: "3"}));
    }
    else {
      console.log(payload);
      var userId = await authSession(payload.token);

      if (!userId) {
          res.send(JSON.stringify({code: "2"}));
      }
      else {
        var user = await getRow("./databases/main.db", "users", {uid: userId})[0];
        if (!user) {
            console.log("Failed to fetch user");
            res.send(JSON.stringify({code: "1"}));
        }
        else {
          res.send(JSON.stringify({code: "0", user: user})); 
        }
        
      }
       
    }

    
}) */

// Upload file
/* app.post("/api/files/upload", upload.single("file"), async (req, res) => {
  console.log("Received upload request:", req.body, req.file);
  const { category } = req.body;
  const file = req.file;
  
  // Get token from request
  const token = req.body.token;

  if (!token || !category || !file) {
    console.log("Missing fields:", { token, category, file });
    return res.status(400).json({ code: "3", message: "Missing required fields" });
  }

  try {
    // Get user ID from token
    const userId = await authSession(token);
    
    if (!userId) {
      console.error("Invalid session token");
      return res.status(401).json({ code: "2", message: "Invalid session" });
    }

    // Verify user exists before uploading file
    const userDb = new database("./databases/main.db");
    const user = userDb.prepare("SELECT uid FROM users WHERE uid = ?").get(userId);
    userDb.close();

    if (!user) {
      console.error("User not found with ID:", userId);
      return res.status(404).json({ code: "1", message: "User not found" });
    }

    const db = new database("./databases/main.db");
    const stmt = db.prepare(`
      INSERT INTO files (user_id, filetype, name, path, time)
      VALUES (?, ?, ?, ?, ?)
    `);
    
    stmt.run(
      userId,                        // user_id from session
      category,                      // filetype (using the category parameter)
      file.originalname,             // name (text, original file name)
      file.path,                     // path (text, path to the file in uploads/)
      Math.floor(Date.now() / 1000)  // time (integer, Unix timestamp)
    );
    db.close();
    console.log("File uploaded and saved to database for user:", userId);
    res.json({ code: "0", message: "File uploaded successfully" });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ code: "1", message: error.message || "Server error" });
  }
}); */

// Get user's files
/* app.get("/api/files", async (req, res) => {
  const payload = req.query;
  const token = payload.token;
  console.log("GET FILES");
  console.log(payload);
  if (!token) {
    return res.status(400).json({ code: "3", message: "Missing token" });
  }

  try {
    // Get user ID from token
    const userId = await authSession(token);
    
    if (!userId) {
      console.error("Invalid session token");
      return res.status(401).json({ code: "2", message: "Invalid session" });
    }

    const db = new database("./databases/main.db");
    
    // Check files table schema
    console.log("Checking files table schema:");
    const tableInfo = db.prepare("PRAGMA table_info(files)").all();
    console.log(tableInfo);

    // Get all files for the user and include rowid
    const query = `
      SELECT 
        rowid,
        file_id,
        user_id,
        filetype,
        name,
        path,
        time
      FROM files 
      WHERE user_id = ?
    `;
    
    const files = db.prepare(query).all(userId);
    
    // Ensure every file has a valid id field to send back
    const processedFiles = files.map(file => {
      file.id = file.file_id || file.rowid;
      console.log(`Processed file: ${file.name}, ID: ${file.id}, rowid: ${file.rowid}, file_id: ${file.file_id}`);
      return file;
    });
    
    db.close();
    console.log("Files found:", processedFiles);

    // before we did not porccess the files now we do 
    const organizedFiles = {
      t4_t4a: processedFiles.filter((f) => f.filetype === "t4_t4a"),
      education: processedFiles.filter((f) => f.filetype === "education"),
      other: processedFiles.filter((f) => f.filetype === "other"),
    };

    res.json({ code: "0", files: organizedFiles });
  } catch (error) {
    console.error("Error fetching files:", error);
    res.status(500).json({ code: "1", error: error.message });
  }
}); */

// Download file
app.get("/api/files/download", async (req, res) => {
  const { file_id, token } = req.query;

  if (!file_id || !token) {
    console.error(`Missing required parameters: file_id=${file_id}, token=${token}`);
    return res.status(400).json({ code: "3", message: "Missing required fields" });
  }

  try {
    // Get user ID from token
    const userId = await authSession(token);
    
    if (!userId) {
      console.error("Invalid session token");
      return res.status(401).json({ code: "2", message: "Invalid session" });
    }

    console.log(`Attempting to download file_id=${file_id} for user_id=${userId}`);
    
    const db = new database("./databases/main.db");
    
    // Try to get the file by file_id (or rowid if that fails)
    let file = db.prepare("SELECT * FROM files WHERE file_id = ? AND user_id = ?").get(
      parseInt(file_id),
      userId
    );
    
    // If not found by file_id, try by rowid
    if (!file) {
      file = db.prepare("SELECT * FROM files WHERE rowid = ? AND user_id = ?").get(
        parseInt(file_id),
        userId
      );
    }
    
    db.close();

    if (!file) {
      console.log(`No file found with id=${file_id} for user_id=${userId}`);
      return res.status(404).json({ code: "1", message: "File not found" });
    }

    console.log("Found file:", file);

    // Check if file exists in filesystem
    if (!fs.existsSync(file.path)) {
      console.error(`File not found on server: ${file.path}`);
      return res.status(404).json({ code: "1", message: "File not found on server" });
    }

    res.download(file.path, file.name);
  } catch (error) {
    console.error("Error downloading file:", error);
    res.status(500).json({ code: "1", error: error.message });
  }
});

// Delete file
app.delete("/api/files/delete", async (req, res) => {
  const { file_id, token } = req.body;

  if (!file_id || !token) {
    return res.status(400).json({ code: "3", message: "Missing required fields" });
  }

  try {
    // Get user ID from token
    const userId = await authSession(token);
    
    if (!userId) {
      console.error("Invalid session token");
      return res.status(401).json({ code: "2", message: "Invalid session" });
    }

    const db = new database("./databases/main.db");
    
    // Try to get the file by file_id first
    let file = db.prepare("SELECT * FROM files WHERE file_id = ? AND user_id = ?").get(
      parseInt(file_id),
      userId
    );
    
    // If not found by file_id, try by rowid
    if (!file) {
      file = db.prepare("SELECT * FROM files WHERE rowid = ? AND user_id = ?").get(
        parseInt(file_id),
        userId
      );
    }

    if (!file) {
      db.close();
      return res.status(404).json({ code: "1", message: "File not found" });
    }

    console.log("Found file:", file);

    // Delete file from filesystem
    fs.unlinkSync(file.path);

    // Delete file record from database, using both file_id and rowid to ensure it works
    db.prepare("DELETE FROM files WHERE file_id = ? AND user_id = ?").run(
      parseInt(file_id),
      userId
    );
    
    db.prepare("DELETE FROM files WHERE rowid = ? AND user_id = ?").run(
      parseInt(file_id),
      userId
    );
    
    db.close();

    res.json({ code: "0", message: "File deleted successfully" });
  } catch (error) {
    console.error("Error deleting file:", error);
    res.status(500).json({ code: "1", error: error.message });
  }
});

// Creates a new appointment using token, and time
// Return codes: 0 - appointment created successfully, 1 - error creating appointment, 2 - Invalid Session, 3 - Info missing, 4 - Invalid User ID Format
app.post("/appointment/create", async function(req, res){
    var payload = req.query;
    console.log("Received appointment creation request:", payload);

    if (!(payload.time && payload.token)) {
        console.log("Missing appointment data");
        return res.status(400).send(JSON.stringify({code: "3", message: "Missing required appointment data"}));
    }

    var userId = await authSession(payload.token);

    if (!userId) {
        console.log("Invalid Session");
        return res.status(400).send(JSON.stringify({code: "2", message: "Invalid session"}));
    }       
        
    // Convert user_id to INTEGER type
    userId = parseInt(userId);
    
    if (isNaN(userId)) {
        console.error("Invalid user_id format:", payload.user_id);
        return res.status(400).send(JSON.stringify({code: "4", message: "Invalid user ID format"}));
    }
    
    // Format time based on column type
    let timeValue = payload.time;

    var result = await insertInto("./databases/main.db", "appointments", {user_id: userId, time: timeValue});
    if (result == 0) {
        console.log("Appointment created successfully");
        res.send(JSON.stringify({code: "0"}));
    }
    else {
        console.log(result);
        res.send(JSON.stringify({code: "1", message: result}));
    }
});

// Deletes an appointment by appointment_id and token
// Return codes: 0 - appointment deleted successfully, 1 - appointment not found, 2 - Invalid token, 3 - Info missing
app.post("/appointment/delete", async function(req, res) {
    var payload = req.query;
    console.log("Received appointment deletion request:", payload);

    if (!(payload.token && payload.appointment_id)) {
        console.log("Missing token or appointment_id");
        return res.status(400).send(JSON.stringify({code: "3", message: "Missing token or appointment_id"}));
    }

    // Convert user_id and appointment_id to INTEGER to avoid datatype mismatch
    const userIdInt = await authSession(payload.token);
    const appointmentIdInt = parseInt(payload.appointment_id);

    if (!userIdInt || !appointmentIdInt) {
        console.log("Invalid token or appointment");
        return res.status(400).send(JSON.stringify({code: "2", message: "Invalid token or appointment"}));
    }

    var result = await deleteRow("./databases/main.db", "appointments", {appointment_id: appointmentIdInt, user_id: userIdInt})
    res.send(JSON.stringify({code: "0", message: "Appointment deleted successfully"}));

});

// Gets all appointments for a user by token
app.get("/appointments/", async function(req, res){
    var payload = req.query;
    const userToken = payload.token;
    
    console.log("Fetching appointments for user:", userToken);

    if (!userToken) {
        console.log("Missing token");
        return res.status(400).send(JSON.stringify({code: "3", message: "Missing user token"}));
    }

    var userId = await authSession(userToken);

    if (!userId) {
        console.log("Invalid Session");
        return res.status(400).send(JSON.stringify({code: "2", message: "Invalid session"}));
    }
    
    // Get appointments for this user, using the correct column structure
    var appointments = await getRow("./databases/main.db", "appointments", {user_id: userId});
    console.log(appointments);
    if (appointments == null) {
      appointments = [];
    }

    console.log(`Found ${appointments.length} appointments for user ID ${userId}`);
    res.send(JSON.stringify({code: "0", appointments: appointments}));
});

// Update user data
app.post("/user/update", async (req, res) => {
  const { token, ...userData } = req.body;

  if (!token) {
    return res.status(400).send(JSON.stringify({ code: "3", message: "Missing token" }));
  }

  try {
    const userId = await authSession(token);
    
    if (!userId) {
      return res.status(401).send(JSON.stringify({ code: "2", message: "Invalid session" }));
    }

    // Convert userData to JSON string
    const userDataJson = JSON.stringify(userData);

    // Update the user's data in the database
    const db = new database("./databases/main.db");
    db.prepare("UPDATE users SET data = ? WHERE uid = ?").run(userDataJson, userId);
    db.close();

    res.send(JSON.stringify({ code: "0", message: "User data updated successfully" }));
  } catch (error) {
    console.error("Error updating user data:", error);
    res.status(500).send(JSON.stringify({ code: "1", message: "Error updating user data" }));
  }
});

app.listen(port, function(){
    console.log("Listening to port " + port + "!");
});


