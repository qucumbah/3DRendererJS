/* eslint-disable lines-between-class-members */

/**
 * Contains 3 points
 * Points of this triangle can be accessed in three ways:
 * 1. triangle.p1, triangle.p2, triangle.p3
 * 2. triangle[0], triangle[1], triangle[1]
 * 3. Using any array method such as triangle.forEach(point => ...)
 *
 * @typedef {Point[]} Triangle
 * @property {Point} p1
 * @property {Point} p2
 * @property {Point} p3
 */
class Triangle extends Array {
  /**
   * Constructs Triangle from specified points
   *
   * @param {Point} p1
   * @param {Point} p2
   * @param {Point} p3
   */
  constructor(p1, p2, p3) {
    super();
    this.push(p1);
    this.push(p2);
    this.push(p3);
  }

  set p1(value) {
    this[0] = value;
  }
  set p2(value) {
    this[1] = value;
  }
  set p3(value) {
    this[2] = value;
  }

  get p1() {
    return this[0];
  }
  get p2() {
    return this[1];
  }
  get p3() {
    return this[2];
  }

  /**
   * Sorts points in this triangle by Y. This is used for simpler rasterization
   */
  sortByY() {
    const points = [this.p1, this.p2, this.p3];
    points.sort((point1, point2) => point1.y - point2.y);

    // Its a bit clearer without destructuring
    /* eslint-disable prefer-destructuring */
    this.p1 = points[0];
    this.p2 = points[1];
    this.p3 = points[2];
  }
}

/**
 * Returns number c1 that has following property:
 * e1Start + e1Body*c1 intersects with e2Start + e2Body*c2, where c2 is some
 * other number. If both c1 and c2 are in range [0, 1] then the two input
 * vectors intersect
 *
 * @param {Point} e1Start
 * @param {Point} e1Body
 * @param {Point} e2Start
 * @param {Point} e2Body
 *
 * @returns
 */
const getIntersectionCoefficient = (e1Start, e1Body, e2Start, e2Body) => {
  const upper = e2Start.subtract(e1Start).cross2D(e2Body);
  const lower = e1Body.cross2D(e2Body);
  return upper / lower;
};

/**
 * Finds intersection between edges which are presented as arrays of 2 Points
 *
 * @param {Point[]} edge1
 * @param {Point[]} edge2
 *
 * @returns {Boolean} Intersection found
 */
const edgesIntersect = (edge1, edge2) => {
  const e1Start = edge1[0];
  const e1Body = edge1[1].subtract(edge1[0]);

  const e2Start = edge2[0];
  const e2Body = edge2[1].subtract(edge2[0]);

  const c1 = getIntersectionCoefficient(e1Start, e1Body, e2Start, e2Body);
  const c2 = getIntersectionCoefficient(e2Start, e2Body, e1Start, e1Body);

  return (c1 >= 0) && (c1 <= 1) && (c2 >= 0) && (c2 <= 1);
};

/**
 * Divides simple polygon into triangles using ear clipping method
 * Actually I think I haven't implemented it correctly, so it only works right
 * in some cases. Deadlines are deadly for good code
 *
 * @param {Point[]} faceReference Array of points that form a simple polygon
 *
 * @returns {Triangle[]} Clipped polygon consisting of triangles
 */
const divideToTriangles = (faceReference) => {
  if (faceReference.length === 3) {
    return [
      new Triangle(
        faceReference[0],
        faceReference[1],
        faceReference[2]
      )
    ];
  }

  // Copy face so that we dont change it
  const faceCopy = faceReference.slice();

  const getMaxIndex = () => faceCopy.length - 1;
  const getPrevPointIndex = (index) => (
    (index === 0) ? getMaxIndex() : index - 1
  );
  const getNextPointIndex = (index) => (
    (index === getMaxIndex()) ? 0 : index + 1
  );

  const intersectsWithAnything = (edge, face) => (
    face.includes((otherEdgeStart, otherEdgeStartIndex) => {
      const otherEdgeEndIndex = getNextPointIndex(otherEdgeStartIndex);
      const otherEdgeEnd = face[otherEdgeEndIndex];
      return edgesIntersect(edge, [otherEdgeStart, otherEdgeEnd]);
    })
  );
  const findEar = (face) => {
    let ear = null;
    // Using find here so that iteration stops once we find the right element,
    // not to actually find it; once we find the right point we stop our search
    // and later return the ear
    face.find((point, index) => {
      const prevPointIndex = getPrevPointIndex(index);
      const nextPointIndex = getNextPointIndex(index);

      const prevPoint = face[prevPointIndex];
      const nextPoint = face[nextPointIndex];

      // In some cases removing a point wont create any intersections, but
      // instead removing it it will fill the space that wasn't in the face
      // initially. These cases are hard to handle, so we hope they dont happen

      if (!intersectsWithAnything([prevPoint, nextPoint], face)) {
        // We can remove this point and the polygon stays simple (no new
        // intersections appear), which means we've found an ear
        ear = {
          earIndex: index,
          prevPoint,
          point,
          nextPoint
        };
        return true;
      }

      return false;
    });

    return ear;
  };

  const triangles = [];
  while (faceCopy.length !== 3) {
    // eslint-disable-next-line object-curly-newline
    const { earIndex, prevPoint, point, nextPoint } = findEar(faceCopy);

    triangles.push(new Triangle(prevPoint, point, nextPoint));
    faceCopy.splice(earIndex, 1);
  }
  triangles.push(new Triangle(faceCopy[0], faceCopy[1], faceCopy[2]));

  return triangles;
};
