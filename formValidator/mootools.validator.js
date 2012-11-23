(function(){
    String.prototype.trim = function(){
        return this.replace(/(^\s*)|(\s*$)/g, ""); 
    };
    function vform(container, exec){
        this.regEx = {
            email: new RegExp("\\w+([-+.]\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*"),
            password: new RegExp("^[A-z][^.]{5,17}"),
            mobile: new RegExp("^1[3458]\\d{9}$"),
            //expanded
            semail: new RegExp("\\w+([-+.]\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*"),
            smobile: new RegExp("^1[3458]\\d{9}$")
        };
        this.msg = {
            email: ["","不得为空", "Email格式有误", "输入的邮箱地址尚未注册，请重新输入", "available"],
            password: ["", "请填写新密码,6-18个字符，请使用字母加数字或符号的组合，以字母开头，不能单独使用数字，字母或符号。", "格式不正确，请重新填写，6-18个字符，请使用字母加数字或符号的组合，以字母开头，不能单独使用数字，字母或符号。", "available"],
            cfpwd: ["", "请再次输入新密码", "两次密码不一致，请重新输入。", "available"],
            mobile: ["","不得为空", "格式有误", "输入的手机号码尚未注册，请重新输入", "available"],
            checkcode: ["","不得为空","", "验证码错误，请重新输入。", "available"],
            smscode: ["","不得为空","", "验证码错误，请重新输入。", "available"],
            //expanded
            semail: ["","不得为空", "Email格式有误", "输入的邮箱地址尚未注册，请重新输入", "available"],
            smobile: ["","不得为空", "格式有误", "输入的手机号码尚未注册，请重新输入", "available"]
        };
        this.countdown_switch = false;
        this.container = container;
        this.exec = exec;
    }
    vform.prototype = {
        constructor: vform,
        init: function(){
            //variable declaration
            var d = this;
            for(_property in d.container){
                var input_type = ["radio", "checkbox"].toString().indexOf(_property) != -1 ? "option" : _property;
                switch(input_type){
                    case "textbox": d.textCheck(d.container[_property]);
                        break;
                    case "option": d.optsCheck(d.container[_property], _property);
                        break;
                }
            }
        },
        optsCheck: function(inputs, input_type){
            for(var i=0; i<inputs.length; i++){
                //to be continued
            }
        },
        textCheck: function(inputs){
            var input_elms = inputs != undefined && inputs.length == undefined ? new Array(inputs) : inputs,
                d = this;
            for(var i=0; i<input_elms.length; i++){
                var input_type = input_elms[i].get('vtype').toString().split('required')[1].trim(),
                    //check_type = ["username", "email", "password", "mobile"].indexOf(input_type) != -1 ? "regExStr" : input_type,
                    value = input_elms[i].get('value').toString().trim(),
                    pass_info = d.msg[input_type].length - 1;
                    //expanded
                    //check_type = ["smobile", "semail"].indexOf(input_type) != -1 ? "multiple" : input_type;

                    if(["username", "email", "password", "mobile"].indexOf(input_type) != -1){
                        check_type = "regExStr";
                    }
                    else if(["smobile", "semail"].indexOf(input_type) != -1){
                        check_type = "multiple";
                    }
                    else{
                        check_type = input_type;
                    }

                if(!d.isEmpty(value)){
                    switch(check_type){
                        case "regExStr":
                            if(d.isRegExPassed(input_type, value)){
                                if(d.container.request[input_type]!=undefined){
                                    d.verifyField(input_type, value);
                                }
                                else{
                                    d.showMsg('pass', input_type, pass_info);
                                }
                            }
                            else{
                                d.showMsg('err', input_type, 2);
                            }
                            break;
                        case "cfpwd":
                            var input_childs = d.container.form.getElements('input[type=password][vtype~=required]');
                            var origin_password = input_childs.filter(function(el){
                                return el.getProperty('vtype').split('required')[1].trim() == 'password';
                            });
                            if(d.isSame(origin_password[0].value.trim(), value))
                                d.showMsg('pass', input_type, pass_info);
                            else
                                d.showMsg('err', input_type, 2);
                            break;
                        case "smscode":
                            if(d.container.request[input_type]!=undefined){
                                d.verifyField(input_type, value);
                            }
                            break;
                        //expanded function
                        case "multiple":
                            if(d.isRegExPassed(input_type, value)){
                                d.showMsg('pass', input_type, pass_info);
                                var msg_text;
                                var req_url = d.container.request[input_type];
                                d.toRequire(req_url, input_type+'='+value, function(res){
                                    var rs = JSON.decode(res);
                                    var _data = {};
                                    if(d.container.request['para']!=undefined){
                                        _data = d.container.request['para'];
                                    }
                                    _data[input_type] = value;
                                    switch(rs.status){
                                        case 'true':
                                            d.exec.stop();
                                            d.toSend(input_type, _data);
                                            break;
                                        case 'false':
                                            d.exec.stop();
                                            if(input_type == "semail")
                                                msg_text = "我们注意到您填写了新的邮箱地址，是否需要将新邮箱地址保存为注册邮箱？";
                                            else
                                                msg_text = "我们注意到您填写了新的手机号码，是否需要将新手机号码保存为绑定手机？";
                                            $$("body")[0].popWindow({
                                                win_type: 2,
                                                msg: msg_text
                                            }, function(){
                                                d.toSend(input_type, _data);
                                            });
                                            break;
                                        case "unreg":
                                            d.exec.stop();
                                            $$("body")[0].popWindow({
                                                win_type: 1,
                                                err: rs.err.title,
                                                msg: rs.err.reason
                                            });
                                            break;
                                        default: break;
                                    }
                                });
                            }
                            else{
                                d.showMsg('err', input_type, 2);
                            }
                            break;
                        default:
                            d.showMsg('pass', input_type, pass_info);
                            break;
                    }
                }
                else{
                    if(input_type != 'smscode' || (input_type == 'smscode' && d.exec != undefined)){
                        d.showMsg('err', input_type, 1)
                    }
                }
            }
        },
        verifyField: function(input_type, value){
            var d = this,
                pass_info = d.msg[input_type].length - 1,
                req_url = d.container.request[input_type],
                send_url = d.container.request[input_type+"_send"];
            d.toRequire(req_url, input_type+'='+value, function(res){
                var rs = JSON.decode(res);
                switch(rs.status){
                    case 'true':
                        if(send_url != undefined){
                            d.toRequire(send_url, input_type+'='+value, function(s_res){
                                var s_rs = JSON.decode(s_res);
                                if(s_rs.status == 'fail'){
                                    $$("body")[0].popWindow({
                                        win_type: 1,
                                        err: s_rs.err.title,
                                        msg: s_rs.err.reason
                                    });
                                }
                                else{
                                    //d.container.form.submit();
                                }
                            });
                        }
                        else{
                            d.showMsg('pass', input_type, pass_info);    
                        }
                        break;
                    case 'false':
                        d.showMsg('err', input_type, 3);
                        break;
                    default: break;
                }
            });
        },
        toRequire: function(url, data, callback){
            new Request({
                url: url,
                method: 'post',
                data: data,
                async: false,
                onSuccess: function(res){
                    if(res && callback != undefined){
                        callback(res);
                    }
                }
            }).send();
        },
        //0-attention, 1-pass, 2-error
        showMsg: function(status, type, col){
            var d = this,
                tip = d.container.tip.filter(function(el){
                    return el.getProperty('vtype') == type;
                });

            if(type == 'password'){
                var _cfpwd = d.container.form.getElements('input[vtype~=cfpwd]');
                if(_cfpwd.length){
                    if(status == 'pass')
                        _cfpwd[0].removeAttribute('disabled');
                    else
                        _cfpwd[0].set('disabled', 'true');
                }
            }
            var status_list = ['err','attention','pass'];
            for(var i=0; i<status_list.length; i++){
                if(tip[0].hasClass(status_list[i])){
                    tip[0].removeClass(status_list[i]);
                    break;
                }
            }
            tip[0].addClass(status).set('html', '<i></i>' + d.msg[type][col]);
            if(status == 'err' && d.exec != undefined){
                d.exec.stop();
            }

        },
        //specific function for validation
        isEmpty: function(value){
            return String(value).length > 0 ? false : true;
        },
        isRegExPassed: function(type, value){
            return this.regEx[type].test(String(value));
        },
        isSame: function(val1, val2){
            return val1 == val2;
        },
        toSend: function(input_type, _data){
            var d = this;
            var send_url = d.container.request[input_type+"_send"];
            if(send_url!=undefined){
                d.toRequire(send_url, _data, function(s_res){
                    var s_rs = JSON.decode(s_res);
                    if(s_rs.status == 'fail'){
                        $$("body")[0].popWindow({
                            win_type: 1,
                            err: s_rs.err.title,
                            msg: s_rs.err.reason
                        });
                    }
                    else{
                        d.container.form.submit();
                    }
                });
            }
        },
        toSendSms: function(input_type,value){
            var d = this;
            var button = d.container.btn_submit.getSiblings('p')[0].getChildren('input[type=button]')[0];
            if(button.length > 0){
                var SendMsg = function(event){
                    if(!d.countdown_switch){
                        if(event != undefined && event.type == 'click'){
                            var send_url = d.container.request[input_type+"_send"];
                            if(send_url!=undefined){
                                d.toRequire(send_url, input_type+'='+value, function(s_res){
                                    var s_rs = JSON.decode(s_res);
                                    if(s_rs.status == 'fail'){
                                        $$("body")[0].popWindow({
                                            win_type: 1,
                                            err: s_rs.err.title,
                                            msg: s_rs.err.reason
                                        });
                                    }
                                    else{
                                        //
                                    }
                                });
                            }
                        }
                        var second = d.container.wait;
                        button.set({
                            'class': 'lightgray',
                            'value': '('+ second-- +'秒)重发验证短信'
                        });
                        d.countdown_switch = true;
                        var timer = setInterval(function(){
                            if(second > 0){
                                button.set({
                                    'value': '('+ second-- +'秒)重发验证短信'
                                });
                            }
                            else{
                                clearInterval(timer);
                                d.countdown_switch = false;
                                button.set({
                                    'class': 'lightblue',
                                    'value': '重发验证短信'
                                });
                            }
                        }, 1000);
                    }
                };

                SendMsg();
                button.addEvent('click', function(e){
                    SendMsg(e);
                });
            }
        },
        //expanded function
        getActivateCode: function(){

        }
    }


    Element.implement({
        toValidate: function(opts, callback){
            var d = this,
                isSentText = false,
                container = {};
                //common property
                container.form = d;
                container.tip = d.getElements('span.info');
                container.request = opts.request;
                container.btn_submit = d.getElements('input[type=submit]');

            if(container.btn_submit.length > 0){
                container.btn_submit[0].addEvent('click', function(e){//e.stop();
                    container.textbox = d.getElements('li.text-wrap').getElements('input[vtype~=required]');
                    container.radio = d.getElements('input[type=radio][vtype~=required]');
                    container.checkbox = d.getElements('input[type=checkbox][vtype~=required]');
                    var v_form = new vform(container, e);
                    v_form.init();
                });
            }
            if(opts.text_blur){
                var input_text = d.getElements('li.text-wrap').getElements('input[vtype~=required]');
                if(input_text.length>0){
                    input_text.each(function(elm){
                        elm.addEvent('blur', function(){
                            container.textbox = this;
                            var v_form1 = new vform(container);
                            v_form1.init();
                        });
                    })
                    
                }
            }
            if(d.getElements('#j_smscode]').length>0){
                if(!isSentText){
                    isSentText = true;
                    container.wait = 60;
                    var v_form2 = new vform(container);
                    v_form2.toSendSms('smobile', $$("#j_mobile").length > 0 ? $$("#j_mobile")[0].get('html') : 0);
                }
            }
        },
        popWindow: function(args, callback){
            if($$("#popwindow").length < 1 && $$(".cover-layer").length < 1){
                var d = this,
                    ie6_bug = '<!--[if lte IE 6.5]><iframe src=\'javascript:"";\' style="width:3000px; height:30000px; position:absolute; top:0; left:0; z-index:-1; border:none; background:#000;"></iframe><![endif]-->',
                    cover = new Element('div', {
                        styles: {
                            width:"100%",
                            height:"100%",
                            overflow:'hidden',
                            position:"absolute",
                            left:"0",
                            top:"0",
                            zindex:"65958",
                            background:"#000",
                            opacity:"0.7",
                            filter:'alpha(opacity=30)'
                        },
                        'class': 'cover-layer',
                        html: ie6_bug
                    });
                //win_type 1:normal 2:process
                var _body;
                if(args.win_type == 1){
                    _body = '<p class="msg">'+ args.err +'<br>原因：<span>'+ args.msg +'</span></p>';
                    _body += '<p class="action"><input type="button" class="bluegrad shrink" vtype="undo" value="确定" /></p>';
                }
                else if(args.win_type == 2){
                    _body = '<p class="msg">'+ args.msg +'</p>';
                    _body += '<p class="action"><input type="button" class="bluegrad shrink" vtype="todo" value="是，保存" /><input type="button" class="graygrad shrink" vtype="undo" value="否" /></p>';
                }
                var _wrapper = new Element('div', {
                    id: 'popwindow',
                    styles:{
                        'z-index': '65958'
                    },
                    html: '<div class="title"><h4>友情提示</h4><a href="javascript:;" class="close"></a></div><div class="content">'+ _body +'</div>'
                });
                
                d.adopt(cover, _wrapper);
                adjustBox(cover, _wrapper);
                window.addEvents({
                    resize: function(){
                        adjustBox(cover, _wrapper);
                    },
                    scroll: function(){
                        adjustBox(cover, _wrapper);
                    }
                });
            }

            function adjustBox(cover, dialog){
                cover.setStyles({
                    'height': window.getScrollHeight(),
                    'left': 0,
                    'top': 0,
                    'background':'#000'
                });
                dialog.setStyles({
                    left: window.getWidth() / 2 - (dialog.getScrollWidth() / 2),
                    top: window.getScrollTop() + (window.getHeight() / 2 - (dialog.getScrollHeight() / 2))
                });
            }
            $$("#popwindow a.close", "#popwindow input[type=button][vtype=undo]").addEvent('click', function(){
                $$(".cover-layer, #popwindow").dispose();
            });
            $$("#popwindow input[type=button][vtype=todo])").addEvent('click', function(){
                $$(".cover-layer, #popwindow").dispose();
                if(callback != undefined){
                    callback();
                }
            });
        }
    });
})()