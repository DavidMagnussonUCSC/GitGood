//prefab for creeating snow, gets passed the game, asset key, scale for asset, and initial rotation
function Snowstorm(game, key, scale, rotation) {
	
	//makes a Sprite call to create the Snowstorm object at a random x/y position in the game
	Phaser.Sprite.call(this, game, game.rnd.integerInRange(8, game.width-8),
		game.rnd.integerInRange(8,game.height - 8), key);
		

	this.anchor.set(.5); //sets the anchor to the middle of the snowflake
	this.scale.x = scale;	//sets the x scale of the snowflake accordingly
	this.scale.y = scale;	//sets the y scale of the snowflake accordingly
	this.rotation = rotation;	//sets the rotation of the snow flake accordingly
	this.alpha = .5 //sets the transparency of the snowflake
	game.physics.enable(this); //enables the physics body for the snowflake
	this.body.velocity.x = game.rnd.integerInRange(0,30); //sets a random positive x velocity for the snowflake between 0 and 30
	this.body.velocity.y = game.rnd.integerInRange(0,30); //sets a random positive y velocity for the snowflake between 0 and 30
	this.body.angularVelocity = game.rnd.integerInRange(0,60); //sets a random positive angular velocity for the snowflake between 0 and 60
	
}
	
	Snowstorm.prototype = Object.create(Phaser.Sprite.prototype); //Creates the prototype for Snowstorm from Phaser.Sprite.prototype
	Snowstorm.prototype.constructor = Snowstorm; //declares the constructor for Snowstorm
	
	//overrides update function for prefab
	Snowstorm.prototype.update = function() {
		//If r key is held down, reverses the snowflake's x velocity
		if(game.input.keyboard.isDown(Phaser.Keyboard.R))
		{
			this.body.velocity.x = this.body.velocity.x * -1; //sets the snowflake to move in the other direction
		}
		
		//loops the snowflakes continuously
		
		//if snowflake is off the left side of the screen, moves snowflake offscreen to the right side so it can float back into visibility
 		if(this.body.x + 16 <= 0)
		{
			this.body.x = this.body.x + game.world.width + 32; //moves snowflake off the right of the visible area so it can float back in
		}
		else if(this.body.x -16 >= game.world.width )//if snowflake is off the right side of the screen, moves snowflake offscreen to the left side so it can float back into visibility
		{
			this.body.x = this.body.x - game.world.width -32;//moves snowflake off the left of the visible area so it can float back in
		}
		
		//if snowflake is below the screen, moves snowflake offscreen below so it can float back into visibility.
		if(this.body.y - 16 >= game.world.height )
		{
			this.body.y = this.body.y - game.world.height - 32;//if snowflake is below the screen, moves snowflake offscreen above so it can float back into visibility
		}
/* 		else if(this.body.y + 16 <= 0) //if snowflake is above the screen, moves snowflake offscreen below so it can float back into visibility. Not relevant at the time
		{
			this.body.y = this.body.y + game.world.height + 32;
		} */

	}
	
