"use scrict";

// Selecting elements
// BUTTONS
// --- MODES
const modeBtn = document
  .querySelector("#btn--modes")
  .querySelector(".btn--active");
// --- HANDS
const handBtns = document
  .querySelector("#btn--hands")
  .getElementsByClassName("btn");
const [rockBtn, paperBtn, scissorsBtn] = handBtns;
// --- OTHERS
const throwBtn = document.querySelector("#btn--throw");
const resetBtn = document.querySelector("#btn--reset");
const closeBtn = document.querySelector("#btn--close");
// LABELS
const gameLbl = document.querySelector("#game--label");
const name0Lbl = document.querySelector("#name--0");
const score0Lbl = document.querySelector("#score--0");
const score1Lbl = document.querySelector("#score--1");
// IMAGES
const hand0Img = document.querySelector("#hand--0");
const hand1Img = document.querySelector("#hand--1");
// MISC.
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");

// Initial variables
let playerName, currentHand, lastPlayerHand, roundWinner;

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
  lastPlayerHand = roundWinner = "";
  game.playerHand1 = currentHand.value;
  game.playerHand2 = "default";
  game.scores.player = game.scores.computer = 0;
  game.flag = true;
  // Clean-up GUI
  rockBtn.classList.add("btn--active");
  paperBtn.classList.remove("btn--active");
  scissorsBtn.classList.remove("btn--active");
  gameLbl.textContent = "Select an Element!";
  gameLbl.style.color = "#000";
  score0Lbl.textContent = score1Lbl.textContent = "0";
  hand1Img.src = `./assets/images/${game.playerHand2}-left.png`;
  updateUI();
}

function loadGame() {
  (() => init())();
  // playerName = prompt("Ready! Enter Player Name: ");
  // if (!playerName) return alert("MUST SPECIFY A NAME!");
  // name0Lbl.textContent = playerName;
  game.mode = modeBtn.value;
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
}

function updateGame() {
  calcAiHand();
  throwHands();
  checkIfGameWinner();
}

// Game UI functions
function updateUI() {
  hand0Img.src = `./assets/images/${game.playerHand1}-right.png`;
  throwBtn.textContent = `Throw 👋 ${currentHand.textContent
    .slice(0, 15)
    .concat("(Enter)")}!`;
}

function changePlayerHand(self) {
  game.playerHand1 = self.value;
  self.classList.toggle("btn--active");
  currentHand.classList.toggle("btn--active");
  currentHand.blur();
  currentHand = self;
  updateUI();
}

// Game logic functions
function throwHands() {
  lastPlayerHand = currentHand;
  // Checks if player 1 hand matches player 2
  if (game.playerHand1 === game.playerHand2) {
    gameLbl.textContent = "This Round is a Draw!";
    roundWinner = "";
    return;
  } else {
    for (const val of Object.values(game.winConditionsPlayer)) {
      if (game.playerHand1 === val.hand1 && game.playerHand2 === val.hand2) {
        gameLbl.textContent = `${playerName} Wins This Round!`;
        game.scores.player++;
        score0Lbl.textContent = game.scores.player;
        roundWinner = "player";
        return;
      }
    }
    gameLbl.textContent = "CPU Wins This Round!";
    game.scores.computer++;
    score1Lbl.textContent = game.scores.computer;
    roundWinner = "computer";
  }
}

function checkIfGameWinner() {
  // Checks if either player or CPU wins the game
  if (game.scores.player === game.rounds) {
    gameLbl.textContent = `${playerName} Wins 🏆!`;
    game.flag = false;
  } else if (game.scores.computer === game.rounds) {
    gameLbl.textContent = "CPU Wins 🤖!";
    game.flag = false;
  }
}

function calcAiHand() {
  let hand;
  const generateRandHand = () => {
    const hands = ["rock", "paper", "scissors"];
    const idx = Math.floor(Math.random() * hands.length);
    return hands[idx];
  };
  if (game.mode === "easy") {
    switch (lastPlayerHand?.value) {
      case "rock":
        hand = roundWinner === "player" ? [lastPlayerHand.value] : "scissors";
        break;
      case "paper":
        hand = roundWinner === "player" ? [lastPlayerHand.value] : "rock";
        break;
      case "scissors":
        hand = roundWinner === "player" ? [lastPlayerHand.value] : "paper";
        break;
    }
    game.playerHand2 = !hand ? generateRandHand() : hand;
  }
  hand1Img.src = `./assets/images/${game.playerHand2}-left.png`;
}

// Event handlers
for (const btn of handBtns) {
  btn.addEventListener("click", function () {
    if (game.flag) changePlayerHand(this);
  });
}

throwBtn.addEventListener("click", function () {
  if (game.flag) updateGame();
});

resetBtn.addEventListener("click", function () {
  this.blur();
  init();
});

closeBtn.addEventListener("click", loadGame);
overlay.addEventListener("click", loadGame);

// --- KEYBOARD SUPPORT
document.addEventListener("keyup", function (e) {
  if (game.flag) {
    switch (e.key.toLowerCase()) {
      case "enter":
        currentHand.blur();
        return updateGame();
      case "q":
        return changePlayerHand(rockBtn);
      case "w":
        return changePlayerHand(paperBtn);
      case "e":
        return changePlayerHand(scissorsBtn);
    }
  }
});
