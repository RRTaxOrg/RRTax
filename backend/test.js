const {
    insertInto,
    getTable,
    getRow,
    updateRow,
    deleteRow,
} = require("./sql.js");


//var result = insertInto("./databases/main.db", "users", { email: "test@test.com", username: "JohnDoe", password: "ILoveDogs123", salt:"asjdhjsa", data:"{}" });
var result = getRow("./databases/main.db", "users", {email: "test@teste.com"});
console.log(result);