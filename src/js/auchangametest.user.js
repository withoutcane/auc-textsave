// ==UserScript==
// @name        英雄クロニクルLV30検索
// @namespace       http://d.hatena.ne.jp/withoutcane/
// @include     http://suc.au-chronicle.jp/*
// @match       http://suc.au-chronicle.jp/*
// @version     0.0.1
// @charset         UTF-8
// ==/UserScript==


(function () {
	var logger = function(){
		var document_body = $(document).contents();
		var iframe = $("#remote_iframe_0");
		var contents = iframe.contents();

		console.log(contents.html());
	}

	var setElements = function(target){
		console.log("setElements");
		var parent = $(target);
		var element = '<div><br><ul id="hangamelog">';
		element += '<li><a>ログ表示</a></li>';
		element += '</ul></div>';
		$(target).append(element);
		$('#hangamelog').click(function () {
	        logger();
        });

	};

	$(document).ready(function () {
	    if($('div#title.t-force-prof-r')){
	        //めんどくさいのでこれでいいや
	        setElements('div#title.t-force-prof-r');
	    }
	});
}());