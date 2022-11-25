// getting dom elements
const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');

//function to acces the webcam and get the video stream in video element
function getVideo () {
    navigator.mediaDevices.getUserMedia({video: true, audio: false})
    .then (localMediaStream => {
        console.log(localMediaStream);
        video.srcObject = localMediaStream;
        video.play();

    }).catch (err=> {
        console.error("open the camera",err)
        alert("open the camera",err)
    })
}
//painting the video to our canvas element

function paintToCanvas () {
    const width = video.videoWidth;
    const height = video.videoHeight;
    canvas.width = width;
    canvas.height = height;

    setInterval(()=>{
        ctx.drawImage(video,0,0,width,height)
        //getting pixels for after effects
        let pixels = ctx.getImageData(0,0,width,height);
        // console.log(pixels)
        //APplying effects
        // console.log(pixels.data[1] + " before calling redeffect")
        // pixels = redEffect(pixels);
        // pixels = rgbSlpit(pixels)
        // ctx.globalAlpha = 0.1;
        // console.log(pixels.data[1]+" after calling redeffect")
        //putting them back
        // const imageData =pixels;

        pixels = greenScreen(pixels);

        ctx.putImageData(pixels,0,0);
        // console.log(pixels.data[1] + " after putting in context calling redeffect")
        // debugger;


    },16);
}

//funtion to lay sap sound and take photo;

function takePhoto () {
    snap.currentTime = 0;
    snap.play()

    //taking pictures
    const data = canvas.toDataURL("image/jpeg")
    // console.log(data)
    //a is anchor attribute
    const link = document.createElement("a");
    link.href = data;
    link.setAttribute("download", "handsome");
    // link.textContent = "Download";
    link.innerHTML = `<img src="${data}" alt="manMan Man"/>`
    strip.insertBefore(link, strip.firsChild);



}

function redEffect (pixels){
    // console.log(pixels.data[1]+" inside redeffect")
    for (let i = 0; i<pixels.data.length; i+=4){
        pixels.data[i + 0] =  pixels.data[i + 0] + 123 ;  // red
        pixels.data[i + 1] =  pixels.data[i + 1] - 33;    // green
        pixels.data[i + 2] =  pixels.data[i + 2] * 0.5;   // blue
        // pixels[i + 3] //alpha 
    }
    // console.log(pixels.data[1]+" inside redeffect after loop")
    return pixels;
}

function rgbSlpit (pixels){
    // console.log(pixels.data[1]+" inside redeffect")
    for (let i = 0; i<pixels.data.length; i+=4){
        pixels.data[i - 150] =  pixels.data[i + 0];  // red
        pixels.data[i + 100] =  pixels.data[i + 1];    // green
        pixels.data[i - 150] =  pixels.data[i + 2];   // blue
        // pixels[i + 3] //alpha 
    }
    // console.log(pixels.data[1]+" inside redeffect after loop")
    return pixels;
}

function greenScreen(pixels) {
    const levels = {};
  
    document.querySelectorAll('.rgb input').forEach((input) => {
      levels[input.name] = input.value;
    });
   console.log(levels)
    for (i = 0; i < pixels.data.length; i = i + 4) {
      red = pixels.data[i + 0];
      green = pixels.data[i + 1];
      blue = pixels.data[i + 2];
      alpha = pixels.data[i + 3];
  
      if (red >= levels.rmin
        && green >= levels.gmin
        && blue >= levels.bmin
        && red <= levels.rmax
        && green <= levels.gmax
        && blue <= levels.bmax) {
        // take it out!
        pixels.data[i + 3] = 0;
      }
    }
  
    return pixels;
  }


//calling functions
getVideo();
//event listner prints to canvas as soon as video is played 
video.addEventListener("canplay", paintToCanvas)