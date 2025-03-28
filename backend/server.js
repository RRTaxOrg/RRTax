const express = require("express");
const cors = require("cors");
const port = 3001; // our port do not change this as localhost:3001 is used in the frontend and 300 is used by netxjs
const database = require("better-sqlite3");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(cors());
app.use(express.json());

const {
  insertInto,
  getTable,
  getRow,
  updateRow,
  deleteRow,
  createAppointment,
  getAppointments,
  getUserByEmail,
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
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    filetype TEXT NOT NULL,
    name TEXT NOT NULL,
    path TEXT NOT NULL,
    time INTEGER NOT NULL
  )
`).run();
db.close();

// Upload file
app.post("/api/files/upload", upload.single("file"), async (req, res) => {
  console.log("Received upload request:", req.body, req.file); // Log the incoming request
  const { user_id, category } = req.body;
  const file = req.file;

  if (!user_id || !category || !file) {
    console.log("Missing fields:", { user_id, category, file }); // Log missing fields
    return res.status(400).json({ code: "3", message: "Missing required fields" });
  }

  // Validate that user_id is a proper integer
  // just do this as a check for now there are some other Nan checks as well
  // somtimes the user_id is a string when it comes from the frontend
  const userId = parseInt(user_id);
  if (isNaN(userId) || userId <= 0) {
    console.error("Invalid user_id format:", user_id);
    return res.status(400).json({ code: "3", message: "Invalid user ID format" });
  }

  try {
    // Verify user exists before uploading file, just checks if the user exists via rowid adn user_id
    const userDb = new database("./databases/main.db");
    const user = userDb.prepare("SELECT rowid as uid FROM users WHERE rowid = ?").get(userId);
    userDb.close();
    // non 0 code = err
    if (!user) {
      console.error("User not found with ID:", userId);
      return res.status(404).json({ code: "1", message: "User not found" });
    }

    const db = new database("./databases/main.db");
    const stmt = db.prepare(`
      INSERT INTO files (user_id, filetype, name, path, time)
      VALUES (?, ?, ?, ?, ?)
    `);
    // this stmt was there before but missing user id
    stmt.run(
      userId,                        // user_id (integer) - validated above
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
});

// Get user's files
app.get("/api/files", async (req, res) => {
  console.log("Received files request:", req.query);
  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({ code: "3", message: "Missing user_id" });
  }

  try {
    const db = new database("./databases/main.db");
    
    // First check and log the database schema do this beacuse trying to delete or download was giving a row not found or null fileid
    console.log("Checking files table schema:");
    const tableInfo = db.prepare("PRAGMA table_info(files)").all();
    console.log(tableInfo);

    // Get all files for the user and include rowid
    const query = `
      SELECT 
        rowid,
        id,
        user_id,
        filetype,
        name,
        path,
        time
      FROM files 
      WHERE user_id = ?
    `;
    
    const files = db.prepare(query).all(parseInt(user_id));
    
    // Ensure every file has a valid id field to send back
    const processedFiles = files.map(file => {
      // Use rowid as id if id is not present this works alright 
      if (!file.id && file.rowid) {
        file.id = file.rowid;
      }
      console.log(`Processed file: ${file.name}, ID: ${file.id}, rowid: ${file.rowid}`);
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
});

// Download file
app.get("/api/files/download", async (req, res) => {
  const { file_id, user_id } = req.query;

  if (!file_id || !user_id) {
    // added logs that were missing 
    console.error(`Missing required parameters: file_id=${file_id}, user_id=${user_id}`);
    return res.status(400).json({ code: "3", message: "Missing required fields" });
  }

  try {
    // logs for err handle
    console.log(`Attempting to download file_id=${file_id} for user_id=${user_id}`);
    
    const db = new database("./databases/main.db");
    
    // Log all files for this user to debug can remove later just fro debuging
    const allUserFiles = db.prepare("SELECT rowid, id, name FROM files WHERE user_id = ?").all(parseInt(user_id));
    console.log("All files for user:", allUserFiles);
    
    // First try to get the file by rowid this seems to work the best and we still locate the file by user id so its safe
    const file = db.prepare("SELECT * FROM files WHERE rowid = ? AND user_id = ?").get(
      parseInt(file_id),
      parseInt(user_id)
    );
    
    db.close();

    if (!file) {
      // logs
      console.log(`No file found with rowid=${file_id} for user_id=${user_id}`);
      return res.status(404).json({ code: "1", message: "File not found" });
    }

    // logs
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
  const { file_id, user_id } = req.body;

  if (!file_id || !user_id) {
    return res.status(400).json({ code: "3", message: "Missing required fields" });
  }

  try {
    const db = new database("./databases/main.db");
    
    // Use rowid to query the file before we used id but id dose not exists
    const file = db.prepare("SELECT * FROM files WHERE rowid = ? AND user_id = ?").get(
      parseInt(file_id),
      parseInt(user_id)
    );

    if (!file) {
      db.close();
      return res.status(404).json({ code: "1", message: "File not found" });
    }

    // Delete file from filesystem
    fs.unlinkSync(file.path); // Use path

    // Delete file record from database with correct column name usign row id again for id 
    db.prepare("DELETE FROM files WHERE rowid = ? AND user_id = ?").run(
      parseInt(file_id),
      parseInt(user_id)
    );
    db.close();

    res.json({ code: "0", message: "File deleted successfully" });
  } catch (error) {
    console.error("Error deleting file:", error);
    res.status(500).json({ code: "1", error: error.message });
  }
});

// Gets salt for a user password based off of an email
// Return codes: 0 - salt retrieved successfully (returns salt under "salt" aswell), 1 - email not found, 3 - Info missing
app.get("/salt/", async function (req, res) {
  var payload = req.query;

  if (!payload.email) {
    res.send(JSON.stringify({ code: "3" }));
  }

  var user = getRow("./databases/main.db", "users", { email: payload.email });

  if (!user) {
    res.send(JSON.stringify({ code: "1" }));
  } else {
    res.send(JSON.stringify({ code: "0", salt: user.salt }));
  }
});

// Authenticates a user based off of email, and password fields
// Return codes: 0 - user logged in successfully (returns token under "token" aswell), 1 - email not found, 2 - incorrect password, 3 - Info missing
app.get("/signin/", async function (req, res) {
  var payload = req.query;

  if (!(payload.email && payload.password)) {
    res.send(JSON.stringify({ code: "3" }));
  }

  var user = getRow("./databases/main.db", "users", { email: payload.email });

  if (!user) {
    res.send(JSON.stringify({ code: "1" }));
  } else {
    if (user.password == payload.password) {
      var token = await createSession(user.uid);
      res.send(JSON.stringify({ code: "0", token: token }));
    } else {
      res.send(JSON.stringify({ code: "2" }));
    }
  }
});

// Creates a new user based on email, username, password, salt, and data fields
// Return codes: 0 - user created successfully (returns token under "token" aswell), 1 - email already in use, 2 - username already in use, 3 - Info missing
app.get("/signup/", async function (req, res) {
  res.set("Content-Type", "application/json");

  var payload = req.query;

  if (!(payload.email && payload.username && payload.password && payload.salt && payload.data)) {
    res.send(JSON.stringify({ code: "3" }));
  }

  var result = insertInto("./databases/main.db", "users", {
    email: payload.email,
    username: payload.username,
    password: payload.password,
    salt: payload.salt,
    data: payload.data,
  });
  if (result.message == "UNIQUE constraint failed: users.email") {
    console.log("Email already in use");
    res.send(JSON.stringify({ code: "1" }));
  } else if (result.message == "UNIQUE constraint failed: users.username") {
    console.log("Username already in use");
    res.send(JSON.stringify({ code: "2" }));
  } else {
    console.log("User created successfully");
    var user = getRow("./databases/main.db", "users", { email: payload.email });
    var token = await createSession(user.uid);
    res.send(JSON.stringify({ code: "0", token: token }));
  }
});

// Log user out based off of token field
// Return codes: 0 success, 3 - Info missing
app.get("/logout/", async function (req, res) {
  var payload = req.query;

  if (!payload.token) {
    res.send(JSON.stringify({ code: "3" }));
  }

  console.log(payload.token);
  await removeSession(payload.token);
  res.send(JSON.stringify({ code: "0" }));
});

// Creates a new appointment
// Return codes: 0 - appointment created successfully, 3 - Info missing
app.post("/appointment/create", async function (req, res) {
  var payload = req.body;
  console.log("Received appointment creation request:", payload);

  if (!payload) {
    console.log("Missing payload");
    return res.status(400).send(JSON.stringify({ code: "3", message: "No payload received" }));
  }

  if (!(payload.user_id && payload.time && payload.appId)) {
    console.log("Missing appointment data");
    return res.status(400).send(JSON.stringify({ code: "3", message: "Missing required appointment data" }));
  }

  try {
    // Open database connection
    const db = new database("./databases/main.db");

    // Check the existing columns in the appointments table
    const columns = db.prepare("PRAGMA table_info(appointments)").all();
    console.log("Existing columns:", columns.map((col) => col.name));

    // Check the data types to ensure we're inserting the right types
    columns.forEach((col) => {
      console.log(`Column ${col.name}: ${col.type}`);
    });

    // Convert user_id to INTEGER type
    const userId = parseInt(payload.user_id);

    if (isNaN(userId)) {
      console.error("Invalid user_id format:", payload.user_id);
      db.close();
      return res.status(400).send(JSON.stringify({ code: "3", message: "Invalid user ID format" }));
    }

    // Convert appointment_id to INTEGER if needed
    let appointmentId = payload.appId;
    if (columns.find((col) => col.name === "appointment_id")?.type === "INTEGER") {
      // If appointment_id is INTEGER type, try to parse it (or generate a numeric ID)
      appointmentId = Date.now(); // Simple numeric ID based on timestamp
    }

    // Format time based on column type
    let timeValue = payload.time;
    if (columns.find((col) => col.name === "time")?.type === "TEXT") {
      // If time column is TEXT, convert it to string
      timeValue = String(payload.time);
    }

    console.log("Prepared values:", {
      appointment_id: appointmentId,
      user_id: userId,
      time: timeValue,
      file_id: null,
    });

    // Construct the query based on the actual table structure
    const stmt = db.prepare("INSERT INTO appointments (appointment_id, user_id, time, file_id) VALUES (?, ?, ?, ?)");

    // Execute the query with correct data types
    stmt.run(
      appointmentId, // appointment_id
      userId, // user_id
      timeValue, // time (as string if column is TEXT)
      null // file_id (null since we don't have it)
    );

    db.close();
    console.log("Appointment created successfully");
    res.send(JSON.stringify({ code: "0" }));
  } catch (error) {
    console.error("Error creating appointment:", error);
    res.status(500).send(JSON.stringify({ code: "1", error: error.message || "Unknown error" }));
  }
});

// Deletes an appointment by appointment_id and user_id
// Return codes: 0 - appointment deleted successfully, 1 - appointment not found, 3 - Info missing
app.delete("/appointment/delete", async function (req, res) {
  var payload = req.body;
  console.log("Received appointment deletion request:", payload);

  if (!(payload.user_id && payload.appointment_id)) {
    console.log("Missing user_id or appointment_id");
    return res.status(400).send(JSON.stringify({ code: "3", message: "Missing user_id or appointment_id" }));
  }

  try {
    const db = new database("./databases/main.db");

    // Convert user_id and appointment_id to INTEGER to avoid datatype mismatch
    const userIdInt = parseInt(payload.user_id);
    const appointmentIdInt = parseInt(payload.appointment_id);

    if (isNaN(userIdInt) || isNaN(appointmentIdInt)) {
      console.error("Invalid user_id or appointment_id format:", payload);
      db.close();
      return res.status(400).send(JSON.stringify({ code: "3", message: "Invalid user_id or appointment_id format" }));
    }

    // Check if the appointment exists for the user
    const appointment = db.prepare("SELECT * FROM appointments WHERE user_id = ? AND appointment_id = ?").get(
      userIdInt,
      appointmentIdInt
    );

    if (!appointment) {
      console.log("Appointment not found for user_id:", userIdInt, "appointment_id:", appointmentIdInt);
      db.close();
      return res.status(404).send(JSON.stringify({ code: "1", message: "Appointment not found" }));
    }

    // Delete the appointment
    db.prepare("DELETE FROM appointments WHERE user_id = ? AND appointment_id = ?").run(userIdInt, appointmentIdInt);

    db.close();
    console.log("Appointment deleted successfully for user_id:", userIdInt, "appointment_id:", appointmentIdInt);
    res.send(JSON.stringify({ code: "0", message: "Appointment deleted successfully" }));
  } catch (error) {
    console.error("Error deleting appointment:", error);
    res.status(500).send(JSON.stringify({ code: "1", error: error.message || "Unknown error" }));
  }
});

// Gets all appointments for a user by user_id
// Return codes: 0 - appointments retrieved successfully, 3 - Info missing
app.get("/appointments/", async function (req, res) {
  var payload = req.query;
  const userId = payload.user_id || payload.uid;

  console.log("Fetching appointments for user ID:", userId);

  if (!userId) {
    console.log("Missing user ID");
    return res.status(400).send(JSON.stringify({ code: "3", message: "Missing user ID" }));
  }

  try {
    const db = new database("./databases/main.db");

    // Convert user_id to INTEGER to avoid datatype mismatch
    const userIdInt = parseInt(userId);

    if (isNaN(userIdInt)) {
      console.error("Invalid user ID format:", userId);
      db.close();
      return res.status(400).send(JSON.stringify({ code: "3", message: "Invalid user ID format" }));
    }

    // Get appointments for this user, using the correct column structure
    const appointments = db.prepare("SELECT * FROM appointments WHERE user_id = ?").all(userIdInt);

    db.close();
    console.log(`Found ${appointments.length} appointments for user ID ${userId}`);
    res.send(JSON.stringify({ code: "0", appointments: appointments }));
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).send(JSON.stringify({ code: "1", error: error.message || "Unknown error" }));
  }
});

// Gets user data by email
// Return codes: 0 - user data retrieved successfully, 1 - user not found, 3 - Info missing
app.get("/getUserByEmail", async function (req, res) {
  var payload = req.query;
  console.log("Received user data request for email:", payload.email);

  if (!payload.email) {
    console.log("Missing email for user data fetch");
    return res.send(JSON.stringify({ code: "3", message: "Missing email" }));
  }

  try {
    // Get user with rowid as uid
    const db = new database("./databases/main.db");
    const user = db.prepare("SELECT rowid as uid, * FROM users WHERE email = ?").get(payload.email);
    db.close();

    if (user) {
      console.log("User found with UID:", user.uid);
      res.send(JSON.stringify({ code: "0", user: user }));
    } else {
      console.log("User not found for email:", payload.email);
      res.send(JSON.stringify({ code: "1", message: "User not found" }));
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.send(JSON.stringify({ code: "1", error: error.message || "Unknown error" }));
  }
});

app.post("/user/update", async (req, res) => {
  const { user_id, ...userData } = req.body;

  try {
    const db = new database("./databases/main.db");

    // Convert userData to JSON string
    const userDataJson = JSON.stringify(userData);

    // Update the user's data in the database
    db.prepare("UPDATE users SET data = ? WHERE uid = ?").run(userDataJson, user_id);

    db.close();
    res.send(JSON.stringify({ code: "0", message: "User data updated successfully" }));
  } catch (error) {
    console.error("Error updating user data:", error);
    res.status(500).send(JSON.stringify({ code: "1", message: "Error updating user data" }));
  }
});

app.get("/admin/users", async function (req, res) {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ code: "3", message: "Unauthorized" });
    }

    const userId = await authSession(token);

    if (userId !== 30) {
        return res.status(403).json({ code: "2", message: "Forbidden: Admin access only" });
    }

    try {
        const users = getTable("./databases/main.db", "users");
        return res.json({ code: "0", users });
    } catch (error) {
        console.error("Error fetching users:", error);
        return res.status(500).json({ code: "1", message: "Internal server error" });
    }
});

app.post("/admin/createService", async function (req, res) {
    const token = req.headers.authorization;
    const { userId, serviceName, serviceDetails } = req.body;

    if (!token) {
        return res.status(401).json({ code: "3", message: "Unauthorized" });
    }

    const adminId = await authSession(token);

    if (adminId !== 30) {
        return res.status(403).json({ code: "2", message: "Forbidden: Admin access only" });
    }

    if (!userId || !serviceName || !serviceDetails) {
        return res.status(400).json({ code: "3", message: "Missing required fields" });
    }

    try {
        insertInto("./databases/main.db", "services", {
            user_id: userId,
            service_name: serviceName,
            service_details: serviceDetails,
        });
        return res.json({ code: "0", message: "Service created successfully" });
    } catch (error) {
        console.error("Error creating service:", error);
        return res.status(500).json({ code: "1", message: "Internal server error" });
    }
});

if (require.main === module) {
  app.listen(port, function () {
    console.log("Listening to port " + port + "!");
  });
}

module.exports = app;