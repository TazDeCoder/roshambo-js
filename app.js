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
  winConditionsPlayer: [
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
};

function init() {
  // Reset game values
  currentHand = rockBtn;
  game.playerHand1 = currentHand.value;
  game.scores.player = 0;
  game.scores.computer = 0;
  game.flag = true;
  // Clean-up GUI
  rockBtn.classList.add("btn--active");
  paperBtn.classList.remove("btn--active");
  scissorsBtn.classList.remove("btn--active");
  gameLbl.textContent = "Select an Element!";
  gameLbl.style.color = "#000";
  score0Lbl.textContent = game.scores.player;
  score1Lbl.textContent = game.scores.computer;
  updateUI();
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

function updateUI() {
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
  const conditions = Object.values(game.winConditionsPlayer);
  for (const condition of conditions) {
    if (
      game.playerHand1 === condition.hand1 &&
      game.playerHand2 === condition.hand2
    ) {
      gameLbl.textContent = `${playerName} Wins This Round!`;
      game.scores.player++;
      score0Lbl.textContent = game.scores.player;
      return null;
    }
  }
  gameLbl.textContent = "CPU Wins This Round!";
  game.scores.computer++;
  score1Lbl.textContent = game.scores.computer;
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
  updateUI();
}

function displayHand() {
  const hands = ["rock", "paper", "scissors"];
  const index = Math.floor(Math.random() * hands.length);
  game.playerHand2 = hands[index];
  hand1Img.src = `./assets/images/${game.playerHand2}-left.png`;
}

// Event handlers
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
