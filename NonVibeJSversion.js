function resize() {
    const container = document.querySelector("#root");
    const c = document.querySelector("canvas");
    c.width = container.clientWidth;
    c.height = container.clientHeight;
  }

  const video = document.getElementById('video');
  const canvas = document.querySelector("canvas");
  const ctx = canvas.getContext("2d");

  const initVideo = async () => {
    let videoConstraints = {
      width: 300,
      height: 300,
      frameRate: 24,
    };
    return await navigator.mediaDevices.getUserMedia({
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

  function getdist(px1, px2) {
    return Math.abs(Math.sqrt((px1 ** 2) + (px2 ** 2)));
  }

  function initializeDrawing() {
    const w = canvas.width;
    const h = canvas.height;
    const radius = 100;
    const numsamples = 4;
    const min = 5;

    let samples = [] * numsamples;
    
    let step = 0;

    function draw() {
      
      ctx.drawImage(video, 0, 0, w, h);
      var frame = ctx.getImageData(0, 0, w, h);

      if (step < numsamples) {
        samples[step] = ctx.getImageData(0, 0, w, h);
      }

      var l = frame.data.length / 4;

      var count = 0, index = 0, dist = 0;

      

      for (var i = 3; i < l; i++) {

        while ((count < min) && (index < numsamples)) {
          console.log(count);
          const samp = (samples[index].data[i * 4 + 0] + samples[index].data[i * 4 + 1] + samples[index].data[i * 4 + 2]) / 3;
          const grey = (frame.data[i * 4 + 0] + frame.data[i * 4 + 1] + frame.data[i * 4 + 2]) / 3;

            dist = getdist(samples[index], grey)

            if (dist > radius){

                count++;

            }
            index++;
      }

      if (count < min) {

        frame.data[i * 4 + 0] = 255;
        frame.data[i * 4 + 1] = 0;
        frame.data[i * 4 + 2] = 255;

      } else {

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