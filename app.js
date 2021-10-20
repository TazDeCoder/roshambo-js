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
  winConditions: {
    player: [
      {
        hand1: "rock",
        hand2: "scissors",
      },
      {
        hand1: "paper",
        hand2: "rock",
      },
      {
        hand1: "scissors",
        hand2: "paper",
      },
    ],
    computer: [
      {
        hand1: "scissors",
        hand2: "rock",
      },
      {
        hand1: "rock",
        hand2: "paper",
      },
      {
        hand1: "paper",
        hand2: "scissors",
      },
    ],
  },
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
  } else {
    const { player, computer } = game.winConditions;
    for (let i = 0; i < player.length; i++) {
      if (
        game.playerHand1 === player[i].hand1 &&
        game.playerHand2 === player[i].hand2
      ) {
        roundWinner = "player";
        game.scores.player++;
        score0Lbl.textContent = game.scores.player;
        break;
      } else if (
        game.playerHand1 === computer[i].hand1 &&
        game.playerHand2 === computer[i].hand2
      ) {
        roundWinner = "computer";
        game.scores.computer++;
        score1Lbl.textContent = game.scores.computer;
        break;
      }
    }
    gameLbl.textContent =
      roundWinner === "player"
        ? `${playerName} Wins This Round!`
        : "CPU Wins This Round!";
  }
}

function checkIfGameWinner() {
  // Checks if either player or CPU wins the game
  if (
    game.scores.player === game.rounds ||
    game.scores.computer === game.rounds
  ) {
    gameLbl.textContent =
      roundWinner === "player" ? `${playerName} Wins 🏆!` : "CPU Wins 🤖!";
    game.flag = false;
  }
}

function calcAiHand() {
  let hand, idx;
  const generateRandHand = () => {
    const hands = ["rock", "paper", "scissors"];
    const idx = Math.floor(Math.random() * hands.length);
    return hands[idx];
  };
  if (game.mode === "easy") {
    switch (lastPlayerHand?.value) {
      case "rock":
        idx = 0;
        break;
      case "paper":
        idx = 1;
        break;
      case "scissors":
        idx = 2;
        break;
    }
    if (idx) {
      hand =
        roundWinner === "player"
          ? lastPlayerHand.value
          : game.winConditions.player[idx].hand2;
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
