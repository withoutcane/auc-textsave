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
    var before,after;
    var charalist = {};
    //逆引リスト作らないとダメそう
    var reverselist = {};
    var flag = false;

    var main = function () {
        setElement();
//        ipop();
    };

    var setElement = function(){
        var a = "<li class='main-btn' id='lvcheck'><a title='部隊LVチェック'>部隊LVチェック</a></li>";
        var ipop = '<div id="ipop"><div id="ipop_close">☓</div><div id="ipop_title">部隊LVチェック</div><div id="ipop_main"><ul></ul></div></div>';
        var ipopCss = {
            width: "300px",
            height: "200px",
            position: "absolute",
            display: "none",
            padding: 0,
            overflow: "auto",
            color: "#fff",
            backgroundColor: "#563022",
            border: "1px solid #aaa",
            "z-index": 9999,
            "-webkit-border-radius": "10px"
        };
        var ipopTitleCss = {
            backgroundColor: "#664032",
            cursor: "move",
            "-webkit-border-radius": "10px"
        };
        var ipopCloseCss = {
            float: "right",
            cursor: "pointer",
            "-webkit-border-radius": "10px"
        };
        var ulCss = {
            "line-height":"4em"
        };
        $("div#force_box_2").find("div.baropen").find("ul.bar-btn").find("li.main-btn").append(a);
        $("div:last").after(ipop);
        $("div#ipop").css(ipopCss);
      　　$("div#ipop_title").css(ipopTitleCss);
        $("div#ipop_close").css(ipopCloseCss);
        $("div#ipop_main ul").css(ulCss);
        $("#lvcheck").click(function(){
            executeCheck();
        });
     };

     var executeCheck = function(){
        ipop();
        if(!flag){
            flag = true;
            getForceMemberList(document);
            for(var target in charalist){
                getForceCharacter(
                    target,
                    getOriginalCharacter,lvCheck);                            
            }
        }
     };

    var getForceCharacter = function(url,callback1,callback2){
        console.log("getForceCharacter:" + url);
        var targeturl = url;
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function(data) {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    var status = getCharacterInfo(xhr.responseText);
                    var link = $(xhr.responseText).find("a[title='元のキャラを見る']").attr("href");
                    reverselist[link] = targeturl;
                    charalist[targeturl].before = status;
                    charalist[targeturl].originallink = link;
                    console.log(link);                    
                    if(link){
                        callback1(link,callback2);
                    }
                } else {
//                    callback(null,null);
                }
            }
        }
        xhr.open('GET', url, true);
        xhr.send();
    };

    var getOriginalCharacter = function(url,callback){
        console.log("getOriginalCharacter:" + url);
        var targeturl = url;
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function(data) {
            if (xhr.readyState == 4) {
                if (xhr.status == 200) {
                    var status = getCharacterInfo(xhr.responseText);
                    var forcelink = reverselist[targeturl];
                    charalist[forcelink].after = status;
                    console.log(charalist[forcelink]);
                    callback(forcelink);
                } else {
                    //callback(null,null);
                }
            }
        }
        xhr.open('GET', url, true);
        xhr.send();
    };

    var getForceMemberList = function(response){
        var mononame = $(response).find("div#force_list").find("div.name a");
        var array = jQuery.makeArray(mononame);
        for (var i = array.length - 1; i >= 0; i--) {
            var target = array[i].href;
            charalist[target] = {name:array[i].innerText,forcelink:array[i].href};
        };
        console.log(charalist);
    };

    var getCharacterInfo = function(response){
        var b = $(response).find('div#charasheet');
        console.log(b);
        var lv = b.find('div.lv').text();
        var loop = b.find('span[title="今期転生回数"]').text();
        var pp = b.find('table#charasheet_status_ta2').find("tr:last").text();
        var nickname = b.find('div.nickname').text();
        var name = b.find('div.name').text();
        var cost = b.find('div.cost').text();
        var forcename = b.find('div.forcename').text();
        var guild = b.find('div.guild').text();
        var obj = {
            lv:lv,
            loop:loop,
            pp:pp,
            nickname:nickname,
            name:name,
            cost:cost,
            forcename:forcename,
            guild:guild
        }; 
        console.log(obj);
        return obj;
    };

    //popup。車輪の再開発だけど読み込むライブラリ増やしたくないので。
    var ipop = function() {
        var wx, wy;    // ウインドウの左上座標

        // ウインドウの座標を画面中央にする。
        wx = $(document).scrollLeft() + ($(window).width() - $('#ipop').outerWidth()) / 2;
        if (wx < 0) wx = 0;
        wy = $(document).scrollTop() + ($(window).height() - $('#ipop').outerHeight()) / 2;
        if (wy < 0) wy = 0;

        // ポップアップウインドウを表示する。
        $('#ipop').css({top: wy, left: wx}).fadeIn(100);

        // 閉じるボタンを押したとき
        $('#ipop_close').click(function() {$('#ipop').fadeOut(100);});

        // タイトルバーをドラッグしたとき
        $('#ipop_title').mousedown(function(e) {
          var mx = e.pageX;
          var my = e.pageY;
          $(document).on('mousemove.ipop', function(e) {
            wx += e.pageX - mx;
            wy += e.pageY - my;
            $('#ipop').css({top: wy, left: wx});
            mx = e.pageX;
            my = e.pageY;
            return false;
          }).one('mouseup', function(e) {
            $(document).off('mousemove.ipop');
          });
          return false;
        });
    };

    var popMessage = function(message){
        $('#ipop_main').append("<li>"+message+"</li>");
    };

    var lvCheck = function(url){
        var target = charalist[url];
        var message = "<a href='" + target.originallink + "' target='_blank'>";
        message += target.name + ":";
        message += "LV:" + target.before.lv + "/" + target.after.lv;
        message += ",LOOP:" + target.before.loop + "/" + target.after.loop;
        message += ",PP:" + target.before.pp + "/" + target.after.pp;
        message += "</a>"
        console.log(message);
        console.log(JSON.stringify(target));
        if(target.after.lv == 30 && (target.before.loop < target.after.loop || (target.before.loop == target.after.loop && target.before.lv < target.after.lv)) ) {
            popMessage(message);
        }
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

