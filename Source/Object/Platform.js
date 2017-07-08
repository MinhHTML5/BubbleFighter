function Platform (type, x, y, w, h, elevateType, startPos, endPos, speed) {
	// The platform object
	var BLOCK_W = 50;
	
	// Position variable
	this.m_x = x;
	this.m_y = y;
	this.m_w = w;
	this.m_h = h;
	
	// For movement
	this.m_eDir = elevateType; if (this.m_eDir == null) this.m_eDir = 0;
	this.m_direction = 0;
	this.m_startPos = startPos;
	this.m_endPos = endPos;
	this.m_speed = speed;
	
	// Fixture
	this.m_type = type;
	this.m_fixture = new b2FixtureDef;
	this.m_fixture.density = 1.0;
	this.m_fixture.friction = 0.0;
	this.m_fixture.restitution = 0.0;
	
	// The platform will have 3 part, 2 end, and the middle
	// The middle will contain a lot of *block*, each block is 50 pixel length
	
	// __________________________________________
	// | |           |            |           | |
	// |E|   BLOCK   |    BLOCK   |   BLOCK   |E|
	// |_|___________|____________|___________|_|
	
	// If you check the image of the platform, you will understand how I draw it.
	
	// The number of middle block
	var numberOfMidBlock = Math.round(w / BLOCK_W);
	
	// Physic body definition
	var bodyDef = new b2BodyDef;
	if (elevateType == 0)
		bodyDef.type = b2Body.b2_staticBody;
	else if (elevateType > 0)
		bodyDef.type = b2Body.b2_kinematicBody;
	bodyDef.position.x = PtoM(x + w/2);           // x, y of the block is top left
	bodyDef.position.y = PtoM(y + h/2);           // while x, y of the body is middle, so we have this formula
	this.m_fixture.shape = new b2PolygonShape;
	this.m_fixture.shape.SetAsBox(PtoM(w/2), PtoM(h/2));
		
	this.m_body = g_gsActionPhase.m_world.CreateBody(bodyDef);
	this.m_body.CreateFixture(this.m_fixture);
	
	
	
	// Platform image
	var m_imageL = new Image();
	var m_imageM = new Image();
	var m_imageR = new Image();
		
	
	m_imageL.src = "Image/ActionPhase/Platform/" + type + "/PLeft.png";
	m_imageM.src = "Image/ActionPhase/Platform/" + type + "/PMid.png";
	m_imageR.src = "Image/ActionPhase/Platform/" + type + "/PRight.png";
	
	
	this.Update = function () {
		if (this.m_eDir == 1) {
			this.m_x = MtoP(this.m_body.GetPosition().x) - this.m_w/2;
			this.m_y = MtoP(this.m_body.GetPosition().y) - this.m_h/2;
			
			if (this.m_direction == 0) {
				var vector = new b2Vec2(-this.m_speed, 0);
				this.m_body.SetLinearVelocity(vector);
				if (this.m_x <= this.m_startPos) this.m_direction = 1;
			}
			else if (this.m_direction == 1) {
				var vector = new b2Vec2(this.m_speed, 0);
				this.m_body.SetLinearVelocity(vector);
				if (this.m_x >= this.m_endPos) this.m_direction = 0;
			}
		}
		else if (this.m_eDir == 2) {
			this.m_x = MtoP(this.m_body.GetPosition().x) - this.m_w/2;
			this.m_y = MtoP(this.m_body.GetPosition().y) - this.m_h/2;
			
			if (this.m_direction == 0) {
				var vector = new b2Vec2(0, -this.m_speed);
				this.m_body.SetLinearVelocity(vector);
				if (this.m_y <= this.m_startPos) this.m_direction = 1;
			}
			else if (this.m_direction == 1) {
				var vector = new b2Vec2(0, this.m_speed);
				this.m_body.SetLinearVelocity(vector);
				if (this.m_y >= this.m_endPos) this.m_direction = 0;
			}
		}
	}
	
	
	// Draw function
	this.Draw = function (context) {
		
		// Draw all middle part
		for (var i=0; i<numberOfMidBlock; i++) {
			context.drawImage (m_imageM, this.m_x + i * BLOCK_W, this.m_y);
		}
		
		// Draw left part
		context.drawImage (m_imageL, this.m_x - BLOCK_W / 2, this.m_y);
		
		// Then draw right part
		context.drawImage (m_imageR, this.m_x + numberOfMidBlock * BLOCK_W, this.m_y);
	}
}