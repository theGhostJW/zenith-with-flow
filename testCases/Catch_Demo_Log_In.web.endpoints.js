// @flow

import {it, describe} from 'mocha';

import { debug } from '../src/lib/SysUtils';
import * as _ from 'lodash';

import { allItems } from '../src/lib/TestRunner';
import { testCase } from '../testCases/Catch_Demo_Log_In.web';
import { testCaseEndPoint } from '../testCases/ProjectConfig';

describe('endPoint', () => {

  it('demo endpoint', () => {
     testCaseEndPoint(
       {
       mocked: false,
       testCase: testCase,
       selector: allItems
     }
    );
  });
});

//TODO: error on empty list for endpoint selector

