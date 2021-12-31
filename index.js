// Set the date we're counting down to
var countDownDate = new Date("Jan 01, 2022 00:00:00").getTime();

// Update the count down every 1 second
var x = setInterval(function () {
	// Get today's date and time
	var now = new Date().getTime();

	// Find the distance between now and the count down date
	var distance = countDownDate - now;

	// Time calculations for days, hours, minutes and seconds
	var days = Math.floor(distance / (1000 * 60 * 60 * 24));
	var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
	var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
	var seconds = Math.floor((distance % (1000 * 60)) / 1000);

	// Display the result in the element with id="demo"
	document.getElementById("counter").innerHTML =
		days + "d " + hours + "h " + minutes + "m " + seconds + "s ";

	// If the count down is finished, write some text
	if (distance < 0) {
		clearInterval(x);
		document.querySelector(".primary-heading").innerHTML = "HAPPY NEW YEAR!";
		document
			.querySelector(".primary-heading")
			.classList.add(
				"animate__animated",
				"animate__flash",
				"animate__infinite"
			);
		document.getElementById("counter").innerHTML = "";
	}
}, 1000);

window.addEventListener("resize", resizeCanvas, false);
window.addEventListener("DOMContentLoaded", onLoad, false);

window.requestAnimationFrame =
	window.requestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame ||
	window.oRequestAnimationFrame ||
	window.msRequestAnimationFrame ||
	function (callback) {
		window.setTimeout(callback, 1000 / 60);
	};

var canvas,
	ctx,
	w,
	h,
	particles = [],
	probability = 0.04,
	xPoint,
	yPoint;

function onLoad() {
	canvas = document.getElementById("canvas");
	ctx = canvas.getContext("2d");
	resizeCanvas();

	window.requestAnimationFrame(updateWorld);
}

function resizeCanvas() {
	if (!!canvas) {
		w = canvas.width = window.innerWidth;
		h = canvas.height = window.innerHeight;
	}
}

function updateWorld() {
	update();
	paint();
	window.requestAnimationFrame(updateWorld);
}

function update() {
	if (particles.length < 500 && Math.random() < probability) {
		createFirework();
	}
	var alive = [];
	for (var i = 0; i < particles.length; i++) {
		if (particles[i].move()) {
			alive.push(particles[i]);
		}
	}
	particles = alive;
}

function paint() {
	ctx.globalCompositeOperation = "source-over";
	ctx.fillStyle = "rgba(0,0,0,0.2)";
	ctx.fillRect(0, 0, w, h);
	ctx.globalCompositeOperation = "lighter";
	for (var i = 0; i < particles.length; i++) {
		particles[i].draw(ctx);
	}
}

function createFirework() {
	xPoint = Math.random() * (w - 200) + 100;
	yPoint = Math.random() * (h - 200) + 100;
	var nFire = Math.random() * 50 + 100;
	var c =
		"rgb(" +
		~~(Math.random() * 200 + 55) +
		"," +
		~~(Math.random() * 200 + 55) +
		"," +
		~~(Math.random() * 200 + 55) +
		")";
	for (var i = 0; i < nFire; i++) {
		var particle = new Particle();
		particle.color = c;
		var vy = Math.sqrt(25 - particle.vx * particle.vx);
		if (Math.abs(particle.vy) > vy) {
			particle.vy = particle.vy > 0 ? vy : -vy;
		}
		particles.push(particle);
	}
}

function Particle() {
	this.w = this.h = Math.random() * 4 + 1;

	this.x = xPoint - this.w / 2;
	this.y = yPoint - this.h / 2;

	this.vx = (Math.random() - 0.5) * 10;
	this.vy = (Math.random() - 0.5) * 10;

	this.alpha = Math.random() * 0.5 + 0.5;

	this.color;
}

Particle.prototype = {
	gravity: 0.05,
	move: function () {
		this.x += this.vx;
		this.vy += this.gravity;
		this.y += this.vy;
		this.alpha -= 0.01;
		if (
			this.x <= -this.w ||
			this.x >= screen.width ||
			this.y >= screen.height ||
			this.alpha <= 0
		) {
			return false;
		}
		return true;
	},
	draw: function (c) {
		c.save();
		c.beginPath();

		c.translate(this.x + this.w / 2, this.y + this.h / 2);
		c.arc(0, 0, this.w, 0, Math.PI * 2);
		c.fillStyle = this.color;
		c.globalAlpha = this.alpha;

		c.closePath();
		c.fill();
		c.restore();
	},
};
