
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
  
    return await navigator.mediaDevices.getUserMedia({
      // audio: {"echoCancellation": true},
      video: videoConstraints,
    });
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
      if (step === 0) {
        background = ctx.getImageData(0, 0, w, h);
      }
      var l = frame.data.length / 4;


      for (var i = 0; i < l; i++) {

        let r = Math.abs(background.data[i * 4 + 0] - frame.data[i * 4 + 0])
        let g = Math.abs(background.data[i * 4 + 1] - frame.data[i * 4 + 1])
        let b = Math.abs(background.data[i * 4 + 2] - frame.data[i * 4 + 2])

        const bg = (background.data[i * 4 + 0] + background.data[i * 4 + 1] + background.data[i * 4 + 2]) / 3;
        const grey = (frame.data[i * 4 + 0] + frame.data[i * 4 + 1] + frame.data[i * 4 + 2]) / 3;

        if(r + g + b > 100) {
        
        frame.data[i * 4 + 0] = 255;
        frame.data[i * 4 + 1] = 0;
        frame.data[i * 4 + 2] = 0;
        }
        else {
          if (step % 1 == 0 && (r + b + g > 200)) {
            background.data[i * 4 + 0] = frame.data[i * 4 + 0];
            background.data[i * 4 + 1] = frame.data[i * 4 + 1];
            background.data[i * 4 + 2] = frame.data[i * 4 + 2];
          }

          frame.data[i * 4 + 0] = 0;
          frame.data[i * 4 + 1] = 0;
          frame.data[i * 4 + 2] = 0;
        }
        

      }

      ctx.putImageData(frame, 0, 0);
      
      step++;

    }

    setInterval(draw, 1000/20);
  }
