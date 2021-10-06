"use scrict";

// Selecting elements
// Buttons
const handBtns = document
  .querySelector("#btn--hands")
  .getElementsByClassName("btn");
const throwBtn = document.querySelector("#btn--throw");
const resetBtn = document.querySelector("#btn--reset");
const closeBtn = document.querySelector("#btn--close");
// General elements
const gameEl = document.querySelector("#game--label");
const name0El = document.querySelector("#name--0");
const name1El = document.querySelector("#name--1");
const score0El = document.querySelector("#score--0");
const score1El = document.querySelector("#score--1");
const hand0El = document.querySelector("#hand--0");
const hand1El = document.querySelector("#hand--1");
// Effects
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");

// Initial variables
const rounds = 5;
let scores, playerName, playerHand1, playerHand2, currentHand, gameFlag;

function init() {
  // Reset game values
  scores = {
    player: 0,
    computer: 0,
  };
  playerHand1 = handBtns[0].value;
  playerHand2 = handBtns[0].value;
  currentHand = handBtns[0];
  gameFlag = true;
  // Clean-up GUI
  currentHand.classList.add("btn--active");
  handBtns[1].classList.remove("btn--active");
  handBtns[2].classList.remove("btn--active");
  hand0El.classList.add("invisible");
  hand1El.classList.add("invisible");
  gameEl.classList.remove("invisible");
  gameEl.textContent = "Select an Element!";
  score0El.textContent = "0";
  score1El.textContent = "0";
  throwBtn.textContent = `Throw 👋 ${currentHand.textContent}!`;
}

function loadGame() {
  // Needs to only run once when the app is open
  playerName = prompt("Ready!? Enter Player 1 Name: ");
  if (playerName === null) return;
  name0El.textContent = playerName;
  name1El.textContent = "CPU";
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
}

function generateHand() {
  // Generates a hand for the CPU
  const hands = ["rock", "paper", "scissors"];
  const index = Math.floor(Math.random() * hands.length);
  return hands[index];
}

function displayHands(hand) {
  // Replaces current hand with one (argument) that is passed
  hand0El.src = `./assets/images/${hand}-right.png`;
  hand0El.classList.add("invisible");
  hand1El.classList.add("invisible");
}

function handButtonPressed(self) {
  playerHand1 = self.value;
  self.classList.add("btn--active");
  currentHand.classList.remove("btn--active");
  currentHand = self;
  displayHands(playerHand1);
  throwBtn.textContent = `Throw 👋 ${currentHand.textContent}!`;
}

// Button functionalities
for (let i = 0; i < handBtns.length; i++) {
  // Handles hand button events
  handBtns[i].addEventListener("click", function () {
    console.log(this);
    if (gameFlag) handButtonPressed(this);
  });
}

throwBtn.addEventListener("click", function () {
  if (gameFlag) {
    playerHand2 = generateHand();
    hand1El.src = `./assets/images/${playerHand2}-left.png`;
    hand1El.classList.remove("invisible");
    hand0El.classList.remove("invisible");

    // Checks if player 1 hand matches player 2
    if (playerHand1 === playerHand2) {
      gameEl.textContent = "This Round is a Draw!";
      // Checks if player 1 beats player 2
    } else if (
      (playerHand1 === "rock" && playerHand2 === "scissors") ||
      (playerHand1 === "scissors" && playerHand2 === "paper") ||
      (playerHand1 === "paper" && playerHand2 === "rock")
    ) {
      gameEl.textContent = `${playerName} Wins This Round!`;
      scores.player += 1;
      score0El.textContent = scores.player;

      // Or otherwise, player 2 beats player 1
    } else {
      gameEl.textContent = "CPU Wins This Round!";
      scores.computer += 1;
      score1El.textContent = scores.computer;
    }

    if (scores.player === rounds) {
      gameEl.textContent = `${playerName} Wins 🏆!`;
      gameFlag = false;
    } else if (scores.computer === rounds) {
      gameEl.textContent = "CPU Wins 🤖!";
      gameFlag = false;
    }
  }
});

resetBtn.addEventListener("click", init);
closeBtn.addEventListener("click", loadGame);
overlay.addEventListener("click", loadGame);

// Main code execution
init();
