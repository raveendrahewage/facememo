const cards = document.querySelectorAll(".card");
const timerBtn = document.getElementById("timerBtn");
const timerDisplay = document.getElementById("timerDisplay");
const finishTime = document.getElementById("finishTime");
const model = document.getElementById("model");
const resetBtn = document.getElementById("resetBtn");
const easyBtn = document.getElementById("easyBtn");
const hardBtn = document.getElementById("hardBtn");
const tabBody = document.getElementById("tabBody");
var finishedTimes = [];

var isFlipped = false;
var flipedCount = 0;
successCount = 0;
var firstCard;
var secondCard;
var timerStarted = false;
var minutes = 0;
var seconds = 0;
var miliseconds = 0;
var gameType = "Easy";

hardBtn.addEventListener("click", hardChanges);
easyBtn.addEventListener("click", easyChanges);

function hardChanges() {
    gameReset();
    gameType = "Hard";
    hardBtn.classList.remove("btn-light");
    hardBtn.classList.add("btn-success");
    easyBtn.classList.remove("btn-success");
    easyBtn.classList.add("btn-light");
    cards.forEach((card) => {
        card.style.width = "15%";
        card.style.height = "15%";
    });

    for (let i = 16; i < 30; i++) {
        cards[i].classList.remove("hide");
    }
}

function easyChanges() {
    gameReset();
    gameType = "Easy";
    hardBtn.classList.add("btn-light");
    hardBtn.classList.remove("btn-success");
    easyBtn.classList.remove("btn-light");
    easyBtn.classList.add("btn-success");
    cards.forEach((card) => {
        card.style.width = "20%";
        card.style.height = "20%";
    });

    for (let i = 16; i < 30; i++) {
        cards[i].classList.add("hide");
    }
}

cards.forEach((card) => card.addEventListener("click", flip));

function flip() {
    if (!timerStarted) {
        timerStarted = true;
    }
    if (flipedCount < 2) {
        this.classList.add("flip");
        flipedCount++;
        if (!isFlipped) {
            isFlipped = true;
            firstCard = this;
        } else {
            secondCard = this;
            checkIt();
        }
    }
}

function checkIt() {
    firstCard.dataset.image === secondCard.dataset.image ? success() : failed();
}

model.onclick = function() {
    model.classList.add("hide");
}

function success() {
    firstCard.removeEventListener("click", flip);
    secondCard.removeEventListener("click", flip);
    successCount++;
    if (successCount === 8 && gameType === "Easy") {
        finishTimeDisplay();
    } else if (successCount === 15 && gameType === "Hard") {
        finishTimeDisplay();
    }
    reset();
}

function finishTimeDisplay() {
    timerStarted = false;
    successCount = 0;
    minutes < 10 ? dispMinutes = "0" + minutes : dispMinutes = minutes;
    seconds < 10 ? dispSeconds = "0" + seconds : dispSeconds = seconds;
    miliseconds < 10 ? dispMiliseconds = "0" + miliseconds : dispMiliseconds = miliseconds;
    finishedTimes.push(gameType + " - " + dispMinutes + ":" + dispSeconds + ":" + dispMiliseconds);

    finishTime.innerText = "Time:" + dispMinutes + ":" + dispSeconds + ":" + dispMiliseconds;
    model.classList.remove("hide");

    tabBody.innerHTML = "";

    for (let i = 0; i < finishedTimes.length; i++) {
        const tr = document.createElement("tr");
        const th = document.createElement("th");
        const td = document.createElement("td");
        const time = document.createTextNode(finishedTimes[i]);
        td.appendChild(time);
        const attempt = document.createTextNode(i + 1);
        th.appendChild(attempt);
        tr.appendChild(th);
        tr.appendChild(td);
        tabBody.appendChild(tr);
    }
}

function failed() {
    setTimeout(() => {
        firstCard.classList.remove("flip");
        secondCard.classList.remove("flip");
        reset();
    }, 500);
}

function reset() {
    isFlipped = false;
    firstCard = null;
    secondCard = null;
    flipedCount = 0;
}

function shuffle() {
    cards.forEach((card) => {
        if (!card.classList.contains("hide")) {
            if (gameType === "Easy") {
                var index = Math.floor(Math.random() * 16);
                card.style.order = index;
            } else if (gameType === "Hard") {
                var index = Math.floor(Math.random() * 30);
                card.style.order = index;
            }
        }
    });
};

timerBtn.addEventListener("click", btnChanger);

function btnChanger() {
    timerStarted ? timerStarted = false : timerStarted = true;
}
setInterval(() => {
    timer();
    if (miliseconds === 100) {
        miliseconds = 0;
        seconds++;
    }
    if (seconds === 60) {
        seconds = 0;
        minutes++;
    }
    var dispMinutes;
    var dispSeconds;
    var dispMiliseconds;
    minutes < 10 ? dispMinutes = "0" + minutes : dispMinutes = minutes;
    seconds < 10 ? dispSeconds = "0" + seconds : dispSeconds = seconds;
    miliseconds < 10 ? dispMiliseconds = "0" + miliseconds : dispMiliseconds = miliseconds;

    timerDisplay.innerText = dispMinutes + ":" + dispSeconds + ":" + dispMiliseconds;
}, 10);

function timer() {
    if (timerStarted) {
        timerBtn.classList.remove("btn-warning");
        timerBtn.classList.add("btn-light");
        timerBtn.innerText = "Stop Timer";
        miliseconds++;
    } else {
        timerBtn.classList.remove("btn-light");
        timerBtn.classList.add("btn-warning");
        timerBtn.innerText = "Start Timer";
    }
}

resetBtn.addEventListener("click", gameReset);

function gameReset() {
    timerStarted = false;
    minutes = 0;
    seconds = 0;
    miliseconds = 0;
    timerDisplay.innerText = "00:00:00";
    timerBtn.innerText = "Start Timer";
    cards.forEach((card) => {
        if (card.classList.contains("flip")) {
            card.classList.remove("flip");
            card.addEventListener("click", flip);
        }

    });
    shuffle();
}

window.onload = shuffle();