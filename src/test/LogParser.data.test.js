//@flow

export const DEMO_ENTRY = `timestamp: '2017-10-01 13:46:27'
level: info
subType: FilterLog
popControl: NoAction
message: Filter Log
additionalInfo: |
  Another_Demo_Case.js: Accepted
  Demo_Case.js: Accepted`;


export const DEMO_LOG = `
timestamp: '2017-10-01 13:46:27'
level: info
subType: FilterLog
popControl: NoAction
message: Filter Log
additionalInfo: |
  Another_Demo_Case.js: Accepted
  Demo_Case.js: Accepted
-------------------------------
timestamp: '2017-10-01 13:46:27'
level: info
subType: RunStart
popControl: PushFolder
message: 'Test Run: Test Test Run'
additionalInfo: |
  name: Test Test Run
  country: Australia
  environment: TST
  testCases: []
  depth: Regression
-------------------------------
timestamp: '2017-10-01 13:46:27'
level: info
subType: TestStart
popControl: PushFolder
message: 'Test: 2: Another_Demo_Case.js - When i test anther case then it still works'
additionalInfo: |
  id: 2
  when: i test anther case
  then: it still works
  owner: JW
  enabled: true
  countries:
    - Australia
  environments:
    - TST
  depth: Regression
-------------------------------
timestamp: '2017-10-01 13:46:27'
level: info
subType: Message
message: Loading Test Items
-------------------------------
timestamp: '2017-10-01 13:46:27'
level: info
subType: IterationStart
popControl: PushFolder
message: 'Iteration: 1: Another_Demo_Case.js - When I run a test then i get the result'
additionalInfo: |
  id: 1
  testName: Another_Demo_Case.js
  when: I run a test
  then: i get the result
-------------------------------
timestamp: '2017-10-01 13:46:27'
level: info
subType: Message
popControl: PushFolder
message: check_has_another
-------------------------------
timestamp: '2017-10-01 13:46:27'
level: info
subType: Message
popControl: PushFolder
message: check_has_another
-------------------------------
timestamp: '2017-10-01 13:46:27'
level: error
subType: CheckFail
popControl: NoAction
message: Check Text Contains
additionalInfo: |-
  Looking for: another
   in
  I run a test
callstack: |2-
      at Object.logWithlabel [as logError] (C:/ZWTF/src/lib/Logging.js:328:24)
      at logError (C:/ZWTF/src/lib/Logging.js:34:128)
      at logSpecial (C:/ZWTF/src/lib/Logging.js:114:5)
      at genericCheck (C:/ZWTF/src/lib/CheckUtils.js:90:3)
      at checkTextContains (C:/ZWTF/src/lib/CheckUtils.js:48:10)
      at check_has_another (C:/ZWTF/testCases/Another_Demo_Case.js:62:3)
      at executeValidator (C:/ZWTF/src/lib/TestRunner.js:90:5)
      at validate (C:/ZWTF/src/lib/TestRunner.js:102:7)
      at Array.forEach (native)
      at runValidators (C:/ZWTF/src/lib/TestRunner.js:110:14)
      at runTestItem (C:/ZWTF/src/lib/TestRunner.js:124:5)
      at C:/ZWTF/src/lib/TestRunner.js:140:30
      at Array.forEach (native)
      at runTest (C:/ZWTF/src/lib/TestRunner.js:140:12)
      at runTestInstance (C:/ZWTF/src/lib/TestRunner.js:202:7)
      at Array.forEach (native)
      at testRun (C:/ZWTF/src/lib/TestRunner.js:206:14)
      at run (C:/ZWTF/testCases/ProjectConfig.js:108:3)
      at Context.<anonymous> (C:/ZWTF/src/test/ProjectConfig.integration.js:22:5)
      at callFn (C:\ZWTF\node_modules\mocha\lib\runnable.js:348:21)
      at Test.Runnable.run (C:\ZWTF\node_modules\mocha\lib\runnable.js:340:7)
      at Runner.runTest (C:\ZWTF\node_modules\mocha\lib\runner.js:443:10)
      at C:\ZWTF\node_modules\mocha\lib\runner.js:549:12
      at next (C:\ZWTF\node_modules\mocha\lib\runner.js:361:14)
      at C:\ZWTF\node_modules\mocha\lib\runner.js:371:7
      at next (C:\ZWTF\node_modules\mocha\lib\runner.js:295:14)
      at Immediate.<anonymous> (C:\ZWTF\node_modules\mocha\lib\runner.js:339:5)
      at runCallback (timers.js:800:20)
      at tryOnImmediate (timers.js:762:5)
      at processImmediate [as _immediateCallback] (timers.js:733:5)
-------------------------------
timestamp: '2017-10-01 13:46:27'
level: info
subType: Message
popControl: PopFolder
message: Pop Folder
-------------------------------
timestamp: '2017-10-01 13:46:27'
level: info
subType: Message
popControl: PopFolder
message: Pop Folder
-------------------------------
timestamp: '2017-10-01 13:46:27'
level: info
subType: Summary
popControl: NoAction
message: Summarry not implemented
-------------------------------
timestamp: '2017-10-01 13:46:27'
level: info
subType: IterationEnd
popControl: PopFolder
message: End Iteration 1
additionalInfo: |
  id: 1
-------------------------------
timestamp: '2017-10-01 13:46:27'
level: info
subType: IterationStart
popControl: PushFolder
message: >-
  Iteration: 2: Another_Demo_Case.js - When I run another test then i get
  another result
additionalInfo: |
  id: 2
  testName: Another_Demo_Case.js
  when: I run another test
  then: i get another result
-------------------------------
timestamp: '2017-10-01 13:46:27'
level: info
subType: Message
popControl: PushFolder
message: check_has_another
-------------------------------
timestamp: '2017-10-01 13:46:27'
level: info
subType: Message
popControl: PushFolder
message: check_has_another
-------------------------------
timestamp: '2017-10-01 13:46:27'
level: info
subType: CheckPass
popControl: NoAction
message: Check Text Contains
additionalInfo: |-
  Looking for: another
   in
  I run another test
-------------------------------
timestamp: '2017-10-01 13:46:27'
level: info
subType: Message
popControl: PopFolder
message: Pop Folder
-------------------------------
timestamp: '2017-10-01 13:46:27'
level: info
subType: Message
popControl: PopFolder
message: Pop Folder
-------------------------------
timestamp: '2017-10-01 13:46:27'
level: info
subType: Summary
popControl: NoAction
message: Summarry not implemented
-------------------------------
timestamp: '2017-10-01 13:46:27'
level: info
subType: IterationEnd
popControl: PopFolder
message: End Iteration 2
additionalInfo: |
  id: 2
-------------------------------
timestamp: '2017-10-01 13:46:27'
level: info
subType: TestEnd
popControl: PopFolder
message: 'End Test 2 : Another_Demo_Case.js'
additionalInfo: |
  id: 2
  testName: Another_Demo_Case.js
-------------------------------
timestamp: '2017-10-01 13:46:27'
level: info
subType: TestStart
popControl: PushFolder
message: 'Test: 1: Demo_Case.js - When  then '
additionalInfo: |
  id: 1
  when: ''
  then: ''
  owner: JW
  enabled: true
  countries:
    - New Zealand
    - Australia
  environments:
    - TST
  depth: Regression
-------------------------------
timestamp: '2017-10-01 13:46:27'
level: info
subType: Message
message: Loading Test Items
-------------------------------
timestamp: '2017-10-01 13:46:27'
level: info
subType: IterationStart
popControl: PushFolder
message: 'Iteration: 1: Demo_Case.js - When I run a test then i get the result'
additionalInfo: |
  id: 1
  testName: Demo_Case.js
  when: I run a test
  then: i get the result
-------------------------------
timestamp: '2017-10-01 13:46:27'
level: info
subType: Message
popControl: PushFolder
message: check_less_than_2
-------------------------------
timestamp: '2017-10-01 13:46:27'
level: info
subType: Message
popControl: PushFolder
message: check_less_than_2
-------------------------------
timestamp: '2017-10-01 13:46:27'
level: info
subType: StartDefect
popControl: NoAction
message: 'Defect Expected: should fail'
-------------------------------
timestamp: '2017-10-01 13:46:27'
level: info
subType: CheckPass
popControl: NoAction
message: 'Check: expect less than 2'
-------------------------------
timestamp: '2017-10-01 13:46:27'
level: info
subType: EndDefect
popControl: NoAction
message: End Defect
-------------------------------
timestamp: '2017-10-01 13:46:27'
level: info
subType: Message
popControl: PopFolder
message: Pop Folder
-------------------------------
timestamp: '2017-10-01 13:46:27'
level: info
subType: Message
popControl: PopFolder
message: Pop Folder
-------------------------------
timestamp: '2017-10-01 13:46:27'
level: info
subType: Summary
popControl: NoAction
message: Summarry not implemented
-------------------------------
timestamp: '2017-10-01 13:46:27'
level: info
subType: IterationEnd
popControl: PopFolder
message: End Iteration 1
additionalInfo: |
  id: 1
-------------------------------
timestamp: '2017-10-01 13:46:27'
level: info
subType: IterationStart
popControl: PushFolder
message: 'Iteration: 2: Demo_Case.js - When I run another test then i get another result'
additionalInfo: |
  id: 2
  testName: Demo_Case.js
  when: I run another test
  then: i get another result
-------------------------------
timestamp: '2017-10-01 13:46:27'
level: info
subType: Message
popControl: PushFolder
message: check_less_than_2
-------------------------------
timestamp: '2017-10-01 13:46:27'
level: info
subType: Message
popControl: PushFolder
message: check_less_than_2
-------------------------------
timestamp: '2017-10-01 13:46:27'
level: info
subType: StartDefect
popControl: NoAction
message: 'Defect Expected: should fail'
-------------------------------
timestamp: '2017-10-01 13:46:27'
level: error
subType: CheckFail
popControl: NoAction
message: 'Check: expect less than 2'
callstack: |2-
      at Object.logWithlabel [as logError] (C:/ZWTF/src/lib/Logging.js:328:24)
      at logError (C:/ZWTF/src/lib/Logging.js:34:128)
      at logSpecial (C:/ZWTF/src/lib/Logging.js:114:5)
      at genericCheck (C:/ZWTF/src/lib/CheckUtils.js:90:3)
      at check (C:/ZWTF/src/lib/CheckUtils.js:10:88)
      at check_less_than_2 (C:/ZWTF/testCases/Demo_Case.js:67:3)
      at executeValidator (C:/ZWTF/src/lib/TestRunner.js:90:5)
      at validate (C:/ZWTF/src/lib/TestRunner.js:102:7)
      at Array.forEach (native)
      at runValidators (C:/ZWTF/src/lib/TestRunner.js:110:14)
      at runTestItem (C:/ZWTF/src/lib/TestRunner.js:124:5)
      at C:/ZWTF/src/lib/TestRunner.js:140:30
      at Array.forEach (native)
      at runTest (C:/ZWTF/src/lib/TestRunner.js:140:12)
      at runTestInstance (C:/ZWTF/src/lib/TestRunner.js:202:7)
      at Array.forEach (native)
      at testRun (C:/ZWTF/src/lib/TestRunner.js:206:14)
      at run (C:/ZWTF/testCases/ProjectConfig.js:108:3)
      at Context.<anonymous> (C:/ZWTF/src/test/ProjectConfig.integration.js:22:5)
      at callFn (C:\ZWTF\node_modules\mocha\lib\runnable.js:348:21)
      at Test.Runnable.run (C:\ZWTF\node_modules\mocha\lib\runnable.js:340:7)
      at Runner.runTest (C:\ZWTF\node_modules\mocha\lib\runner.js:443:10)
      at C:\ZWTF\node_modules\mocha\lib\runner.js:549:12
      at next (C:\ZWTF\node_modules\mocha\lib\runner.js:361:14)
      at C:\ZWTF\node_modules\mocha\lib\runner.js:371:7
      at next (C:\ZWTF\node_modules\mocha\lib\runner.js:295:14)
      at Immediate.<anonymous> (C:\ZWTF\node_modules\mocha\lib\runner.js:339:5)
      at runCallback (timers.js:800:20)
      at tryOnImmediate (timers.js:762:5)
      at processImmediate [as _immediateCallback] (timers.js:733:5)
-------------------------------
timestamp: '2017-10-01 13:46:27'
level: info
subType: EndDefect
popControl: NoAction
message: End Defect
-------------------------------
timestamp: '2017-10-01 13:46:27'
level: info
subType: Message
popControl: PopFolder
message: Pop Folder
-------------------------------
timestamp: '2017-10-01 13:46:27'
level: info
subType: Message
popControl: PopFolder
message: Pop Folder
-------------------------------
timestamp: '2017-10-01 13:46:27'
level: info
subType: Message
popControl: PushFolder
message: check_less_than_3
-------------------------------
timestamp: '2017-10-01 13:46:27'
level: info
subType: Message
popControl: PushFolder
message: check_less_than_3
-------------------------------
timestamp: '2017-10-01 13:46:27'
level: info
subType: CheckPass
popControl: NoAction
message: 'Check: expect less than 2'
-------------------------------
timestamp: '2017-10-01 13:46:28'
level: info
subType: Message
popControl: PopFolder
message: Pop Folder
-------------------------------
timestamp: '2017-10-01 13:46:28'
level: info
subType: Message
popControl: PopFolder
message: Pop Folder
-------------------------------
timestamp: '2017-10-01 13:46:28'
level: info
subType: Summary
popControl: NoAction
message: Summarry not implemented
-------------------------------
timestamp: '2017-10-01 13:46:28'
level: info
subType: IterationEnd
popControl: PopFolder
message: End Iteration 2
additionalInfo: |
  id: 2
-------------------------------
timestamp: '2017-10-01 13:46:28'
level: info
subType: IterationStart
popControl: PushFolder
message: 'Iteration: 3: Demo_Case.js - When I run another test then i get another result'
additionalInfo: |
  id: 3
  testName: Demo_Case.js
  when: I run another test
  then: i get another result
-------------------------------
timestamp: '2017-10-01 13:46:28'
level: info
subType: Message
popControl: PushFolder
message: check_bad_validator
-------------------------------
timestamp: '2017-10-01 13:46:28'
level: info
subType: Message
popControl: PushFolder
message: check_bad_validator
-------------------------------
timestamp: '2017-10-01 13:46:28'
level: info
subType: Message
popControl: PopFolder
message: Pop Folder
-------------------------------
timestamp: '2017-10-01 13:46:28'
level: error
subType: Exception
popControl: NoAction
message: 'Exception thrown in validator: check_bad_validator'
additionalInfo: ARGGGHHHHHH!!!
callstack: |2-
      at Object.logWithlabel [as logError] (C:/ZWTF/src/lib/Logging.js:328:24)
      at logError (C:/ZWTF/src/lib/Logging.js:34:128)
      at logException (C:/ZWTF/src/lib/Logging.js:52:67)
      at validate (C:/ZWTF/src/lib/TestRunner.js:104:7)
      at Array.forEach (native)
      at runValidators (C:/ZWTF/src/lib/TestRunner.js:110:14)
      at runTestItem (C:/ZWTF/src/lib/TestRunner.js:124:5)
      at C:/ZWTF/src/lib/TestRunner.js:140:30
      at Array.forEach (native)
      at runTest (C:/ZWTF/src/lib/TestRunner.js:140:12)
      at runTestInstance (C:/ZWTF/src/lib/TestRunner.js:202:7)
      at Array.forEach (native)
      at testRun (C:/ZWTF/src/lib/TestRunner.js:206:14)
      at run (C:/ZWTF/testCases/ProjectConfig.js:108:3)
      at Context.<anonymous> (C:/ZWTF/src/test/ProjectConfig.integration.js:22:5)
      at callFn (C:\ZWTF\node_modules\mocha\lib\runnable.js:348:21)
      at Test.Runnable.run (C:\ZWTF\node_modules\mocha\lib\runnable.js:340:7)
      at Runner.runTest (C:\ZWTF\node_modules\mocha\lib\runner.js:443:10)
      at C:\ZWTF\node_modules\mocha\lib\runner.js:549:12
      at next (C:\ZWTF\node_modules\mocha\lib\runner.js:361:14)
      at C:\ZWTF\node_modules\mocha\lib\runner.js:371:7
      at next (C:\ZWTF\node_modules\mocha\lib\runner.js:295:14)
      at Immediate.<anonymous> (C:\ZWTF\node_modules\mocha\lib\runner.js:339:5)
      at runCallback (timers.js:800:20)
      at tryOnImmediate (timers.js:762:5)
      at processImmediate [as _immediateCallback] (timers.js:733:5)
-------------------------------
timestamp: '2017-10-01 13:46:28'
level: info
subType: Message
popControl: PopFolder
message: Pop Folder
-------------------------------
timestamp: '2017-10-01 13:46:28'
level: error
subType: Exception
popControl: NoAction
message: Exception Thrown Executing Validators
additionalInfo: ARGGGHHHHHH!!!
callstack: |2-
      at Object.logWithlabel [as logError] (C:/ZWTF/src/lib/Logging.js:328:24)
      at logError (C:/ZWTF/src/lib/Logging.js:34:128)
      at logException (C:/ZWTF/src/lib/Logging.js:52:67)
      at runTestItem (C:/ZWTF/src/lib/TestRunner.js:131:5)
      at C:/ZWTF/src/lib/TestRunner.js:140:30
      at Array.forEach (native)
      at runTest (C:/ZWTF/src/lib/TestRunner.js:140:12)
      at runTestInstance (C:/ZWTF/src/lib/TestRunner.js:202:7)
      at Array.forEach (native)
      at testRun (C:/ZWTF/src/lib/TestRunner.js:206:14)
      at run (C:/ZWTF/testCases/ProjectConfig.js:108:3)
      at Context.<anonymous> (C:/ZWTF/src/test/ProjectConfig.integration.js:22:5)
      at callFn (C:\ZWTF\node_modules\mocha\lib\runnable.js:348:21)
      at Test.Runnable.run (C:\ZWTF\node_modules\mocha\lib\runnable.js:340:7)
      at Runner.runTest (C:\ZWTF\node_modules\mocha\lib\runner.js:443:10)
      at C:\ZWTF\node_modules\mocha\lib\runner.js:549:12
      at next (C:\ZWTF\node_modules\mocha\lib\runner.js:361:14)
      at C:\ZWTF\node_modules\mocha\lib\runner.js:371:7
      at next (C:\ZWTF\node_modules\mocha\lib\runner.js:295:14)
      at Immediate.<anonymous> (C:\ZWTF\node_modules\mocha\lib\runner.js:339:5)
      at runCallback (timers.js:800:20)
      at tryOnImmediate (timers.js:762:5)
      at processImmediate [as _immediateCallback] (timers.js:733:5)
-------------------------------
timestamp: '2017-10-01 13:46:28'
level: info
subType: IterationEnd
popControl: PopFolder
message: End Iteration 3
additionalInfo: |
  id: 3
-------------------------------
timestamp: '2017-10-01 13:46:28'
level: info
subType: IterationStart
popControl: PushFolder
message: 'Iteration: 4: Demo_Case.js - When I run another test then i get another result'
additionalInfo: |
  id: 4
  testName: Demo_Case.js
  when: I run another test
  then: i get another result
-------------------------------
timestamp: '2017-10-01 13:46:28'
level: error
subType: Exception
popControl: NoAction
message: I do not like 4
additionalInfo: ''
callstack: |2-
      at Object.logWithlabel [as logError] (C:/ZWTF/src/lib/Logging.js:328:24)
      at logError (C:/ZWTF/src/lib/Logging.js:34:128)
      at logException (C:/ZWTF/src/lib/Logging.js:52:67)
      at fail (C:/ZWTF/src/lib/SysUtils.js:414:3)
      at Object.interactor (C:/ZWTF/testCases/Demo_Case.js:26:5)
      at runTestItem (C:/ZWTF/src/lib/TestRunner.js:118:31)
      at C:/ZWTF/src/lib/TestRunner.js:140:30
      at Array.forEach (native)
      at runTest (C:/ZWTF/src/lib/TestRunner.js:140:12)
      at runTestInstance (C:/ZWTF/src/lib/TestRunner.js:202:7)
      at Array.forEach (native)
      at testRun (C:/ZWTF/src/lib/TestRunner.js:206:14)
      at run (C:/ZWTF/testCases/ProjectConfig.js:108:3)
      at Context.<anonymous> (C:/ZWTF/src/test/ProjectConfig.integration.js:22:5)
      at callFn (C:\ZWTF\node_modules\mocha\lib\runnable.js:348:21)
      at Test.Runnable.run (C:\ZWTF\node_modules\mocha\lib\runnable.js:340:7)
      at Runner.runTest (C:\ZWTF\node_modules\mocha\lib\runner.js:443:10)
      at C:\ZWTF\node_modules\mocha\lib\runner.js:549:12
      at next (C:\ZWTF\node_modules\mocha\lib\runner.js:361:14)
      at C:\ZWTF\node_modules\mocha\lib\runner.js:371:7
      at next (C:\ZWTF\node_modules\mocha\lib\runner.js:295:14)
      at Immediate.<anonymous> (C:\ZWTF\node_modules\mocha\lib\runner.js:339:5)
      at runCallback (timers.js:800:20)
      at tryOnImmediate (timers.js:762:5)
      at processImmediate [as _immediateCallback] (timers.js:733:5)
-------------------------------
timestamp: '2017-10-01 13:46:28'
level: error
subType: Exception
popControl: NoAction
message: Exception Thrown Executing Interactor
additionalInfo: ''
callstack: |2-
      at Object.logWithlabel [as logError] (C:/ZWTF/src/lib/Logging.js:328:24)
      at logError (C:/ZWTF/src/lib/Logging.js:34:128)
      at logException (C:/ZWTF/src/lib/Logging.js:52:67)
      at runTestItem (C:/ZWTF/src/lib/TestRunner.js:131:5)
      at C:/ZWTF/src/lib/TestRunner.js:140:30
      at Array.forEach (native)
      at runTest (C:/ZWTF/src/lib/TestRunner.js:140:12)
      at runTestInstance (C:/ZWTF/src/lib/TestRunner.js:202:7)
      at Array.forEach (native)
      at testRun (C:/ZWTF/src/lib/TestRunner.js:206:14)
      at run (C:/ZWTF/testCases/ProjectConfig.js:108:3)
      at Context.<anonymous> (C:/ZWTF/src/test/ProjectConfig.integration.js:22:5)
      at callFn (C:\ZWTF\node_modules\mocha\lib\runnable.js:348:21)
      at Test.Runnable.run (C:\ZWTF\node_modules\mocha\lib\runnable.js:340:7)
      at Runner.runTest (C:\ZWTF\node_modules\mocha\lib\runner.js:443:10)
      at C:\ZWTF\node_modules\mocha\lib\runner.js:549:12
      at next (C:\ZWTF\node_modules\mocha\lib\runner.js:361:14)
      at C:\ZWTF\node_modules\mocha\lib\runner.js:371:7
      at next (C:\ZWTF\node_modules\mocha\lib\runner.js:295:14)
      at Immediate.<anonymous> (C:\ZWTF\node_modules\mocha\lib\runner.js:339:5)
      at runCallback (timers.js:800:20)
      at tryOnImmediate (timers.js:762:5)
      at processImmediate [as _immediateCallback] (timers.js:733:5)
-------------------------------
timestamp: '2017-10-01 13:46:28'
level: info
subType: IterationEnd
popControl: PopFolder
message: End Iteration 4
additionalInfo: |
  id: 4
-------------------------------
timestamp: '2017-10-01 13:46:28'
level: info
subType: TestEnd
popControl: PopFolder
message: 'End Test 1 : Demo_Case.js'
additionalInfo: |
  id: 1
  testName: Demo_Case.js
-------------------------------
timestamp: '2017-10-01 13:46:28'
level: info
subType: RunEnd
popControl: PopFolder
message: 'End Run: Test Test Run'
-------------------------------
`
