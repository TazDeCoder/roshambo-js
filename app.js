"use scrict";

////////////////////////////////////////////////
////// Selecting HTML elements
///////////////////////////////////////////////

// Buttons
const btnRock = document.querySelector(".nav__btn-rock");
const btnPaper = document.querySelector(".nav__btn-paper");
const btnScissors = document.querySelector(".nav__btn-scissors");
const btnThrow = document.querySelector(".nav__btn-throw");
const btnReset = document.querySelector(".nav__btn-reset");
const btnClose = document.querySelector(".btn--close-modal");
// Labels
const labelGame = document.querySelector(".game__label");
const labelName0 = document.querySelector(".game__content-player-name--0");
const labelName1 = document.querySelector(".game__content-player-name--1");
const labelScore0 = document.querySelector(".game__content-player-score--0");
const labelScore1 = document.querySelector(".game__content-player-score--1");
// Images
const imageHand0 = document.querySelector(".game__content-player-hand--0");
const imageHand1 = document.querySelector(".game__content-player-hand--1");
// Inputs
const inputRound = document.querySelector(".modal__input-round");
// Parents
const navHands = document.querySelector(".nav-hands");
const modal = document.querySelector(".modal");
const contentModes = document.querySelector(".modal__content-modes");
const overlay = document.querySelector(".overlay");

////////////////////////////////////////////////
////// Global variables
///////////////////////////////////////////////

let currHand0, lastHand0;

const game = {
  mode: "",
  roundWinner: "",
  rounds: 0,
  scores: {
    player: 0,
    computer: 0,
  },
  flag: true,
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
  currHand0 = btnRock;
  lastHand0 = game.roundWinner = "";
  game.scores.player = game.scores.computer = 0;
  game.flag = true;
  // Clean-up UI
  btnReset.blur();
  btnRock.classList.add("btn--active");
  btnPaper.classList.remove("btn--active");
  btnScissors.classList.remove("btn--active");
  updateGameLabel("Select a Hand!");
  labelScore0.textContent = labelScore1.textContent = "0";
  imageHand1.src = `./assets/images/hands/default-left.png`;
  updateUI();
}

const updateGameLabel = (text) => (labelGame.textContent = text);

function loadGame() {
  if (!game.mode) return alert("MUST SELECT A MODE!");
  game.rounds = +inputRound.value;
  const playerName = prompt("Ready! Enter Player Name: ");
  labelName0.textContent = !playerName ? "Player1" : playerName;
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
  (() => init())();
}

function updateUI() {
  imageHand0.src = `./assets/images/hands/${currHand0.value}-right.png`;
  btnThrow.textContent = `Throw 👋 ${currHand0.textContent
    .slice(0, 15)
    .concat("(Enter)")}!`;
}

////////////////////////////////////////////////
////// Game Logic
///////////////////////////////////////////////

function updateGame() {
  throwHands(currHand0, calcHand1());
  isGameWinner();
}

function throwHands(h1, h2) {
  const hands = [h1, h2];
  // Checks if player hand matches computer hand
  if (h1 === h2) {
    const str = "This Round is a Draw!";
    updateGameLabel(str);
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
    const str = `${
      game.roundWinner === "player"
        ? labelName0.textContent
        : labelName1.textContent
    } Wins This Round!`;
    updateGameLabel(str);
  }
  lastHand0 = h1;
}

function isGameWinner() {
  // Checks if either player or CPU wins the game
  if (Object.values(game.scores).some((score) => score === game.rounds)) {
    const str = `${
      game.roundWinner === "player"
        ? labelName0.textContent
        : labelName1.textContent
    } Wins ${game.roundWinner === "player" ? "🧐" : "🤖"}🏆!`;
    updateGameLabel(str);
    game.flag = false;
  }
}

function calcHand1() {
  let computerHand, hand, idx;
  const { player: playerWinConds, computer: computerWinConds } =
    game.winConditions;
  const generateRandHand = (hands = [btnRock, btnPaper, btnScissors]) =>
    hands[Math.floor(Math.random() * hands.length)];
  // --- EASY MODE ---
  if (game.mode === "easy") {
    playerWinConds.map((hands, i) => {
      if (lastHand0 === hands.hand1) idx = i;
    });
    hand =
      game.roundWinner === "player" ? lastHand0 : playerWinConds[idx]?.hand2;
  } // --- HARD MODE ---
  else if (game.mode === "hard") {
    computerWinConds.map((hands, i) => {
      if (lastHand0 === hands.hand1) idx = i;
    });
    if (game.roundWinner === "player") {
      const arr = new Array(5); // Used for probability
      arr.fill(lastHand0, 0, 2);
      arr.fill(game.winConditions.computer[idx]?.hand2, 2);
      console.log(arr);
      hand = generateRandHand(arr);
    }
  }
  computerHand = !hand ? generateRandHand() : hand;
  imageHand1.src = `./assets/images/hands/${computerHand.value}-left.png`;
  return computerHand;
}

////////////////////////////////////////////////
////// Event Handlers
///////////////////////////////////////////////

contentModes.addEventListener("click", function (e) {
  const clicked = e.target;
  if (!clicked) return;
  if (clicked.classList.contains("modal__btn")) {
    const [...btns] = this.querySelectorAll(".modal__btn");
    btns.forEach((btn) => btn.classList.remove("btn--active"));
    clicked.classList.add("btn--active");
    game.mode = clicked.value;
  }
});

navHands.addEventListener("click", function (e) {
  if (game.flag) {
    const clicked = e.target;
    if (!clicked) return;
    changePlayerHand(clicked);
  }
});

btnThrow.addEventListener("click", function () {
  if (game.flag) updateGame();
});

btnReset.addEventListener("click", init);
btnClose.addEventListener("click", loadGame);
overlay.addEventListener("click", loadGame);

// --- KEYBOARD SUPPORT ---
function changePlayerHand(hand) {
  const [...btns] = navHands.querySelectorAll(".btn");
  btns.forEach((btn) => btn.classList.remove("btn--active"));
  hand.classList.add("btn--active");
  currHand0.blur();
  currHand0 = hand;
  updateUI();
}

document.addEventListener("keyup", function (e) {
  if (game.flag) {
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
