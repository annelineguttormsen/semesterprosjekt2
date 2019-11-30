const startGameButton = document.querySelector(".btn--green");
const pageWarning = document.querySelector(".page__warning");
startGameButton.disabled = true;

let chosenCharacter1;
let chosenCharacter2;

let player1Active = true;
let player2Active = false;

let cardDivs = document.querySelectorAll(".card");
let messageDiv = document.querySelector(".page__message");

function chooseCharacter(id) {
    if (player1Active) {
        chosenCharacter1 = id;
        player1Active = false;
        player2Active = true;
        let playerFlair = document.createElement("div");
        playerFlair.className = "player-flair";
        playerFlair.innerHTML = "Player 1";
        cardDivs[id].appendChild(playerFlair);
        console.log(playerFlair);
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
    window.location = "file:///C:/Users/Annel/Documents/noroff/design2/git/semesterprosjekt2/index.html";
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
    messageDiv.innerHTML = "<button onclick=\"removeMessage()\"class=\"btn btn--blue\">OK</button>";
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

function removeMessage() {
    messageDiv.style.display = "none";
}