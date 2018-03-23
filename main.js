const [width, height] = [640, 480];

let debug = false;

const avatar = {
	x: 0,
	y: 0,
	r: 10,
	distance: 100,
	angle: 0,
	speed: 1
}

function updateAvatar(ms, time) {
	avatar.angle += avatar.speed * (ms / 10) * Math.PI / 180;
	const distance = avatar.distance + 50 * Math.sin(time / 1000);

	avatar.x = mousePos.x + Math.sin(avatar.angle) * distance;
	avatar.y = mousePos.y + Math.cos(avatar.angle) * distance;
}

const mousePos = {x: 0, y: 0};

const cvs = document.createElement("canvas");
cvs.width = width;
cvs.height = height;

const ctx = cvs.getContext("2d");

cvs.addEventListener('mousemove', function(event) {
	const boundingBox = cvs.getBoundingClientRect();
	mousePos.x = event.clientX - boundingBox.left;
	mousePos.y = event.clientY - boundingBox.top;
});


function drawCircle(x, y, r, colour) {
	ctx.fillStyle = colour;

	const circle = new Path2D();
	circle.arc(x, y, r, 0, 2 * Math.PI);

	ctx.fill(circle);
}

function randCircle(colour) {
	const r = Math.floor(80 * Math.random() + 20);
	const x = Math.floor(width * Math.random());
	const y = Math.floor(height * Math.random());

	drawCircle(x, y, r, colour);
}

let score = 0;

const eachFrame = (function() {
	let lastTime = new Date();
	let time = 0;

	return function () {
		//clear the background
		ctx.fillStyle = "rgba(80, 80, 80, 0.1)";
		ctx.fillRect(0, 0, width, height);

		randCircle("#fab");
		randCircle("#bada55");

		//update frame count
		const currentTime = new Date();
		const timeDiff = currentTime - lastTime;
		lastTime = currentTime;
		time += timeDiff;

		updateAvatar(timeDiff, time);

		//find distance from centre
		const centre = {x: width / 2, y: height / 2};
		const dist = Math.floor(Math.sqrt((avatar.x - centre.x) ** 2 
									 + (avatar.y - centre.y) ** 2));
		const bonus = Math.max(0, 100 - dist);
		const colour = `rgb(255, ${Math.floor(255 * bonus / 100)}, 100)`;
		drawCircle(centre.x, centre.y, 100, colour);
		score += bonus;

		//draw avatar		
		drawCircle(avatar.x, avatar.y, avatar.r, "#000");

		//put the text on the screen
		ctx.fillStyle = "white";
		ctx.font = "24px monospace";
		ctx.fillText(`score: ${score}`, 10, 30);
		ctx.fillText(`time: ${Math.floor(time / 1000)}`, 10, 60);
		
		if(debug) {
			ctx.fillText(`ms: ${timeDiff}`, 10, 90);
			ctx.fillText(`x: ${mousePos.x}`, 10, 120);
			ctx.fillText(`y: ${mousePos.y}`, 10, 150);
		}
		
		if(time >= 30000) {
			clearInterval(gameLoop);
			alert(`hey you died good job, ur score is ${score}`);
		}
	}
})();

const gameLoop = setInterval(eachFrame, 1000 / 60);
const body = document.body.appendChild(cvs);