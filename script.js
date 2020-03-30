window.onload = init;
let canvas,context,imageHeight,imageWidth,maxIters,xMininum,yMinimum,scaleFactor;

const colorMap = [
  "66,30,15",
  "25,7,26",
  "9,1,47",
  "4,4,73",
  "0,7,100",
  "12,44,138",
  "24,82,177",
  "57,125,209",
  "134,181,229",
  "211, 236, 248",
  "241, 233, 191",
  "248, 201, 95",
  "255, 170, 0",
  "204, 128, 0",
  "153, 87, 0",
  "106, 52, 3"
];

function init(){
  canvas = document.getElementById("MandelCanv");
  canvas.addEventListener("mousedown",mouseClickHandler)
  context = canvas.getContext("2d");

  imageHeight = canvas.height;
  imageWidth = canvas.width;

  xCent = -0.5; //-0.5
  yCent = 0; //0

  scaleFactor = 400;

  maxIters = 200;
  draw();
}

function xyToComplex(x,y){
  return [xCent+(x-imageWidth/2)/scaleFactor,yCent+(-y+imageHeight/2)/scaleFactor];
}

function mouseClickHandler(event){
  //Update center
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  xCent = xyToComplex(mouseX,mouseY)[0];
  yCent = xyToComplex(mouseX,mouseY)[1];

  scaleFactor *= 1.5;
  draw();

  let infoBox = document.getElementById("infoBox");
  infoBox.innerHTML = `<br> Your location! <br> x center: ${xCent} <br> y center: ${yCent} <br> scale: ${scaleFactor}`;
}

function draw(){
  context.fillStyle = "black"
  context.fillRect(0,0,imageWidth,imageHeight)
  for(let y = 0; y < imageHeight; y++){
    for(let x = 0; x < imageWidth; x++){
      let cX = xyToComplex(x,y)[0];
      let cY = xyToComplex(x,y)[1];

      let iterations = findIterations(cX, cY, maxIters);
      let num = Math.sin(iterations);
      //coloring c:
      let hue = scale(num,-1,1,360,0);
      let sat = '100%';
      let light = '40%';

      let rgb = colorMap[Math.floor(scale(num,-1,1,0,15))];
      if(iterations >= maxIters || iterations <= 0){
        rgb = "0,0,0"
        light = "0%";
      }

      context.fillStyle = `hsl(${hue},${sat},${light})`;
      context.fillStyle = `rgb(${rgb})`
      context.fillRect(x,y,1,1);
    }
  }
}

function findIterations(centX,centY,maxIters){
  let i = 0;
  let zR = 0, zI = 0;
  while(i < maxIters && Math.pow(zR,2) + Math.pow(zI,2) < 4){
    tempVal = Math.pow(zR,2) - Math.pow(zI,2) + centX;
    zI = 2 * zR * zI + centY;
    zR = tempVal;
    i++;
  }
  if(i == maxIters){
    return i;
  }else{
    return (i + 1) - Math.log2(Math.log2(Math.sqrt(Math.pow(zR,2)+Math.pow(zI,2))) / Math.log(2));
  };
}

//Maps a given number from its range to some other range
const scale = (num, in_min, in_max, out_min, out_max) => {
  return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}
