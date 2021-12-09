"use scrict";

////////////////////////////////////////////////
////// Selecting HTML Elements
///////////////////////////////////////////////

// Parents
const navHands = document.querySelector(".content__nav--hands");
const contentModes = document.querySelector(".container__content--modes");
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
// Buttons
const btnRock = document.querySelector(".nav__btn--rock");
const btnPaper = document.querySelector(".nav__btn--paper");
const btnScissors = document.querySelector(".nav__btn--scissors");
const btnThrow = document.querySelector(".nav__btn--throw");
const btnReset = document.querySelector(".nav__btn--reset");
const btnClose = document.querySelector(".modal__btn--close");
// Labels
const labelGame = document.querySelector(".game__label");
const labelName0 = document.querySelector(".item__label--name--0");
const labelName1 = document.querySelector(".item__label--name--1");
const labelScore0 = document.querySelector(".item__label--score--0");
const labelScore1 = document.querySelector(".item__label--score--1");
// Images
const imgHand0 = document.querySelector(".item__img--hand--0");
const imgHand1 = document.querySelector(".item__img--hand--1");
// Inputs
const inputRound = document.querySelector(".content__input--rounds");

////////////////////////////////////////////////
////// Global Variables
///////////////////////////////////////////////

let currHand0, lastHand0;

const winConditions = Object.freeze({
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
});

////////////////////////////////////////////////
////// App Architecture
///////////////////////////////////////////////

class App {
  #flag;
  #mode;
  #rounds;
  #roundOutcome;
  #scores = {};

  constructor() {
    // Add event handlers
    contentModes.addEventListener("click", this._toggleMode.bind(this));
    navHands.addEventListener("click", this._toggleHand.bind(this));
    btnThrow.addEventListener("click", this._updateGame.bind(this));
    btnReset.addEventListener("click", this._init.bind(this));
    btnClose.addEventListener("click", this._loadGame.bind(this));
    overlay.addEventListener("click", this._loadGame.bind(this));
    document.addEventListener("keyup", this._keypadActive.bind(this));
  }

  _updateGameLabel(txt) {
    labelGame.textContent = txt;
  }

  _init() {
    // Reset game values
    currHand0 = btnRock;
    lastHand0 = this.#roundOutcome = "";
    this.#scores.player = this.#scores.computer = 0;
    this.#flag = true;
    // Clean-up UI
    btnReset.blur();
    btnRock.classList.add("btn--active");
    btnPaper.classList.remove("btn--active");
    btnScissors.classList.remove("btn--active");
    this._updateGameLabel("Select a Hand!");
    labelScore0.textContent = labelScore1.textContent = "0";
    imgHand1.src = `./assets/images/hands/default-left.png`;
    this._updateUI();
  }

  _loadGame() {
    if (!this.#mode) return alert("MUST SELECT A MODE!");
    this.#rounds = +inputRound.value;
    const playerName = prompt("Ready! Enter Player Name: ");
    labelName0.textContent = playerName ? playerName : "Player1";
    modal.classList.add("hidden");
    overlay.classList.add("hidden");
    this._init();
  }

  _updateGame() {
    if (!this.#flag) return;
    this._throwHands(currHand0, this._calcCompHand());
    this._isGameWinner();
  }

  _updateUI() {
    imgHand0.src = `./assets/images/hands/${currHand0.value}-right.png`;
    btnThrow.textContent = `Throw 👋 ${currHand0.textContent
      .slice(0, 15)
      .concat("(Enter)")}!`;
  }

  _changePlayerHand(hand) {
    const [...btns] = navHands.querySelectorAll(".btn");
    btns.forEach((btn) => btn.classList.remove("btn--active"));
    hand.classList.add("btn--active");
    currHand0.blur();
    currHand0 = hand;
    this._updateUI();
  }

  _toggleMode(e) {
    const clicked = e.target;
    if (!clicked) return;
    if (clicked.classList.contains("content__btn")) {
      const [...btns] = contentModes.querySelectorAll(".content__btn");
      btns.forEach((btn) => btn.classList.remove("btn--active"));
      clicked.classList.add("btn--active");
      this.#mode = clicked.value;
    }
  }

  _toggleHand(e) {
    if (!this.#flag) return;
    const clicked = e.target;
    if (!clicked) return;
    this._changePlayerHand(clicked);
  }

  _throwHands(h1, h2) {
    const hands = [h1, h2];
    // Checks if player hand matches computer hand
    if (h1 === h2) {
      const str = "This Round is a Draw!";
      this._updateGameLabel(str);
      this.#roundOutcome = "draw";
    } else {
      // Else either player or computer has won
      const { player: playerWinConds, computer: computerWinConds } =
        winConditions;
      for (let i = 0; i < playerWinConds.length; i++) {
        const playerWinCond = Object.values(playerWinConds[i]);
        const computerWinCond = Object.values(computerWinConds[i]);
        // Compares every hand to see if player won this round
        if (hands.every((h, i) => h === playerWinCond[i])) {
          this.#roundOutcome = "player";
          this.#scores.player++;
          labelScore0.textContent = this.#scores.player;
          // Or otherwise, compares every hand again to see if computer won this round
        } else if (hands.every((h, i) => h === computerWinCond[i])) {
          this.#roundOutcome = "computer";
          this.#scores.computer++;
          labelScore1.textContent = this.#scores.computer;
        }
      }
      const str = `${
        this.#roundOutcome === "player"
          ? labelName0.textContent
          : labelName1.textContent
      } Wins This Round!`;
      this._updateGameLabel(str);
    }
    lastHand0 = h1;
  }

  _isGameWinner() {
    // Checks if either player or CPU wins the game
    if (Object.values(this.#scores).some((score) => score === this.#rounds)) {
      const str = `${
        this.#roundOutcome === "player"
          ? labelName0.textContent
          : labelName1.textContent
      } Wins ${this.#roundOutcome === "player" ? "🧐" : "🤖"}🏆!`;
      this._updateGameLabel(str);
      this.#flag = false;
    }
  }

  _calcCompHand() {
    let computerHand, hand, idx;
    const { player: playerWinConds, computer: computerWinConds } =
      winConditions;
    const generateRandHand = (hands = [btnRock, btnPaper, btnScissors]) =>
      hands[Math.floor(Math.random() * hands.length)];
    // --- EASY MODE ---
    if (this.#mode === "easy") {
      playerWinConds.map((hands, i) => {
        if (lastHand0 === hands.hand1) idx = i;
      });
      hand =
        this.#roundOutcome === "player"
          ? lastHand0
          : playerWinConds[idx]?.hand2;
    } // --- HARD MODE ---
    else if (this.#mode === "hard") {
      computerWinConds.map((hands, i) => {
        if (lastHand0 === hands.hand1) idx = i;
      });
      if (this.#roundOutcome === "player") {
        const arr = new Array(5); // Used for probability
        arr.fill(lastHand0, 0, 2);
        arr.fill(winConditions.computer[idx]?.hand2, 2);
        console.log(arr);
        hand = generateRandHand(arr);
      }
    }
    computerHand = !hand ? generateRandHand() : hand;
    imgHand1.src = `./assets/images/hands/${computerHand.value}-left.png`;
    return computerHand;
  }

  _keypadActive(e) {
    switch (e.key.toLowerCase()) {
      case "enter":
        return this._updateGame();
      case "q":
        return this._changePlayerHand(btnRock);
      case "w":
        return this._changePlayerHand(btnPaper);
      case "e":
        return this._changePlayerHand(btnScissors);
    }
  }
}

const app = new App();
