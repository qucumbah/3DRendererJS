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

const modelChooser = document.getElementById('modelChooser');
for (const modelName in models) {
  const option = document.createElement('option');
  option.innerHTML = modelName;
  option.value = modelName;

  modelChooser.appendChild(option);
}

const defaultModelName = 'lShape';
modelChooser.value = defaultModelName;