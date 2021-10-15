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
  winConditions: {
    player: [
      {
        hand1: "rock",
        hand2: "scissors",
      },
      {
        hand1: "scissors",
        hand2: "paper",
      },
      {
        hand1: "paper",
        hand2: "rock",
      },
    ],
    computer: [
      {
        hand1: "scissors",
        hand2: "rock",
      },
      {
        hand1: "paper",
        hand2: "scissors",
      },
      {
        hand1: "rock",
        hand2: "paper",
      },
    ],
  },
};

function init() {
  // Reset game values
  game.playerHand1 = rockBtn.value;
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
  updateGUI();
}

function updateGame() {
  displayHand();
  throwHands();
  isGameWinner();
}

// Game GUI functionalities
function loadGame() {
  (() => init())();
  playerName = prompt("Ready! Enter Player Name: ");
  if (!playerName) return alert("MUST SPECIFY A NAME!");
  name0Lbl.textContent = playerName;
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
}

function updateGUI() {
  hand0Img.src = `./assets/images/${game.playerHand1}-right.png`;
  hand1Img.src = `./assets/images/default-hand.png`;
  throwBtn.textContent = `Throw 👋 ${currentHand.textContent
    .slice(0, 15)
    .concat("(Enter)")}!`;
}

// Game logic functionalities
function throwHands() {
  // Checks if player 1 hand matches player 2
  if (game.playerHand1 === game.playerHand2) {
    gameLbl.textContent = "This Round is a Draw!";
    return null;
  }
  const player = game.winConditions.player;
  const computer = game.winConditions.computer;
  for (let i = 0; i < 3; i++) {
    if (
      game.playerHand1 === player[i].hand1 &&
      game.playerHand2 === player[i].hand2
    ) {
      gameLbl.textContent = `${playerName} Wins This Round!`;
      game.scores.player++;
      score0Lbl.textContent = game.scores.player;
    } else if (
      game.playerHand1 === computer[i].hand1 &&
      game.playerHand2 === computer[i].hand2
    ) {
      gameLbl.textContent = "CPU Wins This Round!";
      game.scores.computer++;
      score1Lbl.textContent = game.scores.computer;
    }
  }
}

function isGameWinner() {
  // Checks if either player or CPU wins the game
  if (
    game.scores.player === game.rounds ||
    game.scores.computer === game.rounds
  ) {
    const msg =
      game.scores.player === game.rounds
        ? `${playerName} Wins 🏆!`
        : "CPU Wins 🤖!";
    gameLbl.textContent = msg;
    game.flag = false;
  }
}

// Hand functions
function changeHand(self) {
  game.playerHand1 = self.value;
  self.classList.toggle("btn--active");
  currentHand.classList.toggle("btn--active");
  currentHand = self;
  updateGUI();
}

function displayHand() {
  const hands = ["rock", "paper", "scissors"];
  const index = Math.floor(Math.random() * hands.length);
  game.playerHand2 = hands[index];
  hand1Img.src = `./assets/images/${game.playerHand2}-left.png`;
}

// Button functionalities
for (const btn of handBtns) {
  btn.addEventListener("click", function () {
    if (game.flag) changeHand(this);
  });
}

throwBtn.addEventListener("click", function () {
  if (game.flag) updateGame();
});

resetBtn.addEventListener("click", init);
closeBtn.addEventListener("click", loadGame);
overlay.addEventListener("click", loadGame);

// --- KEYBOARD SUPPORT
document.addEventListener("keyup", function (e) {
  if (game.flag) {
    switch (e.key.toLowerCase()) {
      case "enter":
        return updateGame();
      case "q":
        return changeHand(rockBtn);
      case "w":
        return changeHand(paperBtn);
      case "e":
        return changeHand(scissorsBtn);
    }
  }
});
