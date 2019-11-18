/**
 * An array of vertices with some additional methods
 * 
 * @typedef {Object} Face
 */
class Face extends Array {
  /**
   * Creates face from vertex coordinates
   * @param {Number[]} coordsArray Array of shape [p1x, p1y, p1z, p2x, ...]
   */
  constructor(coordsArray) {
    super();
    for (let i = 0; i < coordsArray.length; i += 3) {
      const vertex = new Point(
        coordsArray[i + 0],
        coordsArray[i + 1],
        coordsArray[i + 2]
      );
    
      this.push(vertex);
    }
  }

  /**
   * Returns new face with the specified transformation applied
   * 
   * @param {Transform} transform Transformation to apply
   * @returns {Face} The resulting face
   */
  applyTransform(transform) {
    const transformed = this.map( transform.getMappingFunction() );
    //this.splice(0); //Remove all vertices
    //transformed.forEach( transformedVertex => this.push(transformedVertex) );
    //return this;
    return transformed;
  }
}