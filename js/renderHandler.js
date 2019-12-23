/**
 * Creates a new zBuffer
 * 
 * @param {Number} width 
 * @param {Number} height 
 * @returns A uInt8ClampedArray with specified width and height
 */
const createZBuffer = (width, height) => {
  const result = new Uint8ClampedArray(width * height);
  result.width = width;
  result.height = height;
  return result;
};

/**
 * Returns value at specified position in zBuffer
 * @param {Uint8ClampedArray} zBuffer 
 * @param {Number} x 
 * @param {Number} y 
 */
const zBufferAt = (zBuffer, x, y) => {
  return zBuffer[y * zBuffer.width + x];
};
/**
 * Sets the specified value in zBuffer[x][y]
 * @param {Uint8ClampedArray} zBuffer 
 * @param {Number} x 
 * @param {Number} y 
 * @param {Number} value 
 */
const zBufferPut = (zBuffer, x, y, value) => {
  zBuffer[y * zBuffer.width + x] = value;
};

/**
 * Puts specified color at specified position in imageData
 * @param {Number} x 
 * @param {Number} y 
 * @param {ImageData} imageData 
 * @param {Number[]} color [R, G, B, A]
 */
const putPixel = (xIn, y, imageData, color) => {
  const x = imageData.width - xIn;
  const index = 4 * (y * imageData.width + x);
  imageData.data[index + 0] = color[0];
  imageData.data[index + 1] = color[1];
  imageData.data[index + 2] = color[2];
  imageData.data[index + 3] = color[3];
};

/**
 * Rasterizes triangle
 * 
 * @param {Triangle} triangle 
 * @param {Number[]} fillColor [R, G, B, A]
 * @param {Number[]} edgeColor [R, G, B, A]
 * @param {ImageData} imageData 
 * @param {Uint8ClampedArray} zBuffer 
 */
const drawTriangle = (triangle, fillColor, edgeColor, imageData, zBuffer) => {
  triangle.sortByY();

  const totalHeight = triangle[2].y - triangle[0].y;
  for (let i = 0; i < totalHeight; i++) {
    const firstHalfHeight = triangle[1].y - triangle[0].y;
    const secondHalfHeight = triangle[2].y - triangle[1].y;
    const secondHalf = (i > firstHalfHeight) || (firstHalfHeight === 0);
    const segmentHeight = secondHalf ? secondHalfHeight : firstHalfHeight;

    //[0 - 1] what part of the triangle we've drawn
    const alpha = i / totalHeight;
    //[0 - 1] what part of the segment we've drawn
    const beta = ( i - (secondHalf ? firstHalfHeight : 0) ) / segmentHeight;

    //Point between the highest point and the lowest point:
    //a = p0 + (p2 - p0) * alpha
    let a = triangle[0].add(
      triangle[2].subtract(triangle[0]).multiply(alpha)
    );
    
    let b;
    if (secondHalf) {
      //Point between lowest point and middle point
      //b = p1 + (p2 - p1) * beta
      b = triangle[1].add(
        triangle[2].subtract(triangle[1]).multiply(beta)
      );
    } else {
      //Point between highest point and middle point
      //b = p0 + (p1 - p0) * beta
      b = triangle[0].add(
        triangle[1].subtract(triangle[0]).multiply(beta)
      );
    }

    const needSwap = a.x > b.x;

    const aInt = needSwap ? b.toIntegerPoint() : a.toIntegerPoint();
    const bInt = needSwap ? a.toIntegerPoint() : b.toIntegerPoint();

    for (let j = aInt.x; j <= bInt.x; j++) {
      const outOfBoundsX = (j < 0) || (j >= imageData.width);
      const outOfBoundsY = (
        (triangle[0].y + i < 0) || (triangle[0].y + i >= imageData.height)
      );

      if (outOfBoundsX || outOfBoundsY) {
        continue;
      }

      const isTriangleEdge = (
        j === aInt.x ||
        j === bInt.x ||
        i === 0 ||
        i === Math.floor(totalHeight)
      );

      //[0 - 1] What part of the horizontal line we've drawn
      const phi = (aInt.x === bInt.x) ? 1 : (j - aInt.x) / (bInt.x - aInt.x);
      //Point between leftmost and rightmost points of the horizontal line
      //p = left + (right - left) * phi
      const p = a.add( b.subtract(a).multiply(phi) );
      const pInt = p.toIntegerPoint();
      
      //zBuffer is a unsigned int8 array, which means that it can only contain
      //values between 0 and 255. As well as that, its initialized with zeroes.
      //Our point Z value after projection normally lays somewhere in range
      //[-1; 1], where -1 is the closest an object can get, 1 is the furthest.
      //If we transform our interval [-1; 1] to [0, 255], then 0 will be the
      //closest, 255 the furthest Z value of the point can be. If we reverse it,
      //we'll have 255 as the closest and 0 as the furthest. This combination is
      //the one we'll use because now we can more easily compare point's Z
      //component with the buffer value. So the final formula is:
      //closeness = 255 - (p.z - (-1)) / (1 - (-1)) * 255
      const closeness = Math.round( 255 - (p.z + 1) / 2 * 255 );
      
      if ( closeness > zBufferAt(zBuffer, pInt.x, pInt.y) ) {
        putPixel(
          pInt.x,
          pInt.y,
          imageData, isTriangleEdge ? edgeColor : fillColor);
        zBufferPut(zBuffer, pInt.x, pInt.y, closeness);
      }
    }
  }
};

/**
 * Renders grayscale representation of zBuffer
 * 
 * @param {Uint8ClampedArray} zBuffer 
 * @param {ImageData} imageData 
 */
const renderZBuffer = (zBuffer, imageData) => {
  for (let i = 0; i < zBuffer.width; i++) {
    for (let j = 0; j < zBuffer.height; j++) {
      const tone = zBufferAt(zBuffer, i, j);
      putPixel(i, j, imageData, [tone, tone, tone, 255]);
    }
  }
};

/**
 * Draws a line
 * 
 * @param {Point} p1 Starting point
 * @param {Point} p2 End point
 * @param {Number[]} color Color presented as [R, G, B, A]
 * @param {ImageData} imageData 
 * @param {Uint8ClampedArray} zBuffer 
 */
const drawLine = (p1, p2, color, imageData, zBuffer, overrideZBuffer) => {
  const x1 = Math.floor(p1.x);
  const y1 = Math.floor(p1.y);
  const x2 = Math.floor(p2.x);
  const y2 = Math.floor(p2.y);
  const z1 = p1.z;
  const z2 = p2.z;

  if (Math.abs(x1 - x2) < Math.abs(y1 - y2)) {
    rasterize(
      y1, x1, z1, y2, x2, z2, true, color, imageData, zBuffer, overrideZBuffer
    );
  } else {
    rasterize(
      x1, y1, z1, x2, y2, z2, false, color, imageData, zBuffer, overrideZBuffer
    );
  }
}

const rasterize = (
  x1, y1, z1, x2, y2, z2,
  steep,
  color,
  imageData,
  zBuffer,
  overrideZBuffer
) => {
  if (x1 > x2) {
    let temp;
    //Swap x1, x2
    temp = x1;
    x1 = x2;
    x2 = temp;
    //Swap y1, y2
    temp = y1;
    y1 = y2;
    y2 = temp;
    //Swap z1, z2
    temp = z1;
    z1 = z2;
    z2 = temp;
  }
 
  const dx = x2 - x1;
  const dy = y2 - y1;
  const derror = Math.abs(dy / dx);
  let error = 0;
  let y = y1;
  for (let x = x1; x <= x2; x++) {
    const depth = z1 + (z2 - z1) * ((x - x1) / (x2 - x1));
    //Same as in triangle rasterization function; if overrideZBuffer is true
    //we dont have to use actual closeness, we just consider any point as
    //being as close to the camera as it can be
    const actualCloseness = Math.round( 255 - (depth + 1) / 2 * 255 );
    const closeness = overrideZBuffer ? 255 : actualCloseness;
    ///*
    if (steep) {
      if ( closeness > zBufferAt(zBuffer, y, x) ) {
        putPixel(y, x, imageData, color);
        zBufferPut(zBuffer, y, x, closeness);
      }
    } else {
      if ( closeness > zBufferAt(zBuffer, x, y) ) {
        putPixel(x, y, imageData, color);
        zBufferPut(zBuffer, x, y, closeness);
      }
    }
    //*/
    /*
    if (steep) {
      putPixel(y, x, imageData, color);
    } else {
      putPixel(x, y, imageData, color);
    }
    */
    error += derror;
 
    if (error > 0.5) {
      y += ( (y2 > y1) ? 1 : -1 );
      error -= 1;
    }
  }
};

/**
 * Renders black outline
 * 
 * @param {Face} face 
 * @param {ImageData} imageData 
 * @param {Uint8ClampedArray} zBuffer 
 */
const renderFaceOutline = (
  face,
  imageData,
  zBuffer,
  color,
  overrideZBuffer
) => {
  face.forEach((curPoint, index) => {
    const prevPoint = (index === 0) ? face[face.length - 1] : face[index - 1];
    drawLine(prevPoint, curPoint, color, imageData, zBuffer, overrideZBuffer);
  });
};

/**
 * Renders the meshes to canvas with specified parameters
 * 
 * @param {Mesh[]} meshes Array of meshes to render
 * @param {Number} width Canvas width
 * @param {Number} height Canvas height
 * @param {Boolean} renderTriangles Whether or not to render triangle outline
 * @param {Boolean} renderZBuffer Whether or not to render zBuffer
 */
const render = (
  meshes,
  width,
  height,
  renderTriangles,
  renderZBuff,
  perspective,
  viewSettings,
) => {
  const {
    zoom,
    scaleX,
    scaleY,
    scaleZ,
    rotationX,
    rotationY,
    rotationZ,
    additionalAngle,
    beforeTransform,
    afterTransform,
  } = viewSettings;
  
  const ctx = canvas.getContext('2d');
  const imageData = ctx.createImageData(canvas.width, canvas.height);
  const zBuffer = createZBuffer(canvas.width, canvas.height);

  meshes.forEach((mesh, meshNumber) => {
    const scaleTransform = getScaleTransform( scaleX, scaleY, scaleZ );
    const rotationXTransform = getRotationXTransform( rotationX );
    const rotationYTransform = getRotationYTransform( rotationY );
    const rotationZTransform = getRotationZTransform( rotationZ );
    const translationTransform = (
      getTranslationTransform( mesh.position.multiply(-1) )
    );
    const projectionTransform = (
      getProjectionTransform(zoom, perspective ? 1 : 0)
    );
    const viewportTransform = getViewportTransform(width, height);

    //Spaghetti, but the deadline is tomorrow
    const beforeTransformWithAngle = beforeTransform.combine(
      getRotationZTransform( (meshNumber === 0) ? additionalAngle : 0 )
    );

    const combinedTransform = (
      afterTransform
      .combine(viewportTransform)
      .combine(projectionTransform)
      .combine(translationTransform)
      .combine(rotationZTransform)
      .combine(rotationYTransform)
      .combine(rotationXTransform)
      .combine(scaleTransform)
      .combine(beforeTransformWithAngle)
    );

    mesh.forEach(face => {
      const faceTransformed = face.applyTransform(combinedTransform);
      /*
      const faceTransformed = face
        .applyTransform(scaleTransform)
        .applyTransform(rotationXTransform)
        .applyTransform(rotationYTransform)
        .applyTransform(rotationZTransform)
        .applyTransform(translationTransform)
        .applyTransform(projectionTransform)
        .applyTransform(viewportTransform);
      */

      const triangles = divideToTriangles(faceTransformed);

      const {p1, p2, p3} = triangles[0];
      const e1 = p2.subtract(p1);
      const e2 = p3.subtract(p1);
      const crossProduct = e1.cross(e2);
      const eyeDirection = new Point(0, 0, 1);
      //console.log(eyeDirection.dot(crossProduct));
      const isVisible = eyeDirection.dot(crossProduct) > 0;
      
      const red = [255, 0, 0, 255];
      const blue = [0, 0, 255, 255];
      const black = [0, 0, 0, 255];
      const gray = [200, 200, 200, 255];
      const lightGray = [240, 240, 240, 255];
      const color = (meshNumber === 1) ? red : (isVisible ? black : lightGray);
      //Always draw faces that face the camera
      const overrideZBuffer = (meshNumber === 1 || !isVisible) ? false : true;

      renderFaceOutline(
        faceTransformed,
        imageData,
        zBuffer,
        color,
        overrideZBuffer
      );
      
      if (!renderTriangles) {
        return;
      }

      triangles.forEach(triangle => {
        const white = [255, 255, 255, 255];
        const gray = [200, 200, 200, 255];
        const black = [0, 0, 0, 255];
        drawTriangle(
          triangle,
          white,
          renderTriangles ? gray : white,
          imageData,
          zBuffer
        );
      });
    });
  });

  if (renderZBuff) {
    renderZBuffer(zBuffer, imageData);
  }

  ctx.putImageData(imageData, 0, 0);
};