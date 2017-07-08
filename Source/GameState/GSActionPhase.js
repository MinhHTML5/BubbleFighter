var b2Vec2          = Box2D.Common.Math.b2Vec2;                   //
var b2BodyDef       = Box2D.Dynamics.b2BodyDef;                   //
var b2Body          = Box2D.Dynamics.b2Body;                      //
var b2FixtureDef    = Box2D.Dynamics.b2FixtureDef;                //
var b2Fixture       = Box2D.Dynamics.b2Fixture;                   // Some variable from Box2D, we create an alias for shorter reference
var b2World         = Box2D.Dynamics.b2World;                     // These things are written in the tutorial, I just bring over...
var b2MassData      = Box2D.Collision.Shapes.b2MassData;          //
var b2PolygonShape  = Box2D.Collision.Shapes.b2PolygonShape;      //
var b2CircleShape   = Box2D.Collision.Shapes.b2CircleShape;       //
var b2DebugDraw     = Box2D.Dynamics.b2DebugDraw;                 //


// Conversion between screen pixel (for drawing purpose), and physic world metre
function PtoM (pixel) {
	return pixel * 0.025;
}
function MtoP (metre) {
	return metre * 40;
}


function GSActionPhase () {
	var backGround;
	var showingTutorial = false;
	var lastKnownTouchNumber = 0;
	
	var	tutorialImage = new Image();
	tutorialImage.src = "Image/ActionPhase/UI/Tutorial.png";
	
	var jumpControlImage = new Image();
	jumpControlImage.src = "Image/ActionPhase/UI/JumpControl.png";
	var punchControlImage = new Image();
	punchControlImage.src = "Image/ActionPhase/UI/PunchControl.png";
	
	
	var showingDialogue;
	var dialogueBackground = new Image();
		dialogueBackground.src = "Image/ActionPhase/UI/ResultBG.png";
	var winText = new Image();
		winText.src = "Image/ActionPhase/UI/WinText.png";
	var loseText = new Image();
		loseText.src = "Image/ActionPhase/UI/LoseText.png";
	var starImage = new Image();
		starImage.src = "Image/ActionPhase/UI/Star.png";
	var starCollected;
	var starRating;
	
	
	this.Reset = function () {
		this.m_world = null;
		this.m_hero = null;
		this.m_platform = null;
		this.m_enemy = null;
		this.m_goal = null;
		this.m_bullet = null;
		
		showingDialogue = false;
		starCollected = 0;
		starRating = 0;
	}
	
	this.Win = function () {
		showingDialogue = true;
		if (starCollected == this.m_goal.length - 1) {
			starRating = 3;
		}
		else if (starCollected >= (this.m_goal.length - 1) / 2) {
			starRating = 2;
		}
		else {
			starRating = 1;
		}
		if (g_levelResult[this.m_level] < starRating) {
			g_levelResult[this.m_level] = starRating;
			SaveUserInfo();
		}
	}
	
	this.Lose = function () {
		showingDialogue = true;
		starRating = 0;
	}
	
	this.StarCollected = function () {
		starCollected ++;
	}
	
	this.StartEffect = function (type, x, y) {
		for (var i=0; i<this.m_effect.length; i++) {
			if (this.m_effect[i].m_live == false) {
				this.m_effect[i].Start(type, x, y);
				return;
			}
		}
		var temp = this.m_effect.length;
		this.m_effect[temp] = new Effect();
		this.m_effect[temp].Start(type, x, y);
	}
	
	
	this.StartBullet = function (type, x, y, dir) {
		for (var i=0; i<this.m_bullet.length; i++) {
			if (this.m_bullet[i].m_live == false) {
				this.m_bullet[i].Start(type, x, y, dir);
				return;
			}
		}
		var temp = this.m_bullet.length;
		this.m_bullet[temp] = new Bullet();
		this.m_bullet[temp].Start(type, x, y, dir);
	}


	this.Update = function () {
		if (showingDialogue == false && showingTutorial == false) {
			this.UpdateKeyboard();
			
			this.m_world.Step(
				0.017
				, 8
				, 8
			);
			// Reset force
			this.m_world.ClearForces();
			
			// Update all game object
			for (var i=0; i<this.m_goal.length; i++) {
				this.m_goal[i].Update();
			}
			for (var i=0; i<this.m_platform.length; i++) {
				this.m_platform[i].Update();
			}
			this.m_hero.Update();
			for (var i=0; i<this.m_enemy.length; i++) {
				this.m_enemy[i].Update();
			}
			for (var i=0; i<this.m_bullet.length; i++) {
				this.m_bullet[i].Update();
			}
			for (var i=0; i<this.m_effect.length; i++) {
				this.m_effect[i].Update();
			}
		}
		else if (showingDialogue == true) {
			retryButton.Update(g_mouseX, g_mouseY);
			menuButton.Update(g_mouseX, g_mouseY);
		}
		else if (showingTutorial == true) {
			if (g_mouseX.length > 0) {
				lastKnownTouchNumber = g_mouseX.length;
			}
			else {
				if (lastKnownTouchNumber > 0) {
					showingTutorial = false;
				}
				lastKnownTouchNumber = 0;
			}
		}
	}


	this.Draw = function () {
		context.drawImage (background, 0, 0);
		
		for (var i=0; i<this.m_platform.length; i++) {
			this.m_platform[i].Draw (context);
		}
		for (var i=0; i<this.m_goal.length; i++) {
			this.m_goal[i].Draw (context);
		}
		for (var i=0; i<this.m_effect.length; i++) {
			this.m_effect[i].Draw (context);
		}
		for (var i=0; i<this.m_enemy.length; i++) {
			this.m_enemy[i].Draw (context);
		}
		this.m_hero.Draw(context);
		for (var i=0; i<this.m_bullet.length; i++) {
			this.m_bullet[i].Draw (context);
		}
		
		/*
		if (g_keyState[38] == true) context.globalAlpha = 0.4;
		else	                    context.globalAlpha = 0.2;
		context.drawImage (jumpControlImage, 10, 532);
		context.drawImage (jumpControlImage, 1092, 532);
		
		if (g_keyState[32] == true) context.globalAlpha = 0.4;
		else	                    context.globalAlpha = 0.2;
		context.drawImage (punchControlImage, 198, 532);
		context.drawImage (punchControlImage, 904, 532);
		
		context.globalAlpha = 1;
		*/
		
		
		if (showingDialogue == true) {
			context.globalAlpha = 0.7;
			context.fillStyle = "#000000";
			context.fillRect (0, 0, 1280, 720);
			context.globalAlpha = 1;
		
			context.drawImage (dialogueBackground, 440, 240);
			if (starRating) {
				context.drawImage (winText, 440, 235);
				for (var i=0; i<starRating; i++) {
					context.drawImage (starImage, 520 + i * 80, 300);
				}
				context.globalAlpha = 0.3;
				for (var i=starRating; i<3; i++) {
					context.drawImage (starImage, 520 + i * 80, 300);
				}
				context.globalAlpha = 1;
			}
			else {
				context.drawImage (loseText, 440, 235);
				context.globalAlpha = 0.3;
				for (var i=starRating; i<3; i++) {
					context.drawImage (starImage, 520 + i * 80, 300);
				}
				context.globalAlpha = 1;
			}
			retryButton.Draw();
			menuButton.Draw();
		}
		else if (showingTutorial == true) {
			context.globalAlpha = 0.7;
			context.fillStyle = "#000000";
			context.fillRect (0, 0, 1280, 720);
			context.globalAlpha = 1;
		
			context.drawImage (tutorialImage, 0, 0);
		}
	}
	
	
	var jumpPressed = false;
	var punchPressed = false;
	this.UpdateKeyboard = function () {
		if (g_keyState[37] == true) {
			if (this.m_hero.m_punched == false) {
				this.m_hero.m_direction = 0;
				this.m_hero.m_moving = true;
			}
		}
		else if (g_keyState[39] == true) {
			if (this.m_hero.m_punched == false) {
				this.m_hero.m_direction = 1;
				this.m_hero.m_moving = true;
			}
		}
		else {
			this.m_hero.m_moving = false;
		}
		
		if (g_keyState[38] == true) {
			if (jumpPressed == false) {
				jumpPressed = true;
				this.m_hero.Jump();
			}
		}
		else {
			jumpPressed = false;
		}
		
		if (g_keyState[32] == true) {
			if (punchPressed == false) {
				punchPressed = true;
				this.m_hero.Punch();
			}
		}
		else {
			punchPressed = false;
		}
	}
	
	
	var Retry = function () {
		g_gsActionPhase.Reset();
		g_gsActionPhase.CreateLevel (g_gsActionPhase.m_level);
	}
	var BackToMenu = function () {
		g_gameState = 1;
	}
	var retryButton = new Button ("Image/ActionPhase/UI/RetryButton.png", 470, 380, 165, 80, Retry);
	var menuButton = new Button ("Image/ActionPhase/UI/MenuButton.png", 640, 380, 165, 80, BackToMenu);
	
	
	
	
	this.CreateLevel = function (level) {
		StopMusic();
		
		this.m_level = level;
		
		// Create a level, set up object and physic world
		this.m_world = new b2World(
			new b2Vec2(0, 10),	//gravity
			true				//allow sleep
		);
		
		var borderFixture = new b2FixtureDef;
		borderFixture.density = 0.5;
		borderFixture.friction = 0.0;
		borderFixture.restitution = 0.3;
		

		// Define left wall and right wall, prevent this.m_hero to run out of the screen
		var bodyDef = new b2BodyDef;
		bodyDef.type = b2Body.b2_staticBody;
		bodyDef.position.x = PtoM(0);
		bodyDef.position.y = PtoM(360);
		borderFixture.shape = new b2PolygonShape;
		borderFixture.shape.SetAsBox(PtoM(1), PtoM(500));
		this.m_world.CreateBody(bodyDef).CreateFixture(borderFixture);
		
		bodyDef.position.x = PtoM(1280);
		bodyDef.position.y = PtoM(360);
		borderFixture.shape = new b2PolygonShape;
		borderFixture.shape.SetAsBox(PtoM(1), PtoM(500));
		this.m_world.CreateBody(bodyDef).CreateFixture(borderFixture);
		
		// Define object
		this.m_goal = new Array();
		this.m_platform = new Array();
		this.m_enemy = new Array();
		
		this.m_effect = new Array();
		this.m_bullet = new Array();
		
		if (level == 1) {
			showingTutorial = true;
			lastKnownTouchNumber = 0;
			
			background = new Image();
			background.src = "Image/ActionPhase/Background/1.jpg";
		
			this.m_platform[0] = new Platform (1, 0, 670, 1300, 50);
			this.m_platform[1] = new Platform (1, 600, 570, 100, 50);
			this.m_platform[2] = new Platform (1, 400, 470, 200, 50);
			this.m_platform[3] = new Platform (1, 0, 370, 300, 50);
			this.m_platform[4] = new Platform (1, 0, 270, 100, 50);
			this.m_platform[5] = new Platform (1, 200, 170, 300, 50);
			this.m_platform[6] = new Platform (1, 550, 270, 300, 50);
			this.m_platform[7] = new Platform (1, 1050, 70, 100, 50);
			this.m_platform[8] = new Platform (1, 870, 170, 100, 50);
			this.m_platform[9] = new Platform (1, 800, 470, 200, 50);
			
			this.m_enemy[0] = new Enemy (1, 700, 230, 0);
			this.m_enemy[1] = new Enemy (1, 900, 430, 0);
			
			this.m_goal[0] = new Goal(0, 1080, 20);
			this.m_goal[1] = new Goal(1, 950, 420);
			this.m_goal[2] = new Goal(1, 200, 320);
			this.m_goal[3] = new Goal(1, 660, 70);
			
		
			this.m_hero = new Hero (400, 630);
		}
		else if (level == 2) {
			background = new Image();
			background.src = "Image/ActionPhase/Background/1.jpg";
			
			this.m_platform[0] = new Platform (1, 0, 670, 400, 50);
			this.m_platform[1] = new Platform (1, 600, 670, 300, 50);
			this.m_platform[2] = new Platform (1, 350, 570, 300, 50);
			this.m_platform[3] = new Platform (1, 200, 470, 100, 50);
			this.m_platform[4] = new Platform (1, 50, 370, 100, 50);
			this.m_platform[5] = new Platform (1, 200, 270, 100, 50);
			this.m_platform[6] = new Platform (1, 500, 370, 400, 50);
			this.m_platform[7] = new Platform (1, 1000, 270, 100, 50);
			this.m_platform[8] = new Platform (1, 700, 170, 200, 50);
			this.m_platform[9] = new Platform (1, 500, 70, 100, 50);
			this.m_platform[10] = new Platform (1, 900, 570, 100, 50);
			this.m_platform[11] = new Platform (1, 1000, 470, 100, 50);
			this.m_platform[12] = new Platform (1, 350, 170, 100, 50);
			
			this.m_enemy[0] = new Enemy (1, 400, 520, 0);
			this.m_enemy[1] = new Enemy (1, 850, 320, 0);
			this.m_enemy[2] = new Enemy (1, 500, 320, 1);
			
			this.m_goal[0] = new Goal(0, 530, 20);
			this.m_goal[1] = new Goal(1, 675, 320);
			this.m_goal[2] = new Goal(1, 530, 520);
			this.m_goal[3] = new Goal(1, 1000, 20);
			
			this.m_hero = new Hero (100, 620);
		}
		else if (level == 3) {
			background = new Image();
			background.src = "Image/ActionPhase/Background/1.jpg";
			
			this.m_platform[0] = new Platform (1, 1100, 670, 100, 50);
			this.m_platform[1] = new Platform (1, 1000, 570, 100, 50);
			this.m_platform[2] = new Platform (1, 850, 470, 100, 50);
			this.m_platform[3] = new Platform (1, 300, 570, 400, 50);
			this.m_platform[4] = new Platform (1, 200, 470, 50, 50);
			this.m_platform[5] = new Platform (1, 100, 370, 50, 50);
			this.m_platform[6] = new Platform (1, 200, 270, 150, 50);
			this.m_platform[7] = new Platform (1, 400, 170, 200, 50);
			this.m_platform[8] = new Platform (1, 820, 220, 200, 50);
			this.m_platform[9] = new Platform (1, 1100, 170, 100, 50);
			this.m_platform[10] = new Platform (1, 950, 70, 100, 50);
			this.m_platform[11] = new Platform (1, 500, 370, 200, 50);
			
			this.m_enemy[0] = new Enemy (2, 500, 330, 0);
			this.m_enemy[1] = new Enemy (1, 450, 130, 0);
			
			this.m_goal[0] = new Goal(0, 950, 20);
			this.m_goal[1] = new Goal(1, 900, 120);
			this.m_goal[2] = new Goal(1, 530, 320);
			this.m_goal[3] = new Goal(1, 630, 320);
			
			this.m_hero = new Hero (1150, 620);
		}
		else if (level == 4) {
			background = new Image();
			background.src = "Image/ActionPhase/Background/1.jpg";
			
			this.m_platform[0] = new Platform (1, 1150, 670, 50, 50);
			this.m_platform[1] = new Platform (1, 900, 670, 50, 50);
			this.m_platform[2] = new Platform (1, 650, 670, 50, 50);
			this.m_platform[3] = new Platform (1, 400, 670, 50, 50);
			this.m_platform[4] = new Platform (1, 150, 670, 50, 50);
			this.m_platform[5] = new Platform (1, 0, 570, 50, 50);
			this.m_platform[6] = new Platform (1, 650, 470, 50, 50);
			this.m_platform[7] = new Platform (1, 900, 470, 50, 50);
			this.m_platform[8] = new Platform (1, 150, 470, 300, 50);
			this.m_platform[9] = new Platform (1, 1100, 370, 100, 50);
			this.m_platform[10] = new Platform (1, 900, 270, 50, 50);
			this.m_platform[11] = new Platform (1, 700, 170, 50, 50);
			this.m_platform[12] = new Platform (1, 350, 70, 200, 50);
			this.m_platform[13] = new Platform (1, 250, 170, 50, 50);
			this.m_platform[14] = new Platform (1, 0, 370, 50, 50);
			this.m_platform[15] = new Platform (1, 500, 270, 50, 50);
			this.m_platform[16] = new Platform (1, 150, 270, 50, 50);
		
			this.m_enemy[0] = new Enemy (1, 200, 420, 0);
			this.m_enemy[1] = new Enemy (1, 400, 20, 0);
			
			this.m_goal[0] = new Goal(0, 400, 20);
			this.m_goal[1] = new Goal(1, 780, 520);
			this.m_goal[2] = new Goal(1, 500, 220);
			this.m_goal[3] = new Goal(1, 800, 20);
			
			this.m_hero = new Hero (1150, 620);
		}
		else if (level == 5) {
			background = new Image();
			background.src = "Image/ActionPhase/Background/1.jpg";
			
			this.m_platform[0] = new Platform (1, 0, 670, 50, 50);
			this.m_platform[1] = new Platform (1, 100, 570, 50, 50);
			this.m_platform[2] = new Platform (1, 450, 670, 150, 50);
			this.m_platform[3] = new Platform (1, 750, 670, 150, 50);
			this.m_platform[4] = new Platform (1, 950, 570, 150, 50);
			this.m_platform[6] = new Platform (1, 450, 470, 150, 50);
			this.m_platform[7] = new Platform (1, 350, 370, 50, 50);
			this.m_platform[10] = new Platform (1, 600, 70, 50, 50);
			this.m_platform[11] = new Platform (1, 610, 570, 50, 50);
			this.m_platform[5] = new Platform (1, 950, 440, 150, 50);
			this.m_platform[12] = new Platform (1, 1200, 480, 100, 50);
			this.m_platform[13] = new Platform (1, 1200, 290, 100, 50);
			this.m_platform[14] = new Platform (1, 100, 270, 150, 50);
			this.m_platform[15] = new Platform (1, 400, 170, 100, 50);
			this.m_platform[8] = new Platform (1, 830, 300, 50, 50);
			this.m_platform[9] = new Platform (1, 950, 200, 50, 50);
			this.m_platform[16] = new Platform (1, 780, 100, 50, 50);
			
			this.m_enemy[0] = new Enemy (1, 500, 420, 0);
			this.m_enemy[1] = new Enemy (1, 150, 220, 1);
			this.m_enemy[2] = new Enemy (1, 850, 620, 1);
			this.m_enemy[3] = new Enemy (1, 1050, 520, 1);
			this.m_enemy[4] = new Enemy (1, 1050, 400, 1);
			this.m_enemy[5] = new Enemy (1, 950, 400, 0);
			
			this.m_goal[0] = new Goal(0, 600, 20);
			this.m_goal[1] = new Goal(1, 400, 120);
			this.m_goal[2] = new Goal(1, 800, 470);
			this.m_goal[3] = new Goal(1, 1220, 150);

			
			this.m_hero = new Hero (0, 620);
		}
		else if (level == 6) {
			background = new Image();
			background.src = "Image/ActionPhase/Background/2.jpg";
			
			this.m_platform[0] = new Platform (2, 0, 670, 400, 50);
			this.m_platform[1] = new Platform (2, 900, 670, 400, 50);
			this.m_platform[2] = new Platform (2, 1200, 570, 100, 50);
			this.m_platform[3] = new Platform (2, 900, 470, 200, 50);
			this.m_platform[4] = new Platform (2, 200, 470, 200, 50);
			this.m_platform[5] = new Platform (2, 0, 370, 100, 50);
			this.m_platform[6] = new Platform (2, 900, 270, 200, 50);
			this.m_platform[7] = new Platform (2, 200, 270, 200, 50);
			this.m_platform[8] = new Platform (2, 1200, 170, 100, 50);
			this.m_platform[9] = new Platform (2, 0, 170, 100, 50);
			
			
			this.m_platform[10] = new Platform (2, 500, 670, 200, 50, 1, 410, 690, 1.5);
			this.m_platform[11] = new Platform (2, 450, 470, 150, 50, 1, 410, 740, 2);
			this.m_platform[12] = new Platform (2, 700, 270, 100, 50, 1, 410, 790, 2.5);
			
			
			
			this.m_enemy[0] = new Enemy (1, 200, 420, 1);
			this.m_enemy[1] = new Enemy (1, 1000, 220, 1);
			
			this.m_goal[0] = new Goal(0, 1200, 20);
			this.m_goal[2] = new Goal(1, 600, 320);
			this.m_goal[3] = new Goal(1, 600, 120);
			this.m_goal[1] = new Goal(1, 0, 100);
			
			this.m_hero = new Hero (0, 620);
		}
		else if (level == 7) {
			background = new Image();
			background.src = "Image/ActionPhase/Background/2.jpg";
		
			this.m_platform[0] = new Platform (2, 950, 670, 100, 50);
			this.m_platform[1] = new Platform (2, 1150, 470, 100, 50, 2, 370, 670, 1.5);
			this.m_platform[2] = new Platform (2, 950, 370, 100, 50);
			this.m_platform[3] = new Platform (2, 650, 370, 100, 50, 1, 510, 840, 2);
			this.m_platform[4] = new Platform (2, 200, 370, 300, 50);
			this.m_platform[5] = new Platform (2, 0, 470, 100, 50);
			this.m_platform[6] = new Platform (2, 100, 570, 200, 50);
			this.m_platform[7] = new Platform (2, 300, 670, 100, 50);
			this.m_platform[8] = new Platform (2, 200, 270, 50, 50);
			this.m_platform[9] = new Platform (2, 300, 170, 50, 50, 1, 310, 640, 2);
			this.m_platform[10] = new Platform (2, 700, 70, 250, 50);
			
			this.m_enemy[0] = new Enemy (1, 150, 520, 1);
			this.m_enemy[1] = new Enemy (2, 400, 320, 1);
			this.m_enemy[2] = new Enemy (2, 250, 520, 1);
			
			
			this.m_goal[0] = new Goal(0, 900, 20);
			this.m_goal[1] = new Goal(1, 300, 620);
			this.m_goal[2] = new Goal(1, 700, 220);
			this.m_goal[3] = new Goal(1, 1200, 200);
			
			this.m_hero = new Hero (950, 620);
		}
		else if (level == 8) {
			background = new Image();
			background.src = "Image/ActionPhase/Background/2.jpg";
			
			this.m_platform[0] = new Platform (2, 0, 670, 150, 50);
			this.m_platform[1] = new Platform (2, 200, 670, 100, 50, 2, 400, 670, 2);
			this.m_platform[2] = new Platform (2, 350, 370, 100, 50, 2, 300, 570, 1.5);
			this.m_platform[3] = new Platform (2, 500, 170, 100, 50, 2, 200, 470, 2);
			this.m_platform[4] = new Platform (2, 650, 310, 100, 50, 2, 200, 470, 2.5);
			this.m_platform[5] = new Platform (2, 1000, 670, 300, 50);
			this.m_platform[6] = new Platform (2, 0, 370, 150, 50);
			
			
			this.m_enemy[0] = new Enemy (1, 1100, 620, 1);
			this.m_enemy[1] = new Enemy (2, 0, 330, 1);
			
			this.m_goal[0] = new Goal(0, 1220, 520);
			this.m_goal[1] = new Goal(1, 400, 120);
			this.m_goal[2] = new Goal(1, 1050, 220);
			this.m_goal[3] = new Goal(1, 0, 300);
			
			this.m_hero = new Hero (0, 620);
			
		}
		else if (level == 9) {
			background = new Image();
			background.src = "Image/ActionPhase/Background/2.jpg";
			
			this.m_platform[0] = new Platform (2, 0, 670, 50, 50);
			this.m_platform[1] = new Platform (2, 60, 670, 50, 50, 1, 60, 240, 2);
			this.m_platform[2] = new Platform (2, 540, 670, 50, 50, 1, 360, 540, 2);
			this.m_platform[3] = new Platform (2, 660, 670, 50, 50, 1, 660, 840, 2);
			this.m_platform[4] = new Platform (2, 1140, 670, 50, 50, 1, 960, 1140, 2);
			this.m_platform[5] = new Platform (2, 1200, 670, 50, 50, 2, 490, 670, 2);
			this.m_platform[6] = new Platform (2, 1100, 290, 50, 50, 2, 290, 470, 2);
			this.m_platform[7] = new Platform (2, 800, 270, 200, 50);

			this.m_platform[9] = new Platform (2, 400, 270, 200, 50);
			this.m_platform[10] = new Platform (2, 200, 170, 100, 50);
			this.m_platform[8] = new Platform (2, 400, 70, 100, 50);
			
			this.m_enemy[0] = new Enemy (2, 400, 230, 1);
			this.m_enemy[1] = new Enemy (1, 850, 230, 1);
			
			this.m_goal[0] = new Goal(0, 450, 20);
			this.m_goal[1] = new Goal(1, 1200, 80);
			this.m_goal[2] = new Goal(1, 800, 80);
			this.m_goal[3] = new Goal(1, 600, 520);
		
			
			this.m_hero = new Hero (0, 620);
		}
		else if (level == 10) {
			background = new Image();
			background.src = "Image/ActionPhase/Background/2.jpg";
			
			this.m_platform[0] = new Platform (2, 400, 670, 150, 50);
			this.m_platform[1] = new Platform (2, 60, 570, 50, 50, 1, 10, 340, 1);
			this.m_platform[2] = new Platform (2, 120, 470, 50, 50, 1, 10, 340, 1.5);
			this.m_platform[3] = new Platform (2, 320, 370, 50, 50, 1, 10, 340, 2);
			this.m_platform[4] = new Platform (2, 10, 270, 50, 50, 1, 10, 340, 2.5);
			this.m_platform[5] = new Platform (2, 220, 170, 50, 50, 1, 10, 340, 3);
			this.m_platform[6] = new Platform (2, 400, 70, 150, 50);
			this.m_platform[7] = new Platform (2, 800, 570, 300, 50);
			this.m_platform[8] = new Platform (2, 900, 470, 400, 50);
			this.m_platform[9] = new Platform (2, 1000, 370, 300, 50);
			this.m_platform[10] = new Platform (2, 1100, 270, 200, 50);
			this.m_platform[11] = new Platform (2, 1000, 670, 300, 50);
			
			this.m_enemy[0] = new Enemy (2, 1000, 530, 0);
			this.m_enemy[1] = new Enemy (2, 1100, 430, 1);
			this.m_enemy[2] = new Enemy (2, 1150, 330, 0);
			this.m_enemy[3] = new Enemy (2, 1200, 230, 1);
			
			this.m_goal[0] = new Goal(0, 1220, 120);
			this.m_goal[1] = new Goal(1, 0, 220);
			this.m_goal[2] = new Goal(1, 100, 420);
			this.m_goal[3] = new Goal(1, 1000, 620);
			
			this.m_hero = new Hero (400, 620);
		}
		else if (level == 11) {
			background = new Image();
			background.src = "Image/ActionPhase/Background/3.jpg";
			
			this.m_platform[0] = new Platform (3, 500, 670, 150, 50);
			this.m_platform[1] = new Platform (4, 800, 570, 100, 50);
			this.m_platform[2] = new Platform (4, 1000, 470, 100, 50);
			this.m_platform[3] = new Platform (4, 1200, 370, 100, 50);
			this.m_platform[4] = new Platform (4, 800, 270, 300, 50);
			this.m_platform[5] = new Platform (4, 700, 170, 50, 50);
			this.m_platform[6] = new Platform (4, 800, 70, 50, 50);
			this.m_platform[7] = new Platform (3, 250, 570, 100, 50);
			this.m_platform[8] = new Platform (3, 50, 470, 100, 50);
			this.m_platform[9] = new Platform (3, 250, 370, 100, 50);
			this.m_platform[10] = new Platform (3, 400, 270, 100, 50);
			this.m_platform[11] = new Platform (3, 550, 170, 50, 50);
			
			this.m_enemy[0] = new Enemy (2, 250, 530, 0);
			this.m_enemy[1] = new Enemy (2, 100, 430, 0);
			this.m_enemy[2] = new Enemy (2, 250, 330, 0);
			this.m_enemy[3] = new Enemy (2, 400, 230, 0);
			
			this.m_goal[0] = new Goal(0, 800, 20);
			this.m_goal[1] = new Goal(1, 700, 120);
			this.m_goal[2] = new Goal(1, 1150, 120);
			this.m_goal[3] = new Goal(1, 330, 520);
			
			this.m_hero = new Hero (500, 620);
		}
		else if (level == 12) {
			background = new Image();
			background.src = "Image/ActionPhase/Background/3.jpg";
			
			this.m_platform[0] = new Platform (4, 0, 670, 200, 50);
			this.m_platform[1] = new Platform (4, 420, 670, 200, 50);
			this.m_platform[2] = new Platform (4, 840, 670, 200, 50);
			this.m_platform[3] = new Platform (4, 1180, 570, 100, 50);
			this.m_platform[4] = new Platform (4, 950, 470, 100, 50);
			this.m_platform[5] = new Platform (4, 1180, 370, 100, 50);
			this.m_platform[6] = new Platform (4, 950, 270, 100, 50);
			this.m_platform[7] = new Platform (4, 1180, 170, 100, 50);
			this.m_platform[8] = new Platform (4, 840, 70, 200, 50);
			this.m_platform[9] = new Platform (4, 420, 270, 200, 50);
			this.m_platform[10] = new Platform (3, 0, 470, 200, 50);
			this.m_platform[11] = new Platform (3, 0, 270, 100, 50);
			this.m_platform[12] = new Platform (4, 200, 170, 100, 50);
			
			this.m_enemy[0] = new Enemy (2, 0, 230, 0);
			this.m_enemy[1] = new Enemy (2, 0, 430, 0);
			
			this.m_goal[0] = new Goal(0, 0, 150);
			this.m_goal[1] = new Goal(1, 650, 350);
			this.m_goal[2] = new Goal(1, 0, 400);
			this.m_goal[3] = new Goal(1, 900, 400);
			
			
			this.m_hero = new Hero (0, 620);
		}
		else if (level == 13) {
			background = new Image();
			background.src = "Image/ActionPhase/Background/3.jpg";
			
			this.m_platform.push(new Platform (3, 0, 70, 50, 50));
			this.m_platform.push(new Platform (4, 220, 670, 50, 50, 1, 10, 500, 4));
			this.m_platform.push(new Platform (3, 600, 570, 50, 50));
			this.m_platform.push(new Platform (4, 700, 670, 50, 50, 1, 700, 1100, 3));
			this.m_platform.push(new Platform (3, 1170, 570, 100, 50));
			this.m_platform.push(new Platform (4, 850, 470, 50, 50, 1, 850, 1100, 4));
			this.m_platform.push(new Platform (3, 700, 370, 100, 50));
			this.m_platform.push(new Platform (4, 850, 270, 50, 50, 1, 850, 1100, 3));
			this.m_platform.push(new Platform (3, 1170, 170, 100, 50));
			this.m_platform.push(new Platform (3, 1170, 370, 100, 50));
			
			this.m_hero = new Hero (0, 50);
			
			this.m_enemy.push(new Enemy (1, 700, 350, 0));
			this.m_enemy.push(new Enemy (2, 1200, 550, 0));
			this.m_enemy.push(new Enemy (2, 1200, 350, 0));
			
			this.m_goal.push(new Goal(0, 1200, 50));
			this.m_goal.push(new Goal(1, 1000, 50));
			this.m_goal.push(new Goal(1, 100, 350));
			this.m_goal.push(new Goal(1, 700, 150));
		}
		else if (level == 14) {
			background = new Image();
			background.src = "Image/ActionPhase/Background/3.jpg";
			
			this.m_platform.push(new Platform (3, 0, 670, 450, 50));
			this.m_platform.push(new Platform (3, 880, 670, 400, 50));
			this.m_platform.push(new Platform (3, 350, 570, 50, 50));
			this.m_platform.push(new Platform (3, 250, 470, 50, 50));
			this.m_platform.push(new Platform (3, 350, 370, 50, 50));
			this.m_platform.push(new Platform (3, 0, 370, 100, 50));
			this.m_platform.push(new Platform (3, 200, 270, 200, 50));
			this.m_platform.push(new Platform (4, 880, 270, 50, 50, 2, 270, 570, 3));
			this.m_platform.push(new Platform (3, 1180, 270, 100, 50));
			
			this.m_hero = new Hero (100, 650);
			
			this.m_enemy.push(new Enemy (2, 0, 350, 0));
			this.m_enemy.push(new Enemy (1, 200, 250, 0));
			this.m_enemy.push(new Enemy (1, 300, 250, 0));
			this.m_enemy.push(new Enemy (2, 1180, 250, 0));
			this.m_enemy.push(new Enemy (1, 1100, 650, 0));
			
			this.m_goal.push(new Goal(0, 300, 80));
			this.m_goal.push(new Goal(1, 1100, 550));
			this.m_goal.push(new Goal(1, 1100, 300));
			this.m_goal.push(new Goal(1, 420, 370));
		}
		else if (level == 15) {
			background = new Image();
			background.src = "Image/ActionPhase/Background/3.jpg";
			
			this.m_platform.push(new Platform (3, 1180, 670, 100, 50));
			this.m_platform.push(new Platform (4, 1050, 670, 50, 50, 2, 270, 670, 2));
			this.m_platform.push(new Platform (3, 1180, 470, 100, 50));
			this.m_platform.push(new Platform (3, 1180, 270, 100, 50));
			this.m_platform.push(new Platform (3, 0, 670, 200, 50));
			this.m_platform.push(new Platform (4, 300, 370, 50, 50, 2, 270, 670, 2));
			this.m_platform.push(new Platform (3, 0, 570, 100, 50));
			this.m_platform.push(new Platform (3, 0, 370, 100, 50));
			
			this.m_hero = new Hero (1200, 650);
			
			this.m_enemy.push(new Enemy (2, 1200, 450, 0));
			this.m_enemy.push(new Enemy (2, 1200, 250, 0));
			this.m_enemy.push(new Enemy (2, 0, 550, 0));
			this.m_enemy.push(new Enemy (2, 0, 350, 0));
			
			
			this.m_goal.push(new Goal(0, 300, 80));
			this.m_goal.push(new Goal(1, 1200, 100));
			this.m_goal.push(new Goal(1, 1, 200));
			this.m_goal.push(new Goal(1, 1000, 470));
		}
	}
}
