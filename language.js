/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */
 
 define(function(require, exports, module) {
    main.consumes = ["Plugin", "language", "tabManager", "commands"];
    main.provides = ["moz.l20n.language"];
    return main;

    function main(options, imports, register) {
        /***** Hook up language worker *****/
        var language = imports.language;
        console.log(options.packagePath, 'packagePath');
        language.registerLanguageHandler(options.packagePath + '/worker');

        var Plugin = imports.Plugin;
        
        /***** Initialization *****/
        
        var plugin = new Plugin("mozilla.org", main.consumes);
        var emit = plugin.getEmitter();
        
        function load() {
            console.log('l20n language loaded');
        }
        
        /***** Methods *****/

        /***** Lifecycle *****/
        
        plugin.on("load", function() {
            load();
        });
        plugin.on("unload", function() {
        });
        
        /***** Register and define API *****/
        
        plugin.freezePublicAPI({
            
        });
        
        register(null, {
            "moz.l20n.language": plugin
        });
    }
});