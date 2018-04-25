//canvas dimensions
const [width, height] = [640, 640];

//create the canvas
const cvs = document.createElement("canvas");
cvs.width = width;
cvs.height = height;

const ctx = cvs.getContext("2d");


//mouse cursor position
const mousePos = {x: 0, y: 0};

//listen for mouse move events
cvs.addEventListener('mousemove', function(event) {
	const boundingBox = cvs.getBoundingClientRect();
	mousePos.x = Math.floor(event.clientX - boundingBox.left);
	mousePos.y = Math.floor(event.clientY - boundingBox.top);
	console.log(mousePos);
});

let debug = false;

//the white dot
const avatar = {
	x: 0,
	y: 0,
	r: 10,
	distance: 100,
	angle: 0,
	speed: 1
}

let score = 0;
let level = 0;
let threshold = 10000;

//how to update the white dot on every frame
function updateAvatar(ms, time) {
	//angle with respect to the cursor
	avatar.angle += avatar.speed * ((10 + level) / 10) * (ms / 10) * Math.PI / 180;
	//distance from cursor
	const distance = avatar.distance + 50 * Math.sin(time / 1000);

	avatar.x = mousePos.x + Math.sin(avatar.angle) * distance;
	avatar.y = mousePos.y + Math.cos(avatar.angle) * distance;
}

//generic function for drawing a circle
function drawCircle(x, y, r, colour) {
	ctx.fillStyle = colour;
	const circle = new Path2D();
	circle.arc(x, y, r, 0, 2 * Math.PI);
	ctx.fill(circle);

	ctx.strokeStyle = "#000";
	ctx.lineWidth = 6;
	ctx.beginPath();
	ctx.arc(x, y, r, 0, 2 * Math.PI);
	ctx.stroke();
}

//draw a random circle (for background elements)
function randCircle(colour) {
	const r = Math.floor(80 * Math.random() + 20);
	const x = Math.floor(width * Math.random());
	const y = Math.floor(height * Math.random());

	drawCircle(x, y, r, colour);
}


function randColour(brightness = 50) {
	const randBit = () => brightness + Math.floor(Math.random() * 155);
	return `rgb(${randBit()}, ${randBit()}, ${randBit()})`;
}

function increaseScore(bonus) {
	score += bonus;

	if(score > threshold) {
		level++;
		threshold += 10000;
		timeRemaining += 3000;
	}
}

let timeRemaining = 10000;

//this function will execute on every frame
const eachFrame = (function() {
	let lastTime = new Date();
	const startTime = new Date();
	let timeElapsed = 0;

	return function () {
		//clear the background
		ctx.fillStyle = "rgba(20, 20, 20, 0.1)";
		ctx.fillRect(0, 0, width, height);

		for(let i = 0; i < level; i++) {
			//randCircle("#fab");
			//randCircle("#bada55");
			randCircle(randColour(level * 10));
		}

		//update frame count
		const currentTime = new Date();
		const timeDiff = currentTime - lastTime;
		lastTime = currentTime;
		timeElapsed = currentTime - startTime;
		timeRemaining -= timeDiff;

		updateAvatar(timeDiff, timeElapsed);

		//find distance from centre
		const centre = {x: width / 2, y: height / 2};
		const dist = Math.floor(Math.sqrt((avatar.x - centre.x) ** 2 
									 + (avatar.y - centre.y) ** 2));
		const bonus = Math.max(0, 100 - dist);
		const colour = `rgba(255, ${Math.floor(255 * bonus / 100)}, 100, 1)`;
		drawCircle(centre.x, centre.y, 100, colour);
		increaseScore(bonus);

		//draw avatar		
		drawCircle(avatar.x, avatar.y, avatar.r, "#fff");

		//put the text on the screen
		ctx.fillStyle = "white";
		ctx.font = "24px monospace";
		ctx.fillText(`score: ${score}`, 10, 30);
		ctx.fillText(`time: ${Math.floor(timeRemaining / 1000)}`, 10, 60);
		ctx.fillText(`level: ${level}`, 10, 90);

		if(debug) {
			ctx.fillText(`ms: ${timeDiff}`, 10, 90);
			ctx.fillText(`x: ${mousePos.x}`, 10, 120);
			ctx.fillText(`y: ${mousePos.y}`, 10, 150);
		}
		
		if(timeRemaining <= 0) {
			clearInterval(gameLoop);
			alert(`hey you died good job, ur score is ${score}`);
		}
	}
})();

const gameLoop = setInterval(eachFrame, 1000 / 60);
const body = document.body.appendChild(cvs);