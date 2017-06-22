/**
 * Copyright (c) 2016 Nishant Das Patnaik.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
**/

'use strict';
'import utilities';

var size;
var ptr_rand_bytes;

Interceptor.attach(Module.findExportByName('Security', 'SecRandomCopyBytes'), {
  onEnter: function(args) {
    size = args[1].toInt32();
    ptr_rand_bytes = args[2];
  },
  onLeave: function(retval) {
    var bytes = Memory.readByteArray(ptr_rand_bytes, size);
    var dump = hexdump(bytes, {
      offset: 0,
      length: size,
      header: false,
      ansi: false
    });

    /*   --- Payload Header --- */
    var send_data = {};
    send_data.time = new Date();
    send_data.txnType = 'SecureRandom Generate';
    send_data.lib = 'Security';
    send_data.method = 'SecRandomCopyBytes';
    send_data.artifact = [];

    /*   --- Payload Body --- */
    var data = {};
    data.name = "SecureRandom Bytes";
    data.value = hexify(dump);
    data.argSeq = 3;
    send_data.artifact.push(data);
    send(JSON.stringify(send_data));
  }
});
