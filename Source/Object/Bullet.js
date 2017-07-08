function Bullet () {
	this.m_x = 0;
	this.m_y = 0;
	this.m_live = false;
	this.m_direction = 0;
	
	var image = new Array();
	image[0] = new Image();
	image[0].src = "Image/ActionPhase/Bullet/Bullet.png";
	
	this.Start = function (type, x, y, dir) {
		// Init a bullet, set its position, and flying direction
		this.m_x = x;
		this.m_y = y;
		this.m_direction = dir;
		this.m_live = true;
		this.m_type = type;
	}
	
	this.Update = function () {
		if (this.m_live == true) {
			// Update bullet position if it's active
			if (this.m_direction == 0) {
				this.m_x -= g_deltaTime * 0.3;
			}
			else if (this.m_direction == 1) {
				this.m_x += g_deltaTime * 0.3;
			}
			
			// If bullet fly off the screen, it's set to inactive
			if (this.m_x < -25) {
				this.m_live = false;
			}
			else if (this.m_x > 1305) {
				this.m_live = false;
			}
			
			// If it hit the main hero
			if (this.m_x >= g_gsActionPhase.m_hero.m_x && this.m_x <= g_gsActionPhase.m_hero.m_x + 40
			&&  this.m_y >= g_gsActionPhase.m_hero.m_y && this.m_y <= g_gsActionPhase.m_hero.m_y + 40) {
				// Main hero take a random damage from 10 to 30
				if (this.m_direction == 0) {
					g_gsActionPhase.m_hero.GetPunched(-400, -50);
				}
				else {
					g_gsActionPhase.m_hero.GetPunched(400, -50);
				}
				g_gsActionPhase.StartEffect (2, this.m_x, this.m_y);
				
				// This bullet no longer active
				this.m_live = false;
			}
		}
	}
	
	this.Draw = function (context) {
		// Draw it
		if (this.m_live == true) {
			var signX = 1;
			if (this.m_direction == 0) {
				context.save();
				context.translate (50, 0);
				context.scale (-1, 1);
				signX = -1;
			}
			context.drawImage (image[this.m_type], (this.m_x - 25) * signX, this.m_y - 25);
			if (this.m_direction == 0) {
				context.restore();
			}
		}
	}
}