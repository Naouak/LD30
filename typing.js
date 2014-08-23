var KeyLogger = function(){
    this._key = "";
    this.log = function(key){
        this._key+=key;
        console.log(this._key);
    };

    this.getString = function(){
        return this._key;
    };

    this.clear = function(){
        this._key = "";
    };
};

var check_string_with_logger = function(str1, str2){
    var i = 0;
    var j = 0;
    for(; i < str2.length; i++){
        if(str1[j] == str2[i]){
            j++;
            if(str1.length <= j){
                return -1;
            }
        }
    }
    return j;
};

var keylogger = new KeyLogger();

var strings = [
    "salut",
    "coucou",
    "j'ai faim",
    "il fait pas chaud",
    "pas faux"
];

var lockedString = -1;

var typing_event = function(e){
    var i = 0;
    keylogger.log(String.fromCharCode(e.keyCode));

    if(lockedString < 0) {
        for(i = 0; i < strings.length; i++){
            if(check_string_with_logger(strings[i],keylogger.getString())){
                lockedString = i;
                break;
            }
        }

        if(lockedString < 0){
            keylogger.clear();
            return;
        }
    }

    var strCheck = check_string_with_logger(strings[lockedString],keylogger.getString());
    if(strCheck == -1){
        alert("yeah");
        keylogger.clear();
        lockedString = -1;
    } else {

    }
};

document.onkeypress = typing_event;