// @flow


export {
  INTERACT_SOCKET_NAME,
  clientEmit
} from './lib/SeleniumIpcProtocol';

export type {
  Protocol
} from './lib/SeleniumIpcProtocol';

export {
  chkWithMessage,
  chk,
  chkHasText,
  chkFalse,
  chkEq,
  chkEqJson,
  chkExceptionText,
  chkException
} from './lib/AssertionUtils';

export {
  check,
  checkFalse,
  checkEqual,
  checkTextContainsFragments,
  checkTextContains,
  checkText
} from './lib/CheckUtils';

export {
  LOG_TO_SEC_FORMAT,
  LOG_FILE_MS_SEC_FORMAT,
  SHORT_DATE_TIME,
  DATE_TIME_HYPHENATED_MS,
  SHORT_DATE_TIME_MS,
  SHORT_DATE,
  testFormatter,
  duration,
  durationFormatted,
  nowAsLogFormat,
  nowFormatted,
  timeToShortDateTimeHyphenatedMs,
  timeToFormattedMs,
  timeToSQLDateTimeSec,
  nowFileFormatted,
  toMoment,
  strToMoment,
  now,
  today,
  time,
  date,
  datePlus,
  todayPlus
} from './lib/DateTimeUtils';

export type {
  FileFilterFunc,
  FileFilterGlobs
} from './lib/FileUtils';

export {
  eachLine,
  fileLastModified,
  copyFile,
  relativeToAbsolute,
  relativePath,
  zipAll,
  unzipAll,
  toTempString,
  fileOrFolderName,
  fileOrFolderNameNoExt,
  fromTempString,
  toTestDataString,
  eachPathNonRecursive,
  listFolders,
  listFiles,
  eachFolder,
  parentDir,
  eachFile,
  fileToObj,
  fromTestDataString,
  deleteFile,
  fromTestData,
  fromLogDir,
  fromMock,
  toTestData,
  toMock,
  objToFile,
  toLogDir,
  stringToLogFile,
  toTemp,
  fromTemp,
  deleteDirectory,
  clearDirectory,
  forceDirectory,
  defaultExtension,
  changeExtension,
  fileExtension,
  fileToString,
  stringToFile,
  fileToLines,
  linesToFile,
  tempFile,
  testCaseFile,
  mockFile,
  testDataFile,
  runTimeFile,
  logFile,
  logFileBase,
  combine,
  seekFolder,
  pathExists,
  projectDir,
  projectSubDir,
  TEMPLATE_BASE_FILE,
  PATH_SEPARATOR
} from './lib/FileUtils';

export {
  lwrFirst,
  objToJson,
  propsObjectStringFromXml,
  convertXmlToSimpleTemplate,
  loadSectionedTemplate,
  removeSection,
  templateSectionParts,
  templateParts,
  templateLoader,
  loadTemplate,
  loadTemplatePositional,
  trimLines,
  sameText,
  subStrBetween,
  trimChars,
  parseCsv,
  DEFAULT_CSV_PARSE_OPTIONS,
  stringToArray,
  arrayToString,
  trim,
  transformGroupedTable,
  stringToTableMap,
  stringToGroupedTableMap,
  stringToTable,
  stringToGroupedTableDefinedTabSize,
  stringToGroupedTable,
  stringToTableLooseTyped,
  stringToGroupedTableLooseTyped,
  stringToGroupedTableLooseTypedDefinedTabSize,
  bisect,
  subStrBefore,
  subStrAfter,
  capFirst,
  createGuid,
  createGuidTruncated,
  standardiseLineEndings,
  newLine,
  lowerFirst,
  upperFirst,
  upperCase,
  lowerCase,
  appendDelim,
  replaceAll,
  wildCardMatch,
  toString,
  startsWith,
  endsWith,
  hasText,
  tryEncodings,
  formatXml
}  from './lib/StringUtils';

export type {
  CharacterEncoding,
  XmlFormatOptions
}  from './lib/StringUtils';

export {
  xmlToObj,
randomInt,
randomInt0,
executeFile,
executeRunTimeFile,
killTask,
waitRetry,
listProcesses,
functionNameFromFunction,
valueTracker,
deepMapValues,
deepReduceValues,
flattenObj,
hostName,
setParts,
forceArray,
autoType,
objToYaml,
yamlToObj,
cast,
debug,
def,
areEqual,
fail,
failInfoObj,
ensureReturn,
ensure,
ensureHasVal,
ensureHasValAnd,
isPOJSO,
seekInObj,
setInObjn,
setInObj1,
setInObj2,
setInObj3,
setInObj4,
seekInObjNoCheck,
seekManyInObj,
seekInObjWithInfo,
seekInObjNoCheckWithInfo,
seekAllInObjWithInfo,
seekAllInObj,
seekManyInObjWithInfo,
isNullEmptyOrUndefined,
isDefined,
isUndefined,
hasValue,
all,
stringConvertableToNumber,
xOr,
areEqualWithTolerance,
reorderProps,
fillArray,
delay,
isFrameworkProject
}  from './lib/SysUtils';

export type {
  TaskListItem,
  MixedSpecifier,
  Predicate,
  IndexSpecifier
}  from './lib/SysUtils';

export type {
  PopControl,
  FullLogAttributes,
  LogAttributes,
  LogFunction,
  LoggingFunctions,
  LogSubType,
  LogEntry,
  LogLevel
}  from './lib/Logging';

export {
  FOLDER_NESTING,
  logLink,
  notImplementedWarning,
  pushLogFolder,
  popLogFolder,
  expectDefect,
  endDefect,
  log,
  logStartInteraction,
  logEndInteraction,
  logPrepValidationInfoStart,
  logPrepValidationInfoEnd,
  logStartIterationSummary,
  logIterationSummary,
  logValidationStart,
  logValidationEnd,
  logStartValidator,
  logEndValidator,
  logException,
  logFilterLog,
  logStartRun,
  logEndRun,
  logStartTest,
  logEndTest,
  logStartIteration,
  logEndIteration,
  logCheckFailure,
  logCheckPassed,
  PLAIN_CONSOLE_LOGGING_FUNCTIONS,
  logger,
  lowLevelLogging,
  latestRawPath,
  timeStampedRawPath,
  timeStampedLogDir,
  consoleLogger,
  fileLogger,
  RECORD_DIVIDER,
  LOG_LEVELS,
  DEFAULT_LOGGING_FUNCTIONS,
  setLoggingFunctions
}  from './lib/Logging';

/* ====================================================================== */
/* ====================================================================== */
/* ====================================================================== */

export {
  defaultTestRunner,
  filterTestItems,
  itemFilter,
  lastItem,
  matchesProps,
  idFilter,
  allItems,
  testRun,
  register,
  loadAll,
  runTestItem,
  filterTests
}  from './lib/TestRunner';

export type {
  MockFileNameFunction,
  EndPointInfo,
  ItemFilter,
  BaseRunConfig,
  TestFilter,
  RunParams,
  GenericValidator,
  BaseCase,
  BaseItem,
  ItemRequired,
  BaseTestConfig,
  NamedCase,
  FilterResult,
  TestRunner,
  ItemRunner
}  from './lib/TestRunner';

export {
  elementsToFullMock,
  EXECUTING_INTERACTOR_STR,
  hasIssues,
  initalState,
  defaultLogParser,
  parseLog,
  logSplitter
}  from './lib/LogParser';

export type {
  LogIterationConfig,
  Iteration,
  OutOfTestIssues,
  ErrorsWarningsDefects,
  RunElementType,
  StateStage,
  IssuesList,
  RunSummary,
  FullSummaryInfo,
  RunStats,
  WithScript,
  TestSummary,
  TestStats,
  RunState
}  from './lib/LogParserTypes';

export {
  testPrivate,
  filterLogText,
  script,
  iteration,
  outOfTestError,
  summaryBlock
}  from './lib/LogFormatter';

export {
  webUtilsTestLoad,
  checkStartSelenium,
  startSelenium,
  seleniumRunning,
  seleniumStatus
} from './lib/WebUtils';
