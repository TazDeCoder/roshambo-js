"use scrict";

// Selecting HTML elements
// Buttons
// --- HANDS ---
const btnsHand = document.querySelectorAll("#hands .selection__btn");
const btnRock = document.querySelector("#btn--rock");
const btnPaper = document.querySelector("#btn--paper");
const btnScissors = document.querySelector("#btn--scissors");
// --- OTHERS ---
const btnsMode = document.querySelectorAll("#modes .selection__btn");
const btnThrow = document.querySelector("#btn--throw");
const btnReset = document.querySelector("#btn--reset");
const btnClose = document.querySelector("#btn--close");
// Labels
const labelGame = document.querySelector("#game-label");
const labelName0 = document.querySelector("#name--0");
const labelScore0 = document.querySelector("#score--0");
const labelScore1 = document.querySelector("#score--1");
// Images
const imageHand0 = document.querySelector("#hand--0");
const imageHand1 = document.querySelector("#hand--1");
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
  btnRock.classList.add("selection__btn--active");
  btnPaper.classList.remove("selection__btn--active");
  btnScissors.classList.remove("selection__btn--active");
  labelGame.textContent = "Select an Element!";
  labelScore0.textContent = labelScore1.textContent = "0";
  imageHand1.src = `./assets/images/default-left.png`;
  updateUI();
}

function loadGame() {
  (() => init())();
  if (!currMode) return alert("MUST SELECT A MODE!");
  game.mode = currMode.value;
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
  imageHand0.src = `./assets/images/${playerHand}-right.png`;
  btnThrow.textContent = `Throw 👋 ${currHand.textContent
    .slice(0, 15)
    .concat("(Enter)")}!`;
}

function changePlayerHand(self) {
  playerHand = self.value;
  self.classList.toggle("selection__btn--active");
  currHand.classList.toggle("selection__btn--active");
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
  imageHand1.src = `./assets/images/${computerHand}-left.png`;
}

function throwHands() {
  lastPlayerHand = currHand;
  const gameHands = [playerHand, computerHand];
  // Checks if player 1 hand matches player 2
  if (playerHand === computerHand) {
    labelGame.textContent = "This Round is a Draw!";
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
btnsMode.forEach(function (btn) {
  console.log(btn);
  btn.addEventListener("click", function () {
    game.mode = this.value;
    this.classList.toggle("selection__btn--active");
    currMode?.classList.toggle("selection__btn--active");
    currMode?.blur();
    currMode = this;
  });
});

btnsHand.forEach(function (btn) {
  console.log(btn);
  btn.addEventListener("click", function () {
    if (flag) changePlayerHand(this);
  });
});

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
