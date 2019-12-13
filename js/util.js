const canvas = document.getElementById('canvas');
 
const getWindowDimensions = () => {
  return {
    width: window.innerWidth,
    height: window.innerHeight,
  };
};
 
const fitCanvas = dimensions => {
  canvas.setAttribute('width', dimensions.width);
  canvas.setAttribute('height', dimensions.height);
};
 
window.onresize = () => {
  fitCanvas(getWindowDimensions());
};
fitCanvas(getWindowDimensions());

const projectionChooser = document.getElementById('projectionChooser');