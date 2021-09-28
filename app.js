"use scrict";

// Selecting elements
const rockBtn = document.querySelector("#btn--rock");
const paperBtn = document.querySelector("#btn--paper");
const scissorsBtn = document.querySelector("#btn--scissors");
const throwBtn = document.querySelector("#btn--throw");
const resetBtn = document.querySelector("#btn--reset");

const gameLbl = document.querySelector("#game--label");

const hand0El = document.querySelector("#hand--0");
const hand1El = document.querySelector("#hand--1");

function generateHand() {
  const hands = ["rock", "paper", "scissors"];
  const index = Math.floor(Math.random() * hands.length);
  return hands[index];
}

// Initial conditions
let playerHand1, playerHand2, scores, rounds, flag;

function init() {
  rounds = 3;
  scores = [0, 0];
  playerHand1 = "rock";
  flag = true;

  rockBtn.classList.add("btn--active");
  paperBtn.classList.remove("btn--active");
  scissorsBtn.classList.remove("btn--active");
  hand0El.classList.add("invisible");
  hand1El.classList.add("invisible");
  gameLbl.textContent = "";
  throwBtn.textContent = "Throw! 👋🧱";
}

init();

// Button functionalies
rockBtn.addEventListener("click", function () {
  if (flag) {
    playerHand1 = "rock";
    rockBtn.classList.add("btn--active");
    paperBtn.classList.remove("btn--active");
    scissorsBtn.classList.remove("btn--active");
    hand0El.src = `./assets/images/${playerHand1}-right.png`;
    hand0El.classList.add("invisible");
    hand1El.classList.add("invisible");
    throwBtn.textContent = "Throw! 👋🧱";
  }
});
paperBtn.addEventListener("click", function () {
  if (flag) {
    playerHand1 = "paper";
    paperBtn.classList.add("btn--active");
    rockBtn.classList.remove("btn--active");
    scissorsBtn.classList.remove("btn--active");
    hand0El.src = `./assets/images/${playerHand1}-right.png`;
    hand0El.classList.add("invisible");
    hand1El.classList.add("invisible");
    throwBtn.textContent = "Throw! 👋📰";
  }
});
scissorsBtn.addEventListener("click", function () {
  if (flag) {
    playerHand1 = "scissors";
    scissorsBtn.classList.add("btn--active");
    paperBtn.classList.remove("btn--active");
    rockBtn.classList.remove("btn--active");
    hand0El.src = `./assets/images/${playerHand1}-right.png`;
    hand0El.classList.add("invisible");
    hand1El.classList.add("invisible");
    throwBtn.textContent = "Throw! 👋✂";
  }
});
throwBtn.addEventListener("click", function () {
  if (flag) {
    playerHand2 = generateHand();
    hand1El.src = `./assets/images/${playerHand2}-left.png`;
    hand1El.classList.remove("invisible");
    hand0El.classList.remove("invisible");

    if (
      (playerHand1 === "rock" && playerHand2 === "scissors") ||
      (playerHand1 === "paper" && playerHand2 === "rock") ||
      (playerHand1 === "scissors" && playerHand2 === "paper")
    ) {
      gameLbl.textContent = "Player Wins This Round!";
      scores[0] += 1;
    } else if (playerHand1 === playerHand2) {
      gameLbl.textContent = "This Round is a Draw!";
    } else {
      gameLbl.textContent = "CPU Wins This Round!";
      scores[1] += 1;
    }

    if (scores[0] === rounds) {
      gameLbl.textContent = "Player Wins 🧑!";
      flag = false;
    } else if (scores[1] === rounds) {
      gameLbl.textContent = "CPU Wins 🤖!";
      flag = false;
    }

    console.log(scores);
  }
});
resetBtn.addEventListener("click", init);
