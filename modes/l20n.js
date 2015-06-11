/* caption: L20n; extensions: .l20n */
/*
 * Copyright 2015 mozilla.org
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

define(function(require, exports, module) {
"use strict";

var oop = require("ace/lib/oop");
var TextMode = require("ace/mode/text").Mode;
var HighlightRules = require("./l20n_highlight_rules").L20nHighlightRules;

var Mode = function() {
    this.HighlightRules = HighlightRules;
};
oop.inherits(Mode, TextMode);

(function() {
    this.$id = "ace/mode/l20n";
}).call(Mode.prototype);

exports.Mode = Mode;
});
