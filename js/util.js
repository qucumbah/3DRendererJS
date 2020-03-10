const canvas = document.getElementById('canvas');

const getWindowDimensions = () => ({
  width: window.innerWidth,
  height: window.innerHeight,
});

const fitCanvas = (dimensions) => {
  canvas.setAttribute('width', dimensions.width);
  canvas.setAttribute('height', dimensions.height);
};

window.onresize = () => {
  fitCanvas(getWindowDimensions());
};
fitCanvas(getWindowDimensions());

const projectionChooser = document.getElementById('projectionChooser');
const angleChooser = document.getElementById('angleChooser');

const shiftXChooser = document.getElementById('shiftXChooser');
const shiftZChooser = document.getElementById('shiftZChooser');
const shiftYChooser = document.getElementById('shiftYChooser');
