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

const mesh = createMesh( models['cylinderZUp'] );
const axes = createMesh( models['axes'] );

//axes.position = new Point(2, 2, 0);

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
    case 'KeyC': console.log(mesh); break;
  }
};

let projectionMode = projectionChooser.value;
projectionChooser.onchange = () => {
  projectionMode = projectionChooser.value;
};

const renderClassMode = () => {
  const width = canvas.width;
  const height = canvas.height;

  let scaleX = 1;
  let scaleY = 1;
  let scaleZ = 1;
  let rotationX = mesh.rotationX;
  let rotationY = mesh.rotationY;
  let rotationZ = mesh.rotationZ;
  let beforeTransform, afterTransform;
  let perspective = false;

  switch (projectionMode) {
    case 'Freecam':
      //Dont need to change anything
      //scaleZ = -2;
      break;
    case 'Rectangular Isometry':
      rotationX = 0;
      rotationY = Math.PI;
      rotationZ = 0;
      beforeTransform = Transform.getIdentity();
      beforeTransform[0][0] = -0.86;
      beforeTransform[0][1] = 0.86;
      beforeTransform[1][0] = -0.5;
      beforeTransform[1][1] = -0.5;
      beforeTransform[1][2] = 1;
      break;
    case 'Rectangular Dimetry':
      rotationX = 0;
      rotationY = Math.PI;
      rotationZ = 0;
      beforeTransform = Transform.getIdentity();
      beforeTransform[0][0] = -0.99;
      beforeTransform[0][1] = 0.375;
      beforeTransform[1][0] = -0.125;
      beforeTransform[1][1] = -0.33;
      beforeTransform[1][2] = 1;
      break;
    case 'Front Oblique Isometry':
      rotationX = 0;
      rotationY = Math.PI;
      rotationZ = 0;
      beforeTransform = Transform.getIdentity();
      beforeTransform[0][0] = -1;
      beforeTransform[0][1] = 0.71;
      beforeTransform[1][1] = -0.71;
      beforeTransform[1][2] = 1;
      break;
    case 'Front Oblique Dimetry':
      rotationX = 0;
      rotationY = Math.PI;
      rotationZ = 0;
      beforeTransform = Transform.getIdentity();
      beforeTransform[0][0] = -1;
      beforeTransform[0][1] = 0.71 / 2;
      beforeTransform[1][1] = -0.71 / 2;
      beforeTransform[1][2] = 1;
      break;
    case 'Perspective':
      perspective = true;
    default:
  }

  render(
    [mesh, axes],
    width,
    height,
    renderTriangles,
    renderZBuff,
    perspective,
    {
      zoom,
      scaleX,
      scaleY,
      scaleZ,
      rotationX,
      rotationY,
      rotationZ,
      beforeTransform,
      afterTransform,
    }
  );
};

setInterval(renderClassMode, 50);
/*
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
*/

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
