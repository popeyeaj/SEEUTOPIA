var CONFIG,
    version = "NodeJsCompress Beta 0.1",
    log = function(n){
        console.log(n);
    },
    Robot = {
    switch_compile:null,
    js_files: [],
    output_file:"",
    recent_modified: [],
    last_modified: [],
    fs: require('fs'),
    listener: undefined,
    msg: ["Watching for changes...",
            "Stupid human beings, just give me something fun to do!!!",
            "I'm bored..."],
    toRecord: function(){ 
        var d = this,
            fs = require('fs'),
            _temp = [];
        for(var i=0; i<this.js_files.length; i++){
            _temp.push( this.getHashCode( this.js_files[i]) );
        }
        this.last_modified = _temp;
        return this.last_modified.toString();
    },
    isSame: function(filename){
        var d = this,
            dx,
            result;
        if( d.js_files.indexOf( filename ) > -1 ){
            dx = d.js_files.indexOf( filename );
            var _hash = d.getHashCode( d.js_files[dx] );
            if( _hash != d.last_modified[dx] ){  //文件被修改
                d.last_modified.splice( dx, 1, _hash );
                result = 'false';
            }
            else
                result = 'true';
        }
        return result;
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
            compress,
            out_list = [],
            d = this;
        CONFIG = JSON.parse( fs.readFileSync('config/config.json', 'utf8') );
        compress = CONFIG['COMPRESS'];

        
        this.js_files = compress["DEVJS"].toString().split(',');
        this.output_file = compress["LIVEJS"].toString();


        if(this.js_files.length){
            var _files = [],
                filelist = this.js_files,
                err = 'XXX --- No existing files: ';

            for( var i=0; i<filelist.length; i++ ){
                var _temp = filelist[i].trim();
                fs.exists(_temp, function(exist){
                    if( !exist ){
                        log(err + _temp + ' ');
                    }
                })
            }
            d.toCompile(function(){
                d.toRecord();
                d.switch_compile = d.fileListener();
                d.fileWatcher();
            });
        }
        else{
            log('Did not add any js files yet.');
        }
    },
    fileWatcher: function(){
        var d = this,
            cpt = require('crypto'),
            JS_DIR = CONFIG['JS_DIR'];
        listener = d.fs.watch( JS_DIR, { recursive:true } );
        listener.on('change', function(event, filename){ 
            this.close();
            filename = JS_DIR + filename;
            for( var i=0; i<d.js_files.length; i++ ){
                if( d.js_files[i].indexOf( filename ) > -1 && (d.isSame(filename) == 'false') ){
                    if(d.switch_compile != null) clearInterval(d.switch_compile);
                    log('--->Doing some fucking works!')
                    d.toCompile( function(){
                        d.toRecord();
                        d.switch_compile = d.fileListener();
                    });
                    break;
                }
            }
            d.fileWatcher();
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
            fs = require('fs'),
            uglifyjs = require('uglify-js');
        try{
            var result = uglifyjs.minify( _jslist, {
                comments:true,
                compress:true,
                mangle:true
            });
            fs.writeFileSync( this.output_file, result.code, 'utf8' );
            log('---->Mission\'s Complete! They should be compiled in:');
            log( this.output_file + '\r\r');

            if( typeof callback != 'undefined' )
                callback();
        }
        catch(err){
            throw err;
            
        }
    }
};
(function(){
    log("## \n Personal - SeeUtopia Robot - Evan (Version " + version + ")\n - JS Compression by Uglify2\n##\n");
    Robot.detectFile();
})()

