// Phaser Documentation:
// https://rexrainbow.github.io/phaser3-rex-notes/docs/site/index.html

/** 
 * This is the font style used throughout the game
 */
const fontStyle = { fontSize: '32px', fill: '#fff', backgroundColor: '#000', padding: 2};


// https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
let getParameterByName = (name) => {
	let url = window.location.href;
	name = name.replace(/[\[\]]/g, '\\$&');
	var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
		results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	return decodeURIComponent(results[2].replace(/\+/g, ' '));
};

let mainScene = new Phaser.Scene('Main');

// Runs first and is used to set all the variables
mainScene.init = () => {	
	mainScene.boxSpeed = 70;
	mainScene.boxSpeedX = 5;
	mainScene.startLeft = true;
	mainScene.pointSprites = [
		{name: 'coinBronze', points:  10},
		{name: 'coinGold',points: 100},
		{name: 'coinSilver',points: 30},
		{name: 'gemBlue',points: 75},
		{name: 'gemGreen', points:150},
		{name: 'gemRed',points: 200},
		{name: 'gemYellow', points:20}
	];
	mainScene.score = 0;
	mainScene.continueRight = false;
	mainScene.continueLeft = false;
};

// Runs second and is used to set all the images used in the game
mainScene.preload = () => {

	mainScene.load.image('background', 'assets/images/background.jpg');

	mainScene.load.atlas(
		'items', 
		'assets/images/items_spritesheet.png', 
		'assets/sprite-data/items_spritesheet.json'
	);

	mainScene
		.load.atlas(
		'bricks', 
		'assets/images/tiles_spritesheet.png', 
		'assets/sprite-data/tiles_spritesheet.json'
	);

	mainScene
		.load
		.atlas('player',
			   'assets/images/p2_walk.png', 
			   'assets/sprite-data/p2_walk.json'
			  );

};



// Runs third and is used to position all the images initially in the game
mainScene.create = () =>  {
	mainScene.add.sprite(0,0, 'background').setOrigin(0);
	mainScene.scoreText = mainScene.add.text(20, 20, 'Score: 0', fontStyle);
	mainScene.scoreText.depth = 10;
	
	mainScene.player = mainScene.physics.add.sprite(130, 0, 'player', "3");
	mainScene.player.setScale(.4);
	mainScene.player.setCollideWorldBounds(true);

	if (!mainScene.player.anims.animationManager.anims.entries.hasOwnProperty('player_move')) {
		mainScene.anims.create({
			key: 'player_move',
			frames: mainScene.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
			frameRate: 10,
			repeat: -1,
			pause: 1
		});
	}
	

	mainScene.increaseHardness = mainScene.time.addEvent({
		delay: 2000,                // ms
		callback: () => {
			mainScene.boxSpeed += .5;
		},
		args: [0],
		repeat: -1
	});

	mainScene.increaseHardness = mainScene.time.addEvent({
		delay: 900,                // ms
		callback: () => {
			mainScene.addCoin();
		},
		repeat: -1
	});

	mainScene.coins = mainScene.physics.add.group();
	mainScene.coins.enableBody = true;
	mainScene.coins.createMultiple({
		key: 'items',             // required
		frame: 'coinGold',
		visible: false
	});
	mainScene.platforms = mainScene.physics.add.group();
	mainScene.platforms.enableBody = true;
	mainScene.platforms.createMultiple({
		key: 'bricks',             // required
		frame: 'box',
		visible: false
	});
	mainScene.physics.add.collider([mainScene.player], mainScene.platforms);
	mainScene.physics.add.collider([mainScene.coins], mainScene.platforms);
	mainScene.cursors = mainScene.input.keyboard.createCursorKeys();
	
	mainScene.cursors.left.reset();
	mainScene.cursors.right.reset();
	mainScene.cursors.up.reset();
	mainScene.cursors.down.reset();


	mainScene.setUp();

	mainScene.physics.add.overlap(mainScene.coins, mainScene.player, mainScene.hitCoins);
};


mainScene.addCoin = () => {
	let x = Math.random() * 200 + 100;
	let y = 0;
	let spriteInfo =  mainScene.pointSprites
	[Phaser.Math.Between(0, mainScene.pointSprites.length - 1)];
	let coin = mainScene.coins.get( x, y, 'items', spriteInfo.name);
	coin.body.allowGravity = false;
	coin.body.setVelocityY(50);
	coin.setScale(.7);
	coin.setActive(true);
	coin.visible = true;
};

mainScene.setUp = () => {
	for (let i = 0; i <= 7; i += 1) {
		mainScene.addBox(100 * i);
	}
};

mainScene.addBox = (y) => {
	let startingLeftMinPix = mainScene.startLeft ? 30 : 200;
	let x = Math.random() * 100 + startingLeftMinPix;
	let tile = mainScene.platforms.get( x, y, 'bricks', 'box');
	tile.body.immovable = true;
	tile.body.setVelocityY(mainScene.boxSpeed);
	tile.setScale(.7);
	tile.body.allowGravity = false;
	tile.checkWorldBounds = true;
	tile.outOfBoundsKill = true;   
	tile.body.setVelocityX(Math.random() > .5 ? 1 : -1 * mainScene.boxSpeedX);		
	mainScene.startLeft = !mainScene.startLeft;
}

mainScene.hitCoins = (player, coin) => {
	let coinName = coin.frame.name;
	let points = mainScene.pointSprites.filter(x => x.name == coinName)[0].points;
	mainScene.coins.killAndHide(coin);
	coin.x = -40;
	mainScene.score += points;
	mainScene.scoreText.setText("Score: " + mainScene.score)

};

// Runs after every frame and is used to check 
// conditions and control things in thing in the game
// This may run 60 times per second and is the last thing that is ran
mainScene.update = () =>  {


	
	if (mainScene.cursors.left.isDown) {
		mainScene.startPlayerAnimation();	
		mainScene.player.body.setVelocityX(-200);
		mainScene.player.flipX = true;
	} 
	
	if(mainScene.cursors.right.isDown) {
		mainScene.startPlayerAnimation();	
		mainScene.player.body.setVelocityX(200);
		mainScene.player.flipX = false;
	} 
	
	console.log((mainScene.boxSpeed + 10) > mainScene.player.body.velocity.y);
	
	if (mainScene.cursors.up.isDown &&
		mainScene.player.body.touching.down && 
	    (mainScene.boxSpeed + 10) > mainScene.player.body.velocity.y) {
		mainScene.player.body.setVelocityY(-700);
		mainScene.player.setFrame(9);
		mainScene.player.anims.stop('player_move');	
	} 
	
	if (mainScene.cursors.up.isUp && 
		mainScene.cursors.right.isUp && 
		mainScene.cursors.left.isUp){
		mainScene.player.body.setVelocityX(0);
		mainScene.player.setFrame(9);
		console.log('here');
		mainScene.player.anims.stop('player_move');	
	}
	
	
	let lowestTile = mainScene.platforms.getChildren().sort((a, b) => (a.y - b.y))[0];
	if (lowestTile.y >= 100) {
		mainScene.addBox(0);
	}

	if (mainScene.player.body.onFloor()) {
		mainScene.gameOver = true;
		mainScene.coins.clear();
		mainScene.platforms.clear();
		mainScene.cursors = null;
		mainScene.scene.start('Finish', {score: mainScene.score});
	}

};

mainScene.startPlayerAnimation = () => {
	if (!mainScene.player.anims.isPlaying && mainScene.player.body.touching.down) {
		mainScene.player.anims.play('player_move');	
	}
}



