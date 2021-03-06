var Game = function(){
    var scene = document.createElement("div");
    scene.className = "game";

    var textContainer = document.createElement("div");
    textContainer.className = "mainTextContainer";

    var scoreContainer = document.createElement("div");
    scoreContainer.className = "scoreContainer";

    var score = 0;
    var level = 1;
    var exp = 0;

    var keyLogger = new KeyLogger(this);
    var lockedString = -1;
    var last_char = 0;

    var characters = [];


    this.getKeyLogger = function(){
        return keyLogger;
    };

    this.getScene = function(){
        return scene;
    };

    this.getMainTextContainer = function(){
        return textContainer;
    };
    this.getLevel = function(){
        return level;
    };
    this.reportDeath = function(character){
        exp += character.getString().length;
        console.log(exp);
        level = Math.floor(exp/100);
    };

    this.generateCharacter = function(str){
        //@todo Générer des strings en fonction du niveau
        if(str === undefined){
            var strings  = wordlist;
            str = strings[Math.floor(strings.length * Math.random())];
        }


        var char = new Character(this, str,"assets/chartest2.png");
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
                if(lockedString == i){
                    lockedString = -1;
                }
                if(i < lockedString){
                    lockedString--;
                }
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
        if(last_char == 100){
            this.generateCharacter();
            last_char=0;
        }
        requestAnimationFrame(this.loop.bind(this));
    };

    this.typingEvent = function(e){
        e.preventDefault();
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

        if(lockedString >= this.getCharacters().length){
            return;
        }

        var strCheck = this.getCharacters()[lockedString].checkWithLogger(keyLogger);
        if(strCheck == -1){
            keyLogger.clear();
            lockedString = -1;
        }
    };

    this.addPointsToScore = function(points){
        score+= points;
        scoreContainer.innerHTML = score+" points";
    };

    requestAnimationFrame(this.loop.bind(this));
    document.body.onkeypress = this.typingEvent.bind(this);
    document.body.appendChild(textContainer);
    document.body.appendChild(scoreContainer);
};

var KeyLogger = function(game){
    this._key = "";
    this.log = function(key){
        this._key+=key;
    };

    this.getString = function(){
        return this._key;
    };

    this.clear = function(){
        this._key = "";
        game.getMainTextContainer().innerHTML = "";
    };
};

var Character = function(game, str, sprite){
    var dist = 0;
    this.speed = Math.round(Math.random()*2)+1;
    this._last_check = -1;
    this.dead = false;

    var div = document.createElement("div");
    div.className = "character";
    div.style.left = (Math.floor(Math.random()*80)+10)+"%";

    var spriteContainer = document.createElement("div");
    spriteContainer.className = "sprite";
    spriteContainer.style.backgroundImage = "url("+sprite+")";
    div.appendChild(spriteContainer);

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
        div.className = "character lock";
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
                    game.addPointsToScore(Math.round(10000*j*j/logger.getString().length));
                    game.reportDeath(this);
                    this.die();
                    game.getMainTextContainer().innerHTML = "";
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
        if(this.isLocked()){
            this._last_check = -1;
            game.getKeyLogger().clear();
        }
    };

    this.think = function(game, delta){
        if(this.dead){
            return;
        }

        dist += this.speed*delta*(1+game.getLevel()/10);
        div.style.top = Math.round(dist)+"px";
        div.style.zIndex = Math.round(dist);
        //GameOver conditions
        if(dist > 768){
            this.die();
        }
    };

    this.render = function(game){
        div.style.top = dist;
        var text = "<strong>"+str+"</strong>";
        if(this._last_check > -1){
            text = str.substr(0,this._last_check)+"<strong>"+str.substr(this._last_check)+"</strong>";
            game.getMainTextContainer().innerHTML = text;
        }
        textContainer.innerHTML = text;
    };
};

var game = new Game();
document.querySelector(".game-container").appendChild(game.getScene());
