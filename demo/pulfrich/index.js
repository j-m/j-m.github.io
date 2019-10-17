window.addEventListener('load', function () {
	var canvas = document.getElementsByTagName("canvas")[0],
		context = canvas.getContext('2d');

	document.body.onkeyup = function (e) {
		if (e.keyCode == 32) {
			uhhJump();
		}
	}

	var imgs = [];

	function addImage(src) {
		var tmp = new Image();
		tmp.src = src;
		imgs.push(tmp);
	}
	addImage('images/bird.png'); //0
	addImage('images/mountainnew.png'); //1
	addImage('images/grass2.png'); //2
	addImage('images/forest3.png'); //3	
	addImage('images/forest1.png'); //4
	addImage('images/floor.png'); //5
	addImage('images/rocks.png'); //6
	addImage('images/forest4.png'); //7
	addImage('images/totem2.png'); //8
	addImage('images/totem1.png'); //9
	addImage('images/totem3.png'); //10
	addImage('images/retry1.png'); //11
	addImage('images/retry2.png'); //12

	var tick = 0;
	class object {
		constructor(fill, x, y, depth, w, h) {
			this.fill = fill;
			this.x = x;
			this.y = y;
			this.depth = depth;
			this.w = w;
			this.h = h;
			this.t = tick;
		}
	}
	object.prototype.draw = function () {
		context.fillStyle = this.fill;
		var offset = (tick - this.t) * this.depth;
		context.drawImage(this.fill, this.x - offset, this.y, this.w, this.h);
	}
	class background extends object {
		constructor(index, depth) {
			super(imgs[index], 0, 0, depth, 0, 0);
		}
	}
	background.prototype.draw = function () {
		var offset = (tick - this.t) * this.depth;

		var pattern = context.createPattern(this.fill, 'repeat');
		context.fillStyle = pattern;
		context.translate(-offset, 0);
		context.fillRect(0, 0, canvas.width * 2, canvas.height);
		context.translate(offset, 0);

		if (this.x - offset + canvas.width < 0)
			this.t = tick;
	}
	var backgrounds = [];
	backgrounds.push(new background(1, 4)); //mountain
	backgrounds.push(new background(2, 3)); //grass
	backgrounds.push(new background(7, 2.9)); //forest4
	backgrounds.push(new background(3, 2.5)); //forest3
	backgrounds.push(new background(6, 2.25)); //rocks
	backgrounds.push(new background(5, 2)); //forest1
	backgrounds.push(new background(4, 2)); //floor

	var objects = [],
		player = new object(imgs[0], canvas.width / 2 - 30, canvas.height / 2 - 25, 0, 60, 50),
		velocity = 0,
		gravity = 0.5,
		jump = -8,
		alive = true;
	var score = last = best = 0;

	function uhhJump() {
		console.log("jumped");
		velocity = jump;
		if (!alive && within) {
			objects.length = 0;
			player.y = canvas.height / 2 - 30;
			var tmp = document.createElement("input");
			document.body.appendChild(tmp);
			tmp.focus();
			document.body.removeChild(tmp);
			alive = true;
		}

	}

	canvas.onclick = function (event) {
		uhhJump();
	}
	canvas.oncontextmenu = function (e) {
		e.preventDefault();
	};

	function died() {
		alive = false;
		objects.length = 0;
		var x = canvas.width / 2 - 120,
			y = canvas.height / 2 - 72;
		objects[0] = new object(imgs[11], x, y, 0, 240, 144);
		objects[1] = new object(imgs[12], x, y, 0, 240, 144);
		last = score;
		if (last > best)
			best = last;
		score = 0;
	}

	function getMousePos(canvas, evt) {
		var rect = canvas.getBoundingClientRect();
		return {
			x: evt.clientX - rect.left,
			y: evt.clientY - rect.top
		};
	}
	var within = false,
		next = 0;
	canvas.addEventListener('mousemove', function (evt) {
		var x = canvas.width / 2 - 120,
			y = canvas.height / 2 - 72,
			mousePos = getMousePos(canvas, evt);
		if (!alive && mousePos.x > x && mousePos.x < x + 200 && mousePos.y > y && mousePos.y < y + 120) {
			canvas.style.cursor = "pointer";
			within = true;
		} else {
			canvas.style.cursor = "default";
			within = false;
		}
	}, false);
	(function draw() {
		requestAnimationFrame(draw);
		context.clearRect(0, 0, canvas.width, canvas.height);
		tick++;

		if (document.activeElement === canvas && alive) {
			velocity += gravity;
			player.y += velocity;
			if (objects.length < 1) {
				objects.push(new object(imgs[8], canvas.width, 0, 2.5, 59, canvas.height));
				next = 0;
			}
		}
		for (var item in backgrounds)
			backgrounds[item].draw();
		for (var item in objects) {
			var offset = (tick - objects[item].t) * objects[item].depth;
			if (objects[item].x - offset + objects[item].w < 0)
				delete objects[item];
			else {
				if (objects[item].x - offset + objects[item].w <= canvas.width / 2 && !objects[item].spawned && alive) {
					objects.push(new object(imgs[8 + Math.floor(Math.random() * 3)], canvas.width, 0, 2.5, 59, canvas.height))
					next++;
					objects[item].spawned = true;
					score++;
				}
				objects[item].draw();
			}
		}
		if (objects[next] && alive) {
			var offset = (tick - objects[next].t) * objects[next].depth;
			if (player.x + 60 > objects[next].x - offset && player.x + 60 < objects[next].x - offset + objects[next].w) {
				switch (objects[next].fill) {
					case imgs[8]:
						if (player.y > 200)
							died();
						break;
					case imgs[9]:
						if (player.y < 200 || player.y > 350)
							died();
						break;
					case imgs[10]:
						if (player.y < 350)
							died();
						break;
					default:
						break;
				}
			}
		}
		if (player.y < 0) {
			player.y = 0;
			velocity = gravity;
		}
		if (player.y + player.h >= canvas.height - 68 && alive)
			died();
		player.draw();
		if (!alive) {
			if (within) objects[1].draw();
			else objects[0].draw();
		}

		context.font = "40px Sans-serif"
		context.strokeStyle = 'black';
		context.lineWidth = 8;
		context.strokeText('Best: ' + best, 10, 45);
		context.strokeText('Last: ' + last, 10, 90);
		context.fillStyle = 'white';
		context.fillText('Best: ' + best, 10, 45);
		context.fillText('Last: ' + last, 10, 90);
		context.font = "85px Sans-serif";
		context.strokeText(score, 10, canvas.height - 20);
		context.fillText(score, 10, canvas.height - 20);
	})();
});