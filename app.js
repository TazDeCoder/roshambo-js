"use scrict";

// Selecting HTML elements
// Buttons
const btnsHand = document.querySelectorAll(".selection--hands .selection__btn");
const btnRock = document.querySelector(".selection__btn--rock");
const btnPaper = document.querySelector(".selection__btn--paper");
const btnScissors = document.querySelector(".selection__btn--scissors");
const btnThrow = document.querySelector(".selection__btn--throw");
const btnReset = document.querySelector(".selection__btn--reset");
const btnClose = document.querySelector(".modal__btn--close");
// Labels
const labelGame = document.querySelector(".game__label");
const labelName0 = document.querySelector(".player__name--0");
const labelScore0 = document.querySelector(".player__score--0");
const labelScore1 = document.querySelector(".player__score--1");
// Images
const imageHand0 = document.querySelector(".player__hand--0");
const imageHand1 = document.querySelector(".player__hand--1");
// Inputs
const inputRound = document.querySelector(".modal__input--round");
// Misc.
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
// --- OTHERS ---
const selectionModes = document.querySelector(".selection--modes");
const selectionHands = document.querySelector(".selection--hands");

// Initial variables
let playerName,
  currHand,
  lastPlayerHand,
  playerHand,
  computerHand,
  roundWinner,
  flag;

const game = {
  mode: "",
  rounds: 0,
  scores: {
    player: 0,
    computer: 0,
  },
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
  currHand = btnRock;
  lastPlayerHand = roundWinner = "";
  playerHand = currHand.value;
  flag = true;
  game.scores.player = game.scores.computer = 0;
  // Clean-up GUI
  btnRock.classList.add("selection__btn--active");
  btnPaper.classList.remove("selection__btn--active");
  btnScissors.classList.remove("selection__btn--active");
  labelGame.textContent = "Select an Element!";
  labelScore0.textContent = labelScore1.textContent = "0";
  imageHand1.src = `./assets/images/hands/default-left.png`;
  updateUI();
}

function loadGame() {
  (() => init())();
  if (!game.mode) return alert("MUST SELECT A MODE!");
  game.rounds = +inputRound.value;
  playerName = prompt("Ready! Enter Player Name: ");
  if (!playerName) playerName = "Player 1";
  labelName0.textContent = playerName;
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
}

function updateGame() {
  calcHand();
  throwHands();
  checkGameWinner();
}

// Game UI Functions
function updateUI() {
  imageHand0.src = `./assets/images/hands/${playerHand}-right.png`;
  btnThrow.textContent = `Throw 👋 ${currHand.textContent
    .slice(0, 15)
    .concat("(Enter)")}!`;
}

// Game Logic Functions
function calcHand() {
  // NOTE: PLAN TO ADD DETAILED COMMENTS --> TO MAKE CODE MORE CLEAR + READABLE
  const generateRandomHand = (hands = ["rock", "paper", "scissors"]) => {
    const idx = Math.floor(Math.random() * hands.length);
    return hands[idx];
  };
  let hand, idx;
  const { player: playerWinConds, computer: computerWinConds } =
    game.winConditions;
  // --- EASY MODE ---
  if (game.mode === "easy") {
    // Loops over object to workout idx (see below)
    playerWinConds.map((hands, i) => {
      if (lastPlayerHand?.value === hands.hand1) idx = i;
    });
    hand =
      roundWinner === "player"
        ? lastPlayerHand.value
        : playerWinConds[idx]?.hand2;
  } // --- HARD MODE ---
  else if (game.mode === "hard") {
    const arr = new Array(5);
    // Loops over object to workout idx (see below)
    computerWinConds.map((hands, i) => {
      if (lastPlayerHand?.value === hands.hand1) idx = i;
    });
    if (roundWinner === "player") {
      // Filling array --> used for probability
      arr.fill(lastPlayerHand.value, 0, 2);
      arr.fill(game.winConditions.computer[idx].hand2, 2);
    }
    hand = generateRandomHand(arr);
  }
  computerHand = !hand ? generateRandomHand() : hand;
  imageHand1.src = `./assets/images/hands/${computerHand}-left.png`;
}

function throwHands() {
  lastPlayerHand = currHand;
  const gameHands = [playerHand, computerHand];
  // Checks if player 1 hand matches player 2
  if (playerHand === computerHand) {
    labelGame.textContent = "This Round is a Draw!";
    roundWinner = "";
  } else {
    const { player: playerWinConds, computer: computerWinConds } =
      game.winConditions;
    for (let i = 0; i < playerWinConds.length; i++) {
      const playerWinCond = Object.values(playerWinConds[i]);
      const computerWinCond = Object.values(computerWinConds[i]);
      // Compares every hand to see if player won this round
      if (gameHands.every((hand, i) => hand === playerWinCond[i])) {
        roundWinner = "player";
        game.scores.player++;
        labelScore0.textContent = game.scores.player;
        // Or otherwise, compares every hand again to see if computer won this round
      } else if (gameHands.every((hand, i) => hand === computerWinCond[i])) {
        roundWinner = "computer";
        game.scores.computer++;
        labelScore1.textContent = game.scores.computer;
      }
    }
    labelGame.textContent =
      roundWinner === "player"
        ? `${playerName} Wins This Round!`
        : "CPU Wins This Round!";
  }
}

function checkGameWinner() {
  // Checks if either player or CPU wins the game
  if (
    game.scores.player === game.rounds ||
    game.scores.computer === game.rounds
  ) {
    labelGame.textContent =
      roundWinner === "player" ? `${playerName} Wins 🏆!` : "CPU Wins 🤖!";
    flag = false;
  }
}

// Event Handlers
selectionModes.addEventListener("click", function (e) {
  const clicked = e.target;
  if (clicked.classList.contains("selection__btn")) {
    const [...btns] = this.querySelectorAll(".selection__btn");
    btns.forEach((btn) => btn.classList.remove("selection__btn--active"));
    clicked.classList.add("selection__btn--active");
    game.mode = clicked.value;
  }
});

selectionHands.addEventListener("click", function (e) {
  if (flag) {
    const clicked = e.target;
    if (!clicked) return;
    changePlayerHand(clicked);
  }
});

btnThrow.addEventListener("click", function () {
  if (flag) updateGame();
});

btnReset.addEventListener("click", init);
btnClose.addEventListener("click", loadGame);
overlay.addEventListener("click", loadGame);

// --- KEYBOARD SUPPORT ---
function changePlayerHand(self) {
  const [...btns] = selectionHands.querySelectorAll(".selection__btn");
  btns.forEach((btn) => btn.classList.remove("selection__btn--active"));
  self.classList.add("selection__btn--active");
  currHand.blur();
  playerHand = self.value;
  currHand = self;
  updateUI();
}

document.addEventListener("keyup", function (e) {
  if (flag) {
    switch (e.key.toLowerCase()) {
      case "enter":
        currHand.blur();
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
