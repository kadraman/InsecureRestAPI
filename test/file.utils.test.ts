import { jest, describe, test, expect, beforeEach } from '@jest/globals';

// Mocks for fs and child_process
jest.mock('fs');
jest.mock('child_process');
// Mock logger to avoid winston creating real file transports during tests
jest.mock('../src/middleware/logger', () => ({ __esModule: true, default: { debug: jest.fn(), error: jest.fn() } }));

let fs = require('fs');
let child_process = require('child_process');

beforeEach(() => {
  jest.resetAllMocks();
  jest.resetModules();
  // Re-require mocked modules so they reflect current jest mock state
  fs = require('fs');
  child_process = require('child_process');
  // If the module consumer used a default import (ESM interop), mirror the mocks
  if (fs && fs.default) {
    fs.default.access = fs.access;
    fs.default.readFile = fs.readFile;
    fs.default.writeFile = fs.writeFile;
    fs.default.stat = fs.stat;
  }
  if (child_process && child_process.default) {
    child_process.default.exec = child_process.exec;
  }
});

describe('FileUtils', () => {
  let newsletterFile: any = undefined;
  test('updateNewsletterDb when file exists should read and append', (done) => {
    // Arrange: access succeeds, readFile returns existing array
    fs.access.mockImplementation((path: any, mode: any, cb: any) => cb(null));
    const existing = [{ email: 'existing@x.com' }];
    fs.readFile.mockImplementation((path: any, cb: any) => cb(null, Buffer.from(JSON.stringify(existing))));
    fs.writeFile.mockImplementation((path: any, data: any, cb: any) => cb(null));

    jest.isolateModules(() => {
      const { FileUtils } = require('../src/utils/file.utils');
      const user = { firstName: 'Test', lastname: 'User', email: 'new@x.com', role: 'user' };
      FileUtils.updateNewsletterDb(user);
    });

    // Allow async callbacks to run
    setImmediate(() => {
      // Assertions: writeFile called with array containing existing + new
      expect(fs.access).toHaveBeenCalled();
      expect(fs.readFile).toHaveBeenCalled();
      // writeFile should have been called; inspect data
      expect(fs.writeFile).toHaveBeenCalled();
      const written = JSON.parse(fs.writeFile.mock.calls[0][1].toString());
      expect(Array.isArray(written)).toBeTruthy();
      expect(written.find((u: any) => u.email === 'new@x.com')).toBeDefined();
      done();
    });
  });

  test('updateNewsletterDb when file does not exist should create file', (done) => {
    fs.access.mockImplementation((path: any, mode: any, cb: any) => cb(new Error('ENOENT')));
    fs.writeFile.mockImplementation((path: any, data: any, cb: any) => cb(null));

    jest.isolateModules(() => {
      const { FileUtils } = require('../src/utils/file.utils');
      const user = { firstName: 'New', lastname: 'User', email: 'first@x.com', role: 'user' };
      FileUtils.updateNewsletterDb(user);
    });

    setImmediate(() => {
      expect(fs.access).toHaveBeenCalled();
      expect(fs.writeFile).toHaveBeenCalled();
      const written = JSON.parse(fs.writeFile.mock.calls[0][1].toString());
      expect(Array.isArray(written)).toBeTruthy();
      expect(written.length).toBe(1);
      expect(written[0].email).toBe('first@x.com');
      done();
    });
  });

  test('backupNewsletterDb when file exists should exec backup command', (done) => {
    fs.stat.mockImplementation((path: any, cb: any) => cb(null, { size: 10 }));
    child_process.exec.mockImplementation((cmd: any, cb: any) => cb(null, ''));

    jest.isolateModules(() => {
      const { FileUtils } = require('../src/utils/file.utils');
      newsletterFile = FileUtils.newsletterFile;
      FileUtils.backupNewsletterDb('backup.gz');
    });

    setImmediate(() => {
      expect(fs.stat).toHaveBeenCalled();
      expect(child_process.exec).toHaveBeenCalled();
      const cmd = child_process.exec.mock.calls[0][0];
      expect(cmd).toContain(newsletterFile);
      expect(cmd).toContain('backup.gz');
      done();
    });
  });

  test('backupNewsletterDb when file missing should create and exec', (done) => {
    const enoent = new Error('not found');
    // @ts-ignore add code property
    enoent.code = 'ENOENT';
    fs.stat.mockImplementation((path: any, cb: any) => cb(enoent));
    fs.writeFile.mockImplementation((path: any, data: any, cb: any) => cb(null));
    child_process.exec.mockImplementation((cmd: any, cb: any) => cb(null, ''));

    jest.isolateModules(() => {
      const { FileUtils } = require('../src/utils/file.utils');
      newsletterFile = FileUtils.newsletterFile;
      FileUtils.backupNewsletterDb('backup2.gz');
    });

    setImmediate(() => {
      expect(fs.stat).toHaveBeenCalled();
      expect(fs.writeFile).toHaveBeenCalled();
      expect(child_process.exec).toHaveBeenCalled();
      done();
    });
  });
});
