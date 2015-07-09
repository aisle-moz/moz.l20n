/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
 
define(function(require, exports, module) {

var L20nParser = require('./l20n').L20nParser;
var tree = require("treehugger/tree");
var traverse = require("treehugger/traverse");

var baseLanguageHandler = require('plugins/c9.ide.language/base_handler');
var l20n = module.exports = Object.create(baseLanguageHandler);

l20n.handlesLanguage = function(language) {
    language = language.split('/');
    language = language[language.length-1];
    return language === "l20n";
};

l20n.parse = function(value, callback) {
    console.log('l20n worker parse');
    var ast = L20nParser.parse(null, value, true);
    var errors = [];
    var that = this;
    ast._errors.forEach(function(e) {
        var spos = that.doc.indexToPosition(e._pos.start);
        var epos = that.doc.indexToPosition(e._pos.start + 1);
        var node = tree.cons("Error", [tree.string(e.message + ' in column ' + (spos.column + 1))]);
        node.setAnnotation('pos', {
            sc: spos.column,
            sl: spos.row,
            ec: epos.column,
            el: epos.row
        });
        errors.push(node);
    });
    callback(tree.cons("Errors", errors));
};

l20n.outline = function(doc, fullAst, callback) {
    var items = [];
    callback({items: items});
};

l20n.analyze = function(value, fullAst, callback, minimalAnalysis) {
    console.log('l20n worker analyze');
    var items = fullAst.map(function(e) {
        return {
            pos: e.getPos(),
            message:e[0].value,
            type: "error"
        };
    }).toArray();
    callback(items);
};

});
