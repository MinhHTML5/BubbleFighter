function Goal (type, x, y) {
	this.m_live = true;
	this.m_x = x;
	this.m_y = y;
	
	var image = new Image();
	
	if (type == 0) {
		image.src = "Image/ActionPhase/Goal/Goal.png";
	}
	else if (type == 1) {
		image.src = "Image/ActionPhase/Goal/Star.png";
	}
	
	var m_eatSound = new Audio();
		m_eatSound.src = "Sound/Eat.mp3";

	var fading = false;
	var alpha = 1;
	var angle = 0;
	var rotateDir = 0;
	
	this.Update = function () {
		if (this.m_live) {
			if (fading == false) {
				if (this.m_x >= g_gsActionPhase.m_hero.m_x - 20 && this.m_x <= g_gsActionPhase.m_hero.m_x + 20
				&&  this.m_y >= g_gsActionPhase.m_hero.m_y - 20 && this.m_y <= g_gsActionPhase.m_hero.m_y + 20) {
					fading = true;
					if (g_enableSound == 1) {
						m_eatSound.play();
					}
				}
			}
			else {
				alpha -= g_deltaTime * 0.002;
				if (alpha <= 0) {
					this.m_live = false;
					if (type == 0) {
						g_gsActionPhase.Win();
					}
					else {
						g_gsActionPhase.StarCollected();
					}
				}
			}
			
			if (rotateDir == 0) {
				angle -= g_deltaTime * 0.06;
				if (angle < -15) {
					rotateDir = 1;
				}
			}
			else {
				angle += g_deltaTime * 0.06;
				if (angle > 15) {
					rotateDir = 0;
				}
			}
		}
	}
	
	this.Draw = function (context) {
		if (this.m_live) {
			context.save();
			if (fading) {
				context.globalAlpha = alpha;
				context.drawImage (image, this.m_x, this.m_y + (alpha - 1) * 40);
			}
			else {
				context.translate (this.m_x + 25, this.m_y + 25);
				context.rotate (angle * 0.0174532925199433);
				context.drawImage (image, -25, -25);
			}
			context.restore();
		}
	}
}