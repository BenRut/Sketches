const canvasSketch = require('canvas-sketch');
const { pick } = require('canvas-sketch-util/random');
const random = require('canvas-sketch-util/random');
const math = require('canvas-sketch-util/math');
const Tweakpane = require('tweakpane');

const settings = {
	dimensions: [1080, 1080],
	animate: true,
};

const params = {
	cols: 10,
	rows: 10,
	scaleMin: 1,
	scaleMax: 5,
	freq: 0.001,
	amp: 0.2,
	animate: true,
	frame: 0,
};

let manager;
let img;

let text = '';
let fontSize = 1200;
let fontFamily = 'serif';

const imageCanvas = document.createElement('canvas');
const imageContext = imageCanvas.getContext('2d');

const sketch = ({ context, width, height }) => {
	const cell = 11;
	const cols = Math.floor(width / cell);
	const rows = Math.floor(height / cell);
	const numCells = cols * rows;

	imageCanvas.width = cols;
	imageCanvas.height = rows;

	return ({ context, width, height, frame }) => {
		// fill source square with black
		imageContext.fillStyle = 'black';
		imageContext.fillRect(0, 0, cols, rows);

		if (text != '') {
			// write white font
			fontSize = cols * 1.2;
			imageContext.fillStyle = 'white';
			imageContext.font = `${fontSize}px ${fontFamily}`; // '1200px serif';
			imageContext.textBaseline = 'top'; //'middle'; //'top';
			// context.textAlign = 'center';
			const metrics = imageContext.measureText(text);
			const mx = metrics.actualBoundingBoxLeft * -1;
			const my = metrics.actualBoundingBoxAscent * -1;
			const mw = metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight;
			const mh =
				metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;
			const tx = (cols - mw) * 0.5 - mx;
			const ty = (rows - mh) * 0.5 - my;

			imageContext.save();
			// context.translate(width*.5, height*.57);
			imageContext.translate(tx, ty);
			// imageContext.beginPath();
			// imageContext.rect(mx, my, mw, mh);
			// imageContext.stroke();
			imageContext.fillText(text, 0, 0);
			imageContext.restore();
		} else {
			// write image
			imageContext.save();
			imageContext.drawImage(
				img,
				0,
				0,
				img.width,
				img.height,
				0,
				0,
				cols,
				rows
			);
			imageContext.restore();
		}

		const typeData = imageContext.getImageData(0, 0, cols, rows).data;

		// context.fillStyle = (text != '') ? 'black' : 'white';
		context.fillStyle = 'black';
		context.fillRect(0, 0, width, height);

		for (let i = 0; i < numCells; i++) {
			const col = i % cols;
			const row = Math.floor(i / cols);

			const cellw = width / cols;
			const cellh = height / rows;

			const x = col * cellw;
			const y = row * cellh;
			const w = cellw * 0.8;
			const h = cellh * 0.8;

			const f = params.animate ? frame : params.frame;

			const n = random.noise3D(x, y, f * 10, params.freq);
			const angle = n * Math.PI * params.amp;

			context.fillStyle = 'white';

			let r = typeData[i * 4 + 0];
			// const g = typeData[i * 4 + 1];
			// const b = typeData[i * 4 + 2];
			// const a = typeData[i * 4 + 3];

			// const radius = math.mapRange(r, 0, 255, 0, 14);
			const redReading = math.mapRange(r, 0, 255, 0, 7);
			const radius = math.mapRange(n, -1, 1, redReading, 7);

			context.fillStyle = 'white';

			context.save();
			context.translate(x, y);
			context.translate(cellw * 0.5, cellh * 0.5);
			context.rotate(angle);

			context.beginPath();
			context.arc(0, 0, radius, 0, 2 * Math.PI);

			context.fill();

			context.restore();
		}

		// draw little source canvas in the top left corner
		// context.drawImage(imageCanvas, 0, 0);
	};
};

const createPane = () => {
	const pane = new Tweakpane.Pane();
	let folder;

	folder = pane.addFolder({ title: 'Grid' });
	folder.addInput(params, 'lineCap', {
		options: { butt: 'butt', round: 'round', square: 'square' },
	});
	folder.addInput(params, 'cols', { min: 2, max: 50, step: 1 });
	folder.addInput(params, 'rows', { min: 2, max: 50, step: 1 });
	folder.addInput(params, 'scaleMin', { min: 1, max: 100 });
	folder.addInput(params, 'scaleMax', { min: 1, max: 100 });

	folder = pane.addFolder({ title: 'Noise' });
	folder.addInput(params, 'freq', { min: -0.01, max: 0.01 });
	folder.addInput(params, 'amp', { min: 0, max: 1 });
	folder.addInput(params, 'animate');
	folder.addInput(params, 'frame', { min: 0, max: 999 });
};

// createPane();

const url = './images/bird.jpeg';
const loadImage = (url) => {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.crossOrigin = 'Anonymous';
		img.onload = () => resolve(img);
		img.onerror = () => reject();
		img.src = url;
	});
};

const start = async () => {
	img = await loadImage(url);
	manager = await canvasSketch(sketch, settings);
};
start();
