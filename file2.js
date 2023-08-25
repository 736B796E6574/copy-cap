// modal window functionality
let modal = document.getElementById("modalContainer");
let modalBtn = document.getElementById("modalBtn");
let span = document.getElementsByClassName("close")[0];

modalBtn.onclick = function () {
    modal.style.display = "block";
}

span.onclick = function () {
    modal.style.display = "none";
}

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// game functionailty
let titleScreen = document.getElementById("centering")
let startMenu = document.getElementById("start-menu");
let startBtn = document.getElementById("startBtn");
let gameContainer = document.getElementById("memory-game");
let counter = document.getElementById("timer");
let memoryCards = document.getElementsByClassName("memory-card");
let gameOverPage = document.getElementById("game-over-page");

startBtn.addEventListener("click", startGame);

function startGame() {
    startMenu.classList.add("hide");
    gameContainer.classList.remove("hide");
    countdown(2, 30);
}

function flipCards() {
    // functionality to flip the cards
    this.classList.toggle('flip');
}

for (let i = 0; i < memoryCards.length; i++) {
    memoryCards[i].addEventListener("click", flipCards);
}

function countdown(minutes, seconds) {
    function tick() {
        counter.innerHTML =
            minutes.toString() + ":" + (seconds < 10 ? "0" : "") + String(seconds);
        seconds--;
        if (seconds >= 0) {
            timeoutHandle = setTimeout(tick, 1000);
        } else {
            if (minutes >= 1) {
                setTimeout(function () {
                    countdown(minutes - 1, 59);
                }, 1000);
            }
        }
        if (counter.innerText === "0:00") {
                gameOverPage.classList.remove("hide");
                gameContainer.classList.add("hide");
                titleScreen.classList.add("hide")
        }
    }
    tick();
}

const cards = document.querySelectorAll('.memory-card');
let hasFlippedCard = false; // card not flipped yet
let firstCard, secondCard;
let confirmedFirst, confirmedSecond;
let selectedCardsCount = 0;

function flipCard() {
    if (this === firstCard) return;

    this.classList.add('flip');

    if (!hasFlippedCard) {
        hasFlippedCard = true;
        firstCard = this;
        firstCard.classList.add("disabled");
        return;
    }

    secondCard = this;
    secondCard.classList.add("disabled");
    hasFlippedCard = false;

    selectedCardsCount++; // Increment the counter
    console.log(selectedCardsCount)

    if (selectedCardsCount == 1) {
        disableRemainingCards();
    }
    checkForMatch();
}

function disableRemainingCards() {
    console.log("disabling cards...")
    cards.forEach(card => {
        if (card !== firstCard && card !== secondCard) {
            card.removeEventListener('click', flipCard);
            card.classList.add('disabled');
        }
    });
}

function checkForMatch() {
    let isMatch = firstCard.dataset.framework === secondCard.dataset.framework;
    isMatch ? disableCards() : unflipCards();
}

function disableCards() {
    confirmedFirst = firstCard
    confirmedSecond = secondCard
    confirmedFirst.classList.add('disabled');
    confirmedSecond.classList.add('disabled');
    resetBoard();
}

function unflipCards() {
    setTimeout(() => {
        firstCard.classList.remove('flip');
        secondCard.classList.remove('flip');
        resetBoard();
    }, 1000);
}

function resetBoard() {
    [firstCard, secondCard] = [null, null];
    hasFlippedCard = false;
    selectedCardsCount = 0; // Reset the counter
    cards.forEach(card => {
        if (card !== confirmedFirst && card !== confirmedSecond) {
            card.addEventListener('click', flipCard);
            card.classList.remove('disabled');
    }
    });
    console.log("Resetting...")
}


(function shuffle() {
   cards.forEach(card => {
     let ramdomPos = Math.floor(Math.random() * 12);
     card.style.order = ramdomPos;
   });
 })();

cards.forEach(card => card.addEventListener('click', flipCard));