// ==UserScript==
// @name		英雄クロニクル台詞保存
// @namespace		http://d.hatena.ne.jp/withoutcane/
// @include		http://suc.au-chronicle.jp/*edit_serif*
// @match 		http://suc.au-chronicle.jp/*edit_serif*
// @version		0.0.1
// @charset        	UTF-8
// ==/UserScript==
var savelist;
var parser;
var setter;
var init = 0;

if (init > 0) window.localStorage.removeItem('ats_data');

function main() {
    savelist = new SaveList();
    parser = new ParseDocument();
    setter = new SetElement();
    savelist.load();
    setter.setElement();
};

function testCase() {
    parser.parse();
    console.dir(parser);
    savelist.addInputSet(parser.character, 'test', parser.list);
    console.dir(savelist);
    setter.setElement([]);
};

/*
SaveSet
*/
var SetElement = function () {
    this.setElement = function (array) {
        var character = $('div.name').text();
        $('#ats_form').remove();
        var form = '<form name="ats_form" id="ats_form">';
        form += '<select name="ats_list" id="ats_list">';
        var optionCount = 0;
        if (savelist != null) {
            var itemlist = savelist.getSaveSetList();
            for (var i = 0; i < itemlist.length; i++) {
                if (itemlist[i].character == character) {
                    form += '<option value=' + i + '>' + itemlist[i].name + '</option>';
                    optionCount++;
                }
            }
        }
        form += '</select>';
        form += '<input type="button" value="追加する" id="ats_add"/>'
        form += '<input type="button" value="読み込む" id="ats_load"/>'
        form += '<input type="button" value="書き込む" id="ats_save"/>'
        form += '<input type="button" value="削除する" id="ats_delete"/>'
        form += '<input type="button" value="ファイル保存する" id="ats_download"/>'
        form += '</form>';
        $('div.cut-in-imgb').append(form);
        $('#ats_add').click(function () {
            setter.atsAdd();
            setter.setElement();
        });
        $('#ats_load').click(function () {
            setter.atsLoad();
            setter.setElement();
        });
        $('#ats_save').click(function () {
            setter.atsSave();
            setter.setElement();
        });
        $('#ats_delete').click(function () {
            setter.atsDelete();
            setter.setElement();
        });
        $('#ats_download').click(function () {
            setter.atsDownload();
            setter.setElement();
        });
        if (optionCount == 0){
            var valid = window.confirm("台詞セットがひとつも保存されていません。保存しますか？");
            if (valid) {
                setter.atsAdd();
                setter.setElement();
            }                            
        }        
    };
    this.setValue = function (array) {
        for (var i = 0; i < array.length; i++) {
            var target = '*[name=' + array[i].name + ']';
            var targetElement = $(target);
            targetElement.val(array[i].value);
        }
    };
    this.atsAdd = function () {
        var name = window.prompt("追加する台詞セットの名称を入力してください", "");
        if (name == "" || name == null) name = 'defult';
        parser.parse();
        savelist.addInputSet(parser.character, name, parser.list);
    };
    this.atsLoad = function () {
        var valid = window.confirm("台詞セットを読み込みますか");
        if (valid) {
            var character = $('div.name').text();
            var name = $('#ats_list option:selected').text();
            var target = savelist.getSaveSet(character, name);
            if (target >= 0) {
                var array = savelist.list[target].getInputList();
                this.setValue(array);
            }
        }
    };
    this.atsSave = function () {
        var valid = window.confirm("台詞セットを書き込みますか");
        if (valid) {
            var character = $('div.name').text();
            var name = $('#ats_list option:selected').text();
            if (name == "" || name == null) name = 'defult';
            parser.parse();
            savelist.addInputSet(parser.character, name, parser.list);
        }
    };
    this.atsDelete = function () {
        var valid = window.confirm("台詞セットを削除しますか");
        if (valid) {
            var character = $('div.name').text();
            var name = $('#ats_list option:selected').text();
            savelist.removeSaveSet(character, name);
        }
    };
    this.atsDownload = function () {
        var valid = window.confirm("ファイル保存しますか");
        if (valid) {
            var filename = "auctextsave.txt";
			var text = savelist.jsonstr;
            saveText(text,filename);
        }
    };
};

var saveText = function(text, filename) {
    var a = document.createElement('a');
    a.href = 'data:text/plain,' + encodeURIComponent(text);
    a.download = filename;
    var evt = document.createEvent('MouseEvents');
    evt.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, true, false, false,  0, null);
    a.dispatchEvent(evt);
}

var ParseDocument = function () {
    this.character = "";
    this.list = [];
    this.parse = function () {
        this.character = $('div.name').text();
        this.list = [];
	this.list2 = [];
        var textarea = $('textarea');
        var selectbox = $('select');
        for (var i = 0; i < textarea.length; i++) {
            this.list.push({
                name: textarea[i].name,
                value: textarea[i].value
            });
        }
        for (var i = 0; i < selectbox.length; i++) {
            this.list.push({
                name: selectbox[i].name,
                value: selectbox[i].value
            });
        }
		this.list.sort();
    };
};

var InputSet = function (name, value) {
    this.name = name;
    this.value = value;
};

var InputSetList = function () {
    this.list = [];
    this.pushItem = function (name, value) {
        var item = new InputSet(name, value);
        this.list.push(item);
    }
    this.initItem = function () {
        this.list = [];
    }
};

var SaveSet = function () {
    this.character = "";
    this.name = "";
    this.inputlist = new InputSetList;
    this.setCharacter = function (character) {
        this.character = character;
    };
    this.setName = function (name) {
        this.name = name;
    };
    this.pushInputSet = function (name, value) {
        this.inputlist.pushItem(name, value);
    };
    this.initInputSet = function () {
        this.inputlist.initItem();
    };
    this.getInputList = function () {
        var array = [];
        for (var i = 0; i < this.inputlist.list.length; i++) {
            var data = {
                name: this.inputlist.list[i].name,
                value: this.inputlist.list[i].value
            };
            array.push(data);
        }
		array.sort();
        return array;
    }
    this.pushInputSetArray = function (array) {
        for (var i = 0; i < array.length; i++) {
            this.pushInputSet(array[i].name, array[i].value);
        }
    };
};

var SaveList = function () {
    this.list = [];
	this.jsonstr = "";
    var key = 'ats_data';
    this.save = function () {
		this.list.sort();
		this.jsonstr = JSON.stringify(this.list, null, "    ");
        GM_setValue(key, JSON.stringify(this));
    };
    this.load = function () {
        var jsonstr = GM_getValue(key);
        if (jsonstr == null) {
            this.save();
        } else {
            this.loadJson(jsonstr);
        }
        this.save();
    };
    this.addSaveSet = function (character, name) {
        if (this.getSaveSet(character, name) < 0) {
            var saveset = new SaveSet();
            saveset.setCharacter(character);
            saveset.setName(name);
            this.list.push(saveset);
        }
        this.save();
        return this.getSaveSet(character, name);
    };
    this.removeSaveSet = function (character, name) {
        var target = this.getSaveSet(character, name);
        if (target >= 0) {
            this.list.splice(target, 1);
        }
        this.save();
        return this.getSaveSet(character, name);
    };

    this.getSaveSetList = function () {
        var list = [];
        for (var i = 0; i < this.list.length; i++) {
            var data = {
                character: this.list[i].character,
                name: this.list[i].name
            }
            list.push(data);
        }
        return list;
    };
    this.getInputList = function (character, name) {
        var array = [];
        var target = getSaveSet(character, name);
        if (target >= 0) return this.list[target].inputlist.getInputList();
        return null;
    };
    this.getSaveSet = function (character, name) {
        for (var i = 0; i < this.list.length; i++) {
            if (this.list[i].character == character && this.list[i].name == name) {
                return i;
            }
        }
        return -1;
    };
    this.addInputSet = function (character, name, array) {
        var savesetnum = this.addSaveSet(character, name);
        this.list[savesetnum].initInputSet();
        this.list[savesetnum].pushInputSetArray(array);
        this.save();
    };
    this.loadJson = function (str) {
        var array = [];
        var target = JSON.parse(str);
        for (var i = 0; i < target.list.length; i++) {
            this.addInputSet(target.list[i].character, target.list[i].name, target.list[i].inputlist.list)
        }
    };
};


function initGM() {
    if (!this.GM_getValue || this.GM_getValue.toString().indexOf("not supported") > -1) {
        this.GM_getValue = function (key, def) {
            return window.localStorage.getItem(key);
        };
        this.GM_setValue = function (key, value) {
            return window.localStorage.setItem(key, value);
        };
    }
    if (typeof (this.GM_addStyle) == 'undefined') {
        this.GM_addStyle = function (styles) {
            var S = document.createElement('style');
            S.type = 'text/css';
            var T = '' + styles + '';
            T = document.createTextNode(T)
            S.appendChild(T);
            var head = document.getElementsByTagName('head');
            head = head[0]
            head.appendChild(S);
            return;
        }
    }
};

$(document).ready(function () {
    initGM();
    main();
});