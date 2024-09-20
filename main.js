let alarmSound = document.getElementById("alarmSound");
let equationBox = document.getElementById("equationBox");
let equationProblem = document.getElementById("equationProblem");
let equationAnswer = document.getElementById("equationAnswer");
let resultMessage = document.getElementById("resultMessage");

let correctAnswer = ''; // To store the correct answer to the equation
const problems = [
    { equation: "dy/dx = 2x", answer: "x^2 + C" },
    { equation: "dy/dx = 3", answer: "3x + C" },
    { equation: "dy/dx = -4y", answer: "Ce^(-4x)" },
    { equation: "dy/dx = x^2", answer: "x^3/3 + C" },
    { equation: "d^2y/dx^2 = 6x", answer: "x^3 + Cx + D" },
    { equation: "dy/dx = sin(x)", answer: "-cos(x) + C" },
    { equation: "dy/dx = e^x", answer: "e^x + C" },
    { equation: "dy/dx = 1/x", answer: "ln|x| + C" },
    { equation: "dy/dx = cos(x)", answer: "sin(x) + C" },
    { equation: "dy/dx = 5x", answer: "5x^2/2 + C" },
    { equation: "dy/dx = x^2 + 2x", answer: "x^3/3 + x^2 + C" },
    { equation: "dy/dx = tan(x)", answer: "-ln|cos(x)| + C" },
    { equation: "dy/dx = 7", answer: "7x + C" },
    { equation: "dy/dx = 1/(1 + x^2)", answer: "arctan(x) + C" },
    { equation: "dy/dx = sec^2(x)", answer: "tan(x) + C" }
  ];
  
// Register the service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js')
    .then(reg => console.log('Service Worker registered!', reg))
    .catch(err => console.log('Service Worker registration failed', err));
}

// Request notification permission
  Notification.requestPermission().then(permission => {
    if (permission !== 'granted') {
      alert('You need to allow notifications for the alarm to work.');
    }
  
});

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
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    navigator.serviceWorker.ready.then(registration => {
      setTimeout(() => {
        registration.showNotification('Alarm Clock', {
          body: called,
          icon: 'alarm-icon.png',  // Replace with your icon
          actions: [{action: 'playSound', title: 'Play Alarm'}]
        });

        // Show the equation problem and play the sound when alarm triggers
        showEquationProblem();
        playAlarmSound();

      }, timeInMs); // Time in milliseconds until alarm
    });
  }
}

function playAlarmSound() {
  alarmSound.play();
}

// Generate a differential equation problem
function showEquationProblem() {
  equationBox.style.display = "block"; // Show the problem box

  // Simple differential equation: dy/dx = 2x (solution: y = x^2 + C)
  const randomProblemIndex = Math.floor(Math.random() * problems.length);
  const selectedProblem = problems[randomProblemIndex];

  // Display the problem
  document.getElementById("equationProblem").innerHTML = selectedProblem.equation;

  // Store the correct answer for later verification
  window.currentAnswer = selectedProblem.answer;
}

// Check if the user's answer is correct
function checkAnswer() {
    const userAnswer = document.getElementById("equationAnswer").value;
  
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
