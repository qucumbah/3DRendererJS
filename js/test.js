/*
const isFacing = (e1Start, e1Body, e2Start, e2Body) => {
  const rightSide = e1Body.cross( e2Start.subtract(e1Start) );
  const leftSide = e1Body.cross( e2Start.add(e2Body).subtract(e1Start) );

  return rightSide.z * leftSide.z <= 0;
}

const edgesIntersect = (e1Start, e1Body, e2Start, e2Body) => {
  if (!isFacing(e1Start, e1Body, e2Start, e2Body)) {
    return false;
  }

  const upper = e2Start.subtract(e1Start).cross(e2Body).z;
  const lower = e1Body.cross(e2Body).z;
  const c = upper / lower;

  console.log(e1Start.subtract(e2Start).cross(e1Body));
  console.log(e2Body.cross(e1Body));
  console.log(c);

  return (c >= 0) && (c <= 1);
};

const start1 = new Point(5, 5, 0);
const body1 = new Point(-2, 2, 0);
const start2 = new Point(4, 8, 0);
const body2 = new Point(-2, -2, 0);
// console.log(edgesIntersect(start1, body1, start2, body2));
*/

/*
const face = [
  new Point(0, 0, 0),
  new Point(0, 1, 0),
  new Point(1, 1, 0),
  new Point(1, 0, 0)
];
// console.log(divideToTriangles(face));
*/

const ctx = canvas.getContext('2d');
const imageData = ctx.createImageData(canvas.width, canvas.height);

// Point {x: 1120, y: 80.375, z: 0} Point {x: 800, y: 241.125, z: 0}
// Point {x: 800, y: 241.125, z: 0} Point {x: 800, y: 80.375, z: 0}
// Point {x: 800, y: 80.375, z: 0} Point {x: 1120, y: 80.375, z: 0}

const x = 100;
const p1 = new Point(1120, 80.375, 0);
const p2 = new Point(800, 241.125, 0);
// drawLine(p1, p2, [0,0,0,255], imageData);

// ctx.putImageData(imageData, 0, 0);
