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


function setAlarm() {
  Notification.requestPermission().then(permission => {
    if (permission !== 'granted') {
      alert('You need to allow notifications for the alarm to work.');
      return;
    }
  
});
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

  // Schedule alarm with service worker notification
  scheduleAlarm(timeUntilAlarm, name);
}

function scheduleAlarm(timeInMs, called) {
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    
        setTimeout(()=> {
          if (Notification.permission === "granted") {

          const noti = new Notification(called);
          }
          showEquationProblem();
          playAlarmSound();
        }, timeInMs)
        // Show the equation problem and play the sound when alarm triggers

  }
}

function playAlarmSound() {
  alarmSound.play();
}

// Generate a differential equation problem
function showEquationProblem() {
  equationBox.style.display = "block"; // Show the problem box

  // Simple differential equation: dy/dx = 2x (solution: y = x^2 + C)
  const a = Math.floor(Math.random()* 100);
  const b = Math.floor(Math.random()* 10);

  // Display the problem
  document.getElementById("equationProblem").innerHTML = a + " * " + b;

  // Store the correct answer for later verification
  window.currentAnswer = a*b;
}

// Check if the user's answer is correct
function checkAnswer() {
    const userAnswer = document.getElementById("equationAnswer").value
  
    if (parseInt(userAnswer) ===window.currentAnswer) {
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
