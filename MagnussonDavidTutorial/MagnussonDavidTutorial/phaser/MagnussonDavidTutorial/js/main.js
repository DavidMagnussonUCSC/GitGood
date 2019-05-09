//Initialize the game
var game = new Phaser.Game(600, 800, Phaser.AUTO, '', { preload: preload, create: create, update: update });

//Initialize global variables
var platforms;
var player;
var cursors;
var stars;
var score = 0;
var scoreText;
var diamonds;
var baddies;

function preload() {
	
	game.load.image('sky', './assets/img/sky.png');
	game.load.image('ground', './assets/img/platform.png');
	game.load.image('star', './assets/img/star.png');
	game.load.image('diamond', './assets/img/diamond.png');
	game.load.spritesheet('dude', './assets/img/dude.png', 32, 48);
	game.load.spritesheet('baddie', './assets/img/baddie.png', 32, 32);
}


function create() {
	game.physics.startSystem(Phaser.Physics.ARCADE); //Starts the physics system
	game.add.sprite(0, 0, 'sky'); //adds the sky background
	
	//Adds platforms and stars as Groups and enables physics for them
	platforms = game.add.group();
	platforms.enableBody = true;
	stars = game.add.group();
	stars.enableBody = true;
	diamonds = game.add.group();
	diamonds.enableBody = true;
	baddies = game.add.group();
	baddies.enableBody = true;
	

	var ground = platforms.create(0, game.world.height - 64, 'ground');
	ground.scale.setTo(2,2);
	ground.body.immovable = true;
	//adds the 4 different ledges
	var ledge = platforms.create(440,350, 'ground');
	ledge.body.immovable = true;
	ledge = platforms.create(-250, 250, 'ground');
	ledge.body.immovable = true;
	ledge = platforms.create(-150, 450, 'ground');
	ledge.body.immovable = true;
	ledge = platforms.create(350, 600, 'ground');
	ledge.body.immovable = true;

	

	
	
	player = game.add.sprite(32, game.world.height - 150, 'dude');
	
	game.physics.arcade.enable(player);
	
	player.body.bounce.y = .02;
	player.body.gravity.y = 300;
	player.body.collideWorldBounds = true;
	
	player.animations.add('left', [0, 1, 2, 3], 10, true);
	player.animations.add('right', [5, 6, 7, 8], 10, true);
	cursors = game.input.keyboard.createCursorKeys();
	
	var baddie = game.add.sprite(550, 568, 'baddie');
	baddie.animations.add('right', [2, 3], 10, true);
	baddie.animations.play('right');
	baddies.add(baddie);
	baddie = game.add.sprite(150, 418, 'baddie');
	baddie.animations.add('left', [0, 1], 10, true);
	baddie.animations.play('left');
	baddies.add(baddie);
	
	 for (var i = 0; i < 12; i++)
    {
        var star = stars.create(i * 70, 0, 'star');

        star.body.gravity.y = 48;

        star.body.bounce.y = 0.7 + Math.random() * 0.2;
    }
	var diamond = diamonds.create(game.world.width * Math.random(), game.world.height * Math.random() * .9, 'diamond');
	
	scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
}

function update() {
	var hitPlatform = game.physics.arcade.collide(player, platforms);
	var starHitPlatform = game.physics.arcade.collide(stars, platforms);
	var playerTouchStar = game.physics.arcade.overlap(player, stars, collectStar, null, this);
	var playerTouchDiamond = game.physics.arcade.overlap(player, diamonds, collectDiamond, null, this);
	var playerTouchBaddie = game.physics.arcade.overlap(player, baddies, killBaddie, null, this);
	
	player.body.velocity.x = 0;
	
	if(cursors.left.isDown)
	{
		player.body.velocity.x = -150;
		player.animations.play('left');
	}
	else if (cursors.right.isDown)
	{
		player.body.velocity.x = 150;
		player.animations.play('right');
	}
	else
	{
		player.animations.stop();
		
		player.frame = 4;
	}
	
	if (cursors.up.isDown && player.body.touching.down && hitPlatform)
    {
        player.body.velocity.y = -350;
    }
	
}

function collectStar (player, star) {
	
	star.kill();
	
	score += 10;
	scoreText.text = 'Score: ' + score;
}

function collectDiamond (player, diamond) {
	
	diamond.kill();
	
	score += 50;
	scoreText.text = 'Score: ' + score;
}

function killBaddie (player, baddie) {
	
	baddie.kill();
	
	score += -25;
	scoreText.text = 'Score: ' + score;
}
