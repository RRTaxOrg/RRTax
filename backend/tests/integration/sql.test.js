const { expect } = require('chai');
const fs = require('fs');
const path = require('path');
const sql = require('../../sql.js');

describe('SQL Module Integration Tests', () => {
  const TEST_DB_PATH = './databases/test.db';
  
  // Helper function to ensure the test db directory exists
  const ensureDbDirExists = () => {
    const dir = path.dirname(TEST_DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  };
  
  // Remove test database if it exists
  before(() => {
    ensureDbDirExists();
    if (fs.existsSync(TEST_DB_PATH)) {
      fs.unlinkSync(TEST_DB_PATH);
    }
  });
  
  // Clean up after tests
  after(() => {
    if (fs.existsSync(TEST_DB_PATH)) {
      fs.unlinkSync(TEST_DB_PATH);
    }
  });
  
  describe('Basic Database Operations', () => {
    beforeEach(() => {
      // Create a fresh test table before each test
      const db = require('better-sqlite3')(TEST_DB_PATH);
      db.exec(`
        CREATE TABLE IF NOT EXISTS test_users (
          uid INTEGER PRIMARY KEY,
          username TEXT,
          email TEXT UNIQUE,
          password TEXT,
          salt TEXT
        );
      `);
      db.close();
    });
    
    it('should insert data into a table', () => {
      // Arrange
      const userData = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedpassword',
        salt: 'testsalt'
      };
      
      // Act
      const result = sql.insertInto(TEST_DB_PATH, 'test_users', userData);
      
      // Assert
      expect(result).to.have.property('changes').that.equals(1);
      expect(result).to.have.property('lastInsertRowid').that.is.a('number');
    });
    
    it('should retrieve data from a table', () => {
      // Arrange
      const userData = {
        username: 'retrievetest',
        email: 'retrieve@example.com',
        password: 'retrievepass',
        salt: 'retrievesalt'
      };
      sql.insertInto(TEST_DB_PATH, 'test_users', userData);
      
      // Act
      const result = sql.getTable(TEST_DB_PATH, 'test_users');
      
      // Assert
      expect(result).to.be.an('array');
      expect(result.length).to.be.at.least(1);
      expect(result.some(user => user.email === 'retrieve@example.com')).to.be.true;
    });
    
    it('should get a specific row by condition', () => {
      // Arrange
      const userData = {
        username: 'rowtest',
        email: 'row@example.com',
        password: 'rowpass',
        salt: 'rowsalt'
      };
      sql.insertInto(TEST_DB_PATH, 'test_users', userData);
      
      // Act
      const result = sql.getRow(TEST_DB_PATH, 'test_users', 'email', 'row@example.com');
      
      // Assert
      expect(result).to.be.an('object');
      expect(result.username).to.equal('rowtest');
      expect(result.email).to.equal('row@example.com');
    });
    
    it('should update a row', () => {
      // Arrange
      const userData = {
        username: 'updatetest',
        email: 'update@example.com',
        password: 'updatepass',
        salt: 'updatesalt'
      };
      sql.insertInto(TEST_DB_PATH, 'test_users', userData);
      
      // Act
      const updateData = { username: 'updated_user' };
      const result = sql.updateRow(TEST_DB_PATH, 'test_users', 'email', 'update@example.com', updateData);
      const updatedRow = sql.getRow(TEST_DB_PATH, 'test_users', 'email', 'update@example.com');
      
      // Assert
      expect(result).to.have.property('changes').that.equals(1);
      expect(updatedRow.username).to.equal('updated_user');
    });
    
    it('should delete a row', () => {
      // Arrange
      const userData = {
        username: 'deletetest',
        email: 'delete@example.com',
        password: 'deletepass',
        salt: 'deletesalt'
      };
      sql.insertInto(TEST_DB_PATH, 'test_users', userData);
      
      // Act
      const result = sql.deleteRow(TEST_DB_PATH, 'test_users', 'email', 'delete@example.com');
      const deletedRow = sql.getRow(TEST_DB_PATH, 'test_users', 'email', 'delete@example.com');
      
      // Assert
      expect(result).to.have.property('changes').that.equals(1);
      expect(deletedRow).to.be.undefined;
    });
  });
  
  describe('User Operations', () => {
    beforeEach(() => {
      // Create a fresh users table before each test
      const db = require('better-sqlite3')(TEST_DB_PATH);
      db.exec(`
        CREATE TABLE IF NOT EXISTS users (
          uid INTEGER PRIMARY KEY,
          username TEXT,
          email TEXT UNIQUE,
          password TEXT,
          salt TEXT
        );
      `);
      db.close();
    });
    
    it('should get user by email', () => {
      // Arrange
      const userData = {
        username: 'emailtest',
        email: 'emailtest@example.com',
        password: 'emailpass',
        salt: 'emailsalt'
      };
      sql.insertInto(TEST_DB_PATH, 'users', userData);
      
      // Act
      const user = sql.getUserByEmail(TEST_DB_PATH, 'emailtest@example.com');
      
      // Assert
      expect(user).to.be.an('object');
      expect(user.username).to.equal('emailtest');
      expect(user.email).to.equal('emailtest@example.com');
    });
  });
  
  describe('Appointment Operations', () => {
    beforeEach(() => {
      // Create fresh appointments and users tables before each test
      const db = require('better-sqlite3')(TEST_DB_PATH);
      db.exec(`
        CREATE TABLE IF NOT EXISTS users (
          uid INTEGER PRIMARY KEY,
          username TEXT,
          email TEXT UNIQUE,
          password TEXT,
          salt TEXT
        );
        
        CREATE TABLE IF NOT EXISTS appointments (
          appointment_id INTEGER PRIMARY KEY,
          user_id INTEGER,
          time TEXT,
          file_id INTEGER,
          FOREIGN KEY(user_id) REFERENCES users(uid)
        );
      `);
      
      // Insert a test user
      db.exec(`
        INSERT INTO users (username, email, password, salt)
        VALUES ('appointmentuser', 'appointment@example.com', 'password', 'salt');
      `);
      
      db.close();
    });
    
    it('should create and retrieve appointments', () => {
      // Arrange
      const user = sql.getRow(TEST_DB_PATH, 'users', 'email', 'appointment@example.com');
      const appointmentData = {
        user_id: user.uid,
        time: '2023-11-01T10:00:00',
        file_id: 1
      };
      
      // Act - Create appointment
      const createResult = sql.createAppointment(TEST_DB_PATH, appointmentData);
      
      // Assert - Create
      expect(createResult).to.have.property('changes').that.equals(1);
      
      // Act - Get appointments
      const appointments = sql.getAppointments(TEST_DB_PATH, user.uid);
      
      // Assert - Get
      expect(appointments).to.be.an('array');
      expect(appointments.length).to.equal(1);
      expect(appointments[0].user_id).to.equal(user.uid);
      expect(appointments[0].time).to.equal('2023-11-01T10:00:00');
    });
  });
});
