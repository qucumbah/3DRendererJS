/* eslint-disable dot-notation */

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
const createMesh = (modelArray) => {
  const faces = modelArray.map((coordsArray) => new Face(coordsArray));
  const origin = new Point(0, 0, 0);
  return new Mesh(faces, origin);
};

const mesh = createMesh(models['palatka2']);
const axes = createMesh(models['axes']);
axes.position = new Point(2, 0, 0);
// This is a little trick that I implemented to avoid coding horizon renderer:
// I replaced it with a 3D object of a line 'far away' from the screen so that
// it looks like its infinitely far away. It wasn't far enough though, which was
// quickly noticed on exam... whoops
const horizon = createMesh(models['horizon']);

const rotationSpeed = 0.03;
window.onkeydown = (event) => {
  switch (event.code) {
    case 'KeyW': mesh.rotationSpeedX = rotationSpeed; break;
    case 'KeyS': mesh.rotationSpeedX = -rotationSpeed; break;
    case 'KeyA': mesh.rotationSpeedY = rotationSpeed; break;
    case 'KeyD': mesh.rotationSpeedY = -rotationSpeed; break;
    case 'KeyQ': mesh.rotationSpeedZ = rotationSpeed; break;
    case 'KeyE': mesh.rotationSpeedZ = -rotationSpeed; break;
    default:
  }
};
window.onkeyup = (event) => {
  switch (event.code) {
    case 'KeyW': mesh.rotationSpeedX = 0; break;
    case 'KeyS': mesh.rotationSpeedX = 0; break;
    case 'KeyA': mesh.rotationSpeedY = 0; break;
    case 'KeyD': mesh.rotationSpeedY = 0; break;
    case 'KeyQ': mesh.rotationSpeedZ = 0; break;
    case 'KeyE': mesh.rotationSpeedZ = 0; break;
    default:
  }
};

// let zoom = 1;
let zoom = 5;
const zoomSpeed = 1.1;

let renderTriangles = false;
let renderZBuff = false;

// Miscellaneous controls
window.onkeypress = (event) => {
  switch (event.code) {
    case 'KeyR': zoom /= zoomSpeed; break;
    case 'KeyF': zoom *= zoomSpeed; break;
    case 'KeyT': renderTriangles = !renderTriangles; break;
    case 'KeyZ': renderZBuff = !renderZBuff; break;
    case 'KeyC': console.log(mesh); break;
    default:
  }
};

let projectionMode = projectionChooser.value;
projectionChooser.onchange = () => {
  projectionMode = projectionChooser.value;
};

let additionalAngle = angleChooser.value;
angleChooser.oninput = () => {
  additionalAngle = angleChooser.value;
};

let shiftX = shiftXChooser.value;
shiftXChooser.oninput = () => {
  shiftX = shiftXChooser.value;
};
let shiftY = shiftYChooser.value;
shiftYChooser.oninput = () => {
  shiftY = shiftYChooser.value;
};
let shiftZ = shiftZChooser.value;
shiftZChooser.oninput = () => {
  shiftZ = shiftZChooser.value;
};

//
const renderUniMode = () => {
  const { width, height } = canvas;

  let scaleX = 1;
  let scaleY = 1;
  let scaleZ = 1;
  let { rotationX, rotationY, rotationZ } = mesh;
  const beforeTransform = Transform.getIdentity();
  const afterTransform = Transform.getIdentity();
  let perspective = false;

  switch (projectionMode) {
    case 'Rectangular Isometry':
      rotationX = 0;
      rotationY = Math.PI;
      rotationZ = 0;
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
      beforeTransform[0][0] = -1;
      beforeTransform[0][1] = 0.71;
      beforeTransform[1][1] = -0.71;
      beforeTransform[1][2] = 1;
      break;
    case 'Front Oblique Dimetry':
      rotationX = 0;
      rotationY = Math.PI;
      rotationZ = 0;
      beforeTransform[0][0] = -1;
      beforeTransform[0][1] = 0.71 / 2;
      beforeTransform[1][1] = -0.71 / 2;
      beforeTransform[1][2] = 1;
      break;
    case 'Freecam':
      // Dont need to change anything
      break;
    case 'Perspective':
      rotationX = Math.PI * -0.5;
      rotationY = Math.PI * 0;
      rotationZ = Math.PI * 0;
      perspective = true;
      scaleX = 0.8;
      scaleY = 0.8;
      scaleZ = 0.8;
      beforeTransform[0][1] = (shiftX - 50) / -100;
      beforeTransform[1][1] = shiftY / 100;
      beforeTransform[2][1] = -shiftY / 100;
      beforeTransform[2][1] = (shiftZ - 50) / -100;
      break;
    default:
  }

  const viewSettings = {
    zoom,
    scaleX,
    scaleY,
    scaleZ,
    rotationX,
    rotationY,
    rotationZ,
    beforeTransform,
    afterTransform,
    additionalAngle: (additionalAngle / 180) * Math.PI,
  };

  render(
    [mesh, axes, horizon],
    width,
    height,
    renderTriangles,
    renderZBuff,
    perspective,
    viewSettings,
  );
};

setInterval(renderUniMode, 50);
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

// const timestamp = Date.now();
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
// console.log('Render finished in', Date.now() - timestamp, 'ms');
