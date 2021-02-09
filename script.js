window.onload = init;
let canvas,context,imageHeight,imageWidth,maxIters,xMininum,yMinimum,scaleFactor,rand;
let histMap = new Map();

const lerp = (x, y, a) => x * (1 - a) + y * a;
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
const juliaVals = [
  [0.285,0],
  [0.285,0.01],
  [0.45,0.1428],
  [-0.70176,-0.3842],
  [-0.835,-0.2321],
  [-0.8,0.156],
  [-0.7269,+ 0.1889],
  [0,-0.8]
];

function init(){
  canvas = document.getElementById("MandelCanv");
  canvas.addEventListener("mousedown",mouseClickHandler)
  context = canvas.getContext("2d");

  imageHeight = canvas.height;
  imageWidth = canvas.width;

  xCent = -0.5; //-0.5
  yCent = 0; //0

  scaleFactor = 200;

  maxIters = 80;
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
  let vals = [];
  context.fillStyle = "black"
  context.fillRect(0,0,imageWidth,imageHeight)
  rand = Math.floor(Math.random()*juliaVals.length);
  //First let's make a histogram for our colors
  for(let y = 0; y < imageHeight; y++){
    for(let x = 0; x < imageWidth; x++){
      //let cX = xyToComplex(x,y)[0];
      //let cY = xyToComplex(x,y)[1];
      //let iterations = mandelIterations(cX, cY, maxIters);
      let iterations = juliaSet(maxIters,x,y);
      vals[x+":"+y] = iterations;
      if(iterations < maxIters){
        let curr = histMap.get(iterations);
        histMap.set(Math.floor(iterations), (curr == undefined ? 1 : curr+1))
      };
    }
  }
  let tot = 0;
  for(const [key, val] of histMap.entries()){
    tot+=val
  }
  let hues = [], c = 0;
  for(let i = 0; i < maxIters; i++){
    c += (histMap.get(i) == undefined ? 0 : histMap.get(i)) / tot;
    hues.push(c);
  }
  hues.push(c);
  console.log(vals)

  for(let y = 0; y < imageHeight; y++){
    for(let x = 0; x < imageWidth; x++){
      //coloring c:
      let its = vals[x+":"+y];
      let h =  360-Math.floor(360 * lerp(hues[Math.floor(its)],hues[Math.ceil(its)], its%1));
      let sat = '100%';
      let light = its < maxIters ? '40%' : '0%';

      context.fillStyle = `hsl(${h},${sat},${light})`;
      context.fillRect(x,y,1,1);
    }
  }
}

function mandelIterations(centX,centY,max){
  let i = 0;
  let zR = 0, zI = 0;
  while(i < max && Math.pow(zR,2) + Math.pow(zI,2) < 4){
    tempVal = Math.pow(zR,2) - Math.pow(zI,2) + centX;
    zI = 2 * zR * zI + centY;
    zR = tempVal;
    i++;
  }
  if(i == max){
    return i;
  }else{
    return (i + 1) - Math.log2(Math.log2(Math.sqrt(Math.pow(zR,2)+Math.pow(zI,2))) / Math.log(2));
  };
}

function juliaSet(max,x,y){
  let i = 0;
  let escapeRad = 2;
  let zR = scale(x,0,imageWidth,-escapeRad,escapeRad);
  let zI = scale(y,0,imageHeight,-escapeRad,escapeRad);
  while(i < max && Math.pow(zR,2) + Math.pow(zI,2) < Math.pow(escapeRad,2)){
    tempVal = Math.pow(zR,2) - Math.pow(zI,2) + juliaVals[1][0];
    zI = 2 * zR * zI + juliaVals[1][1];
    zR = tempVal;
    i++;
  }
  if(i == max){
    return i;
  }else{
    return (i + 1) - Math.log2(Math.log2(Math.sqrt(Math.pow(zR,2)+Math.pow(zI,2))) / Math.log(2));
  };
}

//Maps a given number from its range to some other range
const scale = (num, in_min, in_max, out_min, out_max) => {
  return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}
