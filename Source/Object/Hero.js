function Hero (x, y) {
	var BLOCK_W = 40;
	
	// Hero's properties
	this.m_x = x;
	this.m_y = y;
	this.m_direction = 0; // direction hero facing, 0 = left, 1 = right
	this.m_moving = false;
	this.m_punching = false;
	this.m_punched = false;
	this.m_punchedDirection = 0;
	this.m_brakeSpeed = 0;
	this.m_flying = 0; //0 = landing, 1 = jumping, 2 = falling
	this.m_relativeSpeedX = 0;
	
	this.HP = 100;
	
	// Fixture
	this.m_fixture = new b2FixtureDef;
	this.m_fixture.density = 0.5;
	this.m_fixture.friction = 0.0;
	this.m_fixture.restitution = 0.0;
	
	// Physic body
	var bodyDef = new b2BodyDef;
	bodyDef.type = b2Body.b2_dynamicBody;
	bodyDef.position.x = PtoM(x + BLOCK_W/2);
	bodyDef.position.y = PtoM(y + BLOCK_W/2);
	this.m_fixture.shape = new b2PolygonShape;
	this.m_fixture.shape.SetAsBox(PtoM(BLOCK_W/2), PtoM(BLOCK_W/2));
	
	this.m_body = g_gsActionPhase.m_world.CreateBody(bodyDef);
	this.m_body.CreateFixture(this.m_fixture);
	this.m_body.SetFixedRotation (true);  // Prevent the "box" hero to rotate.
	
	// Image
	var m_image = new Image();
		m_image.src = "Image/ActionPhase/Hero/Hero.png";
	
	var m_jumpSound = new Audio();
		m_jumpSound.src = "Sound/Jump.mp3";
	var m_punchSound = new Audio();
		m_punchSound.src = "Sound/AirPunch.mp3";
		
	var m_impactSoundDelay = 0;
	var m_impactSound = new Array();
	for (var i=0; i<4; i++) {
		m_impactSound[i] = new Audio();
		m_impactSound[i].src = "Sound/Impact" + (i+1) + ".mp3";
	}
	var m_oldSpeedX = 0;
	var m_oldSpeedY = 0;
	
	
	var animation = 0;
	var animCount = 0;
	
	
	this.Update = function () {
		// Update hero position according to his physic body.
		// Hero position is in pixel, while his body's is in metre, that's why we need the formula:
		this.m_x = MtoP(this.m_body.GetPosition().x) - BLOCK_W/2;
		this.m_y = MtoP(this.m_body.GetPosition().y) - BLOCK_W/2;
		
		
		// We get hero's vertical speed,
		// If his speed is too slow, he is considered as "landed"
		var velocity = this.m_body.GetLinearVelocity();
		if (velocity.y < -0.01) {

		}		
		else if (velocity.y > 0.01) {
			this.m_flying = -1;
		}
		else {
			this.m_flying = 0;
		}
		
		
		this.m_relativeSpeedX = 0;
		if (this.m_punched == true) {
			// Try to brake if he touch the ground
			this.m_brakeSpeed = 0.5;
			for (var i=0; i<g_gsActionPhase.m_platform.length; i++) {
				var pf = g_gsActionPhase.m_platform[i];
				if (this.m_y < pf.m_y && this.m_y > pf.m_y - BLOCK_W * 1.01) {
					if (this.m_x >= pf.m_x - BLOCK_W && this.m_x <= pf.m_x + pf.m_w) {
						var velocity = this.m_body.GetLinearVelocity();
						if (pf.m_type == 4) {
							this.m_brakeSpeed = 0.05;
						}
						if (Math.abs(velocity.x) > 0.1) {
							this.Stop();
						}
						else {
							this.m_punched = false;
						}
						if (pf.m_eDir == 1) {
							if (pf.m_direction == 0) {
								this.m_relativeSpeedX = -pf.m_speed;
							}
							else if (pf.m_direction == 1) {
								this.m_relativeSpeedX = pf.m_speed;
							}
						}
						this.m_flying = 0;
						break;
					}
				}
			}
		}
		else {
			this.m_brakeSpeed = 0.5;
			for (var i=0; i<g_gsActionPhase.m_platform.length; i++) {
				var pf = g_gsActionPhase.m_platform[i];
				if (this.m_y < pf.m_y && this.m_y > pf.m_y - BLOCK_W * 1.01) {
					if (this.m_x >= pf.m_x - BLOCK_W && this.m_x <= pf.m_x + pf.m_w) {
						if (pf.m_type == 4) {
							this.m_brakeSpeed = 0.05;
						}
						if (pf.m_eDir == 1) {
							if (pf.m_direction == 0) {
								this.m_relativeSpeedX = -pf.m_speed;
							}
							else if (pf.m_direction == 1) {
								this.m_relativeSpeedX = pf.m_speed;
							}
						}
						this.m_flying = 0;
						break;
					}
				}
			}
			
			if (this.m_punching == true) {
				animCount += g_deltaTime;
				if (animCount > 100) {
					animCount = 0;
					animation ++;
					
					if (animation == 3) {
						this.CheckEnemyAndPunchThem();
					}
					else if (animation > 5) {
						animation = 0;
						this.m_punching = false;
					}
				}
			}
			
			if (this.m_moving == true) {
				// If hero is moving
				if (this.m_punching == false) {
					animCount += g_deltaTime;
					if (animCount > 150) {
						animCount = 0;
						animation ++;
						if (animation > 3) animation = 0;
					}
				}
				
				if (this.m_direction == 0) {
					this.Move (-0.5);
				}
				else if (this.m_direction == 1) {
					this.Move (0.5);
				}
			}
			else {
				if (this.m_punching == false) {
					animation = 0;
					animCount = 0;
				}
				
				this.Stop();
			}
		}
		
		if (this.m_y > 780) {
			this.TakeDamage (100);
		}
		
		// IMPACT!!!
		if (m_impactSoundDelay > 0) {
			m_impactSoundDelay -= g_deltaTime;
			if (m_impactSoundDelay < 0) m_impactSoundDelay = 0;
		}
		var velocity = this.m_body.GetLinearVelocity();
		if (Math.abs(velocity.x - m_oldSpeedX) > 8) {
			FireImpactSound();
		}
		else if (Math.abs(velocity.y - m_oldSpeedY) > 8) {
			FireImpactSound();
		}
		m_oldSpeedX = velocity.x;
		m_oldSpeedY = velocity.y;
	}
	
	var FireImpactSound = function () {
		if (m_impactSoundDelay == 0) {
			if (g_enableSound == 1) {
				m_impactSound[(Math.random() * 4) >> 0].play();
			}
			m_impactSoundDelay = 300;
		}
	}
	
	this.Move = function (speed) {
		var velocity = this.m_body.GetLinearVelocity();
			velocity.Add(new b2Vec2(speed * (this.m_brakeSpeed * 2), 0));
			
		if (velocity.x > this.m_relativeSpeedX + 4) {
			velocity.x = this.m_relativeSpeedX + 4;
			this.m_body.SetLinearVelocity(velocity);
		}
		else if (velocity.x < this.m_relativeSpeedX - 4) {
			velocity.x = this.m_relativeSpeedX - 4;
			this.m_body.SetLinearVelocity(velocity);
		}
		
		this.m_body.ApplyForce (new b2Vec2(speed * 0.001, 0), this.m_body.GetWorldCenter());
	}
	
	this.Stop = function () {
		var velocity = this.m_body.GetLinearVelocity();
		if (Math.abs (velocity.x - this.m_relativeSpeedX) <= 0.5) {
			velocity.x = this.m_relativeSpeedX;
		}
		else if (velocity.x < this.m_relativeSpeedX) {
			velocity.x += this.m_brakeSpeed;
		}
		else if (velocity.x > this.m_relativeSpeedX) {
			velocity.x -= this.m_brakeSpeed;
		}
		this.m_body.SetLinearVelocity(velocity);
	}
	
	this.Jump = function () {
		if (this.m_punched == false) {
			var velocity = this.m_body.GetLinearVelocity();
			if (this.m_flying == 0) {
				var velocity = this.m_body.GetLinearVelocity();
				velocity.Add(new b2Vec2(0, -7.5));
				this.m_body.SetLinearVelocity(velocity);
				this.m_body.ApplyForce (new b2Vec2(0, -0.001), this.m_body.GetWorldCenter());
				this.m_flying = 1;
				
				if (g_enableSound == 1) {
					m_jumpSound.play();
				}
			}
		}
	}
	
	this.Punch = function () {
		// Can't do a mid air punch
		if (this.m_flying == 0 && this.m_punched == false) {
			this.m_punching = true;
			animCount = 0;
			animation = 0;
			if (g_enableSound == 1) {
				m_punchSound.play();
			}
		}
	}
	
	this.GetPunched = function (fX, fY) {
		if (this.m_live == false) return;
		
		this.m_body.SetLinearVelocity(new b2Vec2(fX * 0.00, fY * 0.01));
		this.m_body.ApplyForce (new b2Vec2(fX, fY), this.m_body.GetWorldCenter());
		
		this.m_punched = true;
		if (fX < 0)
			this.m_punchedDirection = 0;
		else
			this.m_punchedDirection = 1;
		this.m_punching = false;
		animation = 0;
		animCount = 0;
	}
	
	this.Draw = function (context) {
		// Draw the hero according to his facing
		var signX = 1;
		if (this.m_direction == 0) {
			context.save();
			context.translate (50, 0);
			context.scale (-1, 1);
			signX = -1;
		}
		
		if (this.m_punched == true) {
			if (this.m_punchedDirection != this.m_direction) {
				context.drawImage (m_image, 100, 50, 50, 50, this.m_x * signX, this.m_y - 10, 50, 50);
			}
			else {
				context.drawImage (m_image, 150, 50, 50, 50, this.m_x * signX, this.m_y - 10, 50, 50);
			}
		}
		else if (this.m_flying == 1) {
			context.drawImage (m_image, 0, 50, 50, 50, this.m_x * signX, this.m_y - 10, 50, 50);
		}
		else if (this.m_flying == -1) {
			context.drawImage (m_image, 50, 50, 50, 50, this.m_x * signX, this.m_y - 10, 50, 50);
		}
		else if (this.m_punching == true) {
			switch (animation) {
				case 0:
					context.drawImage (m_image, 0, 100, 50, 50, this.m_x * signX, this.m_y - 10, 50, 50);
					break;
				case 1:
					context.drawImage (m_image, 50, 100, 50, 50, this.m_x * signX, this.m_y - 10, 50, 50);
					break;
				case 2:
					context.drawImage (m_image, 100, 100, 50, 50, this.m_x * signX, this.m_y - 10, 50, 50);
					break;
				case 3: case 4: case 5:
					context.drawImage (m_image, 150, 100, 50, 50, this.m_x * signX, this.m_y - 10, 50, 50);
					break;
			}
		}
		else {
			switch (animation) {
				case 0: case 2:
					context.drawImage (m_image, 0, 0, 50, 50, this.m_x * signX, this.m_y - 10, 50, 50);
					break;
				case 1:
					context.drawImage (m_image, 50, 0, 50, 50, this.m_x * signX, this.m_y - 10, 50, 50);
					break;
				case 3:
					context.drawImage (m_image, 100, 0, 50, 50, this.m_x * signX, this.m_y - 10, 50, 50);
					break;
			}
		}
		
		if (this.m_direction == 0) {
			context.restore();
		}
	}
	
	
	
	
	this.TakeDamage = function (damage) {
		// He is hit...
		this.HP -= damage;
		if (this.HP <= 0) {
			g_gsActionPhase.Lose();
		}
	}
	
	this.CheckEnemyAndPunchThem = function () {
		for (var i=0; i<g_gsActionPhase.m_enemy.length; i++) {
			if (this.m_direction == 0) {
				if (g_gsActionPhase.m_enemy[i].m_x < this.m_x && g_gsActionPhase.m_enemy[i].m_x > this.m_x - 70
				&&  g_gsActionPhase.m_enemy[i].m_y < this.m_y + 35 && g_gsActionPhase.m_enemy[i].m_y > this.m_y - 35) {
					g_gsActionPhase.m_enemy[i].GetPunched(-200, -150);
					g_gsActionPhase.StartEffect (0, this.m_x - 20, this.m_y + 20);
				}
			}
			else if (this.m_direction == 1) {
				if (g_gsActionPhase.m_enemy[i].m_x > this.m_x && g_gsActionPhase.m_enemy[i].m_x < this.m_x + 70
				&&  g_gsActionPhase.m_enemy[i].m_y < this.m_y + 35 && g_gsActionPhase.m_enemy[i].m_y > this.m_y - 35) {
					g_gsActionPhase.m_enemy[i].GetPunched(200, -150);
					g_gsActionPhase.StartEffect (0, this.m_x + 60, this.m_y + 20);
				}
			}
		}
	}
}