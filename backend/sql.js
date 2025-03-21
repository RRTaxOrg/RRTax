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
    insertFile,
    getFileById,
    deleteFileById,
    getFilesByUserId,
};

// Gets specified table in DB
// Example: getTable("./databases/main.db", "table_name")
// Returns: JSON list representing specified table OR null if table not found
function getTable(DBPath, table) {
    try {
        const db = new database(DBPath);
        const tableData = db.prepare(`SELECT * FROM ${table}`).all();
        db.close();
        return tableData;
    } catch (error) {
        console.error(`Error fetching table ${table}:`, error.message);
        return null;
    }
}

// Creates new row with all the attributes of data into the table in specified DB
// Example: insertInto("./databases/main.db", "users", { email: "test@test.com", username: "JohnDoe", password: "ILoveDogs123", data:"{}" })
// Returns: 0 if successful OR error object if not successful
function insertInto(DBPath, table, data) {
    try {
        const keys = Object.keys(data);
        const values = Object.values(data);

        const columns = keys.join(", ");
        const placeholders = keys.map(() => "?").join(", ");

        const sql = `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`;
        const db = new database(DBPath);
        db.prepare(sql).run(...values);
        db.close();
        console.log(`Row inserted into ${table} successfully!`);
        return 0;
    } catch (error) {
        console.error(`Error inserting into ${table}:`, error.message);
        return error;
    }
}

// Gets row with specified 'selectData' in specified table in specified DB
// Example: getRow("./databases/main.db", "users", { username: "JohnDoe" })
// Returns: JSON object representing row OR null if row not found
function getRow(DBPath, table, selectData) {
    try {
        const keys = Object.keys(selectData);
        const values = Object.values(selectData);

        const whereClause = keys.map(key => `${key} = ?`).join(" AND ");
        const sql = `SELECT * FROM ${table} WHERE ${whereClause}`;

        const db = new database(DBPath);
        const row = db.prepare(sql).get(...values);
        db.close();

        if (!row) {
            console.log(`No row found in ${table} with criteria:`, selectData);
            return null;
        }

        return row;
    } catch (error) {
        console.error(`Error fetching row from ${table}:`, error.message);
        return null;
    }
}

// Updates row specified by 'selectData' with data in 'updateData' in specified table in specified DB
// Example: updateRow("./databases/main.db", "users", { username: "JohnDoe" }, { email: "johndoeupdated@gmail.com" });
// Returns: 0 if successful OR error object if not successful
function updateRow(DBPath, table, selectData, updateData) {
    try {
        const selectKeys = Object.keys(selectData);
        const selectValues = Object.values(selectData);
        const updateKeys = Object.keys(updateData);
        const updateValues = Object.values(updateData);

        const setClause = updateKeys.map(key => `${key} = ?`).join(", ");
        const whereClause = selectKeys.map(key => `${key} = ?`).join(" AND ");

        const sql = `UPDATE ${table} SET ${setClause} WHERE ${whereClause}`;
        const db = new database(DBPath);
        db.prepare(sql).run(...updateValues, ...selectValues);
        db.close();
        console.log(`Row updated in ${table} successfully!`);
        return 0;
    } catch (error) {
        console.error(`Error updating row in ${table}:`, error.message);
        return error;
    }
}

// Deletes row specified by 'selectData' in specified table in specified DB
// Example: deleteRow("./databases/main.db", "users", { username: "JohnDoe" })
// Returns: 0 if successful OR error object if not successful
function deleteRow(DBPath, table, selectData) {
    try {
        const keys = Object.keys(selectData);
        const values = Object.values(selectData);

        const whereClause = keys.map(key => `${key} = ?`).join(" AND ");
        const sql = `DELETE FROM ${table} WHERE ${whereClause}`;

        const db = new database(DBPath);
        db.prepare(sql).run(...values);
        db.close();
        console.log(`Row deleted from ${table} successfully!`);
        return 0;
    } catch (error) {
        console.error(`Error deleting row from ${table}:`, error.message);
        return error;
    }
}

// Creates a new appointment linked to a user by user_id
// Example: createAppointment("./databases/main.db", { user_id: 1, time: 1633024800, appId: "uniqueAppId123" })
// Returns: 0 if successful OR error object if not successful
function createAppointment(DBPath, data) {
    try {
        const db = new database(DBPath);

        // Check if appointments table exists
        const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='appointments'").all();
        if (tables.length === 0) {
            console.log("Creating appointments table");
            db.prepare(`
                CREATE TABLE appointments (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NOT NULL,
                    time INTEGER NOT NULL,
                    appId TEXT NOT NULL UNIQUE
                )
            `).run();
        }

        // Insert the appointment
        const sql = `INSERT INTO appointments (user_id, time, appId) VALUES (?, ?, ?)`;
        db.prepare(sql).run(data.user_id, data.time, data.appId);
        db.close();
        console.log("Appointment created successfully!");
        return 0;
    } catch (error) {
        console.error("Error creating appointment:", error.message);
        return error;
    }
}

// Gets all appointments for a user by user_id
// Example: getAppointments("./databases/main.db", 1)
// Returns: JSON list representing the user's appointments OR empty array if no appointments found
function getAppointments(DBPath, userId) {
    try {
        const db = new database(DBPath);
        const appointments = db.prepare("SELECT * FROM appointments WHERE user_id = ?").all(userId);
        db.close();
        console.log(`Found ${appointments.length} appointments for user ID ${userId}`);
        return appointments;
    } catch (error) {
        console.error("Error fetching appointments:", error.message);
        return [];
    }
}

// Get user by email, using rowid as uid
// Example: getUserByEmail("./databases/main.db", "test@example.com")
// Returns: User object with uid added OR null if not found
function getUserByEmail(DBPath, email) {
    try {
        const db = new database(DBPath);
        const user = db.prepare("SELECT rowid as uid, * FROM users WHERE email = ?").get(email);
        db.close();

        if (!user) {
            console.log(`No user found for email ${email}`);
            return null;
        }

        console.log(`Found user with ID ${user.uid} for email ${email}`);
        return user;
    } catch (error) {
        console.error("Error fetching user by email:", error.message);
        return null;
    }
}

// Inserts a new file into the files table
// Example: insertFile("./databases/main.db", { user_id: 1, filetype: "pdf", name: "example.pdf", path: "uploads/example.pdf", time: 1633024800 })
// Returns: 0 if successful OR error object if not successful
function insertFile(DBPath, data) {
    try {
        // Validate required fields
        if (!data.user_id || !data.filetype || !data.name || !data.path) {
            console.error("Missing required fields in data:", data);
            return { message: "Missing required fields" };
        }

        const db = new database(DBPath);

        // Check if files table exists
        const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='files'").all();
        if (tables.length === 0) {
            console.log("Creating files table");
            db.prepare(`
                CREATE TABLE files (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    user_id INTEGER NOT NULL,
                    filetype TEXT NOT NULL,
                    name TEXT NOT NULL,
                    path TEXT NOT NULL,
                    time INTEGER NOT NULL
                )
            `).run();
        }

        // Insert the file
        const sql = `INSERT INTO files (user_id, filetype, name, path, time) VALUES (?, ?, ?, ?, ?)`;
        const timestamp = data.time || Math.floor(Date.now() / 1000); // Default to current timestamp if not provided

        console.log("Inserting file with data:", {
            user_id: data.user_id,
            filetype: data.filetype,
            name: data.name,
            path: data.path,
            time: timestamp,
        });

        db.prepare(sql).run(data.user_id, data.filetype, data.name, data.path, timestamp);
        db.close();
        console.log("File successfully inserted!");
        return 0;
    } catch (error) {
        console.error("Error inserting file:", error.message);
        return error;
    }
}

// Gets a file by its ID
// Example: getFileById("./databases/main.db", 1)
// Returns: File object OR null if not found
function getFileById(DBPath, fileId) {
    try {
        const db = new database(DBPath);
        const file = db.prepare("SELECT * FROM files WHERE id = ?").get(fileId);
        db.close();

        if (!file) {
            console.log(`No file found with ID ${fileId}`);
            return null;
        }

        console.log(`Found file with ID ${fileId}`);
        return file;
    } catch (error) {
        console.error("Error fetching file by ID:", error.message);
        return null;
    }
}

// Deletes a file by its ID
// Example: deleteFileById("./databases/main.db", 1)
// Returns: 0 if successful OR error object if not successful
function deleteFileById(DBPath, fileId) {
    try {
        const db = new database(DBPath);
        const file = db.prepare("SELECT * FROM files WHERE id = ?").get(fileId);

        if (!file) {
            console.log(`No file found with ID ${fileId} to delete`);
            db.close();
            return { message: "File not found" };
        }

        db.prepare("DELETE FROM files WHERE id = ?").run(fileId);
        db.close();
        console.log(`File with ID ${fileId} successfully deleted!`);
        return 0;
    } catch (error) {
        console.error("Error deleting file:", error.message);
        return error;
    }
}

// Gets all files for a user by user_id
// Example: getFilesByUserId("./databases/main.db", 1)
// Returns: JSON list of files OR empty array if no files found
function getFilesByUserId(DBPath, userId) {
    try {
        const db = new database(DBPath);
        const files = db.prepare("SELECT * FROM files WHERE user_id = ?").all(userId);
        db.close();
        console.log(`Found ${files.length} files for user ID ${userId}`);
        return files;
    } catch (error) {
        console.error("Error fetching files by user ID:", error.message);
        return [];
    }
}