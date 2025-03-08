const { expect } = require('chai');
const fs = require('fs');
const path = require('path');
const sql = require('../../sql.js');
const auth = require('../../authentication/auth.js');

describe('Authentication Integration Tests', () => {
  const TEST_DB_PATH = './databases/test_auth.db';
  
  // Helper function to ensure the test db directory exists
  const ensureDbDirExists = () => {
    const dir = path.dirname(TEST_DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  };
  
  before(() => {
    ensureDbDirExists();
    if (fs.existsSync(TEST_DB_PATH)) {
      fs.unlinkSync(TEST_DB_PATH);
    }
    
    // Create test database with necessary tables
    const db = require('better-sqlite3')(TEST_DB_PATH);
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        uid INTEGER PRIMARY KEY,
        username TEXT,
        email TEXT UNIQUE,
        password TEXT,
        salt TEXT
      );
      
      CREATE TABLE IF NOT EXISTS sessions (
        token TEXT PRIMARY KEY,
        uid INTEGER,
        expires TEXT
      );
    `);
    
    // Insert test user
    db.exec(`
      INSERT INTO users (username, email, password, salt)
      VALUES ('authuser', 'auth@example.com', 'authpass', 'authsalt');
    `);
    
    db.close();
  });
  
  after(() => {
    if (fs.existsSync(TEST_DB_PATH)) {
      fs.unlinkSync(TEST_DB_PATH);
    }
  });
  
  describe('Session Management', () => {
    it('should create a new session', async () => {
      // Arrange
      const user = sql.getRow(TEST_DB_PATH, 'users', 'email', 'auth@example.com');
      
      // Act
      const token = await auth.createSession(user.uid, TEST_DB_PATH);
      
      // Assert
      expect(token).to.be.a('string').that.is.not.empty;
      
      // Verify session was stored in DB
      const db = require('better-sqlite3')(TEST_DB_PATH);
      const session = db.prepare('SELECT * FROM sessions WHERE token = ?').get(token);
      db.close();
      
      expect(session).to.exist;
      expect(session.uid).to.equal(user.uid);
    });
    
    it('should authenticate a valid session', async () => {
      // Arrange
      const user = sql.getRow(TEST_DB_PATH, 'users', 'email', 'auth@example.com');
      const token = await auth.createSession(user.uid, TEST_DB_PATH);
      
      // Act
      const userId = await auth.authSession(token, TEST_DB_PATH);
      
      // Assert
      expect(userId).to.equal(user.uid);
    });
    
    it('should reject an invalid session token', async () => {
      // Act
      const userId = await auth.authSession('invalid-token-123', TEST_DB_PATH);
      
      // Assert
      expect(userId).to.be.null;
    });
    
    it('should remove a session', async () => {
      // Arrange
      const user = sql.getRow(TEST_DB_PATH, 'users', 'email', 'auth@example.com');
      const token = await auth.createSession(user.uid, TEST_DB_PATH);
      
      // Verify session exists
      let db = require('better-sqlite3')(TEST_DB_PATH);
      const sessionBefore = db.prepare('SELECT * FROM sessions WHERE token = ?').get(token);
      db.close();
      expect(sessionBefore).to.exist;
      
      // Act
      await auth.removeSession(token, TEST_DB_PATH);
      
      // Assert
      db = require('better-sqlite3')(TEST_DB_PATH);
      const sessionAfter = db.prepare('SELECT * FROM sessions WHERE token = ?').get(token);
      db.close();
      expect(sessionAfter).to.be.undefined;
    });
  });
});
