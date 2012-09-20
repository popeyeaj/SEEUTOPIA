
JS_COMPILER_CORE = 'lib/compiler.jar';
JS_LIST_PATH = 'lib/_jsfiles.list';
JS_OUTPUT_FILE = 'live/utopia.min.js';


var version = "NodeJsCompress Beta 0.1";

var log = function(n){
    console.log(n);
};

var Robot = {
    switch_compile:null,
    js_files: new Array(),
    recent_modified: new Array(),
    last_modified: new Array(),
    msg: ["Watching for changes...",
            "Stupid human beings, just give me something fun to do!!!",
            "I'm bored..."],
    lastmodified: function(){
        var fs = require('fs');
        var _temp = new Array();
        for(var i=0; i<this.js_files.length; i++){
            _temp.push(new Date(fs.statSync(this.js_files[i]).mtime).getTime());
        }
        this.last_modified = _temp;
        return this.last_modified.toString();
    },
    detectFile: function(){
        var fs = require('fs'),
            js_list = fs.readFileSync(JS_LIST_PATH, 'utf8'),
            lines = js_list.split('\r\n');
            d = this;
        for(var i=0; i<lines.length; i++){
            if(lines[i][0] != '#' && lines[i].trim().indexOf('.js')!=-1){
                this.js_files.push(lines[i].toString());
            }
        }
        if(this.js_files.length){
            this.toCompile(function(){
                d.fileWatcher();
            });
        }
        else{
            log('No js-file need to be compiled!');
        }
    },
    fileWatcher: function(){
        var Bot = this;
        Bot.recent_modified = Bot.lastmodified();
        Bot.switch_compile = setInterval(function(){
            var dx = Math.round(Math.random() * 10 / 4);
            if(Bot.recent_modified.toString() == Bot.lastmodified().toString()){
                log(Bot.msg[dx]);
            }
            else{
                log('--->Doing some fucking works!')
                Bot.toCompile(function(){
                    Bot.fileWatcher();
                });
                Bot.recent_modified = Bot.lastmodified().toString();
            }
        }, 3000)
    },
    toCompile: function(callback){
        if(this.switch_compile) clearInterval(this.switch_compile);
        var _jslist = this.js_files.join(' ');
        var exec = require('child_process').exec;
        var commandText = 'java -jar '+ JS_COMPILER_CORE +' --js '+ _jslist +' --js_output_file ' + JS_OUTPUT_FILE;
        exec(commandText, function(err){
            if(err == null){
                log('---->Mission\'s Complete! They should be compiled in "' + JS_OUTPUT_FILE + '"\r\r');
            }
            else{
                log(err);
            }
            if(callback != undefined)
                callback();
        });
    }
};
(function(){
    log("## \n Personal - SeeUtopia Robot - Evan (Version " + version + ")\n - JS Compression by Google Closure\n - CSS Compression by YUI Compressor\n##\n");
    Robot.detectFile();
})()

