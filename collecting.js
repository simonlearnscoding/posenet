let video;
let poseNet;
let pose;
let skeleton;
let brain;

let state = "waiting"; //Statemachine wird initialisiert
let targetLabel;

function keyPressed() {
  if (key == "s") {
    brain.saveData();
  }
  if (key == "n") {
    // nach Drücken eines Buchstaben - ymca- 10 Sekunden warten und dann für 10 Sek Daten aufnehmen
    // ich habe diese function nach unten verlagert damits ein bisschen uebersichtlicher ist
    saveNewPose();
  }
}
// diese function nimmt einen String und zeigt ihn als text im Browser an
function displayText(text) {
  node = document.getElementById("text-display");
  node.innerText = text;
}
function saveNewPose() {
  displayText("enter a name for your pose");
  targetLabel = prompt("what should we call your pose?");
  console.log(targetLabel);
  displayText(`saving pose with the name ${targetLabel}`);
  setTimeout(function() {
    console.log("collecting...");
    displayText("collecting...");
    state = "collecting"; // Statemachine wird auf collecting gesetzt
    setTimeout(function() {
      console.log("not collecting");
      displayText(" Press n to record a new pose ");
      state = "waiting"; // Statemachine ist wieder auf waiting
    }, 10000);
  }, 10000);
}

function setup() {
  createCanvas(640, 480);
  video = createCapture(VIDEO);
  video.hide();
  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on("pose", gotPoses);

  let options = {
    input: 34, //für jedes Körperteil ->17 Werte jeweils x und y- Werte
    // ich verstehe das nicht, heisst das, dass insgesamt nur 4 output werte entstehen?
    // vielleicht sollten wir das dynamischer gestalten, falls wir mal andere koerperteile erfassen wollen
    outputs: 4, //Y M C A
    //
    task: "classification",
    debug: true,
  };
  brain = ml5.neuralNetwork(options);
  //brain.loadData("ymca.json", dataReady); // speichere die Werte in ein json Datei
}

function dataReady() {
  brain.normalizeData();
  brain.train({ epochs: 50 }, finished);
}

function finished() {
  console.log("model trained");
  brain.save();
}
// diese Function wird gecallt, wenn eine pose erkannt wird (die punkte)
// sie malt die punkte ins video
//
function gotPoses(poses) {
  //console.log(poses);
  if (poses.length > 0) {
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
    if (state == "collecting") {
      //Wenn Statemachine auf 'collecting', dann wird ein Array mit den Inputwerten erstellt
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
      ellipse(x, y, d / 2, d / 2);
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
