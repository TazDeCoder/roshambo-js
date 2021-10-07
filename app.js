"use scrict";

// Selecting elements
// Buttons
const [rockBtn, paperBtn, scissorsBtn] = document
  .querySelector("#btn--hands")
  .getElementsByClassName("btn");
const throwBtn = document.querySelector("#btn--throw");
const resetBtn = document.querySelector("#btn--reset");
const closeBtn = document.querySelector("#btn--close");
// General elements
const gameEl = document.querySelector("#game--label");
const name0El = document.querySelector("#name--0");
const score0El = document.querySelector("#score--0");
const score1El = document.querySelector("#score--1");
const hand0El = document.querySelector("#hand--0");
const hand1El = document.querySelector("#hand--1");
// Effects
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");

// Initial variables
let playerName, currentHand;

const game = {
  playerHand1: rockBtn.value,
  playerHand2: rockBtn.value,
  scores: {
    player: 0,
    computer: 0,
  },
  rounds: 5,
  flag: true,
};

function init() {
  // Reset game values
  game.playerHand1 = rockBtn.value;
  game.playerHand2 = rockBtn.value;
  game.scores.player = 0;
  game.scores.computer = 0;
  game.flag = true;
  currentHand = rockBtn;
  // Clean-up GUI
  currentHand.classList.add("btn--active");
  paperBtn.classList.remove("btn--active");
  scissorsBtn.classList.remove("btn--active");
  hand1El.classList.add("invisible");
  gameEl.classList.remove("invisible");
  gameEl.textContent = "Select an Element!";
  gameEl.style.color = "#000;";
  score0El.textContent = game.scores.player;
  score1El.textContent = game.scores.computer;
  throwBtn.textContent = `Throw 👋 ${currentHand.textContent}!`;
}

function loadGame() {
  // Needs to only run once when the app is open
  playerName = prompt("Ready!? Enter Player Name: ");
  if (!playerName) return alert("MUST SPEICFY NAME!");
  name0El.textContent = playerName;
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
}

function handButtonPressed(self) {
  game.playerHand1 = self.value;
  self.classList.toggle("btn--active");
  currentHand.classList.toggle("btn--active");
  currentHand = self;
  replaceHands(game.playerHand1);
  throwBtn.textContent = `Throw 👋 ${currentHand.textContent}!`;
}

function generateHand() {
  // Generates a hand for the CPU
  const hands = ["rock", "paper", "scissors"];
  const index = Math.floor(Math.random() * hands.length);
  return hands[index];
}

function replaceHands(hand) {
  // Replaces current hand with one (argument) that is passed
  hand0El.src = `./assets/images/${hand}-right.png`;
  hand1El.classList.add("invisible");
}

function displayHands() {
  game.playerHand2 = generateHand();
  hand1El.src = `./assets/images/${game.playerHand2}-left.png`;
  hand1El.classList.remove("invisible");
}

function workoutRoundWinner() {
  // Checks if player 1 hand matches player 2
  if (game.playerHand1 === game.playerHand2) {
    gameEl.textContent = "This Round is a Draw!";
    // Checks if player 1 beats player 2
  } else if (
    (game.playerHand1 === "rock" && game.playerHand2 === "scissors") ||
    (game.playerHand1 === "scissors" && game.playerHand2 === "paper") ||
    (game.playerHand1 === "paper" && game.playerHand2 === "rock")
  ) {
    gameEl.textContent = `${playerName} Wins This Round!`;
    game.scores.player += 1;
    score0El.textContent = game.scores.player;

    // Or otherwise, player 2 beats player 1
  } else {
    gameEl.textContent = "CPU Wins This Round!";
    game.scores.computer += 1;
    score1El.textContent = game.scores.computer;
  }
}

function workoutMatchWinner() {
  if (game.scores.player === game.rounds) {
    gameEl.textContent = `${playerName} Wins 🏆!`;
    game.flag = false;
  } else if (game.scores.computer === game.rounds) {
    gameEl.textContent = "CPU Wins 🤖!";
    game.flag = false;
  }
}

// Button functionalities
// Handles hand button events
rockBtn.addEventListener("click", function () {
  if (game.flag) handButtonPressed(this);
});
rockBtn.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    if (game.flag) {
      displayHands();
      workoutRoundWinner();
      workoutMatchWinner();
    }
  }
});
paperBtn.addEventListener("click", function () {
  if (game.flag) handButtonPressed(this);
});
paperBtn.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    if (game.flag) {
      displayHands();
      workoutRoundWinner();
      workoutMatchWinner();
    }
  }
});
scissorsBtn.addEventListener("click", function () {
  if (game.flag) handButtonPressed(this);
});
scissorsBtn.addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    if (game.flag) {
      displayHands();
      workoutRoundWinner();
      workoutMatchWinner();
    }
  }
});

throwBtn.addEventListener("click", function () {
  if (game.flag) {
    displayHands();
    workoutRoundWinner();
    workoutMatchWinner();
  }
});

// document.addEventListener("keydown", function (e) {
//   if (e.key === "Enter") {
//     if (game.flag) {
//       displayHands();
//       workoutRoundWinner();
//       workoutMatchWinner();
//     }
//   }
// });

resetBtn.addEventListener("click", init);
closeBtn.addEventListener("click", loadGame);
overlay.addEventListener("click", loadGame);

// Main code execution
init();
