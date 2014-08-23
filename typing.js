var Game = function(){
    var scene = document.createElement("div");
    scene.className = "game";
    var keyLogger = new KeyLogger();
    var lockedString = -1;
    var last_char = 0;

    var characters = [
    ];


    this.getScene = function(){
        return scene;
    };

    this.generateCharacter = function(str){
        //@todo Générer des strings en fonction du niveau
        if(str === undefined){
            var strings  = ["coucou","tu veux voir ma ...","bouh","ahhhhhh !"];
            str = strings[Math.floor(strings.length * Math.random())];
        }


        var char = new Character(this, str,"assets/chartest.png");
        this.getCharacters().push(char);
        char.addToScene(this.getScene());
    };

    this.getCharacters = function(){
        return characters;
    };

    this.removeCharacter = function(character){
        var i = 0;
        var chars = this.getCharacters();
        for(i=0; i < chars.length; i++){
            if(chars[i] == character){
                chars.splice(i,1);
                break;
            }
        }
    };

    this.think = function(){
        var that = this;
        this.getCharacters().forEach(function(character){
            character.think(that, 1);
        });
    };

    this.render = function(){
        var that = this;
        this.getCharacters().forEach(function(character){
            character.render(that);
        });
    };

    this.loop = function(){
        this.think();
        this.render();
        last_char++;
        if(last_char == 30){
            this.generateCharacter();
            last_char=0;
        }
        requestAnimationFrame(this.loop.bind(this));
    };

    this.typingEvent = function(e){
        var i = 0;
        keyLogger.log(String.fromCharCode(e.keyCode));

        if(lockedString < 0) {
            for(i = 0; i < this.getCharacters().length; i++){
                if(this.getCharacters()[i].checkWithLogger(keyLogger)){
                    lockedString = i;
                    break;
                }
            }
            if(lockedString < 0){
                keyLogger.clear();
                return;
            }
        }

        var strCheck = this.getCharacters()[lockedString].checkWithLogger(keyLogger);
        if(strCheck == -1){
            keyLogger.clear();
            lockedString = -1;
        } else {

        }
    };

    //this.generateCharacter("salut");
    //this.generateCharacter("coucou");
    //this.generateCharacter("j'ai faim");
    //this.generateCharacter("il fait pas chaud");
    //this.generateCharacter("pas faux");
    //this.generateCharacter("!!!!");

    requestAnimationFrame(this.loop.bind(this));
    document.body.onkeypress = this.typingEvent.bind(this);
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

var Character = function(game, str, sprite){
    var dist = 0;
    this.speed = Math.round(Math.random()*2)+1;
    this._last_check = -1;
    this.dead = false;

    var div = document.createElement("div");
    div.className = "character";
    div.style.backgroundImage = "url("+sprite+")";
    div.style.backgroundSize = "contain";

    var textContainer = document.createElement("div");
    textContainer.className = "text_container";
    textContainer.innerText = str;
    div.appendChild(textContainer);


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

    this.addToScene = function(scene){
        scene.appendChild(div);
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
                    this.die();
                    this._last_check = -1;
                    return this._last_check;
                }
            }
        }
        this._last_check = j;
        return this._last_check;
    };

    this.die = function(){
        this.dead = true;
        div.parentNode.removeChild(div);
        game.removeCharacter(this);
    };

    this.think = function(game, delta){
        if(this.dead){
            return;
        }

        dist += this.speed*delta;
        div.style.top = Math.round(dist)+"px";
        div.style.zIndex = Math.round(dist);
        //GameOver conditions
        if(dist > 1000){
            this.die();
        }
    };

    this.render = function(game){
        div.style.top = dist;
    };
};

var game = new Game();
document.body.appendChild(game.getScene());
