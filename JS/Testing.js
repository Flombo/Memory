//variables
let playPanel;
let firstPick = null;
let secondPick = null;
let tryText = 0;
let foundText = 0;
let scoreText = 0;
let winDiv;
let winText;
let icons;
let success = new Audio("music/Success.wav");
let rightChoice = new Audio("music/correctChoice.wav");
let wrongChoice = new Audio("music/wrongChoice.wav");
let click = new Audio("music/click.wav");
let cardFlip = new Audio("music/cardFlip.wav");
let svgs = [
    "images/erschrocken.svg",
    "images/lächelnd.svg",
    "images/neutral.svg",
    "images/skeptisch.svg",
    "images/traurig.svg",
    "images/wütend.svg",
    "images/woah.svg",
    "images/fertig.svg",
    "images/übel.svg",
    "images/meckern.svg"
];

initIcons();

document.onloadend = placeCards();

//inits icon array
function initIcons() {
    icons = new Array(20);
    svgs.forEach((svg) => {
        icons.push(svg);
        icons[svg] = 2;
    });
}

function createWinDiv() {
    winDiv = document.createElement("div");
    winDiv.setAttribute("class", "win");
    winDiv.appendChild(createCongrat());
    return winDiv;
}

function createWinText() {
    winText = document.createElement("p");
    winText.innerHTML = "You win with:" + tryText + " tries!" +
        "your score is :" + scoreText + " Well done :)";
    return winText;
}

function createWinButton() {
    let winButton = document.createElement("button");
    winButton.textContent = "Close";
    winButton.addEventListener("mousedown", hideWinDiv);
    winButton.addEventListener("touchstart", hideWinDiv);
    return winButton;
}

function createCongrat() {
    let congrat = document.createElement("p");
    congrat.setAttribute("id", "congrat");
    congrat.innerHTML = "Congratulation!";
    return congrat;
}

function addButtonListener() {
    let button = document.getElementById("restartButton");
    button.addEventListener("mousedown", restart);
    button.addEventListener("touchstart", restart);
}

function restart() {
    click.play();
    hideWinDiv();
    resetTriesText();
    resetFoundText();
    resetScoreText();
    initIcons();
    resetFrontCards();
    resetBackCards();
}

function resetBackCards() {
    let backCards = Array.from(document.getElementsByClassName('card'));
    for (let back of backCards) {
        setRandomIcon(back);
    }
}

function resetFrontCards() {
    let frontCards = Array.from(document.getElementsByClassName('cardFront'));
    for (let card of frontCards) {
        switchCardsToBack(card);
        setRandomIcon(card);
    }
}

//when loaded placeCards
function placeCards() {
    addButtonListener();
    playPanel = document.getElementById('playPanel');
    playPanel.appendChild(createWinDiv());
    for (let x = 0; x < 20; x++) {
        playPanel.appendChild(createCard());
    }
}

//creates cards
function createCard() {
    let card = document.createElement('div');
    setRandomIcon(card);
    card.setAttribute("class", "card");
    card.addEventListener("mousedown", clickHandler);
    card.addEventListener("touchstart", clickHandler);

    return card;
}

//card click handler
function clickHandler() {
    let card = event.currentTarget;
    if (card.getAttribute("class") !== "cardFront" && secondPick === null) {
        switchCardToFront(card);
        checkPicks(card);
    }
}

function checkPicks(card) {
    if (firstPick === null) {
        firstPick = card;
        cardFlip.play();
    }
    if (firstPick !== card && secondPick === null) {
        secondPick = card;
        cardFlip.play();
    }
    comparePicks();
}

function comparePicks() {
    if (firstPick !== null && secondPick !== null) {
        window.setTimeout(() => {
            if (firstPick.getAttribute("name") === secondPick.getAttribute("name")) {
                rightChoice.play();
                setFoundText();
                firstPick = null;
                secondPick = null;
            } else {
                wrongChoice.play();
                switchCardsToBack(firstPick);
                switchCardsToBack(secondPick);
                firstPick = null;
                secondPick = null;
            }
            setTries();
        }, 800);
    }
}

function resetScoreText() {
    let score = document.getElementById("scoreText");
    scoreText = 0;
    score.textContent = scoreText;
}

function setScoreText() {
    let score = document.getElementById("scoreText");
    scoreText += (foundText * 20) - tryText * 5;
    score.textContent = scoreText;
}

function resetFoundText() {
    let found = document.getElementById("foundText");
    foundText = 0;
    found.textContent = foundText;
}

function setFoundText() {
    let found = document.getElementById("foundText");
    foundText += 1;
    found.textContent = foundText;
    setScoreText();
    checkIfAllfound();
}

function checkIfAllfound() {
    if (foundText === 10) {
        success.play();
        showWinDiv();
    }
}

function showWinDiv() {
    if (winText == null) {
        winDiv.appendChild(createWinText());
        winDiv.appendChild(createWinButton());
    }
    winDiv.setAttribute("id", "shown");
}

function hideWinDiv() {
    click.play();
    winDiv.setAttribute("id", "");
}

function switchCardsToBack(card) {
    cardFlip.play();
    card.setAttribute("class", "card");
}

function resetTriesText() {
    tryText = 0;
    let tries = document.getElementById('tryText');
    tries.textContent = tryText;
}

function setTries() {
    tryText += 1;
    let tries = document.getElementById('tryText');
    tries.textContent = tryText;
    setScoreText();
}

function switchCardToFront(card) {
    let iconID = card.getAttribute("name");
    card.innerHTML = "<img class='icon'" + "src=" + iconID + ">";
    card.setAttribute("class", "cardFront");
}

//sets random icon
function setRandomIcon(card) {
    let key = getRandomIconKey();
    let value = icons[key];
    let svg;
    if (value > 0) {
        icons[key] -= 1;
        svg = key;
        card.setAttribute("name", svg);
    } else {
        delete icons[key];
        setRandomIcon(card);
    }
}

//gets random key
function getRandomIconKey() {
    let index = Math.round(Math.random() * (svgs.length - 1));
    let containsElement = icons[svgs[index]];
    if (containsElement === undefined) {
        getRandomIconKey();
    }
    return svgs[index];
}