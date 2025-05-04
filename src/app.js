const GREEN = "green";
const RED = "red";
const YELLOW = "yellow";
const BLUE = "blue";

function _delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const _activateReStartButton = () =>{
  const button = document.querySelector("#button-Restart")
  button.classList.remove("hidden");
}

const _setTurnTest = (text) =>{
  const turnText = document.querySelector(".turn-text");
  turnText.classList.remove("hidden");
  turnText.textContent = text;
}

const _deleteButton = () =>{
  const buttonPlayGame = document.getElementById("button-Play");
  buttonPlayGame.classList.add("hidden");
}

const _getEnemyCard = () =>{
  const enemyContainer = document.querySelector("#container-enemy-cards");
  const templateEnemyCard = document.querySelector("#template-enemy-card");
  const clone = templateEnemyCard.content.cloneNode(true);
  const card = clone.querySelector(".enemy-card");
  card.classList.add("card-animation-start");
  enemyContainer.appendChild(clone);
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      card.classList.remove("card-animation-start");
    });
  });
}

const _createEnemyCards = () => {
  for (let index = 0; index < 7; index++) {
    _getEnemyCard();
  }
};

const _getRandomNumber = (maxNumber) => {
  return Math.floor(Math.random() * maxNumber);
}

const _getRandomColor = () =>{
  const colors = [GREEN, YELLOW, RED, BLUE];
  return colors[_getRandomNumber(colors.length)];
}

const _setRandomCard = (card) => {
  const backgroundCard = card.querySelector(".background-card");

  const color = _getRandomColor();
  const number = _getRandomNumber(10);

  backgroundCard.style.backgroundColor = color;
  card.setAttribute("data-color", color);

  const numberText = backgroundCard.querySelector("h3");
  numberText.textContent = number;
  card.setAttribute("data-number", number);
};

const _getFirstCard = () =>{
  const gameZone = document.querySelector("#game-zone");
  const templateFirstCard = document.querySelector("#template-player-card");
  const clone = templateFirstCard.content.cloneNode(true);
  const card = clone.querySelector(".player-card");
  card.classList.add("card-animation-start");
  _setRandomCard(card);
  gameZone.appendChild(clone);
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      card.classList.remove("card-animation-start");
      card.classList.remove("player-card");
      card.classList.add("card-in-game");
    });
  });
}

const _getDeck = () =>{
  const gameZone = document.querySelector("#game-zone");
  const templateDeck = document.querySelector("#template-deck-card");
  const clone = templateDeck.content.cloneNode(true);
  const card = clone.querySelector(".deck");
  card.classList.add("card-animation-start");
  gameZone.appendChild(clone);
  card.setAttribute("onclick", "_playerUsesDeck()");
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      card.classList.remove("card-animation-start");
    });
  });
}

const _playerUsesDeck = () =>{
  _getPlayerCard();
  const card = document.querySelector(".deck");
  card.setAttribute("onclick", "");
  startEnemyTurn();
}

const _createInGameZone = () =>{
  _getFirstCard();
  _getDeck();
}

const _getPlayerCard = () =>{
  const playerContainer = document.querySelector("#container-player-cards");
  const templatePlayerCard = document.querySelector("#template-player-card");
  const clone = templatePlayerCard.content.cloneNode(true);
  const card = clone.querySelector(".player-card");
  card.classList.add("card-animation-start");
  _setRandomCard(card);
  playerContainer.appendChild(clone);
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      card.classList.remove("card-animation-start");
      card.setAttribute("onclick", "compareCards()");
    });
  });
}

const _createPlayerCards = ()=>{
  for (let index = 0; index < 7; index++) {
    _getPlayerCard();
  }
}

const _playSound = (ruteSound) =>{
  const sound = new Audio(ruteSound);
  sound.play();
}

const _setCardInGameStats = (newcolor, newNumber, cardInGame) =>{
  const backgroundCardInGame = cardInGame.querySelector(".background-card");
  backgroundCardInGame.style.backgroundColor = newcolor;
  cardInGame.setAttribute("data-color", newcolor);

  const numberTextInGame = backgroundCardInGame.querySelector("h3");
  numberTextInGame.textContent = newNumber;
  cardInGame.setAttribute("data-number", newNumber);
}

const _playerUsesCard = (cardPlayer, cardInGame) =>{
  cardPlayer.element.classList.add("card-move-up");
  cardPlayer.element.addEventListener('animationend', () => _disableUsedCard(cardPlayer.element));
  _setCardInGameStats(cardPlayer.color, cardPlayer.number, cardInGame.element);
}

const _disableUsedCard = (card) =>{
  card.classList.remove("d-flex");
  card.classList.add("hidden");
}

const _disablePlayerCards = () =>{
  const allPlayerCards = document.querySelectorAll(".player-card:not(.hidden)");
  allPlayerCards.forEach(card =>{
    card.setAttribute("onclick", "");
  });
  const deck = document.querySelector(".deck");
  deck.setAttribute("onclick", "");
}

const _ablePlayerCards = () =>{
  const allPlayerCards = document.querySelectorAll(".player-card:not(.hidden)");
  allPlayerCards.forEach(card =>{
    card.setAttribute("onclick", "compareCards()");
  });
  const deck = document.querySelector(".deck");
  deck.setAttribute("onclick", "_playerUsesDeck()");
}

const _calculateEnemyProbabiliy = () =>{
  const enemyHand = document.querySelectorAll(".enemy-card:not(.hidden)");
  const enemyCardsCount = enemyHand.length;
  const chanceSingleCard = 0.325;
  const probabilityNonePlayable = Math.pow(1 - chanceSingleCard, enemyCardsCount);
  const probabilityAtLeastOnePlayable = 1 - probabilityNonePlayable;

  return Math.random() < probabilityAtLeastOnePlayable;
}

const _hasPlayerWon = () => {
  const playerHand = document.querySelectorAll(".player-card:not(.hidden)");
  console.log(playerHand.length);
  if(playerHand.length >= 2){
    return false;
  }
  _activateReStartButton();
  return true;
}

const compareCards = () =>{
  const cardPlayer = event.currentTarget;
  const cardInGame = document.querySelector(".card-in-game");

  const playerStats = {
    element: cardPlayer,
    color: cardPlayer.getAttribute("data-color"),
    number: cardPlayer.getAttribute("data-number")
  };
  const inGameStats = {
    element: cardInGame,
    color: cardInGame.getAttribute("data-color"),
    number: cardInGame.getAttribute("data-number")
  }
  
  if(playerStats.color == inGameStats.color || playerStats.number == inGameStats.number){
    _playSound('assets/sounds/correct_Sound.mp3');
    _playerUsesCard(playerStats, inGameStats);
    if(_hasPlayerWon()){
      _setTurnTest("YOU WIN");
      _playSound("assets/sounds/win_Sound.mp3");
      return;
    }
    startEnemyTurn();
    return;
  }
  _playSound('assets/sounds/error_Sound.mp3');
}

const _enemyUseCard = () =>{
  const enemyHand = document.querySelectorAll(".enemy-card:not(.hidden)");
  const enemyCard = enemyHand[enemyHand.length-1];
  enemyCard.classList.add("card-move-down");
  enemyCard.addEventListener('animationend', () => _disableUsedCard(enemyCard));
}

const _setNewStatsByEnemy = () =>{
  const cardInGame = document.querySelector(".card-in-game");

  if(_getRandomNumber(2) == 0){
    _setCardInGameStats(_getRandomColor(), cardInGame.getAttribute("data-number"), cardInGame);
    return
  }
  _setCardInGameStats(cardInGame.getAttribute("data-color"), _getRandomNumber(10), cardInGame);
}

const _hasEnemyWon = () => {
  const enemyHand = document.querySelectorAll(".enemy-card:not(.hidden)");
  console.log(enemyHand.length);
  if(enemyHand.length >= 2){
    return false;
  }
  _activateReStartButton();
  return true;
}

async function startEnemyTurn() {
  _setTurnTest('ENEMY TURN!');
  _disablePlayerCards();

  await _delay(2000);
  _playSound("assets/sounds/card_Sound.mp3");
  if(_calculateEnemyProbabiliy()){
    _enemyUseCard();
    _setNewStatsByEnemy();

    await _delay(500);
    if(_hasEnemyWon()){
      _setTurnTest('YOU LOSE');
      _playSound("assets/sounds/lose_Sound.mp3");
      return;
    }
    
    _playSound("assets/sounds/turn_Sound.mp3");
    _setTurnTest('YOUR TURN!');
    _ablePlayerCards();

    return;
  }
  _getEnemyCard();
  _ablePlayerCards();
}

const startGame = () => {
  _deleteButton();
  _setTurnTest('YOUR TURN!');
  _createEnemyCards();
  _createInGameZone();
  _createPlayerCards();
}

const reStart = () =>{
  location.reload();
}

window.startGame = startGame;
window.compareCards = compareCards;
window._playerUsesDeck = _playerUsesDeck;
window.reStart = reStart;
