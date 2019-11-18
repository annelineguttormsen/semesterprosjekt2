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
    constructor(boardPlaceNumber,xPos,yPos,imgNr,activeTurn) {
        this.boardPlaceNumber = boardPlaceNumber;
        this.xPos = xPos;
        this.yPos = yPos;
        this.imgNr = characterImg[imgNr];
        this.activeTurn = activeTurn;
    }
    animateSliding(oBPN, bPN, goForward) {
        //deklarer en variabel som bestemmer lengen på timeout
        let i = 0;
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
                //sjekk om player har havnet på en felle
                for (let y = 0;y<allTraps.length;y++) {
                    if (bPN == allTraps[y].boardPlaceNumber) {
                        setTimeout(function(){
                            diceObject.activeEventListener = false;
                            messageObject.trapFunction = function() {
                                allTraps[y].trapFunction(thisObject);
                            }
                            canvasMessage(allTraps[y].infoText);
                            //allTraps[y].trapFunction(thisObject);
                        },300*i);
                    }
                }
                //fjern eventlistener fra canvas inntil brikken er ferdig å flytte på seg
                setTimeout(function(){canvas.addEventListener("click",canvasEventListener)},300*i);
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
                    //sjekk om player har havnet på en felle
                    for (let y = 0;y<allTraps.length;y++) {
                        if (bPN == allTraps[y].boardPlaceNumber) {
                            setTimeout(function(){
                                diceObject.activeEventListener = false;
                                messageObject.trapFunction = function() {
                                    allTraps[y].trapFunction(thisObject);
                                }
                                canvasMessage(allTraps[y].infoText);
                                //allTraps[y].trapFunction(thisObject);
                            },300*i);
                        }
                    }
                    setTimeout(function(){canvas.addEventListener("click",canvasEventListener)},300*i);
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
            token.boardPlaceNumber = 1;
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
                if (playerArray[z].activeTurn == false) {
                    oldBoardPlaceNumber = token.boardPlaceNumber;
                    token.boardPlaceNumber = playerArray[z].boardPlaceNumber;
                    playerArray[z].boardPlaceNumber = oldBoardPlaceNumber;
                    calculatePosition(token, token.boardPlaceNumber);
                    calculatePosition(playerArray[z],playerArray[z].boardPlaceNumber);
                }
            }
        }
        if (this.specialFunction == "rollagain") {
            console.log("roll again");
            rollDice(token);
        }
        diceObject.activeEventListener = true;
    }
}

//objekter, deklarert med og uten klasse
let diceObject = {
    width:220,
    height:230,
    xPos:560,
    yPos:250,
    activeEventListener:true
}

//få tak i imgnr fra ls, lag players ut av player klassen
let player1ImgNr = localStorage.getItem("player1");
let player2ImgNr = localStorage.getItem("player2");

let player1 = new Player(1,20,20,player1ImgNr,true);
let player2 = new Player(1,20,20,player2ImgNr,false);
let playerArray = [player1,player2];

let trapsPositions = [5,8,15,23,27];
//lag feller
let goBackToStart = new Trap("Go \nback to \nstart",trapsPositions[0],undefined,undefined,"backtostart");
let twoStepsForward = new Trap("Take \n2 steps \nforward",trapsPositions[1],true,2);
let fiveStepsBack = new Trap("Take \n5 steps \nback",trapsPositions[2],false,5);
let switchPlaces = new Trap("Swi\ntch \nplaces",trapsPositions[3],undefined,undefined,"switch");
let rollAgain = new Trap("Ro\nll a\ngain",trapsPositions[4],undefined,undefined,"rollagain");

let allTraps = [
    goBackToStart,
    twoStepsForward,
    fiveStepsBack,
    switchPlaces,
    rollAgain
];

let messageObject = {
    activeEventlistener: false,
    trapFunction: function() {
        allTraps[0].trapFunction(player1);
    },
    xPos:350,
    yPos:230,
    width:100,
    height:30
}

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
    dice = Math.floor(Math.random()*6)+1;
    //DEBUG: fjern når ferdig
    //dice = 4;
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
            if (diceObject.activeEventListener) {
                rollDice(player1);
            }
        }
    }
    //SJEKK KNAPP PÅ CANVASMESSAGE
    else if (canvasX > messageObject.xPos && canvasY > messageObject.yPos) {
        if (canvasX < (messageObject.xPos + messageObject.width) && canvasY < (messageObject.yPos + messageObject.width)) {
            if (messageObject.activeEventListener) {
                update();
                //message skal fjernes, så gjør om til false
                //dice object skal kunne brukes igjen, så sett til true
                messageObject.activeEventlistener = false;
                diceObject.activeEventListener = true;
                messageObject.trapFunction(player1);    
                canvas.addEventListener("click",canvasEventListener);
            }
        }
    }
    else {
        console.log("mousePosition() fant ingenting");
        canvas.addEventListener("click",canvasEventListener);
    }
}

function canvasMessage(info) {
    messageObject.activeEventListener = true;
    drawObject(200,125,400,190,"tomato");
    let sentences = info.split("\n");
    let i;
    for (i = 0;i<sentences.length;i++) {
        ctx.font = "18px Helvetica";
        ctx.fillStyle = "black";
        ctx.textAlign = "center";
        ctx.textBaseline = "hanging";
        ctx.fillText(sentences[i],400,(150+(30*i)));
    }
    //tegn knapp
    drawObject(350,170+(30*i),100,30,"green");
}