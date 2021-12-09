
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
      width: 100,
      height: 100, 
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
      // save the first video frame here
      ctx.drawImage(video, 0, 0, w, h);
      var frame = ctx.getImageData(0, 0, w, h);
      if (step === 0) {
        background = ctx.getImageData(0, 0, w, h);
      }
      var l = frame.data.length / 4;
      
      bgmax = background;
      bgmin = background;

      var rmax = 0;
      var gmax = 0;
      var bmax = 0;


      for (var i = 0; i < l; i++) {

        const bg = (background.data[i * 4 + 0] + background.data[i * 4 + 1] + background.data[i * 4 + 2]) / 3;
        const grey = (frame.data[i * 4 + 0] + frame.data[i * 4 + 1] + frame.data[i * 4 + 2]) / 3;

        var r = frame.data[i * 4 + 0]
        var g = frame.data[i * 4 + 1]
        var b = frame.data[i * 4 + 2]

        rmax = bgmax.data[i * 4 + 0]
        bmax = bgmax.data[i * 4 + 1]
        gmax = bgmax.data[i * 4 + 2]

        rmin = bgmin.data[i * 4 + 0]
        bmin = bgmin.data[i * 4 + 1]
        gmin = bgmin.data[i * 4 + 2]

        if(step < 120) {
          if(r > rmax){
            rmax = frame.data[i * 4 + 0];
          }
          if(g > bmax){
            bmax = frame.data[i * 4 + 1];
          }
          if(b > gmax){
            gmax = frame.data[i * 4 + 2];
          }
          if(r < rmin){
            rmin = frame.data[i * 4 + 0];
          }
          if(g < bmin){
            bmin = frame.data[i * 4 + 1];
          }
          if(b < gmin){
            gmin = frame.data[i * 4 + 2];
          }
    
        } else {

          var r = frame.data[i * 4 + 0]
          var g = frame.data[i * 4 + 1]
          var b = frame.data[i * 4 + 2]

          if((r > rmax || b > bmax || g > gmax) || (r < rmin || b < bmin || g < gmin)) {
            
            frame.data[i * 4 + 0] = 255;
            frame.data[i * 4 + 1] = 0;
            frame.data[i * 4 + 2] = 0;

          } else {
            frame.data[i * 4 + 0] = 0;
            frame.data[i * 4 + 1] = 0;
            frame.data[i * 4 + 2] = 0;

          }

        }

      }

      ctx.putImageData(frame, 0, 0);
      
      step++;

    }

    setInterval(draw, 1000/20);
  }
