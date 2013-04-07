
JS_DIR = 'lib/'
JS_COMPILER_CORE = 'compiler.jar';
JS_LIST_PATH = '_jsfiles.list';
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
    fs: require('fs'),
    msg: ["Watching for changes...",
            "Stupid human beings, just give me something fun to do!!!",
            "I'm bored..."],
    lastmodified: function(){
        var fs = require('fs'),
            _temp = new Array();
        for(var i=0; i<this.js_files.length; i++){
            _temp.push(new Date(fs.statSync(this.js_files[i]).mtime).getTime());
        }
        this.last_modified = _temp;
        return this.last_modified.toString();
    },
    detectFile: function(){
        var fs = require('fs'),
            js_list = fs.readFileSync(JS_LIST_PATH, 'utf8'),
            lines = js_list.split(/\n/);
            d = this;
        for(var i=0; i<lines.length; i++){
            if(lines[i][0] != '#' && lines[i].trim().indexOf('.js')!=-1){
                this.js_files.push(lines[i].toString());
            }
        }
        if(this.js_files.length){
            var _files = [],
                filelist = this.js_files,
                err = 'XXX --- No existing files: ';

            fs.readdir(JS_DIR, function(error, files){
                for(var i=0; i<filelist.length; i++){
                    var js_f = filelist[i];
                    if(files.indexOf(js_f.split(JS_DIR)[1]) == -1){
                        _files.push(js_f);
                    }
                }
                if(_files.length){
                    _files = _files.join(', ')
                    log(err + _files.toString() + ' ');
                }
                else{
                    d.toCompile(function(){
                        d.switch_compile = d.fileListener();
                        d.fileWatcher();
                    });
                }
            });
        }
        else{
            log('Did not add any js-file yet.');
        }
    },
    fileWatcher: function(){
        var Bot = this,
            listener = Bot.fs.watch(JS_DIR);
        listener.on('change', function(event, filename){
            filename = JS_DIR + filename;
            if(Bot.js_files.indexOf(filename) > -1){
                this.close();
                if(Bot.switch_compile != null) clearInterval(Bot.switch_compile);
                log('--->Doing some fucking works!')
                Bot.toCompile(function(){
                    Bot.switch_compile = Bot.fileListener();
                    Bot.fileWatcher();
                });
            }
        });
    },
    fileListener: function(){
        return setInterval(function(){
            var ra = Math.round(Math.random() * 10 - 3);
            if(ra > 6)
                log("I'm bored...")
            else
                log('waiting for changes...');
        }, 6000)
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
    log("## \n Personal - SeeUtopia Robot - Evan (Version " + version + ")\n - JS Compression by Google Closure\n##\n");
    Robot.detectFile();
})()

