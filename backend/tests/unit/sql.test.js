const { expect } = require('chai');
const sinon = require('sinon');
const proxyquire = require('proxyquire');

describe('SQL Module Unit Tests', () => {
  let betterSqlite3Stub;
  let sqlModule;
  let dbStub;
  let prepareStub;
  let runStub;
  let allStub;
  let getStub;
  
  beforeEach(() => {
    // Create stubs for better-sqlite3
    runStub = sinon.stub();
    allStub = sinon.stub();
    getStub = sinon.stub();
    prepareStub = sinon.stub().returns({
      run: runStub,
      all: allStub,
      get: getStub
    });

    dbStub = {
      prepare: prepareStub,
      close: sinon.stub()
    };
    
    betterSqlite3Stub = sinon.stub().returns(dbStub);
    
    // Inject our stub into the module
    sqlModule = proxyquire('../../sql.js', {
      'better-sqlite3': betterSqlite3Stub
    });
  });
  
  afterEach(() => {
    sinon.restore();
  });

  describe('getTable', () => {
    it('should return table data when table exists', () => {
      // Arrange
      const mockData = [{ id: 1, name: 'Test' }];
      allStub.returns(mockData);
      
      // Act
      const result = sqlModule.getTable('./test.db', 'users');
      
      // Assert
      expect(result).to.deep.equal(mockData);
      expect(prepareStub.calledWith('SELECT * FROM users')).to.be.true;
      expect(dbStub.close.calledOnce).to.be.true;
    });
    
    it('should return null when error occurs', () => {
      // Arrange
      prepareStub.throws(new Error('Table not found'));
      
      // Act
      const result = sqlModule.getTable('./test.db', 'non_existent_table');
      
      // Assert
      expect(result).to.be.null;
      expect(dbStub.close.calledOnce).to.be.true;
    });
  });

  describe('insertInto', () => {
    it('should insert data successfully', () => {
      // Arrange
      runStub.returns({ changes: 1 });
      const data = { name: 'John', email: 'john@example.com' };
      
      // Act
      const result = sqlModule.insertInto('./test.db', 'users', data);
      
      // Assert
      expect(result).to.equal(0); // 0 means success
      expect(prepareStub.calledOnce).to.be.true;
      expect(runStub.calledOnce).to.be.true;
      expect(dbStub.close.calledOnce).to.be.true;
    });
    
    it('should handle errors during insertion', () => {
      // Arrange
      prepareStub.throws(new Error('Insert failed'));
      const data = { name: 'John' };
      
      // Act
      const result = sqlModule.insertInto('./test.db', 'users', data);
      
      // Assert
      expect(result).to.be.a('string');
      expect(result).to.include('Insert failed');
      expect(dbStub.close.calledOnce).to.be.true;
    });
  });

  describe('getRow', () => {
    it('should return row data when found', () => {
      // Arrange
      const mockRow = { id: 1, name: 'Test User' };
      getStub.returns(mockRow);
      
      // Act
      const result = sqlModule.getRow('./test.db', 'users', { id: 1 });
      
      // Assert
      expect(result).to.deep.equal(mockRow);
      expect(prepareStub.calledOnce).to.be.true;
      expect(getStub.calledOnce).to.be.true;
      expect(dbStub.close.calledOnce).to.be.true;
    });
    
    it('should return null when row not found', () => {
      // Arrange
      getStub.returns(undefined);
      
      // Act
      const result = sqlModule.getRow('./test.db', 'users', { id: 999 });
      
      // Assert
      expect(result).to.be.null;
      expect(dbStub.close.calledOnce).to.be.true;
    });
  });

  describe('updateRow', () => {
    it('should update row successfully', () => {
      // Arrange
      runStub.returns({ changes: 1 });
      
      // Act
      const result = sqlModule.updateRow(
        './test.db',
        'users',
        { id: 1 },
        { name: 'Updated Name' }
      );
      
      // Assert
      expect(result).to.equal(0); // 0 means success
      expect(prepareStub.calledOnce).to.be.true;
      expect(runStub.calledOnce).to.be.true;
      expect(dbStub.close.calledOnce).to.be.true;
    });
    
    it('should handle errors during update', () => {
      // Arrange
      prepareStub.throws(new Error('Update failed'));
      
      // Act
      const result = sqlModule.updateRow(
        './test.db',
        'users',
        { id: 1 },
        { name: 'Updated Name' }
      );
      
      // Assert
      expect(result).to.be.a('string');
      expect(result).to.include('Update failed');
      expect(dbStub.close.calledOnce).to.be.true;
    });
  });

  describe('createAppointment', () => {
    it('should create appointment successfully', () => {
      // Arrange
      runStub.returns({ changes: 1 });
      const appointmentData = { 
        user_id: 1, 
        time: 1633024800, 
        appId: 'app123' 
      };
      
      // Act
      const result = sqlModule.createAppointment('./test.db', appointmentData);
      
      // Assert
      expect(result).to.equal(0); // 0 means success
      expect(prepareStub.calledOnce).to.be.true;
      expect(runStub.calledOnce).to.be.true;
      expect(dbStub.close.calledOnce).to.be.true;
    });
  });

  describe('getUserByEmail', () => {
    it('should return user when email exists', () => {
      // Arrange
      const mockUser = { 
        uid: 1, 
        email: 'test@example.com',
        username: 'testuser' 
      };
      getStub.returns(mockUser);
      
      // Act
      const result = sqlModule.getUserByEmail('./test.db', 'test@example.com');
      
      // Assert
      expect(result).to.deep.equal(mockUser);
      expect(prepareStub.calledWith('SELECT * FROM users WHERE email = ?')).to.be.true;
      expect(getStub.calledWith('test@example.com')).to.be.true;
      expect(dbStub.close.calledOnce).to.be.true;
    });
    
    it('should return null when email not found', () => {
      // Arrange
      getStub.returns(undefined);
      
      // Act
      const result = sqlModule.getUserByEmail('./test.db', 'nonexistent@example.com');
      
      // Assert
      expect(result).to.be.null;
      expect(dbStub.close.calledOnce).to.be.true;
    });
  });
});
