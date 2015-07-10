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
    var that = this;
    var entries = ast.body.map(function(entry) {
        var spos = that.doc.indexToPosition(entry._pos.start);
        var epos = that.doc.indexToPosition(entry._pos.end);
        var children = [];
        if (entry.type === 'Entity') {
            children.push(tree.string(entry.id.name));
        }
        var node = tree.cons(entry.type, children);
        node.setAnnotation('pos', {
            sc: spos.column,
            sl: spos.row,
            ec: epos.column,
            el: epos.row
        });
        return node;
    });
    var errors = ast._errors.map(function(e) {
        var spos = that.doc.indexToPosition(e._pos.start);
        var epos = that.doc.indexToPosition(e._pos.start + 1);
        var node = tree.cons("Error", [
            tree.string(e.description + ' in column ' + (spos.column + 1))
        ]);
        node.setAnnotation('pos', {
            sc: spos.column,
            sl: spos.row,
            ec: epos.column,
            el: epos.row
        });
        return node;
    });
    callback(tree.cons("AST", [
        tree.cons("Body", entries),
        tree.cons("Errors", errors)
    ]));
};

l20n.outline = function(doc, fullAst, callback) {
    var items = fullAst.collectTopDown('Entity(id)', function(match) {
            return {
                icon: 'method',
                name: match.id.value,
                pos: {sl: this.getPos().sl}
            };
        }).toArray();
    callback({items: items});
};

l20n.analyze = function(value, fullAst, callback, minimalAnalysis) {
    console.log('l20n worker analyze');
    var that = this;
    var items = fullAst[1].map(function(e) {
        return {
            pos: e.getPos(),
            message:e[0].value,
            type: "error"
        };
    }).toArray();
    fullAst.collectTopDown('JunkEntry()')
        .each(function(junk) {
            // split junk entries if they span lines, c9 can't deal
            var pos = junk.getPos();
            for (var line = pos.sl; line <= pos.el; line++) {
                var marker = {
                    type: 'error',
                    pos: {
                        sl: line,
                        el: line,
                        sc: line === pos.sl ? pos.sc : 0,
                        ec: line === pos.el ? pos.ec : that.doc.getLine(line).length
                    }
                };
                if (marker.pos.sc !== marker.pos.ec) {
                    items.push(marker);
                }
            }
        });
    callback(items);
};

});
