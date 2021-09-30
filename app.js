"use scrict";

// Selecting elements
// Buttons
const rockBtn = document.querySelector("#btn--rock");
const paperBtn = document.querySelector("#btn--paper");
const scissorsBtn = document.querySelector("#btn--scissors");
const throwBtn = document.querySelector("#btn--throw");
const resetBtn = document.querySelector("#btn--reset");
const closeBtn = document.querySelector("#btn--close");
// Labels
const gameLbl = document.querySelector("#game--label");
// General elements
const name0El = document.querySelector("#name--0");
const name1El = document.querySelector("#name--1");
const score0El = document.querySelector("#score--0");
const score1El = document.querySelector("#score--1");
const hand0El = document.querySelector("#hand--0");
const hand1El = document.querySelector("#hand--1");
// Classes
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");

// Initial variables
let scores, rounds, playerName1, playerHand1, playerHand2, flag;

function init() {
  // Reset game values
  rounds = 5;
  scores = [0, 0];
  playerHand1 = "rock";
  playerHand2 = "rock";
  flag = true;
  // Clean-up GUI
  rockBtn.classList.add("btn--active");
  paperBtn.classList.remove("btn--active");
  scissorsBtn.classList.remove("btn--active");
  hand0El.classList.add("invisible");
  hand1El.classList.add("invisible");
  gameLbl.classList.remove("invisible");
  gameLbl.textContent = "Select an Element!";
  score0El.textContent = "0";
  score1El.textContent = "0";
  throwBtn.textContent = "Throw! 👋🧱";
}

function loadGame() {
  playerName1 = prompt("Ready!? Enter Player 1 Name: ");
  playerName2 = "CPU";
  if (playerName1 === null) return;
  name0El.textContent = playerName1;
  name0El.style.color = "#f00";
  name1El.textContent = playerName2;
  name1El.style.color = "#00f";
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
}

function generateHand() {
  const hands = ["rock", "paper", "scissors"];
  const index = Math.floor(Math.random() * hands.length);
  return hands[index];
}

function displayHand(hand) {
  hand0El.src = `./assets/images/${hand}-right.png`;
  hand0El.classList.add("invisible");
  hand1El.classList.add("invisible");
}

// Button functionalities
rockBtn.addEventListener("click", function () {
  if (flag) {
    playerHand1 = "rock";
    rockBtn.classList.add("btn--active");
    paperBtn.classList.remove("btn--active");
    scissorsBtn.classList.remove("btn--active");
    displayHand(playerHand1);
    throwBtn.textContent = "Throw! 👋🧱";
  }
});
paperBtn.addEventListener("click", function () {
  if (flag) {
    playerHand1 = "paper";
    paperBtn.classList.add("btn--active");
    rockBtn.classList.remove("btn--active");
    scissorsBtn.classList.remove("btn--active");
    displayHand(playerHand1);
    throwBtn.textContent = "Throw! 👋📰";
  }
});
scissorsBtn.addEventListener("click", function () {
  if (flag) {
    playerHand1 = "scissors";
    scissorsBtn.classList.add("btn--active");
    paperBtn.classList.remove("btn--active");
    rockBtn.classList.remove("btn--active");
    displayHand(playerHand1);
    throwBtn.textContent = "Throw! 👋✂";
  }
});
throwBtn.addEventListener("click", function () {
  if (flag) {
    playerHand2 = generateHand();
    hand1El.src = `./assets/images/${playerHand2}-left.png`;
    hand1El.classList.remove("invisible");
    hand0El.classList.remove("invisible");

    // Checks if player 1 hand matches player 2
    if (playerHand1 === playerHand2) {
      gameLbl.textContent = "This Round is a Draw!";
      // Checks if player 1 beats player 2
    } else if (
      (playerHand1 === "rock" && playerHand2 === "scissors") ||
      (playerHand1 === "scissors" && playerHand2 === "paper") ||
      (playerHand1 === "paper" && playerHand2 === "rock")
    ) {
      gameLbl.textContent = `${playerName1} Wins This Round!`;
      scores[0] += 1;
      score0El.textContent = scores[0];
      // Or otherwise, player 2 beats player 1
    } else {
      gameLbl.textContent = `${playerName2} Wins This Round!`;
      scores[1] += 1;
      score1El.textContent = scores[1];
    }

    if (scores[0] === rounds) {
      gameLbl.textContent = `${playerName1} Wins 🧑!`;
      flag = false;
    } else if (scores[1] === rounds) {
      gameLbl.textContent = `${playerName2} Wins 🤖!`;
      flag = false;
    }

    // console.log(scores);
  }
});
resetBtn.addEventListener("click", init);
closeBtn.addEventListener("click", loadGame);
overlay.addEventListener("click", loadGame);

// Main code execution
init();
