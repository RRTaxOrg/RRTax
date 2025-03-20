import { insertInto, getTable, getRow} from "./sql.js";

import { createSession, authSession} from "./authentication/auth.js";


//var result = insertInto("./databases/main.db", "users", { email: "test@test.com", username: "JohnDoe", password: "ILoveDogs123", salt:"asjdhjsa", data:"{}" });
/*var result = getTable("./databases/test.db", "test");
if (result != null) {
    console.log("PASS");
}
else {
    console.log("FAIL");
}*/

result = insertInto("./databases/main.db", "appointments", { user_id: 3, time: 23456789});
if (result == 0) {
    console.log("PASS");
}
else {
    console.log("FAIL");
}

/*result = getRow("./databases/test.db", "test", { text2: "JohnDoe" });
if (result != null) {
    console.log("PASS");
}
else {
    console.log("FAIL");
}

result = await createSession(76);
if (result != null) {
    console.log("PASS");
}
else {
    console.log("FAIL");
}

result = await authSession(result);
if (result != null) {
    console.log("PASS");
}
else {
    console.log("FAIL");
}*/