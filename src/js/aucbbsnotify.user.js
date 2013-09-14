// ==UserScript==
// @name		英雄クロニクルBBS通知
// @namespace		http://d.hatena.ne.jp/withoutcane/
// @include		http://suc.au-chronicle.jp/*
// @match 		http://suc.au-chronicle.jp/*
// @version		0.0.2
// @charset        	UTF-8
// ==/UserScript==
(function () {
	//ここにコード
	var HOST = "http://suc.au-chronicle.jp";
	var INITBBSURL = "/web/forces/bbs_history";
	var BBSURL = "/web/forces/bbs_history/1?filter=1234";
	var UNDEF = "undefined";

	var beforeForm = "";

	var main = function () {
		getBbs(HOST+BBSURL,setElements);
	};

	var setElements = function(){
		var nexturl = unreadState.getNextUrl();
		console.log("setElements"+nexturl);
		if(unreadState.getFlag()){
			var element = '<div><br><ul id="bbsnotifylist">';
			if (unreadState.getBookmark()) element += '<li"><a href="' + unreadState.getBookmark() +'"> ブックマークに新着記事があるようです</a></li>';
			if (unreadState.getNotBookmark()) element += '<li"><a href="' + unreadState.getNotBookmark() +'"> 掲示板に新着記事があるようです</a></li>';
			element += '</ul></div>';
			$('div#title').append(element);
		} else if(nexturl) {
			console.log('get:'+ nexturl);
			getBbs(HOST+nexturl,setElements);
		}
	};

	var getBbs = function(url,callback){
		console.log("getBbs:" + url);
		var targeturl = url;
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function(data) {
			if (xhr.readyState == 4) {
				if (xhr.status == 200) {
					getNewArticle(xhr.responseText);

					var filter = getFilter(xhr.responseText);
					console.log(filter);
					callback();
				} else {
					console.log("getBbs failed");
				}
			}
		}
		// Note that any URL fetched here must be matched by a permission in
		// the manifest.json file!
		xhr.open('GET', url, true);
		xhr.send();
	};

	//未読状況を管理するクラス
	var Unread = function(){
		var flag = false;
		var bookmarkUrl;
		var notbookmarkUrl;
		var nextUrl;
		this.setNextUrl = function(url){
			if (!nextUrl) nextUrl = url;
			setFlag();
			return nextUrl;
		};
		this.getNextUrl = function(){
			var next = nextUrl;
			nextUrl = null;
			return next;
		};
		this.setBookmark = function(url){
			if (!bookmarkUrl) bookmarkUrl = url;
			setFlag();
			return bookmarkUrl;
		};
		this.setNotBookmark = function(url){
			if (!notbookmarkUrl) notbookmarkUrl = url;
			setFlag();
			return notbookmarkUrl;
		}
		this.getFlag = function(){
			return flag;
		};
		this.getBookmark = function(){
			return bookmarkUrl;
		};
		this.getNotBookmark = function(){
			return notbookmarkUrl;
		};
		var setFlag = function(){
			if(bookmarkUrl && notbookmarkUrl) {
				flag = true;
			} else if((!bookmarkUrl || !notbookmarkUrl) && !nextUrl ) {
				flag = true;
			}
			return flag;
		};
	};

	var getNewArticle = function(response){
		//掲示板全体を取らないとだめよね
		var b = $(response);
		var tr = b.find('table.mail-list-table tr');
		//tr毎にぶん回し
		for (var i = tr.length - 1; i >= 0; i--) {
			var url = $(tr[i]).find('img[src*="bbs_res_new.gif"]').parent('td').children('a').attr('href');
			if (url) {
				var bookmarkFlag = $(tr[i]).find('span.text10').is(':contains("ブックマーク")');
				if(bookmarkFlag){
					unreadState.setBookmark(url);
				}else{
					unreadState.setNotBookmark(url);
				}
			}
			console.log("test:"+url);
		}
		//nextUrlをセット
		var next = b.find('span.pager-rt').children('a').attr('href');
		if(next) unreadState.setNextUrl(next);
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
	var unreadState = new Unread(HOST);

	$(document).ready(function () {
		if($('div').is("#title") && $('div').is("#campbar-area")){
			//めんどくさいのでこれでいいや
			main();
		}
	});
}());

