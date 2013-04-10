// ==UserScript==
// @name		英雄クロニクルBBS通知
// @namespace		http://d.hatena.ne.jp/withoutcane/
// @include		http://suc.au-chronicle.jp/*
// @match 		http://suc.au-chronicle.jp/*
// @version		0.0.1
// @charset        	UTF-8
// ==/UserScript==

var bbs_url = "http://suc.au-chronicle.jp/web/forces/bbs_history?filter=12349";


var main = function () {
	getBbs(setElement);
};
var setElement = function(url){
	if(url == 'undefined' || url == null) {
		//なんもしない

	}else {
		var a = '<br><a href="'+url+'"> 掲示板ブックマーク1ページ目に新着記事があるようです</a>';
		$('div#title').append(a);
	}
};

var getBbs = function(callback){
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function(data) {
		if (xhr.readyState == 4) {
			if (xhr.status == 200) {
				var data = parseBbs(xhr.responseText);
				callback(data);
			} else {
				callback(null);
			}
		}
	}
	// Note that any URL fetched here must be matched by a permission in
	// the manifest.json file!
	xhr.open('GET', bbs_url, true);
	xhr.send();
};
var parseBbs = function(response){
	var b = $(response);
	var t = b.find('img[src*="bbs_res_new.gif"]').parent('td').children('a').attr('href');
	return t;
};

var finish = function(arg) {
	console.log("finish");
};

$(document).ready(function () {
	if($('div').is("#title") && $('div').is("#campbar-area")){
		//めんどくさいのでこれでいいや
		main();
	}
});