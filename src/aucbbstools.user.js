// ==UserScript==
// @name        英雄クロニクルLV30検索
// @namespace       http://d.hatena.ne.jp/withoutcane/
// @include     http://suc.au-chronicle.jp/*
// @match       http://suc.au-chronicle.jp/*
// @version     0.0.1
// @charset         UTF-8
// ==/UserScript==
(function () {
    //ここにコード
    var HOST = "http://suc.au-chronicle.jp";

    var main = function () {
        console.log('aucbbstools')
        setElement();
    };

    var setElement = function(){
        var a = "<div id='tools'><ul id='btns' class='bar-btn'><li class='main-btn' id='gobottom'><a title='記事下部へ'>記事下部へ</a></li></ul></div>";
        var b = "<>";
        $("div.bbs").prepend(a);
        $("#gobottom").click(function(evt){
            evt.preventDefault();
            console.log($('div.bbs-board-re:last'));
            var targetoffset = $('a[name="bbs_bottom"]').offset().top;
            console.log(targetoffset);
            window.scrollBy(0,targetoffset);
        });
     };

    var goBottom = function(target){
        var $obj = $(target);
        if($obj.length == 0) return;
        $obj.scrollTop($obj.scrollHeight);
    }

    //callback　debug用
    var finish = function(arg) {
        console.log("finish");
    };

    $(document).ready(function () {
        if($('div').is("#title") && $('div').is("#campbar-area")){
            //めんどくさいのでこれでいいや
            main();
        }
    });
}());

