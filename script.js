import { vibe } from "./vibe.js";


function resize() {
  const container = document.querySelector("#root");
  const c = document.querySelector("canvas");
  c.width = container.clientWidth;
  c.height = container.clientHeight;
}

// resize();
const video = document.getElementById('video');
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const initVideo = async () => {
  let videoConstraints = {
    width: 1000,
    height: 1000, 
    frameRate: 30,
  };

  // let videoConstraints = {width: 360, frameRate: 20};

  const mediaDevices = await navigator.mediaDevices.getUserMedia({
    // audio: {"echoCancellation": true},
    video: videoConstraints,
  });

  console.log(mediaDevices);

  return mediaDevices;
}

(async () => {
  const stream = await initVideo();
  video.srcObject = stream;
  setTimeout(() => {
    const { width, height } = video.getBoundingClientRect();
    canvas.width = width;
    canvas.height = height;
    initializeDrawing();
  },
     2000)
})()

function initializeDrawing() {
  const w = canvas.width;
  const h = canvas.height;

  let background = undefined;
  let step = 0;
  function draw() {
    // save the first few video frames here
    ctx.drawImage(video, 0, 0, w, h);
    var frame = ctx.getImageData(0, 0, w, h);

    if (step < 2) {
      background = frame.data;
      ctx.putImageData(frame, 0, 0);
    } else {
      const vibed = vibe(frame, background);
      ctx.putImageData(vibed, 0, 0);
    }

    
    step++;

  }

  setInterval(draw, 1000);
}
