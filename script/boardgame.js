const canvas = document.getElementById("boardgame");
const ctx = canvas.getContext("2d");

//lag en funksjon for eventlistener til canvas
//så eventlistener kan både fjernes og legges til
function canvasEventListener() {
    mousePosition(event);
}
canvas.addEventListener("click",canvasEventListener);

//globale variabler
let dice, oldBoardPlaceNumber;

const characterImg = [
    "Eddard Stark",
    "Daenerysyresy",
    "Jon Snow",
    "Khal Drogo",
    "Cersei Lannister",
    "Arya Stark",
    "Tyrion Lannister",
    "Jaime Lannister",
    "Joffrey Baratheon",
    "Tormund Giantsbane"
];

//audio
let victoryAudio = new Audio("./audio/victory.WAV");
let introAudio = new Audio("./audio/introtoot.WAV");

//klasser
class Player {
    constructor(boardPlaceNumber,xPos,yPos,imgNr,active) {
        this.boardPlaceNumber = boardPlaceNumber;
        this.xPos = xPos;
        this.yPos = yPos;
        this.imgNr = characterImg[imgNr];
        this.active = active;
    }
    animateSliding(oBPN, bPN, goForward) {
        //deklarer en variabel som bestemmer lengen på timeout
        let i = 0;
        let x = 0;
        //lag closure til this objektet for loopen
        let thisObject = this;
        for (oBPN;oBPN<=bPN;oBPN++) {
            //for hver loop sett en timeout som hver er
            //300 millisekunder lengre enn forrige
            (function(oBPN) {
                setTimeout(function(){calculatePosition(thisObject,oBPN)},300*i);
                i++;
            }(oBPN));
            if (oBPN == 30) {
                setTimeout(function(){console.log("du vant!")},300*i);
                break;
            }
            if (oBPN == bPN) {
                //fjern eventlistener fra canvas inntil brikken er ferdig å flytte på seg
                setTimeout(function(){canvas.addEventListener("click",canvasEventListener)},300*i);
                //sjekk om player har havnet på en felle
                for (let y = 0;y<allTraps.length;y++) {
                    if (bPN == allTraps[y].boardPlaceNumber) {
                        setTimeout(function(){
                            allTraps[y].trapFunction(thisObject);
                        },300*i);
                    }
                }
            }
        }
        //funksjon for hvis token skal gå bakover
        if (goForward == false) {
            for (oBPN;oBPN>=bPN;oBPN--) {
                (function(oBPN) {
                    setTimeout(function(){calculatePosition(thisObject,oBPN)},300*i);
                    i++;
                }(oBPN));
                if (oBPN == 30) {
                    setTimeout(function(){console.log("du vant!")},300*i);
                    break;
                }
                if (oBPN == bPN) {
                    setTimeout(function(){canvas.addEventListener("click",canvasEventListener)},300*i);
                    //sjekk om player har havnet på en felle
                    for (let y = 0;y<allTraps.length;y++) {
                        if (bPN == allTraps[y].boardPlaceNumber) {
                            setTimeout(function(){
                                allTraps[y].trapFunction(thisObject);
                            },300*i);
                        }
                    }
                }
            }
        }
    }
}

class Trap {
    constructor(infoText,boardPlaceNumber, goForward, steps, specialFunction) {
        this.infoText = infoText;
        this.boardPlaceNumber = boardPlaceNumber;
        this.goForward = goForward;
        this.steps = steps;
        this.specialFunction = specialFunction;
    }
    trapFunction(token) {
        oldBoardPlaceNumber = token.boardPlaceNumber;
        if (this.specialFunction == "backtostart") {
            console.log("go back to start");
            //endre token sitt bPN til det nye, viktig så animatesliding metode blir riktig
            token.boardPlaceNumber -= this.steps;
            //gå til token og animer at spillebrikken går over brettet
            token.animateSliding(oldBoardPlaceNumber,1, false);
        }
        if (this.goForward == true) {
            console.log("jeg skal gå fremover");
            //endre token sitt bPN til det nye, viktig så animatesliding metode blir riktig
            token.boardPlaceNumber += this.steps;
            //gå til token og animer at spillebrikken går over brettet
            token.animateSliding(oldBoardPlaceNumber,token.boardPlaceNumber);
        } 
        if (this.goForward == false) {
            console.log("jeg skal gå bakover");
            //endre token sitt bPN til det nye, viktig så animatesliding metode blir riktig
            token.boardPlaceNumber -= this.steps;
            //gå til token og animer at spillebrikken går over brettet
            token.animateSliding(oldBoardPlaceNumber,token.boardPlaceNumber, false);
        }
        if (this.specialFunction == "switch") {
            console.log("switch plasser");
            for (let z = 0;z<playerArray.length;z++) {
                if (playerArray[z].active == false) {
                    oldBoardPlaceNumber = token.boardPlaceNumber;
                    token.boardPlaceNumber = playerArray[z].boardPlaceNumber;
                    playerArray[z].boardPlaceNumber = oldBoardPlaceNumber;
                    calculatePosition(token, token.boardPlaceNumber);
                    calculatePosition(playerArray[z],playerArray[z].boardPlaceNumber);
                }
                console.log("gått gjennom forløkke");
            }
        }
        if (this.specialFunction == "rollagain") {
            console.log("roll again");
            rollDice(token);
        }
    }
}

//objekter, deklarert med og uten klasse
let diceObject = {
    width:220,
    height:230,
    xPos:560,
    yPos:250
}

//få tak i imgnr fra ls, lag players ut av player klassen
let player1ImgNr = localStorage.getItem("player1");
let player2ImgNr = localStorage.getItem("player2");

let player1 = new Player(1,20,20,player1ImgNr,true);
let player2 = new Player(1,20,20,player2ImgNr,false);
let playerArray = [player1,player2];

let trapsPositions = [5,8,15,23,27];
//lag feller
let goBackToStart = new Trap("Go back to start",trapsPositions[0],undefined,undefined,"backtostart");
let twoStepsForward = new Trap("Take 2 steps forward",trapsPositions[1],true,2);
let fiveStepsBack = new Trap("Take 5 steps back",trapsPositions[2],false,5);
let switchPlaces = new Trap("Switch places",trapsPositions[3],undefined,undefined,"switch");
let rollAgain = new Trap("Roll again",trapsPositions[4],undefined,undefined,"rollagain");

let allTraps = [
    goBackToStart,
    twoStepsForward,
    fiveStepsBack,
    switchPlaces,
    rollAgain
];

/*let trapPosition = new Array();

for (var i = 0;i<5;i++) {
    let tilfeldigTall = (Math.ceil(Math.random()*28)+1);
    for (var i = 0;i<trapPosition.length;i++) {
        if (tilfeldigTall == trapPosition[i]) {
            if (tilfeldigTall == 29) {
                trapPosition.push(28);
            }
            else {
                tilfeldigTall = trapPosition[i]++;
            }
        }
    }
    trapPosition.push(tilfeldigTall);
}
console.log(trapPosition);*/

function rollDice(token) {
    //dice = Math.floor(Math.random()*6)+1;
    dice = 22;
    oldBoardPlaceNumber = token.boardPlaceNumber;
    //endre token sitt bPN til det nye, viktig så animatesliding metode blir riktig
    token.boardPlaceNumber += dice;
    //gå til token og animer at spillebrikken går over brettet
    token.animateSliding(oldBoardPlaceNumber,token.boardPlaceNumber);
    console.log("du rullet " + dice + " og er nå på " + token.boardPlaceNumber);
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
    update();
}

function update() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    //draw players
    drawObject(player1.xPos,player1.yPos,40,40,"#000");
    drawObject(player2.xPos,(player2.yPos+50),40,40,"tomato");
    //draw dice
    drawObject(diceObject.xPos,diceObject.yPos,diceObject.width,diceObject.height,"lightblue");
}
//fjern funksjon og sett opp startGame() funksjon
update();

//generell draw funksjon
function drawObject(xPos,yPos,width,height,bgcolor,img) {
    ctx.beginPath();
    if (bgcolor !== undefined) {
        ctx.fillStyle=bgcolor;
    }
    ctx.rect(xPos,yPos,width,height);
    ctx.fill();
    ctx.closePath();
}

function mousePosition(event) {
    //fjern eventlistener til players tur er over
    canvas.removeEventListener("click",canvasEventListener);
    //få tak i informasjon om canvas elementet
    let canvasInfo = canvas.getBoundingClientRect();
    //få deretter tak i informasjon om musepeker på client
    let x = event.clientX;
    let y = event.clientY;
    //regn ut posisjon av museklikk på canvas elementet
    canvasX = x - canvasInfo.left;
    canvasY = y - canvasInfo.top;
    if (canvasX > diceObject.xPos && canvasY > diceObject.yPos) {
        if (canvasX < (diceObject.xPos + diceObject.width) && canvasY < (diceObject.yPos + diceObject.width)) {
            rollDice(player1);
        }
    }
    else {
        console.log("mousePosition() fant ingenting");
        canvas.addEventListener("click",canvasEventListener);
    }
}

/*
function canvasMessage(info) {
    drawObject()
}
*/