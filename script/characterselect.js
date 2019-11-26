const startGameButton = document.querySelector(".btn--start");
const pageWarning = document.querySelector(".page__warning");
startGameButton.disabled = true;

let chosenCharacter1;
let chosenCharacter2;

let player1Active = true;
let player2Active = false;

function chooseCharacter(id) {
    if (player1Active) {
        chosenCharacter1 = id;
        player1Active = false;
        player2Active = true;
        console.log("player1 satt");
    } 
    else if(player2Active) {
        if(id == chosenCharacter1) {
            console.log("ikke lov");
            pageWarning.style.display = "block";
            return;
        }
        chosenCharacter2 = id;
        player2Active = false;
        console.log("player2 satt");
        startGameButton.disabled = false;
        pageWarning.style.display = "none";
    }
}

function resetCharacters() {
    player1Active = true;
    startGameButton.disabled = true;
}

function setCharacterInLS() {
    localStorage.setItem("player1",chosenCharacter1);
    localStorage.setItem("player2",chosenCharacter2);
    console.log(localStorage.getItem("player2"));
    window.location.replace("file:///C:/Users/Admin/Documents/GitHub/semesterprosjekt2/index.html");
}