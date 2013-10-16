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
        var bbs = "<div class='bbs-board'><div class='btn-box'><ul class='bar-btn'>";
        bbs += "<li class='main-btn gotop'><a title='最初の記事へ移動'>最初の記事</a></li>";
        bbs += "<li class='main-btn gobottom'><a title='最後の記事へ移動'>最後の記事</a></li>";
        bbs += "<li class='main-btn allres'><a title='全ての記事へレスする'>全記事レス</a></li>";
        bbs += "</ul></div></div><br>";
        var update = "<a class='gotop' title='最初の記事へ'>最初の記事</a><a class='gobottom' title='最後の記事へ'>最後の記事</a>";
        $("div.bbs:first").before(bbs);
        $("div.bbs-board-re:first").before(bbs);
        $("div.bbs-board-re:not(div.bbs-board-re:last):last").after(bbs);
        $(".gotop").click(function(evt){
            evt.preventDefault();
            scrollTarget('div.bbs-con:not(div.bbs-con:last):first');
        });
        $(".gobottom").click(function(evt){
            evt.preventDefault();
            scrollTarget('div.bbs-con:not(div.bbs-con:last):last');
        });
        $(".allres").click(function(evt){
            evt.preventDefault();
            allResponse();
        });
		// $('a.forceid').click(function(e){
		// 	e.preventDefault();
		// 	$.simplePopup();
		// });
     };

    var scrollTarget = function(target){
        var target = $(target);
        var targetoffset = target.offset().top;
        var scroll_top = $(document).scrollTop();
        window.scrollBy(0,targetoffset-scroll_top);
    };

    var getResText = function(map) {
        var texts = "";
        for(var i in map) {
            var text = ">>" + i + map[i].name + "\n";
            var splittext = map[i].content.split(/\r\n|\r|\n/);
            for (var j in splittext) {
                var target = splittext[j].replace(/^\s*(.*)/,"$1");
                if (target != "") text += ">" + target + "\n";
            }
            texts += text + "\n\n"; 
        }
        return texts;
    };

    var allResponse = function(){
        var forceid = $("div.forceid").text();
        var target = $("div.bbs-board-re:has(span.forceid:contains("+ forceid + ")):not(div.bbs-board-re:last):last ~ div.bbs-board-re");
        var map = {};
        target.each(function(){
            var res_no = $(this).find("span.res-no").text();
            var name = $(this).find("span.bbs-force").text();
            var id = $(this).find("span.forceid").text();
            var content = $(this).find("td.td_b2").text();
            map[res_no] = {
                name:name,
                id:id,
                content:content
            };
        });
        console.log(map);
        var texts = getResText(map);
        $("div.textarea_box").find("textarea#add_comment_reply_text").val(texts);
        scrollTarget("div.textarea_box");
    };

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

