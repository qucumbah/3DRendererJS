/**
 * Mesh is an object that consists of faces. It also has its own position and
 * rotation
 *
 * @typedef {Face[]} Mesh
 */
class Mesh extends Array {
  /**
   * Creates a mesh with the specified rotation origin
   *
   * @param {Face[]} faces Model's faces
   * @param {Point} origin Rotation origin
   */
  constructor(faces, origin = new Point(0, 0, 0)) {
    super();

    const translationTransform = getTranslationTransform(origin.multiply(-1));
    const translatedFaces = faces.map(
      (face) => face.applyTransform(translationTransform)
    );
    translatedFaces.forEach((face) => this.push(face));

    this.position = new Point(0, 0, 0);

    this.rotationSpeedX = 0;
    this.rotationSpeedY = 0;
    this.rotationSpeedZ = 0;

    this.rotationX = 0;
    this.rotationY = 0;
    this.rotationZ = 0;

    const updateRotation = () => {
      this.rotationX += this.rotationSpeedX;
      this.rotationY += this.rotationSpeedY;
      this.rotationZ += this.rotationSpeedZ;
    };

    setInterval(updateRotation, 15);
  }
}
