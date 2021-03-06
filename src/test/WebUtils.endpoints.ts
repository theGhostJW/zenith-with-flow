import {chk, chkEq, chkEqJson, chkFalse, chkExceptionText, chkWithMessage} from '../lib/AssertionUtils';
import { debug, waitRetry} from '../lib/SysUtils';
import { toTemp, toTempString } from '../lib/FileUtils';
import { show } from '../lib/StringUtils';
import * as _ from 'lodash';
import { zzzTestFunc, wdDebug, lsTestFunc} from '../lib/WebUtils';

const TEST_LOG_IN = 'http://secure.smartbearsoftware.com/samples/TestComplete12/WebOrders/Login.aspx';

describe('wdDebug', () => {

  it('close', () => {
    wdDebug();
  });

  it('wdDebugGoogle', () => {
    const pageTitle = wdDebug('https://www.google.com.au/', zzzTestFunc);
    chkEq('Google', pageTitle);
  });

});
