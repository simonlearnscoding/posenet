let video;
let poseNet;
let pose;
let skeleton;
function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.hide();
  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on("pose", gotPoses);

  let options = {
    // inputs: ___,
    // outputs: ___,
    // task: ___,
    // debug: ___,
  };
  brain = ml5.neuralNetwork(options);
  function gotPoses(poses) {
    console.log(poses);
    if (poses.length > 0) {
      pose = poses[0].pose;
      skeleton = poses[0].skeleton;
    }
  }

  function modelLoaded() {
    console.log("Model Loaded!");
  }

  function drw() {
    image(video, 0, 0);
    fill(255, 0, 0);
    if (pose) {
      for (let i = 0; i < pose.keypoints.length; i++) {
        let x = pose.keypoints[i].position.x;
        let y = pose.keypoints[i].position.y;
        ellipse(x, y, 16, 16);
      }
      for (let i = 0; i < skeleton.length; i++) {
        a = skeleton[i][0];
        b = skeleton[i][1];
        line(a.position.x, a.position.y, b.position.x, b.position.y);
      }
    }
  }
}
