// Grouping operands using '*' helps readability in this case
/* eslint-disable space-infix-ops */

/**
 * Transform is a 4x4 transformation matrix
 *
 * @typedef {Number[]} Transform
 */
class Transform extends Array {
  /**
   * Create empty transform filled with 0s
   */
  constructor() {
    super();
    this[0] = [0, 0, 0, 0];
    this[1] = [0, 0, 0, 0];
    this[2] = [0, 0, 0, 0];
    this[3] = [0, 0, 0, 0];
  }

  /**
   * Create transform with 1s on the main diagonal
   *
   * @returns 4x4 identity matrix
   */
  static getIdentity() {
    const transform = new Transform();

    transform[0] = [1, 0, 0, 0];
    transform[1] = [0, 1, 0, 0];
    transform[2] = [0, 0, 1, 0];
    transform[3] = [0, 0, 0, 1];

    return transform;
  }

  /**
   * Returns a function that can be applied to a vertex to transform it with
   * this matrix
   *
   * @returns Vertex handler function
   */
  getMappingFunction() {
    return (v) => {
      const x = v.x*this[0][0] + v.y*this[0][1] + v.z*this[0][2] + this[0][3];
      const y = v.x*this[1][0] + v.y*this[1][1] + v.z*this[1][2] + this[1][3];
      const z = v.x*this[2][0] + v.y*this[2][1] + v.z*this[2][2] + this[2][3];
      const w = v.x*this[3][0] + v.y*this[3][1] + v.z*this[3][2] + this[3][3];

      return (w !== 0) ? new Point(x / w, y / w, z / w) : new Point(0, 0, 0);
    };
  }

  combine(other) {
    const result = new Transform();

    for (let row = 0; row < 4; row += 1) {
      for (let col = 0; col < 4; col += 1) {
        let sum = 0;
        for (let i = 0; i < 4; i += 1) {
          sum += this[row][i] * other[i][col];
        }
        result[row][col] = sum;
      }
    }

    return result;
  }
}

const getScaleTransform = (scaleX, scaleY, scaleZ) => {
  const scale = Transform.getIdentity();
  scale[0][0] = scaleX;
  scale[1][1] = scaleY;
  scale[2][2] = scaleZ;

  return scale;
};

/**
 * @param {Point} position
 * @returns Transform that when applied to point [x, y, z] returns
 * [x + p.x, y + p.y, z + p.z], p is the argument
 */
const getTranslationTransform = (position) => {
  const translation = Transform.getIdentity();
  translation[0][3] = position.x;
  translation[1][3] = position.y;
  translation[2][3] = position.z;

  return translation;
};

/**
 * @param {Number} angle
 * @returns Transform that when applied to point [x, y, z] rotates it around
 * the X axis
 */
const getRotationXTransform = (angle) => {
  const rotation = Transform.getIdentity();
  rotation[1][1] = Math.cos(angle);
  rotation[1][2] = -Math.sin(angle);
  rotation[2][1] = Math.sin(angle);
  rotation[2][2] = Math.cos(angle);

  return rotation;
};
/**
 * @param {Number} angle
 * @returns Transform that when applied to point [x, y, z] rotates it around
 * the Y axis
 */
const getRotationYTransform = (angle) => {
  const rotation = Transform.getIdentity();
  rotation[0][0] = Math.cos(angle);
  rotation[0][2] = Math.sin(angle);
  rotation[2][0] = -Math.sin(angle);
  rotation[2][2] = Math.cos(angle);

  return rotation;
};
/**
 * @param {Number} angle
 * @returns Transform that when applied to point [x, y, z] rotates it around
 * the Z axis
 */
const getRotationZTransform = (angle) => {
  const rotation = Transform.getIdentity();
  rotation[0][0] = Math.cos(angle);
  rotation[0][1] = -Math.sin(angle);
  rotation[1][0] = Math.sin(angle);
  rotation[1][1] = Math.cos(angle);

  return rotation;
};

/**
 * @param {Number} projectionSize
 * @returns Transform that when applied to point [x, y, z] projects it into the
 * cube with coordinate range [-1, 1]
 */
const getProjectionTransform = (projectionSize, perspectiveCoeffitient = 0) => {
  const projection = Transform.getIdentity();
  projection[3][3] = projectionSize;
  projection[3][2] = perspectiveCoeffitient;

  return projection;
};

/**
 * @param {Number} width
 * @param {Number} height
 * @returns Transform that when applied to projected point [x, y, z] where each
 * coordinate is in range [-1, 1] stretches its x and y components to fit in
 * range [0, width] and [0, height] respectively. It also flips the Y component
 * upside down because in screen coordinate system higher values are lower, but
 * in input coordinate system its the opposite
 */
const getViewportTransform = (width, height) => {
  const transform = Transform.getIdentity();
  const aspectRatio = height / width;
  transform[0][0] = (width / 2) * aspectRatio;
  transform[1][1] = -height / 2;
  transform[0][3] = width / 2;
  transform[1][3] = height / 2;

  return transform;
};

const getPerspectiveTransform = () => {
  const result = Transform.getIdentity();
  result[3][2] = 1;
  return result;
};
