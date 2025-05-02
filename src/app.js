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
  const colors = ["green", "yellow", "red", "blue"];
  return colors[_getRandomNumber(colors.length)];
}

const _setRandomCard = (actualCard) =>{
  const backgroundCard = actualCard.querySelector(".background-card");

  backgroundCard.style.backgroundColor = _getRandomColor();

  const numberText = backgroundCard.querySelector("h3");
  numberText.textContent = _getRandomNumber(10);
}

const _createFirstCard = () =>{
  const gameZone = document.querySelector("#game-zone");
  const templateFirstCard = document.querySelector("#template-player-card");
  const clone = templateFirstCard.content.cloneNode(true);
  const card = clone.querySelector(".player-card");
  card.classList.add("card-animation-start");
  _setRandomCard(clone);
  gameZone.appendChild(clone);
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      card.classList.remove("card-animation-start");
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
    _setRandomCard(clone);
    playerContainer.appendChild(clone);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        card.classList.remove("card-animation-start");
      });
    });
  }
}

const startGame = () => {
  _deleteButton();
  _createEnemyCards();
  _createFirstCard();
  _createPlayerCards();
}

window.startGame = startGame;
