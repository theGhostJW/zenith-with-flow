// @flow

import Color from "color";
import * as _ from 'lodash';
import * as winston from 'winston';
import * as util from 'util'
import {appendDelim, newLine, capFirst, subStrAfter, toString } from '../lib/StringUtils';
import {fail, objToYaml, debug, def, ensureHasVal, hasValue} from '../lib/SysUtils';
import { nowAsLogFormat, nowFileFormatted } from '../lib/DateTimeUtils';
// force loading of module
import * as fs from 'fs';
import * as path from 'path';

export type PopControl =   "PushFolder" | "PopFolder" | 'NoAction';

export type FullLogAttributes = {
                              additionalInfo: ?string,
                              subType: LogSubType,
                              popControl: PopControl,
                              link: ?string,
                              callstack: any
                            };

export type LogAttributes = $Supertype<FullLogAttributes>

function defAttributes(): LogAttributes {
  return {
    subType: 'Message'
  };
}

export const log : LogFunction = (message: string, additionalInfo: ?string, attr: ?LogAttributes) => globaLoggingFunctions.log(message, additionalInfo, attr);
export const logWarning : LogFunction = (message: string, additionalInfo: ?string, attr: ?LogAttributes) => globaLoggingFunctions.logWarning(message, additionalInfo, attr);
export const logError: LogFunction = (message: string, additionalInfo: ?string, attr: ?LogAttributes) => globaLoggingFunctions.logError(message, additionalInfo, attr);
export const logLink = (message: string, link: string, additionalInfo: ?string, attrs: ?LogAttributes) => {
  attrs = attrs == null ? {} : attrs;
  attrs.link = link;
  globaLoggingFunctions.log(message + ': ' + link, additionalInfo, attrs);
}

export const notImplementedWarning = (str: ?string) => logWarning(str == null ? 'NOT IMPLEMENTED' : 'NOT IMPLEMENTED: ' + str);

const specialMessage = (subType: LogSubType, popControl: PopControl = 'NoAction'): LogFunction => specialLog(subType, log, popControl);
const specialError = (subType: LogSubType, popControl: PopControl = 'NoAction'): LogFunction => specialLog(subType, logError, popControl);

export const pushLogFolder = (folderLabel: string) => specialMessage('Message', 'PushFolder')(folderLabel);
export const popLogFolder = () => specialMessage('Message', 'PopFolder')('Pop Folder');
export const expectDefect = (defectInfo: string) => specialMessage('StartDefect')(appendDelim('Defect Expected', ': ', defectInfo));
export const endDefect = () => specialMessage('EndDefect')('End Defect');
export const logIterationSummary = (summary: string) => specialMessage('Summary')(summary);
export const logException = (message: string, exceptionObj: any) =>
                                                                  logError(message,
                                                                      toString(exceptionObj),
                                                                      {
                                                                       additionalInfo: toString(exceptionObj),
                                                                       subType: 'Exception',
                                                                       popControl: 'NoAction',
                                                                       callstack: exceptionObj.stack
                                                                     }
                                                                    );

export const logFilterLog = (filterLog: {[string]: string}) => specialMessage('FilterLog')('Filter Log', objToYaml(filterLog));
export const logStartRun = (runName: string, runConfig: mixed) => specialMessage('RunStart', 'PushFolder')(
                                                                                                      `Test Run: ${runName}`,
                                                                                                       objToYaml(runConfig));

export const logEndRun = (runName: string) => specialMessage('RunEnd', 'PopFolder')(`End Run: ${runName}`);

export const logStartTest = (id: number, testName: string, when: string, then: string, testConfig: mixed) => specialMessage('TestStart', 'PushFolder')(
                                                                                                      `Test: ${id}: ${testName} - When ${when} then ${then}`,
                                                                                                       objToYaml(testConfig));

export const logEndTest = (id: number, testName: string) => specialMessage('TestEnd', 'PopFolder')(`End Test ${id} : ${testName}`, objToYaml({id: id, testName: testName}));

export const logStartIteration = (id: number, testName: string, when: string, then: string) => specialMessage('IterationStart', 'PushFolder')(
                                                                                                      `Iteration: ${id}: ${testName} - When ${when} then ${then}`,
                                                                                                       objToYaml({
                                                                                                                  id: id,
                                                                                                                  testName: testName,
                                                                                                                  when: when,
                                                                                                                  then: then
                                                                                                                }));

export const logEndIteration = (id: number) => specialMessage('IterationEnd', 'PopFolder')(`End Iteration ${id}`, objToYaml({id: id}))

export type LogFunction = (message: string, additionalInfo: ?string, attrs: ?LogAttributes) => void

export type LoggingFunctions = {
   log: LogFunction,
   logWarning: LogFunction,
   logError: LogFunction
}

export type LogSubType = "Message" |
                          "FilterLog" |
                          "RunStart" |
                          "TestStart" |
                          "IterationStart" |
                          "IterationEnd" |
                          "TestEnd" |
                          "Summary" |
                          "RunEnd" |
                          "StartDefect" |
                          "EndDefect" |
                          "Exception" |
                          "CheckPass" |
                          "CheckFail";

function specialLog(subType: LogSubType, baseFunction: LogFunction, popControl: PopControl = 'NoAction'): LogFunction {
  return function logSpecial(message: string, additionalInfo: ?string, attr: ?LogAttributes) {
    attr = attr == null ? {} : attr;
    attr.subType = subType;
    attr.popControl = popControl;
    baseFunction(message, additionalInfo, attr);
  }
}


export const logCheckFailure: LogFunction = specialError('CheckFail');
export const logCheckPassed: LogFunction = specialMessage('CheckPass');

const isCheckPointSubType = (subType: ?LogSubType) =>  subType != null && ['CheckFail', 'CheckPass'].includes(subType);

function consoleLog(label: string) : LogFunction {
  return function logWithlabel (message: string, additionalInfo: ?string, attr: ?LogAttributes) : void {
    let fullMessage = _.toUpper(label) + ': ' + message;
    console.log(appendDelim(fullMessage, newLine(), additionalInfo));
  }
}

export const PLAIN_CONSOLE_LOGGING_FUNCTIONS: LoggingFunctions = {
   log: consoleLog('message'),
   logWarning: consoleLog('warning'),
   logError: consoleLog('error')
}

/*===================  Winston Logging  ========================*/



 var CustomLogger = winston.transports.CustomLogger = function (options: {}) {
   //
   // Name this logger

   //$FlowFixMe
   this.name = options.name;

   //
   // Set the level from your options
   //
   this.level = options.level || 'info';
   this.timestamp = options.timestamp || nowAsLogFormat;

   //$FlowFixMe
   this.fd = fs.openSync(options.filename, 'w+');

   //
   // Configure your storage backing as you see fit
   //
 };

 //
 // Inherit from `winston.Transport` so you can take advantage
 // of the base functionality and `.handleExceptions()`.
 //
 util.inherits(CustomLogger, winston.Transport);

 CustomLogger.prototype.log = function (level, msg, meta, callback) {
   //
   // Store this message and metadata, maybe use some custom logic
   // then callback indicating success.

   let logMessage = formatFileLog({
     timestamp: this.timestamp,
     level: level,
     message: msg,
     meta: meta
   });

   //$FlowFixMe
   fs.write(this.fd, logMessage + newLine(), (err, fd) => {
    // => [Error: EISDIR: illegal operation on a directory, open <directory>]
   });

   callback(null, true);
 };


export const logger = newWinstton();


function newWinstton() {
  if (logger) {
    logger.close();
  }

  return new (winston.Logger)({
    transports: [
      consoleLogger(),
      fileLogger('latest.raw.yaml'),
      fileLogger(`log ${nowFileFormatted()}.raw.yaml`)
    ]
  });
}

function deleteRecreateFile(filePath: string) {
  if (fs.existsSync(filePath)) {
    console.log(filePath);
    fs.unlinkSync(filePath);
  }
  fs.writeFileSync(filePath, '');
}

export function consoleLogger() {
  return new (winston.transports.Console)({
      timestamp: nowAsLogFormat,
      colorize: true,
      level: 'info',
      formatter: formatConsoleLog
    });
}


export function fileLogger(fileNameNoPath: string) {
  let filePath = logFile(fileNameNoPath);
  return new (winston.transports.CustomLogger)({
      name: fileNameNoPath,
      timestamp: nowAsLogFormat,
      filename: filePath,
      level: 'info',
      colorize: true,
      json: false,
      options: {flags: 'a'},
      formatter: formatFileLog
    });
}



// don't know how to call directly as modules aren't loaded if call in FileUtils
// when winston is loading

function logFile(fileName: string): string {
  return path.join(projectDirDuplicate(), 'logs', fileName);
}

function projectDirDuplicate() : string {
  const SENTINAL_PROJECT_FILE_DUPLICATE: string = 'package.json';
  let tried = [];
  function isProjectDir(dir : string): boolean {
    let fullPath = path.join(dir, SENTINAL_PROJECT_FILE_DUPLICATE);
    tried.push(fullPath);
    return fs.existsSync(fullPath);
  }

  let seedName = module.filename,
    projFolder = seekFolderDuplicate(seedName, isProjectDir);

  return ensureHasVal(projFolder, `Cannot find project file path when searching up from: ${seedName} - tried: ${tried.join(', ')}`);
}


function seekFolderDuplicate(startFileOrFolder : string, pathPredicate : (filePath : string) => boolean) :
  ? string {
    return hasValue(startFileOrFolder)
      ? pathPredicate(startFileOrFolder)
        ? startFileOrFolder
        : _.isEqual(path.dirname(startFileOrFolder), startFileOrFolder)
          ? null
          : seekFolderDuplicate(path.dirname(startFileOrFolder), pathPredicate): null;
  }

/*
 It's general properties are: timestamp, level, message, meta. Depending on the transport type, there may be additional properties.
 */
function formatFileLog(options) {
  let meta = options.meta;
  let logItem = {
    timestamp: options.timestamp(),
    level: options.level,
    subType: meta.subType,
    popControl: meta.popControl,
    message: options.message,
    additionalInfo: meta.additionalInfo,
    link: meta.link,
    callstack: meta.callstack == null ?  meta.callstack : subStrAfter(meta.callstack, 'Error\n')
  }
  return objToYaml(logItem) + '-------------------------------';
}

function formatConsoleLog(options) {
  // Return string will be passed to logger.
  let meta = options.meta,
      header = isCheckPointSubType(meta.subType) ? options.message : appendDelim(capFirst(options.level), ': ', options.message);
  return winston.config.colorize(options.level, appendDelim(header , newLine(), def(options.meta, {}).additionalInfo));
}

// error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5
const LOG_LEVELS = {
  error: 0,
  warn: 1,
  info: 2
};

type LogLevel = $Keys<typeof LOG_LEVELS>;

type WinstonLogFunc = (LogLevel, string, {}) => void;

export const DEFAULT_LOGGING_FUNCTIONS: LoggingFunctions = {
   log: logFunction('info', false),
   logWarning: logFunction('warn', true),
   logError: logFunction('error', true)
}

let winstonLogFuncs = {
  error: logger.error,
  warning: logger.warn,
  message: logger.info
}

function logFunction(level: LogLevel, callStack: boolean) : LogFunction {

  return function logWithlabel (message: string, additionalInfo: ?string, attrs: ?LogAttributes) : void {
    attrs = attrs == null ? defAttributes() : attrs;
    let meta: LogAttributes = _.clone(attrs);
    meta.additionalInfo = additionalInfo;
    if (callStack) {
      meta.callstack = new Error().stack;
    }

    logger.log(level, message, meta);
  }

}

let globaLoggingFunctions: LoggingFunctions = DEFAULT_LOGGING_FUNCTIONS;

export function setLoggingFunctions(loggingFunctions: LoggingFunctions): void {
  globaLoggingFunctions = loggingFunctions;
}
