const { expect } = require('chai');
const sinon = require('sinon');
const proxyquire = require('proxyquire');

describe('Server API Unit Tests', () => {
  let sqlStub;
  let authStub; 
  let app;
  let req;
  let res;
  
  beforeEach(() => {
    // Create stubs for SQL module
    sqlStub = {
      getTable: sinon.stub(),
      insertInto: sinon.stub(),
      getRow: sinon.stub(),
      updateRow: sinon.stub(),
      deleteRow: sinon.stub(),
      createAppointment: sinon.stub(),
      getAppointments: sinon.stub(),
      getUserByEmail: sinon.stub()
    };
    
    // Create stubs for auth module
    authStub = {
      createSession: sinon.stub(),
      authSession: sinon.stub(),
      removeSession: sinon.stub()
    };
    
    // Mock Express request and response
    req = {
      query: {},
      body: {},
      params: {}
    };
    
    res = {
      status: sinon.stub().returnsThis(),
      send: sinon.stub(),
      json: sinon.stub()
    };
    
    // Create Express app stub
    const expressStub = {
      use: sinon.stub(),
      get: sinon.stub(),
      post: sinon.stub(),
      delete: sinon.stub(),
      listen: sinon.stub()
    };
    
    // Create stubs for express and cors
    const express = sinon.stub().returns(expressStub);
    express.json = sinon.stub().returns(() => {});
    const cors = sinon.stub().returns(() => {});

    // Create a better-sqlite3 stub
    const dbStub = {
      prepare: sinon.stub().returns({
        all: sinon.stub(),
        run: sinon.stub(),
        get: sinon.stub()
      }),
      close: sinon.stub()
    };
    
    const betterSqlite3Stub = sinon.stub().returns(dbStub);
    
    // Inject our stubs into the server module
    proxyquire('../../server.js', {
      express: express,
      cors: cors,
      './sql.js': sqlStub,
      './authentication/auth.js': authStub,
      'better-sqlite3': betterSqlite3Stub
    });
    
    // Store the handlers
    this.handlers = {};
    
    // Capture route handlers
    expressStub.get.callsFake((path, handler) => {
      this.handlers[`GET ${path}`] = handler;
    });
    
    expressStub.post.callsFake((path, handler) => {
      this.handlers[`POST ${path}`] = handler;
    });
    
    expressStub.delete.callsFake((path, handler) => {
      this.handlers[`DELETE ${path}`] = handler;
    });
  });
  
  afterEach(() => {
    sinon.restore();
  });

  describe('/salt/', () => {
    it('should return salt for valid email', async () => {
      // Arrange
      req.query = { email: 'test@example.com' };
      sqlStub.getRow.returns({ salt: 'testSalt123' });
      
      // Act
      if (this.handlers['GET /salt/']) {
        await this.handlers['GET /salt/'](req, res);
      }
      
      // Assert
      expect(sqlStub.getRow.calledOnce).to.be.true;
      expect(res.send.calledOnce).to.be.true;
      expect(res.send.firstCall.args[0]).to.include('"code":"0"');
      expect(res.send.firstCall.args[0]).to.include('"salt":"testSalt123"');
    });
    
    it('should return error code for missing email', async () => {
      // Arrange
      req.query = {};
      
      // Act
      if (this.handlers['GET /salt/']) {
        await this.handlers['GET /salt/'](req, res);
      }
      
      // Assert
      expect(res.send.calledOnce).to.be.true;
      expect(res.send.firstCall.args[0]).to.include('"code":"3"');
    });
    
    it('should return error code for non-existent email', async () => {
      // Arrange
      req.query = { email: 'nonexistent@example.com' };
      sqlStub.getRow.returns(null);
      
      // Act
      if (this.handlers['GET /salt/']) {
        await this.handlers['GET /salt/'](req, res);
      }
      
      // Assert
      expect(sqlStub.getRow.calledOnce).to.be.true;
      expect(res.send.calledOnce).to.be.true;
      expect(res.send.firstCall.args[0]).to.include('"code":"1"');
    });
  });

  describe('/login/', () => {
    it('should authenticate user with valid credentials', async () => {
      // Arrange
      req.body = { 
        email: 'test@example.com', 
        password: 'hashedPassword123' 
      };
      
      sqlStub.getRow.returns({ 
        uid: 1, 
        password: 'hashedPassword123' 
      });
      
      authStub.createSession.resolves('sessionToken123');
      
      // Act
      if (this.handlers['POST /login/']) {
        await this.handlers['POST /login/'](req, res);
      }
      
      // Assert
      expect(sqlStub.getRow.calledOnce).to.be.true;
      expect(authStub.createSession.calledWith(1)).to.be.true;
      expect(res.send.calledOnce).to.be.true;
      expect(res.send.firstCall.args[0]).to.include('"code":"0"');
      expect(res.send.firstCall.args[0]).to.include('"token":"sessionToken123"');
    });
    
    it('should reject user with invalid password', async () => {
      // Arrange
      req.body = { 
        email: 'test@example.com', 
        password: 'wrongPassword' 
      };
      
      sqlStub.getRow.returns({ 
        password: 'correctPassword' 
      });
      
      // Act
      if (this.handlers['POST /login/']) {
        await this.handlers['POST /login/'](req, res);
      }
      
      // Assert
      expect(sqlStub.getRow.calledOnce).to.be.true;
      expect(authStub.createSession.called).to.be.false;
      expect(res.send.calledOnce).to.be.true;
      expect(res.send.firstCall.args[0]).to.include('"code":"1"');
    });
  });

  describe('/logout/', () => {
    it('should log out user with valid token', async () => {
      // Arrange
      req.query = { token: 'validToken123' };
      authStub.removeSession.resolves();
      
      // Act
      if (this.handlers['GET /logout/']) {
        await this.handlers['GET /logout/'](req, res);
      }
      
      // Assert
      expect(authStub.removeSession.calledWith('validToken123')).to.be.true;
      expect(res.send.calledOnce).to.be.true;
      expect(res.send.firstCall.args[0]).to.include('"code":"0"');
    });
    
    it('should return error code for missing token', async () => {
      // Arrange
      req.query = {};
      
      // Act
      if (this.handlers['GET /logout/']) {
        await this.handlers['GET /logout/'](req, res);
      }
      
      // Assert
      expect(authStub.removeSession.called).to.be.false;
      expect(res.send.calledOnce).to.be.true;
      expect(res.send.firstCall.args[0]).to.include('"code":"3"');
    });
  });

  describe('/appointment/create', () => {
    it('should create appointment successfully', async () => {
      // Arrange
      req.body = {
        user_id: '123',
        time: '1633024800',
        appId: 'app123'
      };
      
      // Stub database responses for column info
      const dbInstance = {
        prepare: sinon.stub().returnsThis(),
        all: sinon.stub().returns([
          { name: 'appointment_id', type: 'INTEGER' },
          { name: 'user_id', type: 'INTEGER' },
          { name: 'time', type: 'TEXT' },
          { name: 'file_id', type: 'INTEGER' }
        ]),
        run: sinon.stub(),
        close: sinon.stub()
      };
      
      const betterSqlite3 = sinon.stub().returns(dbInstance);
      
      // Override module stubs for this test
      const server = proxyquire('../../server.js', {
        'better-sqlite3': betterSqlite3
      });
      
      // Act
      if (this.handlers['POST /appointment/create']) {
        await this.handlers['POST /appointment/create'](req, res);
      }
      
      // Assert
      expect(res.send.calledOnce).to.be.true;
      expect(res.send.firstCall.args[0]).to.include('"code":"0"');
    });
  });

  describe('/getUserByEmail', () => {
    it('should return user data for valid email', async () => {
      // Arrange
      const userData = { uid: 1, email: 'test@example.com', username: 'testuser' };
      req.query = { email: 'test@example.com' };
      sqlStub.getUserByEmail.returns(userData);
      
      // Act
      if (this.handlers['GET /getUserByEmail']) {
        await this.handlers['GET /getUserByEmail'](req, res);
      }
      
      // Assert
      expect(sqlStub.getUserByEmail.calledWith('./databases/main.db', 'test@example.com')).to.be.true;
      expect(res.send.calledOnce).to.be.true;
      expect(res.send.firstCall.args[0]).to.include('"code":"0"');
      expect(res.send.firstCall.args[0]).to.include('"user"');
    });
    
    it('should return error for missing email', async () => {
      // Arrange
      req.query = {};
      
      // Act
      if (this.handlers['GET /getUserByEmail']) {
        await this.handlers['GET /getUserByEmail'](req, res);
      }
      
      // Assert
      expect(sqlStub.getUserByEmail.called).to.be.false;
      expect(res.send.calledOnce).to.be.true;
      expect(res.send.firstCall.args[0]).to.include('"code":"3"');
    });
  });
});
