const { expect } = require('chai');
const sinon = require('sinon');
const fs = require('fs');
const crypto = require('crypto');
const path = require('path');

// Import the module to test
const auth = require('../../authentication/auth');

describe('Authentication Unit Tests', () => {
  let fsReadFileStub;
  let fsWriteFileStub;
  let cryptoStub;
  
  beforeEach(() => {
    // Setup stubs
    fsReadFileStub = sinon.stub(fs, 'readFileSync');
    fsWriteFileStub = sinon.stub(fs, 'writeFileSync');
    cryptoStub = sinon.stub(crypto, 'randomBytes').returns(Buffer.from('mockedRandomBytes'));
  });
  
  afterEach(() => {
    // Clean up stubs
    sinon.restore();
  });

  describe('createSession', () => {
    it('should create a new session for a user', async () => {
      // Arrange
      const userId = 123;
      const mockSessions = JSON.stringify([]);
      fsReadFileStub.returns(mockSessions);
      
      // Act
      const result = await auth.createSession(userId);
      
      // Assert
      expect(result).to.be.a('string');
      expect(fsWriteFileStub.calledOnce).to.be.true;
      const writeCall = fsWriteFileStub.getCall(0);
      const writtenSessions = JSON.parse(writeCall.args[1]);
      expect(writtenSessions).to.be.an('array').with.lengthOf(1);
      expect(writtenSessions[0].id).to.equal(userId);
    });
    
    it('should update timestamp for existing session', async () => {
      // Arrange
      const userId = 123;
      const existingAuthKey = 'existingToken123';
      const mockSessions = JSON.stringify([{
        id: userId,
        authkey: existingAuthKey,
        timestamp: 1000000
      }]);
      fsReadFileStub.returns(mockSessions);
      
      // Act
      const result = await auth.createSession(userId);
      
      // Assert
      expect(result).to.equal(existingAuthKey);
      expect(fsWriteFileStub.calledOnce).to.be.true;
      const writeCall = fsWriteFileStub.getCall(0);
      const writtenSessions = JSON.parse(writeCall.args[1]);
      expect(writtenSessions[0].timestamp).to.be.above(1000000);
    });
  });

  describe('authSession', () => {
    it('should authenticate valid session within timeout period', async () => {
      // Arrange
      const userId = 123;
      const authKey = 'validToken123';
      const currentTime = Math.floor(Date.now() / 1000);
      const mockSessions = JSON.stringify([{
        id: userId,
        authkey: authKey,
        timestamp: currentTime - 100 // Session created 100 seconds ago
      }]);
      fsReadFileStub.returns(mockSessions);
      
      // Act
      const result = await auth.authSession(authKey);
      
      // Assert
      expect(result).to.equal(userId);
      expect(fsWriteFileStub.calledOnce).to.be.true;
    });
    
    it('should reject expired session', async () => {
      // Arrange
      const userId = 123;
      const authKey = 'expiredToken123';
      const currentTime = Math.floor(Date.now() / 1000);
      const mockSessions = JSON.stringify([{
        id: userId,
        authkey: authKey,
        timestamp: currentTime - 4000 // Session created 4000 seconds ago (expired)
      }]);
      fsReadFileStub.returns(mockSessions);
      
      // Act
      const result = await auth.authSession(authKey);
      
      // Assert
      expect(result).to.be.null;
      expect(fsWriteFileStub.calledOnce).to.be.true;
    });
    
    it('should reject invalid authkey', async () => {
      // Arrange
      const mockSessions = JSON.stringify([{
        id: 123,
        authkey: 'validToken123',
        timestamp: Math.floor(Date.now() / 1000)
      }]);
      fsReadFileStub.returns(mockSessions);
      
      // Act
      const result = await auth.authSession('invalidToken456');
      
      // Assert
      expect(result).to.be.null;
      expect(fsWriteFileStub.called).to.be.false;
    });
  });

  describe('removeSession', () => {
    it('should remove an existing session', async () => {
      // Arrange
      const authKey = 'tokenToRemove';
      const mockSessions = JSON.stringify([
        { id: 123, authkey: authKey, timestamp: 1000000 },
        { id: 456, authkey: 'otherToken', timestamp: 1000000 }
      ]);
      fsReadFileStub.returns(mockSessions);
      
      // Act
      await auth.removeSession(authKey);
      
      // Assert
      expect(fsWriteFileStub.calledOnce).to.be.true;
      const writeCall = fsWriteFileStub.getCall(0);
      const writtenSessions = JSON.parse(writeCall.args[1]);
      expect(writtenSessions).to.be.an('array').with.lengthOf(1);
      expect(writtenSessions[0].authkey).to.equal('otherToken');
    });
    
    it('should handle non-existent session gracefully', async () => {
      // Arrange
      const mockSessions = JSON.stringify([
        { id: 123, authkey: 'existingToken', timestamp: 1000000 }
      ]);
      fsReadFileStub.returns(mockSessions);
      
      // Act
      await auth.removeSession('nonExistentToken');
      
      // Assert
      expect(fsWriteFileStub.calledOnce).to.be.true;
      const writeCall = fsWriteFileStub.getCall(0);
      const writtenSessions = JSON.parse(writeCall.args[1]);
      expect(writtenSessions).to.be.an('array').with.lengthOf(1);
      expect(writtenSessions[0].authkey).to.equal('existingToken');
    });
  });
});
