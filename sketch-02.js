const canvasSketch = require('canvas-sketch');
const math = require('canvas-sketch-util/math');
const random = require('canvas-sketch-util/random');

const settings = {
	dimensions: [2048, 2048],
	// Enable an animation loop
	// animate: true,
	// Set loop duration to 3
	duration: 3,
	fps: 0.01,
	timeScale: 0.1,
};
let a = 0;
const degToRad = (degrees) => {
	return (degrees / 180) * Math.PI;
};

const randomRange = (min, max) => {
	return Math.random() * (max - min) + min;
};

const sketch = () => {
	return ({ context, width, height, playhead }) => {
		const t = Math.sin(playhead * Math.PI);
		context.fillStyle = 'black';
		context.fillRect(0, 0, width, height);

		context.fillStyle = 'white';

		const cx = width * 0.5;
		const cy = height * 0.5;

		const w = width * 0.001;
		const h = height * 1;
		let x, y;

		const num = 40;
		const radius = width * 0.3;

		for (i = 0; i < num; i++) {
			const slice = degToRad(360 / num);
			const angle = slice * i;

			x = cx + radius * Math.sin(angle);
			y = cy + radius * Math.cos(angle);

			context.save();
			context.translate(x, y);
			context.rotate(-angle);
			context.scale(randomRange(0.1, 2), random.range(0.2, 0.5));

			context.fillStyle = 'white';
			context.beginPath();
			context.rect(-w * 0.5, random.range(0, -h * 0.5), w, h);
			context.fill();

			context.restore();

			context.save();
			context.translate(cx, cy);
			context.rotate(-angle);

			context.lineWidth = random.range(5, 30);

			context.beginPath();
			context.arc(
				0,
				0,
				radius * random.range(0.2, 1.5),
				slice * random.range(1, -8),
				slice * random.range(0, 5)
			);
			context.strokeStyle = 'white';
			context.stroke();
			context.restore();
		}
	};
};

canvasSketch(sketch, settings);
