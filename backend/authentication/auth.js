const fs = require("fs");
const crypto = require("crypto");
const SESSION_TIMEOUT = 3600; // Time in seconds for logout since last request

// Export functions
module.exports = {
  createSession,
  authSession,
  removeSession,
};

async function getSessions() {
  return await new Promise((resolve, reject) => {
    fs.readFile("./authentication/sessions.json", (err, jsonString) => {
      if (err) {
        reject(err);
      }
      var json = JSON.parse(jsonString);
      resolve(json);
    });
  });
}

async function pushSessions(sessionData) {
  return new Promise((resolve, reject) => {
    fs.writeFile(
      "./authentication/sessions.json",
      JSON.stringify(sessionData),
      "utf8",
      (err) => {
        if (err) reject(err);
        resolve();
      }
    );
  });
}

function getUnixTime() {
  return Math.floor(new Date().getTime() / 1000);
}

async function generateAuthKey() {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(32, function (err, buffer) {
      if (err) reject(err);
      resolve(buffer.toString("hex"));
    });
  });
}

// Generates session for user
async function createSession(userid) {
  var sessions = await getSessions();
  var exists = false;
  var authkey = null;
  for (var i = 0; i < sessions.length; i++) {
    if (sessions[i]["id"] == userid) {
      sessions[i]["timestamp"] = getUnixTime();
      authkey = sessions[i]["authkey"];
      exists = true;
      break;
    }
  }

  if (!exists) {
    authkey = await generateAuthKey();
    var appendData = {
      id: userid,
      authkey: authkey,
      timestamp: getUnixTime(),
    };
    sessions.push(appendData);
  }

  await pushSessions(sessions);
  return authkey;
}

// Returns authenticated user ID, null if not authenticated
async function authSession(authkey) {
  var sessions = await getSessions();
  for (var i = 0; i < sessions.length; i++) {
    if (sessions[i]["authkey"] == authkey) {
      if (getUnixTime() - sessions[i]["timestamp"] < SESSION_TIMEOUT) {
        sessions[i]["timestamp"] = getUnixTime();
        await pushSessions(sessions);
        console.log("In auth: " + sessions[i]["id"]);
        return sessions[i]["id"];
      } else {
        sessions.pop(i);
        await pushSessions(sessions);
        return null;
      }
    }
  }
  return null;
}

async function removeSession(authkey) {
  var sessions = await getSessions();
  for (var i = 0; i < sessions.length; i++) {
    if (sessions[i]["authkey"] == authkey) {
      sessions.pop(i);
      await pushSessions(sessions);
    }
  }
}