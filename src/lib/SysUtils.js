// @flow

import * as _ from 'lodash';
import * as deep from 'lodash-deep';
import {toString, startsWith, endsWith, appendDelim, wildCardMatch, hasText,
      subStrBetween, stringToArray, replaceAll, newLine, lwrFirst} from '../lib/StringUtils';
import * as os from 'os';
import * as yaml from 'js-yaml';
import moment from 'moment';
import child_process from 'child_process';
import { now } from '../lib/DateTimeUtils';
import { log, logException } from '../lib/Logging';
import { runTimeFile, pathExists, projectSubDir, TEMPLATE_BASE_FILE } from '../lib/FileUtils';
import { parseString } from 'xml2js'
import deasync from 'deasync'

// https://stackoverflow.com/questions/30579940/reliable-way-to-check-if-objects-is-serializable-in-javascript
export function isSerialisable(obj: mixed): boolean {

  const nestedSerialisable = ob => (_.isPlainObject(ob) || _.isArray(ob))  &&
                                    _.every(cast(ob), isSerialisable);

  return  _.overSome([
            _.isUndefined,
            _.isNull,
            _.isBoolean,
            _.isNumber,
            _.isString,
            nestedSerialisable
          ])(obj)
}

// https://stackoverflow.com/questions/13227489/how-can-one-get-the-file-path-of-the-caller-function-in-node-js
// assumes javascript extension .js
export function getCallerString(filePathOnly: boolean = false): string {
  let stack = getStackStrings();
  // remove getCallerString
  // remove caller
  let result = stack[2];
  return filePathOnly ? subStrBetween(result, ' (', '.js:', true) + '.js' : result;
}

// https://stackoverflow.com/questions/13227489/how-can-one-get-the-file-path-of-the-caller-function-in-node-js
export function getStackStrings(): Array<string> {
  // Save original Error.prepareStackTrace - don't know what this is
  let origPrepareStackTrace = Error.prepareStackTrace,
      stack = [];
  try {
    Error.prepareStackTrace = (_, stack) => stack;
    // Create a new `Error`, which automatically gets `stack`
    stack = cast(new Error().stack);
    stack.shift();
  }  finally {
    Error.prepareStackTrace = origPrepareStackTrace;
  }
  return stack.map(s => s.toString())
}


export function isFrameworkProject(): boolean {
  return !pathExists(projectSubDir(TEMPLATE_BASE_FILE, false))
}

export function xmlToObj(xml: string): {} {

  let result;
  parseString(xml, {explicitArray: false, tagNameProcessors: [lwrFirst], attributeNameProcessors: [lwrFirst]}, (err, rslt) => {
    if (err != null){
      throw err;
    }
    result = rslt;
  });
  waitRetry(() => result != null, 60000, () => {}, 0);
 return cast(result);
}

export function randomInt(lwrBound: number, upperBound: number) {
  return _.random(Math.trunc(lwrBound), Math.trunc(upperBound));
}

export function randomInt0(upperBound: number) {
  return randomInt(0, upperBound);
}

export function translateErrorObj(e: any) : any {
  let errObj;
  if (_.isObject(e) && hasValue(e.stack)) {
    errObj = {
      name: e.name,
      message: e.message,
      stack: e.stack
    }
  }
  else {
    errObj = e;
  }
  return errObj;
}


export type TaskListItem = {
  imageName: string,
  pid: number,
  sessionName: string,
  session: number,
  memUsage: number
}

// may need more work split asynch and handle stdIn / out and error
export function executeFile(path: string, async: boolean = true) {
  if (async) {
    log(`executing ${path} async`);
    child_process.exec(path);
  } else {
    log(`executing ${path} synch`);
    child_process.execSync(path);
  }
}

export function executeRunTimeFile(fileNameNoPath: string, async: boolean = true) {
  let target = runTimeFile(fileNameNoPath);
  ensure(pathExists(target), 'file does not exist: ' + target);
  executeFile(runTimeFile(fileNameNoPath), async);
}

export function killTask(pred : (TaskListItem) => boolean, timeoutMs: number = 10000): boolean {
  let taskTokill = listProcesses().find(pred),
      result = false;

  if (taskTokill != null) {
    result = true;
    log(`Killing task pid: ${toString(taskTokill)}`);
    child_process.execSync(`taskkill /im ${taskTokill.pid} /t /f`, {timeout: timeoutMs})
  }

  if (result) {
    killTask(pred, timeoutMs);
  }
  return result;
}

export function delay(ms: number) {
  deasync.sleep(ms);
}

export function waitRetry(isCompleteFunction: () => boolean, timeoutMs: number = 10000, retryFuction: () => void = () => {}, retryPauseMs: number = 100): boolean {

  let endTime = now().add(timeoutMs, 'ms'),
      complete = false;

  function done() {
    complete = isCompleteFunction();
    return complete;
  }

  while (!done() && now().isBefore(endTime)) {
    delay(retryPauseMs);
    retryFuction();
  };

  return complete;
}

export function listProcesses(): Array<TaskListItem> {
  let taskList = child_process.execSync('tasklist', {timeout: 30000}).toString();
  return _parseTaskList(taskList);
}

export function _parseTaskList(taskList: string): Array<TaskListItem>{
  let lines = taskList.split('\n').filter((s) => s.trim() != ''),
      headerLineIdx = lines.findIndex((s) => s.startsWith('=')),
      headerLine = lines[headerLineIdx],
      headerLineSegmentLens = (headerLine == null ? [] : headerLine.split(' ')).map((s) => s.length),
      headerLineIdxs = headerLineSegmentLens.reduce((accum, len, idx) => {
        let start = idx > 0 ? accum[idx - 1] : 0;
        start = start + idx; // single space separators
        accum.push(start + len);
        return accum;
      },
      []
    );

  ensure(headerLineIdxs.length == 5, 'unexpected count of header lines');

  let processLines = lines.slice(headerLineIdx + 1);
  const convertLine = (s) => {
    return {
      imageName: s.slice(0, headerLineIdxs[0]).trim(),
      pid: parseInt(s.slice(headerLineIdxs[0], headerLineIdxs[1])),
      sessionName: s.slice(headerLineIdxs[1], headerLineIdxs[2]).trim(),
      session: parseInt(s.slice(headerLineIdxs[2], headerLineIdxs[3])),
      memUsage: parseInt(replaceAll(s.slice(headerLineIdxs[3], headerLineIdxs[4]), ',', ''))
    }
  }
  return processLines.map(convertLine);
}

export function functionNameFromFunction(func: mixed) : string {
  var str = toString(func);
  return subStrBetween(str, 'function', '(').trim();
}

export function valueTracker<T>(mapName: string, generatorFunction: (...args: any) => T){
  let hashMap : {[string]: T} = {};

  function newVal(key: string, ...args: any): T {
    ensure(isUndefined(hashMap[key]), 'Name for key: ' + key + ' already created in ' + mapName);
    var result = generatorFunction(...args);
    hashMap[key] = result;
    return result;
  }

  function getVal(key: string): T{
    var result = hashMap[key];
    ensure(hasValue(result), 'No instance of value for key: ' + key + ' in ' + mapName);
    return result;
  }

  function getOrNew(key: string, ...args: Array<any>): T {
    var result = hashMap[key];
    return isUndefined(result) ? newVal(key, ...args) : result;
  }

  return {
          getVal: getVal,
          newVal: newVal,
          getOrNew: getOrNew
         };
}

/*
_.deepMapValues(object, function(value, path){
    return path + ' is ' + value)
});
 */
export const deepMapValues = deep.deepMapValues;

export function deepReduceValues<T>(obj: {[string|number]: any}, func: (accum: T, val: any, propertyPath: string, baseObj: {[string|number]: any}) => T, accum: T): T{
  // func(accum, value, propertyPath, baseObj)
  let thisAccum = accum;
  function executeFunc(value, propertyPath){
    thisAccum = func(thisAccum, value, propertyPath, obj);
  }

  deepMapValues(obj, executeFunc);
  return thisAccum;
}

export function flattenObj(obj: {[string|number]: any}, allowDuplicateKeyOverwrites: boolean = false): {[string|number]: any} {

  var result: {[string|number]: any} = {}
  function flattenKey(val: any, path: string): void {
    let lastDot = path.lastIndexOf('.'),
         key = lastDot == -1 ? path : path.slice(lastDot + 1);
    ensure(allowDuplicateKeyOverwrites || !hasValue(result[key]), 'the key: ' + key + ' would appear more than once in the flattened object');
    result[key] = val;
  }
  deepMapValues(obj, flattenKey);
  return result;
}

export const hostName = () => os.hostname();

export function setParts<T>(arLeftSet: Array<T>, arRightSet: Array<T>): [Array<T>, Array<T>, Array<T>] {

  function intersect(ar1, ar2){
    var inIntersection = [],
        uniqueToFirst = [];

    function isInar2(item){
      function equalsTarg(ar2Item){
        return areEqual(ar2Item, item);
      }
      return _.find(ar2, equalsTarg)
    }

    function clasify(ar1Item){
      var pushTo = isInar2(ar1Item) ? inIntersection : uniqueToFirst;
      pushTo.push(ar1Item);
    }

    _.each(ar1, clasify);
    return [uniqueToFirst, inIntersection];
  }

  var leftCommon = intersect(arLeftSet, arRightSet),
      rightCommon = intersect(arRightSet, arLeftSet);


  return [leftCommon[0], leftCommon[1], rightCommon[0]];
}


export function forceArray<T>(...args: Array<Array<T> | T> ): Array<T> {

  function forceArraySingleVal(val){
     return isUndefined(val) ? [] :
             _.isArray(val) ? val : [val];
  }

 return _.chain(args)
         .map(forceArraySingleVal)
         .flatten(true)
         .value();
}

export function autoType(arr: Array<{[string]: string}>) : Array<{[string]: any}> {

  let exclusions: Array<string> = arr.length === 0 ? [] : _.reduce(
                                                            arr[0],
                                                            (accum, val, key) => startsWith(val, '`') ? accum.concat(key) : accum,
                                                            []
                                                          );

  function nullDotProps(obj: {[string]: string}){
    return dotToNulls(((obj: any): {}), exclusions)
  }

  var result = arr.map(nullDotProps);

  function validateParsers(parsers, obj){

    function compatitableParser(remainingParsers, key){
      function canParse(parser){
        var result = !exclusions.includes(key) && parser.canParse(obj[key]);
        return result;
      }
      return _.filter(remainingParsers, canParse);
    }

    var result = _.mapValues(parsers, compatitableParser);
    return result;
  }

  if (result.length > 0){
    var parsers = _.mapValues(result[0], _.constant(allParsers()));
    var validParsers = _.reduce(result, validateParsers, parsers);
    function firstOrNull(arr){
      return arr.length > 0 ? arr[0] : null;
    }
    validParsers = _.mapValues(validParsers, firstOrNull);

    function parseFields(obj){
      function parseField(val, key){
        var psr = validParsers[key];
        return _.isNull(psr) ? val : psr.parse(val);
      }
      return _.mapValues(obj, parseField);
    }

    result = _.map(result, parseFields);

    let rec0 = result[0];

    function mutateBackTickedprops(val, key, obj) {
      obj[key] = typeof val == 'string' && startsWith(val, '`') ? val.slice(1, val.length) : val;
    }

    // mutates underlying values
    _.mapValues(rec0, mutateBackTickedprops);
  }

  return result;
}

function allParsers(){
  return _.map(
               [
                  boolParser(),
                  // check number first as moment parses
                  // number as date
                  numberParser(),
                  dateParser()
                ],
               wrapParser
             );
}

function wrapParser(parser){
  return {
    name: parser.name,
    canParse: function(val){
                      return val == null || _.isString(val) && parser.canParse(val);
                    },
    parse:  function(val){
                      return val == null  || !_.isString(val) ? val : parser.parse(val);
                    }
  };
}

function boolParser(){
  const BOOL_CHARS = ['Y', 'N', 'T', 'F'];

  function parse(val){
     return _.includes(['Y', 'T'], val);
  }

  function canParse(val){
    return _.includes(BOOL_CHARS, val);
  }

  return {
      name: 'boolParser',
      canParse: canParse,
      parse: parse
  }
}

function numberParser(){

  function parse(val){
     return val.search('.') > -1 ? parseFloat(val): parseInt(val);
  }

  function canParse(val){
    return stringConvertableToNumber(val);
  }

  return {
      name: 'numberParser',
      canParse: canParse,
      parse: parse
  }
}

function dateParser(){

  // assumes null and str check already done
  function isNumber(str){
    var els = str.split('');
    function isNumChar(chr){
      return chr.charCodeAt(0) > 47 && chr.charCodeAt(0) < 58;
    }

    var nonNums = _.reject(els, isNumChar);
    return nonNums.length < 2;
  }

  function parse(val){
     return moment(val, 'YYYY-MM-DD');
  }

  function canParse(val){
    let result = false,
        pr = null;

    try {
      pr = parse(val);
      result = true;
    }
    catch (e) {
      if (e.message !== 'The string cannot be parsed.'){
        throw(e);
      }
    }

    // wierd hasValue error when use hasvalue in the return
    return result && pr != null && pr.isValid();
  }

  return {
      name: 'dateParser',
      canParse: canParse,
      parse: parse
  }
}

function dotToNulls(obj: {}, exclusions: Array<string>): {} {
  function dotToNull(val, key){
    return (val == '.') && !exclusions.includes(key) ? null : val;
  }
  return _.mapValues(obj, dotToNull);
}

export function objToYaml(obj: mixed, useRefs: boolean = false) : string {
  return ((yaml.safeDump(obj, {skipInvalid: true, noRefs: !useRefs }): any): string) ;
}

function trimLine1Leading(str: string): string {
  let lines = str.split(newLine()),
      line0 = lines.find(s => s.trim() !== '');

  if (line0 != null){
    let len = line0.length,
        n = 0;

    while (n < len && line0[n] == ' ') {
      n++;
    }

    if (n == 0){
      return str;
    }
    else {
      let prefix = _.repeat(' ', n);

      function ensureEmpty(str, idx) {
        ensure(str.trim() == '', `Bad padding line ${idx}: stars with less spaces than leading line [${str}]`);
        return str;
      }

      function trimLine(line, idx) {
        return line.startsWith(prefix) ? line.slice(n) : ensureEmpty(line, idx);
      }
      return lines.map(trimLine).join(newLine());
    }
  }
  else {
    return str;
  }
}

export function yamlToObj<T>(yamlStr: string, trimLeadingSpaceBaseOnFirstLine: boolean = false): T {
  yamlStr = trimLeadingSpaceBaseOnFirstLine ? trimLine1Leading(yamlStr): yamlStr;
  let untypedVal: any = yaml.safeLoad(yamlStr);
	return (untypedVal: T);
}

export function cast<T>(targ: any): T {
  return (targ: T);
}

export function debug<T>(msg: T | () => T, label: string = 'DEBUG'): T {
  let msgStr = typeof msg == 'function' ? msg() : msg;
  console.log(appendDelim(_.toUpper(label), ': ', toString(msgStr)));
  return msgStr;
}

export function def <T> (val : ?T, defaultVal: T): T {
    // != null === not null or undefined
  return val == null ? defaultVal : val;
}

export function areEqual <T, U> (val1 : T, val2 : U) : boolean {
  return _.isEqualWith(val1, val2, eqCustomiser);
}

// a fudge to keep the type checker happy
export function fail<T>(description: string, e: any): T {
  let err = e == null ? failInfoObj(description) : translateErrorObj(e);
  logException(description, err);
  throw err;
}

export function failInfoObj(description: string) {
  let err = new Error();
  return {
    message: description,
    callStack: err.stack
  }
}

export function ensureReturn<T>(condition : boolean, successVal: T, failMsg : string = '') : T {
  ensure(condition, failMsg);
  return successVal;
}

export function ensure(condition : boolean, failMsg : string = '') {
  if(!condition) {
    fail('ensure failure - ' + failMsg);
  }
}

export function ensureHasVal<T>(successVal: ?T, failMsg : string = '') : T {
  if(successVal == null) {
    throw new Error('value must not be null or undefined - ' + failMsg);
  }
  return successVal;
}

export function ensureHasValAnd<T>(successVal: ?T, predicate: (T) => boolean, failMsg : string = '') : T {
  let result = ensureHasVal(successVal, failMsg);
  return ensureReturn(predicate(result), result, failMsg);
}

function eqCustomiser <T, U> (val1 : T, val2 : U) : void | boolean {
  return typeof val1 == 'string' && typeof val2 == 'string'
    ? val1.valueOf() == val2.valueOf()
    : undefined;
}

export type MixedSpecifier = string | Predicate | IndexSpecifier | {};

export type Predicate = (val : mixed, key : string | number) => bool;

type ArrayItemPredicate = (val : mixed) => bool;

type FuncSpecifier = (val : any, key : string | number) => any;

export type IndexSpecifier = [number | ArrayItemPredicate];

type SeekInObjResultItem = {
  parent: SeekInObjResultItem | null,
  value: any,
  key: string | number,
  specifiers: Array <FuncSpecifier>
};

function standardiseSpecifier(mixedSpec: MixedSpecifier) : FuncSpecifier {

  // assume predicate
  if(typeof mixedSpec === 'function') {
    return function keyMatch(val : mixed, key : string | number) : any {
      return ((mixedSpec: any) : Predicate)(val, key) ? val : undefined;
    }
  }

  if (typeof mixedSpec == 'string' || typeof mixedSpec == 'number') {
    let matcher = typeof mixedSpec == 'string' && hasText(mixedSpec, '*') ? wildCardMatch : areEqual;
    return function keyMatch(val : mixed, key : string | number) : any {
      return matcher(toString(key), toString(mixedSpec)) ? val : undefined;
    }
  }

  if (isPOJSO(mixedSpec)) {
    return function keyMatch(val : mixed, key : string | number) : any {
      if (isPOJSO(val)) {
        let specObj = ((mixedSpec: any): {}),
            valObj = ((val: any): {}),
            specKeys = _.keys(specObj),
            valKeys = _.keys(valObj);

        function matchesKeys(keys) {

          if (areEqual(keys, [])){
            return true;
          }
          else {
            let [specKey, ...otherSpecKeys] = keys,
                valKey = _.find(valKeys, (vk) => wildCardMatch(vk, specKey, true));

            if (valKey != null){
              let valPropVal = valObj[valKey],
                  specPropVal = specObj[specKey];

              return  _.isString(valPropVal) &&
                      _.isString(specPropVal) &&
                      wildCardMatch(valPropVal, specPropVal)  ||
                          areEqual(valPropVal, specPropVal);
            }
            else {
              return false;
            }
          }
        }
        return matchesKeys(specKeys) ? val : undefined;
      }
      else {
        return undefined;
      }
    }
  }

  // IndexSpecifier / or HOFIndex Specifier
  ensure(_.isArray(mixedSpec) && ((mixedSpec: any): Array<any>).length === 1, 'expect this to be a single item array: ' + toString(mixedSpec));

  let dummy = (val : mixed, key : string | number) => {return undefined},
      indexer : IndexSpecifier = ((mixedSpec : any) : IndexSpecifier),
      item = indexer[0],
      indexerSpec: FuncSpecifier = typeof item == 'function' ? (val: Array<any>) => { return _.find(val, ((item: any): ArrayItemPredicate)); } :
                                    typeof item == 'number' ? (val: Array<any>) => {
                                                                        let idx: number = ((item: any): number);
                                                                        return val.length > idx ? val[idx] : undefined;
                                                                      }  : dummy;

  ensure(indexerSpec !== dummy, 'array indexer must be a single element array of function or integer: [int] or [(val) => bool]');

  return function indexmatch(val : mixed, key : string | number): any {
    return _.isArray(val) ? indexerSpec(val, key) : undefined;
  }
}

type GenerationMatchResult = {
  fullyMatched: Array <SeekInObjResultItem>,
  remainingCandidates: Array <SeekInObjResultItem>
};

type ReducerResult = {
    done: boolean,
    result: GenerationMatchResult
};

function matchFirstSpecifierOnTarget(parent: SeekInObjResultItem, searchType: SearchDirective) : ?GenerationMatchResult {
  let
    baseVal = parent.value,
    specifers = parent.specifiers,
    result = {
      fullyMatched: ([] : Array <SeekInObjResultItem>),
      remainingCandidates: ([] : Array <SeekInObjResultItem>)
    };

  if (specifers.length > 0 &&  typeof baseVal == 'object') {

    let
      base: ReducerResult = {
        done: false,
        result: result
      };

    function resultPartition(accum: ReducerResult, val: mixed, key: string | number) : ReducerResult {
      return partitionResults(parent, searchType, accum, val, key);
    }

    return _.isArray(baseVal) ? resultPartition(base, parent.value, parent.key).result : _.reduce(parent.value, resultPartition, base).result;
  } else {
    return null;
  }
};

export function isPOJSO(val: mixed): boolean {
  return _.isObject(val) &&  !_.isArray(val);
}

function partitionResults(parent: SeekInObjResultItem, searchType: SearchDirective, accum: ReducerResult, val: mixed, key: string | number) : ReducerResult {
  if (accum.done){
    return accum;
  }

  let
    specifiers = parent.specifiers,
    [specifier, ...otherSpecs] = specifiers,
    isLastSpecifier = otherSpecs.length === 0,
    done = false,
    result = accum.result,
    fullyMatched = result.fullyMatched,
    remainingCandidates = result.remainingCandidates,
    matchResult = specifier(val, key),
    matchesThisSpecifier = isDefined(matchResult),
    matchesAllSpecifiers = matchesThisSpecifier && isLastSpecifier;

    function newMatchInfo(val: mixed, key: string | number, specifiers: Array<FuncSpecifier>) : SeekInObjResultItem {
      return {parent: parent, value: val, key: key, specifiers: specifiers};
    };

  if (matchesAllSpecifiers) {
    fullyMatched.push(newMatchInfo(matchResult, key, otherSpecs));
    done = searchType == 'singleton';
  }
  else if (matchesThisSpecifier) {
    remainingCandidates.push(newMatchInfo(matchResult, key, otherSpecs));
  }
  else if (isPOJSO(val)) {
    remainingCandidates.push(newMatchInfo(val, key, specifiers));
  }

  return {
    result: {
      fullyMatched: fullyMatched,
      remainingCandidates: remainingCandidates
    },
    done: done
  };
}

function getResultValues(result: Array <SeekInObjResultItem>): Array<mixed> {
  return result.map((s: SeekInObjResultItem) => s.value);
}

export function seekInObj<T>(target :? {}, specifier: MixedSpecifier, ...otherSpecifiers : Array <MixedSpecifier>): ?T {
  let info = seekInObjWithInfo(target, specifier, ...otherSpecifiers);
  return info == null ? undefined : info.value;
}

export function setInObjn(target : {}, specifiers : Array <MixedSpecifier>, value: mixed): {}{
  return setInObjnPrivate(false, target, specifiers, value);
}

export function setInObj1(target : {}, specifier : MixedSpecifier, value: mixed): {}{
  return setInObjnPrivate(false, target, [specifier], value);
}

export function setInObj2(target : {}, specifier : MixedSpecifier, specifier1 : MixedSpecifier, value: mixed): {}{
  return setInObjnPrivate(false, target, [specifier, specifier1], value);
}

export function setInObj3(target : {}, specifier : MixedSpecifier, specifier1 : MixedSpecifier, specifier2: MixedSpecifier, value: mixed): {}{
  return setInObjnPrivate(false, target, [specifier, specifier1, specifier2], value);
}

export function setInObj4(target : {}, specifier : MixedSpecifier, specifier1 : MixedSpecifier, specifier2: MixedSpecifier, specifier3: MixedSpecifier, value: mixed): {}{
  return setInObjnPrivate(false, target, [specifier, specifier1, specifier2, specifier3], value);
}

function setInObjnPrivate(noCheck: boolean, target : {}, specifiers : Array <MixedSpecifier>, value: mixed) : {} {

  let [spec, ...otherSpecs] = specifiers,
      propInfo = noCheck ?  seekInObjNoCheckWithInfo(target, spec, ...otherSpecs) :  seekInObjWithInfo(target, spec, ...otherSpecs);

  if (propInfo == null){
    fail( 'setInObj matching property not found for specification: ' + _.map(specifiers, toString).join(', '));
  }
  else {
    let parent = propInfo.parent;
    if (parent == null){
      fail('parent is null - this should not happen');
    }
    else if (parent.value == null) {
      fail('parent is null - this should not happen');
    }
    else {
      parent.value[propInfo.key] = value;
    }
  }
  return target;
}

export function seekInObjNoCheck(target :? {}, specifier: MixedSpecifier, ...otherSpecifiers : Array <MixedSpecifier>): ?mixed {
  let result = seekInObjNoCheckWithInfo(target, specifier, ...otherSpecifiers);
  return result == null ? undefined : result.value;
}

export const seekManyInObj = _.flowRight([getResultValues, seekManyInObjWithInfo]); // flowIssues _.flowRight(getResultValues, seekManyInObjWithInfo);

function addressOfSeekResult(seekResult: SeekInObjResultItem) : string {
  let strKey = toString(seekResult.key);
  return strKey === '' || seekResult.parent == null ? strKey :
      appendDelim(addressOfSeekResult(seekResult.parent), '.', strKey);
}

function objectAddresses(allInfo: Array <SeekInObjResultItem>): string {
  return allInfo.map(addressOfSeekResult).join(', ');
}

const SEARCH_DIRECTIVE = {
  includeNested: 2,
  eachBranch: 1,
  singleton: 0
};

type SearchDirective = $Keys<typeof SEARCH_DIRECTIVE>;

export function seekInObjWithInfo(target :? {}, specifier: MixedSpecifier, ...otherSpecifiers : Array <MixedSpecifier>): ?SeekInObjResultItem {
  let allInfo = seekManyInObjWithInfo(target, specifier, ...otherSpecifiers);
  if (allInfo.length === 0){
    return undefined;
  }
  else {
    return ensureReturn(allInfo.length === 1, allInfo[0], 'More than one object matches supplied specifiers: ' + objectAddresses(allInfo));
  }
}

export function seekInObjNoCheckWithInfo(target :? {}, specifier: MixedSpecifier, ...otherSpecifiers : Array <MixedSpecifier>): ?SeekInObjResultItem {
  let allInfo = seekInObjBase(target, 'singleton', specifier, ...otherSpecifiers);
  return allInfo.length === 0 ? null : allInfo[0];
}

export function seekAllInObjWithInfo(target :? {}, specifier: MixedSpecifier, ...otherSpecifiers : Array <MixedSpecifier>): Array<SeekInObjResultItem> {
  return seekInObjBase(target, 'includeNested', specifier, ...otherSpecifiers);
}

export const seekAllInObj = _.flowRight([getResultValues, seekAllInObjWithInfo]); // flow issues _.flowRight(getResultValues, seekAllInObjWithInfo);

export function seekManyInObjWithInfo(target :? {}, specifier: MixedSpecifier, ...otherSpecifiers : Array <MixedSpecifier>): Array<SeekInObjResultItem> {
  return seekInObjBase(target, 'eachBranch', specifier, ...otherSpecifiers);
}

function seekInObjBase(target :? {}, searchType: SearchDirective, specifier: MixedSpecifier, ...otherSpecifiers : Array <MixedSpecifier>): Array<SeekInObjResultItem> {
    if(typeof target != 'object') {
      return [];
    };

    function getNextGeneration(itemResult : SeekInObjResultItem): ?GenerationMatchResult {
      return matchFirstSpecifierOnTarget(itemResult, searchType);
    };

    function pluckFlatten(baseArray, propName): Array <SeekInObjResultItem> {
      let result = _.chain(baseArray)
                          .map(propName)
                          .flatten()
                          .value();
      return ((result: any): Array <SeekInObjResultItem>);
    }


    function widthSearch(generationResult : GenerationMatchResult): Array <SeekInObjResultItem> {
        let
          thisRemaining = _.chain(generationResult.remainingCandidates)
                              .map(getNextGeneration)
                              .compact()
                              .value(),

          remainingCandidates = pluckFlatten(thisRemaining, 'remainingCandidates'),
          fullyMatched  = pluckFlatten(thisRemaining, 'fullyMatched');

        fullyMatched = generationResult.fullyMatched.concat(fullyMatched);

        if (remainingCandidates.length > 0 && (searchType == 'includeNested' || fullyMatched.length === 0)){
          let
            nextParam = {
             fullyMatched: fullyMatched,
             remainingCandidates: remainingCandidates,
             done: false
           };
           return widthSearch(nextParam);
         }
         else {
           return fullyMatched;
         }
    };

    let
      allSpecifiers = [specifier].concat(otherSpecifiers).map(standardiseSpecifier),
      seedResultItem: SeekInObjResultItem = {
        parent: null,
        value: target,
        key: '',
        specifiers: allSpecifiers
      },
      seedResult: GenerationMatchResult = {
        fullyMatched: [],
        remainingCandidates: [seedResultItem],
        done: false
      };

    return widthSearch(seedResult);
};

export function isNullEmptyOrUndefined(arg : mixed): boolean {
  return !(arg != null) || arg === '';
}

export function isDefined(arg : mixed): boolean {
  return typeof arg !== 'undefined';
}

export function isUndefined(arg : mixed): boolean {
  return !isDefined(arg);
}

export function hasValue(arg : mixed): boolean {

  function notFalseVal(key : string): boolean {
    if(arg != null && typeof arg === 'object') {
      let val : mixed = arg[key];
      if (val != null) {
        return (typeof val === 'boolean') && val;
      } else {
        return true;
      }
    } else {
      return true;
    };
  }

  return isNullEmptyOrUndefined(arg)
    ? false
    : _.isArray(arg)
      ? true
      : _.isObject(arg)
        ? (notFalseVal('exists') && notFalseVal('Exists')) //TODO - this is specific to TC UI unfound UI items update for testCafe
        : true;
}

  // flow issues with lodash
  export function all < a > (predicate : (a) => boolean, arr : Array < a >): boolean {
    return arr.reduce((accum, item) => accum && predicate(item), true);
  }

export function stringConvertableToNumber(val: ?string): boolean {

  if(val == null)
    return false;

  function isNumChars(str) {

    function isDot(chr) {
      return chr === '.';
    }

    let chrs = str.split(('')),
      dotCount = _.filter(chrs, isDot).length,
      allInts = (str : string) => {
        return all(isIntChr, _.reject(chrs, isCommaWhiteSpaceDot));
      };

    return dotCount > 1 || startsWith(str, '.') || endsWith(str, '.') || startsWith(str, '0') && !startsWith(str, '0.') && !(str === '0')
      ? false
      : allInts(str);
  }

  function isIntChr(chr : string): boolean {
    var chCode = chr.charCodeAt(0);
    return chCode > 47 && chCode < 58;
  }

  function isCommaWhiteSpaceDot(chr : string): boolean {
    return [',', '\t', ' ', '.'].includes(chr);
  }

  return hasValue(val) && isNumChars(val);
}

export function xOr(val1 : boolean, val2 : boolean): boolean {
  return(val1 || val2) && !(val1 && val2);
}

export function areEqualWithTolerance(expectedNumber : number | string, actualNumber : number | string, tolerance : number = 0) {
  let deemedEqual = _.isEqual(actualNumber, expectedNumber);

  function parseNumIfPossible(val : number | string) :
    ? number {
      return typeof val === 'string'
        ? stringConvertableToNumber(val) ? parseFloat(val) : null
          : (typeof val === 'number'  ? val : null);
    };

  if (!deemedEqual) {
    let expectedNumberConverted = parseNumIfPossible(expectedNumber),
      actualNumberConverted = parseNumIfPossible(actualNumber);

    if (expectedNumberConverted != null && actualNumberConverted != null) {
      var diff = Math.abs(actualNumberConverted - expectedNumberConverted);
      // 0.10 !== 0.10 in javascript :-( work around
      // deemedEqual = diff <= tolerance will not work
      deemedEqual = !(diff > (tolerance + 0.0000000000000001));
    };
  }
  return deemedEqual;
}

export function reorderProps(obj : {}, ...rest : Array < string >): {} {
  return _.defaults(_.pick(obj, rest), obj);
}

export function fillArray <a> (arrayLength : number, val : a): Array <a> {
  return _.times(arrayLength, _.constant(val));
}
