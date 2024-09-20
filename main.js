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
if (Notification.permission !== 'granted') {
  Notification.requestPermission().then(permission => {
    if (permission !== 'granted') {
      alert('You need to allow notifications for the alarm to work.');
    }
  });
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

  const timeUntilAlarm = alarmTime - now;

  alert(`Alarm set for ${alarmInput}`);

  // Schedule alarm with service worker notification
  scheduleAlarm(timeUntilAlarm);
}

function scheduleAlarm(timeInMs) {
  if ('serviceWorker' in navigator && 'PushManager' in window) {
    navigator.serviceWorker.ready.then(registration => {
      setTimeout(() => {
        registration.showNotification('Alarm Clock', {
          body: "Time's up! Solve the equation to stop the alarm.",
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
  equationProblem.innerHTML = "dy/dx = 2x. What is the solution for y in terms of x? (Ignore the constant)";
  correctAnswer = "x^2"; // This is the correct answer for y = x^2 + C
}

// Check if the user's answer is correct
function checkAnswer() {
  const userAnswer = equationAnswer.value.trim();

  if (userAnswer === correctAnswer) {
    resultMessage.innerHTML = "Correct! The alarm is now off.";
    stopAlarm();
  } else {
    resultMessage.innerHTML = "Incorrect! Try again.";
  }
}

// Stop the alarm sound and hide the problem box
function stopAlarm() {
  alarmSound.pause();
  alarmSound.currentTime = 0;
  equationBox.style.display = "none";
}
