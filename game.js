window.onload = function() {
    var screenSize = { x: window.innerWidth, y: window.innerHeight };
    var game = new Phaser.Game(screenSize.x, screenSize.y, Phaser.AUTO,  '', 
                               { preload: preload, create: create, update: update, render: render });


    
    function Character(){
        this.position = { x: 0, y: 0 };
        this.health = 100;
        this.alive = true;
        this.maxSpeed = 130;
        this.accelerate = 5;
        this.speed = 0;
    }
    
    
    Character.prototype = {
        init: function() {
            this.spawn(this.position.x, this.position.y);
            this.setAnimation();
            game.physics.enable(this.object, Phaser.Physics.ARCADE);
        },
        update: function(){
            
        },
        spawn: function (x, y) {
            this.position = { x: x, y: y };
            this.object = game.add.sprite(this.position.y,this.position.x, this.spriteName, this.spriteName);
        },
        setAnimation: function (){
            this.object.animations.add('move_bottom', this.animations.move_bottom, 10, true);
            this.object.animations.add('move_left', this.animations.move_left, 8, true);
            this.object.animations.add('move_right', this.animations.move_right, 8, true);
            this.object.animations.add('move_top', this.animations.move_top, 8, true);
        },
        goBottom: function (){
            if(this.accelerate!=false){
                this.object.body.velocity.x = 0;
                if(this.speed < this.maxSpeed)
                    this.speed += this.accelerate;
            } else this.speed = this.maxSpeed;
            this.object.animations.play('move_bottom');
            this.object.body.velocity.y = this.speed;
        },
        goTop: function (){
            if(this.accelerate!=false){
                this.object.body.velocity.x = 0;
                if(this.speed < this.maxSpeed)
                    this.speed += this.accelerate;
            } else this.speed = this.maxSpeed;
            this.object.animations.play('move_top');
            this.object.body.velocity.y = -this.speed;
        },
        goRight: function (){
            if(this.accelerate!=false){
                this.object.body.velocity.y = 0;
                if(this.speed < this.maxSpeed)
                    this.speed += this.accelerate;
            } else this.speed = this.maxSpeed;
            this.object.body.velocity.y = 0;
            if(this.speed < this.maxSpeed)
                this.speed += this.accelerate;
            this.object.animations.play('move_right');
            this.object.body.velocity.x = this.speed;
        },
        goLeft: function (){
            if(this.accelerate!=false){
                this.object.body.velocity.y = 0;
                if(this.speed < this.maxSpeed)
                    this.speed += this.accelerate;
            } else this.speed = this.maxSpeed;
            this.object.animations.play('move_left');
            this.object.body.velocity.x = -this.speed;
        },
        goStop: function(){
            if(this.accelerate!=false){
                if(this.speed > 0)
                    this.speed -= this.accelerate;
                if(this.speed < 0)
                    this.speed = 0;
            } else this.speed = 0;
            
            // "Легкая" остановка
            if(this.object.body.velocity.x > 0)
                this.object.body.velocity.x = this.speed;
            if(this.object.body.velocity.y > 0)
                this.object.body.velocity.y = this.speed;
            if(this.object.body.velocity.x < 0)
                this.object.body.velocity.x = -this.speed;
            if(this.object.body.velocity.y < 0)
                this.object.body.velocity.y = -this.speed;
            
            if(this.object.body.velocity.y == 0 && this.object.body.velocity.x == 0)
                this.object.animations.stop();
        }
    };
    
    function Enemy(x,y) { // создание врагов
        Character.apply(this, arguments);
        this.spriteName = 'enemy1';
        this.animations = {                             // создаем анимации
            move_bottom: ['enemy1','enemy1_bottom'],
            move_top: ['enemy1_top','enemy1_top2'],
            move_left: ['enemy1_left', 'enemy1_left2'],
            move_right: ['enemy1_right', 'enemy1_right2']
        };
        this.position = { x: x, y: y };
        this.targets = [];
        this.accelerate = false;
        
        this.areaVisibility = {
            top: 300,
            bottom: 300,
            left: 300,
            right: 300
        };
        this.oversight = 40;
        
        this.init();
        
        this.object.body.immovable = true;
    }
    
    Enemy.prototype = Object.create(Character.prototype); // Наследуем Character
    Enemy.prototype.constructor = Enemy;
    
    Enemy.prototype.update = function(){
        for (var i = 0; i < this.targets.length; i++){
            if(this.visibility(this.targets[i])){               // если видит цель
                console.log(this.checkNearby(this.targets[i])); // если рядом с целью
                if(this.checkNearby(this.targets[i])){
                    this.goStop();
                    break;
                }
                if((this.targets[i].object.y + this.object.body.width) > (this.object.y + this.object.body.width) &&
                    (this.targets[i].object.y + this.object.body.width) > (this.object.y + this.object.body.width - this.oversight)){
                    //console.log('GO BOTTOM!');
                    this.goBottom();
                } else
                if((this.targets[i].object.y - this.object.body.width) < (this.object.y + this.object.body.width) &&
                    (this.targets[i].object.y - this.object.body.width) < (this.object.y + this.object.body.width + this.oversight)){
                    //console.log('GO TOP!');
                    this.goTop();
                }

                if((this.targets[i].object.x - this.object.body.width) > (this.object.x + this.object.body.width) &&
                    (this.targets[i].object.x - this.object.body.width) > (this.object.x + this.object.body.width - this.oversight)){
                    //console.log('GO RIGHT!');
                    this.goRight();
                } else
                if((this.targets[i].object.x + this.object.body.width) < (this.object.x + this.object.body.width) &&
                    (this.targets[i].object.x + this.object.body.width) < (this.object.x + this.object.body.width + this.oversight)){
                    //console.log('GO LEFT!');
                    this.goLeft();
                }
                break;
            } else this.goStop();                                               // цель не видно
            
        }
    };
    
    Enemy.prototype.checkNearby = function(target) {                            // Проверяем, не рядом ли цель
        if (target.object.y < (this.object.y + this.oversight*1.4) &&
            target.object.y > (this.object.y - this.oversight*1.4) &&
            target.object.x < (this.object.x + this.oversight*1.4) &&
            target.object.x > (this.object.x - this.oversight*1.4))
            return true;
        return false;
    };
    
    Enemy.prototype.visibility = function(target) {                             // Проверяем, видит ли объкт какую-либо цель (цель передается)
        if (target.object.y < (this.object.y + this.areaVisibility.top) &&
            target.object.y > (this.object.y - this.areaVisibility.bottom) &&
            target.object.x < (this.object.x + this.areaVisibility.right) &&
            target.object.y > (this.object.y - this.areaVisibility.left))
            return true;
        return false;
    };
    
    function Player(name, x, y) {                       // Создание игрока
        Character.apply(this, arguments);
        this.name = name;
        this.spriteName = 'player';
        this.animations = {                             // создаем анимации
            move_bottom: ['player','player_bottom'],
            move_top: ['player_top','player_top2'],
            move_left: ['player_left', 'player_left2'],
            move_right: ['player_right', 'player_right2']
        };
        this.keyboard = new KeyBoard(this);
        this.position = { x: x, y: y };
        
        this.init();

    }
    
    Player.prototype = Object.create(Character.prototype); // Наследуем Character
    Player.prototype.constructor = Player;
    
    Player.prototype.update = function () {
        this.keyboard.update(); // Следим за клавиатурой
    };
    
    function ZVGame() {
        this.player = new Player("snatvb", 100, 100);
        this.ememies = this.createEnemies();
        
        game.physics.arcade.collide(this.player.object, this.ememies);
//        game.world.camera.target = this.player.object;
        game.camera.follow(this.player.object);
//        game.camera.deadzone = new Phaser.Rectangle(150, 150, 1440, 300);
//        game.camera.focusOnXY(0, 0);
    }
    
    ZVGame.prototype = {
        update: function(){
//            game.world.camera.target.postUpdate(this.player);
            this.player.update();
            game.physics.arcade.collide(this.player.object, this.ememies[0].object);
            this.ememies[0].update();
        },
        createEnemies: function(){
            var item, enemes = [];
            for (var i = 0; i < 1; i++){
                item = new Enemy(10,10);
                item.targets.push(this.player);
                enemes.push(item);
            }
            return enemes;
        }
    };
    
    function KeyBoard(player){
        this.keys = game.input.keyboard.createCursorKeys();
        this.obj = player;
    }
    
    KeyBoard.prototype = {
        update: function(){
            var obj = this.obj;
            if(this.keys.down.isDown){ // Движение вниз
                obj.goBottom();
                return true;
            } else if(this.keys.up.isDown){ // Движение вверх
                obj.goTop();
                return true;
            } else if(this.keys.left.isDown){ // Движение влево
                obj.goLeft();
                return true;
            } else if(this.keys.right.isDown){ // Движение вправо
                obj.goRight();
                return true;
            } else {
                obj.goStop();
            }
        }
    };
    
    function preload () {

        game.load.atlas('player', 'img/characters/one.png', 'img/characters/one.json');
        game.load.atlas('enemy1', 'img/enemies/one.png', 'img/enemies/one.json');
        game.load.image('land', 'img/light_grass.png');

    }

    function create () {
        game.world.setBounds(-1000, -1000, 3000, 3000);
        land = game.add.tileSprite(0, 0, screenSize.x, screenSize.y, 'land');
        land.fixedToCamera = true;
        
        game.physics.startSystem(Phaser.Physics.ARCADE);
        zvgame = new ZVGame();
    }
    
    function update () {
        zvgame.update();
        
        land.tilePosition.x = -game.camera.x;
        land.tilePosition.y = -game.camera.y;
        
    }
    
    function render () {
    }

};