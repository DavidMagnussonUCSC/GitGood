//Initialize the game
var game = new Phaser.Game(600, 800, Phaser.AUTO, 'phaser');

//Initialize Global Variables
var cursors; // Global cursors for being able to check if keys are held
var spaceKey; //Variable for checking if space is down


// define MainMenu state and methods
var MainMenu = function(game) {};
MainMenu.prototype = {
	preload: function() {
		//preloads all needed assets
		
		//image assets
		game.load.image('sky', './assets/img/sky.png');
		game.load.image('ground', './assets/img/platform.png');
		game.load.image('star', './assets/img/star.png');
		game.load.image('diamond', './assets/img/diamond.png');
		game.load.image('snow', './assets/img/snowflake.png');
		
		//audio assets
		game.load.audio('pickup', './assets/audio/pickup.mp3');
		
		//spritesheets
		game.load.spritesheet('dude', './assets/img/dude.png', 32, 48);
		game.load.spritesheet('baddie', './assets/img/baddie.png', 32, 32);
	},
	create: function() {
		
		cursors = game.input.keyboard.createCursorKeys(); //For checking cursor keys
		game.stage.backgroundColor = "#8B008B"; //sets background color
		
		//Adds menu text
		game.add.text(16, 16, 'Star Catch Game', { fontSize: '32px', fill: '#000' });
		game.add.text(16, 42, 'Use arrow keys to move', { fontSize: '32px', fill: '#000' });
		game.add.text(16, 68, 'Press Space to start', { fontSize: '32px', fill: '#000' });
		
		//Allows checking of the space key by capturing its input
		spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
		game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR ]);
	},
	update: function() {
		if(spaceKey.isDown)
		{
			game.state.start('GamePlay', true, false, 0); //Starts the gameplay state if space is held down/pressed
		}
	
	}
}

//Gameplay state and methods
var GamePlay = function(game) {};
GamePlay.prototype = {
	//When state initiated creates local variables
	init: function() {
		//local variables
		this.score; //tracks score
		this.platforms;//group platforms player moves upon
		this.player;//the player sprite
		this.stars;//group for collectable star
		this.scoreText// the text displaying the players score
		this.diamonds;//collectable diamond group
		this.baddies;//group for enemies
		this.numStars;//variable that tracks number of stars left
		this.pickup;//pickup audio sound 
		this.flake;//for creating snowflakes
	},
	//creates the gameplay state
	create: function() {
		game.physics.startSystem(Phaser.Physics.ARCADE); //Starts the physics system
		game.add.sprite(0, 0, 'sky'); //adds the sky background
		
		//Adds platforms, stars, diamonds, and baddies as Groups and enables physics for them
		platforms = game.add.group();
		platforms.enableBody = true;
		stars = game.add.group();
		stars.enableBody = true;
		diamonds = game.add.group();
		diamonds.enableBody = true;
		baddies = game.add.group();
		baddies.enableBody = true;
		
		//Adds a game audio for picking up stars
		pickup = game.add.audio('pickup');

		
		//Creates the ground
		var ground = platforms.create(0, game.world.height - 64, 'ground');//Creates the ground
		ground.scale.setTo(2,2);//Scales the ground appropriately
		ground.body.immovable = true;//Makes the ground immovable
		//adds the 4 different ledges and makes them immovable
		var ledge = platforms.create(440,350, 'ground');
		ledge.body.immovable = true;
		ledge = platforms.create(-250, 250, 'ground');
		ledge.body.immovable = true;
		ledge = platforms.create(-150, 450, 'ground');
		ledge.body.immovable = true;
		ledge = platforms.create(350, 600, 'ground');
		ledge.body.immovable = true;

		

		
		//Adds the player sprite
		player = game.add.sprite(32, game.world.height - 150, 'dude');
		
		//Enables player physics and sets properties
		game.physics.arcade.enable(player);
		player.body.bounce.y = .02; //adds bounce to the player
		player.body.gravity.y = 300; //sets player gravity
		player.body.collideWorldBounds = true; //player sprite cannot cross world boundaries
		
		//adds player animations for walking
		player.animations.add('left', [0, 1, 2, 3], 10, true); //leftward facing animations
		player.animations.add('right', [5, 6, 7, 8], 10, true); //rightward facing animations

		//adds enemies and enemy animations
		var baddie = game.add.sprite(550, 568, 'baddie');//adds the rightward facing enemy
		baddie.animations.add('right', [2, 3], 10, true); //creates an animation set for the rightward facing enemy
		baddie.animations.play('right'); //plays the rightward facing animation set for the rightward facing enemy
		baddies.add(baddie); //adds the enemy to the baddies group
		baddie = game.add.sprite(150, 418, 'baddie');//adds the leftward facing enemy
		baddie.animations.add('left', [0, 1], 10, true); //creates an animation set for the leftward facing enemy
		baddie.animations.play('left'); //plays the leftward facing animation set for the leftward facing enemy
		baddies.add(baddie);//adds the enemy to the baddies group
		
		//adds 10 stars for players to pick up
		for (var i = 0; i < 10; i++)
		{
			numstars = i; //keeps track of how many stars are placed
			var star = stars.create(i * 70, 0, 'star'); //creates and places a star

			star.body.gravity.y = 48; //gives gravity to the star so it can fall

			star.body.bounce.y = 0.7 + Math.random() * 0.2; //adds bounce to the star so it bounces
		}
		
		//adds the diamond for the player to pick up
		var diamond = diamonds.create(game.world.width * Math.random(), game.world.height * Math.random() * .9, 'diamond');
		
		//adds the 100 snowflakes for snowstorm
		for (var i = 0; i < 100; i++)
		{
			this.flake = new Snowstorm(game, 'snow', .125, 2 * Math.PI * game.rnd.realInRange(0,1)); //creates the snowstorm object from prefab
			game.add.existing(this.flake); //adds it to the game
		}
		
		score = 0; //sets score to 0;
		scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' }); //sets scoretext to 0
	},

	//run every frame
	update: function() {
		//adds collision detection between the platforms and the player/stars
		var hitPlatform = game.physics.arcade.collide(player, platforms);//collision detection for ground/platforms and player
		var starHitPlatform = game.physics.arcade.collide(stars, platforms);//collision detection for ground/platforms and the stars
		
		//adds functionality for player touching the stars, diamond, and baddies
		var playerTouchStar = game.physics.arcade.overlap(player, stars, collectStar, null, this); //calls collectstar when player touches a star
		var playerTouchDiamond = game.physics.arcade.overlap(player, diamonds, collectDiamond, null, this);// calls collectDiamond when player touches a diamond
		var playerTouchBaddie = game.physics.arcade.overlap(player, baddies, touchBaddie, null, this); //calls touchBaddie when player touches a baddie
		
		//resets the player's velocity
		player.body.velocity.x = 0;
		
		//if player is holding left, move player left
		if(cursors.left.isDown)
		{
			player.body.velocity.x = -150;//sets player's velocity to move leftward
			player.animations.play('left');//plays the player sprite's leftward moving animations
		}
		else if (cursors.right.isDown) //if player is holding right, moves player right
		{
			player.body.velocity.x = 150;//sets player's velocity to move rightward
			player.animations.play('right');//plays the player sprite's rightward moving animations
		}
		else //if player is not holding a directional key
		{
			player.animations.stop();//stops all playing animations
			
			player.frame = 4;//sets player sprite's animation to camera facing animation frame
		}
		
		//allows player to jump if they are holding the up key and the player sprite is standing on the ground/a platform
		if (cursors.up.isDown && player.body.touching.down && hitPlatform)
		{
			player.body.velocity.y = -350;//moves player sprite upward by changing velocity
		}
		
	}
}

// define GameOver state and methods
var GameOver = function(game) {};
GameOver.prototype = {
	//when state is changed to game over
	init: function(score) {
		this.score = score; //inherits score from gameplay
	},
	//creates the game over screen
	create: function() {
		game.add.text(16, 16, 'Game Over', { fontSize: '32px', fill: '#000' });
		game.add.text(16, 42, 'Final Score: ' + score, { fontSize: '32px', fill: '#000' }); //displays the players achieved score
		game.add.text(16, 68, 'Press Space to try again', { fontSize: '32px', fill: '#000' }); //instructions
	},
	update: function() {
		//if the space key is held down, restarts the game
		if(spaceKey.isDown)
		{
			game.state.start('GamePlay', true, false);//starts gameplay
		}
	}
}

//function for player to collect a star
function collectStar (player, star) {
	
	star.kill();//removes the star
	pickup.play();//plays the star pickup sound
	numstars--; //decrements tracker of number of stars in play
	//console.log(numstars);
	score += 10;//increments the score
	if(numstars == 0)//if no stars are left
	{
		game.state.start('GameOver',true, false, this.score); //moves to the gameover state
	}
	scoreText.text = 'Score: ' + score;//updates the displayed scoretext
}

//function for player to collect a diamond
function collectDiamond (player, diamond) {
	
	diamond.kill();//removes the diamond
	
	score += 50;//increments the score
	scoreText.text = 'Score: ' + score;//updates the displayed scoretext
}
//function for player touching a baddie
function touchBaddie (player, baddie) {
	
	baddie.kill();//removes the baddie. Unnecessary now, but see no reason to remove
	
	score += -25;//decrements the score
	scoreText.text = 'Score: ' + score;//updates the displayed scoretext
	game.state.start('GameOver', true, false, this.score);//moves to the gameover screen
}

// add states to StateManager and starts MainMenu
game.state.add('MainMenu', MainMenu);
game.state.add('GamePlay', GamePlay);
game.state.add('GameOver', GameOver);
game.state.start('MainMenu');

