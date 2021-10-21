"use scrict";

// Selecting elements
// Buttons
// --- MODES ---
const modeBtns = document
  .querySelector("#btn--modes")
  .getElementsByClassName("btn");
// --- HANDS ---
const handBtns = document
  .querySelector("#btn--hands")
  .getElementsByClassName("btn");
const [btnRock, btnPaper, btnScissors] = handBtns;
// --- OTHERS ---
const btnThrow = document.querySelector("#btn--throw");
const btnReset = document.querySelector("#btn--reset");
const btnClose = document.querySelector("#btn--close");
// Labels
const gameLbl = document.querySelector("#game--label");
const name0Lbl = document.querySelector("#name--0");
const score0Lbl = document.querySelector("#score--0");
const score1Lbl = document.querySelector("#score--1");
// Images
const hand0Img = document.querySelector("#hand--0");
const hand1Img = document.querySelector("#hand--1");
// Misc.
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");

// Initial variables
let playerName,
  currMode,
  currHand,
  playerHand,
  computerHand,
  lastPlayerHand,
  roundWinner,
  flag;

const game = {
  mode: "",
  rounds: 5,
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
  btnRock.classList.add("btn--active");
  btnPaper.classList.remove("btn--active");
  btnScissors.classList.remove("btn--active");
  gameLbl.textContent = "Select an Element!";
  score0Lbl.textContent = score1Lbl.textContent = "0";
  hand1Img.src = `./assets/images/default-left.png`;
  updateUI();
}

function loadGame() {
  (() => init())();
  if (!currMode) return alert("MUST SELECT A MODE!");
  game.mode = currMode.value;
  playerName = prompt("Ready! Enter Player Name: ");
  if (!playerName) playerName = "Player 1";
  name0Lbl.textContent = playerName;
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
  hand0Img.src = `./assets/images/${playerHand}-right.png`;
  btnThrow.textContent = `Throw 👋 ${currHand.textContent
    .slice(0, 15)
    .concat("(Enter)")}!`;
}

function changePlayerHand(self) {
  playerHand = self.value;
  self.classList.toggle("btn--active");
  currHand.classList.toggle("btn--active");
  currHand.blur();
  currHand = self;
  updateUI();
}

// Game Logic Functions
function calcHand() {
  // NOTE: PLAN TO ADD DETAILED COMMENTS --> TO MAKE CODE MORE CLEAR + READABLE
  let hand, idx;
  const { player, computer } = game.winConditions;
  const generateRandHand = (hands = ["rock", "paper", "scissors"]) => {
    const idx = Math.floor(Math.random() * hands.length);
    return hands[idx];
  };
  // --- EASY MODE ---
  if (game.mode === "easy") {
    // Loops over object to workout idx (see below)
    player.map((hands, i) => {
      if (lastPlayerHand?.value === hands.hand1) idx = i;
    });
    hand = roundWinner === "player" ? lastPlayerHand.value : player[idx]?.hand2;
  } // --- HARD MODE ---
  else if (game.mode === "hard") {
    const arr = new Array(5);
    // Loops over object to workout idx (see below)
    computer.map((hands, i) => {
      if (lastPlayerHand?.value === hands.hand1) idx = i;
    });
    if (roundWinner === "player") {
      // Filling array --> used for probability
      arr.fill(lastPlayerHand.value, 0, 2);
      arr.fill(game.winConditions.computer[idx].hand2, 2);
    }
    hand = generateRandHand(arr);
  }
  computerHand = !hand ? generateRandHand() : hand;
  hand1Img.src = `./assets/images/${computerHand}-left.png`;
}

function throwHands() {
  lastPlayerHand = currHand;
  const gameHands = [playerHand, computerHand];
  // Checks if player 1 hand matches player 2
  if (playerHand === computerHand) {
    gameLbl.textContent = "This Round is a Draw!";
    roundWinner = "";
  } else {
    const { player, computer } = game.winConditions;
    for (let i = 0; i < player.length; i++) {
      const playerWinCond = Object.values(player[i]);
      const computerWinCond = Object.values(computer[i]);
      // Compares every hand to see if player won this round
      if (gameHands.every((hand, i) => hand === playerWinCond[i])) {
        roundWinner = "player";
        game.scores.player++;
        score0Lbl.textContent = game.scores.player;
        // Or otherwise, compares every hand again to see if computer won this round
      } else if (gameHands.every((hand, i) => hand === computerWinCond[i])) {
        roundWinner = "computer";
        game.scores.computer++;
        score1Lbl.textContent = game.scores.computer;
      }
    }
    gameLbl.textContent =
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
    gameLbl.textContent =
      roundWinner === "player" ? `${playerName} Wins 🏆!` : "CPU Wins 🤖!";
    flag = false;
  }
}

// Event Handlers
for (const btn of modeBtns) {
  btn.addEventListener("click", function () {
    game.mode = this.value;
    this.classList.toggle("btn--active");
    currMode?.classList.toggle("btn--active");
    currMode?.blur();
    currMode = this;
  });
}

for (const btn of handBtns) {
  btn.addEventListener("click", function () {
    if (flag) changePlayerHand(this);
  });
}

btnThrow.addEventListener("click", function () {
  if (flag) updateGame();
});

btnReset.addEventListener("click", function () {
  this.blur();
  init();
});

btnClose.addEventListener("click", loadGame);
overlay.addEventListener("click", loadGame);

// --- KEYBOARD SUPPORT ---
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
