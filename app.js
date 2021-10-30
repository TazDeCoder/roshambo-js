"use scrict";

////////////////////////////////////////////////
////// Selecting HTML elements
///////////////////////////////////////////////

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
// Others
const selectionModes = document.querySelector(".selection--modes");
const selectionHands = document.querySelector(".selection--hands");

////////////////////////////////////////////////
////// Global variables
///////////////////////////////////////////////

let playerName, currPlayerHand, lastPlayerHand, flag;

const game = {
  mode: "",
  roundWinner: "",
  rounds: 0,
  scores: {
    player: 0,
    computer: 0,
  },
  winConditions: {
    player: [
      {
        hand1: btnRock,
        hand2: btnScissors,
      },
      {
        hand1: btnPaper,
        hand2: btnRock,
      },
      {
        hand1: btnScissors,
        hand2: btnPaper,
      },
    ],
    computer: [
      {
        hand1: btnRock,
        hand2: btnPaper,
      },
      {
        hand1: btnPaper,
        hand2: btnScissors,
      },
      {
        hand1: btnScissors,
        hand2: btnRock,
      },
    ],
  },
};

////////////////////////////////////////////////
////// Game UI Setup
///////////////////////////////////////////////

function init() {
  // Reset game values
  currPlayerHand = btnRock;
  lastPlayerHand = game.roundWinner = "";
  game.scores.player = game.scores.computer = 0;
  flag = true;
  // Clean-up UI
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
  throwHands(currPlayerHand, calcHand());
  checkGameWinner();
}

function updateUI() {
  imageHand0.src = `./assets/images/hands/${currPlayerHand.value}-right.png`;
  btnThrow.textContent = `Throw 👋 ${currPlayerHand.textContent
    .slice(0, 15)
    .concat("(Enter)")}!`;
}

////////////////////////////////////////////////
////// Game Logic
///////////////////////////////////////////////

function calcHand() {
  // NOTE: PLAN TO ADD DETAILED COMMENTS --> TO MAKE CODE MORE CLEAR + READABLE
  const generateRandomHand = (hands = [btnRock, btnPaper, btnScissors]) => {
    const idx = Math.floor(Math.random() * hands.length);
    return hands[idx];
  };
  let computerHand, hand, idx;
  const { player: playerWinConds, computer: computerWinConds } =
    game.winConditions;
  // --- EASY MODE ---
  if (game.mode === "easy") {
    playerWinConds.map((hands, i) => {
      if (lastPlayerHand?.value === hands.hand1) idx = i;
    });
    hand =
      game.roundWinner === "player"
        ? lastPlayerHand
        : playerWinConds[idx]?.hand2;
  } // --- HARD MODE ---
  else if (game.mode === "hard") {
    const arr = new Array(5);
    computerWinConds.map((hands, i) => {
      if (lastPlayerHand?.value === hands.hand1) idx = i;
    });
    if (game.roundWinner === "player") {
      // Filling array --> used for probability
      arr.fill(lastPlayerHand, 0, 2);
      arr.fill(game.winConditions.computer[idx].hand2, 2);
    }
    hand = generateRandomHand(arr);
  }
  computerHand = !hand ? generateRandomHand() : hand;
  imageHand1.src = `./assets/images/hands/${computerHand.value}-left.png`;
  return computerHand;
}

function throwHands(h1, h2) {
  const hands = [h1, h2];
  lastPlayerHand = h1;
  // Checks if player hand matches computer hand
  if (h1 === h2) {
    labelGame.textContent = "This Round is a Draw!";
    game.roundWinner = "";
  } else {
    // Else either player or computer has won
    const { player: playerWinConds, computer: computerWinConds } =
      game.winConditions;
    for (let i = 0; i < playerWinConds.length; i++) {
      const playerWinCond = Object.values(playerWinConds[i]);
      const computerWinCond = Object.values(computerWinConds[i]);
      // Compares every hand to see if player won this round
      if (hands.every((h, i) => h === playerWinCond[i])) {
        game.roundWinner = "player";
        game.scores.player++;
        labelScore0.textContent = game.scores.player;
        // Or otherwise, compares every hand again to see if computer won this round
      } else if (hands.every((h, i) => h === computerWinCond[i])) {
        game.roundWinner = "computer";
        game.scores.computer++;
        labelScore1.textContent = game.scores.computer;
      }
    }
    labelGame.textContent =
      game.roundWinner === "player"
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
      game.roundWinner === "player" ? `${playerName} Wins 🏆!` : "CPU Wins 🤖!";
    flag = false;
  }
}

////////////////////////////////////////////////
////// Event Handlers
///////////////////////////////////////////////

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
  currPlayerHand.blur();
  currPlayerHand = self;
  updateUI();
}

document.addEventListener("keyup", function (e) {
  if (flag) {
    switch (e.key.toLowerCase()) {
      case "enter":
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
