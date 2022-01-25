

export function vibe(imgData, background) {
  let width = imgData.width;                         // width of the image
  let height = imgData.height;                       // height of the image
  const image = imgData.data;           // current image
  const segmentationMap = new Uint8ClampedArray(width*height*4); // foreground detection map

  const nbSamples = 4;                   // number of samples per pixel
  const reqMatches = 2;                   // #_min
  const radius = 20;                      // R
  const subsamplingFactor = 16;           // amount of random subsampling

  // need to copy this background array
  const samples = new Array(nbSamples).fill(background); // background model

  function getEuclideanDist(image0, image1, index) {
    // console.log(image0, image1, index)
    let differenceSum = 0;

    for (let i = 0; i < 4; i++) {
      differenceSum += image0[index+i] - image1[index+i];
    }

    return Math.abs(differenceSum/4);
  }

  const xy_to_i = (x, y) => (y*width+x)*4;

  function setPixelBackground() {}

  const getRandomNumber = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const ammountOfRandomSubsampling = 5;
  const randomNeighbourMovements = [-1, 0, 1];


  const betweenValues = (value, min, max) => {
    return Math.max(min,Math.min(max,value));
  };

  const getRandomMovement =  () => {
    let randomMovementIndex = Math.round(Math.random()*(randomNeighbourMovements.length-1));
    return randomNeighbourMovements[randomMovementIndex];
  };

  const getRandomNeighbor = (x, y) => {
    const neighbourX= betweenValues(x + getRandomMovement(), 0, width-1);
    const neighbourY= betweenValues(y + getRandomMovement(), 0, height-1);
    return [ neighbourX, neighbourY ];
  };

  function chooseRandomNeighbor() {}

  function setPixelForeground() {}

  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      // comparison with the model
      let count = 0, index = 0, distance = 0;
      while ((count < reqMatches) && (index < nbSamples)){
        distance = getEuclideanDist(image, samples[index], xy_to_i(x, y));
        if (distance < radius) count++;
        index++;
      }
      // pixel classification according to reqMatches
      if (count >= reqMatches){ // the pixel belongs to the background
        // stores the result in the segmentation map
        // setPixel background
        for (let i = 0; i < 4; i++) {
          segmentationMap[xy_to_i(x, y)+i] = image[xy_to_i(x, y)+i];
        }
        // gets a random number between 0 and subsamplingFactor-1
        let randomNumber = getRandomNumber(0, subsamplingFactor-1);
        // update of the current pixel model
        if (randomNumber == 0){ // random subsampling
          // other random values are ignored 
          randomNumber = getRandomNumber(0, nbSamples-1);
          for (let i = 0; i < 4; i++) {
            samples[randomNumber][xy_to_i(x, y) + i] = image[xy_to_i(x, y) + i];
          }
          
        }
        // update of a neighboring pixel model
        randomNumber = getRandomNumber(0, subsamplingFactor-1);
        if (randomNumber == 0){ // random subsampling
          // chooses a neighboring pixel randomly
          const [ neighborX, neighborY ] = getRandomNeighbor(x, y);
          // chooses the value to be replaced randomly
          randomNumber = getRandomNumber(0, nbSamples-1);
          for (let i = 0; i < 4; i++) {
            samples[randomNumber][xy_to_i(neighborX, neighborY) + i] = image[xy_to_i(x, y) + i];
          }
        } 
      }
      else // the pixel belongs to the foreground
        // stores the result in the segmentation map
        // setPixelForeground(segmentationMap[x][y]);
        for (let i = 0; i < 4; i++) {
          segmentationMap[xy_to_i(x, y)+i] = image[xy_to_i(x, y)+i];
        }
    }
  }

  return new ImageData(segmentationMap, width, height);
}