let video;
let poseNet;

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.hide();
  poseNet = ml5.poseNet(video, modelReady);
  // poseNet.on("pose", gotPoses);
}

function modelReady() {
  console.log("Model Loaded!");
}

function draw() {
  image(video, 0, 0);
}
