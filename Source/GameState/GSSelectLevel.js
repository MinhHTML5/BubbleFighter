function GSSelectLevel () {
	var instance = this;
	
	var backGroundImage = new Image();
		backGroundImage.src = "Image/MainMenu/MainMenu.jpg";
	var selectTextImage = new Image();
		selectTextImage.src = "Image/SelectLevel/SelectText.png";
	var buttonBlock = new Image();
		buttonBlock.src = "Image/SelectLevel/PlayButtonBlock.png";
	var starImage = new Image();
		starImage.src = "Image/SelectLevel/Star.png";
	var starLockImage = new Image();
		starLockImage.src = "Image/SelectLevel/StarLock.png";
	
	function StartGame() { 
		g_gameState = 1; 
	}
	
	var world = 1;
	
	
	var playButton;
	var leftButton;
	var rightButton;
	this.InitButton = function() {
		if (playButton == null) {
			playButton = new Array();
			for (var i=0; i<5; i++) {
				playButton[i] = new Button ("Image/SelectLevel/PlayButton.png", 215 + i * 170, 200, 150, 100, StartGame, i + 1);
			}
			for (var i=5; i<10; i++) {
				playButton[i] = new Button ("Image/SelectLevel/PlayButton.png", 215 + (i-5) * 170, 320, 150, 100, StartGame, i + 1);
			}
			for (var i=10; i<15; i++) {
				playButton[i] = new Button ("Image/SelectLevel/PlayButton.png", 215 + (i-10) * 170, 440, 150, 100, StartGame, i + 1);
			}
			
			leftButton = new Button ("Image/SelectLevel/BackButton.png", 50, 320, 105, 100, LeftButton, null);
			rightButton = new Button ("Image/SelectLevel/NextButton.png", 1120, 320, 105, 100, RightButton, null);
		}
		
		if (ENABLE_ADS == true) {
			ShowAds();
		}
	}
	
	function StartGame (level) {
		g_gameState = 2; 
		g_gsActionPhase.Reset();
		g_gsActionPhase.CreateLevel(level);
		
		if (ENABLE_ADS == true) {
			HideAds();
		}
	}
	
	function LeftButton () {
		if (world == 1) {
			g_gameState = 0; 
			if (ENABLE_ADS == true) {
				HideAds();
			}
		}
		else if (world == 2) {
			world = 1;
		}
	}
	
	function RightButton() {
		if (world == 1) {
			world = 2;
		}
	}
	
	
	
	
	
	this.Update = function() {
		for (var i=0; i<playButton.length; i++) {
			if (g_levelResult[i] != 0) {
				playButton[i].Update(g_mouseX, g_mouseY);
			}
		}
		
		leftButton.Update(g_mouseX, g_mouseY);
		rightButton.Update(g_mouseX, g_mouseY);
	}
	this.Draw = function() {
		context.drawImage(backGroundImage, 0, 0);

		context.globalAlpha = 0.5;
		context.fillStyle = "#000000";
		context.fillRect (0, 0, 1280, 720);
		context.globalAlpha = 1;
			
		context.drawImage(selectTextImage, 390, 30);
		
		leftButton.Draw();
		rightButton.Draw();
		
		if (world == 1) {
			for (var i=0; i<playButton.length; i++) {
				if (g_levelResult[i] != 0) {
					playButton[i].Draw();
				}
			}
			
			for (var i=0; i<5; i++) {
				if (g_levelResult[i] == 0) {
					context.drawImage (buttonBlock, 215 + i * 170, 200);
				}
				for (var j=0; j<g_levelResult[i+1]; j++) {
					context.drawImage (starImage, 240 + i * 170 + j * 30, 245);
				}
				for (var j=g_levelResult[i+1]; j<3; j++) {
					context.drawImage (starLockImage, 240 + i * 170 + j * 30, 245);
				}
			}
			for (var i=5; i<10; i++) {
				if (g_levelResult[i] == 0) {
					context.drawImage (buttonBlock, 215 + (i-5) * 170, 320);
				}
				for (var j=0; j<g_levelResult[i+1]; j++) {
					context.drawImage (starImage, 240 + (i-5) * 170 + j * 30, 365);
				}
				for (var j=g_levelResult[i+1]; j<3; j++) {
					context.drawImage (starLockImage, 240 + (i-5) * 170 + j * 30, 365);
				}
			}
			for (var i=10; i<15; i++) {
				if (g_levelResult[i] == 0) {
					context.drawImage (buttonBlock, 215 + (i-10) * 170, 440);
				}
				for (var j=0; j<g_levelResult[i+1]; j++) {
					context.drawImage (starImage, 240 + (i-10) * 170 + j * 30, 485);
				}
				for (var j=g_levelResult[i+1]; j<3; j++) {
					context.drawImage (starLockImage, 240 + (i-10) * 170 + j * 30, 485);
				}
			}
			
			context.font = "20px Tahoma bold";
			context.fillStyle = "#aaffff";
			context.strokeStyle = "#ff0000";
			
			for (var i=0; i<5; i++) {
				context.fillText("LEVEL " + (i + 1), 250 + i * 170, 240);
				context.strokeText("LEVEL " + (i + 1), 250 + i * 170, 240);
				context.fillText("LEVEL " + (i + 6), 250 + i * 170, 360);
				context.strokeText("LEVEL " + (i + 6), 250 + i * 170, 360);
				context.fillText("LEVEL " + (i + 11), 250 + i * 170, 480);
				context.strokeText("LEVEL " + (i + 11), 250 + i * 170, 480);
			}
		}
		else {
			context.font = "40px Tahoma bold";
			context.fillStyle = "#ffffff";
			context.strokeStyle = "#0055ff";
			
			context.fillText("COMING SOON!", 480, 380);
			context.strokeText("COMING SOON!", 480, 380);
		}
		
	}
}