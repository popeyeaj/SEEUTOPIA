(function(){
    window.addEvent('domready', function(){
        if($$("div.qn-wrapper").length){
            var qN = new questionNair(
            {
                'parts': $$("div.qn-wrapper .question"),
                'hybird': $$("div.qn-wrapper dl"),
                'part_score': [5, 10],
                'answer': [[1],[4],[1],[2,3],[3],[2],[3],[1,2,3,4],[4],[1],[1],[1,3],[1],[1,3],[1,2,4]]
            });
            $$("div.qn-wrapper .button A")[0].addEvent('click', function(){
                qN.init();
            });
        }
    });


})()

function questionNair(args){
    this.hybird_group = args['hybird'];
    this.parts = args['parts'];
    this.part_score = args['part_score'];
    this.answer = args['answer'];
}
questionNair.prototype = {
    constructor: questionNair,
    getSum: function(){
        var d = this,
            i = 0,
            sum = 0;
        d.parts.each(function(part, pdx){
            part.getElements('dl').each(function(wrapper, wdx){
                var _answer = [],
                    answer = [];
                wrapper.getElements('input').each(function(cell, cdx){
                    if(cell.checked == true){
                        _answer.push(cdx);
                    }
                });
                d.answer[i].each(function(arr){
                    answer.push(arr-1);
                });
                if(_answer.toString() === answer.toString()){
                    sum += d.part_score[pdx];
                }
                i++;
            });
        });
        return sum;
    },
    isAllChosen:function(){
        var d = this,
            checked = true;
        d.hybird_group.each(function(wrapper){
            if(wrapper.getElements('input').filter(function(elm){
                return elm.checked == false;
            }).length == wrapper.getElements('input').length){
                checked = false;
            }
            if(!checked)
                return false;
        });
        return checked;
    },
    init:function(){
        var d = this,
            origin_url = location.href;

        if(d.isAllChosen()){
            window.location.href = "http://www2.shopex.cn/customer-download.html?target_name=电商达人秀&referer_url=score"+ d.getSum() +"&target_download=" + origin_url;
        }
        else{
            alert("您需要回答完所有题目才可以提交。");
        }
    }
}