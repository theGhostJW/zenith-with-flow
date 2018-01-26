// @flow

import {chk, chkEq, chkEqJson, chkFalse, chkExceptionText, chkWithMessage} from '../lib/AssertionUtils';
import { debug, waitRetry } from '../lib/SysUtils';
import { toString } from '../lib/StringUtils';
import { toTemp, toTempString } from '../lib/FileUtils';
import * as _ from 'lodash';
import * as wd from 'webdriverio';
import * as ipc from 'node-ipc';
import { uiInteraction } from '../test/WebUtils.endpoints'

let title,
    connected = false,
    done = false,
    url = null;


describe.only('test cafe play', () => {

  function runIt() {
    runClient();
    debug('Run client finished');
    waitRetry(() => done, 60000, () => {uiInteraction(url); url = null;});
  }

  it('interact', () => {
    runIt();
    //chkEq('Google', title);
  });

  function runClient() {
    ipc.config.id = 'uiTest';
    ipc.config.retry = 1000;
    ipc.config.sync = true;

    ipc.connectTo(
        'uiInt',
        function(){
            ipc.of.uiInt.on(
                'connect',
                function(){
                    console.log('!!!!! CLIENT CONNECTED !!!!!');
                    ipc.log('## started ##', ipc.config.delay);
                    connected = true;

                    //queue up a bunch of requests to be sent synchronously
                    ipc.of.uiInt.emit(
                      'app.message',
                      {
                            id      : ipc.config.id,
                            message : 'hello'
                        }
                    );
                }
            );

            ipc.of.uiInt.on(
                'disconnect',
                function(){
                    console.log('!!!!! CLIENT DISCONNECTED !!!!!');
                    console.log('DONE');
                    ipc.log('client disconnected');
                    done = true;
                }
            );

            ipc.of.uiInt.on(
                'app.message',
                function(data){
                    console.log('!!!!! CLIENT MESSAGE !!!!!');
                    ipc.log('going to: ', data);
                    url = data.message;
                }
            ),

            ipc.of.uiInt.on(
                'ServerDone',
                () => {
                  ipc.of.uiInt.emit('ClientDone');
                  done = true;
                }
            ),

            console.log(ipc.of.uiInt.destroy);
        }
    );

  }

});