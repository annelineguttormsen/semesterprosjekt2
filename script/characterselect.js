const startGameButton = document.querySelector(".btn--start");
const pageWarning = document.querySelector(".page__warning");
const playerFlair1 = document.querySelector(".player1-flair");
const playerFlair2 = document.querySelector(".player2-flair");

startGameButton.disabled = true;

let chosenCharacter1;
let chosenCharacter2;

let player1Active = true;
let player2Active = false;

let cardDivs = document.querySelectorAll(".card");
let messageDiv = document.querySelector(".page__message");

function chooseCharacter(id) {
    if (player1Active == false && player2Active == false) {
        console.log("alle karakterer satt");
        return;
    }
    if (player1Active) {
        chosenCharacter1 = id;
        player1Active = false;
        player2Active = true;
        // let playerFlair = document.createElement("img");
        // playerFlair.className = "player-flair";
        // playerFlair.src = "media/player1-flair.svg";
        cardDivs[id].appendChild(playerFlair1);
        localStorage.setItem("player1",chosenCharacter1);
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
        //legg til flair
        let playerFlair = document.createElement("div");
        playerFlair.className = "player-flair";
        playerFlair.innerHTML = "Player 2";
        cardDivs[id].appendChild(playerFlair);
        localStorage.setItem("player2",chosenCharacter2);
        console.log("player2 satt");
        startGameButton.disabled = false;
        pageWarning.style.display = "none";
    }
}

function resetCharacters() {
    console.log("tilbakestill karakterer");
    player1Active = true;
    startGameButton.disabled = true;
    let playerFlair = document.getElementsByClassName("player-flair");
    console.log(playerFlair);
    for (let i=0;i<playerFlair.length;i++) {
        playerFlair[i].style.display = "none";
    }
    console.log(playerFlair[0] + playerFlair[1]);
    localStorage.clear();
}

//ajax
let indexHouses = [15,229,362,397,378,395];

let request = new XMLHttpRequest();
(function loop(i, length) {
    if (i>= length) {
        return;
    }
    let url = "https://anapioficeandfire.com/api/houses/" + indexHouses[i];

    request.open("GET", url);
    request.onreadystatechange = function() {
        if(request.readyState === XMLHttpRequest.DONE && request.status === 200) {
            let data = JSON.parse(request.responseText);
            indexHouses[i] = data;
            loop(i+1, length);
        }
    }
    request.send();
})(0, indexHouses.length);

function infoHousesAjax(id) {
    //hvis xhr ikke har gjort om tallene til objekt, slutt
    if (indexHouses[id].name == undefined) {
        return;
    }
    //gjør .page__message synlig, fjern innhold
    messageDiv.style.display = "block";
    messageDiv.innerHTML = "<button onclick=\"removeMessage(this)\"class=\"btn btn--blue\">OK</button>";
    let infoArray = ["words","region","coatOfArms"];
    makeElement("h1","",indexHouses[id].name,messageDiv);
    makeElement("p","Words: ",indexHouses[id].words,messageDiv);
    makeElement("p","Region: ",indexHouses[id].region,messageDiv);
    makeElement("p","Coat of Arms: ", indexHouses[id].coatOfArms,messageDiv);
    makeElement("p","Founded: ",indexHouses[id].founded,messageDiv);
    makeElement("p","Ancestral Weapons: ",indexHouses[id].ancestralWeapons,messageDiv);
}

function makeElement(elmt,boldcontent,content,pElmt) {
    //hvis house objekt ikke er defined, ikke lag element
    if (content == undefined || content == "") {
        return;
    }
    let element = document.createElement(elmt);
    element.innerHTML = "<b>" + boldcontent + "</b>" + content;
    pElmt.appendChild(element);
}

function removeMessage(elmt) {
    elmt.parentElement.style.display = "none";
}

function startGame() {
    window.location = "boardgame.html";
}