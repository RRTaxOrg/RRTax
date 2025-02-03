const database = require("better-sqlite3");

module.exports = {
    insertInto,
    getTable,
    getRow,
    updateRow,
    deleteRow,
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