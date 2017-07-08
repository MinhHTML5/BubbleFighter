function Enemy (type, x, y, dir) {
	var BLOCK_W = 40;
	
	
	// All of this, you can refer to hero section, right?
	// They are a lot the same.
	this.m_type = type;
	this.m_x = x;
	this.m_y = y;
	this.m_direction = dir;
	this.m_live = true;
	this.m_moving = true;
	this.m_punching = false;
	this.m_punched = false;
	this.m_punchedDirection = 0;
	this.m_flying = false;

	// Fixture
	this.m_fixture = new b2FixtureDef;
	this.m_fixture.density = 0.5;
	this.m_fixture.friction = 0.0;
	this.m_fixture.restitution = 0.2;
	
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
	
	var m_image = new Image();
		m_image.src = "Image/ActionPhase/Enemy/Enemy.png";
		
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

	
	var coolDown = 0;
	var animation = 0;
	var animCount = 0;
	
	
	this.Update = function () {
		// If this g_gsActionPhase.m_enemy is active (not dead yet)
		if (this.m_live == false) return;
		
		// Convert body position to object pixel position
		this.m_x = MtoP(this.m_body.GetPosition().x) - BLOCK_W/2;
		this.m_y = MtoP(this.m_body.GetPosition().y) - BLOCK_W/2;
		
		// If get punched
		this.m_relativeSpeedX = 0;
		if (this.m_punched == true) {
			// Try to brake if he touch the ground
			for (var i=0; i<g_gsActionPhase.m_platform.length; i++) {
				var pf = g_gsActionPhase.m_platform[i];
				if (this.m_y < pf.m_y && this.m_y > pf.m_y - BLOCK_W * 1.01) {
					if (this.m_x >= pf.m_x - BLOCK_W && this.m_x <= pf.m_x + pf.m_w) {
						var velocity = this.m_body.GetLinearVelocity();
						if (Math.abs(velocity.x) > 0.1) {
							this.Stop();
						}
						else {
							this.m_punched = false;
							this.m_moving = true;
						}
						if (pf.m_eDir == 1) {
							if (pf.m_direction == 0) {
								this.m_relativeSpeedX = -pf.m_speed;
							}
							else if (pf.m_direction == 1) {
								this.m_relativeSpeedX = pf.m_speed;
							}
						}
						break;
					}
				}
			}
		}
		else {
			if (this.m_flying == true) {
				// Try to brake if he touch the ground
				for (var i=0; i<g_gsActionPhase.m_platform.length; i++) {
					var pf = g_gsActionPhase.m_platform[i];
					if (this.m_y < pf.m_y && this.m_y > pf.m_y - BLOCK_W * 1.01) {
						if (this.m_x >= pf.m_x - BLOCK_W && this.m_x <= pf.m_x + pf.m_w) {
							this.m_flying = false;
							break;
						}
					}
				}
			}
			else {
				if (this.m_punching == true) {
					animCount += g_deltaTime;
					if (this.m_type == 1) {
						if (animCount > 100) {
							animCount = 0;
							animation ++;
							
							if (animation == 3) {
								this.CheckObjectPunchThem();
							}
							else if (animation > 5) {
								animation = 0;
								this.m_punching = false;
								this.m_moving = true;
							}
						}
					}
					else if (this.m_type == 2) {
						if (animCount > 75) {
							animCount = 0;
							animation ++;
							
							if (animation > 10) {
								animation = 0;
								this.m_punching = false;
								this.m_moving = true;
							}
						}
					}
				}
				else {
					if (this.m_type == 1) {
						if (this.m_direction == 0) {
							if (g_gsActionPhase.m_hero.m_x < this.m_x && g_gsActionPhase.m_hero.m_x > this.m_x - 70
							&&  g_gsActionPhase.m_hero.m_y < this.m_y + 35 && g_gsActionPhase.m_hero.m_y > this.m_y - 35) {
								this.Punch();
							}
						}
						else if (this.m_direction == 1) {
							if (g_gsActionPhase.m_hero.m_x > this.m_x && g_gsActionPhase.m_hero.m_x < this.m_x + 70
							&&  g_gsActionPhase.m_hero.m_y < this.m_y + 35 && g_gsActionPhase.m_hero.m_y > this.m_y - 35) {
								this.Punch();
							}
						}
					}
					else if (this.m_type == 2) {
						if (coolDown == 0) {
							if (Math.random() < 0.05) {
								this.Punch();
							}
						}
						else {
							coolDown -= g_deltaTime;
							if (coolDown < 0) coolDown = 0;
						}
					}
				}
			
				if (this.m_moving == true) {
					// If he bump into another g_gsActionPhase.m_enemy, he'll return.
					for (var i=0; i<g_gsActionPhase.m_enemy.length; i++) {
						for (var i=0; i<g_gsActionPhase.m_enemy.length; i++) {
							if (this.m_direction == 0) {
								if (g_gsActionPhase.m_enemy[i].m_x < this.m_x && g_gsActionPhase.m_enemy[i].m_x > this.m_x - 45
								&&  g_gsActionPhase.m_enemy[i].m_y < this.m_y + 40 && g_gsActionPhase.m_enemy[i].m_y > this.m_y - 40) {
									this.m_direction = 1;
								}
							}
							else if (this.m_direction == 1) {
								if (g_gsActionPhase.m_enemy[i].m_x > this.m_x && g_gsActionPhase.m_enemy[i].m_x < this.m_x + 45
								&&  g_gsActionPhase.m_enemy[i].m_y < this.m_y + 40 && g_gsActionPhase.m_enemy[i].m_y > this.m_y - 40) {
									this.m_direction = 0;
								}
							}
						}
					}
					
					// Loop through all g_gsActionPhase.m_platform to check which one he is standing on
					// If he is standing on the edge of that g_gsActionPhase.m_platform, make him reverse his direction, so he won't fall off
					// Assume he is flying, if he touch the ground, then he's not
					this.m_flying = true;
					for (var i=0; i<g_gsActionPhase.m_platform.length; i++) {
						var pf = g_gsActionPhase.m_platform[i];
						if (this.m_y < pf.m_y && this.m_y > pf.m_y - BLOCK_W * 1.01) {
							if (this.m_x >= pf.m_x - BLOCK_W && this.m_x <= pf.m_x + pf.m_w) {
								if (this.m_direction == 0) {
									if (this.m_x <= BLOCK_W) this.m_direction = 1;
									else if (this.m_x <= pf.m_x) this.m_direction = 1;
								}
								else if (this.m_direction == 1) {
									if (this.m_x >= 1280 - BLOCK_W * 1.1) this.m_direction = 0;
									else if (this.m_x + BLOCK_W >= pf.m_x + pf.m_w) this.m_direction = 0;
								}
								
								this.m_flying = false;
								
								if (pf.m_eDir == 1) {
									if (pf.m_direction == 0) {
										this.m_relativeSpeedX = -pf.m_speed;
									}
									else if (pf.m_direction == 1) {
										this.m_relativeSpeedX = pf.m_speed;
									}
								}
								break;
							}
						}
					}
					
					
		
					if (this.m_direction == 0) {
						this.Move (-2);
					}
					else if (this.m_direction == 1) {
						this.Move (2);
					}
					
				
					// If he is moving, but he is always moving anyway...
					if (this.m_punching == false) {
						animCount += g_deltaTime;
						if (animCount > 150) {
							animCount = 0;
							animation ++;
							if (animation > 3) animation = 0;
						}
					}
				}
				else {
					this.Stop();
				}
			}
		}
		
		
		
		// If g_gsActionPhase.m_enemy fall off the screen, he's dead
		if (this.m_y > 780) {
			this.m_live = false;
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
			velocity.Add(new b2Vec2(speed, 0));
			
		if (velocity.x > this.m_relativeSpeedX + 2) {
			velocity.x = this.m_relativeSpeedX + 2;
			this.m_body.SetLinearVelocity(velocity);
		}
		else if (velocity.x < this.m_relativeSpeedX - 2) {
			velocity.x = this.m_relativeSpeedX - 2;
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
			velocity.x += 0.8;
		}
		else if (velocity.x > this.m_relativeSpeedX) {
			velocity.x -= 0.8;
		}
		this.m_body.SetLinearVelocity(velocity);
	}
	
	this.Punch = function () {
		// Can't do a mid air punch
		if (this.m_flying == false && this.m_punched == false) {
			this.m_moving = false;
			this.m_punching = true;
			animCount = 0;
			animation = 0;
			coolDown = 600;
			
			if (this.m_type == 1) {
				if (g_enableSound == 1) {
					m_punchSound.play();
				}
			}
			else if (this.m_type == 2) {
				if (this.m_direction == 0) {
					g_gsActionPhase.StartBullet (0, this.m_x - 20, this.m_y + 20, 0);
					g_gsActionPhase.StartEffect (1, this.m_x - 20, this.m_y + 20);
				}
				else if (this.m_direction == 1) {
					g_gsActionPhase.StartBullet (0, this.m_x + 60, this.m_y + 20, 1);
					g_gsActionPhase.StartEffect (1, this.m_x + 60, this.m_y + 20);
				}
			}
		}
	}
	
	
	this.GetPunched = function (fX, fY) {
		if (this.m_live == false) return;
		
		this.m_body.SetLinearVelocity(new b2Vec2(fX * 0.01, fY * 0.01));
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
		if (this.m_live == false) return;
		
		var signX = 1;
		if (this.m_direction == 0) {
			context.save();
			context.translate (50, 0);
			context.scale (-1, 1);
			signX = -1;
		}
		
		var sourceOffsetY = 0;
		if (this.m_type == 2) {
			sourceOffsetY = 150;
		}
		
		if (this.m_punched == true) {
			if (this.m_punchedDirection != this.m_direction) {
				context.drawImage (m_image, 100, 50 + sourceOffsetY, 50, 50, this.m_x * signX, this.m_y - 10, 50, 50);
			}
			else {
				context.drawImage (m_image, 150, 50 + sourceOffsetY, 50, 50, this.m_x * signX, this.m_y - 10, 50, 50);
			}
		}
		else if (this.m_flying == true) {
			context.drawImage (m_image, 50, 50 + sourceOffsetY, 50, 50, this.m_x * signX, this.m_y - 10, 50, 50);
		}
		else if (this.m_punching == true) {
			if (this.m_type == 1) {
				switch (animation) {
					case 0:
						context.drawImage (m_image, 0, 100 + sourceOffsetY, 50, 50, this.m_x * signX, this.m_y - 10, 50, 50);
						break;
					case 1:
						context.drawImage (m_image, 50, 100 + sourceOffsetY, 50, 50, this.m_x * signX, this.m_y - 10, 50, 50);
						break;
					case 2:
						context.drawImage (m_image, 100, 100 + sourceOffsetY, 50, 50, this.m_x * signX, this.m_y - 10, 50, 50);
						break;
					case 3: case 4: case 5:
						context.drawImage (m_image, 150, 100 + sourceOffsetY, 50, 50, this.m_x * signX, this.m_y - 10, 50, 50);
						break;
				}
			}
			else if (this.m_type == 2) {
				switch (animation) {
					case 0: case 6: case 7: case 8: case 9: case 10:
						context.drawImage (m_image, 0, 100 + sourceOffsetY, 50, 50, this.m_x * signX, this.m_y - 10, 50, 50);
						break;
					case 1: case 5:
						context.drawImage (m_image, 50, 100 + sourceOffsetY, 50, 50, this.m_x * signX, this.m_y - 10, 50, 50);
						break;
					case 2: case 4:
						context.drawImage (m_image, 100, 100 + sourceOffsetY, 50, 50, this.m_x * signX, this.m_y - 10, 50, 50);
						break;
					case 3:
						context.drawImage (m_image, 150, 100 + sourceOffsetY, 50, 50, this.m_x * signX, this.m_y - 10, 50, 50);
						break;
				}
			}
		}
		else {
			switch (animation) {
				case 0: case 2:
					context.drawImage (m_image, 0, 0 + sourceOffsetY, 50, 50, this.m_x * signX, this.m_y - 10, 50, 50);
					break;
				case 1:
					context.drawImage (m_image, 50, 0 + sourceOffsetY, 50, 50, this.m_x * signX, this.m_y - 10, 50, 50);
					break;
				case 3:
					context.drawImage (m_image, 100, 0 + sourceOffsetY, 50, 50, this.m_x * signX, this.m_y - 10, 50, 50);
					break;
			}
		}
		
		if (this.m_direction == 0) {
			context.restore();
		}
	}
	
	
	this.CheckObjectPunchThem = function () {
		for (var i=0; i<g_gsActionPhase.m_enemy.length; i++) {
			if (g_gsActionPhase.m_enemy == this) return;
			
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
		
		if (this.m_direction == 0) {
			if (g_gsActionPhase.m_hero.m_x < this.m_x && g_gsActionPhase.m_hero.m_x > this.m_x - 70
			&&  g_gsActionPhase.m_hero.m_y < this.m_y + 35 && g_gsActionPhase.m_hero.m_y > this.m_y - 35) {
				g_gsActionPhase.m_hero.GetPunched(-200, -150);
				g_gsActionPhase.StartEffect (0, this.m_x - 20, this.m_y + 20);
			}
		}
		else if (this.m_direction == 1) {
			if (g_gsActionPhase.m_hero.m_x > this.m_x && g_gsActionPhase.m_hero.m_x < this.m_x + 70
			&&  g_gsActionPhase.m_hero.m_y < this.m_y + 35 && g_gsActionPhase.m_hero.m_y > this.m_y - 35) {
				g_gsActionPhase.m_hero.GetPunched(200, -150);
				g_gsActionPhase.StartEffect (0, this.m_x + 60, this.m_y + 20);
			}
		}
	}
}