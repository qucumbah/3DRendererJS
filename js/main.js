/**
 * Creates a mesh from faces represented as arrays
 * 
 * @param {Number[][]} modelArray Array which contains faces represented as
 * arrays of numbers. Each set of  3 numbers in these arrays represent a vertex
 * in 3D space:
 * modelArray = [
 *   [x1, y1, z1, x2, y2, z2, ...],
 *   ... (other faces)
 * ]
 */
const createMesh = modelArray => {
  const faces = modelArray.map( coordsArray => new Face(coordsArray) );
  const origin = new Point(0, 0, 0);
  return new Mesh(faces, origin);
};

let mesh = createMesh( models[modelChooser.value] );
modelChooser.onchange = () => {
  mesh = createMesh( models[modelChooser.value] );
};

const rotationSpeed = 0.03;
window.onkeydown = event => {
  switch (event.code) {
    case 'KeyW': mesh.rotationSpeedX = rotationSpeed; break;
    case 'KeyS': mesh.rotationSpeedX = -rotationSpeed; break;
    case 'KeyA': mesh.rotationSpeedY = rotationSpeed; break;
    case 'KeyD': mesh.rotationSpeedY = -rotationSpeed; break;
    case 'KeyQ': mesh.rotationSpeedZ = rotationSpeed; break;
    case 'KeyE': mesh.rotationSpeedZ = -rotationSpeed; break;
  }
};
window.onkeyup = event => {
  switch (event.code) {
    case 'KeyW': mesh.rotationSpeedX = 0; break;
    case 'KeyS': mesh.rotationSpeedX = 0; break;
    case 'KeyA': mesh.rotationSpeedY = 0; break;
    case 'KeyD': mesh.rotationSpeedY = 0; break;
    case 'KeyQ': mesh.rotationSpeedZ = 0; break;
    case 'KeyE': mesh.rotationSpeedZ = 0; break;
  }
};

//let zoom = 1;
let zoom = 5;
const zoomSpeed = 1.1;

let renderTriangles = false;
let renderZBuff = false;

window.onkeypress = event => {
  switch (event.code) {
    case 'KeyR': zoom /= zoomSpeed; break;
    case 'KeyF': zoom *= zoomSpeed; break;
    case 'KeyT': renderTriangles = !renderTriangles; break;
    case 'KeyZ': renderZBuff = !renderZBuff; break;
  }
};

const width = canvas.width;
const height = canvas.height;
///*
setInterval(() => {
  render(
    [mesh],
    zoom,
    width,
    height,
    renderTriangles,
    renderZBuff
  );
}, 50);
//*/

//const timestamp = Date.now();
/*
render(
  [mesh],
  zoom,
  width,
  height,
  renderTriangles,
  renderZBuff
);
*/
//console.log('Render finished in', Date.now() - timestamp, 'ms');
