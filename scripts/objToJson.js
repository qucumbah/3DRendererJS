const fs = require('fs');

if (process.argv.length !== 4) {
  console.error('Wrong arguments');
  console.error('Usage: node objToJson.js <input.obj> <output.json>');
  process.exit();
}

const inputFilePath = process.argv[2];
const outputFilePath = process.argv[3];

const inputFile = fs.readFileSync(inputFilePath, 'utf8');
const inputLines = inputFile.split('\n');

const vertices = [];
const faces = [];
const handleLine = inputLine => {
  const token = inputLine[0];
  const line = inputLine.slice(2);
  switch (token) {
    case 'v':
      const coordsArray = line.split(' ').map( coord => parseFloat(coord) );
      vertices.push(coordsArray);
      break;
    case 'f':
      const face = [];
      const verticesIndexesArray = line.split(' ');
      verticesIndexesArray.forEach(index => {
        vertices[index - 1].forEach( coordinate => face.push(coordinate) );
      });
      faces.push(face);
      break;
    default:
  }
};

inputLines.forEach(handleLine);

const result = JSON.stringify(faces);
fs.writeFileSync(outputFilePath, result);
