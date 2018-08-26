let finishScene = new Phaser.Scene('Finish');

const fontStyleStartDirections = { fontSize: '20px', fill: '#fff', backgroundColor: '#000', padding: 2};

let score = 0;

finishScene.init = (sceneConfig) => {
		score = sceneConfig.score;
}

// Runs second and is used to set all the images used in the game
finishScene.preload = (sceneConfig) => {

	finishScene.load.image('background', 'assets/images/background.jpg');
};	

finishScene.create = () => {
	finishScene.add.sprite(0,0, 'background').setOrigin(0);
	finishScene.gameOver = finishScene.add.text(80, 300, 'Game Over', fontStyle);
	finishScene.gameOver.x = finishScene.centerX(finishScene.gameOver);
	
	finishScene.finalScore = finishScene.add.text(0, 200, 
												'Score: ' + score, fontStyle);
	finishScene.finalScore.x = finishScene.centerX(finishScene.finalScore);
	finishScene.startNewGame = finishScene.add.text(0, 400, 'Start Game', fontStyle);
	finishScene.startNewGame.x = finishScene.centerX(finishScene.startNewGame);
	finishScene.startNewGame.setInteractive();
	finishScene.startNewGame.on('pointerdown', (pointer, localX, localY) => {
		finishScene.scene.start('Main');
	});
};

finishScene.centerX = (text) => {
		return (config.width/2 - text.width/2);

}