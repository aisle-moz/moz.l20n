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
var TextHighlightRules = require("ace/mode/text_highlight_rules").TextHighlightRules;

var L20nHighlightRules = function() {

    // regexp must not have capturing parentheses. Use (?:) instead.
    // regexps are ordered -> the first match is used
    var identifier_re = '[_a-zA-Z]\w*';
    this.$rules = {
        "start": [
            {
                token: "constant.language",
                regex: "<",
                next: "entity"
            },
            {
                token: "comment.block",
                regex: "/\\*",
                next: "comment"
            },
            {
                token: "text",
                regex: "\\s+"
            }
        ],
        "comment": [
            {
                token: "comment.block",
                regex: ".*?\\*/",
                next: "start"
            },
            {
                token: "comment.block",
                regex: ".+"
            }
        ],
        "entity": [
            {
                token: "variable.key",
                regex: identifier_re
            },
            {
                token: "constant.language",
                regex: "\\[",
                next: "index"
            },
            {
                token: "text",
                regex: "\\s+",
                next: "value"
            },
            {
                token: "constant.language",
                regex: ">",
                next: "start"
            },
            {
                token: "string",
                regex: "",
                next: "start"
            }
        ],
        "index": [
            {
                token: "constant.language.foo",
                regex: "]",
                next: "value"
            },
            {
                token: "string.index",
                regex: "."
            },
            {
                token: "string",
                regex: "",
                next: "value"
            }
        ],
        "value": [
            {
                token: "string.l20n",
                regex: "\"",
                next: "string"
            },
            {
                token: "string.l20n",
                regex: "'",
                next: "tickstring"
            },
            {
                token: "constant.language.hash",
                regex: "[\\{,:\\}]"
            },
            {
                token: "variable.key.hash",
                regex: identifier_re
            },
            {
                token: "text",
                regex: "\\s+"
            },
            {
                token: "string",
                regex: "",
                next: "entity"
            }
        ],
        "string": [
            {
                token: "string.interpolated",
                regex: '\\{\\{.+?\\}\\}'
            },
            {
                token: "text.l20n",
                regex: '[^"^{\\\\]+'
            },
            {
                token: "text.l20n",
                regex: '{'
            },
            {
                token: "string.l20n",
                regex: '"',
                next : "value"
            },
            {
                token: "string",
                regex: "",
                next : "value"
            }
        ]
    };
    // create '' strings programmatically from "" strings
    this.$rules.tickstring = [];
    var that = this;
    this.$rules.string.forEach(function(pattern){
        var tickpattern = {
            token: pattern.token,
            regex: pattern.regex.replace(/"/g, "'")
        };
        if (pattern.next) {
            tickpattern.next = pattern.next;
        }
        that.$rules.tickstring.push(tickpattern);
    });
};

oop.inherits(L20nHighlightRules, TextHighlightRules);

exports.L20nHighlightRules = L20nHighlightRules;
});
