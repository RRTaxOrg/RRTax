const { expect } = require('chai');
const request = require('supertest');
const fs = require('fs');
const path = require('path');
const sql = require('../../sql.js');

// Import the actual server without mocking its dependencies
const app = require('../../server.js');

describe('Server API Integration Tests', () => {
  const TEST_DB_PATH = './databases/test_server.db';
  let testUser;
  let authToken;
  
  // Helper function to ensure the test db directory exists
  const ensureDbDirExists = () => {
    const dir = path.dirname(TEST_DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  };
  
  before(async () => {
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
      
      CREATE TABLE IF NOT EXISTS appointments (
        appointment_id INTEGER PRIMARY KEY,
        user_id INTEGER,
        time TEXT,
        file_id INTEGER,
        FOREIGN KEY(user_id) REFERENCES users(uid)
      );
    `);
    
    // Insert test user - for a real integration test we'd hash the password properly
    db.exec(`
      INSERT INTO users (username, email, password, salt)
      VALUES ('serveruser', 'server@example.com', 'testpass', 'testsalt123');
    `);
    
    db.close();
    
    // Store user for later use
    testUser = sql.getRow(TEST_DB_PATH, 'users', 'email', 'server@example.com');
  });
  
  after(() => {
    if (fs.existsSync(TEST_DB_PATH)) {
      fs.unlinkSync(TEST_DB_PATH);
    }
  });

  describe('Authentication endpoints', () => {
    it('should return salt for a valid email', async () => {
      const response = await request(app)
        .get('/salt/')
        .query({ email: 'server@example.com' });
      
      expect(response.status).to.equal(200);
      const body = JSON.parse(response.text);
      expect(body.code).to.equal('0');
      expect(body.salt).to.equal('testsalt123');
    });
    
    it('should reject login with incorrect password', async () => {
      const response = await request(app)
        .post('/login/')
        .send({ 
          email: 'server@example.com', 
          password: 'wrongpassword'
        });
      
      expect(response.status).to.equal(200);
      const body = JSON.parse(response.text);
      expect(body.code).to.equal('1');
    });
    
    it('should login with correct credentials and return token', async () => {
      const response = await request(app)
        .post('/login/')
        .send({ 
          email: 'server@example.com', 
          password: 'testpass' // In a real test this would be hashed with salt
        });
      
      expect(response.status).to.equal(200);
      const body = JSON.parse(response.text);
      expect(body.code).to.equal('0');
      expect(body.token).to.be.a('string').that.is.not.empty;
      
      // Save token for subsequent tests
      authToken = body.token;
    });
    
    it('should get user data by email', async () => {
      const response = await request(app)
        .get('/getUserByEmail')
        .query({ email: 'server@example.com' });
      
      expect(response.status).to.equal(200);
      const body = JSON.parse(response.text);
      expect(body.code).to.equal('0');
      expect(body.user).to.be.an('object');
      expect(body.user.email).to.equal('server@example.com');
    });
    
    it('should logout successfully', async () => {
      // Only run if we have a token from previous test
      if (authToken) {
        const response = await request(app)
          .get('/logout/')
          .query({ token: authToken });
        
        expect(response.status).to.equal(200);
        const body = JSON.parse(response.text);
        expect(body.code).to.equal('0');
      } else {
        this.skip();
      }
    });
  });

  describe('Appointment endpoints', () => {
    it('should create a new appointment', async () => {
      // Login first to get a token
      const loginResponse = await request(app)
        .post('/login/')
        .send({ 
          email: 'server@example.com', 
          password: 'testpass'
        });
      
      const loginBody = JSON.parse(loginResponse.text);
      const token = loginBody.token;
      
      // Create appointment
      const appointmentData = {
        user_id: testUser.uid,
        time: '2023-11-02T14:00:00',
        token: token
      };
      
      const response = await request(app)
        .post('/appointment/create')
        .send(appointmentData);
      
      expect(response.status).to.equal(200);
      const body = JSON.parse(response.text);
      expect(body.code).to.equal('0');
    });
    
    it('should retrieve appointments for a user', async () => {
      // Login to get token
      const loginResponse = await request(app)
        .post('/login/')
        .send({ 
          email: 'server@example.com', 
          password: 'testpass'
        });
      
      const loginBody = JSON.parse(loginResponse.text);
      const token = loginBody.token;
      
      // Get appointments
      const response = await request(app)
        .get('/appointments/get')
        .query({ 
          userId: testUser.uid,
          token: token
        });
      
      expect(response.status).to.equal(200);
      const body = JSON.parse(response.text);
      expect(body.code).to.equal('0');
      expect(body.appointments).to.be.an('array');
      // If we created an appointment in previous test, we should have at least one
      expect(body.appointments.length).to.be.at.least(1);
    });
  });
});
