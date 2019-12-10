const characterImg = [
    "media/housebaratheon.png",
    "media/houselannister.png",
    "media/housestark.png",
    "media/housetyrell.png",
    "media/housetargaryen.png",
    "media/housetully.png"
];

const winnerGraphicWinner = document.querySelector(".winner-graphic__winner");
const winnerGraphicLoser = document.querySelector(".winner-graphic__loser");
const playerText = document.querySelector(".winner-hero__text");

let imgNrWinner = localStorage.getItem("winnerId");
let winnerName = localStorage.getItem("winnerName");
let imgNrLoser = localStorage.getItem("loserId");
let loserName = localStorage.getItem("loserName");

if (imgNrWinner !== undefined && winnerName !== undefined) {
    winnerGraphicWinner.src = characterImg[imgNrWinner];
    winnerGraphicLoser.src = characterImg[imgNrLoser];
    playerText.innerHTML = winnerName + " won!";
} else {
    //vis cheater div
}