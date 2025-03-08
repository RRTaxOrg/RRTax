const database = require("better-sqlite3");

module.exports = {
    insertInto,
    getTable,
    getRow,
    updateRow,
    deleteRow,
    createAppointment,
    getAppointments,
    getUserByEmail,
};

// Gets specified table in DB
// Example: getTable("./databases/main.db")
// Returns: JSON list representing specified table OR null if table not found
function getTable(DBPath, table) {
    var tableData;
    try {
        const db = new database(DBPath);
        tableData = db.prepare(`SELECT * FROM ${table}`).all();
        db.close();
    } catch (error) {
        console.log(error.message);
    }
    return tableData;
}

// Creates new row with all the attributes of data into the table in specified DB
// Example: insertInto("./databases/main.db", "users", { email: "test@test.com", username: "JohnDoe", password: "ILoveDogs123", data:"{}" })
// Returns: 0 if successful OR error message if not successful
function insertInto(DBPath, table, data) {
    // Get columns and values to insert into columns
    var keys = Object.keys(data);
    var values = Object.values(data);

    // Generate column and values strings for SQL query format
    var columns = "(";
    var insertData = "(";
    for (var i = 0; i < keys.length; i++) {
        columns += keys[i];
        insertData += "'" + values[i] + "'";
        if (i != keys.length - 1) {
            columns += ", ";
            insertData += ", ";
        }
    }
    columns += ")";
    insertData += ")";

    // Generate and run SQL on specified table and database
    var sql = `INSERT INTO ${table} ${columns} VALUES ${insertData}`;
    try {
        var db = new database(DBPath);
        db.prepare(sql).run();
        db.close();
    } catch (error) {
        return error;
    }
    console.log("Query successfully added!");
    return 0;
}

// Gets row with specified 'selectData' in specified table in specified DB
// Example: getRow("./databases/main.db", "users", { username: "JohnDoe" })
// Returns: JSON object representing row OR null if row not found
function getRow(DBPath, table, selectData) {
    // Get columns and values to insert into columns
    var keys = Object.keys(selectData);
    var values = Object.values(selectData);

    // Construct the WHERE clause for the SQL query
    var selectInfo = "";
    for (var i = 0; i < keys.length; i++) {
        selectInfo += keys[i] + "='" + values[i] + "'";
        if (i != keys.length - 1) {
            selectInfo += " AND ";
        }
    }

    // Query the databse using the specified parameters
    var row;
    try {
        var db = new database(DBPath);
        row = db.prepare(`SELECT * FROM ${table} WHERE ${selectInfo}`).get();
        db.close();
    } catch (error) {
        return error;
    }
    
    return row;
}

// Updates row specificed by 'selectData' with data in 'updateData' in specified table in specified DB
// Example: updateRow("./databases/main.db", "users", { username: "JohnDoe" }, { email: "johndoeupdated@gmail.com" });
// Returns: 0 if successful OR error message if not successful
function updateRow(DBPath, table, selectData, updateData) {
    // Generate WHERE query to specify which row to modify using 'selectData'
    var selectKeys = Object.keys(selectData);
    var selectValues = Object.values(selectData);
    var selectInfo = "";
    for (var i = 0; i < selectKeys.length; i++) {
        selectInfo += selectKeys[i] + "=" + selectValues[i];
        if (i != selectKeys.length - 1) {
            selectInfo += " AND ";
        }
    }

    // Generate SET query to specify what data to replace and what data to replace it with
    const updateKeys = Object.keys(updateData);
    const updateValues = Object.values(updateData);
    var updateInfo = "";
    for (var i = 0; i < updateKeys.length; i++) {
        updateInfo += updateKeys[i] + "=" + updateValues[i];
        if (i != updateKeys.length - 1) {
            updateInfo += " AND ";
        }
    }

    // Generate full SQL query and run it on the database
    var sql = `UPDATE ${table} SET ${updateInfo} WHERE ${selectInfo}`;
    try {
        console.log(sql);
        var db = new database(DBPath);
        db.prepare(sql).run();
        db.close();
    } catch (error) {
        return error;
    }
    return 0;
}

// Deletes row specified by 'selectData' in specified table in specified DB
// Example: deleteRow("./databases/main.db", "users", { username: "JohnDoe" })
// Returns: 0 if successful OR error message if not successful
function deleteRow(DBPath, table, selectData) {
    // Generate WHERE query to specify which row to modify using 'selectData'
    var keys = Object.keys(selectData);
    var values = Object.values(selectData);
    var columns = "(";
    for (var i = 0; i < keys.length; i++) {
        columns += keys[i] + "=" + values[i];
        if (i != keys.length - 1) {
            columns += " AND ";
        }
    }
    columns += ")";

    // Runs DELETE query on database with specified parameters
    var sql = `DELETE FROM ${table} WHERE ${columns}`;
    try {
        var db = new database(DBPath);
        db.prepare(sql).run();
        db.close();
    } catch (error) {
        return error;
    }

    return 0;
}

// Creates a new appointment linked to a user by user_id
// Example: createAppointment("./databases/main.db", { user_id: 1, time: 1633024800, appId: "uniqueAppId123" })
// Returns: 0 if successful OR error message if not successful
function createAppointment(DBPath, data) {
    console.log("Creating appointment in DB:", data);
    
    try {
        // Make sure we have a user_id (either directly or converted from uid)
        const userId = data.user_id || data.uid;
        
        if (!userId) {
            console.error("Missing user_id in data");
            return { message: "Missing user_id" };
        }
        
        if (!data.time) {
            console.error("Missing time in data");
            return { message: "Missing time" };
        }
        
        if (!data.appId) {
            console.error("Missing appId in data");
            return { message: "Missing appId" };
        }
        
        const db = new database(DBPath);
        
        // Check if appointments table exists and get its structure
        const tables = db.prepare("SELECT sql FROM sqlite_master WHERE type='table' AND name='appointments'").all();
        
        console.log("Table structure:", tables);
        
        // Create or check the table structure
        if (tables.length === 0) {
            console.log("Creating appointments table with user_id column");
            db.prepare(`CREATE TABLE appointments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                time INTEGER NOT NULL,
                appId TEXT NOT NULL UNIQUE
            )`).run();
        }
        
        // Insert the appointment using the correct column name
        var sql = `INSERT INTO appointments (user_id, time, appId) VALUES (?, ?, ?)`;
        db.prepare(sql).run(userId, data.time, data.appId);
        db.close();
        console.log("Appointment successfully created!");
        return 0;
    } catch (error) {
        console.error("Error creating appointment:", error);
        return error;
    }
}

// Gets all appointments for a user by user_id
// Example: getAppointments("./databases/main.db", 1)
// Returns: JSON list representing the user's appointments OR empty array if no appointments found
function getAppointments(DBPath, userId) {
    console.log("Fetching appointments for user_id:", userId);
    
    if (!userId) {
        console.error("Missing user_id parameter");
        return [];
    }
    
    try {
        const db = new database(DBPath);
        
        // Check if appointments table exists
        const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='appointments'").all();
        
        if (tables.length === 0) {
            console.log("Appointments table doesn't exist, creating it");
            db.prepare(`CREATE TABLE appointments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                time INTEGER NOT NULL,
                appId TEXT NOT NULL UNIQUE
            )`).run();
            db.close();
            return []; // Return empty array since the table was just created
        }
        
        // Query for the column name in appointments table
        const tableInfo = db.prepare("PRAGMA table_info(appointments)").all();
        console.log("Appointments table structure:", tableInfo);
        
        // Check if the user_id column exists
        const userIdColumn = tableInfo.find(col => col.name === 'user_id') ? 'user_id' : 
                             tableInfo.find(col => col.name === 'uid') ? 'uid' : null;
        
        if (!userIdColumn) {
            console.error("Neither user_id nor uid column found in appointments table");
            db.close();
            return [];
        }
        
        console.log(`Using column ${userIdColumn} to fetch appointments`);
        const appointments = db.prepare(`SELECT * FROM appointments WHERE ${userIdColumn} = ?`).all(userId);
        db.close();
        console.log(`Found ${appointments.length} appointments for user ID ${userId}`);
        return appointments;
    } catch (error) {
        console.error("Error fetching appointments:", error);
        return [];
    }
}

// Get user by email, using rowid as uid
// Example: getUserByEmail("./databases/main.db", "test@example.com")
// Returns: User object with uid added OR null if not found
function getUserByEmail(DBPath, email) {
    console.log("Getting user by email:", email);
    
    if (!email) {
        console.error("Missing email parameter");
        return null;
    }
    
    try {
        const db = new database(DBPath);
        
        // Get user data and include rowid as uid
        const user = db.prepare(`SELECT rowid as uid, * FROM users WHERE email = ?`).get(email);
        
        db.close();
        
        if (user) {
            console.log(`Found user with ID ${user.uid} for email ${email}`);
        } else {
            console.log(`No user found for email ${email}`);
        }
        
        return user;
    } catch (error) {
        console.error("Error getting user by email:", error);
        return null;
    }
}