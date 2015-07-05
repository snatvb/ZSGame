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
            this.object.body.velocity.x = 0;
            if(this.speed < this.maxSpeed)
                this.speed += this.accelerate;
            this.object.animations.play('move_bottom');
            this.object.body.velocity.y = this.speed;
        },
        goTop: function (){
            this.object.body.velocity.x = 0;
            if(this.speed < this.maxSpeed)
                this.speed += this.accelerate;
            this.object.animations.play('move_top');
            this.object.body.velocity.y = -this.speed;
        },
        goRight: function (){
            this.object.body.velocity.y = 0;
            if(this.speed < this.maxSpeed)
                this.speed += this.accelerate;
            this.object.animations.play('move_right');
            this.object.body.velocity.x = this.speed;
        },
        goLeft: function (){
            this.object.body.velocity.y = 0;
            if(this.speed < this.maxSpeed)
                this.speed += this.accelerate;
            this.object.animations.play('move_left');
            this.object.body.velocity.x = -this.speed;
        },
        goStop: function(){
            if(this.speed > 0)
                this.speed -= this.accelerate;
            if(this.speed < 0)
                this.speed = 0;
            
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
    
    function Player(name, x, y) {
        Character.apply(this, arguments);
        this.name = name;
        this.spriteName = 'player';
        this.animations = {
            move_bottom: ['player','player_bottom'],
            move_top: ['player_top','player_top2'],
            move_left: ['player_left', 'player_left2'],
            move_right: ['player_right', 'player_right2']
        };
        this.keyboard = new KeyBoard(this);
        this.position = { x: x, y: y };
        
        
        this.init();
    }
    
    Player.prototype = Object.create(Character.prototype);
    Player.prototype.constructor = Player;
    
    Player.prototype.update = function () {
        this.keyboard.update();
//        this.object.body.velocity.y = 150;
//        if(this.keyboard.down.isDown && this.speed < this.maxSpeed){
//            this.speed += this.accelerate;
//            this.goBottom();
//        } else if(!this.keyboard.down.isDown && this.speed > 0){
//            this.speed -= this.accelerate;
//            this.object.body.velocity.y = this.speed;
//        } else if (this.speed <= 0){
//            this.speed = 0;
//            this.object.animations.stop();
//            this.object.body.velocity.y = this.speed;
//        }
    }
    
    function ZVGame() {
        this.player = new Player("snatvb", 100, 100);
        game.world.camera.target = this.player.object;
//        game.camera.follow(this.player);
//        game.camera.deadzone = new Phaser.Rectangle(150, 150, 1440, 300);
//        game.camera.focusOnXY(0, 0);
    }
    
    ZVGame.prototype = {
        update: function(){
//            game.world.camera.target.postUpdate(this.player);
            this.player.update();
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
                return;
            } else if(this.keys.up.isDown){ // Движение вверх
                obj.goTop();
                return;
            } else if(this.keys.left.isDown){ // Движение влево
                obj.goLeft();
                return;
            } else if(this.keys.right.isDown){ // Движение вправо
                obj.goRight();
                return;
            } else {
                obj.goStop();
            }
        }
    }
    
    function preload () {

        game.load.image('logo', 'phaser.png');
        game.load.atlas('player', 'img/characters/one.png', 'img/characters/one.json');
        game.load.image('land', 'img/light_grass.png');

    }

    function create () {
//        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.world.setBounds(-1000, -1000, 3000, 3000);
        land = game.add.tileSprite(0, 0, screenSize.x, screenSize.y, 'land');
        land.fixedToCamera = true;
        
        game.physics.startSystem(Phaser.Physics.ARCADE);
//        var logo = game.add.sprite(game.world.centerX, game.world.centerY, 'logo');
//        var player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');
//        logo.anchor.setTo(0.5, 0.5);
        zvgame = new ZVGame();
        
//        player = game.add.sprite(32, 32, 'player');
//        game.physics.arcade.enable(player);
//        
//        cursors = game.input.keyboard.createCursorKeys();
    }
    
    function update () {
//        game.world.camera.target.postUpdate();
//        player.body.velocity.x = 0;
//
//        if (cursors.left.isDown)
//        {
//            //  Move to the left
//            player.body.velocity.x = -150;
//
//            player.animations.play('left');
//        }
//        else if (cursors.right.isDown)
//        {
//            //  Move to the right
//            player.body.velocity.x = 150;
//
//            player.animations.play('right');
//        }
//        else
//        {
//            //  Stand still
//            player.animations.stop();
//
//            player.frame = 4;
//        }
//
//        //  Allow the player to jump if they are touching the ground.
//        if (cursors.up.isDown && player.body.touching.down)
//        {
//            player.body.velocity.y = -350;
//        }
        
        zvgame.update();
        
        land.tilePosition.x = -game.camera.x;
        land.tilePosition.y = -game.camera.y;
        
    }
    
    function render () {
    }

};