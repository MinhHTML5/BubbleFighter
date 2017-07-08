// Global variable for the entire game
var SCREEN_W = 1280;
var SCREEN_H = 720;

var g_gameState = 0;
var g_deltaTime = 0;
var g_levelResult = new Array();

var g_gsMainMenu = new GSMainMenu();
var g_gsSelectLevel = new GSSelectLevel();
var g_gsActionPhase = new GSActionPhase();

// Canvas - Context
var canvas = document.getElementById("canvas");
var context = canvas.getContext("2d");


var g_enableSound = 1;
var g_enableMusic = 1;

var musicStopOrder = false;
var musicVolume = 1;
var g_music = new Audio();
	g_music.src = "Sound/MenuMusic.mp3";
	
function PlayMusic() {
	musicVolume = 1;
	if (musicStopOrder) {
		g_music.currentTime = 0;
	}
	musicStopOrder = false;
	g_music.volume = musicVolume;
	g_music.play();
}
function StopMusic() {
	musicStopOrder = true;
}



var curTime = new Date();
var lastTime = new Date();

function Update () {
	curTime = new Date();
	g_deltaTime = curTime - lastTime;
	lastTime = curTime;
	
	if (g_gameState == 0) {
		g_gsMainMenu.Update();
		g_gsMainMenu.Draw();
	}
	else if (g_gameState == 1) {
		g_gsSelectLevel.Update();
		g_gsSelectLevel.Draw();
	}
	else if (g_gameState == 2) {
		g_gsActionPhase.Update();
		g_gsActionPhase.Draw();
	}
	
	if (musicStopOrder) {
		musicVolume -= g_deltaTime * 1.2 * 0.001;
		if (musicVolume < 0) {
			g_music.pause();
			musicVolume = 0;
		}
		g_music.volume = musicVolume;
	}
	
	requestAnimFrame(Update);
}






function LoadUserInfo() {
	if (localStorage.level == null) {
		for (var i=0; i<=16; i++) {
			g_levelResult[i] = 0;
		}
		g_levelResult[0] = 3;
		g_enableSound = 1;
		g_enableMusic = 1;
	}
	else {
		g_levelResult = JSON.parse(localStorage.level);
		g_enableSound = localStorage.sound;
		g_enableMusic = localStorage.music;
	}
	
	if (g_enableSound == null) g_enableSound = 1;
	if (g_enableMusic == null) g_enableMusic = 1;
}


function SaveUserInfo() {
	localStorage.level = JSON.stringify(g_levelResult);
	localStorage.sound = g_enableSound;
	localStorage.music = g_enableMusic;
}



LoadUserInfo();
if (g_enableMusic == 1) {
	PlayMusic();
}

// =====================================================================================================================================
// ====================================================    FOR TIZEN ONLY   ============================================================
// =====================================================================================================================================
/*
function OnBackKeyPressed() {
	if (g_gameState == 2) {
		g_gameState = 1;
	}
	else if (g_gameState == 1) {
		g_gameState = 0;
	}
	else if (g_gameState == 0) {
		tizen.application.getCurrentApplication().exit();
	}
}

document.addEventListener("tizenhwkey", function(event) {
	switch (event.keyName) { 
		case "back":
			OnBackKeyPressed();
			break;
		case "menu":
			break;
	}  
});
*/

var SCALE = (window.devicePixelRatio === undefined) ? 1 : window.devicePixelRatio;
canvas.style.width = (1280 / SCALE) + "px";
canvas.style.height = (720 / SCALE) + "px";
canvas.style.position = "absolute";

// =====================================================================================================================================
// ===================================================    KEYBOARD    ==================================================================
// =====================================================================================================================================
var g_keyState = new Array(); // This array contain the state of the key we press. True = pressing, False = not pressing, or released
for (var i=0; i<255; i++) {
	g_keyState[i] = false;
}


// KEYBOARD EVENT
var OnKeyDown = function(event) {	
	if (event.which == 8 || event.which == 32 || event.which == 37 || event.which == 38 || event.which == 39 || event.which == 40) {
		event.preventDefault();
	}
	g_keyState[event.which] = true;	
}

var OnKeyUp = function(event) {
	if (event.which == 8 || event.which == 32 || event.which == 37 || event.which == 38 || event.which == 39 || event.which == 40) {
		event.preventDefault();
	}
	g_keyState[event.which] = false;
}

// Add event listener
window.onkeydown = OnKeyDown;
window.onkeyup = OnKeyUp;




// =====================================================================================================================================
// ===================================================    MOUSE OR TOUCH    ============================================================
// =====================================================================================================================================
var g_mouseX = new Array();
var g_mouseY = new Array();
var g_originMouseX = 0;
var g_originMouseY = 0;


function OnMouseMove (event) {
	ComputeMouseOrigin();
	if (g_mouseX.length > 0) {
		g_mouseX[0] = (g_originMouseX + event.clientX) * SCALE;
		g_mouseY[0] = (g_originMouseY + event.clientY) * SCALE;
	}
}
function OnMouseDown (event) {
	ComputeMouseOrigin();
	g_mouseX[0] = (g_originMouseX + event.clientX) * SCALE;
	g_mouseY[0] = (g_originMouseY + event.clientY) * SCALE;
}
function OnMouseUp (event) {
	g_mouseX = new Array();
	g_mouseY = new Array();
}


canvas.addEventListener('mousemove', OnMouseMove, false);
canvas.addEventListener('mousedown', OnMouseDown, false);
canvas.addEventListener('mouseup',   OnMouseUp, false);
		
function ProcessTouchEvent (event) {
	event.preventDefault();
	
	g_keyState[37] = false;
	g_keyState[38] = false;
	g_keyState[39] = false;
	g_keyState[32] = false;
	
	g_mouseX = new Array();
	g_mouseY = new Array();
	for (var i=0; i<event.touches.length; i++) {
		var tempX = event.touches[i].clientX * SCALE;
		var tempY = event.touches[i].clientY * SCALE;
		
		g_mouseX[g_mouseX.length] = tempX;
		g_mouseY[g_mouseY.length] = tempY;
		
		if (tempX >= 10 && tempX <= 188 && tempY >= 532 && tempY <= 710) {
			g_keyState[38] = true;
		}
		else if (tempX >= 1092 && tempX <= 1270 && tempY >= 532 && tempY <= 710) {
			g_keyState[38] = true;
		}
		else if (tempX >= 198 && tempX <= 376 && tempY >= 532 && tempY <= 710) {
			g_keyState[32] = true;
		}
		else if (tempX >= 904 && tempX <= 1082 && tempY >= 532 && tempY <= 710) {
			g_keyState[32] = true;
		}
		else if (tempX < 640) {
			g_keyState[37] = true;
		}
		else if (tempX > 640) {
			g_keyState[39] = true;
		}
	}
}

canvas.ontouchstart = ProcessTouchEvent;
canvas.ontouchend = ProcessTouchEvent;
canvas.ontouchmove = ProcessTouchEvent;


function ComputeMouseOrigin () {
	var temp = canvas;
	var windowOffsetX = 0;
	var windowOffsetY = 0;
	while (temp.tagName != 'BODY') {
		windowOffsetY += temp.offsetTop;
		windowOffsetX += temp.offsetLeft;
		temp = temp.offsetParent;
	}
	g_originMouseX = window.pageXOffset - windowOffsetX;
	g_originMouseY = window.pageYOffset - windowOffsetY;
}





// =====================================================================================================================================
// ========================================================    LOOP   ==================================================================
// =====================================================================================================================================
// Using request animation frame over setInterval or setTimeOut have a huge advantage
window.requestAnimFrame = (function () {
	return  window.requestAnimationFrame       || 
			window.webkitRequestAnimationFrame || 
			window.mozRequestAnimationFrame    || 
			window.oRequestAnimationFrame      || 
			window.msRequestAnimationFrame     || 
			function (callback, element) {
				window.setTimeout(callback, 1000 / 60);
			};
})();


// The quest loop next frame
requestAnimFrame(Update);