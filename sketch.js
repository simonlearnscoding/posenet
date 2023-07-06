let video;
let poseNet;
let pose;
let skeleton;
let brain;

let state = "waiting";
let targetLabel;

function keyPressed() {
  if (key == "s") {
    brain.saveData();
  } else {
    targetLabel = key;
    consol.log(targetLabel);
    setTimeout(function() {
      console.log("collecting");
      state = "collecting";
      setTimeout(function() {
        console.log("not collecting");
        state = "waiting";
      }, 10000);
    }, 10000);
  }
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.hide();
  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on("pose", gotPoses);
}

let options = {
  input: 34,
  outputs: 4,
  task: "classification",
  debug: true,
};
brain = ml5.neuralNetwork(options);
brain.loadData("ymca.json");

function dataReady() {
  brain.normalizeData();
  brain.train({ epochs: 50 }, finished);
}

function finished() {
  console.log("model trained");
  brain.save();
}

function gotPoses(poses) {
  console.log(poses);
  if (poses.length > 0) {
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
    //if (state == 'collecting')
    let inputs = [];
    for (let i = 0; i < pose.keypoints.length; i++) {
      let x = pose.keypoints[i].position.x;
      let y = pose.keypoints[i].position.y;
      inputs.push(x);
      inputs.push(y); //Haut alle x und y Wert in ein Array namens input
    }
    let target = [targetLabel];

    brain.addData(inputs, target);
  }
}

function modelLoaded() {
  console.log("Model Loaded!");
}

function draw() {
  translate(video.width, 0);
  scale(-1, 1);
  image(video, 0, 0, video.width, video.height);

  if (pose) {
    let eyeR = pose.rightEye;
    let eyeL = pose.leftEye;
    let d = dist(eyeR.x, eyeR.y, eyeL.x, eyeL.y);

    for (let i = 0; i < pose.keypoints.length; i++) {
      let x = pose.keypoints[i].position.x;
      let y = pose.keypoints[i].position.y;
      fill(255, 0, 0);
      ellipse(x, y, 16, 16);
    }

    for (let i = 0; i < skeleton.length; i++) {
      let a = skeleton[i][0];
      let b = skeleton[i][1];
      strokeWeight(2);
      stroke(0, 0, 255);
      line(a.position.x, a.position.y, b.position.x, b.position.y);
    }
  }
}

//Test

