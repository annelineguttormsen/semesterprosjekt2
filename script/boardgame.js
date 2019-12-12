const canvas = document.getElementById("boardgame");
const ctx = canvas.getContext("2d");

//lag en funksjon for eventlistener til canvas
//så eventlistener kan både fjernes og legges til
function canvasEventListener() {
    mousePosition(event);
}
canvas.addEventListener("click",canvasEventListener);

//globale variabler
let dice, oldBoardPlaceNumber, 
    activeTrap = false;

const characterImg = [
    document.querySelector(".housebaratheon"),
    document.querySelector(".houselannister"),
    document.querySelector(".housestark"),
    document.querySelector(".housetyrell"),
    document.querySelector(".housetargaryen"),
    document.querySelector(".housetully")
];

//ikoner
const player1Icon = document.querySelector(".player1--img");
const player2Icon = document.querySelector(".player2--img");
const trapIcon = document.querySelector(".trap--img");
const messageBG = document.querySelector(".message--img");
const player1Flair = document.querySelector(".player1-flair");
const player2Flair = document.querySelector(".player2-flair");

const onepip = document.querySelector(".onepip--img");
const twopip = document.querySelector(".twopip--img");
const threepip = document.querySelector(".threepip--img");
const fourpip = document.querySelector(".fourpip--img");
const fivepip = document.querySelector(".fivepip--img");
const sixpip = document.querySelector(".sixpip--img");

const pageLoad = document.querySelector(".page__load");
const pageWarningCharacter = document.querySelector(".page__warning--character");

let pips = [
    onepip,twopip,threepip,fourpip,fivepip,sixpip
];

//klasser
class Player {
    constructor(id,boardPlaceNumber,xPos,yPos,bgColor,imgNr,activeTurn,name,flair) {
        this.id = id;
        this.boardPlaceNumber = boardPlaceNumber;
        this.xPos = xPos;
        this.yPos = yPos;
        this.bgColor = bgColor;
        this.imgNr = characterImg[imgNr];
        this.activeTurn = activeTurn;
        this.name = name;
        this.flair = flair;
    }
    animateSliding(oBPN, bPN, goForward) {
        canvas.removeEventListener("click",canvasEventListener);
        //deklarer en variabel som bestemmer lengen på timeout
        let i = 0;
        //lag closure til this objektet for loopen
        let thisObject = this;
        //funksjon for hvis token skal gå bakover
        if (goForward == false) {
            for (oBPN;oBPN>=bPN;oBPN--) {
                (function(oBPN) {
                    setTimeout(function(){calculatePosition(thisObject,oBPN)},300*i);
                    i++;
                }(oBPN));
                if (oBPN == bPN) {
                    setTimeout(function(){
                        canvas.addEventListener("click",canvasEventListener);
                        for (let z in playerArray) {
                            playerArray[z].activeTurn = !playerArray[z].activeTurn;
                            if (playerArray[z].activeTurn) {
                                activePlayer = playerArray[z];
                            }
                        }
                        updateBanner();
                    },300*i);
                }
            }
        } else {
            for (oBPN;oBPN<=bPN;oBPN++) {
                //for hver loop sett en timeout som hver er
                //300 millisekunder lengre enn forrige
                (function(oBPN) {
                    setTimeout(function(){calculatePosition(thisObject,oBPN)},300*i);
                    i++;
                }(oBPN));
                if (oBPN == 30) {
                    setTimeout(function(){
                        canvas.addEventListener("click",canvasEventListener);
                        winGame(thisObject);
                    },300*i);
                    break;
                }
                if (oBPN == bPN) {
                    //sjekk om player har havnet på en felle
                    for (let y = 0;y<allTraps.length;y++) {
                        if (bPN == allTraps[y].boardPlaceNumber) {
                            activeTrap = true;
                            setTimeout(function(){
                                diceObject.activeEventListener = false;
                                messageObject.trapFunction = function() {
                                    allTraps[y].trapFunction(thisObject);
                                }
                                canvasMessage(allTraps[y].infoText);
                            },300*i);
                        }
                    }
                    //legg til eventlistener på canvas når brikken er ferdig å flytte på seg
                    setTimeout((function(){
                        canvas.addEventListener("click",canvasEventListener);
                        //gå gjennom playerarray og bytt om booleans
                        for (let z in playerArray) {
                            playerArray[z].activeTurn = !playerArray[z].activeTurn;
                            if (playerArray[z].activeTurn) {
                                activePlayer = playerArray[z];
                            }
                        }
                        if (!activeTrap) {
                            updateBanner();
                        } else {
                            activeTrap = false;
                        }
                    }),300*i);
                }
            }
        }
    }
}

class Trap {
    constructor(xPos,yPos,infoText,boardPlaceNumber, goForward, steps, specialFunction) {
        this.xPos = xPos;
        this.yPos = yPos;
        this.infoText = infoText;
        this.boardPlaceNumber = boardPlaceNumber;
        this.goForward = goForward;
        this.steps = steps;
        this.specialFunction = specialFunction;
    }
    trapFunction(token) {
        oldBoardPlaceNumber = token.boardPlaceNumber;
        if (this.specialFunction == "backtostart") {
            //endre token sitt bPN til det nye, viktig så animatesliding metode blir riktig
            token.boardPlaceNumber = 1;
            //gå til token og animer at spillebrikken går over brettet
            token.animateSliding(oldBoardPlaceNumber,1, false);
        }
        if (this.goForward == true) {
            //endre token sitt bPN til det nye, viktig så animatesliding metode blir riktig
            token.boardPlaceNumber += this.steps;
            //gå til token og animer at spillebrikken går over brettet
            token.animateSliding(oldBoardPlaceNumber,token.boardPlaceNumber,undefined);
        } 
        if (this.goForward == false) {
            //endre token sitt bPN til det nye, viktig så animatesliding metode blir riktig
            token.boardPlaceNumber -= this.steps;
            //gå til token og animer at spillebrikken går over brettet
            token.animateSliding(oldBoardPlaceNumber,token.boardPlaceNumber, false);
        }
        if (this.specialFunction == "switch") {
            for (let z in playerArray) {
                if (playerArray[z].activeTurn) {
                    oldBoardPlaceNumber = token.boardPlaceNumber;
                    token.boardPlaceNumber = playerArray[z].boardPlaceNumber;
                    playerArray[z].boardPlaceNumber = oldBoardPlaceNumber;
                    calculatePosition(token, token.boardPlaceNumber);
                    calculatePosition(playerArray[z],playerArray[z].boardPlaceNumber);
                }
            }
            token.animateSliding(token.boardPlaceNumber,token.boardPlaceNumber,false);
        }
        if (!token.activeTurn) {
            for (let z in playerArray) {
                playerArray[z].activeTurn = !playerArray[z].activeTurn;
                if (playerArray[z].activeTurn) {
                    activePlayer = playerArray[z];
                }
            }
        }
        if (this.specialFunction == "rollagain") {
            rollDice(token);
        }
        diceObject.activeEventListener = true;
    }
}

//objekter, deklarert med og uten klasse
let diceObject = {
    width:220,
    height:230,
    xPos:580,
    yPos:250,
    activeEventListener:true,
    pips:0
}

let winActiveEventListener = false;

//få tak i imgnr fra ls, lag players ut av player klassen
let player1ImgNr = localStorage.getItem("player1");
let player2ImgNr = localStorage.getItem("player2");

let player1 = new Player(player1ImgNr,1,20,20, "#3480eb", player1ImgNr,true,"Player 1",player1Flair);
let player2 = new Player(player2ImgNr,1,20,20, "tomato", player2ImgNr,false, "Player 2",player2Flair);
let playerArray = [player1,player2];
let activePlayer = player1;

//fresh hjelp fra stackoverflow, min gud
//bruk en "fisher-yates shuffle" for å shuffle tall mellom 6-29
//deretter velg en tilfeldig index (minus 5) og velg de neste 5 tallene
function shuffleArray(array) {
    let i = array.length,
        j = 0,
        temp;
    while (i--) {
        j = Math.floor(Math.random() * (i+1));
        // swap randomly chosen element with current element
        temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let randomIndex = Math.ceil(Math.random()*(array.length-5));
    array = array.splice(randomIndex,5);
    return array;
}

let trapsPositions = shuffleArray([6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,23,24,25,26,27,28,29]);

//lag feller
let goBackToStart = new Trap(0,0,"You encounter a dragon, its firebreath wreaks \nhavoc on your armour. You see no other way... \nGo back to start",trapsPositions[0],undefined,undefined,"backtostart");
let twoStepsForward = new Trap(0,0,"A witch stops you in your path, you've stepped \ninto her swamp! You're suddenly light on your feet.\nGo 2 steps forward",trapsPositions[1],true,2);
let fiveStepsBack = new Trap(0,0,"You see a hut and it's full of thieves! You're worried\n they'll notice and you can't spare your gold.\nGo 5 steps back",trapsPositions[2],false,5);
let switchPlaces = new Trap(0,0,"A magical portal engulfs you and you catch\na glimpse of your opponent for just a second. \nSwitch places with your opponent",trapsPositions[3],undefined,undefined,"switch");
let rollAgain = new Trap(0,0,"A huge rock falls out of the heavens,\nknocking you out cold. You're a little confused.\nRoll again",trapsPositions[4],undefined,undefined,"rollagain");

let allTraps = [
    goBackToStart,
    twoStepsForward,
    fiveStepsBack,
    switchPlaces,
    rollAgain
];

//kalkuler posisjonene til felle basert på BPN
for (let trapIndex in allTraps) {
    calculatePosition(allTraps[trapIndex],allTraps[trapIndex].boardPlaceNumber);
}

let messageObject = {
    activeEventListener: false,
    trapFunction: function() {
        allTraps[0].trapFunction(player1);
    },
    xPos:90,
    yPos:125
}

function rollDice(token) {
    dice = Math.ceil(Math.random()*6);
    diceObject.pips = dice;
    oldBoardPlaceNumber = token.boardPlaceNumber;
    //endre token sitt bPN til det nye, viktig så animatesliding metode blir riktig
    token.boardPlaceNumber += dice;
    //gå til token og animer at spillebrikken går over brettet
    token.animateSliding(oldBoardPlaceNumber,token.boardPlaceNumber);
    updatePlayerAndDice();
}

function calculatePosition(token, boardPlaceNumber) {
    //regn ut hvor Y er ut fra 6 mulige y posisjoner
    let YPosRow = Math.trunc((boardPlaceNumber/6)-0.1);
    token.yPos = (YPosRow*90)+20;
    //X pos varierer om den skal gå til høyre eller venstre
    //sjekk y pos for om det er heltall om den skal gå til venstre
    if (YPosRow%2==0) {
        if (boardPlaceNumber%6 == 0) {
            token.xPos = 470;
        } else {
            token.xPos = (((boardPlaceNumber%6)-1)*90+20);
        }
    }
    //hvis y er et deltall skal x posisjon gå til høyre
    if (YPosRow%2==1) {
        if (boardPlaceNumber%6 == 0) {
            token.xPos = 20;
        } else {
            token.xPos = 560-((boardPlaceNumber%6)*90);
        }
    }
    updateBoard();
}

function updateBoard() {
    ctx.clearRect(0,0,570,canvas.height);
    drawTraps();
    //draw players
    drawPlayers();
}

function updateBanner() {
    ctx.clearRect(580,0,320,250);
    ctx.drawImage(activePlayer.imgNr,600,100,150,150);
    ctx.drawImage(activePlayer.flair,575,80,200,60);
}

function updatePlayerAndDice() {
    //draw playerinfo
    ctx.clearRect(580,250,320,canvas.height);
    if (diceObject.pips != 0) {
        ctx.drawImage((pips[diceObject.pips-1]),600,320,150,150);
    }
}

function drawPlayers() {
    for (let i in playerArray) {
        ctx.beginPath();
        if (playerArray[i].bgColor == "tomato"){
            ctx.drawImage(player2Icon, playerArray[i].xPos, (playerArray[i].yPos+50),40,40);
        }
        else {
            ctx.drawImage(player1Icon, playerArray[i].xPos, playerArray[i].yPos,40,40);
        }
        ctx.fillStyle = playerArray[i].bgColor;
        ctx.fill();
        ctx.closePath();
    }
}

function drawTraps() {
    for (let i in allTraps) {
        ctx.drawImage(trapIcon,(allTraps[i].xPos+55),(allTraps[i].yPos+55),30,30);
    }
}

function mousePosition(event) {
    //få tak i informasjon om canvas elementet
    let canvasInfo = canvas.getBoundingClientRect();
    //få deretter tak i informasjon om musepeker på client
    let x = event.clientX;
    let y = event.clientY;
    //regn ut posisjon av museklikk på canvas elementet
    let canvasX = x - canvasInfo.left;
    let canvasY = y - canvasInfo.top;
    if (diceObject.activeEventListener) {
        if (canvasX > diceObject.xPos && canvasY > diceObject.yPos) {
            if (canvasY < (diceObject.yPos + diceObject.height)) {
                rollDice(activePlayer);
            }
        }
    }
    if (messageObject.activeEventListener) {
        if (canvasX > 250 && canvasY > 245) {
            if (canvasX < 350 && canvasY < 280) {
                updateBoard();
                updatePlayerAndDice();
                //message skal fjernes, så gjør om til false
                //dice object skal kunne brukes igjen, så sett til true
                messageObject.activeEventListener = false;
                diceObject.activeEventListener = true;
                //DEBUG
                canvas.addEventListener("click",canvasEventListener);
                messageObject.trapFunction(player1);    
            }
        }
    }
    if (winActiveEventListener) {
        if (canvasX > 250 && canvasY > 245) {
            if (canvasX < 350 && canvasY < 280) {
                window.location = "winnerpage.html";
            }
        }
    }
}

function canvasMessage(info) {
    messageObject.activeEventListener = true;
    ctx.drawImage(messageBG,messageObject.xPos,messageObject.yPos);
    let sentences = info.split("\n");
    let i;
    for (i = 0;i<sentences.length;i++) {
        ctx.beginPath();
        ctx.font = "18px Karla";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.textBaseline = "hanging";
        ctx.fillText(sentences[i],300,(150+(30*i)));
        ctx.closePath();
    }
}

function winGame(token) {
    diceObject.activeEventListener = false;
    winActiveEventListener = true;
    localStorage.setItem("winnerName", token.name);
    localStorage.setItem("winnerId",token.id);
    for (let z in playerArray) {
        playerArray[z].activeTurn = !playerArray[z].activeTurn;
        if (playerArray[z].activeTurn) {
            activePlayer = playerArray[z];
        }
    }
    localStorage.setItem("loserName",activePlayer.name);
    localStorage.setItem("loserId",activePlayer.id);
    ctx.drawImage(messageBG,messageObject.xPos,messageObject.yPos);
    ctx.beginPath();
    ctx.font = "18px Karla";
    ctx.fillStyle = "black";
    ctx.textAlign = "center";
    ctx.textBaseline = "hanging";
    ctx.fillText((token.name + " won!"),300,150);
    ctx.fillText("You've bested your opponent in a game of luck",300,180);
    ctx.fillText("Go on and reap your reward!",300,210);
    ctx.closePath();
}

function startGame() {
    if (localStorage.getItem("player1") == undefined) {
        pageWarningCharacter.style.display = "block";
        pageWarningCharacter.style.zIndex = 3;
        return;
    }
    updateBoard();
    updateBanner();
    updatePlayerAndDice();
    //document.fonts.load("18px Karla");
    pageLoad.style.display = "none";
}

window.addEventListener("load",startGame);