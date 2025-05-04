const GREEN = "green";
const RED = "red";
const YELLOW = "yellow";
const BLUE = "blue";

function _delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
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

const _createEnemyCards = () => {
  const enemyContainer = document.querySelector("#container-enemy-cards");
  const templateEnemyCard = document.querySelector("#template-enemy-card");
  for (let index = 0; index < 7; index++) {
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

const _createFirstCard = () =>{
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

const _createPlayerCards = ()=>{
  const playerContainer = document.querySelector("#container-player-cards");
  const templatePlayerCard = document.querySelector("#template-player-card");
  for (let index = 0; index < 7; index++) {
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
}
const _ablePlayerCards = () =>{
  const allPlayerCards = document.querySelectorAll(".player-card:not(.hidden)");
  allPlayerCards.forEach(card =>{
    card.setAttribute("onclick", "compareCards()");
  });
}

const _calculateEnemyProbabiliy = () =>{
  const enemyHand = document.querySelectorAll(".enemy-card");
  const enemyCardsCount = enemyHand.length;
  const chanceSingleCard = 0.325;
  const probabilityNonePlayable = Math.pow(1 - chanceSingleCard, enemyCardsCount);
  const probabilityAtLeastOnePlayable = 1 - probabilityNonePlayable;

  return probabilityAtLeastOnePlayable >= 0.5;
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

async function startEnemyTurn() {
  _setTurnTest('ENEMY TURN!');
  _disablePlayerCards();

  await _delay(2000);

  if(_calculateEnemyProbabiliy()){
    alert("enemigo tiene carta");
    _enemyUseCard();
    _setNewStatsByEnemy();
    
    await _delay(2000);

    _setTurnTest('YOUR TURN!');
    _ablePlayerCards();

    return;
  }
  alert("enemigo no tiene carta");
}

const startGame = () => {
  _deleteButton();
  _setTurnTest('YOUR TURN!');
  _createEnemyCards();
  _createFirstCard();
  _createPlayerCards();
}

window.startGame = startGame;
window.compareCards = compareCards;
