const canvasSketch = require('canvas-sketch');

const settings = {
	dimensions: [1080, 1080],
	pixelsPerInch: 300,
	orientation: 'landscape',
};

const sketch = () => {
	return ({ context, width, height }) => {
		context.fillStyle = 'white';
		context.fillRect(0, 0, width, height);
		const w = width * 0.1;
		const h = height * 0.1;
		const gap = width * 0.03;
		const ix = width * 0.17;
		const iy = width * 0.17;
		let x, y;

		const off = width * 0.02;

		for (let i = 0; i < 5; i++) {
			for (let j = 0; j < 5; j++) {
				x = ix + (w + gap) * i;
				y = iy + (w + gap) * j;

				context.beginPath();
				context.rect(x, y, w, h);
				context.stroke();

				if (Math.random() < 0.5) {
					context.beginPath();
					context.rect(x + 8, y + 8, w - 16, h - 16);
					context.stroke();
				}
			}
		}
	};
};

canvasSketch(sketch, settings);
