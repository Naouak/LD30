var Game = function(){
    var scene = document.createElement("div");
    scene.className = "game";

    var characters = [
        new Character("salut"),
        new Character("coucou"),
        new Character("j'ai faim"),
        new Character("il fait pas chaud"),
        new Character("pas faux")
    ];

    this.getScene = function(){
        return scene;
    };

    this.generateCharacter = function(){
        //@todo Générer des strings en fonction du niveau
        //@todo Ajouter les personnages dans la scene
    };

    this.getCharacters = function(){
        return characters;
    };

    this.think = function(){
        this.getCharacters().forEach(function(character){
            character.think();
        });
    };

    this.render = function(){

    };

    this.loop = function(){
        this.think();
        this.render();
        requestAnimationFrame(this.loop.bind(this));
    };

    requestAnimationFrame(this.loop.bind(this));
};

var KeyLogger = function(){
    this._key = "";
    this.log = function(key){
        this._key+=key;
    };

    this.getString = function(){
        return this._key;
    };

    this.clear = function(){
        this._key = "";
    };
};

var Character = function(str, sprite){
    var dist = 0;
    var speed = 1;
    this._last_check = -1;

    this._lock = false;

    this.getString = function(){
        return str;
    };

    this.lock = function(){
        this._lock = true;
    };

    this.isLocked = function(){
        return this._lock;
    };

    this.checkWithLogger = function(logger){
        var i = 0;
        var j = 0;
        for(; i < logger.getString().length; i++){
            if(str[j] == logger.getString()[i]){
                if(!this.isLocked()){
                    this.lock();
                }
                j++;
                if(str.length <= j){
                    this._last_check = -1;
                    return this._last_check;
                }
            }
        }
        this._last_check = j;
        return this._last_check;
    };

    this.die = function(){
        //@todo
    };

    this.think = function(game, delta){
        dist = speed*delta;

        //GameOver conditions
        if(dist > 1000){
            this.die();
        }
    };

    this.render = function(game){

    };
};



var keylogger = new KeyLogger();

var strings = [
    new Character("salut"),
    new Character("coucou"),
    new Character("j'ai faim"),
    new Character("il fait pas chaud"),
    new Character("pas faux")
];

var lockedString = -1;

var typing_event = function(e){
    var i = 0;
    keylogger.log(String.fromCharCode(e.keyCode));

    if(lockedString < 0) {
        for(i = 0; i < strings.length; i++){
            if(strings[i].checkWithLogger(keylogger)){
                lockedString = i;
                break;
            }
        }
        if(lockedString < 0){
            keylogger.clear();
            return;
        }
    }

    var strCheck = strings[lockedString].checkWithLogger(keylogger);
    if(strCheck == -1){
        alert("yeah");
        keylogger.clear();
        lockedString = -1;
    } else {

    }
};


var game = new Game();
document.body.appendChild(game.getScene());

// Le temps de faire des tests
document.onkeypress = typing_event;