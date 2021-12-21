"use scrict";

////////////////////////////////////////////////
////// Selecting HTML Elements
///////////////////////////////////////////////

// Parents
const header = document.querySelector(".head");
const navHands = document.querySelector(".content__nav--hands");
const navOptions = document.querySelector(".content__nav--options");
const containerHero = document.querySelector(".content__hero");
const contentModes = document.querySelector(".container__content--modes");
const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
// Buttons
const btnRock = navHands.querySelector(".nav__btn--rock");
const btnPaper = navHands.querySelector(".nav__btn--paper");
const btnScissors = navHands.querySelector(".nav__btn--scissors");
const btnThrow = navOptions.querySelector(".nav__btn--throw");
const btnReset = navOptions.querySelector(".nav__btn--reset");
const btnClose = modal.querySelector(".modal__btn--close");
// Labels
const labelGame = containerHero.querySelector(".game__label");
const labelName0 = containerHero.querySelector(".item__label--name--0");
const labelName1 = containerHero.querySelector(".item__label--name--1");
const labelScore0 = containerHero.querySelector(".item__label--score--0");
const labelScore1 = containerHero.querySelector(".item__label--score--1");
// Images
const imgHand0 = containerHero.querySelector(".item__img--hand--0");
const imgHand1 = containerHero.querySelector(".item__img--hand--1");
// Inputs
const inputRound = modal.querySelector(".content__input--rounds");

////////////////////////////////////////////////
////// Data
///////////////////////////////////////////////

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
  // Config variables
  #mode;
  #rounds;
  // Game variables
  #scores = {};
  #currHand;
  #lastHand;
  #roundOutcome;
  #flag;

  constructor() {
    // Add event handlers
    contentModes.addEventListener("click", this._toggleMode.bind(this));
    navHands.addEventListener("click", this._toggleHand.bind(this));
    btnThrow.addEventListener("click", this._updateGame.bind(this));
    btnReset.addEventListener("click", this._init.bind(this));
    btnClose.addEventListener("click", this._loadGame.bind(this));
    overlay.addEventListener("click", this._loadGame.bind(this));
    document.addEventListener("keyup", this._handleKeydownPress.bind(this));
  }

  /////////////////////////////////////
  //////////// Helper functions

  _updateGameLabel(txt) {
    labelGame.textContent = txt;
  }

  /////////////////////////////////////
  //////////// Handler functions

  _init() {
    // Reset game values
    this.#currHand = btnRock;
    this.#lastHand = this.#roundOutcome = "";
    this.#scores.player = this.#scores.computer = 0;
    this.#flag = false;
    // Clean-up UI
    btnReset.blur(); // Lose focus on button
    btnRock.classList.add("btn--active");
    btnPaper.classList.remove("btn--active");
    btnScissors.classList.remove("btn--active");
    this._updateGameLabel("Select a Hand!");
    labelScore0.textContent = labelScore1.textContent = "0";
    imgHand0.src = `./assets/images/hands/rock-right.png`;
    imgHand1.src = `./assets/images/hands/default-left.png`;
    btnThrow.textContent = `Throw 👋 ${btnRock.textContent
      .slice(0, 15)
      .concat("(Enter)")}!`;
  }

  _loadGame() {
    if (!this.#mode) return alert("Please Select a Mode BELOW!");
    this.#rounds = +inputRound.value;
    const playerName = prompt("Ready! Enter Player Name:");
    labelName0.textContent = playerName ? playerName : "Player1";
    header.classList.add("hidden");
    modal.classList.add("hidden");
    overlay.classList.add("hidden");
    this._init();
  }

  _updatePlayerHand(hand) {
    const [...btns] = navHands.querySelectorAll(".btn");
    btns.forEach((btn) => btn.classList.remove("btn--active"));
    hand.classList.add("btn--active");
    this.#currHand.blur();
    this.#currHand = hand;
    imgHand0.src = `./assets/images/hands/${hand.value}-right.png`;
    btnThrow.textContent = `Throw 👋 ${hand.textContent
      .slice(0, 15)
      .concat("(Enter)")}!`;
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
    if (this.#flag) return;
    const clicked = e.target;
    if (!clicked) return;
    this._updatePlayerHand(clicked);
  }

  _handleKeydownPress(e) {
    switch (e.key.toLowerCase()) {
      case "enter":
        return this._updateGame();
      case "q":
        return this._updatePlayerHand(btnRock);
      case "w":
        return this._updatePlayerHand(btnPaper);
      case "e":
        return this._updatePlayerHand(btnScissors);
    }
  }

  _updateGame() {
    let str;
    if (this.#flag) return;
    this.#lastHand = this.#currHand;
    this.#roundOutcome = this._throwHands(
      this.#currHand,
      this._generateCompHand()
    );
    this.#flag = Object.values(this.#scores).some(
      (score) => score === this.#rounds
    );
    str = `${
      this.#roundOutcome === "player"
        ? labelName0.textContent
        : labelName1.textContent
    } Wins ${this.#flag ? "" : "This Round"}`;
    if (this.#flag)
      str = str.concat(`${this.#roundOutcome === "player" ? "🧐" : "🤖"} 🏆!`);
    this._updateGameLabel(str);
  }

  /////////////////////////////////////
  //////////// Game logic

  _throwHands(h1, h2) {
    const hands = [h1, h2];
    // Checks if player hand matches computer hand
    if (h1 === h2) {
      this._updateGameLabel("This Round is a Draw!");
      return "draw";
    }
    const { player: playerWinConds } = winConditions;

    for (const cond of playerWinConds) {
      const playerWinCond = Object.values(cond);
      // Compares every hand to see if player won this round
      if (hands.every((h, i) => h === playerWinCond[i])) {
        this.#scores.player++;
        labelScore0.textContent = this.#scores.player;
        return "player";
      }
    }

    this.#scores.computer++;
    labelScore1.textContent = this.#scores.computer;
    return "computer";
  }

  _generateCompHand() {
    let hand, idx;
    const generateRandHand = (hands = [btnRock, btnPaper, btnScissors]) =>
      hands[Math.floor(Math.random() * hands.length)];

    const { player: playerWinConds, computer: computerWinConds } =
      winConditions;
    // --- EASY MODE ---
    if (this.#mode === "easy") {
      playerWinConds.map((hands, i) => {
        if (this.#lastHand === hands.hand1) idx = i;
      });
      hand =
        this.#roundOutcome === "player"
          ? this.#lastHand
          : playerWinConds[idx]?.hand2;
    } // --- HARD MODE ---
    if (this.#mode === "hard") {
      computerWinConds.map((hands, i) => {
        if (this.#lastHand === hands.hand1) idx = i;
      });
      if (this.#roundOutcome === "player") {
        const arr = [];
        arr[0] = arr[1] = arr[2] = this.#lastHand;
        arr[3] = arr[4] = winConditions.computer[idx]?.hand2;
        hand = generateRandHand(arr);
      }
    }

    const computerHand = !hand ? generateRandHand() : hand;
    imgHand1.src = `./assets/images/hands/${computerHand.value}-left.png`;
    return computerHand;
  }
}

const app = new App();
