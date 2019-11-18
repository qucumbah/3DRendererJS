/**
 * Wrapper for vector of 3 numbers with a few math methods
 * 
 * @typedef {Object} Point
 * @property {Number} x
 * @property {Number} y
 * @property {Number} z
 */
class Point {
  constructor(x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  add(other) {
    return new Point(
      this.x + other.x,
      this.y + other.y,
      this.z + other.z
    );
  }

  subtract(other) {
    return new Point(
      this.x - other.x,
      this.y - other.y,
      this.z - other.z
    );
  }

  cross(other) {
    return new Point(
      this.y*other.z - this.z*other.y,
      this.z*other.x - this.x*other.z,
      this.x*other.y - this.y*other.x
    );
  }

  cross2D(other) {
    return this.x*other.y - this.y*other.x;
  }

  dot(other) {
    return new Point(
      this.x * other.x,
      this.y * other.y,
      this.z * other.z
    );
  }

  multiply(number) {
    return new Point(
      this.x * number,
      this.y * number,
      this.z * number
    );
  }

  length() {
    return Math.sqrt( this.x * this.x + this.y * this.y + this.z * this.z );
  }
  
  flipY() {
    return new Point(
      this.x,
      -this.y,
      this.z
    );
  }

  toIntegerPoint() {
    return new Point(
      Math.floor(this.x),
      Math.floor(this.y),
      Math.floor(this.z)
    );
  }
}
