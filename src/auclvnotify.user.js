// ==UserScript==
// @name        英雄クロニクルBBS通知
// @namespace       http://d.hatena.ne.jp/withoutcane/
// @include     http://suc.au-chronicle.jp/*
// @match       http://suc.au-chronicle.jp/*
// @version     0.0.2
// @charset         UTF-8
// ==/UserScript==
(function () {
    //ここにコード
    var HOST = "http://suc.au-chronicle.jp";
    var before,after;

    var main = function () {
        before = getCharacterInfo(document);
        var link = $("a[title='元のキャラを見る']").attr("href");
        console.log("before:"+before);
        console.log(link);
        if(link){
            getOriginalCharacter(HOST+link,setElement);
        }
    };

    var setElement = function(before,after){
        console.log("setElement:"+before+"***"+after);
        if(after) {
            //リンク
            var a = ":元キャラ(LV:"+after.lv+",今期転生:"+after.loop+",残PP:"+after.pp+")";
            console.log('set:'+a);
            $('div.bartitle').append(a);           
        }
    };

    var getOriginalCharacter = function(url,callback){
        console.log("getOriginalCharacter:" + url);
        var targeturl = url;
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function(data) {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    after = getCharacterInfo(xhr.responseText);
                    console.log("before:"+before);
                    console.log("after:"+after);
                    callback(before,after);
                } else {
                    callback(null,null);
                }
            }
        }
        xhr.open('GET', url, true);
        xhr.send();
    };

    var getCharacterInfo = function(response){
        var b = $(response).find('div#charasheet');
        console.log(b);
        var lv = b.find('div.lv').text();
        var loop = b.find('span[title="今期転生回数"]').text();
        var pp = b.find('table#charasheet_status_ta2').find("tr:last").text();
        var obj = {
            lv:lv,
            loop:loop,
            pp:pp
        }; 
        return obj;
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

