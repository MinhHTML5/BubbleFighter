function Effect () {
	var image = new Array();
	image[0] = new Image();
	image[0].src = "Image/ActionPhase/Effect/Punch.png";
	image[1] = new Image();
	image[1].src = "Image/ActionPhase/Effect/Shoot.png";
	image[2] = new Image();
	image[2].src = "Image/ActionPhase/Effect/Explode.png";
	
	var x = 0;
	var y = 0;
	var time = 0;
	var type = 0;
	
	this.m_live = false;
	
	var m_punchSound = new Audio();
		m_punchSound.src = "Sound/Punch.mp3";
	var m_shootSound = new Audio();
		m_shootSound.src = "Sound/Shoot.mp3";
	var m_blastSound = new Audio();
		m_blastSound.src = "Sound/Blast.mp3";
	
	this.Start = function (pt, px, py) {
		x = px;
		y = py;
		type = pt;
		this.m_live = true;
		time = 0;
		
		if (g_enableSound == 1) {
			if (pt == 0) m_punchSound.play();
			else if (pt == 1) m_shootSound.play();
			else if (pt == 2) m_blastSound.play();
		}
	}
	
	this.Update = function () {
		if (this.m_live == true) {
			time += g_deltaTime * 0.003;
			if (time >= 2) {
				this.m_live = false;
			}
		}
	}
	
	this.Draw = function (context) {
		if (this.m_live == true) {
			var size;
			var alpha;
			if (time < 1) {
				alpha = 1;
				size = 100 * time;
			}
			else {
				alpha = 2 - time;
				size = 100;
			}
			context.globalAlpha = alpha;
			context.drawImage (image[type], 0, 0, 100, 100, x - size / 2, y - size / 2, size, size);
			context.globalAlpha = 1;
		}
	}
}