let startScene = new Phaser.Scene('Start');


// Runs second and is used to set all the images used in the game
startScene.preload = () => {

	startScene.load.image('background', 'assets/images/background.jpg');

};

startScene.create = () => {
	startScene.add.sprite(0,0, 'background').setOrigin(0);
	startScene.startText = startScene.add.text(80, 300, 'Start Game', fontStyle);
	startScene.startText.setInteractive();
	startScene.startText.on('pointerdown', (pointer, localX, localY) => {
		console.log('changing scene');
		startScene.scene.start('Main');
	});
	
	
	
	startScene.directions = startScene.add.text(0, 200, 
												' Use the arrow keys to move\n the player around. Try to\n collect as many coins as you can without hitting\n without hitting the floor.', { fontSize: '20px', fill: '#fff', backgroundColor: '#000', padding: 2});
};