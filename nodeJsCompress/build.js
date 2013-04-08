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
    js_files: [],
    recent_modified: [],
    last_modified: [],
    fs: require('fs'),
    msg: ["Watching for changes...",
            "Stupid human beings, just give me something fun to do!!!",
            "I'm bored..."],
    toRecord: function(){
        var d = this,
            fs = require('fs'),
            _temp = new Array();
        for(var i=0; i<this.js_files.length; i++){
            _temp.push(this.getHashCode(this.js_files[i]));
        }
        this.last_modified = _temp;
        return this.last_modified.toString();
    },
    isSame: function(filename){
        var d = this,
            dx = d.js_files.indexOf(filename);
        if(dx>-1){
            var _hash = d.getHashCode(filename);
            if(_hash != d.last_modified[dx]){  //文件被修改
                d.last_modified.splice(dx, 1, _hash);
                return 'false';
            }
            else{
                return 'true';
            }
        }
    },
    getHashCode: function(filename){
        var fs = require('fs'),
            crypto = require('crypto'),
            shasum = crypto.createHash('md5'),
            result;
        result = fs.readFileSync(filename);
        return shasum.update(result).digest('hex');
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
                        d.toRecord();   //记录文件MD5值
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
            cpt = require('crypto'),
            listener = Bot.fs.watch(JS_DIR);
        listener.on('change', function(event, filename){
            this.close();
            filename = JS_DIR + filename;
            if((Bot.js_files.indexOf(filename) > -1) && (Bot.isSame(filename)=='false')){
                if(Bot.switch_compile != null) clearInterval(Bot.switch_compile);
                log('--->Doing some fucking works!')
                Bot.toCompile(function(){
                    Bot.switch_compile = Bot.fileListener();
                    Bot.fileWatcher();
                });
            }
            else{
                Bot.fileWatcher();
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
        var _jslist = this.js_files,
            exec = require('child_process').exec,
            fs = require('fs'),
            uglifyjs = require('uglify-js');
        try{
            var result = uglifyjs.minify(_jslist);
            fs.writeFileSync(JS_OUTPUT_FILE, result.code, 'utf8');
            log('---->Mission\'s Complete! They should be compiled in "' + JS_OUTPUT_FILE + '"\r\r');
            if(callback != undefined)
                callback();
        }
        catch(err){
            throw err;
        }

    }
};
(function(){
    log("## \n Personal - SeeUtopia Robot - Evan (Version " + version + ")\n - JS Compression by Google Closure\n##\n");
    Robot.detectFile();
})()

