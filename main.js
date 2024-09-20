let alarmSound = document.getElementById("alarmSound");
let equationBox = document.getElementById("equationBox");
let equationProblem = document.getElementById("equationProblem");
let equationAnswer = document.getElementById("equationAnswer");
let resultMessage = document.getElementById("resultMessage");

let correctAnswer = ''; // To store the correct answer to the equation

  
// Register the service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js')
    .then(reg => console.log('Service Worker registered!', reg))
    .catch(err => console.log('Service Worker registration failed', err));
}

// Request notification permission
Notify.requestPermission(onPermissionGranted, onPermissionDenied);


function onPermissionGranted() {
    console.log('Permission has been granted by the user');
}

function onPermissionDenied() {
    console.warn('Permission has been denied by the user');
}

function setAlarm() {
  const alarmInput = document.getElementById("alarmTime").value;

  if (!alarmInput) {
    alert("Please select a valid time.");
    return;
  }

  const now = new Date();
  const alarmTime = new Date(alarmInput);
  
  if (alarmTime < now) {
    alert("The alarm time is in the past! Please select a future time.");
    return;
  }
  var name = prompt("Choose a name for the alarm.")
  const timeUntilAlarm = alarmTime - now;

  alert(`Alarm set for ${alarmInput}`);

  // Schedule alarm with service worker notification
  scheduleAlarm(timeUntilAlarm, name);
}

function scheduleAlarm(timeInMs, called) {
    var noti = new Notify( called, {
        body: 'Click me to turn off.',
        notifyShow: playAlarmSound
    });
}

function playAlarmSound() {
  alarmSound.play();
  showEquationProblem();
}

// Generate a differential equation problem
function showEquationProblem() {
  equationBox.style.display = "block"; // Show the problem box

  // Simple differential equation: dy/dx = 2x (solution: y = x^2 + C)
  const a = Math.floor(Math.random()* 100);
  const b = Math.floor(Math.random()* 100);

  // Display the problem
  document.getElementById("equationProblem").innerHTML = a + " * " + b;

  // Store the correct answer for later verification
  window.currentAnswer = a*b;
}

// Check if the user's answer is correct
function checkAnswer() {
    const userAnswer = ParseInt(document.getElementById("equationAnswer").value);
  
    if (userAnswer.trim() === window.currentAnswer) {
      document.getElementById("resultMessage").innerHTML = "Correct! Alarm stopped.";
      document.getElementById("alarmSound").pause();
    } else {
      document.getElementById("resultMessage").innerHTML = "Incorrect! Try again.";
    }
  }
// Stop the alarm sound and hide the problem box
function stopAlarm() {
  alarmSound.pause();
  alarmSound.currentTime = 0;
  equationBox.style.display = "none";
}
