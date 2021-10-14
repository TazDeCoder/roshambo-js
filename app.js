"use scrict";

// Selecting elements
// --- BUTTONS
const handBtns = document
  .querySelector("#btn--hands")
  .getElementsByClassName("btn");
const [rockBtn, paperBtn, scissorsBtn] = handBtns;
const throwBtn = document.querySelector("#btn--throw");
const resetBtn = document.querySelector("#btn--reset");
const closeBtn = document.querySelector("#btn--close");
// --- LABELS
const gameLbl = document.querySelector("#game--label");
const name0Lbl = document.querySelector("#name--0");
const score0Lbl = document.querySelector("#score--0");
const score1Lbl = document.querySelector("#score--1");
// ---IMAGES
const hand0Img = document.querySelector("#hand--0");
const hand1Img = document.querySelector("#hand--1");
// --- MISC.
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");

// Initial variables
let playerName, currentHand;

const game = {
  scores: {},
  rounds: 5,
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
  rockBtn.classList.add("btn--active");
  paperBtn.classList.remove("btn--active");
  scissorsBtn.classList.remove("btn--active");
  gameLbl.textContent = "Select an Element!";
  gameLbl.style.color = "#000";
  score0Lbl.textContent = game.scores.player;
  score1Lbl.textContent = game.scores.computer;
  hand1Img.src = `./assets/images/default-hand.png`;
  throwBtn.textContent = `Throw 👋 ${currentHand.textContent
    .slice(0, 15)
    .concat("(Enter)")}!`;
}

function loadGame() {
  (() => init())();
  // playerName = prompt("Ready!? Enter Player Name: ");
  // if (!playerName) return alert("MUST SPEICFY NAME!");
  // name0Lbl.textContent = playerName;
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
}

function updateGame(self) {
  game.playerHand1 = self.value;
  self.classList.toggle("btn--active");
  currentHand.classList.toggle("btn--active");
  currentHand = self;
  hand0Img.src = `./assets/images/${game.playerHand1}-right.png`;
  hand1Img.src = `./assets/images/default-hand.png`;
  throwBtn.textContent = `Throw 👋 ${currentHand.textContent
    .slice(0, 15)
    .concat("(Enter)")}!`;
}

function isGameWinner() {
  // Checks if either player or CPU wins the game
  if (
    game.scores.player === game.rounds ||
    game.scores.computer === game.rounds
  ) {
    const msg =
      game.scores.player === game.rounds
        ? (gameLbl.textContent = `${playerName} Wins 🏆!`)
        : (gameLbl.textContent = "CPU Wins 🤖!");
    displayHands();
    game.flag = false;
    return true;
  }
  return false;
}

function generateHand() {
  // Generates a hand for the CPU
  const hands = ["rock", "paper", "scissors"];
  const index = Math.floor(Math.random() * hands.length);
  return hands[index];
}

function displayHands() {
  game.playerHand2 = generateHand();
  hand1Img.src = `./assets/images/${game.playerHand2}-left.png`;
}

function throwHands() {
  // Checks if player 1 hand matches player 2
  if (game.playerHand1 === game.playerHand2) {
    gameLbl.textContent = "This Round is a Draw!";
    // Checks if player 1 beats player 2
  } else if (
    (game.playerHand1 === "rock" && game.playerHand2 === "scissors") ||
    (game.playerHand1 === "scissors" && game.playerHand2 === "paper") ||
    (game.playerHand1 === "paper" && game.playerHand2 === "rock")
  ) {
    gameLbl.textContent = `${playerName} Wins This Round!`;
    game.scores.player++;
    score0Lbl.textContent = game.scores.player;

    // Or otherwise, player 2 beats player 1
  } else {
    gameLbl.textContent = "CPU Wins This Round!";
    game.scores.computer++;
    score1Lbl.textContent = game.scores.computer;
  }
}

// Button functionalities
for (const btn of handBtns) {
  btn.addEventListener("click", function () {
    if (game.flag) updateGame(this);
  });
}

throwBtn.addEventListener("click", function () {
  if (game.flag) {
    throwHands();
    if (!isGameWinner()) displayHands();
  }
});

resetBtn.addEventListener("click", init);
closeBtn.addEventListener("click", loadGame);
overlay.addEventListener("click", loadGame);

// --- KEYBOARD SUPPORT
document.addEventListener("keyup", function (e) {
  if (game.flag) {
    switch (e.key.toLowerCase()) {
      case "enter":
        throwHands();
        if (!isGameWinner()) displayHands();
        break;
      case "q":
        return updateGame(rockBtn);
      case "w":
        return updateGame(paperBtn);
      case "e":
        return updateGame(scissorsBtn);
    }
  }
});
