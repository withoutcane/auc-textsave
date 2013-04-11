// ==UserScript==
// @name		英雄クロニクルBBS通知
// @namespace		http://d.hatena.ne.jp/withoutcane/
// @include		http://suc.au-chronicle.jp/*
// @match 		http://suc.au-chronicle.jp/*
// @version		0.0.2
// @charset        	UTF-8
// ==/UserScript==

var HOST = "http://suc.au-chronicle.jp";
var INITBBSURL = "/web/forces/bbs_history";
var BBSURL = "/web/forces/bbs_history/1?filter=1234";
var UNDEF = "undefined";

var beforeForm = "";

var main = function () {
	getBbs(HOST+BBSURL,setElement);
};

var setElement = function(newbbs,nextpage){
	console.log("setElement:"+newbbs+"***"+nextpage);
	if(newbbs) {
		//リンク
		console.log('set:'+newbbs);
		if ($(document).is('div#bbsnotify')){
			//なんもしない
		}else{
			var a = '<div id="bbsnotify"><br><a href="'+newbbs+'"> 掲示板に新着記事があるようです</a></div>';
			$('div#title').append(a);			
		}
	} else if(nextpage) {
		//次のページを読みに行ってみる
		console.log('get:'+nextpage);
		getBbs(HOST+nextpage,setElement);
	}
};

var getBbs = function(url,callback){
	console.log("getBbs:" + url);
	var targeturl = url;
	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function(data) {
		if (xhr.readyState == 4) {
			if (xhr.status == 200) {
				var newbbs = getNewArticleUrl(xhr.responseText);
				var nextpage = getNextUrl(xhr.responseText);
				var filter = getFilter(xhr.responseText);
				console.log(filter);
				callback(newbbs,nextpage);
			} else {
				callback(null,null);
			}
		}
	}
	// Note that any URL fetched here must be matched by a permission in
	// the manifest.json file!
	xhr.open('GET', url, true);
	xhr.send();
};

var getNewArticleUrl = function(response){
	var b = $(response);
	var t = b.find('img[src*="bbs_res_new.gif"]').parent('td').children('a').attr('href');
	return t;
};

var getNextUrl = function(response){
	var b = $(response);
	var t = b.find('span.pager-rt').children('a').attr('href');
	return t;
};

//フィルタの設定状況取得用。実験的
var getFilter = function(response){
	var b = $(response);
	var a = jQuery.makeArray(b.find('div.mail-selector').find('input[type="checkbox"][checked="checked"]'));
	var t = "";
	console.log(a);
	for (var i in a) {
		t += a[i].value;
	};
	return t;
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