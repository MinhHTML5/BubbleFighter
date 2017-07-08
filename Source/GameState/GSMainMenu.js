function GSMainMenu () {
	var instance = this;
	
	var backGroundImage = new Image();
		backGroundImage.src = "Image/MainMenu/MainMenu.jpg";
	var touchImage = new Image();
		touchImage.src = "Image/MainMenu/TouchText.png";
	
	
	
	function ToggleSound () {
		g_enableSound = 1 - g_enableSound;
		SaveUserInfo();
	}
	function ToggleMusic () {
		g_enableMusic = 1 - g_enableMusic;
		if (g_enableMusic == 0) {
			StopMusic();
		}
		else {
			PlayMusic();
		}
		SaveUserInfo();
	}
	
	var soundOnButton = new Button ("Image/MainMenu/SoundOn.png", 10, 610, 100, 100, ToggleSound, 0);
	var soundOffButton = new Button ("Image/MainMenu/SoundOff.png", 10, 610, 100, 100, ToggleSound, 0);
	var musicOnButton = new Button ("Image/MainMenu/MusicOn.png", 120, 610, 100, 100, ToggleMusic, 0);
	var musicOffButton = new Button ("Image/MainMenu/MusicOff.png", 120, 610, 100, 100, ToggleMusic, 0);
	
	var animCount = 0;
	var showTouch = true;
	var anywhereTouched = false;
	
	
	function StartGame() { 
		g_gameState = 1; 
		g_gsSelectLevel.InitButton();
	}
	
	this.Update = function() {
		
		var touched = false;
		for (var i=0; i<g_mouseX.length; i++) {
			if (g_mouseX[i] >= 10 && g_mouseX[i] <= 110
			&&	g_mouseY[i] >= 610 && g_mouseY[i] <= 710) {
				
			}
			else if (g_mouseX[i] >= 120 && g_mouseX[i] <= 220
			&&	g_mouseY[i] >= 610 && g_mouseY[i] <= 710) {
				
			}
			else {
				touched = true;
			}
		}
		if (touched == true) {
			anywhereTouched = true;
		}
		else {
			if (anywhereTouched == true) {
				anywhereTouched = false;
				StartGame();
			}	
		}
		
		if (g_enableSound == 1) {
			soundOnButton.Update(g_mouseX, g_mouseY);
		}
		else {
			soundOffButton.Update(g_mouseX, g_mouseY);
		}
		if (g_enableMusic == 1) {
			musicOnButton.Update(g_mouseX, g_mouseY);
		}
		else {
			musicOffButton.Update(g_mouseX, g_mouseY);
		}
		
		animCount += g_deltaTime;
		if (animCount >= 700) {
			animCount = 0;
			showTouch = !showTouch;
		}
	}
	this.Draw = function() {
		context.drawImage(backGroundImage, 0, 0);
		
		if (showTouch) {
			context.drawImage(touchImage, 340, 580);
		}
		
		if (g_enableSound == 1) {
			soundOnButton.Draw();
		}
		else {
			soundOffButton.Draw();
		}
		if (g_enableMusic == 1) {
			musicOnButton.Draw();
		}
		else {
			musicOffButton.Draw();
		}
	}
}
