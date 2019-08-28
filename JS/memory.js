//variables
let playPanel;
let firstPick = null;
let secondPick = null;
let tryText = 0;
let foundText = 0;
let scoreText = 0;
let svgs = [
    "../Memory/images/erschrocken.svg",
    "../Memory/images/lächelnd.svg",
    "../Memory/images/neutral.svg",
    "../Memory/images/skeptisch.svg",
    "../Memory/images/traurig.svg",
    "../Memory/images/wütend.svg",
    "../Memory/images/woah.svg",
    "../Memory/images/fertig.svg",
    "../Memory/images/übel.svg",
    "../Memory/images/meckern.svg"
];

let icons;

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

function addButtonListener() {
    let button = document.getElementById("restartButton");
    button.addEventListener("mousedown", restart);
    button.addEventListener("touchstart", restart);
}

function restart() {
    resetTries();
    resetFoundText();
    initIcons();
    resetFrontCards();
    resetBackCards();
}

function resetBackCards(){
    let backCards = Array.from(document.getElementsByClassName('card'));
    for (let back of backCards) {
        setRandomIcon(back);
    }
}

function resetFrontCards(){
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
    }
    if (firstPick !== card && secondPick === null) {
        secondPick = card;
    }
    comparePicks();
}

function comparePicks() {
    if (firstPick !== null && secondPick !== null) {
        window.setTimeout(() => {
            if (firstPick.getAttribute("name") === secondPick.getAttribute("name")) {
                setFoundText();
                firstPick = null;
                secondPick = null;
            } else {
                switchCardsToBack(firstPick);
                switchCardsToBack(secondPick);
                firstPick = null;
                secondPick = null;
            }
            setTries();
        }, 800);
    }
}

function resetFoundText(){
    let found = document.getElementById("foundText");
    foundText = 0;
    found.textContent = foundText;
}

function setFoundText() {
    let found = document.getElementById("foundText");
    foundText += 1;
    found.textContent = foundText;
    if (foundText === 10) {
        window.alert("Congratulations :) you win!");
    }
}

function switchCardsToBack(card) {
    card.setAttribute("class", "card");
}

function resetTries(){
    tryText = 0;
    let tries = document.getElementById('tryText');
    tries.textContent = tryText;
}

function setTries() {
    tryText += 1;
    let tries = document.getElementById('tryText');
    tries.textContent = tryText;
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