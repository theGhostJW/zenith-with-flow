import { LogAttributes } from '../lib/Logging';
import {chk, chkEq, chkFalse, chkHasText, chkWithMessage} from '../lib/AssertionUtils';
import { delay } from '../lib/SysUtils';
import {
  clearDirectory,
  combine,
  copyFile,
  deleteDirectory,
  deleteFile,
  eachFile,
  eachFolder,
  eachPathNonRecursive,
  fileExtension,
  fileLastModified,
  fileOrFolderName,
  fileToLines,
  fileToObj,
  fileToString,
  forceDirectory,
  fromLogDir,
  fromMock,
  fromTemp,
  fromTempString,
  fromTestData,
  fromTestDataString,
  linesToFile,
  listFiles,
  listFolders,
  logFile,
  mockFile,
  pathExists,
  projectDir,
  relativePath,
  runTimeFile,
  seekFolder,
  stringToFile,
  stringToLogFile,
  tempFile,
  tempFileExists,
  testDataFile,
  toLogDir,
  toMock,
  toTemp,
  toTempString,
  toTestData,
  toTestDataString,
  unzipAll,
  wdioConfigFile,
  zipAll,
} from '../lib/FileUtils';

import { setLoggingFunctions, DEFAULT_LOGGING_FUNCTIONS } from '../lib/Logging';
import { createGuidTruncated, hasText, CharacterEncoding } from '../lib/StringUtils';
import { areEqual, debug } from '../lib/SysUtils';

const PROJECT_PATH : string = projectDir(),
      SOURCE_DIR: string = PROJECT_PATH + '\\src',
      BASE_FILE: string  = SOURCE_DIR + '\\lib\\FileUtils.js';


describe('wdioConfigFile', () => {
  it('wdioConfigFile simple', () => {
    wdioConfigFile('wdio.conf.js');
  });
});


describe('fileLastModified', () => {

  it('simple', () => {
    let dir = forceDirectory(combine(tempFile(), createGuidTruncated(10))),
        fileOne = stringToFile('dfhfjhds', combine(dir, 'file.txt')),
        modTime = fileLastModified(fileOne);
        // burn some millisecs
    delay(1);
    stringToFile('modified', fileOne);
    
    let modTime2 = fileLastModified(fileOne);
    chk(modTime.isBefore(modTime2));
  });

});

describe('copyFile', () => {

  let dir = '',
      childDir = '',
      fileOne = '',
      fileTwoPath = '';

  const FILE_ONE_CONTENT = 'fsdfsf';

  beforeEach(() => {
    dir = forceDirectory(combine(tempFile(), createGuidTruncated(10)));
    childDir = forceDirectory(combine(dir, createGuidTruncated(10)));
    fileOne = stringToFile(FILE_ONE_CONTENT, combine(dir, 'file.txt'));
    fileTwoPath = combine(childDir, 'file.yaml');
  });

  it('no dest file', () => {
    copyFile(fileOne, fileTwoPath);
    chkEq(FILE_ONE_CONTENT, fileToString(fileTwoPath))
  });

  it('dest file overwrite', () => {
    stringToFile('sdfsdfdsfdfdsfd', fileTwoPath);
    copyFile(fileOne, fileTwoPath);
    chkEq(FILE_ONE_CONTENT, fileToString(fileTwoPath))
  });

  afterEach(() => {
    deleteDirectory(dir);
  });

});


describe('zipAll / unzipAll', () => {

  let dir = '',
      childDir = '',
      zipOut = '',
      fileOne = '',
      fileTwo = '',
      destDir = '';

  const FILE_ONE_CONTENT = 'fsdfsf',
        FILE_TWO_CONTENT = 'dsffd';

  const destPath = (srcpath: string) => combine(destDir, relativePath(dir, srcpath)),
        decompressedFile1Path = () => destPath(fileOne),
        decompressedFile2Path = () => destPath(fileTwo);

  beforeEach(() => {
    dir = forceDirectory(combine(tempFile(), createGuidTruncated(10)));
    destDir = forceDirectory(combine(tempFile(), createGuidTruncated(10)));
    childDir = forceDirectory(combine(dir, createGuidTruncated(10)));
    fileOne = stringToFile(FILE_ONE_CONTENT, combine(dir, 'file.txt'));
    fileTwo = stringToFile(FILE_TWO_CONTENT, combine(childDir, 'file.yaml'));
    zipOut = tempFile('zipTest.zip');
    deleteFile(zipOut);
  });

  it('basic round trip', () => {
    let zipped = zipAll(dir, zipOut);
    unzipAll(zipped, destDir);

    chkEq(FILE_ONE_CONTENT, fileToString(decompressedFile1Path()));
    chkEq(FILE_TWO_CONTENT, fileToString(decompressedFile2Path()));
  });

  it('basic round trip with filter', () => {
    function hasYaml(name: string, path: string) {
      return hasText(name, 'yaml');
    }
    let zipped = zipAll(dir, zipOut, hasYaml);
    unzipAll(zipped, destDir);

    chkFalse(pathExists(decompressedFile1Path()));
    chkEq(FILE_TWO_CONTENT, fileToString(decompressedFile2Path()));
  });

  afterEach(() => {
    deleteDirectory(dir);
    deleteDirectory(destDir);
  });

});

describe('fileToLines / fromLines', () => {

  let path: string = tempFile('lines.txt');

  function roundTripTest(arr: string[]) {
    linesToFile(arr, path);
    let actual: string[]  = fileToLines(path);
    chkEq(arr, actual);
  }

  // Known issue empty array returns an arrau with single empty string
  // Use yaml if this is anissue
  // it('round trip empty', () => {
  //   roundTripTest([]) ;
  // });

  it('round trip null string', () => {
    roundTripTest(['']);
  });

  it('populated array', () => {
    roundTripTest(['one', 'two', 'three']);
  });

});


describe('list files / folders', () => {

  let parent = combine(tempFile(), createGuidTruncated(5)),
      child = combine(parent, createGuidTruncated(5) + '_child_txt'),
      grandChild = combine(child, createGuidTruncated(5)),
      yaml1 = combine(parent, 'tst1.yaml'),
      txt1 = combine(parent, 'tst1.txt'),
      yaml2 = combine(parent, 'tst2.yaml'),
      txt2 = combine(child, 'tst2.txt');

  before(() => {
    forceDirectory(grandChild);
    stringToFile('Hi', yaml1);
    stringToFile('Hello', txt1);
    stringToFile('Hi', yaml2);
    stringToFile('Hello', txt2);
   });

  it('listFiles', () => {
    chkEq([yaml1, txt1, yaml2, txt2].sort(), listFiles(parent).sort());
  });

  it('listFolders', () => {
    chkEq([child, grandChild].sort(), listFolders(parent).sort());
  });


  after(() => deleteDirectory(parent));

});

describe('eachPathNonRecursive', () => {

  let parent = combine(tempFile(), createGuidTruncated(5)),
      child = combine(parent, createGuidTruncated(5) + '_child_txt'),
      grandChild = combine(child, createGuidTruncated(5)),
      yaml1 = combine(parent, 'tst1.yaml'),
      txt1 = combine(parent, 'tst1.txt'),
      yaml2 = combine(parent, 'tst2.yaml'),
      txt2 = combine(child, 'tst2.txt'),
      nameList: string[] = [];

  before(function() {
    forceDirectory(grandChild);
    stringToFile('Hi', yaml1);
    stringToFile('Hello', txt1);
    stringToFile('Hi', yaml2);
    stringToFile('Hello', txt2);
   });

   beforeEach(() => {
     nameList = [];
   });

   function listFile(pathName: string) : void {
     nameList.push(pathName);
   }

  it('only direct children should be visited', () => {
    eachPathNonRecursive(parent, listFile);
    chkEq([child, yaml1, txt1, yaml2].map(fileOrFolderName).sort(), nameList.sort());
  });

  after(function() {
    deleteDirectory(parent);
  });

});


describe('eachFile / eachFolder', () => {

  let parent = combine(tempFile(), createGuidTruncated(5) + 'yaml'),
      child = combine(parent, createGuidTruncated(5) + '_child_txt'),
      grandChild = combine(child, createGuidTruncated(5)),
      yaml1 = combine(parent, 'tst1.yaml'),
      txt1 = combine(child, 'tst1.txt'),
      yaml2 = combine(parent, 'tst2.yaml'),
      txt2 = combine(child, 'tst2.txt'),
      pathList: string[] = [];

  before(function() {
    forceDirectory(grandChild);
    stringToFile('Hi', yaml1);
    stringToFile('Hello', txt1);
    stringToFile('Hi', yaml2);
    stringToFile('Hello', txt2);
   });

   beforeEach(function() {
     pathList = [];
   });

  function listFile(fileName: string, filePath: string) : void {
    pathList.push(filePath);
  }

  function fileFilter(filename: string, filePath: string) {
    return hasText(filename, 'Yaml');
  }

  describe('eachFile', () => {

    it('simple', () => {
      eachFile(parent, listFile);
      chkEq([yaml1, txt1, yaml2, txt2].sort(), pathList.sort());
    });

    it('with filter func', () => {
      eachFile(parent, listFile, fileFilter);
      chkEq([yaml1, yaml2].sort(), pathList.sort());
    });

    it('with glob', () => {
      eachFile(parent, listFile, '**/*.{txt, yaml}');
      chkEq([yaml1, txt1, yaml2, txt2].sort(), pathList.sort());
    });

    it('with glob restricting results', () => {
      eachFile(parent, listFile, '**/*.{txt}');
      chkEq([txt1, txt2].sort(), pathList.sort());
    });

    it('with glob and function', () => {
      eachFile(parent, listFile, (name, path) => hasText(name, '1'), '**/*.txt');
      chkEq([txt1], pathList);
    });

    it('with glob array and function', () => {
      eachFile(parent, listFile, (name, path) => hasText(name, '1'), ['**/*.txt', '**/*.yaml']);
      chkEq([txt1, yaml1], pathList);
    });
  });

  describe('eachFolder', () => {

    const listFolder = (folderName: string, fullPath: string) => {
        pathList.push(fullPath);
    };

    it('simple', () => {
      eachFolder(parent, listFolder);
      chkEq([child, grandChild].sort(), pathList.sort());
    });

    it('eachFile - with filter func', () => {
      eachFolder(parent, listFolder, (dirName, dir) => hasText(dirName, '_child_'));
      chkEq([child], pathList);
    });
  });

  after(function() {
    deleteDirectory(parent);
  });

});

describe('deleteDirectory', () => {

  it('deleteDirectory', () => {
    let parent = combine(tempFile(), createGuidTruncated(5)),
        child = combine(parent, createGuidTruncated(5)),
        tf1 = combine(parent, 'tst'),
        tf2 = combine(child, 'tst');

    forceDirectory(parent);
    forceDirectory(child);
    stringToFile('Hi', tf1);
    stringToFile('Hello', tf2);

    chk(pathExists(tf1));
    chk(pathExists(tf2));

    let delDirs = deleteDirectory(parent, true);
    chk(pathExists(parent));
    chkEq([parent, child, tf1, tf2].sort(), delDirs.sort());

    let delDirs2 = deleteDirectory(parent);
    chkEq(delDirs, delDirs2.sort());

    chkFalse(pathExists(parent));
  });

  it('deleteDirectory - not exist', () => {
    let dir = combine(tempFile(), createGuidTruncated(5)),
        delDirs = deleteDirectory(dir);

    chkEq([], delDirs);
  });

});

describe('clearDirectory', () => {

  it('clearDirectory', () => {
    let parent = combine(tempFile(), createGuidTruncated(5)),
        child = combine(parent, createGuidTruncated(5)),
        tf1 = combine(parent, 'tst'),
        tf2 = combine(child, 'tst');

    forceDirectory(parent);
    forceDirectory(child);
    stringToFile('Hi', tf1);
    stringToFile('Hello', tf2);

    chk(pathExists(tf1));
    chk(pathExists(tf2));

    let delDirs = clearDirectory(parent, true);
    chkEq([child, tf1, tf2].sort(), delDirs.sort());

    let delDirs2 = clearDirectory(parent);
    chk(pathExists(parent));
    chkFalse(pathExists(child));
  });

});

describe('forceDirectory', () => {

  it('forceDirectory', () => {
    let target = combine(tempFile(), createGuidTruncated(5), createGuidTruncated(5));
    let path = forceDirectory(target);
    chk(pathExists(path));
  });

});

describe('fileToObj', () => {

  it('round trip', () => {
    let obj = {hi: 'hi'},
        pth = tempFile('test.yaml');

    toTemp(obj, 'test', false);
    let actual = fileToObj(pth);
    chkEq(obj, actual);
  });

});

describe('special dirs / round trip', () => {

  function roundTripTest<T>(save: (a:any, s:string) => string, load: (s:string) => T, pathFragment: string, extension?: string) {
    let obj = {
      name: 'Betty Boo',
      age: 20
    }

    const FILE_NAME = 'testFile';
    let path = save(obj, FILE_NAME);
    chkHasText(path, pathFragment);
    chk(pathExists(path));
    if (extension != null){
      chkEq(extension, fileExtension(path));
    }

    let actual = load(FILE_NAME);
    chkEq(obj, actual);
    deleteFile(path);
  }

  it('from / to temp', () => {
    roundTripTest(toTemp, fromTemp, 'temp', '.yaml');
  });

  it('from / to testData', () => {
    roundTripTest(toTestData, fromTestData, 'testData');
  });

  it('from / to mock', () => {
    roundTripTest(toMock, fromMock, 'mock');
  });

  it('from / to log', () => {
    roundTripTest(toLogDir, fromLogDir, 'log');
  });

});

describe('tempFileExists', () => {

  it('simple round trip', () => {
    let filelName = 'Exists.yaml',
        path = toTemp('Blahhh', filelName, false);
    chk(tempFileExists(filelName));
    deleteFile(path);
    chkFalse(tempFileExists(filelName));
  });

});

describe('delete file', () => {

  let tempPath = tempFile('blah.txt');
  it('simple delete', () => {
    stringToFile('blah', tempPath);
    chkWithMessage(pathExists(tempPath), 'precheck');
    chkWithMessage(deleteFile(tempPath), 'returns true');
    chkWithMessage(!pathExists(tempPath), 'file gone');
  });

  it('simple delete - no file exists', () => {
    chkWithMessage(deleteFile(tempFile('nonExistantFile')), 'returns true when no file exists');
  });

});

describe('<to / from>TestDataString round trip', () => {

  it('simple round trip', () => {
    toTestDataString('blah', 'blah');
    let actual = fromTestDataString('blah');
    chkEq('blah', actual);
    deleteFile(testDataFile('blah.txt'));
  });


  it('simple round trip different extnesion', () => {
    toTestDataString('blah', 'blah.yaml');
    let actual = fromTestDataString('blah.yaml');
    chkEq('blah', actual);
    deleteFile(testDataFile('blah.yaml'));
  });

});

describe('from / to tempString', () => {

  it('simple round trip full defaults', () => {
    let targ = 'ddasdasqwfcvufts Hi De Hi';
    toTempString(targ);
    chkHasText(fromTempString(), targ);
  });


  let msg = '';
  function logWarning(message?: string, additionalInfo?: string | {}, attr?: LogAttributes): void {
    msg = message == null ? "" : message;
  }

  let mockLogging = {
                        logWarning: logWarning,
                        logError: DEFAULT_LOGGING_FUNCTIONS.logError,
                        log: DEFAULT_LOGGING_FUNCTIONS.log
                      };

  it('check for warnings toTempString', () => {
    setLoggingFunctions(mockLogging);
    try {
      msg = '';
      toTempString('Hi');
      chkHasText(msg, 'Temp file written to');
    } finally {
      setLoggingFunctions(DEFAULT_LOGGING_FUNCTIONS);
    }
  });

  it('check for warnings fromTempString', () => {
    setLoggingFunctions(mockLogging);
    try {
      toTempString('Hi');
      msg = '';
      fromTempString();
      chkHasText(msg, 'Reading temp file');
    } finally {
      setLoggingFunctions(DEFAULT_LOGGING_FUNCTIONS);
    }
  });

  it('check for warnings off', () => {
    setLoggingFunctions(mockLogging);
    try {
      msg = '';
      toTempString('Hi', null, false);
      chkEq(msg, '');
    } finally {
      setLoggingFunctions(DEFAULT_LOGGING_FUNCTIONS);
    }
  });

  it('check for warnings off fromTempString', () => {
    setLoggingFunctions(mockLogging);
    try {
      toTempString('Hi');
      msg = '';
      fromTempString(null, false);
      chkEq(msg, '');
    } finally {
      setLoggingFunctions(DEFAULT_LOGGING_FUNCTIONS);
    }
  });

  it('check rewrite warning', () => {
      toTempString('Hi');
      toTempString('Hi');
      let content = fromTempString();
      chkHasText(content, '!!!!! IF YOU ARE USING THIS FOR DEBUGGING');
  });

});

describe('stringToLogFile', () => {

  it('simple', () => {
    let fileName = createGuidTruncated(8) + '.txt';
    stringToLogFile('Blahhhhh', fileName);
    let content = fileToString(combine(logFile(), fileName));
    chkEq('Blahhhhh', content)
  });

});

describe('stringToFile / fileToString round trips', () => {

  let DEST_FILE : string = tempFile('hello.txt');
  it('happy simple - round trip', () => {
    stringToFile('Hello', DEST_FILE);
    let actual: string = fileToString(DEST_FILE);
    chkEq('Hello', actual)
  });

  it('happy simple - round trip default ext', () => {
    stringToFile('Hello', tempFile('hello1'));
    let actual: string  = fileToString(tempFile('hello1'));
    chkEq('Hello', actual)
  });

  const UTF8_STR: string = 'ĂĂĂĂĂĂĂĂĂĂĂĂĂĂĂĂĂĂĂĂĂ';
  it('utf8 - default', () => {
    stringToFile(UTF8_STR, tempFile('utf8.txt'));
    let actual: string  = fileToString(tempFile('utf8.txt'));
    chkEq(UTF8_STR, actual);
  });

  it('ascii simple round trip', () => {
    stringToFile('Hello there', tempFile('ascii.txt'), CharacterEncoding.ascii);
    let actual: string  = fileToString(tempFile('ascii.txt'), CharacterEncoding.ascii);
    chkEq('Hello there', actual);
  });

  it('ascii from utf8 - expect file to be corrupt', () => {
    stringToFile(UTF8_STR, tempFile('utf8.txt'));
    let actual: string  = fileToString(tempFile('utf8.txt'), CharacterEncoding.ascii);
    chkFalse(areEqual(UTF8_STR, actual));
  });
});

describe('projectSubPathFuncs', () => {

  it('tempFile', () => {
    chkEq(combine(PROJECT_PATH, 'temp', 'myFile.txt'), tempFile('myFile.txt'));
  });

  it('tempFile - empty', () => {
    chkEq(combine(PROJECT_PATH, 'temp'), tempFile());
  });

  it('mockFile', () => {
    chkEq(combine(PROJECT_PATH, 'mocks', 'myFile.txt'), mockFile('myFile.txt'));
  });

  it('mockFile - empty', () => {
    chkEq(combine(PROJECT_PATH, 'mocks'), mockFile());
  });

  it('testDataFile', () => {
    chkEq(combine(PROJECT_PATH, 'testData', 'myFile.txt'), testDataFile('myFile.txt'));
  });

  it('testDataFile - empty', () => {
    chkEq(combine(PROJECT_PATH, 'testData'), testDataFile());
  });

  it('runTimeFiles', () => {
    chkEq(combine(PROJECT_PATH, 'runTimeFiles', 'myFile.txt'), runTimeFile('myFile.txt'));
  });

  it('runTimeFiles - empty', () => {
    chkEq(combine(PROJECT_PATH, 'runTimeFiles'), runTimeFile());
  });

  it('logFile', () => {
    chkEq(combine(PROJECT_PATH, 'logs', 'myFile.txt'), logFile('myFile.txt'));
  });

  it('logFile - empty', () => {
    chkEq(combine(PROJECT_PATH, 'logs'), logFile());
  });


});

describe('projectrDir', () => {

  it('simple check', () => {
    chkEq(PROJECT_PATH, projectDir());
  });

});

describe('Integration - seekFolder', () => {

  it('project folder - exists', () => {

    function isProjectDir(dir: string) {
      let fullPath: string = combine(dir, 'package.json');
      return pathExists(fullPath);
    }

    let projFolder = seekFolder(BASE_FILE, isProjectDir);
    chkEq(PROJECT_PATH, projFolder);
  });

  it('project does not exist', () => {

    function isProjectDir(dir: string) {
      let fullPath: string = combine(dir, 'package.notExists');
      return pathExists(fullPath);
    }

    let projFolder = seekFolder(BASE_FILE, isProjectDir);
    chkEq(null, projFolder);
  });

});

describe('Integration - pathExists', () => {

  it('known file', () => {
    const BASE_DIR: string  = SOURCE_DIR + '\\lib\\FileUtils.ts';
    chk(pathExists(BASE_DIR));
  });

  it('known directory', () => {
    const BASE_DIR: string  = SOURCE_DIR + '\\lib';
    chk(pathExists(BASE_DIR));
  });

  it('known directory trailing backslash', () => {
    const BASE_DIR: string  = SOURCE_DIR + '\\lib\\';
    chk(pathExists(BASE_DIR));
  });

  it('missing file', () => {
    const BASE_DIR: string  = SOURCE_DIR + '\\Blahhhhh.hs';
    chkFalse(pathExists(BASE_DIR));
  });

});
