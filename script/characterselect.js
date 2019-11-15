let startGameButton = document.querySelector(".btn--start");
startGameButton.disabled = true;

let chosenCharacter1;
let chosenCharacter2;

let player1Active = true;
let player2Active = false;

function chooseCharacter(id) {
    if (player1Active == true) {
        chosenCharacter1 = id;
        player1Active = false;
        player2Active = true;
        console.log("player1 satt");
    } 
    else if(player2Active == true) {
        chosenCharacter2 = id;
        player2Active = false;
        console.log("player2 satt");
        startGameButton.disabled = false;
    }
    console.log(id);
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