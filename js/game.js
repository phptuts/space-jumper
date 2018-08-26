// set config of game
let config = {
	type: Phaser.AUTO, // Will use webgl if avialable overwise it will use the canvas
	width: 360,
	height: 640,
	scene: [startScene, mainScene, finishScene],// default scene
	parent: 'game-canvas', // wrapper for canvas so you control where it is
	pixelArt: false,
	physics: {
		default: 'arcade',
		arcade: {
			gravity: {
				y: 1000 // default gravity
			},
			debug: getParameterByName('debug') == '1' // if debug=1 in the query it will use debug mode
		}
	}
};

// create an new game and pass configuration to it
let game = new Phaser.Game(config);