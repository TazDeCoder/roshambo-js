"use scrict";

// Selecting elements
// BUTTONS
// --- MODES
const modeBtns = document
  .querySelector("#btn--modes")
  .getElementsByClassName("btn");
// --- HANDS
const handBtns = document
  .querySelector("#btn--hands")
  .getElementsByClassName("btn");
const [btnRock, btnPaper, btnScissors] = handBtns;
// --- OTHERS
const btnThrow = document.querySelector("#btn--throw");
const btnReset = document.querySelector("#btn--reset");
const btnClose = document.querySelector("#btn--close");
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
let playerName, currentMode, currentHand, lastPlayerHand, roundWinner;

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
        hand1: "rock",
        hand2: "paper",
      },
      {
        hand1: "paper",
        hand2: "scissors",
      },
      {
        hand1: "scissors",
        hand2: "rock",
      },
    ],
  },
};

function init() {
  // Reset game values
  currentHand = btnRock;
  lastPlayerHand = roundWinner = "";
  game.playerHand1 = currentHand.value;
  game.playerHand2 = "default";
  game.scores.player = game.scores.computer = 0;
  game.flag = true;
  // Clean-up GUI
  btnRock.classList.add("btn--active");
  btnPaper.classList.remove("btn--active");
  btnScissors.classList.remove("btn--active");
  gameLbl.textContent = "Select an Element!";
  gameLbl.style.color = "#000";
  score0Lbl.textContent = score1Lbl.textContent = "0";
  hand1Img.src = `./assets/images/${game.playerHand2}-left.png`;
  updateUI();
}

function loadGame() {
  (() => init())();
  if (!currentMode) return alert("MUST SELECT A MODE!");
  game.mode = currentMode.value;
  playerName = prompt("Ready! Enter Player Name: ");
  if (!playerName) playerName = "Player 1";
  name0Lbl.textContent = playerName;
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
  btnThrow.textContent = `Throw 👋 ${currentHand.textContent
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
  const generateRandHand = (hands = ["rock", "paper", "scissors"]) => {
    const idx = Math.floor(Math.random() * hands.length);
    return hands[idx];
  };
  if (game.mode === "easy") {
    switch (lastPlayerHand?.value) {
      // ROCK
      case `${game.winConditions.player[0].hand1}`:
        idx = 0;
        break;
      // PAPER
      case `${game.winConditions.player[1].hand1}`:
        idx = 1;
        break;
      // SCISSORS
      case `${game.winConditions.player[2].hand1}`:
        idx = 2;
        break;
    }
    hand =
      roundWinner === "player"
        ? lastPlayerHand.value
        : game.winConditions.player[idx]?.hand2;
  } else if (game.mode === "hard") {
    const arr = new Array(5);
    switch (lastPlayerHand?.value) {
      // ROCK
      case `${game.winConditions.computer[0].hand1}`:
        idx = 0;
        break;
      // PAPER
      case `${game.winConditions.computer[1].hand1}`:
        idx = 1;
        break;
      // SCISSORS
      case `${game.winConditions.computer[2].hand1}`:
        idx = 2;
        break;
    }
    if (roundWinner === "player") {
      arr.fill(lastPlayerHand.value, 0, 2);
      arr.fill(game.winConditions.computer[idx].hand2, 2);
    }
    hand = generateRandHand(arr);
  }
  game.playerHand2 = !hand ? generateRandHand() : hand;
  hand1Img.src = `./assets/images/${game.playerHand2}-left.png`;
}

// Event handlers
// currentMode = btnEasy;
for (const btn of modeBtns) {
  btn.addEventListener("click", function () {
    game.mode = this.value;
    this.classList.toggle("btn--active");
    currentMode?.classList.toggle("btn--active");
    currentMode?.blur();
    currentMode = this;
  });
}

for (const btn of handBtns) {
  btn.addEventListener("click", function () {
    if (game.flag) changePlayerHand(this);
  });
}

btnThrow.addEventListener("click", function () {
  if (game.flag) updateGame();
});

btnReset.addEventListener("click", function () {
  this.blur();
  init();
});

btnClose.addEventListener("click", loadGame);
overlay.addEventListener("click", loadGame);

// --- KEYBOARD SUPPORT
document.addEventListener("keyup", function (e) {
  if (game.flag) {
    switch (e.key.toLowerCase()) {
      case "enter":
        currentHand.blur();
        return updateGame();
      case "q":
        return changePlayerHand(btnRock);
      case "w":
        return changePlayerHand(btnPaper);
      case "e":
        return changePlayerHand(btnScissors);
    }
  }
});
