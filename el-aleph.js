const canvasSketch = require('canvas-sketch');

const settings = {
	dimensions: [1080, 1080],
};

let fontSize = '190px';
let fontFamily = 'Windsor El BT';

const degToRad = (degrees) => {
	return (degrees / 180) * Math.PI;
};

const sketch = () => {
	return ({ context, width, height }) => {
		context.fillStyle = 'black';
		context.fillRect(0, 0, width, height);

		context.fillStyle = 'rgb(243, 227, 208, 0.85)';

		const cx = width * 0.5;
		const cy = height * 0.5;

		const num = 23;

		const drawSentence = (letter, radius) => {
			for (let i = 0; i < 23; i++) {
				const slice = degToRad(360 / 23);
				const angle = slice * i + 1.22;

				const x = cx + radius * Math.sin(angle);
				const y = cy + radius * Math.cos(angle);

				context.save();
				context.translate(x, y);
				context.rotate(-angle - 1.45);
				context.scale(1, 1);

				context.font = `${fontSize} ${fontFamily}`;
				context.fillText(letter, 0, 0);
				context.restore();
			}
		};

		drawSentence('El Aleph', width * 0.5);
	};
};

canvasSketch(sketch, settings);
